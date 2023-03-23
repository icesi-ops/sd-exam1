#!/bin/bash
vagrant destroy -f

current=$(cat Vagrantfile | grep "nodes_count =" | xargs)
new=$(cat nodes_count.txt)

echo $current
echo $new

sed -i "s/$current/$new/" Vagrantfile

vagrant up
