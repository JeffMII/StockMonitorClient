import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictorTreeComponent } from './predictor-tree.component';

describe('PredictorTreeComponent', () => {
  let component: PredictorTreeComponent;
  let fixture: ComponentFixture<PredictorTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredictorTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictorTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
