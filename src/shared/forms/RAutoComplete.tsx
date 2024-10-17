import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { RegioesService } from '../services/api/regiao/RegioesService';
import { CategoriasService } from '../services/api/categoria/CategoriasService';
import { EntitiesService } from '../services/api/entities/EntitiesService';
import { TypeServOrdService } from '../services/api/typeServOrdService/TypeServOrdService';
import { ProductService } from '../services/api/productService/ProductService';

import { useDebounce } from '../hooks';
import { Controller, Control } from 'react-hook-form';

// Mapa de serviços
const serviceMap: Record<string, any> = {
  RegioesService,
  CategoriasService,
  EntitiesService,
  TypeServOrdService,  // Adicione outros serviços conforme necessário
  ProductService
};


type TAutoCompleteOption = {
  id: string;
  label: string;
};

interface IAutoCompleteRegiaoProps {
  isExternalLoading?: boolean;
  control: Control<any>; // Tipagem mais precisa do react-hook-form
  name: string;
  label: string;
  source: 'RegioesService' | 'CategoriasService' | 'EntitiesService' | 'TypeServOrdService' | 'ProductService'; // Adicione outras fontes conforme necessário
}

export const RAutoComplete: React.FC<IAutoCompleteRegiaoProps> = ({
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

  // Função que retorna o serviço com base no nome da fonte
  const getServiceBySource = (source: string) => {
    return serviceMap[source] || null;
  };

  useEffect(() => {

    let isMounted = true; // Flag para verificar se o componente está montado

    const fetchData = async () => {
      if (!isMounted) return; // Evita executar se o componente foi desmontado

      setIsLoading(true);

      const fieldService = getServiceBySource(source);

      try {
        const result = await fieldService.getAll(1, busca);
        console.log('result', result);
        if (result instanceof Error) {
          alert(result.message);
        } else if (isMounted) { // Verifica se ainda está montado antes de atualizar o estado
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

    // Função de limpeza para garantir que a flag seja atualizada
    return () => {
      isMounted = false;
      setIsLoading(false); // Certifique-se de que não há atualizações pendentes
    };
    
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
