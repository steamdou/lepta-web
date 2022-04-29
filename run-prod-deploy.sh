export AWS_PROFILE=bandup
set -e
sh run-tsc.sh
yarn build
serverless