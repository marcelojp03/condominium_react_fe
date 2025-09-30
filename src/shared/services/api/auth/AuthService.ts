import { Api } from '../axios-config';

interface IUser {
  email: string;
  id: number;
  name: string;
  photo: string | null;
  roles: Array<{ role: string; role_id: number; user_id: number; user_name: string }>;
  status: boolean;
}

interface IAuthResponse {
  token: string;
  usuario: IUser;
}

const auth = async (correo: string, password: string): Promise<IAuthResponse | Error | any> => {
  try {
    // Realiza una solicitud POST en lugar de GET, ya que estás enviando credenciales
    const { data } = await Api.post('/ad/auth/login', { correo: correo, password: password });
    console.info("AuthService::RESPONSE: ", data);
    // if (data.status === 'success') {
    //   // Devuelve el token y la información del usuario si el login fue exitoso
    //   return data.data;
    // } else {
    //   // Devuelve un error si la respuesta tiene un estado diferente a 'success'
    //   return new Error(data.message || 'Error en el login.');
    // }

    if (data.codigo === 0) {
      // Devuelve el token y la información del usuario si el login fue exitoso
      return data;
    } else {
      // Devuelve un error si la respuesta tiene un estado diferente a 'success'
      return new Error(data.message || 'Error en el login.');
      //return data;
    }
  } catch (error:any) {
    if (error.response) {
      // Error HTTP (e.g., 400 Bad Request), puedes acceder a error.response.data
      console.error("Error en el login - response error: ", error.response.data);
      //return new Error(error.response.data.description || 'Error en el login.');
      return error.response.data;
    }
  }
};

export const AuthService = {
  auth,
};
