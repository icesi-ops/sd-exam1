FROM consul:1.15.4

RUN mkdir /data && chmod 777 /data
CMD ["consul", "agent", "-server", "-bootstrap-expect=1", "-ui", "-data-dir", "/data", "-client", "0.0.0.0"]