import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import { ArrayOne } from './servicios/pipes/arrayone.pipe';
import { DatosPipe } from './servicios/pipes/pipedatostabla.pipe';

@NgModule({
    declarations:[ArrayOne,DatosPipe], // <---
    imports:[CommonModule],
    exports:[ArrayOne,DatosPipe] // <---
  })
  
  export class MainPipe{}