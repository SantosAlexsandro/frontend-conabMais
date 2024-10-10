import { useEffect, useMemo, useState } from 'react';
import {
  Icon,
  IconButton,
  LinearProgress,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Box,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  IListagemPessoa,
  PessoasService,
} from '../../shared/services/api/entities/EntitiesService';
import { FerramentasDaListagem } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { useDebounce } from '../../shared/hooks';
import { Environment } from '../../shared/environment';

export const EntitiesList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  // const [rows, setRows] = useState<IListagemPessoa[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(2);
  // Exemplo de array
  const [dados, setDados] = useState([
    {
      id: 1,
      tipo: 'Empresa',
      nome: 'Conab',
      contato: '11912345678',
    },
    {
      id: 2,
      tipo: 'Pessoa',
      nome: 'Marcelo',
      contato: '11987654321',
    },
  ]);

  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);

  const pagina = useMemo(() => {
    return Number(searchParams.get('pagina') || '1');
  }, [searchParams]);


  /*useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      PessoasService.getAll(pagina, busca).then((result) => {
        setIsLoading(false);

        if (result instanceof Error) {
          alert(result.message);
        } else {
          console.log(result);

          setTotalCount(result.totalCount);
          setRows(result.data);
        }
      });
    });
  }, [busca, pagina]);*/

  const handleDelete = (id: number) => {
    if (confirm('Realmente deseja apagar?')) {
      PessoasService.deleteById(id).then((result) => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          /* setRows((oldRows) => [
            ...oldRows.filter((oldRow) => oldRow.id !== id),
          ]);*/
          alert('Registro apagado com sucesso!');
        }
      });
    }
  };

  return (
    <LayoutBaseDePagina
      titulo='Entidades Prospects'
      barraDeFerramentas={
        <FerramentasDaListagem
          mostrarInputBusca
          textoDaBusca={busca}
          textoBotaoNovo='Nova'
          aoClicarEmNovo={() => navigate('/entidades/detalhe/nova')}
          aoMudarTextoDeBusca={(texto) =>
            setSearchParams({ busca: texto, pagina: '1' }, { replace: true })
          }
        />
      }
    >
      <TableContainer
        component={Paper}
        variant='outlined'
        sx={{ m: 1, width: 'auto' }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={100}>Ações</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Nome/Razão</TableCell>
              <TableCell>Contato</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dados.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <IconButton size='small' onClick={() => handleDelete(row.id)}>
                    <Icon>delete</Icon>
                  </IconButton>
                  <IconButton
                    size='small'
                    onClick={() => navigate(`/entidades/detalhe/${row.id}`)}
                  >
                    <Icon>edit</Icon>
                  </IconButton>
                </TableCell>
                <TableCell>{row.tipo}</TableCell>
                <TableCell>{row.nome}</TableCell>
                <TableCell>11 123456789</TableCell>
                {/*<TableCell>{'Empresa'}</TableCell>
                <TableCell>{row.entity_first_name</TableCell>
                <TableCell>{row.entity_phone}</TableCell>
                <TableCell>{row.entity_email}</TableCell>*/}
              </TableRow>
            ))}
          </TableBody>

          {totalCount === 0 && !isLoading && (
            <caption>{Environment.LISTAGEM_VAZIA}</caption>
          )}

          <TableFooter>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3}>
                  <LinearProgress variant='indeterminate' />
                </TableCell>
              </TableRow>
            )}
           
            {totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS && (
              <TableRow>
                <TableCell colSpan={3}>
                  <Pagination
                    page={pagina}
                    count={Math.ceil(totalCount / Environment.LIMITE_DE_LINHAS)}
                    onChange={(_, newPage) =>
                      setSearchParams(
                        { busca, pagina: newPage.toString() },
                        { replace: true }
                      )
                    }
                  />
                </TableCell>
              </TableRow>
            )}

          </TableFooter>
        </Table>
      </TableContainer>
    </LayoutBaseDePagina>
  );
};
