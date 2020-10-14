import React from 'react';
import {useState,useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'
import './index.css';

ReactDOM.render(
  <MainComponent />,
  document.getElementById('root')
);

function MainComponent(props){

  const [cellphones,setCellphones]=useState([]);
  const [name, setName] = useState('');
  const[getCells, setGetCells]=useState(true);
  const[ip,setIp]=useState(process.env.REACT_APP_IP);
  console.log(process.env.REACT_APP_IP);
  console.log(cellphones);

  useEffect(() => {
    axios.get('http://'+ip+':8080/ping').then((res)=>{
      console.log(res);
      setCellphones(res.data.array);
    })
    setGetCells(false);
  },[getCells]);

  function loadSearch(n){
    if(n===null){n=""};
    axios.get('http://'+ip+':8080/byName/'+n,{
      headers: {
          'Content-Type': 'application/json'
      }}).then((res)=>{
      console.log(res);
      setCellphones(res.data.array);
    })
  }

  return(
    <div>
      <p>Servidor que responde: {ip}</p>
      <p>Busque el celular que desea</p>
      <button onClick={()=>setGetCells(true)}>Mostrar todos</button>
      <input onChange={event => {
        setName(event.target.value);}} value={name} />
      <button onClick={()=>loadSearch(name)}>Buscar</button>
        <ul>
            {
                cellphones.map((item) => {
                return <li key={item.id}>{item.name} {item.brand} {item.capacity}</li>
                })
            }
        </ul>
    </div>)
}
