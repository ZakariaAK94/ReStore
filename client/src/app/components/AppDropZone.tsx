import { UploadFile } from '@mui/icons-material';
import { FormControl, FormHelperText, Typography } from '@mui/material';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useController, UseControllerProps } from 'react-hook-form';

interface Props extends UseControllerProps{}

export default function AppDropzone(props:Props) 
{
    const{field, fieldState} = useController({...props,defaultValue:null}); 

    const dzStyles ={
        display:'flex',
        border: '3px dashed grey',
        borderColor:'grey',
        borderRadius: '8px',
        paddingTop: '30px',
        alignItems: 'center',
        Height:200,
        width: 500,
        cursor: 'pointer'
      };

      const dzActive = {
        borderColor: 'green'
      }

    const onDrop = useCallback((acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      acceptedFiles[0] = Object.assign(file,{preview:URL.createObjectURL(file)});
      field.onChange(acceptedFiles[0]);
    }, [field]);
 
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop }); 

  return (
    <div
      {...getRootProps()} 
    >
        <FormControl style={isDragActive ? {...dzStyles,...dzActive} : dzStyles} error={!!fieldState.error} >
            <input {...getInputProps()} />
            <UploadFile sx={{fontSize:'100px'}}/>
            <Typography variant='h4'>Drop image here</Typography>
            <FormHelperText>{fieldState.error?.message}</FormHelperText>
        </FormControl>
    </div>
  );
}


