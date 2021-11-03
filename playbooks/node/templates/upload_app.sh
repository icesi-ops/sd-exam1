#!/bin/bash

if [[ "$(hostname)" = "web-1" ]]
then
    sudo IPADDRESS=192.168.33.11 SERVERNAME=$(hostname) forever start main.js
else
    sudo IPADDRESS=192.168.33.12 SERVERNAME=$(hostname) forever start main.js
fi