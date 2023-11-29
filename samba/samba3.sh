#!/bin/bash
(echo sambapassword; echo sambapassword) | adduser --gecos "" sambauser
mkdir /samba
chown sambauser:sambauser /samba
chmod 700 /samba
exec smbd -FS --no-process-group < /dev/null


