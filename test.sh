#!/bin/bash

set -e
echo "Waiting for DB Initialization, check again shortly"
sleep 30

echo "Starting to test the endpoints"
/usr/local/bin/npm test 

echo "Finished tests"
exec "/bin/sh"