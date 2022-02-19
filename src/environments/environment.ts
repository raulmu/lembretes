import { authConfig } from '../../auth_config';

export const environment = {
  production: false,
  auth: {
    ...authConfig,
    redirectUri: 'https://angular-hasura-shopping-list--4200.local.webcontainer.io/',
  },
};
