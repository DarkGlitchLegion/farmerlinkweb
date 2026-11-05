import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarvestBatch } from './harvest-batch';

describe('HarvestBatch', () => {
  let component: HarvestBatch;
  let fixture: ComponentFixture<HarvestBatch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HarvestBatch],
    }).compileComponents();

    fixture = TestBed.createComponent(HarvestBatch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
