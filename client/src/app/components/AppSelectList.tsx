import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useController, UseControllerProps } from 'react-hook-form';
import { FormHelperText } from '@mui/material';

interface Props extends UseControllerProps{
    label: string;
    items:string[];
}
export default function AppSelectList(props:Props) {
  const { field, fieldState } = useController({...props, defaultValue: ''});

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth error={!!fieldState.error}>
        <InputLabel>{props.label}</InputLabel>
        <Select
          value={field.value}
          label={props.label}
          onChange={field.onChange}
        >
           {
              props.items.map((item,index)=>(<MenuItem key={index} value={item}>{item}</MenuItem>))          
           }
        </Select>
        <FormHelperText>{fieldState.error?.message}</FormHelperText>
      </FormControl>
    </Box>
  );
}
