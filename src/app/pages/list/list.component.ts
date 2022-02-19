import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddItemComponent } from 'src/app/dialogs/add-item/add-item.component';
import { GroupService } from 'src/app/service/group.service';
import { JwtauthService } from 'src/app/service/jwtauth.service';
import { LoaderService } from 'src/app/service/loader.service';
import { TobuyService } from 'src/app/service/tobuy.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  public items = [];
  error: string = null;
  public user = null;

  constructor(
    private dialog: MatDialog, private tobuyService: TobuyService,
    private groupService: GroupService, public loaderService: LoaderService) {}

  get tobuyItems() {
    return this.items.filter((x) => !x.is_completed && !x.is_archived );
  }

  get boughtItems() {
    return this.items.filter((x) => x.is_completed && !x.is_archived);
  }

  get archivedItems() {
    return this.items.filter((x) => x.is_archived );
  }

  async ngOnInit() {
    this.groupService.getUserWithGroup().subscribe((res) => {
      this.user = res.data.users[0];
    });
    this.groupService.fetchUserWithGroup();
    this.tobuyService.watchUserTobuys().valueChanges.subscribe((res: any) => {
      if(!res.data.vw_tobuys) {
        return;
      }
      this.items = res.data.vw_tobuys;
    });
    this.callApiWS();
  }

  callApiWS() {
    this.tobuyService.watchUserTobuys().subscribeToMore({
      document: this.tobuyService.SUBS_USER_TOBUY,
      updateQuery: (prev, { subscriptionData }) => {
        if(!subscriptionData.data.vw_tobuys){
          return prev;
        }
        return subscriptionData.data;
      },
    });
  }

  openAddItemDialog() {
    const dialogRef = this.dialog.open(AddItemComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal',
    });
    dialogRef.afterClosed().subscribe((_) => {
      // this.tobuyService.watchUserTobuys().refetch();
    });
  }


}
