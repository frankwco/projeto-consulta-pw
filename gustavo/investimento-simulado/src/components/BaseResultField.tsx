interface BaseResultProps{
    text: string;
    result?: number;
}



const BaseResult = ({text, result}:BaseResultProps) =>{
    return(<>
    <h1>{text}{result}</h1>
    </>);
}

export default BaseResult;