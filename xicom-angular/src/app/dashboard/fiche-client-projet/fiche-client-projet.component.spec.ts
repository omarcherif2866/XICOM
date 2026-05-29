import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FicheClientProjetComponent } from './fiche-client-projet.component';

describe('FicheClientProjetComponent', () => {
  let component: FicheClientProjetComponent;
  let fixture: ComponentFixture<FicheClientProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FicheClientProjetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FicheClientProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
