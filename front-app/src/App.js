import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import styles from "./App.module.css";
function App() {
  const [file, setFile] = useState();
  const [rows, setRows] = useState([]);
  const message = "";

  const handleChange = (event) => {
    setFile(event.target.files[0]);
    console.log("File: "+JSON.stringify(file));
  }

  const columns = [
    //field van los atributos del obj
    { field: "id", headerName: "ID", width: 180 },
    { field: "name", headerName: "Nombre", width: 180 },
    { field: "path", headerName: "Path", width: 180 },
  ];

  const getFiles = async () => {
    try {
      const response = await fetch("https://0dd6-200-3-193-78.ngrok.io/DistriApp/getFiles", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      } else {
        const backResponse = await response.json();
        console.log(backResponse);
        setRows(backResponse);
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  const addFile = async () => {
    const formatData = new FormData();
    //Files por que asi se llama el parametro dentro de la api , ahi se pone el nombre del parametro del api el endpoitn
    formatData.append("file", file);
    
    console.log("Format: "+ formatData);

    const response = await fetch("https://0dd6-200-3-193-78.ngrok.io/DistriApp/uploadFile", {
      method: "POST",
      body: formatData,
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
