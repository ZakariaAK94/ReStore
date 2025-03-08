import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useState } from "react";

interface Props{
    items:string[];
    checked?:string[];
    onChange: (items:string[])=>void;
}

export default function CheckBoxButtons({items,checked,onChange}:Props){
  const [checkedItems, setCheckedItems] = useState(checked || []);
    function handleChange(value:string)
    {
        const currentIndex = checkedItems.findIndex(item => item === value);
        let newChekedItems:string[] = [];
        if(currentIndex === -1) newChekedItems = [...checkedItems!,value];
        else newChekedItems = checkedItems.filter(item => item !== value);
        setCheckedItems(newChekedItems);
        onChange(newChekedItems);
    }
    return(
        <FormGroup >
              {items.map(item=>(
                <FormControlLabel 
                control={<Checkbox 
                         checked ={checkedItems.indexOf(item) !== -1}
                         onChange={()=>handleChange(item)}
                         />} 
                label={item} 
                key={item} />))}
        </FormGroup>
    )
}