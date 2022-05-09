#!/bin/sh
echo ls | smbclient //samba/public/ -U underbedmonster%password1 | awk '$2~/A/ {print $1}'
