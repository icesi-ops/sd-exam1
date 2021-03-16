mkdir -p ~/.ssh
echo "Host *" > ~/.ssh/config
echo " StrictHostKeyChecking no" >> ~/.ssh/config

yum install -y centos-release-gluster9.noarch
yum install -y glusterfs gluster-cli glusterfs-libs glusterfs-server
mkfs.xfs /dev/sdb
mkdir /gluster
echo '/dev/sdb /gluster xfs defaults 0 0' >> /etc/fstab
mount -a
mkdir /gluster/brick
cat hosts.txt >> /etc/hosts
systemctl start glusterd.service
systemctl enable glusterd.service
mkdir /mnt/glusterfs

echo 'localhost:/gfs /mnt/glusterfs glusterfs defaults,_netdev,backupvolfile-server=brick2 0 0' >> /etc/fstab

gluster peer probe master
gluster peer probe brick1

sleep 5
gluster volume create gfs master:/gluster/brick brick1:/gluster/brick brick2:/gluster/brick
sleep 5
gluster volume start gfs
sleep 5
mount -a

ssh -i private_key_db vagrant@192.168.33.100 'sudo mount -a'
ssh -i private_key_web_1 vagrant@192.168.33.11 'sudo mount -a'