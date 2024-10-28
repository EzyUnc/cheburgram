@echo off
echo Запуск MongoDB...
start "" "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe"

echo Запуск сервера Node.js...
cd /d "C:\Users\dokto\project 1"
start "" "node" app.js
start http://localhost:3000

pause