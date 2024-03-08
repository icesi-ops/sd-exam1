docker run -d \
    --name my-samba-container  \
    --network deploy_parcial \
    -e SAMBA_USER=admin \
    -e SAMBA_PASSWORD=password1 \
    -p 445:445 \
    -v "$(pwd)/storage:/shared" \
    dperson/samba -p \
    -u "myuser;mypassword" \
    -s "shared;/shared;yes;no;no;myuser" 