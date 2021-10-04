sudo gluster peer probe web-1
sudo gluster peer probe web-2

sudo gluster volume create gv0 replica 3 db:/gluster/data/gv0 web-1:/gluster/data/gv0 web-2:/gluster/data/gv0
sudo gluster volume start gv0
