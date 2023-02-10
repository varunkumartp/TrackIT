CREATE VIEW ACCOUNTS_EXPENSE 
as 
select * 
from ACCOUNTS 
where PARENT_ID in (
	select id 
	from ACCOUNTS 
	where NUMBER = 500000
)