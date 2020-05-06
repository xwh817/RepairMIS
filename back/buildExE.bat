:: 关掉正在运行的进程
taskkill /f /t /im RepairMIS.exe

:: 先安装pyinstaller -F 生成exe文件，-w 不显示命令行
if exist .\dist\run (rmdir .\dist\run /q/s)
pyinstaller -w run.py

mkdir .\dist\run\front-build
xcopy front-build .\dist\run\front-build /s /e /y

copy repair_manager.db .\dist\run\

cd dist\run
::move ..\run.exe RepairMIS.exe
rename run.exe RepairMIS.exe
mkdir excel

cd ..
mkdir temp
move run temp\
copy *.bat temp\

rename temp 订单管理系统

pause