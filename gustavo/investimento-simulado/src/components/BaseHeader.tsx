interface BaseHeaderProps{
    title?: string;
}


const BaseHeader = ({title}:BaseHeaderProps) => {

    return(<>
    <header style={{padding: "1rem", marginBottom:"2rem"}}><h1 style={{color:'#33691E'}}>Calculo de investimento{title}</h1></header>
    </>);
}

export default BaseHeader;