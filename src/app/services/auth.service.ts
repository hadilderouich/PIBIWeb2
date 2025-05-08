import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface UserCredentials {
  email: string;
  password: string;
}

interface UserDashboardAccess {
  email: string;
  dashboard: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  dashboard?: string;
  token?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:5000';
  private currentUserSubject: BehaviorSubject<AuthResponse>;
  public currentUser: Observable<AuthResponse>;

  constructor(private http: HttpClient) {
    const storedUser = this.getStoredUser();
    this.currentUserSubject = new BehaviorSubject<AuthResponse>(storedUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private getStoredUser(): AuthResponse {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : { success: false, message: '' };
      }
      return { success: false, message: '' };
    } catch {
      return { success: false, message: '' };
    }
  }

  public get currentUserValue(): AuthResponse {
    return this.currentUserSubject.value;
  }

  login(credentials: UserCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/auth/login`,
      credentials
    ).pipe(
      map((user: AuthResponse) => {
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
        } catch {
          // If localStorage fails, we'll still return the user data
        }
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  logout(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('currentUser');
      }
    } catch {
      // If localStorage fails, we'll still clear the subject
    }
    this.currentUserSubject.next({ success: false, message: '' });
  }

  isLoggedIn(): boolean {
    const user = this.currentUserValue;
    return user && user.token !== undefined;
  }

  getDashboardAccess(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/dashboard-access/${email}`);
  }

  // Helper method to check if user has access to a specific dashboard
  hasAccessToDashboard(email: string, dashboard: string): Observable<boolean> {
    return this.getDashboardAccess(email).pipe(
      map(access => access.dashboard === dashboard)
    );
  }
}
