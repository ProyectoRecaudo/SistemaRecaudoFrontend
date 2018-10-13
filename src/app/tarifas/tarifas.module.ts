import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../app.module';
import { MainPipe } from '../main.pipe.module';
import { TarifaanimalComponent } from './tarifaanimal/tarifaanimal.component';
import { TarifaInteresComponent } from './tarifaInteres/tarifainteres.component';
import { TarifaPuestoEventualComponent } from './tarifapuestoeventual/tarifapuestoeventual.component';
import { TarifavehiculoComponent } from './tarifavehiculo/tarifavehiculo.component';
import { TablaTarifasDinamicaComponent } from './tabla-tarifas-dinamica/tabla-tarifas-dinamica.component';
import { TarifasRoutes } from './tarifas.routing';
import { TarifaParqueaderoComponent } from './tarifaparqueadero/tarifaparqueadero.component';
import { TarifaPesajeComponent } from './tarifapesaje/tarifapesaje.component';
import { IncrementoPorcentualComponent } from './incrementoporcentual/incrementoporcentuall.component';
@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(TarifasRoutes),
      FormsModule,
      MaterialModule,
      ReactiveFormsModule,
      MainPipe
    ],
    declarations: [
        TarifaanimalComponent,
        TarifaPuestoEventualComponent,
        TarifaInteresComponent,
        TarifavehiculoComponent,
        TarifaParqueaderoComponent,
        TarifaPesajeComponent,
        TablaTarifasDinamicaComponent,
        IncrementoPorcentualComponent
    ]
  })
  
  export class TarifasModule {}