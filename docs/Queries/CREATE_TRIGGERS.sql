-- TRANSACTIONS TABLE TRIGGER

-- AFTER DELETE
CREATE TRIGGER DELETE_TX_TRIGGER
AFTER DELETE ON TRANSACTIONS
BEGIN
	SELECT * FROM BALANCE_VIEW;
END;

-- AFTER INSERT
CREATE TRIGGER INSERT_TX_TRIGGER
AFTER INSERT ON TRANSACTIONS
BEGIN
	SELECT * FROM BALANCE_VIEW;
END;

-- AFTER UPDATE
CREATE TRIGGER UPDATE_TX_TRIGGER
UPDATE OF AMOUNT,DEBIT,CREDIT ON TRANSACTIONS
BEGIN
	SELECT * FROM BALANCE_VIEW;
END;

-- AFTER DELETE
CREATE TRIGGER DELETE_ACCOUNT_TRIGGER
AFTER DELETE ON ACCOUNTS
BEGIN
	SELECT * FROM BALANCE_VIEW;
END;

-- AFTER INSERT
CREATE TRIGGER INSERT_ACCOUNT_TRIGGER
AFTER INSERT ON ACCOUNTS
BEGIN
	SELECT * FROM BALANCE_VIEW;
END;

-- AFTER UPDATE
CREATE TRIGGER UPDATE_ACCOUNT_TRIGGER
UPDATE OF ID,PARENT_ID ON ACCOUNTS
BEGIN
	SELECT * FROM BALANCE_VIEW;
END;
