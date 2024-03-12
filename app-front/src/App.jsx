import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {API_URL} from "./config/constants.js";
import './App.css';

function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const handleFileChange = (event) => {
        console.log(event)
        setSelectedFile(event.target.files[0]);
    };

    useEffect(() => {
        console.log('useEffect');
        fetchUploadedFiles();
    }, []);


    const handleSubmit = async () => {
        // Verificar si se ha seleccionado un archivo
        if (!selectedFile) {
            alert('Por favor selecciona un archivo');
            return;
        }

        // Crear un nuevo objeto FormData y agregar los datos del archivo
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('name', selectedFile.name);
        formData.append('size', String(selectedFile.size));

        // Obtener la extensión del archivo y agregarla al FormData
        formData.append('type', selectedFile.name.split('.').pop());

        console.log('type:', selectedFile.name.split('.').pop());


        // Enviar la solicitud POST al servidor utilizando Axios
        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((response) => {
                fetchUploadedFiles();
            })
            .catch((error) => {
                fetchUploadedFiles();
            })

    };

    const fetchUploadedFiles = async () => {
        console.log('fetchUploadedFiles');
        try {
            // Realizar una solicitud GET a la URL del servidor
            const response = await axios.get(`${API_URL}/books`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Verificar si la respuesta es exitosa (código de estado 2xx)
            if (response.status >= 200 && response.status < 300) {
                // Extraer los datos JSON de la respuesta
                const data = response.data;
                // Verificar si los datos son un array y actualizar el estado si es así
                if (Array.isArray(data)) {
                    setUploadedFiles(data);
                }
            } else {
                // Manejar errores si la respuesta no es exitosa
                console.error('Error al obtener archivos del servidor:', response.statusText);
            }
        } catch (error) {
            // Manejar errores de la solicitud
            console.error('Error en la solicitud:', error.message);
        }
    };


    return (
        <div className="App">
            <h1>Sube tu archivo</h1>
            <div className="card">
                <input type="file" onChange={handleFileChange}/>
                <button onClick={handleSubmit}>Enviar Archivo</button>
            </div>
            <div className="table-container">
                <h2>Archivos cargados</h2>
                <table>
                    <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Tamaño (bytes)</th>
                        <th>Tipo</th>
                    </tr>
                    </thead>
                    <tbody>
                    {uploadedFiles.map((file, index) => (
                        <tr key={index}>
                            <td>{file.name}</td>
                            <td>{file.size}</td>
                            <td>{file.type}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default App;
