import { Api } from '../axios-config';


interface IAuth {
  token: string;
}

const auth = async (email: string, password: string): Promise<IAuth | Error> => {
  try {
    console.log(email);
    console.log(password);
    /*
    const { data } = await Api.post('/tokens/', { email, password } );
    console.log('data', data);
    if (data) {
      return data;
    }*/

    if (
      (email === 'marcelo.pimentel@conab.com.br' && password === '123456') || 
        (email === 'alexsandro.santos@conab.com.br' && password === '123456') ||
        (email === 'hamilton.bertolucci@conab.com.br' && password === '123456') ||
        (email === 'pietro.bertolucci@conab.com.br' && password === '123456')
    ) {
      const data = { token: 'fake-jwt-token' };
      console.log('Mock data:', data);
      return data;
    }
      

    return new Error('Erro no login.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro no login.');
  }
};

export const AuthService = {
  auth,
};
