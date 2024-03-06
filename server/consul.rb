require 'rest-client'

consul_url = ENV['CONSUL_URL'] || "http://localhost:8500"

def register_service(consul_url)
    headers = { 'Content-Type': 'application/json' }
  
    random_id = SecureRandom.hex(5)
  
    payload = {
      "Node": "backend-node",
      "Address": "backend", # Debes ajustar la dirección IP según tu entorno Docker
      "Service": {
        "ID": "backend-#{random_id}",
        "Service": "backend",
        "Port": 4567, # Puerto en el que se ejecuta el servidor Sinatra
      },
      "Check": {
          "Node": "backend-node",
          "Name": "Serf Health Status",
          "Notes": "Script based health check",
          "Status": "passing",
          "Definition": {
            "http": "backend:4567/health",
            "Interval": "5s",
            "Timeout": "1s"
          }
        },
    }
    RestClient.put(consul_url, payload.to_json, headers)
end

register_service(consul_url  + '/v1/catalog/register')