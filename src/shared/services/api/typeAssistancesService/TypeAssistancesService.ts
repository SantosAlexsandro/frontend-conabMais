import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface IListagemCidade {
  Codigo: string;
  Nome: string;
}

export interface IDetalheCidade {
  id: number;
  nome: string;
}

type TCidadesComTotalCount = {
  data: IListagemCidade[];
  totalCount: number;
};

const getAll = async (): Promise<TCidadesComTotalCount | Error> => {
  try {
    const urlRelativa =
    'types-assistance';
    // `/api/Regiao/RetrievePage?filter&order=&pageSize=${Environment.LIMITE_DE_LINHAS}&pageIndex=1`;
    //const urlRelativa = `/cidades?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}&id_like=${id}`;
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
    console.error('ERROR AO OBTER TIPOS DA ORDEM DE SERVIÇO', error);
    return new Error(
      (error as { message: string }).message || 'Erro ao listar os registros.'
    );
  }
};


export const TypeAssistancesService = {
  getAll
};
