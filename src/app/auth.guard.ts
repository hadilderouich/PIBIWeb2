import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private router = inject(Router);

  canActivate(): boolean {
    const email = localStorage.getItem('userEmail');
    const password = localStorage.getItem('userPassword');
    
    if (!email || !password) {
      this.router.navigate(['/login']);
      return false;
    }

    // Define the type for allowed emails
    interface AllowedEmails {
      [key: string]: string;
    }

    // Verify credentials
    const allowedEmails: AllowedEmails = {
      'wala.aloulou@esprit.tn': 'Password123',
      'bahaeddine.elfidha@esprit.tn': 'Password123',
      'hadil.derouich@esprit.tn': 'Password123',
      'meriem.dghaies@esprit.tn': 'Password123',
      'hadil.miladi@gmail.com': 'Password123',
      'mouhib.jendoubi@esprit.tn': 'Password123'
    };

    // Type assertion to ensure the email exists in the object
    const correctPassword = email in allowedEmails ? allowedEmails[email] : null;
    if (!correctPassword || password !== correctPassword) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
