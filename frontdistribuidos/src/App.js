import 'bootstrap/dist/css/bootstrap.min.css'
import React,{useState , useEffect} from 'react'
import { DataGrid } from '@mui/x-data-grid';
import '@fontsource/roboto/300.css';
import { Typography } from '@mui/material';

function App() {

 const [archivos, setArchivos] = useState(null);
 const [host,setHost]=useState("");
 const [storage,setStorage]=useState("");
 const [show,setShow]= useState(false);
 const [message,setMessage]= useState("");

 const [rows,setRows]= useState([]);


 
 const columns = [
  //field van los atributos del obj
     { field: 'id', headerName: 'ID', width: 180 },
     { field: 'nombre', headerName: 'Nombre', width: 180 },
     { field: 'path', headerName: 'Path', width: 180 },
     { field: 'type', headerName: 'Tipo', width: 180 },
   ];
  
  const subirArchivos =(e)=>{
    setArchivos(e);
  
  }

  useEffect(()=>{
    getFiles()
  },[rows]);

  const getFiles = async ()=>{
    const files = await fetch ("http://localhost:8081/getFiles",{
      method:"GET"
    });
    if (!files.ok) {
      throw new Error(`Error! status: ${files.status}`);
    } else {
      const backResponse = await files.json(); 
      
      setRows(backResponse);
    }

  }

  const getHost = async ()=>{
    const host = await fetch ("http://localhost:8081/host",{
      method:"GET"
    });
    if (!host.ok) {
      throw new Error(`Error! status: ${host.status}`);
    } else {
      const backResponse = await host.json();
      setHost(backResponse.response);
     
    }
  }

  const getStorage = async ()=>{
    const storage = await fetch ("http://localhost:8081/storage",{
      method:"GET"
    });
    if (!storage.ok) {
      throw new Error(`Error! status: ${storage.status}`);
    } else {
      const backResponse = await storage.json();
      setStorage(backResponse);
    }
  }


  const insertarArchivo = async ()=>{
    setMessage("");
    const file = new FormData();
    //Files por que asi se llama el parametro dentro de la api , ahi se pone el nombre del parametro del api el endpoitn
    
    for(let index = 0;index< archivos.length;index++){
      
      file.append("files",archivos[index]);
    }
    

  
    const response = await fetch("http://localhost:8081/uploadFile",{
      method: "POST",
      mode:'cors',
      body: 
        file
    });
  
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    } else {
      setMessage("El archivo se subio correctamente!");
      setShow(true);
      getHost();
      getStorage();
    }
  
  
  }

  return (
    <div class="col-auto  p-5 text-center" overflowX="hidden" overflowY="hidden">
      <input type="file" name="files" onChange={(e) => subirArchivos(e.target.files)} /> 
      <div style={{display:'flex', flexWrap:'wrap',justifyContent:'center',alignItems:'center'}}>
      {show && 
      <div>    
      <Typography variant="h5" >Host: {host} </Typography>
      <Typography variant="h5" > Almacenamiento: {storage} Bytes</Typography>
      </div>
      }
      </div>  
      <button className="btn btn-primary" onClick={() => { insertarArchivo() }}>Insertar</button>
      <br></br>
      <Typography variant="h5" color={'#64e01d'}> {message} </Typography>
      <div style={{ height: '70vh', width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          getRowId={(row) => row.id + row.nombre}
          rowsPerPageOptions={[5]}
        />
      </div>
    </div>
  );
}
export default App;
