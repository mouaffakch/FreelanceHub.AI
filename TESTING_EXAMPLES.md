// Example test file for AuthService
// Run with: ng test

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { LoginRequest, AuthResponse } from '../../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8080/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('login', () => {
    it('should make a POST request to /auth/login', () => {
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockResponse: AuthResponse = {
        token: 'fake-jwt-token',
        user: {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@example.com',
          roleName: 'CLIENT'
        }
      };

      service.login(credentials).subscribe(response => {
        expect(response.token).toBe('fake-jwt-token');
        expect(response.user.email).toBe('test@example.com');
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);

      req.flush(mockResponse);
    });

    it('should store token and user in localStorage after login', () => {
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockResponse: AuthResponse = {
        token: 'fake-jwt-token',
        user: {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@example.com',
          roleName: 'CLIENT'
        }
      };

      service.login(credentials).subscribe(() => {
        expect(localStorage.getItem('token')).toBe('fake-jwt-token');
        expect(localStorage.getItem('user')).toBeTruthy();
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/login`);
      req.flush(mockResponse);
    });
  });

  describe('logout', () => {
    it('should clear localStorage', () => {
      localStorage.setItem('token', 'fake-token');
      localStorage.setItem('user', JSON.stringify({ id: 1 }));

      service.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });

    it('should set currentUser to null', (done) => {
      service.currentUser$.subscribe(user => {
        if (user === null) {
          done();
        }
      });

      service.logout();
    });
  });

  describe('isLoggedIn', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('token', 'fake-token');
      expect(service.isLoggedIn()).toBe(true);
    });

    it('should return false when token does not exist', () => {
      localStorage.removeItem('token');
      expect(service.isLoggedIn()).toBe(false);
    });
  });

  describe('getRole', () => {
    it('should return user role from localStorage', () => {
      const user = { id: 1, roleName: 'CLIENT' };
      localStorage.setItem('user', JSON.stringify(user));

      expect(service.getRole()).toBe('CLIENT');
    });

    it('should return null when user is not in localStorage', () => {
      localStorage.removeItem('user');
      expect(service.getRole()).toBeNull();
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      const token = 'fake-jwt-token';
      localStorage.setItem('token', token);

      expect(service.getToken()).toBe(token);
    });

    it('should return null when token does not exist', () => {
      localStorage.removeItem('token');
      expect(service.getToken()).toBeNull();
    });
  });
});

/*
 * Additional Test Examples:
 * 
 * describe('ProjectService', () => {
 *   let service: ProjectService;
 *   let httpMock: HttpTestingController;
 *
 *   beforeEach(() => {
 *     TestBed.configureTestingModule({
 *       imports: [HttpClientTestingModule],
 *       providers: [ProjectService]
 *     });
 *     service = TestBed.inject(ProjectService);
 *     httpMock = TestBed.inject(HttpTestingController);
 *   });
 *
 *   it('should fetch all projects', () => {
 *     const mockProjects = [
 *       { id: 1, title: 'Project 1', budget: 1000 },
 *       { id: 2, title: 'Project 2', budget: 2000 }
 *     ];
 *
 *     service.getAll().subscribe(projects => {
 *       expect(projects.length).toBe(2);
 *     });
 *
 *     const req = httpMock.expectOne('http://localhost:8080/api/projects');
 *     expect(req.request.method).toBe('GET');
 *     req.flush(mockProjects);
 *   });
 * });
 *
 * describe('LoginComponent', () => {
 *   let component: LoginComponent;
 *   let fixture: ComponentFixture<LoginComponent>;
 *   let authService: AuthService;
 *
 *   beforeEach(async () => {
 *     await TestBed.configureTestingModule({
 *       imports: [LoginComponent]
 *     }).compileComponents();
 *
 *     fixture = TestBed.createComponent(LoginComponent);
 *     component = fixture.componentInstance;
 *     authService = TestBed.inject(AuthService);
 *     fixture.detectChanges();
 *   });
 *
 *   it('should create', () => {
 *     expect(component).toBeTruthy();
 *   });
 *
 *   it('should have invalid form when empty', () => {
 *     expect(component.loginForm.invalid).toBeTruthy();
 *   });
 *
 *   it('should enable submit button when form is valid', () => {
 *     component.loginForm.setValue({
 *       email: 'test@example.com',
 *       password: 'password123'
 *     });
 *     fixture.detectChanges();
 *     const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
 *     expect(submitButton.disabled).toBeFalsy();
 *   });
 * });
 */
