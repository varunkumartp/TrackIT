import sqlite3
import os.path
import uuid
import random
import datetime
import time


EXPENSES = []
INCOME = []
ACCOUNTS = []
N = 1080
dates = [
    {
        "str":"2022-04-01T00:00:00.000",
        "end":"2022-04-30T23:59:59.000"
    },
    {
        "str":"2022-05-01T00:00:00.000",
        "end":"2022-05-31T23:59:59.000"
    },
    {
        "str":"2022-06-01T00:00:00.000",
        "end":"2022-06-30T23:59:59.000"
    },
    {
        "str":"2022-07-01T00:00:00.000",
        "end":"2022-07-31T23:59:59.000"
    },
    {
        "str":"2022-08-01T00:00:00.000",
        "end":"2022-08-31T23:59:59.000"
    },
    {
        "str":"2022-09-01T00:00:00.000",
        "end":"2022-09-30T23:59:59.000"
    },
    {
        "str":"2022-10-01T00:00:00.000",
        "end":"2022-10-31T23:59:59.000"
    },
    {
        "str":"2022-11-01T00:00:00.000",
        "end":"2022-11-30T23:59:59.000"
    },
    {
        "str":"2022-12-01T00:00:00.000",
        "end":"2022-12-31T23:59:59.000"
    },
    {
        "str":"2023-01-01T00:00:00.000",
        "end":"2023-01-31T23:59:59.000"
    },
    {
        "str":"2023-02-01T00:00:00.000",
        "end":"2023-02-28T23:59:59.000"
    },
    {
        "str":"2023-03-01T00:00:00.000",
        "end":"2023-03-31T23:59:59.000"
    },
    {
        "str":"2023-04-01T00:00:00.000",
        "end":"2023-04-30T23:59:59.000"
    },
    {
        "str":"2023-05-01T00:00:00.000",
        "end":"2023-05-31T23:59:59.000"
    },
    {
        "str":"2023-06-01T00:00:00.000",
        "end":"2023-06-30T23:59:59.000"
    },
    {
        "str":"2023-07-01T00:00:00.000",
        "end":"2023-07-31T23:59:59.000"
    },
    {
        "str":"2023-08-01T00:00:00.000",
        "end":"2023-08-31T23:59:59.000"
    },
    {
        "str":"2023-09-01T00:00:00.000",
        "end":"2023-09-30T23:59:59.000"
    },
    {
        "str":"2023-10-01T00:00:00.000",
        "end":"2023-10-31T23:59:59.000"
    },
    {
        "str":"2023-11-01T00:00:00.000",
        "end":"2023-11-30T23:59:59.000"
    },
    {
        "str":"2023-12-01T00:00:00.000",
        "end":"2023-12-31T23:59:59.000"
    },
    {
        "str":"2024-01-01T00:00:00.000",
        "end":"2024-01-31T23:59:59.000"
    },
    {
        "str":"2024-02-01T00:00:00.000",
        "end":"2024-02-29T23:59:59.000"
    },
    {
        "str":"2024-03-01T00:00:00.000",
        "end":"2024-03-31T23:59:59.000"
    },
    {
        "str":"2024-04-01T00:00:00.000",
        "end":"2024-04-30T23:59:59.000"
    },
    {
        "str":"2024-05-01T00:00:00.000",
        "end":"2024-05-31T23:59:59.000"
    },
    {
        "str":"2024-06-01T00:00:00.000",
        "end":"2024-06-30T23:59:59.000"
    },
    {
        "str":"2024-07-01T00:00:00.000",
        "end":"2024-07-31T23:59:59.000"
    },
    {
        "str":"2024-08-01T00:00:00.000",
        "end":"2024-08-31T23:59:59.000"
    },
    {
        "str":"2024-09-01T00:00:00.000",
        "end":"2024-09-30T23:59:59.000"
    },
    {
        "str":"2024-10-01T00:00:00.000",
        "end":"2024-10-31T23:59:59.000"
    },
    {
        "str":"2024-11-01T00:00:00.000",
        "end":"2024-11-30T23:59:59.000"
    },
    {
        "str":"2024-12-01T00:00:00.000",
        "end":"2024-12-31T23:59:59.000"
    },
    {
        "str":"2025-01-01T00:00:00.000",
        "end":"2025-01-31T23:59:59.000"
    },
    {
        "str":"2025-02-01T00:00:00.000",
        "end":"2025-02-28T23:59:59.000"
    },
    {
        "str":"2025-03-01T00:00:00.000",
        "end":"2025-03-31T23:59:59.000"
    },

]

