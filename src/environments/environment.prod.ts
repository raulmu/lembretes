import { authConfig } from '../../auth_config';

export const environment = {
  production: true,
  auth: {
    ...authConfig,
    redirectUri: 'https://raulmu.github.io/lembretes/',
  },
};
