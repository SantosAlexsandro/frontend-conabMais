import { useEffect, useState } from 'react';
import { ReusableGrid } from '../../shared/forms/ReusableGrid'; // Importe o componente
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

import { FerramentasDeDetalhe } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { EntitiesService} from '../../shared/services/api/entities/EntitiesService';
import { RAutoComplete } from '../../shared/forms/RAutoComplete';
import { WorkOrdersService } from '../../shared/services/api/workOrders/WorkOrdersService';


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

export const WorkOrdersDetail: React.FC = () => {
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
      EntitiesService.create(dadosComCategoriasAtualizadas).then((result) => {
        setIsLoading(false);
        alert('Ordem de Serviço cadastrada com sucesso.');
        navigate('/entidades');
        if (result instanceof Error) {
          console.log('erro', result.message);
        }
      });
    }
  };

  return (
    <LayoutBaseDePagina
      titulo={id === 'nova' ? 'Nova Ordem de Serviço' : nome}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo='Nova'
          mostrarBotaoSalvarEFechar={false}
          mostrarBotaoNovo={id !== 'nova'}
          mostrarBotaoApagar={id !== 'nova'}
          aoClicarEmSalvar={handleSubmit(onSubmit)}
          aoClicarEmVoltar={() => navigate('/ordens-de-servico')}
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

            {/* Entidade */}
            <Grid2 container direction='row' spacing={2}>
              <ReusableGrid>
                <RAutoComplete
                  control={control}
                  isExternalLoading={isLoading}
                  name='CodigoEntidade'
                  label='Entidade'
                  source='EntitiesService'
                />
              </ReusableGrid>
            </Grid2>

            {/* Tipo Ordem de Serviço */}
            <Grid2 container direction='row' spacing={2}>
              <ReusableGrid>
                <RAutoComplete
                  control={control}
                  isExternalLoading={isLoading}
                  name='CodigoTipoOrdServ'
                  label='Tipo Ordem de Serviço'
                  source='TypeServOrdService'
                />
              </ReusableGrid>
            </Grid2>

            {/* Tipo de atendimento */}
            <Grid2 container direction='row' spacing={2}>
              <ReusableGrid>
                <RAutoComplete
                  control={control}
                  isExternalLoading={isLoading}
                  name='CodigoTipoAtendContrato'
                  label='Tipo de Atendimento'
                  source='TypeServOrdService'
                />
              </ReusableGrid>
            </Grid2>

            <Grid2>
              <Typography variant='h6'>Produto da Ordem</Typography>
            </Grid2>

            {/* Produto */}
            <Grid2 container direction='row' spacing={2}>
              <ReusableGrid>
                <RAutoComplete
                  control={control}
                  isExternalLoading={isLoading}
                  name='CodigoProduto'
                  label='Produto'
                  source='ProductService'
                />
              </ReusableGrid>
            </Grid2>



          </Grid2>
        </Box>
      </FormProvider>
    </LayoutBaseDePagina>
  );
};
