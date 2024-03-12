# Usa una imagen base de Python
FROM python:3.8-slim

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de la aplicación al contenedor
COPY . .

# Instala las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Instala las herramientas necesarias
RUN apt-get update && \
    apt-get install -y iproute2 curl openssl && \
    rm -rf /var/lib/apt/lists/*

# Copia el script de registro de Consul
COPY consul_backend.sh /consul_backend.sh
RUN chmod +x /consul_backend.sh


# Exponer el puerto de la aplicación Flask
EXPOSE 5000

# Comando para ejecutar el script de registro de Consul y la aplicación Flask
CMD ["/consul_backend.sh"]
