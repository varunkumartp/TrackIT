CREATE VIEW ACCOUNTS_MAIN 
as 
select * 
from ACCOUNTS 
where PARENT_ID in (
	select id 
	from ACCOUNTS 
	where NUMBER = 100000 
	or NUMBER = 200000
)