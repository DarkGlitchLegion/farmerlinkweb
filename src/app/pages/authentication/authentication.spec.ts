import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdminApi } from '../../admin-api';
import { Authentication } from './authentication';

describe('Authentication', () => {
  let component: Authentication;
  let fixture: ComponentFixture<Authentication>;
  const loginCalls: Array<[string, string]> = [];

  beforeEach(async () => {
    loginCalls.length = 0;
    await TestBed.configureTestingModule({
      imports: [Authentication],
      providers: [
        provideRouter([]),
        { provide: AdminApi, useValue: { login: async (email: string, password: string) => { loginCalls.push([email, password]); } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Authentication);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the admin sign-in form and authentication endpoint', () => {
    const html = fixture.nativeElement as HTMLElement;
    expect(html.querySelector('h2')?.textContent).toContain('Welcome back');
    expect(html.querySelector('input[type="email"]')).toBeTruthy();
    expect(html.querySelector('input[autocomplete="current-password"]')).toBeTruthy();
    expect(html.textContent).toContain('POST /api/v1/auth/login');
  });

  it('submits trimmed email and password through the admin authentication service', async () => {
    component.email = ' admin@example.com ';
    component.password = 'secret-password';
    await component.signIn();
    expect(loginCalls).toEqual([['admin@example.com', 'secret-password']]);
  });
});
