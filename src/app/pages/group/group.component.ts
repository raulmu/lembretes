import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GroupService } from 'src/app/service/group.service';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { SnackBar } from 'src/app/model/snack-bar';
import { Action } from 'src/app/model/action';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit {
  public user = null;
  public ownerEmail = '';
  private subscriptionGroupOfOwnerEmail: Subscription = null;
  public foundGroup = null;
  public myGroupName = '';

  constructor(
    private groupService: GroupService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.groupService.getUserWithGroup().subscribe((res) => {
      this.user = res.data.users[0];
    });
    this.groupService.fetchUserWithGroup();
  }

  onSearchClick() {
    if (this.ownerEmail && this.ownerEmail.length) {
      console.log(`procurando grupo do "${this.ownerEmail}"`);
      if (this.subscriptionGroupOfOwnerEmail) {
        this.subscriptionGroupOfOwnerEmail.unsubscribe();
      }
      this.subscriptionGroupOfOwnerEmail = this.groupService
        .queryGroupOfOwnerEmail(this.ownerEmail)
        .valueChanges.subscribe((res: any) => {
          console.log(res);
          this.foundGroup = res.data.groups[0];
          if (!this.foundGroup) {
            const snackBar: SnackBar = {
              message: 'Grupo não encontrado',
              action: 'Ok',
            };
            this.snackBarService.snackBar.next(snackBar);
          }
        });
    }
  }

  onCreateClick() {
    console.log(`nome do meu grupo "${this.myGroupName}"`);
  }

  onSubscribeGroupClick(): void {
    if (this.foundGroup && this.user) {
      this.groupService
        .updateUserGroupId({
          groupId: this.foundGroup.id,
          userId: this.user.id,
        })
        .subscribe((res) => {
          this.groupService.fetchUserWithGroup();
        });
    }
  }

  userHaveGroup(): boolean {
    return this.user ? this.user.own_group || this.user.on_group : false;
  }

  getUserGroup() {
    if(this.userHaveGroup()) {
      return this.user.own_group || this.user.on_group;
    } else {
      return null;
    }
  }

  userIsOwner(): boolean {
    if(this.userHaveGroup()) {
      return this.user.own_group ? true : false;
    } else {
      return false;
    }
  }

  getAction(): Action {
    if(this.foundGroup && !this.userHaveGroup()){
      return { caption: 'Participar', disabled: false }
    }
    if(this.userHaveGroup() &&  !this.userIsOwner()){
      if(this.user.is_group_granted) {
        return { caption: 'Sair do Grupo', disabled: false }
      } else {
        return { caption: 'Aguardando Aprovação', disabled: true }
      }
    }
    if(this.userHaveGroup() &&  this.userIsOwner()){
      return { caption: 'Excluir Grupo', disabled: false }
    }
  }
}
