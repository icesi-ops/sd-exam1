#!/bin/bash

# Wait until CouchDB is up and running
until curl -s http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@localhost:5984; do
    sleep 10
done

# Create the specified database
curl -X PUT http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@localhost:5984/${COUCHDB_DATABASE}
