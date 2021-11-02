#!/bin/sh
# Download and copy to bin
curl https://binaries.cockroachdb.com/cockroach-v21.1.9.linux-amd64.tgz | tar -xz && cp -i cockroach-v21.1.9.linux-amd64/cockroach /usr/local/bin/
mkdir -p /usr/local/lib/cockroachdb
cp -i cockroach-v21.1.9.linux-amd64/lib/libgeos.so /usr/local/lib/cockroach/
cp -i cockroach-v21.1.9.linux-amd64/lib/libgeos_c.so /usr/local/lib/cockroach/

# Remove tar file
rm -r cockroach-v21.1.9.linux-amd64/cockroach


