# TrackIT

An **offline first Android App** to track finances. Built using React Native which uses SQLite as the offline database

This app is created based on the principle of **Double Entry Accounting**.

## Double Entry Accounting

Double entry, a fundamental concept underlying present-day bookkeeping and accounting, states that every financial transaction has equal and opposite effects in at least two different accounts. It is used to satisfy the accounting equation:

$$ Assets = Liabilities + Equity​ $$

The extended version of this equation can be written as

$$ Assets + Expenses = Liabilities + Equity​ + Income $$

With a double entry system, credits are offset by debits in a general ledger or T-account.

## Journal Entry

The Journal, also called the Book of Primary Entry, is the first record of any transaction in a business. The information in these simple Journal Entries is then transferred to the other books of accounts.

A Journal Entry must follow a set of rules.

1.  There must be a minimum of two accounts in the transaction.
2.  Both debit and credit values should be equal.

The following table shows a generic structure of a Journal Entry

| Date               | Transaction                                                    | Dr (Rs) | Cr (Rs) |
| ------------------ | -------------------------------------------------------------- | ------- | ------- |
| 25th November 2022 | Rent A/c                                                       | 5000    |         |
|                    | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Cash A/c |         | 5000    |
|                    | Rent paid in cash                                              |         |         |
|                    |                                                                |         |         |

All the transactions recorded in the app will be stored similar to a Journal Entry

## Features of App
1. Seperate Forms to create and edit Income, Expense and Journal Entry
2. View Account balances and previous 6 months income and expense stats
3. Generate Income Statement and Balance Sheets on Periodic, Annual and Fiscal Year basis
