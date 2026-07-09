@echo off
set "PATH=C:\Users\norad\AppData\Roaming\fnm\node-versions\v22.23.1\installation;%PATH%"
cd /d "%~dp0.."
call npm run dev -- --port %PORT% --strictPort
