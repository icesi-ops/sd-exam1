sudo apt-get install build-essential -y
cd ~
curl -O https://dl.google.com/go/go1.15.2.linux-amd64.tar.gz
tar xvf go1.15.2.linux-amd64.tar.gz > /dev/null
sudo chown -R root:root ./go
sudo mv go /usr/local
export GOROOT=/usr/local/go
export GOHOME=$GOROOT/work
export GOPATH=/usr/local/go/bin
export PATH=$PATH:/usr/local/go/bin
source $HOME/.bashrc
cd /srv/
rm -d -f -r ./webfiles2
cp -r ./webfiles ./webfiles2
cd /srv/webfiles2
go mod init example.com/hello
go run hello.go &
#SE INTEGRA EL FRONT
cd /srv/webfiles2/front/my-app
rm -rf node_modules
sudo apt install node -y
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install yarn -y
sudo yarn install
sudo bash -c "echo 'REACT_APP_IP=$(ifconfig eth1 | awk '/inet /{print $2}')'>>.env"
yarn start &


