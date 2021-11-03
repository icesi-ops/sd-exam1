# Mount the volume in the missing nodes
vagrant ssh web-1 -c 'sudo mkdir /mnt/glusterfs && sudo mount -t glusterfs 192.168.33.11:/glustertest /mnt/glusterfs'
vagrant ssh web-2 -c 'sudo mkdir /mnt/glusterfs && sudo mount -t glusterfs 192.168.33.12:/glustertest /mnt/glusterfs'
