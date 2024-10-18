import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface IListagemOS {
  id: number;
  Numero: string;
  Nome: string;
  CodigoEntidade: string;
  CodigoProduto: string;
  CodigoTipoOrdServ: string;
}


export interface IDetalheEntidade {
  id: number;
  CodigoEntidade: string;
  CodigoTipoOrdServ: string;
  CodigoTipoAtendContrato: string;
  CodigoProduto: string;
}

type TPessoasComTotalCount = {
  data: IListagemOS[];
  totalCount: number;
};

const getAll = async (
  page = 1,
  filter = ''
): Promise<TPessoasComTotalCount | Error> => {
  try {
    const urlRelativa = '/work-orders';
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
    console.error(error);
    return new Error(
      (error as { message: string }).message || 'Erro ao listar os registros.'
    );
  }
};

const create = async (
  dados: Omit<IDetalheEntidade, 'id'>
): Promise<number | Error> => {
  try {
    const { data } = await Api.post<IDetalheEntidade>(
      '/work-orders',
      dados
    );

    if (data) {
      return data.id;
    }

    return new Error('Erro ao criar o registro.');
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || 'Erro ao criar o registro.'
    );
  }
};

export const WorkOrdersService = {
  getAll,
  create
};
