import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompagneComponent } from './compagne.component';

describe('CompagneComponent', () => {
  let component: CompagneComponent;
  let fixture: ComponentFixture<CompagneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompagneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompagneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
