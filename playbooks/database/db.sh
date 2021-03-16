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

echo 'gluster on fstab'
echo 'localhost:/gfs /mnt/glusterfs glusterfs defaults,_netdev,backupvolfile-server=master 0 0' >> /etc/fstab