#!/bin/bash
# Script used to create a new environment for the application running on elasticbeanstalk
#
#
# REQUIREMENTS!
# usage: ./create_env.sh <ENV_NAME>

set -e

# Filepath
current_directory=`pwd`

script_dir=$(cd $(dirname $0); pwd)
cd $script_dir

# Load Environment Parameter (and force lower case)
ENV=`echo $1 | tr '[:upper:]' '[:lower:]'`
export ENVIRONMENT=$ENV

if [ -z "${ENVIRONMENT}" ]; then
  echo "ENVIRONMENT was not provided, aborting deploy!"
  exit 1
fi

# Generate aws_elasticbeanstalk_<ENV_NAME>.tf file
cp aws_elasticbeanstalk.tf.template aws_elasticbeanstalk_${ENVIRONMENT}.tf

sed -i -e "s#<ENVIRONMENT>#${ENVIRONMENT}#g" aws_elasticbeanstalk_${ENVIRONMENT}.tf

cd $current_directory
