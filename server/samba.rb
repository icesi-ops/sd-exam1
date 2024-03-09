require 'ruby_smb'
require "openssl"

class SambaClient
  def initialize
    @ip_address = ENV['SAMBA_IP'] || 'localhost'
    @username = ENV['SAMBA_USER'] || 'samba'
    @password = ENV['SAMBA_PASSWORD'] || 'root'
    @share_name = ENV['SAMBA_SHARE'] || 'share'
    @smb_client = nil
  end

  def connect
    puts "Conectando a #{@ip_address} con usuario #{@username} y contraseña #{@password}..."
    sock = TCPSocket.new @ip_address, 445
    dispatcher = RubySMB::Dispatcher::Socket.new(sock)
    @smb_client = RubySMB::Client.new(dispatcher, username: @username, password: @password, smb1: true, smb2: false, smb3: false)
    @smb_client.negotiate
    @smb_client.authenticate
  end


  def create(remote_file_name, local_file_path)
    begin
      puts "Agregando archivo '#{remote_file_name}' a #{@share_name}..."

      # Conectar al recurso compartido
      tree = @smb_client.tree_connect(@share_name)

      puts "Conectado a  #{@share_name}..."
      
      # Ruta completa del archivo en el recurso compartido
      remote_file_path = "#{remote_file_name}"
    
      # Abrir el archivo remoto para escritura
      file = tree.open_file(filename: remote_file_path, write: true, read: true, disposition: RubySMB::Dispositions::FILE_OPEN_IF)

      puts "Abriendo archivo '#{remote_file_name}' para escritura..."
    
      # Leer el contenido del archivo local
      local_file_content = File.binread(local_file_path)

      puts "Leyendo contenido del archivo local '#{local_file_path}'..."
    
      # Escribir el contenido en el archivo remoto
      file.write(data: local_file_content)

      puts "Escribiendo contenido en el archivo '#{remote_file_name}'..."
    
      # Cerrar el archivo
      file.close
    
      puts "Archivo '#{remote_file_name}' agregado exitosamente a #{@share_name}'"
    rescue StandardError => e
      puts "Error al agregar archivo a #{@share_name}: #{e.message}"
    end
  end

  def get_file_by_name(remote_file_name)
    begin
      puts "Obteniendo archivo '#{remote_file_name}' de #{@share_name}..."

      # Conectar al recurso compartido
      tree = @smb_client.tree_connect(@share_name)

      puts "Conectado a  #{@share_name}..."

      # Abrir el archivo remoto
      file = tree.open_file(filename: remote_file_name, read: true)

      puts "Abriendo archivo '#{remote_file_name}' para lectura..."

      # Leer el contenido del archivo remoto
      archivo = file.read

      # Cerrar el archivo
      file.close

      puts "Archivo '#{remote_file_name}' obtenido exitosamente de #{@share_name}"
      return archivo
    rescue StandardError => e
      puts "Error al obtener archivo '#{remote_file_name}' de #{@share_name}: #{e.message}"
      return nil
    end
  end

  def delete_file_by_name(remote_file_name)
    begin
      puts "Eliminando archivo '#{remote_file_name}' de #{@share_name}..."

      # Conectar al recurso compartido
      tree = @smb_client.tree_connect(@share_name)

      puts "Conectado a  #{@share_name}..."

      # Eliminar el archivo remoto
      file = tree.open_file(filename: remote_file_name, delete: true)

      puts "Abriendo archivo '#{remote_file_name}' para eliminar..."

      file.delete

      file.close

      puts "Archivo '#{remote_file_name}' eliminado exitosamente de #{@share_name}"
    rescue StandardError => e
      puts "Error al eliminar archivo '#{remote_file_name}' de #{@share_name}: #{e.message}"
    end
  end
end
