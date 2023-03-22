-- INDICES ON TRANSACTIONS TABLE

CREATE UNIQUE INDEX "INDEX_TRANSACTIONS_ID" ON "TRANSACTIONS" (
	"ID"
);

CREATE INDEX "INDEX_DATE" ON "TRANSACTIONS" (
	"DATE"
);

CREATE INDEX "INDEX_DEBIT" ON "TRANSACTIONS" (
	"DEBIT"
);

CREATE INDEX "INDEX_CREDIT" ON "TRANSACTIONS" (
	"CREDIT"
);

-- INDEX ON ACCOUNTS TABLE

CREATE UNIQUE INDEX "INDEX_ACCOUNT_ID" ON "ACCOUNTS" (
	"ID"
);

-- INDEX ON CURRENCY TABLE

CREATE UNIQUE INDEX "INDEX_CURRENCY_KEY" ON "CURRENCIES" (
	"KEY"
);

