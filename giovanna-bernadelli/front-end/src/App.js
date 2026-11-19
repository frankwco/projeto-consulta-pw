import logo from './logo.svg';
import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import DashBaord from './pages/DashBoard';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/DashBoard' element={<DashBaord />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
