import { FormControl, RadioGroup, FormControlLabel, Radio } from "@mui/material"

interface Props{
    options:any[];
    selectedValue:string;
    onChange: (event:any) => void;
}
export default function RadioButtonsGroup({options, selectedValue, onChange}:Props)
{
    
    return(
        <FormControl component='fieldset'>
            <RadioGroup value={selectedValue} onChange={onChange} >
              {options.map(({value, label})=>(
                  <FormControlLabel value={value} control={<Radio />} label={label} key={value} />
              ))}
             </RadioGroup>
         </FormControl> 
    )
}