import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Atividade from './pages/Atividade/Atividade';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/atividade" element={<Atividade/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
