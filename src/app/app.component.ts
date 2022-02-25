import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

//import { AuthService } from "@auth0/auth0-angular";

import { SnackBarService } from "./service/snack-bar.service";

import { SnackBar } from "./model/snack-bar";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "Lembretes";

  constructor(
    // public auth: AuthService,
    private matSnackBar: MatSnackBar,
    private snackBarService: SnackBarService
  ) {
    this.getToken();
    this.snackBarService.snackBar.subscribe((snackBar: SnackBar) => {
      if (snackBar != null) {
        this.matSnackBar.open(snackBar.message, snackBar.action);
      }
    });
  }

  ngOnInit(): void {
  }

  private async getToken() {
    /*
    const tokenOptions = {
      audience: "https://hasura.io/jwt/claims",
      //scope: 'read:accounts',
    };
    this.auth.getAccessTokenSilently(tokenOptions).subscribe((token) => {
      localStorage.setItem("access_token", token);
    });*/
  }
}
