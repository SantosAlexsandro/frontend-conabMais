import { useEffect, useState } from 'react';
import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

import { PessoasService } from '../../shared/services/api/entities/EntitiesService';
import { VTextField, VForm, useVForm, IVFormErrors } from '../../shared/forms';
import { AutoCompleteCidade } from './components/AutoCompleteCidade';
import { FerramentasDeDetalhe } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';

interface ICategoria {
  Operacao: string;
  Codigo: string;
  AtivaTabelaPreco: 'Sim' | 'Não'; // Definindo os valores aceitos como "Sim" ou "Não"
}

interface IFormData {
  Nome: string;
  CodigoRegiao: string;
  CaracteristicaImovel: number;
  Categorias: ICategoria[]; // Um array de categorias
}
const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
  // cidadeId: yup.number().required(),
  Nome: yup.string().required(),
  CodigoRegiao: yup.string().required(),
  CaracteristicaImovel: yup.number().required(),

  // Validação do array de categorias
  Categorias: yup
    .array()
    .of(
      yup.object().shape({
        Operacao: yup.string().required('Operação é obrigatória'),
        Codigo: yup.string().required('Código é obrigatório'),
        AtivaTabelaPreco: yup
          .mixed<'Sim' | 'Não'>()
          .oneOf(['Sim', 'Não'], 'AtivaTabelaPreco deve ser Sim ou Não')
          .required('AtivaTabelaPreco é obrigatória'),
      })
    )
    .min(1, 'Pelo menos uma categoria é necessária'), // Valida se há pelo menos uma categoria no array
});

export const EntitiesDetail: React.FC = () => {
  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();
  const { id = 'nova' } = useParams<'id'>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState('');

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
          formRef.current?.setData(result);
        }
      });
    } else {
      formRef.current?.setData({
        email: '',
        nomeCompleto: '',
        cidadeId: undefined,
      });
    }
  }, [id]);

  const handleSave = (dados: IFormData) => {
    console.log('dados', dados);
    const { Nome, CodigoRegiao, CaracteristicaImovel, Categorias } = dados;

    // Criando o payload
    const payload = {
      Nome,
      CodigoRegiao,
      CaracteristicaImovel,
      Categorias: Categorias.map(({ Operacao, Codigo, AtivaTabelaPreco }) => ({
        Operacao,
        Codigo,
        AtivaTabelaPreco,
      })),
    };

    formValidationSchema
      .validate(payload, { abortEarly: false })
      .then((dadosValidados) => {
        setIsLoading(true);

        if (id === 'nova') {
          PessoasService.create(dadosValidados).then((result) => {
            setIsLoading(false);

            if (result instanceof Error) {
              console.log(result.message);
            } else {
              if (isSaveAndClose()) {
                navigate('/pessoas');
              } else {
                navigate(`/pessoas/detalhe/${result}`);
              }
            }
          });
        } else {
          PessoasService.updateById(Number(id), {
            id: Number(id),
            ...dadosValidados,
          }).then((result) => {
            setIsLoading(false);

            if (result instanceof Error) {
              alert(result.message);
            } else {
              if (isSaveAndClose()) {
                navigate('/pessoas');
              }
            }
          });
        }
      })
      .catch((errors: yup.ValidationError) => {
        const validationErrors: IVFormErrors = {};

        errors.inner.forEach((error) => {
          if (!error.path) return;

          validationErrors[error.path] = error.message;
        });

        formRef.current?.setErrors(validationErrors);
      });
  };

  const handleDelete = (id: number) => {
    if (confirm('Realmente deseja apagar?')) {
      PessoasService.deleteById(id).then((result) => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          alert('Registro apagado com sucesso!');
          navigate('/pessoas');
        }
      });
    }
  };

  return (
    <LayoutBaseDePagina
      titulo={id === 'nova' ? 'Nova entidade' : nome}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo='Nova'
          mostrarBotaoSalvarEFechar
          mostrarBotaoNovo={id !== 'nova'}
          mostrarBotaoApagar={id !== 'nova'}
          aoClicarEmSalvar={save}
          aoClicarEmSalvarEFechar={saveAndClose}
          aoClicarEmVoltar={() => navigate('/entidades')}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmNovo={() => navigate('/entidades/detalhe/nova')}
        />
      }
    >
      <VForm ref={formRef} onSubmit={handleSave}>
        <Box
          margin={1}
          display='flex'
          flexDirection='column'
          component={Paper}
          variant='outlined'
        >
          <Grid container direction='column' padding={2} spacing={2}>
            {isLoading && (
              <Grid item>
                <LinearProgress variant='indeterminate' />
              </Grid>
            )}

            <Grid item>
              <Typography variant='h6'>Geral</Typography>
            </Grid>

            <Grid container item direction='row' spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name='Nome'
                  disabled={isLoading}
                  label='Nome'
                  onChange={(e) => setNome(e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid container item direction='row' spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name='CodigoRegiao'
                  label='Código da Região'
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            <Grid container item direction='row' spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name='CaracteristicaImovel'
                  label='Característica do Imóvel'
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            <Grid container item direction='row' spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name='Operacao'
                  label='Operação'
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name='Codigo'
                  label='Código'
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name='AtivaTabelaPreco'
                  label='Ativa tabela de preço'
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            <Grid container item direction='row' spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                {/*<AutoCompleteCidade isExternalLoading={isLoading} />*/}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </VForm>
    </LayoutBaseDePagina>
  );
};
