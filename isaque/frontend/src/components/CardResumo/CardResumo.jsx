import React from "react";

const CardResumo = (props) => {
    return (
        <div style={{ justifyItems: "center" }}>
            <h2>{props.titulo}</h2>
            <p>{props.valor}</p>
        </div>
    );
}

export default CardResumo;