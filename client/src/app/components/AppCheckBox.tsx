import { Checkbox, FormControlLabel } from '@mui/material'
import { useController, UseControllerProps } from 'react-hook-form'


interface Props extends UseControllerProps{
    label:string,
    disabled:boolean
}

function AppCheckBox(props:Props) {
    const{field} = useController({...props, defaultValue:false})
  return (
    <FormControlLabel 
          control={ 
          <Checkbox 
          {...field}
          color='success' 
          checked={field.value}
          disabled={props.disabled}
          /> }   
          label = {props.label}           
    />
  )
}

export default AppCheckBox