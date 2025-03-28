import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { InputBaseComponentProps } from '@mui/material';

interface Props extends InputBaseComponentProps {
  component: React.ElementType;
}

const StripeInput = forwardRef<unknown, Props>((
  { component: Component, ...props }, ref) => {
  const elementRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    focus: () => elementRef.current?.focus(),
  }));

  return (
    <Component
      onReady={(element: any) => {
        elementRef.current = element;
      }}
      {...props}
    />
  );
});

export default StripeInput;
