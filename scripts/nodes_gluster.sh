#!/bin/bash

# Check if "master" machine is running
if [ "$(vagrant status | grep 'db' | awk '{print $2}')" == "running" ]; then
    vagrant ssh web-1 -- -t "sudo mount.glusterfs localhost:/gv0 /mnt;exit"
    vagrant ssh web-2 -- -t "sudo mount.glusterfs localhost:/gv0 /mnt;exit"
else
    echo "Master machine is not running."
fi