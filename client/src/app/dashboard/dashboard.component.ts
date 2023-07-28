import { Component } from '@angular/core';
import { SessionService } from 'api/session.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(
    private session: SessionService
  ){

  }

  username = this.session.username;
  communities = ['Group 17', 'Chaotic Idiots', 'QT', 'Metamates'];
}
