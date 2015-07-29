#!/bin/bash

set -e

gem which bundler >/dev/null 2>&1 || (echo "Installing bundler"; gem install bundler)

export NOKOGIRI_USE_SYSTEM_LIBRARIES=1
bundle check > /dev/null || bundle install --path vendor/bundle --binstubs --clean

echo "Done."
