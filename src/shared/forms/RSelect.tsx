import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

type FormFields = {
  CaracteristicaImovel: number | null; // Permitir null como valor inicial
};

type TRSelectProps = {
  name: keyof FormFields; // Nome do campo
  label: string; // Rótulo para o Select
  options: { value: number; label: string }[]; // Opções do Select
};

export const RSelect: React.FC<TRSelectProps> = ({ name, label, options }) => {
  const { control, formState: { errors } } = useFormContext<FormFields>();

  return (
    <FormControl sx={{ minWidth: 250 }} error={!!errors[name]?.message}>
      <InputLabel>{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            value={field.value !== null && field.value !== undefined ? field.value : ''} // Usa string vazia se null ou undefined
            label={label}
            onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))} // Converte para null ou número
          >
            <MenuItem value="">
              <em>Nenhum</em> {/* Valor tratado como null */}
            </MenuItem>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        )}
      />
      {errors[name]?.message && (
        <FormHelperText>{String(errors[name]?.message)}</FormHelperText>
      )}
    </FormControl>
  );
};
