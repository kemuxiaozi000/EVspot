#!/bin/bash
# Script used to deploy applications to AWS Elastic Beanstalk
# Should be hooked to CircleCI post.test or deploy step
#
# Does three things:
# 1. Builds Docker image & pushes it to container registry
# 2. Generates new `Dockerrun.aws.json` file which is Beanstalk task definition
# 3. Creates new Beanstalk Application version using created task definition
#
# REQUIREMENTS!
# - AWS_ACCOUNT_ID env variable
# - AWS_ACCESS_KEY_ID env variable
# - AWS_SECRET_ACCESS_KEY env variable
# - APPLICATION_NAME env variable
# - ENVIRONMENT env variable

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

if [ -z "${ENVIRONMENT}" ]; then
  echo "ENVIRONMENT was not provided, aborting deploy!"
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

if [ -z "${AWS_ACCESS_KEY_ID}" ]; then
  echo "AWS_ACCESS_KEY_ID was not provided, aborting deploy!"
  exit 1
fi

if [ -z "${AWS_SECRET_ACCESS_KEY}" ]; then
  echo "AWS_SECRET_ACCESS_KEY was not provided, aborting deploy!"
  exit 1
fi

# Hash of commit for better identification
if [ "$(uname)" == 'Darwin' ]; then
  SHA1="$(echo ${start} | md5 | sed 's/[- \t]*$//')"
  AWS_ACCOUNT_HASH=$(echo ${AWS_ACCOUNT_ID} | md5 | sed 's/[- \t]*$//')
else
  SHA1="$(echo ${start} | md5sum | sed 's/[- \t]*$//')"
  AWS_ACCOUNT_HASH=$(echo ${AWS_ACCOUNT_ID} | md5sum | sed 's/[- \t]*$//')
fi

EB_BUCKET=${APPLICATION_NAME}-app-deployments-${ENVIRONMENT}-${AWS_ACCOUNT_HASH}
ENV=${APPLICATION_NAME}-${ENVIRONMENT}
VERSION=${ENVIRONMENT}-${SHA1}-$(date +%s)
ZIP=${VERSION}.zip

echo Deploying ${APPLICATION_NAME} to environment ${ENVIRONMENT}, region: ${REGION}, version: ${VERSION}, bucket: ${EB_BUCKET:0:63}

aws configure set default.region ${REGION}
aws configure set default.output json

echo Login to AWS Elastic Container Registry
eval $(aws ecr get-login | sed 's|https://||' | sed 's|-e none||')

echo "Build the image"
docker build -t ${APPLICATION_NAME}:${VERSION} ${script_dir}/../../

echo "Tag it"
docker tag ${APPLICATION_NAME}:${VERSION} ${AWS_ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${APPLICATION_NAME}:${VERSION}
echo "Push to AWS Elastic Container Registry"
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${APPLICATION_NAME}:${VERSION}

# Replace the <AWS_ACCOUNT_ID> with your ID
cp Dockerrun.aws.json.template Dockerrun.aws.json
sed -i -e "s/<AWS_ACCOUNT_ID>/${AWS_ACCOUNT_ID}/g" Dockerrun.aws.json
# Replace the <NAME> with the your name
sed -i -e "s/<NAME>/${APPLICATION_NAME}/" Dockerrun.aws.json
# Replace the <REGION> with the selected region
sed -i -e "s/<REGION>/${REGION}/" Dockerrun.aws.json
# Replace the <TAG> with the your version number
sed -i -e "s/<VERSION>/${VERSION}/" Dockerrun.aws.json

echo "Zip up the Dockerrun file"
zip -r ${ZIP} Dockerrun.aws.json .ebextensions

echo "Send zip to S3 Bucket"
aws s3 cp ${ZIP} s3://${EB_BUCKET:0:63}/${ZIP}

echo "Create a new application version with the zipped up Dockerrun file"
aws elasticbeanstalk create-application-version --application-name ${APPLICATION_NAME} --version-label ${VERSION} --source-bundle S3Bucket=${EB_BUCKET:0:63},S3Key=${ZIP}

echo "Update the environment to use the new application version"
aws elasticbeanstalk update-environment --environment-name ${ENV} --version-label ${VERSION}

end=`date +%s`

\rm ${ZIP}
\rm Dockerrun.aws.json
#\rm Dockerrun.aws.json-e

echo Deploy ended with success! Time elapsed: $((end-start)) seconds

cd $current_directory
