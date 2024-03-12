#!/bin/sh

# Instala openssl
apt-get update && apt-get install -y openssl

# List of environment variables
ENV_VARS="API_URL API_CONSUL"

echo "Configuring environment variables..."

# Iterate over the environment variables and print them to the console
for prefix in $ENV_VARS; do
  for var in $(env | grep -E "^$prefix" | awk -F= '{print $1}'); do
    value=$(eval echo "\$$var")  # Get the value of the variable
    echo "$var=$value"
  done
done

echo "Register consul service..."

CONSUL_URL=${CONSUL_URL:-"http://consulParcial:8500"}

# Use 'ip route' to get the container's IP address
get_ip() {
    ip=$(ip route | awk '/default/ {print $3}')
    echo "$ip"
}

register_service() {
    local consul_url="$1"
    local ip=$(get_ip)
    local random_id=$(openssl rand -hex 5)
    local service_name="Backend"

    payload='{
      "ID": "'"$service_name"'-'"$random_id"'",
      "Name": "'"$service_name"'",
      "Tags": ["back"],
      "Address": "'"$ip"'",
      "Port": 5000,
      "Check": {
        "DeregisterCriticalServiceAfter": "90m",
        "HTTP": "http://'"$ip"':5000/health",
        "Interval": "10s",
        "Timeout": "1s"
      }
    }'

    echo $payload

    curl -X PUT -H "Content-Type: application/json" --data "$payload" "$consul_url"
}

register_service "$CONSUL_URL/v1/agent/service/register"

echo "Starting Flask app..."
python app.py
