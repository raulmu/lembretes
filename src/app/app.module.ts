import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { environment as env } from '../environments/environment';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

import { split, InMemoryCache } from '@apollo/client/core';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginButtonComponent } from './components/login-button/login-button.component';
import { SignupButtonComponent } from './components/signup-button/signup-button.component';
import { LogoutButtonComponent } from './components/logout-button/logout-button.component';
import { AuthenticationButtonComponent } from './components/authentication-button/authentication-button.component';
import { AuthNavComponent } from './components/auth-nav/auth-nav.component';
import { LoadingComponent } from './components/loading/loading.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ListComponent } from './pages/list/list.component';
import { AppRoutingModule } from './app-routing.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AddItemComponent } from './dialogs/add-item/add-item.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { TobuyListComponent } from './components/tobuy-list/tobuy-list.component';
import { GroupComponent } from './pages/group/group.component';
import { JwtauthService } from './service/jwtauth.service';
import { hasuraConfig } from '../../hasura_config';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { InterceptorService } from './service/interceptor.service';
import { GroupDetailComponent } from './components/group-detail/group-detail.component';

registerLocaleData(ptBr);

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatCardModule,
    MatMenuModule,
    MatDialogModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatTabsModule,
    MatProgressBarModule,
    MatSnackBarModule,
    FormsModule,
    AuthModule.forRoot({
      // useRefreshTokens: true,
      cacheLocation: 'localstorage',
      // scope: 'offline_access',
      ...env.auth,
      //audience: 'https://YOUR_DOMAIN/api/v2/',
      httpInterceptor: {
        allowedList: [
          {
            uri: `https://${hasuraConfig.api}`,
            tokenOptions: {
              audience: 'https://hasura.io/jwt/claims',
              //scope: 'read:users',
            },
          },
          { uri: `wss://${hasuraConfig.api}`,
            tokenOptions: {
              audience: 'https://hasura.io/jwt/claims',
              //scope: 'read:users',
            },
          },
          {
            // Match any request that starts 'https://YOUR_DOMAIN/api/v2/' (note the asterisk)
            uri: 'https://dev-3ieb1obv.us.auth0.com/api/v2/*',
            tokenOptions: {
              // The attached token should target this audience
              audience: 'https://dev-3ieb1obv.us.auth0.com/api/v2/',
              // The attached token should have these scopes
              scope: 'read:current_user'
            }
          }          
        ]
      },
    }),
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    LoginButtonComponent,
    SignupButtonComponent,
    LogoutButtonComponent,
    AuthenticationButtonComponent,
    AuthNavComponent,
    LoadingComponent,
    NavBarComponent,
    FooterComponent,
    MainNavComponent,
    ProfileComponent,
    ListComponent,
    AddItemComponent,
    TobuyListComponent,
    GroupComponent,
    GroupDetailComponent,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        if(this.auth) {
          console.log('this.auth.manualRefreshToken()');
          this.auth.manualRefreshToken();
        }
        
        // const tokenOptions = {
        //   audience: 'https://hasura.io/jwt/claims',
        //   //scope: 'read:accounts',
        // };

        // let token = localStorage.getItem("access_token");

        // token = this.auth ? await this.auth.getAccessTokenSilently(tokenOptions).subscribe() : token;

        // Create an http link:
        /*const auth = setContext((operation, context) => ({
          headers: {
            Accept: 'charset=utf-8',
            Authorization: "Bearer " + (localStorage.getItem("access_token") || null),
            'x-hasura-group-id': "2"
          }
        }));*/
        // const http = ApolloLink.from([auth, httpLink.create({
        //   uri: 'https://pleased-parakeet-80.hasura.app/v1/graphql',
        // })]);
        const http = httpLink.create({
          uri: `https://${hasuraConfig.api}`,
        });

        // Create a WebSocket link:
        const ws = new WebSocketLink({
          uri: `wss://${hasuraConfig.api}`,
          options: {
            reconnect: true,
            connectionParams: {
              authToken: localStorage.getItem("access_token") || null,
              headers: {
                Authorization: "Bearer " + (localStorage.getItem("access_token") || null)
              }
            }
          },
        });

        // console.log("Bearer " + localStorage.getItem("access_token"));
        // using the ability to split links, you can send data to each link
        // depending on what kind of operation is being sent
        const link = split(
          // split based on operation type
          ({query}) => {
            const mainDefinition: any = getMainDefinition(query);
            // console.log('mainDefinition', mainDefinition);
            if(mainDefinition.kind!=='OperationDefinition') {
              return false;
            }
            return (
              mainDefinition.kind === 'OperationDefinition' && mainDefinition.operation === 'subscription'
            );
          },
          ws,
          http,
        );

        return {
          link,
          // ... options
          cache: new InMemoryCache()
        };
      },
      deps: [HttpLink],
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {

}
