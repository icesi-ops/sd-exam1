import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import styles from "./App.module.css";
function App() {
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const message = "";

  function handleChange(event) {
    setFile(event.target.files);
  }

  const columns = [
    //field van los atributos del obj
    { field: "id", headerName: "ID", width: 180 },
    { field: "name", headerName: "Nombre", width: 180 },
    { field: "path", headerName: "Path", width: 180 },
  ];

  const getFiles = async () => {
    try {
      const response = await fetch("https://3aa5-190-68-27-43.ngrok.io/DistriBack/uploadFile", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      } else {
        const backResponse = await response.json();
        setRows(backResponse);
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  const addFile = async () => {
    setFile(new FormData());
    //Files por que asi se llama el parametro dentro de la api , ahi se pone el nombre del parametro del api el endpoitn
    file.append("files", file);

    const response = await fetch("https://3aa5-190-68-27-43.ngrok.io/DistriBack/uploadFile", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // "Content-Type":'multipart/form-data'
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    } else {
      const backResponse = await response.json();
      console.log(backResponse);
      //que me devuelva la lista de archivos
      //setRows([backResponse]);
    }
  };

  useEffect(() => {
    getFiles();
  }, []);
  

  return (
    <Box className={styles.bigBox}>
      <Box className={styles.smallBox}>
        <input type="file" name="files" onChange={handleChange} />
        <button className={styles.button} onClick={addFile}>Insertar</button>
        <span>
          Host que responde: {message}
        </span>
      </Box>
      <div style={{ height: 200, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[1]}
        />
      </div>
    </Box>
  );
}
export default App;
