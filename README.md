# Banking Portal Project

A banking backend and front end project with both **insecure** and **secure** implementations, along with example exploits for security testing.

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

(Warning: these below are just example you will need to use the file path to where you downloaded the backend. Note that there are different versions 
of the sql seed and schema, for the secure and insecure backends)
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

# Frontend Setup

## Requirements
- Node.js (v16 or higher recommended)
- npm

## Setup Instructions

1. Navigate to the frontend folder:
   (Below is just an example you will need full file path)
   cd banking-portal-frontend

3. Install dependencies:
   npm install

4. Start the development server:
   npm run dev

5. Open your browser and go to:
   http://localhost:5173



**Warning:**
Make sure when switching between the insecure and secure versions, you use the relevant seed and schema that is in the backend, you will need to delete the database in between and remake it, and then run the relevent starting insecure seed and schema or secure seed and schema depending on which backend you are running


## Useful PostgreSQL Commands

Inside psql:

```sql
\l                  -- list databases
\c banking_portal   -- connect to your database
\dt                 -- list tables
SELECT * FROM users;
SELECT * FROM accounts;
```
