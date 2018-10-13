import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../app.module';
import { ParametrizacionRoutes } from './parametrizacion.routing';
import { TipoSectorComponent } from './tipo-sector/tipo-sector.component';
import { GenericComponent } from '../generic/generic.component';
import { DialogConfirmacionGenericComponent } from '../generic/tabla-generic/dialog.confirmgeneric.component';
import { TablaGenericComponent } from '../generic/tabla-generic/tabla-generic.component';
import { GenericAgregarEditarComponent } from '../generic/generic-agregar-editar/generic-agregar-editar.component';
import { MainPipe } from '../main.pipe.module';
import { EspecieAnimalComponent } from './especie-animal/especie-animal.component';
import { DialogConfirmacionTipos } from './dialogTipo.confirm.component';
import { GenericModule } from '../generic.module';
import { UsuariosRolesComponent } from './usuarios-roles/usuarios-roles.component';
import { RolesAgregarEditarComponent } from './usuarios-roles/roles-agregar-editar/roles-agregar-editar.component';
import { TablaRolesComponent } from './usuarios-roles/tabla-roles/tabla-roles.component';
import { TablaUsuariosComponent } from './usuarios-roles/tabla-usuarios/tabla-usuarios.component';
import { UserAgregarEditarComponent } from './usuarios-roles/user-agregar-editar/user-agregar-editar.component';
import { DialogConfirmacionComponent } from './usuarios-roles/tabla-usuarios/dialog.confirm.component';
import { DialogConfirmacionRol } from './usuarios-roles/tabla-roles/dialogRol.confirm.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ParametrizacionRoutes),
    FormsModule,
    GenericModule,
    MaterialModule,
    ReactiveFormsModule,
    MainPipe,
  ],
  declarations: [
    TipoSectorComponent,
    EspecieAnimalComponent,
    UsuariosRolesComponent,
    RolesAgregarEditarComponent,
    TablaRolesComponent,
    TablaUsuariosComponent,
    UserAgregarEditarComponent,
    DialogConfirmacionComponent,
    DialogConfirmacionRol
   
  ],
  entryComponents:[DialogConfirmacionTipos,DialogConfirmacionComponent,DialogConfirmacionRol]
})

export class ParametrizacionModule {}