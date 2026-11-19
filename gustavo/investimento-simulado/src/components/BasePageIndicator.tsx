interface BasePageIndicatorProps{
    title: string;
}


const BasePageIndicator = ({title}:BasePageIndicatorProps) => {
    return(<>
    <header style={{padding:"1rem", backgroundColor: "#838383"}}>
        {title}
    </header>
    </>)
}


export default BasePageIndicator;