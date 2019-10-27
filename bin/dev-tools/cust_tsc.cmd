@ECHO OFF

SET tsc="%~dp0..\..\node_modules\.bin\tsc"

%tsc% %*

IF NOT EXIST .\resources\ (
  xcopy .\resources\ .\dist\ /E
)
