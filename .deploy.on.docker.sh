#!/bin/bash

set -x

rsync -avz --exclude vendor/ --exclude .git /site/ /build
cd /build
rake build && rake deploy
