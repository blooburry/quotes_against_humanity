import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input()
  routes: {
    title: string,
    url: string,
  }[] = [];
  @Input()
  currentRouteUrl: string | undefined;

  constructor(){}
}
