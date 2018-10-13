import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ModuloRecaudoRoutes } from "./modulo-recaudo.routing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../app.module";
import { RecaudoPesajeComponent } from "./recaudo-pesaje/recaudo-pesaje.component";
import { ModalConfirmacion } from "./modal-dinamico/modalconfirmacion";
import { RecaudoPuestosFijosComponent } from "./recaudo-puestos-fijos/recaudo-puestos-fijos.component";
import { HistoricoPesajeComponent } from "./recaudo-pesaje/historicos-pesaje/historicos-pesaje.component";
import { ReciboDinamicoComponent } from "./recaudo-pesaje/recibo-dinamico/recibo-dinamico.component";
import { ReciboDinamicoPuestosComponent } from "./recaudo-puestos-fijos/recibo-dinamico-puestos/recibo-dinamico-puestos.component";
import { ModalRecibo } from "./recaudo-puestos-fijos/modal-recibo/modal-recibo";
import { HistoricoPuestosFijosComponent } from "./recaudo-puestos-fijos/historicos-puestos-fijos/historicos-puestos-fijos.component";

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(ModuloRecaudoRoutes),
      FormsModule,
      MaterialModule,
      ReactiveFormsModule,
    ],
    declarations: [
        RecaudoPesajeComponent,
        HistoricoPesajeComponent,
        ReciboDinamicoComponent,
        RecaudoPuestosFijosComponent,
        ReciboDinamicoPuestosComponent,
        ModalConfirmacion,
        HistoricoPuestosFijosComponent,
        ModalRecibo
    ]
  })
  
  export class ModuloRecaudoModule {}