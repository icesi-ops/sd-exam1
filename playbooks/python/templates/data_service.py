import os

def get_hostname():
   return os.system('hostnamectl | grep \'hostname\'')

def save_files(username, index, node_count):

    path = f'/mnt/{username}'
    index_filename = index.filename
    node_count_filename = node_count.filename


    os.mkdir(path)

    index.save(f'{path}/{index_filename}')
    node_count.save(f'{path}/{node_count_filename}')

    index_insert = {'name': index_filename, 'path':f'{path}/{index_filename}', 'type': '1'}
    node_count_insert = {'name': node_count_filename, 'path':f'{path}/{index_filename}', 'type': '2'}

    return (index_insert, node_count_insert)

def check_status():
    return os.system('df -hT /mnt | awk \'{print $3, $4, $5, $6}\'')

def get_uploaded():
    return os.system('find . | sed -e "s/[^-][^\/]*\//  |/g" -e "s/|\([^ ]\)/|-\1/"')