CREATE TABLE storage (ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(50) NOT NULL, path VARCHAR(100), type VARCHAR(50));

# Añade casos de prueba
INSERT INTO storage (name, path, type) VALUES ( 'Valentina', '/mnt/vale/index.html', 'html');
INSERT INTO storage (name, path, type) VALUES ( 'Benjamin', '/mnt/benji/index.html', 'html');
INSERT INTO storage (name, path, type) VALUES ( 'Juan', '/mnt/juan/index.html', 'html');

