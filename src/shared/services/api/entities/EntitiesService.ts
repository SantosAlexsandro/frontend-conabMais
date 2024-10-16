import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface IListagemPessoa {
  id: number;
  Codigo: string;
  Nome: string;
}

interface ICategoria {
  Operacao: string;
  Codigo: string;
}

export interface IDetalheEntidade {
  id: number;
  Nome: string;
  // CodigoRegiao: string;
}

type TPessoasComTotalCount = {
  data: IListagemPessoa[];
  totalCount: number;
};

const getAll = async (
  page = 1,
  filter = ''
): Promise<TPessoasComTotalCount | Error> => {
  try {
    // const urlRelativa = `/entidades?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nomeCompleto_like=${filter}`;
    const urlRelativa = '/entities';
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

/*
const getById = async (id: number): Promise<IDetalheEntidade | Error> => {
  try {
    const { data } = await Api.get(`/pessoas/${id}`);

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || 'Erro ao consultar o registro.'
    );
  }
};*/

const create = async (
  dados: Omit<IDetalheEntidade, 'id'>
): Promise<number | Error> => {
  try {
    const { data } = await Api.post<IDetalheEntidade>(
      '/entities',
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

/*
const updateById = async (
  id: number,
  dados: IDetalheEntidade
): Promise<void | Error> => {
  try {
    await Api.put(`/pessoas/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || 'Erro ao atualizar o registro.'
    );
  }
};


const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/pessoas/${id}`);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || 'Erro ao apagar o registro.'
    );
  }
};*/

export const PessoasService = {
  getAll,
  create,
  //getById,
  //updateById,
  //deleteById,
};
