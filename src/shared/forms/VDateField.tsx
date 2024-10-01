import { useEffect, useState } from 'react';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';
import { Moment } from 'moment';
import { useField } from '@unform/core';
import TextField from '@mui/material/TextField';

interface TVDateFieldProps extends Omit<DatePickerProps<Moment, false>, 'slots'> {
  name: string;
}

export const VDateField: React.FC<TVDateFieldProps> = ({ name, ...rest }) => {
  const { fieldName, registerField, defaultValue, error, clearError } =
    useField(name);

  const [value, setValue] = useState<Moment | null>(defaultValue || null);

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => value,
      setValue: (_, newValue: Moment | null) => setValue(newValue),
      clearValue: () => setValue(null),
    });
  }, [registerField, fieldName, value]);

  return (
    <DatePicker
      {...rest}
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
        clearError(); // Clear any validation errors
      }}
      slots={{
        textField: (textFieldProps) => (
          <TextField
            {...textFieldProps}
            error={!!error}
            helperText={error}
          />
        )
      }}
    />
  );
};
