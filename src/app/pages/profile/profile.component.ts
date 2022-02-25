import { Component, OnInit } from '@angular/core';
import { concatMap, tap, pluck } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
// import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileJson: string = null;

  metadataJson: string = null;

  user: any = {};

  constructor(
    // public auth: AuthService, 
    private http: HttpClient) {}

  ngOnInit(): void {

    /* this.auth.user$
    .pipe(
      concatMap((user) =>{
        // Use HttpClient to make the call
        this.profileJson = JSON.stringify(user, null, 2);
        // console.log('user',user);
        return this.http.get(
          encodeURI(`https://dev-3ieb1obv.us.auth0.com/api/v2/users/${user.sub}`)
        );
      }),
      pluck('user_metadata'),
      tap((meta) => 
      {
        console.log('meta',meta);
        return this.metadataJson = JSON.stringify(meta, null, 2);
      })
    )
    .subscribe(); */
  }
}
