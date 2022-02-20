import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  showAuthor = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.showAuthor = this.router.url == '/';
  }
}
