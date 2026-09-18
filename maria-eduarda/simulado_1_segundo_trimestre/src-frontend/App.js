import './App.css';
import Home from './pages/Home/Home';
import Calculo from './pages/Calculo/Calculo'; // <- Sem chaves
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculo" element={<Calculo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;