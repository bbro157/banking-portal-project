from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from db import get_connection
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from datetime import datetime, timedelta

app = FastAPI()

SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"

security = HTTPBearer()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TransferRequest(BaseModel):
    from_account_id: int
    to_account_id: int
    amount: float


class RegisterRequest(BaseModel):
    username: str
    password: str
    full_name: str


class LoginRequest(BaseModel):
    username: str
    password: str


def create_token(user_id: int, username: str):
    payload = {
        "user_id": user_id,
        "sub": username,
        "exp": datetime.utcnow() + timedelta(hours=1),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        return user_id

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@app.get("/")
def root():
    return {"message": "Secure Banking API is running"}


@app.post("/login")
def login_user(data: LoginRequest):
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT id, username, full_name, is_admin
            FROM users
            WHERE username = %s AND password = %s;
        """, (data.username, data.password))

        user = cur.fetchone()

        if not user:
            raise HTTPException(status_code=401, detail="Invalid username or password")

        token = create_token(user[0], user[1])

        return {
            "id": user[0],
            "username": user[1],
            "full_name": user[2],
            "is_admin": user[3],
            "access_token": token,
        }

    finally:
        cur.close()
        conn.close()


@app.get("/accounts/{user_id}")
def get_accounts(user_id: int, current_user_id: int = Depends(get_current_user_id)):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="You cannot view another user's accounts")

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT id, account_type, balance, account_number
        FROM accounts
        WHERE user_id = %s;
    """, (user_id,))

    accounts = cur.fetchall()

    cur.close()
    conn.close()

    return accounts


@app.get("/admin/users-accounts")
def get_all_users_accounts(current_user_id: int = Depends(get_current_user_id)):
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute("SELECT is_admin FROM users WHERE id = %s;", (current_user_id,))
        user = cur.fetchone()

        if not user or not user[0]:
            raise HTTPException(status_code=403, detail="Admin access required")

        cur.execute("""
            SELECT 
                u.id AS user_id,
                u.username,
                u.full_name,
                u.is_admin,
                a.id AS account_id,
                a.account_type,
                a.balance,
                a.account_number
            FROM users u
            LEFT JOIN accounts a ON u.id = a.user_id
            ORDER BY u.id, a.id;
        """)

        results = cur.fetchall()
        return results

    finally:
        cur.close()
        conn.close()

@app.get("/transactions/{account_id}")
def get_transactions(account_id: int, current_user_id: int = Depends(get_current_user_id)):
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT id
            FROM accounts
            WHERE id = %s AND user_id = %s;
        """, (account_id, current_user_id))

        owned_account = cur.fetchone()

        if not owned_account:
            raise HTTPException(status_code=403, detail="You do not own this account")

        cur.execute("""
            SELECT id, from_account_id, to_account_id, amount, transaction_type, created_at
            FROM transactions
            WHERE from_account_id = %s OR to_account_id = %s
            ORDER BY created_at DESC;
        """, (account_id, account_id))

        transactions = cur.fetchall()
        return transactions

    finally:
        cur.close()
        conn.close()


@app.post("/transfer")
def transfer_money(
    data: TransferRequest,
    current_user_id: int = Depends(get_current_user_id)
):
    conn = get_connection()
    cur = conn.cursor()

    try:
        if data.amount <= 0:
            raise HTTPException(status_code=400, detail="Amount must be greater than 0")

        cur.execute("""
            SELECT balance
            FROM accounts
            WHERE id = %s AND user_id = %s;
        """, (data.from_account_id, current_user_id))

        from_result = cur.fetchone()

        if not from_result:
            raise HTTPException(status_code=403, detail="You do not own this account")

        cur.execute("""
            SELECT balance
            FROM accounts
            WHERE id = %s;
        """, (data.to_account_id,))

        to_result = cur.fetchone()

        if not to_result:
            raise HTTPException(status_code=404, detail="To account not found")

        from_balance = from_result[0]

        if from_balance < data.amount:
            raise HTTPException(status_code=400, detail="Insufficient funds")

        cur.execute("""
            UPDATE accounts
            SET balance = balance - %s
            WHERE id = %s;
        """, (data.amount, data.from_account_id))

        cur.execute("""
            UPDATE accounts
            SET balance = balance + %s
            WHERE id = %s;
        """, (data.amount, data.to_account_id))

        cur.execute("""
            INSERT INTO transactions (from_account_id, to_account_id, amount, transaction_type, created_at)
            VALUES (%s, %s, %s, 'transfer', CURRENT_TIMESTAMP);
        """, (data.from_account_id, data.to_account_id, data.amount))

        conn.commit()

        return {"message": "Transfer successful"}

    except HTTPException:
        conn.rollback()
        raise

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        cur.close()
        conn.close()