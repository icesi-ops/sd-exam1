#!/bin/bash

if [[ "$(hostname)" = "web-1" ]]
then
    sudo IPADRESS=192.168.33.11 forever start main.js
else
    sudo IPADRESS=192.168.33.12 forever start main.js
fi