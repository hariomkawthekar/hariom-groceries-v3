@echo off
echo Starting MySQL Server for Hariom Groceries...
"C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe" --datadir="%~dp0mysql-data" --console
pause
