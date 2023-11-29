#!/bin/bash
mkdir /samba
chown nobody:nogroup /samba
chmod 777 /samba
exec smbd -FS --no-process-group < /dev/null
