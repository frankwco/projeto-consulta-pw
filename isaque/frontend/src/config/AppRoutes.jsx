import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Calculo from '../pages/Calculo/Calculo';

const AppRoutes =() => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />}/>
                <Route path='/calculo-frete' element={<Calculo />}/>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;