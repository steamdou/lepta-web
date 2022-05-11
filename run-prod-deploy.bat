set AWS_PROFILE=bandup
call run-tsc.bat
if  errorlevel 1 goto ERROR_TSC

call yarn build
if  errorlevel 1 goto ERROR_BUILD

call serverless
goto SUCCESS

:ERROR_TSC
echo TSC FAILED

:ERROR_BUILD
echo BUILD FAILED

:SUCCESS