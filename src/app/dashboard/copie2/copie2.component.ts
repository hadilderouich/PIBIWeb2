import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-copie2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './copie2.component.html',
  styleUrl: './copie2.component.css'
})
export class Copie2Component {
  userEmail: string = '';

  constructor(private router: Router) {}

  logout(): void {
    // Clear any session data if needed
    this.router.navigate(['/login']);
  }
}
