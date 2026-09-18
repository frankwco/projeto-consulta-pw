import React from "react";

const Header = ({nomePagina, subtitulo}) => {
    return(
        <div style={{ justifyItems: "center" }}>
            <h1>Website de Calculo de Frete - {nomePagina}</h1>
            {subtitulo && <h2>{subtitulo}</h2>}
        </div>
    );
}

export default Header;