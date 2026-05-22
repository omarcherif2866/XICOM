import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeServiceComponent } from './commande-service.component';

describe('CommandeServiceComponent', () => {
  let component: CommandeServiceComponent;
  let fixture: ComponentFixture<CommandeServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommandeServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandeServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
