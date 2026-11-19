import BaseHeader from "../components/BaseHeader";
import BasePageIndicator from "../components/BasePageIndicator";

interface HomePageLayoutProps{
title?: string;
text: string;
children: React.ReactNode;

}

const HomePageLayout  = ({title, text, children}:HomePageLayoutProps) => {

    return(
    <div>
        <BasePageIndicator title={text}/>
        <BaseHeader title={title}/>
        <main style={{border: "1px solid #585858",
        borderRadius: "4px",
        padding: "10px", margin:"2rem", paddingBottom:"18rem"}} >
            {children}
        </main>
    </div>);
    
}

export default HomePageLayout