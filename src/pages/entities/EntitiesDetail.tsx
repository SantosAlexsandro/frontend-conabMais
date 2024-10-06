import { useEffect, useState } from 'react';
import {
  Box,
  Grid2,
  Grid,
  LinearProgress,
  Paper,
  Typography,
  Button
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { useForm, FormProvider } from 'react-hook-form';

import { PessoasService } from '../../shared/services/api/entities/EntitiesService';
import { FerramentasDeDetalhe } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { AutoCompleteRegiao } from './components/AutoCompleteRegiao';
import { yupResolver } from '@hookform/resolvers/yup';
import { RTextField } from '../../shared/forms/RTextField';

interface ICategoria {
  Operacao: string;
  Codigo: string;
}

interface IFormData {
  Nome: string;
  CodigoRegiao: string;
}

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
  Nome: yup
    .string()
    .required('Nome é obrigatório')
    .min(3, 'Mínimo de 3 caracteres'),
  CodigoRegiao: yup.string().required('Código da região é obrigatório.')
});

export const EntitiesDetail: React.FC = () => {
  const methods = useForm<IFormData>({
    resolver: yupResolver(formValidationSchema),
    mode: 'onSubmit', // Valida apenas ao tentar enviar o formulário
    defaultValues: {
      Nome: '', // Define o valor inicial de Nome como string vazia
      // Outros campos podem ser adicionados aqui
    },
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = methods;

  if (Object.keys(errors).length > 0) {
    console.log('Erros de validação encontrados:', errors);
  }

  const { id = 'nova' } = useParams<'id'>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState('');

  const onSubmit = (dados: IFormData) => {
    console.log('INIT ON SUBMIT', dados);
    setIsLoading(true);
    const saveData = { ...dados }; // Agora não precisa fazer validação manual, dados já validados

    if (id === 'nova') {
      console.log('INIT CREATE', id);
      PessoasService.create(saveData).then((result) => {
        setIsLoading(false);
        if (result instanceof Error) {
          console.log('erro', result.message);
          // Aqui você pode, opcionalmente, setar um erro customizado no form
          // setError('form', { type: 'manual', message: result.message });
        }
      });
    }
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
          aoClicarEmSalvar={handleSubmit(onSubmit)}
          aoClicarEmVoltar={() => navigate('/entidades')}
          aoClicarEmNovo={() => navigate('/entidades/detalhe/nova')}
        />
      }
    >
      <FormProvider {...methods}>
        {' '}
        {/* Agora todos os campos dentro de FormProvider terão acesso ao context */}
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
                  width: {
                    xs: '100%', // 100% da largura em dispositivos pequenos
                    sm: '100%',
                    md: '50%', // 50% da largura em dispositivos médios
                    lg: '33%', // 33% da largura em dispositivos grandes
                    xl: '25%', // 25% da largura em dispositivos extra grandes
                  },
                }}
              >
                <RTextField
                  fullWidth
                  name='Nome'
                  disabled={isLoading}
                  label='Nome completo'
                />
              </Grid2>
            </Grid2>
            <Grid2 container direction='row' spacing={2}>
              <Grid2
                sx={{
                  width: {
                    xs: '100%', // 100% da largura em dispositivos pequenos
                    sm: '100%',
                    md: '50%', // 50% da largura em dispositivos médios
                    lg: '33%', // 33% da largura em dispositivos grandes
                    xl: '25%', // 25% da largura em dispositivos extra grandes
                  },
                }}
              >
                {
                  <AutoCompleteRegiao control={control}   isExternalLoading={isLoading} />
                }
              </Grid2>
            </Grid2>
          </Grid2>
        </Box>
      </FormProvider>{' '}
      {/* Fechando FormProvider */}
    </LayoutBaseDePagina>
  );
};
