import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaTarifasDinamicaComponent } from './tabla-tarifas-dinamica.component';

describe('TablaTarifasDinamicaComponent', () => {
  let component: TablaTarifasDinamicaComponent;
  let fixture: ComponentFixture<TablaTarifasDinamicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaTarifasDinamicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaTarifasDinamicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
