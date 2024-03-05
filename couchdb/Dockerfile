FROM couchdb:latest
LABEL authors="Alexander Sánchez"

# Set the env variables
ENV COUCHDB_USER=admin
ENV COUCHDB_PASSWORD=admin

# Define the database name
ENV COUCHDB_DATABASE=files

# Check the env variables
RUN echo $COUCHDB_USER
RUN echo $COUCHDB_PASSWORD
RUN echo $COUCHDB_DATABASE

# Copy the local.ini file
COPY local.ini /etc/local.ini

# Expose the CouchDB port
EXPOSE 5984
