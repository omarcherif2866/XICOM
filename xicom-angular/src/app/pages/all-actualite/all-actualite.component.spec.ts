import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllActualiteComponent } from './all-actualite.component';

describe('AllActualiteComponent', () => {
  let component: AllActualiteComponent;
  let fixture: ComponentFixture<AllActualiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllActualiteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllActualiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
