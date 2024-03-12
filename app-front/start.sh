#!/bin/sh

#Install openssl

apk add --no-cache openssl

# List of environment variables
ENV_VARS="API_URL API_CONSUL"

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


echo "Register consul service..."

CONSUL_URL=${CONSUL_URL:-"http://consul:8500"}

get_ip() {
    ip=$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | head -n 1)
    echo "$ip"
}

register_service() {
    local consul_url="$1"
    local ip=$(get_ip)
    local random_id=$(openssl rand -hex 5)
    local service_name="front"

    payload='{
      "ID": "'"$service_name"'-'"$random_id"'",
      "Name": "'"$service_name"'",
      "Tags": ["ui"],
      "Address": "'"$ip"'",
      "Port": 80,
      "Check": {
        "DeregisterCriticalServiceAfter": "90m",
        "HTTP": "http://'"$ip"':80",
        "Interval": "10s",
        "Timeout": "1s"
      }
    }'


    echo $payload

    curl -X PUT -H "Content-Type: application/json" --data "$payload" "$consul_url"
}

register_service "$CONSUL_URL/v1/agent/service/register"



echo "Starting Nginx..."

nginx -g "daemon off;"