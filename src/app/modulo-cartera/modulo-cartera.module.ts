import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../app.module";
import { ModuloCarteraRoutes } from "./modulo-cartera.routing";
import { ProcesosComponent } from "./procesos-cartera/procesos.component";


@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(ModuloCarteraRoutes),
      FormsModule,
      MaterialModule,
      ReactiveFormsModule,
    ],
    declarations: [
        ProcesosComponent
    ]
  })
  
  export class ModuloCarteraModule {}