def getPath():
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(BASE_DIR, "TrackIt.db")

def getRandomDate(start,end):
    time_format = "%Y-%m-%dT%H:%M:%S.000"
    stime = time.mktime(time.strptime(start, time_format))
    etime = time.mktime(time.strptime(end, time_format))
    ptime = stime + random.random() * (etime - stime)
    return time.strftime(time_format, time.localtime(ptime))

def getUUID():
    return str(uuid.uuid4())

def getExpense():
    return EXPENSES[random.randint(0, len(EXPENSES) - 1)]

def getIncome():
    return INCOME[random.randint(0, len(INCOME) - 1)]

def getAccount():
    return ACCOUNTS[random.randint(0, len(ACCOUNTS) - 1)]

db = sqlite3.connect(getPath())
cursor = db.cursor()

cursor.execute('SELECT * FROM SUB_ACCOUNTS_EXPENSE')
for rows in cursor.fetchall():
    EXPENSES.append({"name": rows[1],"id":rows[0]})

cursor.execute('SELECT * FROM SUB_ACCOUNTS_MAIN')
for rows in cursor.fetchall():
    ACCOUNTS.append({"name": rows[1],"id":rows[0]})

cursor.execute('SELECT * FROM SUB_ACCOUNTS_INCOME')
for rows in cursor.fetchall():
    INCOME.append({"name": rows[1],"id":rows[0]})

count = 0

for i in range(360):
    income = getIncome()
    incomeID = income["id"]
    account = getAccount()["id"]
    description = income["name"]
    id=getUUID()
    type="INCOME"
    curr_loc='INR'
    date = getRandomDate(dates[count]["str"],dates[count]["end"])
    amount = random.randint(100, 1000)
    cursor.execute(
        f"insert into TRANSACTIONS (ID,DATE,DESCRIPTION,DEBIT,CREDIT,TYPE,AMOUNT_LOC,CURR_LOC,AMOUNT) VALUES ('{id}','{date}','{description}','{account}','{incomeID}','{type}','{amount}','{curr_loc}','{amount}')"
    )
    if (i+1) % 10 == 0:
        count = count+1


count=0
for i in range(360):
    account2 = getAccount()
    account2ID = account2["id"]
    account = getAccount()["id"]
    description = account2["name"]
    id=getUUID()
    type="MAIN"
    curr_loc='INR'
    date = getRandomDate(dates[count]["str"],dates[count]["end"])
    amount = random.randint(100, 1000)
    cursor.execute(
        f"insert into TRANSACTIONS (ID,DATE,DESCRIPTION,DEBIT,CREDIT,TYPE,AMOUNT_LOC,CURR_LOC,AMOUNT) VALUES ('{id}','{date}','{description}','{account}','{account2ID}','{type}','{amount}','{curr_loc}','{amount}')"
    )
    if (i+1) % 10 == 0:
        count = count+1

count = 0

for i in range(N):
    expense = getExpense()
    expenseID = expense["id"]
    account = getAccount()["id"]
    description = expense["name"]
    id=getUUID()
    type="EXPENSE"
    curr_loc='INR'
    date = getRandomDate(dates[count]["str"],dates[count]["end"])
    amount = random.randint(100, 1000)
    cursor.execute(
        f"insert into TRANSACTIONS (ID,DATE,DESCRIPTION,DEBIT,CREDIT,TYPE,AMOUNT_LOC,CURR_LOC,AMOUNT) VALUES ('{id}','{date}','{description}','{expenseID}','{account}','{type}','{amount}','{curr_loc}','{amount}')"
    )
    if (i+1) % 30 == 0:
        count = count+1

db.commit()
db.close()