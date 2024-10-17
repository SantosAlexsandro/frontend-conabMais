import { useEffect, useState } from 'react';
import { ReusableGrid } from '../../shared/forms/ReusableGrid'; // Importe o componente
import {
  Box,
  Grid2,
  LinearProgress,
  Paper,
  Typography
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import {
  useForm,
  FormProvider,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { FerramentasDeDetalhe } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { RAutoComplete } from '../../shared/forms/RAutoComplete';
import { WorkOrdersService } from '../../shared/services/api/workOrders/WorkOrdersService';


// Definir o schema Yup para o formulário
const formValidationSchema = yup.object({
  CodigoEntidade: yup.string().required('Entidade é obrigatório.'),
  CodigoTipoOrdServ: yup.string().required('Tipo da Ordem de Serviço é obrigatório.'),
  CodigoTipoAtendContrato: yup.string().required('Tipo de atendimento é obrigatório.'),
  CodigoProduto: yup.string().required('Produto é obrigatório.'),
});

// Tipo derivado do schema do Yup
type IFormData = yup.InferType<typeof formValidationSchema>;

export const WorkOrdersDetail: React.FC = () => {
  const methods = useForm<IFormData>({
    resolver: yupResolver(formValidationSchema),
    mode: 'onSubmit',
    defaultValues: {
      CodigoEntidade: '',
    },
  });

  const { control, handleSubmit } = methods;

  const { id = 'nova' } = useParams<'id'>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (dados: IFormData) => {
    setIsLoading(true);
    if (id === 'nova') {
      WorkOrdersService.create(dados).then((result) => {
        setIsLoading(false);
        alert('Ordem de Serviço cadastrada com sucesso.');
        navigate('/ordens-de-servico');
        if (result instanceof Error) {
          console.log('erro', result.message);
        }
      });
    }
  };

  return (
    <LayoutBaseDePagina
      titulo={id === 'nova' ? 'Nova Ordem de Serviço' : ''}
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
                  source='TypeAssistancesService'
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
