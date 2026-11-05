import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppIconComponent } from './app-icon';

describe('AppIconComponent', () => {
  let component: AppIconComponent;
  let fixture: ComponentFixture<AppIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppIconComponent);
    component = fixture.componentInstance;
  });

  it('creates successfully', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('renders an SVG element with custom size', () => {
    component.size = 24;
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg.getAttribute('width')).toBe('24');
    expect(svg.getAttribute('height')).toBe('24');
  });
});
