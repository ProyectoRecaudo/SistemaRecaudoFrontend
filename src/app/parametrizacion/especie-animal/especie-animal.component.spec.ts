import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EspecieAnimalComponent } from './especie-animal.component';

describe('EspecieAnimalComponent', () => {
  let component: EspecieAnimalComponent;
  let fixture: ComponentFixture<EspecieAnimalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EspecieAnimalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EspecieAnimalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
