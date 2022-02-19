import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  
  constructor(private route : ActivatedRoute) {}

  ngOnInit() {
    //console.log('this.route.queryParams', this.route.queryParams);
    //console.log('this.route.params', this.route.params);
  }

}
