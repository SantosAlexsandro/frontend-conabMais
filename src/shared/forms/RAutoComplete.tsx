import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { RegioesService } from '../services/api/regiao/RegioesService';
import { CategoriasService } from '../services/api/categoria/CategoriasService';
import { useDebounce } from '../hooks';
import { Controller, Control } from 'react-hook-form';

type TAutoCompleteOption = {
  id: string;
  label: string;
};

interface IAutoCompleteRegiaoProps {
  isExternalLoading?: boolean;
  control: Control<any>; // Tipagem mais precisa do react-hook-form
  name: string;
  label: string;
  source: 'regioes' | 'categorias';
}

export const AutoComplete: React.FC<IAutoCompleteRegiaoProps> = ({
  isExternalLoading = false,
  control,
  name,
  label,
  source,
}) => {
  const { debounce } = useDebounce();
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [options, setOptions] = useState<TAutoCompleteOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const fieldService =
        source === 'regioes' ? RegioesService : CategoriasService;

      try {
        const result = await fieldService.getAll(1, busca);
        console.log('result', result);
        if (result instanceof Error) {
          alert(result.message);
        } else {
          setOptions(
            result.data.map((item: any) => ({
              id: item.Codigo,
              label: item.Codigo + ' - ' + item.Nome,
            }))
          );
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };
    debounce(fetchData);
    // Função de limpeza para interromper requisições em andamento

    return () => setIsLoading(false);
  }, [busca, source, debounce]);

  const autoCompleteSelectedOption = useMemo(() => {
    if (!selectedId) return null;

    const selectedOption = options.find((opcao) => opcao.id === selectedId);
    if (!selectedOption) return null;

    return selectedOption;
  }, [selectedId, options]);

  return (
    <Controller
      name={name}
      control={control} // Receber o control do formulário pai
      defaultValue={undefined}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Autocomplete
          openText='Abrir'
          closeText='Fechar'
          noOptionsText='Sem opções'
          loadingText='Carregando...'
          value={autoCompleteSelectedOption} // O valor controlado pelo estado interno
          loading={isLoading || isExternalLoading}
          disabled={isExternalLoading}
          onInputChange={(_, newValue) => setBusca(newValue)}
          popupIcon={
            isExternalLoading || isLoading ? (
              <CircularProgress size={28} />
            ) : undefined
          }
          onChange={(_, newValue) => {
            setSelectedId(newValue?.id);
            onChange(newValue?.id); // Passa o valor para o react-hook-form
          }}
          disablePortal
          options={options}
          fullWidth
          sx={{ width: '100%' }}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              sx={{
                width: '100%',
                '& .MuiFormHelperText-root': {
                  width: '100%', // Ajusta a largura do helperText para 100%
                  minWidth: '300px', // Defina uma largura mínima, se necessário
                  whiteSpace: 'nowrap', // Impede a quebra de linha
                },
              }}
              label={label}
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />
      )}
    />
  );
};
