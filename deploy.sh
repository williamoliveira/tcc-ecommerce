#! /bin/bash

# Exit on any error
set -e

ssh memult@memult.com.br\
 'cd /home/memult/sources/tcc/ecommerce-csr/\
 && git reset --hard\
 && git pull origin master\
 && yarn install\
 && yarn build\
 && pm2 restart tcc-ecommerce-csr\
 && cd /home/memult/sources/tcc/ecommerce-ssr-csr/\
 && git reset --hard\
 && git pull origin master\
 && yarn install\
 && yarn build\
 && pm2 restart tcc-ecommerce-ssr-csr\
 && cd /home/memult/sources/tcc/ecommerce-ssr-csr-cs/\
 && git reset --hard\
 && git pull origin master\
 && yarn install\
 && yarn build\
 && pm2 restart tcc-ecommerce-ssr-csr-cs\
 && cd /home/memult/sources/tcc/ecommerce-csr-cs/\
 && git reset --hard\
 && git pull origin master\
 && yarn install\
 && yarn build\
 && pm2 restart tcc-ecommerce-csr-cs'
