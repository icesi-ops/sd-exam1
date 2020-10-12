#!/bin/bash
sudo apt-get update
sudo apt-get install -y nodejs
sudo apt-get install -y npm
variable=$(hostname)
sudo npm install -g express
cd /home/
mkdir webserver
sudo npm install express
sudo npm install mongoose



