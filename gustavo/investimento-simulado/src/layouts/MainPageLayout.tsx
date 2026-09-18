import type React from "react";
import BasePageIndicator from "../components/BasePageIndicator";
import BaseHeader from "../components/BaseHeader";


interface MainPageLayoutPros{
    text: string;
    title?: string;
    children: React.ReactNode;
}

const MainPageLayout = ({text, title, children}:MainPageLayoutPros) =>{
    return(
    <div>
        <BasePageIndicator title={text}/>
        <BaseHeader title={title}/>
        <div>
            {children}
        </div>
    </div>
    );
} 

export default MainPageLayout;  