interface BaseInputFieldProps{
    label: string;
    inputType: string;
    minValue?: number;
    required?: boolean;
    value?: number | string;
    step?: number | "any";
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const BaseInputField = ({label, inputType, minValue, required, value, onChange, step}: BaseInputFieldProps) => {
    return(<>
    <label>{label}</label>
    <input type={inputType} min={minValue} required={required} value={value} onChange={onChange} step={step}></input>
    </>);
}


export default BaseInputField;