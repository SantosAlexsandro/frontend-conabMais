import { useEffect, useState } from 'react';
import {
  Box,
  Grid2,
  Grid,
  LinearProgress,
  Paper,
  Typography,
  Button,
  Select,
  MenuItem,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { PessoasService } from '../../shared/services/api/entities/EntitiesService';
import { FerramentasDeDetalhe } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { AutoCompleteRegiao } from '../../shared/forms/RAutoCompleteRegiao';
import { RTextField } from '../../shared/forms/RTextField';
import { RSelect } from '../../shared/forms';

// Definir o schema Yup para o formulário
const formValidationSchema = yup.object({
  Nome: yup
    .string()
    .required('Nome é obrigatório')
    .min(3, 'Mínimo de 3 caracteres'),
  CodigoRegiao: yup.string().required('Código da região é obrigatório.'),
  CaracteristicaImovel: yup
    .number()
    .nullable()
    .min(1, 'Escolha uma característica válida do imóvel.')
    .required('Característica do Imóvel é obrigatória.'),
  Categorias: yup.array().of(
    yup.object({
      Operacao: yup.string().required('Operação é obrigatória.'),
      Codigo: yup.string().required('Código é obrigatório.'),
    })
  ),
});

// Tipo derivado do schema do Yup
type IFormData = yup.InferType<typeof formValidationSchema>;

export const EntitiesDetail: React.FC = () => {
  const methods = useForm<IFormData>({
    resolver: yupResolver(formValidationSchema),
    mode: 'onSubmit',
    defaultValues: {
      Nome: '',
      CaracteristicaImovel: undefined, // Altere de null para undefined
      Categorias: [],
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const { id = 'nova' } = useParams<'id'>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState('');
  const [categorias, setCategorias] = useState([{ Codigo: '' }]); // Inicia com uma categoria

  const onSubmit = (dados: IFormData) => {
    setIsLoading(true);

    if (id === 'nova') {
      PessoasService.create(dados).then((result) => {
        setIsLoading(false);
        if (result instanceof Error) {
          console.log('erro', result.message);
        }
      });
    }
  };

  const handleAddCategoria = () => {
    setCategorias([...categorias, { Codigo: '' }]);
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
          mostrarBotaoSalvarEFechar={false}
          mostrarBotaoNovo={id !== 'nova'}
          mostrarBotaoApagar={id !== 'nova'}
          aoClicarEmSalvar={handleSubmit(onSubmit)}
          aoClicarEmVoltar={() => navigate('/entidades')}
          aoClicarEmNovo={() => navigate('/entidades/detalhe/nova')}
        />
      }
    >
      <FormProvider {...methods}>
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
                    xs: '100%',
                    sm: '100%',
                    md: '50%',
                    lg: '33%',
                    xl: '25%',
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
                    xs: '100%',
                    sm: '100%',
                    md: '50%',
                    lg: '33%',
                    xl: '25%',
                  },
                }}
              >
                <AutoCompleteRegiao
                  control={control}
                  isExternalLoading={isLoading}
                  name='CodigoRegiao'
                  label='Região'
                />
              </Grid2>
            </Grid2>

            <Grid2 container direction='row' spacing={2}>
              <Grid2
                sx={{
                  width: {
                    xs: '100%',
                    sm: '100%',
                    md: '50%',
                    lg: '33%',
                    xl: '25%',
                  },
                }}
              >
                <RSelect
                  name='CaracteristicaImovel'
                  label='Característica do Imóvel'
                  options={[
                    { value: 1, label: 'Residencial' },
                    { value: 2, label: 'Comercial' },
                    { value: 3, label: 'Misto' },
                  ]}
                />
              </Grid2>
            </Grid2>

            <Typography variant='h6'>Categorias</Typography>
            {/* Aqui começa a seção de categorias */}
            <Grid2 container direction='column' spacing={2}>
              {categorias.map((categoria, index) => (
                <Grid2 container key={index} spacing={2} alignItems='center'>
                  {/* Campo Código */}
                  <Grid2 >
                    <RTextField
                      fullWidth
                      name={`Categorias[${index}].Codigo`}
                      label='Código'
                      value={categoria.Codigo}
                      onChange={(e) => {
                        const updatedCategorias = [...categorias];
                        updatedCategorias[index].Codigo = e.target.value;
                        setCategorias(updatedCategorias);
                      }}
                    />
                  </Grid2>

                  {/* Botão Remover */}
                  <Grid2>
                    <Button
                      onClick={() => handleRemoveCategoria(index)}
                    >
                      Remover
                    </Button>
                  </Grid2>
                </Grid2>
              ))}

              {/* Botão para adicionar nova categoria */}
              <Grid2>
                <Button color='primary' onClick={handleAddCategoria}>
                  Adicionar Categoria
                </Button>
              </Grid2>
            </Grid2>


          </Grid2>
        </Box>
      </FormProvider>
    </LayoutBaseDePagina>
  );
};
