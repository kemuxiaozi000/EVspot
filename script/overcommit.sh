#!/bin/bash

STEP=1

echo_step() {
  echo -e "\\e[48;5;154m\\e[38;5;0m   ${STEP}   \\e[0m ${1}"
  (( STEP=STEP+1 ))
}

echo_err() {
  echo -e "\\e[48;5;201m\\e[38;5;0m  error  \\e[0m ${1}"
}

command_exists() {
  if hash "${1}" 2>/dev/null; then
    return 0
  else
    return 1
  fi
}


if command_exists overcommit; then
  echo "Overcommit already installed :)"
else 
  echo_step "Overcommit not installed, installing..."
  if command_exists gem; then
    gem install overcommit
    gem install rubocop
    gem install rails_best_practices
    npm install -g eslint
  else
    echo_err "Gem not installed, aborting..."
    exit 1
  fi
fi

echo_step "Initialize Overcommit hooks..."
overcommit --install

echo_step "Running pre-commit hooks..."
overcommit --run

echo_step "Uninstall Overcommit hooks..."
overcommit --uninstall

