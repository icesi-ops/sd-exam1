#!/bin/bash

sudo -u postgres -H sh -c "psql -c 'CREATE DATABASE pg_ds;'" -v

sudo -u postgres -H sh -c "psql -c '\c pg_ds'" -v

sudo -u postgres -H sh -c "psql -d pg_ds -c 'CREATE TABLE cellphones(
    id serial PRIMARY KEY,
    name VARCHAR (100) NOT NULL,
    brand VARCHAR (100) NOT NULL,
    capacity INTEGER NOT NULL
);'" -v

sudo -u postgres psql -c "\c pg_ds;" -c "INSERT INTO cellphones (id, name, brand, capacity) VALUES (1,'Note 20 Ultra','Samsung',256);" 
sudo -u postgres psql -c "\c pg_ds;" -c "INSERT INTO cellphones (id, name, brand, capacity) VALUES (2,'P30 Pro','Huawei',128);" 
sudo -u postgres psql -c "\c pg_ds;" -c "INSERT INTO cellphones (id, name, brand, capacity) VALUES (3,'F2 Pro','Pocophone',64);"
sudo -u postgres psql -c "\c pg_ds;" -c "GRANT ALL PRIVILEGES ON TABLE cellphones TO remote;"



