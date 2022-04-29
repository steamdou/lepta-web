set AWS_PROFILE=bandup
call run-tsc.bat
call yarn build
call serverless
