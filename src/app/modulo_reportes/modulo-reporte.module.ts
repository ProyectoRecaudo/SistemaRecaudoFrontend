import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../app.module';
import { ModuloReporteRoutes } from './modulo-reporte.routing';
import { ReporteDinamicoComponent } from './reporte-dinamico/reporte-dinamico.component';
import { ArrayOne } from '../servicios/pipes/arrayone.pipe';
import { MainPipe } from '../main.pipe.module';


@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(ModuloReporteRoutes),
      FormsModule,
      MaterialModule,
      ReactiveFormsModule,
      MainPipe
    ],
    declarations: [
        ReporteDinamicoComponent,
    ]
  })
  
  export class ModuloReporteModule {}