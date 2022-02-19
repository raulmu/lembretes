import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root'
})
export class JwtauthService {

  constructor(private auth: AuthService) { }

  public async manualRefreshToken() {
    const tokenOptions = {
      audience: 'https://hasura.io/jwt/claims',
    };
    this.auth.getAccessTokenSilently(tokenOptions).subscribe((token) => {
      localStorage.setItem('access_token', token);
    });
  }
}
