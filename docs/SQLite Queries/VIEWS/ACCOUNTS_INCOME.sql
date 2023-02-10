CREATE VIEW ACCOUNTS_INCOME 
as 
select * 
from ACCOUNTS 
where PARENT_ID in (
	select id 
	from ACCOUNTS 
	where NUMBER = 400000
)