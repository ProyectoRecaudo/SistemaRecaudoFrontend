import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoSectorComponent } from './tipo-sector.component';

describe('TipoSectorComponent', () => {
  let component: TipoSectorComponent;
  let fixture: ComponentFixture<TipoSectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoSectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoSectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
