FROM dperson/samba

RUN apk --no-cache add openssl

RUN adduser -D -H -G smb admin \
    && echo -e "admin\nadmin\n" | smbpasswd -a -s admin

COPY smb.conf /etc/samba/smb.conf

RUN mkdir -p /data && chown admin:smb /data

EXPOSE 137/udp 138/udp 139 445

VOLUME /data
