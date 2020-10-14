install haproxy:
  pkg.installed:
    - pkgs:
      - haproxy

/etc/haproxy/haproxy.cfg:
  file.append:
    - text: |
        
        frontend app_servers
            bind *:3000
            default_backend apps
        
        backend apps
            server web1 192.168.50.11:3000 check
            server web2 192.168.50.12:3000 check
haproxy:
  cmd.run:
    - name: sudo systemctl restart haproxy
