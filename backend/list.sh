#!/bin/bash
echo ls | smbclient //172.18.0.2/public/ -U underbedmonster%password1 | nawk '$2~/A/ {print $1}'
