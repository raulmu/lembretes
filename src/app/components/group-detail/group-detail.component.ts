import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Action } from '../../model/action';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss'],
})
export class GroupDetailComponent implements OnInit {
  @Input() group;

  @Input() user;

  @Input() title = 'Detalhes do Grupo';

  @Input() action: Action = null;

  @Output() primaryActionEvent = new EventEmitter<string>();

  public showMembers = false;

  constructor() {}

  ngOnInit(): void {}

  primaryActionClick() {
    if (this.action) {
      this.primaryActionEvent.emit(this.action.caption);
    }
  }
}
