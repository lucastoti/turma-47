import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [lista, setLista] = useState([]);
  useEffect(() => {
    getListaClientes();
  }, [])
  
  function getListaClientes () {
    // fetch (URL DA API, { configuração => metodo GET, PUT, POST, DELETE, headers ...})
    fetch('http://localhost:9000/clientes',{
          method: 'get', 
          headers: new Headers({
              'token': '1a2b3c4d',
          })
        }
      )
      .then(response => response.json())
      .then(data => setLista(data)) // sucesso
      .catch(error => console.error(error)); // erro 
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          { JSON.stringify(lista) }
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
