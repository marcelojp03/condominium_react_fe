import { Environment } from '../../../environment';
import { Api } from '../axios-config';


export interface IListagemCidade {
  id: number;
  nome: string;
}

export interface IDetalheCidade {
  id: number;
  nome: string;
}

export interface IDetalheCidadeData {
  id: number;
  nome: string;
}

type TCidadesComTotalCount = {
  data: IListagemCidade[];
  totalCount: number;
}

const getAll = async (page = 1, filter = '', id = ''): Promise<TCidadesComTotalCount | Error> => {
  let idf="services::ciddes::getAll::";
  let ciudades: IListagemCidade[];
  let total=0
  try {
    const urlRelativa = `/adm/ciudad?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}&id_like=${id}`;

    const { data, headers } = await Api.get(urlRelativa);
    console.log(idf + "respuesta:",data.data);
    ciudades=data.data;
    total=data.paginacion.total_records
    if (data) {
      return {
        data:ciudades,
        //totalCount: Number(headers['x-total-count'] || Environment.LIMITE_DE_LINHAS),
        totalCount: Number(total || Environment.LIMITE_DE_LINHAS),
      };
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};

const getById = async (id: number): Promise<IDetalheCidade | Error> => {
  let idf='cidadesServide::getById::';
  let ciudad:IDetalheCidade;
  try {
    const { data } = await Api.get(`/adm/ciudad/${id}`);
    console.log(idf +'respuesta:',data);
    ciudad=data.data[0]
    console.log(idf+'ciudad:',ciudad);
    if (data) {
      return ciudad;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const create = async (dados: Omit<IDetalheCidade, 'id'>): Promise<number | Error> => {
  let idf='cidadesServide::create::';
  let ciudad:IDetalheCidade;
  console.log(idf + 'datos:',dados);
  try {
    const { data } = await Api.post<any>('/adm/ciudad/', dados);
    console.log(idf +'respuesta:',data);
    ciudad=data.data[0]
    console.log(idf +'ciudad:',ciudad);
    if (data) {
      return ciudad.id;
    }

    return new Error('Erro ao criar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
  }
};

const updateById = async (id: number, dados: IDetalheCidade): Promise<void | Error> => {
  let idf='cidadesServide::updateById::';
  console.log(idf + 'datos:',dados);
  try {
    const { data } = await Api.put(`/adm/ciudad/${id}`, dados);
    console.log(idf + 'respuesta:',data);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  let idf='cidadesServide::deleteById::';
  try {
    const { data } = await Api.delete(`/adm/ciudad/${id}`);
    console.log(idf +'respuesta:',data);
  } catch (error) {
    console.error(idf + "Exception:",error);
    return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
  }
};


export const CidadesService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
};
