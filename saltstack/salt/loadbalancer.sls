install haproxy:
  pkg.installed:
    - pkgs:
      - haproxy

/etc/haproxy/haproxy.cfg:
  file.append:
    - text: |
        
        frontend app_servers
            bind *:8080
            default_backend apps
        
        backend apps
            balance roundrobin
            server web1 192.168.130.30:8080 check
            server web2 192.168.130.40:8080 check
haproxy:
  cmd.run:
    - name: sudo systemctl restart haproxy
