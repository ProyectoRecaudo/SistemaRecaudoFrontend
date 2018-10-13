import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { GenericComponent } from './generic/generic.component';
import { TablaGenericComponent } from './generic/tabla-generic/tabla-generic.component';
import { GenericAgregarEditarComponent } from './generic/generic-agregar-editar/generic-agregar-editar.component';
import { DialogConfirmacionGenericComponent } from './generic/tabla-generic/dialog.confirmgeneric.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './app.module';
import { MainPipe } from './main.pipe.module';
import { DialogConfirmacionTipos } from './parametrizacion/dialogTipo.confirm.component';


@NgModule({
    declarations: [
        GenericComponent,
        TablaGenericComponent,
        GenericAgregarEditarComponent,
        DialogConfirmacionGenericComponent,DialogConfirmacionTipos], // <---
    imports: [CommonModule, FormsModule, MaterialModule,
        ReactiveFormsModule, MainPipe],
    exports: [
        GenericComponent,
        TablaGenericComponent,
        GenericAgregarEditarComponent,
        DialogConfirmacionGenericComponent
    ],
    entryComponents: [DialogConfirmacionGenericComponent] // <---
})

export class GenericModule { }