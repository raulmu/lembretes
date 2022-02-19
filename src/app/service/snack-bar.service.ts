import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SnackBar } from '../model/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  public snackBar: BehaviorSubject<SnackBar> = new BehaviorSubject<SnackBar>(null);

  constructor() { }

}
