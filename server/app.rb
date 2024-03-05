require 'sinatra'
require 'rest-client'
require 'json'
require 'securerandom'

consul_url = ENV['CONSUL_URL'] + '/v1/catalog/register'

# Método para registrar el servicio en Consul
def register_service(consul_url)
  base_url = 'http://localhost:8500/v1/catalog/register'
  headers = { 'Content-Type': 'application/json' }

  random_id = SecureRandom.hex(5)

  payload = {
    "Node": "rest-server-node",
    "Address": "server", # Debes ajustar la dirección IP según tu entorno Docker
    "Service": {
      "ID": "rest-server-#{random_id}",
      "Service": "rest-server",
      "Port": 4567, # Puerto en el que se ejecuta el servidor Sinatra
    },
    "Check": {
        "Node": "rest-server-node",
        "Name": "Redis health check",
        "Notes": "Script based health check",
        "Status": "passing",
        "Definition": {
          "http": "server:4567/health",
          "Interval": "5s",
          "Timeout": "1s"
        }
      },
  }
  RestClient.put(consul_url, payload.to_json, headers)
end

# Registra el servicio en Consul al iniciar la aplicación
register_service(consul_url)

# Ruta para el chequeo de salud
get '/health' do
  status 200
  'OK'
end

# Ruta de ejemplo para la API REST
get '/api/hello' do
  'Hello, world!'
end
