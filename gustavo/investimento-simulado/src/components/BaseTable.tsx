export interface Calculo {
    valorInicial: number;
    prazo: number;
    juro: number;
    valorFinal?: number;
    data?: string;
}

interface BaseTableProps {
    history: Calculo[];
}


const BaseTable = ({history}:BaseTableProps) =>{
    return(<div style={{margin:"3rem"}}>
        <h1>Últimos cálculos realizados</h1>
    <table>
        <thead>
            <tr style={{ backgroundColor: "#689E39" }}>
                <th style={{ padding: "0 3rem" }}>Data</th>
                <th style={{ padding: "0 3rem" }}>Prazo</th>
                <th style={{ padding: "0 3rem" }}>Juro</th>
                <th style={{ padding: "0 7.5rem" }}>valor final</th>
            </tr>
        </thead>
    <tbody>
        {history.map((item, index) =>(
            <tr style={{backgroundColor:"#d1d1d1"}} key={index}>
                <td style={{ padding: "0 3rem" }}>{item.data}</td>
                <td style={{ padding: "0 3rem" }}>{item.prazo}</td>
                <td style={{ padding: "0 4rem" }}>{item.juro}</td>
                <td style={{ padding: "0 8rem" }}>{item.valorFinal}</td>
            </tr>
        ))}
    </tbody>
    </table>

    </div>);
}

export default BaseTable;