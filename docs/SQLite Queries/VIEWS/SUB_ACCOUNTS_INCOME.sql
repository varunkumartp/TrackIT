CREATE VIEW SUB_ACCOUNTS_INCOME 
AS 
select * 
from ACCOUNTS 
where PARENT_ID in (
	select id 
	from ACCOUNTS_INCOME
)