#!/bin/bash
sudo yum update

#Installing Node.js
#Source: https://github.com/nodesource/distributions
curl -sL https://rpm.nodesource.com/setup_lts.x | sudo bash -
sudo yum install –y nodejs

#Installing node modules
npm i --save express body-parser path mongoose