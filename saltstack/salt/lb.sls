install haproxy:
  pkg.installed:
    - pkgs:
      - haproxy

/etc/haproxy/haproxy.cfg:
  file.append:
    - text: |
        
        frontend app_servers
            bind *:5000
            default_backend apps
        
        backend apps
            server web1 192.168.224.11:5000 check
            server web2 192.168.224.12:5000 check
haproxy:
  cmd.run:
    - name: sudo systemctl restart haproxy