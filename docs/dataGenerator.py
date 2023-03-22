import sqlite3
import os.path
import uuid
import random
import time

start = time.time()

def getPath():
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(BASE_DIR, "TrackITv6.db")

db = sqlite3.connect(getPath())
cursor = db.cursor()

def main():
    EXPENSES = []
    INCOME = []
    ACCOUNTS = []
    INVESTMENTS = []
    LIABILITIES = []
    N = 3600

    dates = []

    for i in range(2020,2030):
        dates.append({
            "str":f"{i}-04-01T00:00:00.000",
            "end": f"{i}-04-30T23:59:59.000"
            })
        dates.append({
            "str":f"{i}-05-01T00:00:00.000",
            "end":f"{i}-05-31T23:59:59.000"
        })
        dates.append({
            "str":f"{i}-06-01T00:00:00.000",
            "end":f"{i}-06-30T23:59:59.000"
        })
        dates.append({
            "str":f"{i}-07-01T00:00:00.000",
            "end":f"{i}-07-31T23:59:59.000"
        })
        dates.append({
            "str":f"{i}-08-01T00:00:00.000",
            "end":f"{i}-08-31T23:59:59.000"
        })
        dates.append({
            "str":f"{i}-09-01T00:00:00.000",
            "end":f"{i}-09-30T23:59:59.000"
        })
        dates.append({
            "str":f"{i}-10-01T00:00:00.000",
            "end":f"{i}-10-31T23:59:59.000"
        })
        dates.append({
            "str":f"{i}-11-01T00:00:00.000",
            "end":f"{i}-11-30T23:59:59.000"
        })
        dates.append({
            "str":f"{i}-12-01T00:00:00.000",
            "end":f"{i}-12-31T23:59:59.000"
        })
        dates.append({
            "str":f"{i+1}-01-01T00:00:00.000",
            "end":f"{i+1}-01-31T23:59:59.000"
        })
        dates.append({
            "str":f"{i+1}-02-01T00:00:00.000",
            "end":f"{i+1}-02-28T23:59:59.000"
        })
        dates.append({
            "str":f"{i+1}-03-01T00:00:00.000",
            "end":f"{i+1}-03-31T23:59:59.000"
        })


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

    def getInvestment():
        return INVESTMENTS[random.randint(0, len(INVESTMENTS) - 1)]

    def getLiabilities():
        return LIABILITIES[random.randint(0, len(LIABILITIES) - 1)]




    cursor.execute('SELECT * FROM SUB_ACCOUNTS_EXPENSE')
    for rows in cursor.fetchall():
        EXPENSES.append({"name": rows[1],"id":rows[0]})

    cursor.execute('SELECT * FROM SUB_ACCOUNTS_MAIN WHERE NUMBER BETWEEN 101000 and 104000')
    for rows in cursor.fetchall():
        ACCOUNTS.append({"name": rows[1],"id":rows[0]})

    cursor.execute('SELECT * FROM SUB_ACCOUNTS_INCOME')
    for rows in cursor.fetchall():
        INCOME.append({"name": rows[1],"id":rows[0]})

    cursor.execute('SELECT * FROM SUB_ACCOUNTS_MAIN WHERE NUMBER % 104000 < 1000 ')
    for rows in cursor.fetchall():
        INVESTMENTS.append({"name": rows[1],"id":rows[0]})

    cursor.execute('SELECT * FROM SUB_ACCOUNTS_MAIN WHERE NUMBER > 202000 ')
    for rows in cursor.fetchall():
        LIABILITIES.append({"name": rows[1],"id":rows[0]})



    count = 0
    check = (120)/dates.__len__()
    # INCOME
    for i in range(120):
        income = getIncome()
        incomeID = income["id"]
        account = getAccount()["id"]
        description = income["name"]
        id=getUUID()
        type="INCOME"
        curr_loc='INR'
        date = getRandomDate(dates[count]["str"],dates[count]["end"])
        amount = random.randint(25000, 100000)
        cursor.execute(
            f"insert into TRANSACTIONS (ID,DATE,DESCRIPTION,DEBIT,CREDIT,TYPE,AMOUNT_LOC,CURR_LOC,AMOUNT,NOTES) VALUES ('{id}','{date}','{description}','{account}','{incomeID}','{type}','{amount}','{curr_loc}','{amount}','')"
        )
        if (i+1) % check == 0:
            count = count+1
            
    db.commit()
    print("Income Done")
    # INVESTMENT
    count=0
    for i in range(N//3):
        investment = getInvestment()
        investmentID = investment["id"]
        account = getAccount()["id"]
        description = investment["name"]
        id=getUUID()
        type="MAIN"
        curr_loc='INR'
        date = getRandomDate(dates[count]["str"],dates[count]["end"])
        amount = random.randint(1000, 20000)
        cursor.execute(
            f"insert into TRANSACTIONS (ID,DATE,DESCRIPTION,CREDIT,DEBIT,TYPE,AMOUNT_LOC,CURR_LOC,AMOUNT,NOTES) VALUES ('{id}','{date}','{description}','{account}','{investmentID}','{type}','{amount}','{curr_loc}','{amount}','{description}')"
        )
        if (i+1) % check == 0:
            count = count+1
            


    db.commit()
    print("Investments done")
    # LIABILITIES
    count=0
    for i in range(N//3):
        liabilities = getLiabilities()
        liabilitiesID = liabilities["id"]
        account = getAccount()["id"]
        description = liabilities["name"]
        id=getUUID()
        type="MAIN"
        curr_loc='INR'
        date = getRandomDate(dates[count]["str"],dates[count]["end"])
        amount = random.randint(1000, 10000)
        cursor.execute(
            f"insert into TRANSACTIONS (ID,DATE,DESCRIPTION,DEBIT,CREDIT,TYPE,AMOUNT_LOC,CURR_LOC,AMOUNT,NOTES) VALUES ('{id}','{date}','{description}','{account}','{liabilitiesID}','{type}','{amount}','{curr_loc}','{amount}','{description}')"
        )
        if (i+1) % check == 0:
            count = count+1
            

    count = 0
    db.commit()
    print("Liabilities done")
    check = N/dates.__len__()
    
    # EXPENSE
    for i in range(N):
        expense = getExpense()
        expenseID = expense["id"]
        account = getAccount()["id"]
        description = expense["name"]
        id=getUUID()
        type="EXPENSE"
        curr_loc='INR'
        date = getRandomDate(dates[count]["str"],dates[count]["end"])
        amount = random.randint(10, 10000)
        cursor.execute(
            f"insert into TRANSACTIONS (ID,DATE,DESCRIPTION,DEBIT,CREDIT,TYPE,AMOUNT_LOC,CURR_LOC,AMOUNT,NOTES) VALUES ('{id}','{date}','{description}','{expenseID}','{account}','{type}','{amount}','{curr_loc}','{amount}','')"
        )
        if (i+1) % check == 0:
            count = count+1
            

    db.commit()
    print('Expenses Done')



try: 
    main()
except KeyboardInterrupt:
    print("Exception,Closing DB")
finally:
    print("Done,Closing DB")
    db.close()
    print(time.time()-start)



