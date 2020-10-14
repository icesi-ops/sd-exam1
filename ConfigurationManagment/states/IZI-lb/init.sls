install_haproxy:
  pkg.installed:
    - pkgs:
      - haproxy

/etc/haproxy/haproxy.cfg:
  file.append:
    - text: |
        
        frontend main
            bind *:8080
            default_backend nodes
        
        backend nodes
            balance roundrobin
            server web-1 192.168.33.11:8080 check
            server web-2 192.168.33.12:8080 check

run_haproxy:
  cmd.run:
    - name: sudo systemctl restart haproxy
