// src/shared/forms/VTextField.tsx
import { Controller, useFormContext } from 'react-hook-form';
import { TextField, TextFieldProps } from '@mui/material';

type TVTextFieldProps = TextFieldProps & {
  name: string;
};

export const RTextField: React.FC<TVTextFieldProps> = ({ name, ...rest }) => {
  const { control, formState: { errors } } = useFormContext(); // Pega o contexto do form

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          {...rest}
          error={!!errors[name]}
          helperText={errors[name]?.message ? String(errors[name]?.message) : ''} // Exibe o erro se existir
          sx={{
            '& .MuiFormHelperText-root': {
              width: '100%',       // Ajusta a largura do helperText para 100%
              minWidth: '300px',   // Defina uma largura mínima, se necessário
              whiteSpace: 'nowrap', // Impede a quebra de linha
            },
          }}
        />
      )}
    />
  );
};
