// server.js

const { exec } = require('child_process');
const os = require('os');
const axios = require('axios');

const consulUrl = process.env.CONSUL_URL || 'http://localhost:8500';

function getIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName of Object.keys(interfaces)) {
    for (const iface of interfaces[interfaceName]) {
      if (!iface.internal && iface.family === 'IPv4') {
        return iface.address;
      }
    }
  }
  return '127.0.0.1'; // Default to localhost if no valid IP found
}

async function registerService(consulUrl) {
  const randomId = Math.random().toString(36).substring(7);
  const serviceName = 'frontend';
  const ip = getIpAddress();

  const payload = {
    ID: serviceName + '-' + randomId,
    Name: serviceName,
    Tags: ['frontend', 'nuxt.js', 'javascript', 'node.js'],
    Address: ip,
    Port: 4567,
    Check: {
      DeregisterCriticalServiceAfter: '90m',
      HTTP: `http://${ip}:3000`,
      Interval: '30s',
      Timeout: '30s'
    }
  };

  try {
    await axios.put(consulUrl, payload);
    console.log('Service registered successfully.');
  } catch (error) {
    console.error('Error registering service:', error);
  }
}

// Register service on startup
registerService(consulUrl + '/v1/agent/service/register');

// Start the Nuxt.js application
const nuxtProcess = exec('npm run start');

nuxtProcess.stdout.on('data', (data) => {
  console.log(`Nuxt.js stdout: ${data}`);
});

nuxtProcess.stderr.on('data', (data) => {
  console.error(`Nuxt.js stderr: ${data}`);
});

nuxtProcess.on('close', (code) => {
  console.log(`Nuxt.js process exited with code ${code}`);
});
