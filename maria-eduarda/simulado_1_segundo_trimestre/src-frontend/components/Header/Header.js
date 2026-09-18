import './Header.css'

function Header({titulo}){
    return(
        <div className='header'>
            <div className='header-content'>
                <h1 className='titulo'>{titulo}</h1>
            </div>
            
        </div>
    );
}

export default Header;