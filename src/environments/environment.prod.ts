import { authConfig } from '../../auth_config';

export const environment = {
  production: true,
  auth: {
    ...authConfig,
    redirectUri: 'https://raul.seve.com.br/lembretes/',
  },
};
