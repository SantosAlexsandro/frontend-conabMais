import { Autocomplete, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { RegioesService } from '../../../shared/services/api/regiao/RegioesService';
import { useDebounce } from '../../../shared/hooks';

type TAutoCompleteOption = {
  id: string;
  label: string;
};

export const AutoCompleteRegiao: React.FC = () => {
  const { debounce } = useDebounce();
  // const [options, setOptions] = useState([]);
  const [options, setOptions] = useState<TAutoCompleteOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /*
  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => selectedId,
      setValue: (_, newSelectedId) => setSelectedId(newSelectedId),
    });
  }, [registerField, fieldName, selectedId]);*/

  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      /*RegioesService.getAll(1, busca, selectedId?.toString()).then((result) => {
        setIsLoading(false);*/

      RegioesService.getAll(1).then((result) => {
        setIsLoading(false);

        if (result instanceof Error) {
          alert(result.message);
        } else {
          console.log(result);

          setOptions(
            //  result.data.map((cidade) => ({ id: cidade.id, label: cidade.nome }))
            result.data.map((regiao) => ({
              id: regiao.Codigo,
              label: regiao.Codigo + ' - ' + regiao.Nome,
            }))
          );
        }
      });
    });
  }, []);

  return (
    <Autocomplete
      disablePortal
      options={options}
      fullWidth 
      sx={{ width: '100%' }}
      renderInput={(params) => <TextField  {...params} fullWidth  sx={{ width: '100%' }}  label='Região' />}
    />
  );
};
