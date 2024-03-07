require 'ruby_smb'

class SambaClient
  def initialize
    @ip_address = ENV['SAMBA_IP_ADDRESS'] || 'localhost'
    @username = ENV['SAMBA_USERNAME'] || 'sambau'
    @password = ENV['SAMBA_PASSWORD'] || 'root'
    connect
  end

  private

  def connect
    @smb_client = RubySMB::Client.new
    @smb_client.connect(@ip_address, username: @username, password: @password)
  end

  public

  def upload_file(local_file_path, remote_file_name)
    @smb_client.connect unless @smb_client
    smb_file = @smb_client.create(remote_file_name)
    smb_file.write(File.read(local_file_path))
    smb_file.close
  end

  def get_file_by_name(remote_file_name)
    @smb_client.connect unless @smb_client
    smb_file = @smb_client.open(remote_file_name)
    smb_file.read
  end
end
