::SHORTCUT "E:\React\RepairMIS\back\dist\run\RepairMIS.exe" "~$folder.desktop$" "快捷方式"

set pa=%cd%
echo %pa%

set lnkName="订单管理.lnk"
set WorkPath='%pa%\run'
set TARGET='%pa%\run\RepairMIS.exe'
set SHORTCUT='%lnkName%'
set PWS=powershell.exe -ExecutionPolicy Bypass -NoLogo -NonInteractive -NoProfile

%PWS% -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut(%SHORTCUT%); $S.WorkingDirectory = %WorkPath%; $S.TargetPath = %TARGET%; $S.Save()"



set d=%USERPROFILE%\desktop\
echo %d%

copy %lnkName% %d%


pause