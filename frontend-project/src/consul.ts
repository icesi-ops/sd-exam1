const registerService = async () => {
  const url = 'http://localhost:8500/v1/agent/service/register';
  const data = {
    ID: 'frontend2',
    Name: 'frontend2',
    Address: '127.0.0.1',
    Port: 5173,
  };

  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(url, options);

    if (response.ok) {
      const responseData = await response.json();
      console.log('Servicio registrado en Consul:', responseData);
    } else {
      console.error('Error al registrar el servicio en Consul:', response.statusText);
    }
  } catch (error) {
    console.error('Error desconocido:', error);
  }
};

registerService();
