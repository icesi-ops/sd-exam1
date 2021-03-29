mv mongodb.org-4.4.repo /etc/yum.repos.d
yum update
yum install -y mongodb-org
systemctl start mongod
systemctl enable mongod
