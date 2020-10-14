base:
  'minion1':
    - web1
  'minion2':
    - web2
  'minionlb':
    - balancer
  '*db*':
    -database
