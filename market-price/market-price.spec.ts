import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarketPrice } from './market-price';

describe('MarketPrice', () => {
  let component: MarketPrice;
  let fixture: ComponentFixture<MarketPrice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketPrice],
    }).compileComponents();

    fixture = TestBed.createComponent(MarketPrice);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
