import { Component } from '@angular/core';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-top-header',
  templateUrl: './top-header.component.html',
  styleUrl: './top-header.component.css'
})
export class TopHeaderComponent {
  user: any = {};
  constructor(private userService: UserService) { }
  ngOnInit(): void {
    this.userService.getUser().subscribe(data => {
      this.user = data;
    });
  }
}