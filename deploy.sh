#! /bin/bash

# Exit on any error
set -e

ssh memult@memult.com.br\
 'cd /home/memult/sources/memult-front/\
 && git reset --hard\
 && git pull origin master\
 && yarn install\
 && yarn build\
 && pm2 restart front'
