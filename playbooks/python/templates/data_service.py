import os

def get_hostname():
    hostname = os.popen('hostnamectl | grep \'hostname\'').read()
    html = '''
    <!doctype html>
    <html>
      <head>
        <title>Icesi Pages</title>
      </head>
      <body>
        <h1>{} </h1>
        <form action="/upload" method="post" enctype="multipart/form-data">

          <label for="username">Username</label>
          <input type="text" name="username"><br><br>

          <label for="file1">Index:</label>
          <input type="file" name="file1"><br><br>
          <label for="file2">Node count:</label>
          <input type="file" name="file2"><br><br>
          <input type="submit" value="Upload">
        </form>
      </body>
    </html>'''.format(hostname)
    return html

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
    status = os.popen('df -hT /mnt | awk \'{print $3, $4, $5, $6}\'').read()

    html = '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Flask App</title>
    </head>
    <body>
        <h1>Gluster status</h1>
        <div style="white-space: pre-wrap;">{}</div>
    </body>
    </html>
    '''.format(status)

    return html

    

def get_uploaded():
    uploaded = os.popen('tree -a /mnt/').read()

    html = '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Flask App</title>
    </head>
    <body>
        <h1>Uploaded files</h1>
        <div style="white-space: pre-wrap;">{}</div>
    </body>
    </html>
    '''.format(uploaded)
    return html