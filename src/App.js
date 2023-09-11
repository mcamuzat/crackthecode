import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Chat from './Components/Chat';
import Lock from './Components/Lock';
import Number from './Components/Number';
import Dashboard from './Components/Dashboard';
import socketIO from 'socket.io-client';

const socket = socketIO.connect('http://localhost:4000');

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Chat socket={socket} />}></Route>
          <Route path="/number" element={<Number socket={socket} />}></Route>
        
          <Route path="/login" element={<Login socket={socket} />}></Route>
          <Route path="/broadcast" element={<Lock socket={socket} />}></Route>
          <Route path="/dashboard" element={<Dashboard socket={socket} />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
