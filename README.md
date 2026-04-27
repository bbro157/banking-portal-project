# Banking Portal Project

A banking backend project with both **insecure** and **secure** implementations, along with example exploits for security testing.

Tested on Windows with Python 3.10+ and PostgreSQL.

---

## Project Structure

- insecure/ – intentionally vulnerable backend
- secure/ – improved, more secure backend
- exploits/ – scripts demonstrating vulnerabilities

---

## Requirements

- Python 3.10+
- PostgreSQL (running locally)
- pip

---

## Setup

### 1. Get the project

Clone the repository or download it as a ZIP.

```bash
git clone https://github.com/bbro157/banking-portal-project.git
cd banking-portal-project
```

---

### 2. Set up Python environment (run in project root)

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

---

### 3. Set up the PostgreSQL database

Open a terminal and start PostgreSQL:

```bash
psql -U postgres
```

Then run:

```sql
CREATE DATABASE banking_portal;
\c banking_portal
```

---

### 4. Load schema and seed data

Run the SQL files:

```sql
\i schema.sql
\i seed.sql
```

If these commands fail, use full file paths:

```sql
\i 'C:/full/path/to/schema.sql'
\i 'C:/full/path/to/seed.sql'
```

---

### 5. Configure database connection

Open `db.py` in the backend you want to run (either `insecure/` or `secure/`).

By default it uses:

```python
password = "password"
```

Change this to match your PostgreSQL password.

---

### 6. Run the backend

Navigate to the backend you want:

```bash
cd insecure
```

or

```bash
cd secure
```

Then start the server:

```bash
uvicorn main:app --reload
```

---

### 7. Test the API

Open your browser and go to:

```
http://127.0.0.1:8000/
```

You should see a message indicating the API is running.

---

## Useful PostgreSQL Commands

Inside psql:

```sql
\l                  -- list databases
\c banking_portal   -- connect to your database
\dt                 -- list tables
SELECT * FROM users;
SELECT * FROM accounts;
```
