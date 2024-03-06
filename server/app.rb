require 'json'
require 'sinatra'
require_relative 'arango'
require_relative 'consul'

arango_client = ArangoDB.new

# Ruta para el chequeo de salud
get '/health' do
  status 200
  'OK'
end


post '/api/files' do
  request_body = JSON.parse(request.body.read)

  name = request_body['name']
  type = request_body['type']
  size = request_body['size']

  result = arango_client.insertDocument(name, type, size)

  if result
    status 201
    result.to_json
  else
    status 500
    'Error'
  end
end

get '/api/files/:key' do
  key = params['key']
  result = arango_client.getDocument(key)

  if result
    status 200
    result.to_json
  else
    status 404
    'Not found'
  end
end

get '/api/files' do
  result = arango_client.getAllDocuments

  if result
    status 200
    result.to_json
  else
    status 404
    'Not found'
  end
end

delete '/api/files/:key' do
  key = params['key']
  result = arango_client.deleteDocument(key)

  if result
    status 204
    result.to_json
  else
    status 404
    'Not found'
  end
end

put '/api/files/:key' do
  request_body = JSON.parse(request.body.read)

  key = params['key']
  name = request_body['name']
  type = request_body['type']
  size = request_body['size']

  result = arango_client.updateDocument(key, name, type, size)

  if result
    status 200
    result.to_json
  else
    status 404
    'Not found'
  end
end
