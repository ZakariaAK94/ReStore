import { TextField } from '@mui/material'
import { useController, UseControllerProps } from 'react-hook-form'

interface Props extends UseControllerProps
{
    label : string,
    multiline?:boolean,
    rows?:number,
    type?:string,
    startAdornment?: React.ReactNode;
}

function AppTextInput(props:Props) 
{
    const { field, fieldState } = 
    useController({...props, defaultValue:''});

  return (
    <TextField
    {...props}
    {...field}
    fullWidth
    variant='outlined'
    error={!!fieldState.error}
    helperText={fieldState.error?.message} 

    />
  )
}

export default AppTextInput