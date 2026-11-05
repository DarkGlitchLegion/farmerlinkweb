import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Agriculture } from './agriculture';

describe('Agriculture', () => {
  let component: Agriculture;
  let fixture: ComponentFixture<Agriculture>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Agriculture],
    }).compileComponents();

    fixture = TestBed.createComponent(Agriculture);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
