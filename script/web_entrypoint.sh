#!/bin/bash
date +%Y%m%d%H%I%s
yarn install --pure-lockfile
if [ "${RAILS_ENV}" = "production" ]; then
  rake assets:precompile
fi
if [ -f "/tmp/unicorn.pid" ]; then
  rm /tmp/unicorn.pid
fi
bundle exec unicorn -c config/unicorn.rb -E $RAILS_ENV -l 3000
