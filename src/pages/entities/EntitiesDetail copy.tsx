
/* eslint-disable */
// @ts-nocheck
import { useEffect, useState } from 'react';
import { Box, Grid, LinearProgress, Paper, Typography, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

import { PessoasService } from '../../shared/services/api/entities/EntitiesService';
import { FerramentasDeDetalhe } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { VTextField, VForm, useVForm, IVFormErrors } from '../../shared/forms';

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
  CaracteristicaImovel: yup.number().required('Características do imóvel são obrigatórias.'),
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
  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm(); // TODO: Delete
  const { id = 'nova' } = useParams<'id'>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState('');
  const [categorias, setCategorias] = useState<ICategoria[]>([{ Operacao: '', Codigo: ''}]); // Inicia com uma categoria

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
          setCategorias(result.Categorias || [{ Operacao: '', Codigo: '' }]);
        }
      });
    } else {
      formRef.current?.setData({
        Nome: '',
        CodigoRegiao: '',
        CaracteristicaImovel: undefined,
        Categorias: [{ Operacao: '', Codigo: '' }],
      });
    }
  }, [id]);

  const handleSave = (dados: IFormData) => {
    console.log('dados', dados);
    
    formValidationSchema.validate(dados, { abortEarly: false })
      .then((dadosValidados) => {
        setIsLoading(true);
        const saveData = { ...dadosValidados, Categorias: categorias };

        if (id === 'nova') {
          PessoasService.create(saveData).then((result) => {
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
          PessoasService.updateById(Number(id), { id: Number(id), ...saveData }).then((result) => {
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

            {/* Aqui começa a seção de categorias */}
            <Grid container item direction='row' spacing={2}>
              <Grid item xs={12}>
                <Typography variant='h6'>Categorias</Typography>
              </Grid>
              {categorias.map((categoria, index) => (
                <Grid container item key={index} spacing={2}>
                  <Grid item xs={4}>
                    <VTextField
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
                  </Grid>
                  <Grid item>
                  </Grid>
                </Grid>
              ))}
              <Grid item>
                <Button onClick={handleAddCategoria}>Adicionar Categoria</Button>
              </Grid>
            </Grid>
            
            <Grid item>
            </Grid>
          </Grid>
        </Box>
      </VForm>
    </LayoutBaseDePagina>
  );
};
