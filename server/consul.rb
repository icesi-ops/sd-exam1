require "socket"
require 'rest-client'


consul_url = ENV['CONSUL_URL'] || "http://localhost:8500"

def get_ip
    ip = Socket.ip_address_list.detect(&:ipv4_private?).ip_address
end

def register_service(consul_url)
    headers = { 'Content-Type': 'application/json' }
  
    random_id = SecureRandom.hex(5)
  
    service_name = "backend"
    ip = get_ip

    payload = {
      "ID": service_name + "-" + random_id,
      "Name": service_name,
      "Tags": ["api"],
      "Address":  ip,
      "Port": 4567,
      "Check": {
        "DeregisterCriticalServiceAfter": "90m",
        "HTTP": "http://#{ip}:4567/health",
        "Interval": "60s",
        "Timeout": "60s"
      }
    }
    RestClient.put(consul_url, payload.to_json, headers)
end

register_service(consul_url  + '/v1/agent/service/register')


