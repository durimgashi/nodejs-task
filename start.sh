#!/bin/bash

set -e
echo "Waiting for DB Initialization, check again shortly"
sleep 30
echo "Starting the application with PM2"

pm2 start app.js && pm2 logs

echo "Finish start of PM2"
exec "/bin/sh"