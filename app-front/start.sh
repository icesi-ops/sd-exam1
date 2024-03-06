#!/bin/sh

# List of environment variables
ENV_VARS="API_URL"

echo "Configuring environment variables..."

mkdir -p /var/www/app/config/

echo 'window._env_ = {' > /var/www/app/config/front.env.js

# Iterate over the environment variables and add them to the file
for prefix in $ENV_VARS; do
  for var in $(env | grep -E "^$prefix" | awk -F= '{print $1}'); do
    value=$(eval echo "\$$var")  # Get the value of the variable
    echo "    $var: \"$value\"," >> /var/www/app/config/front.env.js
  done
done

echo "};" >> /var/www/app/config/front.env.js

echo "Starting Nginx..."

nginx -g "daemon off;"