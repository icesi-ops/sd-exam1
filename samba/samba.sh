docker run -d \
    --name my-samba-container  \
    --network libraryapp \
    -e SAMBA_USER=danilops \
    -e SAMBA_PASSWORD=password \
    -p 445:445 \
    -v "$(pwd)/storage:/shared" \
    dperson/samba -p \
    -u "danilops;password" \
    -s "shared;/shared;yes;no;no;myuser" 