# Usar la versión específica de la imagen oficial de Consul
FROM consul:1.14.8

# Crear un directorio para los datos de Consul
RUN mkdir /data && chmod 777 /data
# Configurar Consul para ejecutarse como un servidor y usar el directorio de datos
CMD ["consul", "agent", "-server", "-bootstrap-expect=1", "-ui", "-data-dir", "/data", "-client", "0.0.0.0"]