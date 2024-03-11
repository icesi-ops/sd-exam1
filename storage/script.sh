docker run -d \
    --name my-samba-container  \
    --network parcial \
    -e SAMBA_USER=myuser \
    -e SAMBA_PASSWORD=mypassword \
    -p 445:445 \
    -v "$(pwd)/storage:/shared" \
    dperson/samba -p \
    -u "myuser;mypassword" \
    -s "shared;/shared;yes;no;no;myuser" 