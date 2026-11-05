import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
  });

  it('emits page direction on button click', () => {
    let emitted = 0;
    component.pageChange.subscribe((val) => (emitted = val));
    component.offset = 25;
    component.currentCount = 25;
    component.hasNext = true;
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[1].click(); // Next
    expect(emitted).toBe(1);

    buttons[0].click(); // Previous
    expect(emitted).toBe(-1);
  });
});

