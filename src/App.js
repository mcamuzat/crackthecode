
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Chat from './Components/Chat';
import Lock from './Components/Lock';
import Logic from './Components/Logic';
import Number from './Components/Number';
import Dashboard from './Components/Dashboard';
import Creation from './Components/Creation';
import Record from './Components/Record';
import Preview from './Components/Preview';
import Tanuki from './Components/Tanuki';
import Murdle from './Components/Murdle';
import Qwinto from './Components/Qwinto';
import Qwixx from './Components/Qwixx';
import socketIO from 'socket.io-client';

const socket = socketIO.connect('http://localhost:4000');

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Chat socket={socket} />}></Route>
          <Route path="/uploads/*"></Route>
          <Route path="/logic" element={<Logic socket={socket} />}></Route> 
          <Route path="/tanuki" element={<Tanuki socket={socket} />}></Route> 
          <Route path="/qwinto" element={<Qwinto socket={socket} />}></Route> 
          <Route path="/qwixx" element={<Qwixx socket={socket} />}></Route> 
          <Route path="/murdle" element={<Murdle socket={socket} />}></Route> 
          <Route path="/cantstop" element={<Qwixx socket={socket} />}></Route> 
          <Route path="/number" element={<Number socket={socket} />}></Route>
          <Route path="/creation" element={<Creation socket={socket} />}></Route>
          <Route path="/record" element={<Record socket={socket} />}></Route>
          <Route path="/login" element={<Login socket={socket} />}></Route>
          <Route path="/broadcast" element={<Lock socket={socket} />}></Route>
          <Route path="/dashboard" element={<Dashboard socket={socket} />}></Route>
          <Route path="/planning" element={<Creation socket={socket} />}></Route>
          <Route path="/preview" element={<Preview socket={socket} />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
