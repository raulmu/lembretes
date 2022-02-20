import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { environment as env } from '../../../environments/environment';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit {

  constructor(private router: Router, public auth: AuthService,
    @Inject(DOCUMENT) private doc: Document) { }

  ngOnInit(): void {
  }

  navigate(route: string) {
    this.router.navigate(['/', route]);
  }

  logout(): void {
    
    this.auth.logout({ localOnly: false, returnTo: env.auth.redirectUri });
    //this.router.navigate(['/', route]);
  }

}
