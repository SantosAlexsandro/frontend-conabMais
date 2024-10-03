import { useEffect, useState } from 'react';
import {
  Box,
  Grid2,
  Grid,
  LinearProgress,
  Paper,
  Typography,
  Button,
  TextField,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';

import { PessoasService } from '../../shared/services/api/entities/EntitiesService';
import { FerramentasDeDetalhe } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';

interface ICategoria {
  Operacao: string;
  Codigo: string;
}

interface IFormData {
  Nome: string;
  CodigoRegiao: string;
  CaracteristicaImovel: number; // Use 'number' se espera um número aqui
  Categorias: ICategoria[]; // Array de categorias
}

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
  Nome: yup.string().required('Nome é obrigatório.'),
  CodigoRegiao: yup.string().required('Código da região é obrigatório.'),
  CaracteristicaImovel: yup
    .number()
    .required('Características do imóvel são obrigatórias.'),
  Categorias: yup
    .array()
    .of(
      yup.object().shape({
        Operacao: yup.string().required('Operação é obrigatória.'),
        Codigo: yup.string().required('Código é obrigatório.'),
      })
    )
    .required()
    .min(1, 'Deve haver pelo menos uma categoria.')
    .default([]),
});

export const EntitiesDetail: React.FC = () => {
  const { reset, handleSubmit, control } = useForm();
  const { id = 'nova' } = useParams<'id'>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState('');
  const [categorias, setCategorias] = useState<ICategoria[]>([
    { Operacao: '', Codigo: '' },
  ]); // Inicia com uma categoria

  useEffect(() => {
    if (id !== 'nova') {
      setIsLoading(true);
      PessoasService.getById(Number(id)).then((result) => {
        setIsLoading(false);
        if (result instanceof Error) {
          alert(result.message);
          navigate('/pessoas');
        } else {
          setNome(result.Nome);
          reset(result); // Define todos os campos do formulário com os dados do result
          setCategorias(result.Categorias || [{ Operacao: '', Codigo: '' }]);
        }
      });
    } else {
      reset({
        Nome: '',
        CodigoRegiao: '',
        CaracteristicaImovel: undefined,
        Categorias: [{ Operacao: '', Codigo: '' }],
      });
    }
  }, [id]);

  const handleAddCategoria = () => {
    setCategorias([...categorias, { Operacao: '', Codigo: '' }]);
  };

  const handleRemoveCategoria = (index: number) => {
    const updatedCategorias = categorias.filter((_, i) => i !== index);
    setCategorias(updatedCategorias);
  };

  return (
    <LayoutBaseDePagina
      titulo={id === 'nova' ? 'Nova Entidade Prospect' : nome}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo='Nova'
          mostrarBotaoSalvarEFechar
          mostrarBotaoNovo={id !== 'nova'}
          mostrarBotaoApagar={id !== 'nova'}
          // aoClicarEmSalvar={handleSubmit(onSubmit)} // TODO: Verificar como é acionado o onSubmit
          // aoClicarEmSalvarEFechar={saveAndClose}
          aoClicarEmVoltar={() => navigate('/entidades')}
          // aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmNovo={() => navigate('/entidades/detalhe/nova')}
        />
      }
    >
      <Box component='form'>
        <Box
          margin={1}
          display='flex'
          flexDirection='column'
          component={Paper}
          variant='outlined'
        >
          <Grid2 container direction='column' padding={2} spacing={2}>
            {isLoading && (
              <Grid2 sx={{ flexGrow: 1 }}>
                <LinearProgress variant='indeterminate' />
              </Grid2>
            )}
            <Grid2>
              <Typography variant='h6'>Geral</Typography>
            </Grid2>

            <Grid2 container direction='row' spacing={2}>
              <Grid2
                sx={{
                  gridColumn: {
                    xs: 'span 12',
                    sm: 'span 12',
                    md: 'span 6',
                    lg: 'span 4',
                    xl: 'span 2',
                  },
                }}
              >
                <Controller
                  name='Nome'
                  control={control}
                  defaultValue=''
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Nome'
                      disabled={isLoading}
                      onChange={(e) => {
                        field.onChange(e); // Necessário para manter o controle do React Hook Form
                        setNome(e.target.value); // Continua com a lógica de setar o valor de Nome
                      }}
                    />
                  )}
                />
              </Grid2>
            </Grid2>


          </Grid2>
        </Box>
      </Box>
    </LayoutBaseDePagina>
  );
};
