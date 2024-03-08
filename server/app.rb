require 'json'
require 'sinatra'
require_relative 'arango'
require_relative 'consul'
#require_relative 'samba'

arango_client = ArangoDB.new
#samba_client = SambaClient.new

# Ruta para el chequeo de salud
get '/health' do
  status 200
  'OK'
end


post '/files' do
  file = params[:file]
  
  if file && (tempfile = file[:tempfile])
    filesize = tempfile.size
    filename = File.basename(file[:filename], '.*')
    file_extension = File.extname(file[:filename]).downcase
    puts "Data: #{filename}, #{filesize}, #{file_extension}"
    
    #samba_client.upload_file(tempfile.path, filename)
    
    result = arango_client.insertDocument(filename, file_extension, filesize)
    
    if result
      status 201
      result.to_json
    else
      status 500
      'Error'
    end
  else
    status 400
    'No se envió ningún archivo'
  end
end

# get '/files/:key' do
#   key = params['key']
#   result = arango_client.getDocument(key)
#   file_name = result['name']
#   file_type = result['type']

#   file_content = samba_client.get_file_by_name(file_name + file_type)

#   content_type 'application/octet-stream'
#   headers['Content-Disposition'] = "attachment; filename=\"#{filename}\""

#   if result
#     status 200
#     file_content
#   else
#     status 404
#     'Not found'
#   end
# end

get '/files' do
  result = arango_client.getAllDocuments

  if result
    status 200
    result.to_json
  else
    status 404
    'Not found'
  end
end

delete '/files/:key' do
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

put '/files/:key' do
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

set :bind, '0.0.0.0'
set :port, 4567