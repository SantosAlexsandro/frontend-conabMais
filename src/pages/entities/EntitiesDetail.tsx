import { useEffect, useState } from 'react';
import {
  Box,
  Grid2,
  LinearProgress,
  Paper,
  Typography,
  Button,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import {
  useForm,
  FormProvider,
  Controller,
  useFieldArray,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { PessoasService } from '../../shared/services/api/entities/EntitiesService';
import { FerramentasDeDetalhe } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { AutoComplete } from '../../shared/forms/RAutoComplete';
import { RTextField } from '../../shared/forms/RTextField';
import { RSelect } from '../../shared/forms';

// Definir o schema Yup para o formulário
const formValidationSchema = yup.object({
  Nome: yup
    .string()
    .required('Nome/Razão é obrigatório')
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
      Codigo: yup.string().required('Ao menos 1 categoria é obrigatória.'),
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
      CaracteristicaImovel: undefined,
      Categorias: [{ Codigo: '', Operacao: 'I' }], // Definir valor padrão para Categorias
    },
  });

  const { control, handleSubmit } = methods;

  // useFieldArray para gerenciar dinamicamente os campos de Categorias
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'Categorias',
  });

  const { id = 'nova' } = useParams<'id'>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState('');

  const onSubmit = (dados: IFormData) => {
    // Verifique se Categorias está definido
    const categoriasComOperacao = dados.Categorias
      ? dados.Categorias.map((categoria) => ({
        ...categoria,
        Operacao: 'I', // Define 'I' para cada categoria
        // Codigo: '03.01',
      }))
      : [];

    const dadosComCategoriasAtualizadas = {
      ...dados,
      Categorias: categoriasComOperacao, // Sobrescreve as categorias
    };

    console.log(
      'Dados que estão passando pela validação:',
      dadosComCategoriasAtualizadas
    );
    setIsLoading(true);

    if (id === 'nova') {
      PessoasService.create(dadosComCategoriasAtualizadas).then((result) => {
        setIsLoading(false);
        alert('Entidade Prospect cadastrada com sucesso.');
        navigate('/entidades');
        if (result instanceof Error) {
          console.log('erro', result.message);
        }
      });
    }
  };

  const handleAddCategoria = () => {
    append({ Codigo: '', Operacao: 'I' }); // Adiciona nova categoria com Operacao predefinida
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
                <AutoComplete
                  control={control}
                  isExternalLoading={isLoading}
                  name='CodigoRegiao'
                  label='Região'
                  source='regioes'
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
            <Grid2  direction='column' spacing={2}>
              {fields.map((categoria, index) => (
                <Grid2 container key={categoria.id} justifyContent='flex-start'>
                  {/* Campo Código */}
                  <Grid2
                    sx={{
                      width: {
                        xs: '70%',
                        sm: '70%',
                        md: '50%',
                        lg: '33%',
                        xl: '25%',
                      },
                      paddingBottom: 2,
                    }}
                  >
                    <AutoComplete
                      control={control}
                      isExternalLoading={isLoading}
                      name={`Categorias[${index}].Codigo`}
                      label='Categoria da Entidade'
                      source = 'categorias'
                    />
                  </Grid2>

                  {/* Botão Remover */}
                  <Grid2>
                    <Button onClick={() => remove(index)}>Remover</Button>
                  </Grid2>
                </Grid2>
              ))}

              {/* Botão para adicionar nova categoria */}
              <Grid2 sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Button onClick={handleAddCategoria}>
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
