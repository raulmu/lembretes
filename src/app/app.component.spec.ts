import { AuthenticationButtonComponent } from './components/authentication-button/authentication-button.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthModule } from '@auth0/auth0-angular';
import { AppComponent } from './app.component';
import { environment as env } from '../environments/environment';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AuthModule.forRoot({
            ...env.auth,
        }),
        MatSnackBarModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule,
        MatDividerModule
      ],
      declarations: [
        AppComponent,
        NavBarComponent,
        FooterComponent,
        MainNavComponent,
        AuthenticationButtonComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Lembretes'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Lembretes');
  });

});