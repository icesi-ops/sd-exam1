require 'json'
require 'sinatra'
require_relative 'arango'
require_relative 'consul'
require_relative 'samba'
require_relative 'cors'

use EnableCors
arango_client = ArangoDB.new
samba_client = SambaClient.new

begin
  samba_client.connect
  puts "Conexión exitosa al servidor Samba."
rescue StandardError => e
  puts "Error al conectar al servidor Samba: #{e.message}"
end

# Rutas

options '*' do
  200
end

get '/health' do
  status 200
  'OK'
end

post '/files' do
  file = params[:file]
  
  if file && (tempfile = file[:tempfile])

    filename = file[:filename]
    file_extension = File.extname(filename).downcase
    
    samba_client.create(filename, tempfile.path)
    result = arango_client.insertDocument(File.basename(filename, '.*'), file_extension, tempfile.size)
    
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

get '/files/:key' do
  begin
    key = params['key']
    filename = arango_client.get_filename(key)

    file_content = samba_client.get_file_by_name(filename)

    content_type 'application/octet-stream'
    headers['Content-Disposition'] = "attachment; filename=\"#{filename}\""

    status 200
    file_content
  rescue StandardError => e
    if e.message.include?("Archivo no encontrado")
      status 404
      "#{e.message}"
    else
      status 500
      "Error al eliminar el archivo desde el servidor Samba: #{e.message}"
    end
  end
end

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
  begin
    key = params['key']
    filename = arango_client.get_filename(key)

    samba_client.delete_file_by_name(filename)
    arango_client.deleteDocument(key)

    status 204
  rescue StandardError => e
    if e.message.include?("Archivo no encontrado")
      status 404
      "#{e.message}"
    else
      status 500
      "Error al eliminar el archivo desde el servidor Samba: #{e.message}"
    end
  end
end

put '/files/:key' do
  begin
    key = params['key']
    filename = arango_client.get_filename(key)
    file = params[:file]

    if file && (tempfile = file[:tempfile])

      # extension del nuevo archivo
      new_file_extension = File.extname(file[:filename]).downcase
      old_file_extension = File.extname(filename).downcase

      # comparar extensiones
      if new_file_extension != old_file_extension
        raise StandardError, "La extensión del archivo no puede ser modificada"
      end

      samba_client.delete_file_by_name(filename)
      samba_client.create(filename, tempfile.path)
      result = arango_client.updateDocument(key, File.basename(filename, '.*'), new_file_extension, tempfile.size)

      if result
        status 200
        result.to_json
      else
        status 500
        'Error'
      end
    else
      status 400
      'No se envió ningún archivo'
    end
  rescue StandardError => e
    if e.message.include?("Archivo no encontrado")
      status 404
      "#{e.message}"

    elsif e.message.include?("La extensión del archivo no puede ser modificada")
      status 400
      "#{e.message}"
    else
      status 500
      "Error al eliminar el archivo desde el servidor Samba: #{e.message}"
    end
  end
end

set :bind, '0.0.0.0'
set :port, 4567