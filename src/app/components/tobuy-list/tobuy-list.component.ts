import { Component, OnInit, Input } from '@angular/core';
import { TobuyService } from 'src/app/service/tobuy.service';

@Component({
  selector: 'app-tobuy-list',
  templateUrl: './tobuy-list.component.html',
  styleUrls: ['./tobuy-list.component.scss']
})
export class TobuyListComponent implements OnInit {
  @Input() items = []

  @Input() user = null;

  constructor(private tobuyService: TobuyService) { }

  ngOnInit(): void {
    //console.log('user', this.user);
  }

  toggleCompleted(value,item) {
    this.tobuyService.updateComleted({id: item.id, isCompleted: value.checked}).subscribe();
  }

  toggleArchived(value,item) {
    this.tobuyService.updateDeleted({id: item.id, isDeleted: value}).subscribe();
  }

  changeGroup(item) {
    const userGroupId = this.user.own_group ? this.user.own_group.id : (this.user.is_group_granted ? this.user.group_id : null);
    const groupId = item.group_id ? null : userGroupId;
    if(userGroupId) {
      this.tobuyService.updateGroup({id: item.id, groupId: groupId}).subscribe();
    }
  }

}
