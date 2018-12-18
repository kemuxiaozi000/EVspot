#!/bin/bash

# S3C script for lazy local environment startup with docker-compose and Rails migrations
#
# Usage: bash ./script/start_local.sh ${BRANCH_NAME} [--no-pull]

APP_NAME=${PWD##*/}
CONTAINER_COUNT=2
BRANCH=$1
PULL=$2

STEP=1
START=$(date +%s)

echo_step() {
  echo -e "\\e[48;5;154m\\e[38;5;0m   ${STEP}   \\e[0m ${1}"
  (( STEP=STEP+1 ))
}

echo_err() {
  echo -e "\\e[48;5;201m\\e[38;5;0m  error  \\e[0m ${1}"
}

# Load Environment Variables
echo_step "Loading '.env' environment variables"
if [ -e .env ]; then
  for f in `cat .env`
  do
    export $f
  done
fi

if [ -z "${BRANCH}" ]; then
  echo_err "Target git branch was not provided!"
  echo "Usage: ${0} BRANCH_NAME"
  exit 1
fi

if  [ -z "${PULL}" ]; then
 echo_step "Retrieve source code latest version for ${BRANCH} branch."

  git fetch --all --prune
  git checkout "${BRANCH}"

  RES=$?

  if [ ${RES:=1} -ne 0 ]; then
    echo_err "Could not checkout branch '${BRANCH}', does it exist?"
    exit 1
  fi

  git pull
fi

echo_step "Build ${APP_NAME} docker images."

docker-compose -f ./docker-compose.yml build

RES=$?

if [ ${RES:=1} -ne 0 ]; then
  echo_err "Docker image build failed."
  exit 1
fi

echo_step "Start ${APP_NAME} containers."

docker-compose -f ./docker-compose.yml up -d

sleep 5

UP_COUNT=$(docker ps --format "{{.Names}} {{.Status}}" | grep -c "${APP_NAME}")
if [ "${UP_COUNT:=0}" -ne "${CONTAINER_COUNT}" ]; then
  echo_err "Running container count expected is ${CONTAINER_COUNT}, actual count is ${UP_COUNT:=0}"
  docker-compose -f ./docker-compose.yml logs
  exit 1
fi

# echo_step "Compile 'web' assets."
#
# docker exec -t ${APP_NAME}_web_1 sh -c "rake assets:clobber"
# docker exec -t ${APP_NAME}_web_1 sh -c "rake assets:precompile"

# echo_step "Restart 'web' container."
#
# docker-compose -f ./docker-compose.yml stop web
# docker-compose -f ./docker-compose.yml start web

if [ -f "./script/initdb.sh" ]; then

echo_step "Initialize Database."

chmod 755 ./script/initdb.sh
docker exec -ti "${APP_NAME}_web_1" sh -c "sh ./script/initdb.sh"

fi

FINISH=$(date +%s)
TIME=$((FINISH-START))
echo "Completed in ${TIME} seconds."
