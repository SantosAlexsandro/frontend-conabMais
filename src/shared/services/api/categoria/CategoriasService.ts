import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface IListagemCategoria {
  Codigo: string;
  Nome: string;
}


type TCidadesComTotalCount = {
  data: IListagemCategoria[];
  totalCount: number;
};

const getAll = async (
  page = 1,
  filter = '', 
  id = ''
): Promise<TCidadesComTotalCount | Error> => {
  try {
    const urlRelativa =
    // `/api/Regiao/RetrievePage?filter&order=&pageSize=${Environment.LIMITE_DE_LINHAS}&pageIndex=1`;
    //const urlRelativa = `/cidades?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}&id_like=${id}`;
    //'/api/Categoria/RetrievePage?filter=&order&pageSize=100&pageIndex=1';
    'api/regioes?filter&page';
    const { data, headers } = await Api.get(urlRelativa);
    if (data) {
      return {
        data,
        totalCount: Number(
          headers['x-total-count'] || Environment.LIMITE_DE_LINHAS
        ),
      };
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    console.error('ERROR OBTER CATEGORIAS', error);
    return new Error(
      (error as { message: string }).message || 'Erro ao listar os registros.'
    );
  }
};


export const CategoriasService = {
  getAll
};
