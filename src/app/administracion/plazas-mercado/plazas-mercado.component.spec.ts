import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlazasMercadoComponent } from './plazas-mercado.component';

describe('PlazasMercadoComponent', () => {
  let component: PlazasMercadoComponent;
  let fixture: ComponentFixture<PlazasMercadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlazasMercadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlazasMercadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
