import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Typography } from "@mui/material";
import styles from "./App.module.css";
import { BASEURL } from "./Constants";
function App() {
  const [file, setFile] = useState();
  const [rows, setRows] = useState([]);
  const [host, setHost] = useState("");
  const [storage, setStorage] = useState("");

  const handleChange = (event) => {
    setFile(event.target.files[0]);
    console.log("File: " + JSON.stringify(file));
  };

  const columns = [
    //field van los atributos del obj
    { field: "id", headerName: "ID", width: 180 },
    { field: "name", headerName: "Nombre", width: 180 },
    { field: "path", headerName: "Path", width: 180 },
  ];

  const getHost = async () => {
    try {
      const response = await fetch(
        BASEURL+"/DistriApp/host",
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      } else {
        const backResponse = await response.json();
        setHost(backResponse.name);
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  const getStorage = async () => {
    try {
      const response = await fetch(
        BASEURL+"/DistriApp/capacity",
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      } else {
        const backResponse = await response.json();
        setStorage(backResponse.size);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const getFiles = async () => {
    try {
      const response = await fetch(
        BASEURL+"/DistriApp/getFiles",
        {
          method: "GET",
        }
      );

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
  };

  const addFile = async () => {
    const formatData = new FormData();
    //Files por que asi se llama el parametro dentro de la api , ahi se pone el nombre del parametro del api el endpoitn
    formatData.append("file", file);

    console.log("Format: " + formatData);

    const response = await fetch(
      BASEURL+"/DistriApp/uploadFile",
      {
        method: "POST",
        mode: "cors",
        body: formatData,
      }
    );

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    } else {
      const backResponse = await response.json();
      console.log(backResponse);
      // getFiles();
      //que me devuelva la lista de archivos
      setRows(backResponse);
      getHost();
      getStorage();
    }
  };

  useEffect(() => {
    getFiles();
  }, []);

  return (
    <Box className={styles.bigBox}>
      <Box className={styles.smallBox}>
        <Button variant="contained" disableElevation component="label">
          Elegir archivo
          <input hidden type="file" onChange={handleChange} />
        </Button>
        <Button variant="contained" disableElevation onClick={addFile}>
          Subir
        </Button>
      </Box>
      {file != null ? (
        <Typography variant="subtitle2" gutterBottom>
          {file.name}
        </Typography>
      ) : (
        <></>
      )}
      <Box className={styles.smallBox}>
        {host != "" ? (
          <Typography variant="subtitle2" gutterBottom>
            Host que responde: {host}
          </Typography>
        ) : (
          <></>
        )}
        {storage != "" ? (
          <Typography variant="subtitle2" gutterBottom>
            {storage} bytes usados
          </Typography>
        ) : (
          <></>
        )}
      </Box>
      <div style={{ height: 500, width: "100%" }}>
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
