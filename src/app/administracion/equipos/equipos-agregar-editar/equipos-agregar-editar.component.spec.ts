import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquiposAgregarEditarComponent } from './equipos-agregar-editar.component';

describe('EquiposAgregarEditarComponent', () => {
  let component: EquiposAgregarEditarComponent;
  let fixture: ComponentFixture<EquiposAgregarEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquiposAgregarEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquiposAgregarEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
