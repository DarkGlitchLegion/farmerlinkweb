import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusBadgeComponent } from './status-badge';

describe('StatusBadgeComponent', () => {
  let component: StatusBadgeComponent;
  let fixture: ComponentFixture<StatusBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusBadgeComponent);
    component = fixture.componentInstance;
  });

  it('formats status label properly', () => {
    component.label = 'in_stock';
    fixture.detectChanges();
    expect(component.displayLabel).toBe('In Stock');
  });

  it('computes correct tone for active, pending, and rejected', () => {
    component.label = 'active';
    expect(component.tone).toBe('good');

    component.label = 'pending';
    expect(component.tone).toBe('wait');

    component.label = 'rejected';
    expect(component.tone).toBe('bad');
  });
});

