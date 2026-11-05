import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('FarmerLink admin app', () => {
  beforeEach(async () => {
    if (typeof sessionStorage !== 'undefined') sessionStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('creates the application shell', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows the admin-only sign-in page', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/login');
    await fixture.whenStable();
    fixture.detectChanges();
    const html = fixture.nativeElement as HTMLElement;
    expect(html.querySelector('h2')?.textContent).toContain('Welcome back');
    expect(html.querySelector('button[type="submit"]')?.textContent).toContain('Sign in to your account');
    expect(html.textContent).not.toContain('Create account');
  });
});
