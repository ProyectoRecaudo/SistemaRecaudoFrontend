import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlazasAgregarEditarComponent } from './plazas-agregar-editar.component';

describe('PlazasAgregarEditarComponent', () => {
  let component: PlazasAgregarEditarComponent;
  let fixture: ComponentFixture<PlazasAgregarEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlazasAgregarEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlazasAgregarEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
