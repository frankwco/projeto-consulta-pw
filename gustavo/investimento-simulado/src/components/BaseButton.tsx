

interface BaseButtonProps{
    text: string;
    color: string;
    action: () => void | Promise<void>;
}


const BaseButton = ({text, color, action}: BaseButtonProps) => {
    return(
        <button type="button" style={{backgroundColor: color, borderRadius: 5, padding:"1rem", maxHeight:'3rem', maxWidth:"20rem", color:"#fff", fontWeight: "bold", cursor:"pointer"}} onClick={action}>
          {text}
        </button>
    );
}

export default BaseButton;



