#!/bin/bash

if [[ "$(hostname)" = "db" ]]
then
    sudo IPADDRESS=192.168.33.100 forever start db.js
fi