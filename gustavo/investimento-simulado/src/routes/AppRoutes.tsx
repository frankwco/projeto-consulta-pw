import {BrowserRouter, Routes, Route} from "react-router-dom";
import HomePage from '../pages/HomePage';
import MainPage from '../pages/MainPage';

const AppRoutes = () =>{
    return(<>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/main" element={<MainPage/>}/>
        </Routes>
    </BrowserRouter>
    </>);
}


export default AppRoutes;



