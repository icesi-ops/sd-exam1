import React, { useState } from "react";
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

  const addFile = async () => {
    const file = new FormData();
    //Files por que asi se llama el parametro dentro de la api , ahi se pone el nombre del parametro del api el endpoitn
    file.append("files", file);

    const response = await fetch("https://8177-190-60-254-241.ngrok.io/DistriBack/uploadFile", {
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
