#!/bin/bash
# Script used to provision infrastructures including AWS Elastic Beanstalk
#
# THIS IS A DEVELOPMENT PURPOSE SCRIPT AND SHOULD NOT BE USED IN PRODUCTION
#
# REQUIREMENTS!
# - APPLICATION_NAME env variable
# - AWS_ACCOUNT_ID env variable
# - AWS_ACCESS_KEY_ID env variable
# - AWS_SECRET_ACCESS_KEY env variable
# - APPLICATION_NAME env variable
# - ENVIRONMENT env variable
# - REGION env variable
#
# usage: ./destroy.sh

set -e
start=`date +%s`

# Filepath
current_directory=`pwd`

script_dir=$(cd $(dirname $0); pwd)
cd $script_dir

# Load Environment Variables
echo "Loading '.env' environment variables"
if [ -e .env ]; then
  for f in `cat .env`
  do
    export $f
  done
fi

if [ -z "${APPLICATION_NAME}" ]; then
  echo "APPLICATION_NAME was not provided, aborting deploy!"
  exit 1
fi

if [ -z "${REGION}" ]; then
  echo "REGION was not provided, aborting deploy!"
  exit 1
fi

if [ -z "${AWS_ACCOUNT_ID}" ]; then
  echo "AWS_ACCOUNT_ID was not provided, aborting deploy!"
  exit 1
fi

if [ -z "${SECRET_KEY_BASE}" ]; then
  echo "SECRET_KEY_BASE was not provided, aborting deploy!"
  exit 1
fi

if [ -z "${LOADBALANCER_CERTIFICATE_ARN}" ]; then
  LOADBALANCER_CERTIFICATE_ARN="arn:aws:acm:ap-northeast-1:072176254947:certificate/52b508c2-9c37-4c56-b977-3dba138febe0"
fi

# Generate terraform.tfvars file
echo "Generate terraform.tfvars file from environment variables"
if [ "$(uname)" = 'Darwin' ]; then
  AWS_ACCOUNT_HASH=$(echo ${AWS_ACCOUNT_ID} | md5)
else
  AWS_ACCOUNT_HASH=$(echo ${AWS_ACCOUNT_ID} | md5sum | awk '{ print $1 }')
fi

# Replace the <VARIABLE> with your environement variables
cp terraform.tfvars.template terraform.tfvars
sed -i -e "s#<APP_NAME>#${APPLICATION_NAME}#g" terraform.tfvars
sed -i -e "s#<AWS_ACCOUNT_ID>#${AWS_ACCOUNT_HASH}#g" terraform.tfvars
sed -i -e "s#<SECRET_KEY_BASE>#${SECRET_KEY_BASE}#g" terraform.tfvars
sed -i -e "s#<LOADBALANCER_CERTIFICATE_ARN>#${LOADBALANCER_CERTIFICATE_ARN}#g" terraform.tfvars

terraform init
terraform apply .

cd $current_directory
