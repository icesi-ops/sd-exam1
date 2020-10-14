#!/bin/bash
sudo yum update -y
sudo yum install -y git 
# Clone our repository
sudo git clone https://github.com/SebastianUrbano/ds-exams.git
#Install Python
sudo yum install -y python3
#Install pyenv and python2 por si las moscas :v
sudo yum install -y  gcc gcc-c++ make git patch openssl-devel zlib-devel readline-devel sqlite-devel bzip2-devel
sudo yum install -y gcc python-devel
git clone git://github.com/yyuu/pyenv.git ~/.pyenv
export PATH="$HOME/.pyenv/bin:$PATH"
eval "$(pyenv init -)"
cat << _PYENVCONF_ >> ~/.zshrc
export PATH="$HOME/.pyenv/bin:$PATH"
eval "$(pyenv init -)"
_PYENVCONF_
pyenv install 2.7.15
#add mongo on repolist of yum
sudo cp /srv/Scripts/mongodb-org.repo /etc/yum.repos.d/mongodb-org.repo
sudo yum repolist
#Install mongo
sudo yum install -y mongodb-org
# Install SaltStack
sudo curl -L https://bootstrap.saltstack.com -o bootstrap_salt.sh
sudo sh bootstrap_salt.sh
#Put custom minion config in place (for enabling masterless mode)
sudo cp -r /srv/ds-exams/ConfigurationManagment/minion.d /etc/salt/
echo -e 'grains:\n roles:\n  - db' | sudo tee /etc/salt/minion.d/grains.conf
# Doing provision with saltstack
