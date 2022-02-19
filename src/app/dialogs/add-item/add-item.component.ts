import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TobuyService } from 'src/app/service/tobuy.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {
  text = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<AddItemComponent>, private tobuyService: TobuyService) {
    if (data) {
      console.log('data', data);
    }
    this.dialogRef.updateSize('300vw','300vw')
  }

  ngOnInit(): void {
  }

  onConfirmClick(): void {
    if(this.text) {
      this.tobuyService.insertToBuy({ text: this.text }).subscribe(
        (res) => {
          this.dialogRef.close(true);
        }
      );
    }
  }

  onCancelClick(): void {
    this.dialogRef.close(true);
  }

}
