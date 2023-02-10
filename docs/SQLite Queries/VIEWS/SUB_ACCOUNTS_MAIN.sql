CREATE VIEW SUB_ACCOUNTS_MAIN 
AS 
select * 
from ACCOUNTS 
where PARENT_ID in (
	select id 
	from ACCOUNTS_MAIN
)