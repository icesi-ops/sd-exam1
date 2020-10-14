base:
  'roles:web':
    - match: grain
    - IZI-web

  'roles:db':
    - match: grain
    - IZI-db

  'roles:lb':
    - match: grain
    - IZI-lb
