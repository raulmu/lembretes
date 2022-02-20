import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { environment as env } from '../../../environments/environment';

@Component({
  selector: 'app-logout-button',
  templateUrl: './logout-button.component.html',
  styles: [],
})
export class LogoutButtonComponent implements OnInit {
  constructor(
    public auth: AuthService,
    @Inject(DOCUMENT) private doc: Document,
    private router: Router
  ) {}

  ngOnInit(): void {}

  logout(): void {
    console.log('env.auth.redirectUri', env.auth.redirectUri);
    this.auth.logout({ returnTo: env.auth.redirectUri });
    this.router.navigate(['']);
  }
}
