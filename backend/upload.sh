#!/bin/bash

cp $1 .
path=$1
s="/tmp/"
name="${path/${s}/}"
rename=$2
mv $name $rename
echo "put $rename" | smbclient //172.18.0.2/public/ -U underbedmonster%password1
rm $rename