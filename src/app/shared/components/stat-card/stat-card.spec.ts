import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatCardComponent } from './stat-card';

describe('StatCardComponent', () => {
  let component: StatCardComponent;
  let fixture: ComponentFixture<StatCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatCardComponent);
    component = fixture.componentInstance;
  });

  it('renders metric label and value', () => {
    component.label = 'Total Farmers';
    component.value = '1,420';
    component.icon = 'farmer-profiles';
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.stat-label')?.textContent).toContain('Total Farmers');
    expect(el.querySelector('.stat-value')?.textContent).toContain('1,420');
  });
});

