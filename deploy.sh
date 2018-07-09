#!/bin/bash
if [ ! -n "$1" ] ;then
    module=account-factory
else
    module=$1
fi
echo "starting module - $module ..."
# stop all node app
echo "pm2 stop pm2-$module.json"
pm2 stop pm2-$module.json
echo "rm -rf log/$module"
rm -rf log/$module
echo "mkdir log/$module"
mkdir log/$module
# start all node apps in development mode
echo "pm2 start pm2-$module.json"
pm2 start pm2-$module.json --env debug