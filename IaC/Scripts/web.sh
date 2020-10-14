##!/bin/bash
#update
sudo apt update -y
#Install git
sudo apt install -y git 
# Clone our repository
cd /home/vagrant/ && sudo git clone --single-branch --branch IaC  https://github.com/SebastianUrbano/ds-exams.git
cd /home/vagrant
#Install Python
sudo apt install -y python3
sudo apt install -y python2
#Install pyenv and python2 por si las moscas :v
sudo apt install -y  gcc gcc-c++ make git patch openssl-devel zlib-devel readline-devel sqlite-devel bzip2-devel
git clone git://github.com/yyuu/pyenv.git ~/.pyenv
export PATH="$HOME/.pyenv/bin:$PATH"
eval "$(pyenv init -)"
cat << PYENVCONF >> ~/.zshrc
export PATH="$HOME/.pyenv/bin:$PATH"
eval "$(pyenv init -)"
PYENVCONF
pyenv install 2.7.15
#Install Pip
sudo apt install python3-pip -y
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python get-pip.py
sudo apt install python3-pip -y
sudo apt install python-pip -y
#Install pip environment
pip install pipenv
pip3 install pipenv
	#Hasta aqui instala pip y pipenv, para todos---------------
#Install pip packages
pipenv install flask==1.0.2
pipenv install marshmallow==2.16.3
pipenv install pyjwt==1.7.1
pipenv install flask_cors==3.0.7
sudo pipenv shell
#Install Node and NPM
curl -sL https://rpm.nodesource.com/setup_10.x | sudo bash -
sudo apt install npm -y
sudo apt install nodejs -y
#Install React
# curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
# sudo rpm --import https://dl.yarnpkg.com/rpm/pubkey.gpg
sudo apt install yarn -y
##ojo con lo que falta de react########
# Install SaltStack
sudo curl -L https://bootstrap.saltstack.com -o bootstrap_salt.sh
sudo sh bootstrap_salt.sh
#Put custom minion config in place (for enabling masterless mode)
sudo cp -r /home/vagrant/ds-exams/ConfigurationManagment/minion.d /etc/salt/
echo -e 'grains:\n roles:\n  - web' | sudo tee /etc/salt/minion.d/grains.conf
# Doing provision with saltstack
# sudo salt-call state.apply
# sudo salt-call --local state.apply -l debug
