import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../app.module';
import { AdministracionRoutes } from './administracion.routing';
import { EquiposComponent } from './equipos/equipos.component';
import { EquiposAgregarEditarComponent } from './equipos/equipos-agregar-editar/equipos-agregar-editar.component';
import { DialogConfirmacionTipos } from '../parametrizacion/dialogTipo.confirm.component';
import { MainPipe } from '../main.pipe.module';
import { GenericModule } from '../generic.module';
import { ParqueaderoComponent } from './parqueadero/parqueadero.component';
import { PlazasMercadoComponent } from './plazas-mercado/plazas-mercado.component';
import { PlazasAgregarEditarComponent } from './plazas-mercado/plazas-agregar-editar/plazas-agregar-editar.component';
import { DialogConfirmacionPlaza } from './plazas-mercado/dialogPlaza.confirm.component';
import { PuertasComponent } from './puertas/puertas.component';
import { PuestosComponent } from './puestos/puestos.component';
import { SectoresComponent } from './sectores/sectores.component';
import { ZonasComponent } from './zonas/zonas.component';
import { PuestoComponent } from './puesto/puesto.component';
import { DependienteComponent } from './puesto/dependiente/dependiente.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdministracionRoutes),
    FormsModule,
    GenericModule,
    MaterialModule,
    ReactiveFormsModule,
    MainPipe,
  ],
  declarations: [
    EquiposComponent,
    EquiposAgregarEditarComponent,
    ParqueaderoComponent,
    PlazasMercadoComponent,
    PlazasAgregarEditarComponent,
    DialogConfirmacionPlaza,
    PuertasComponent,
    PuestosComponent,
    SectoresComponent,
    ZonasComponent,
    PuestoComponent,
    DependienteComponent
  ],
  entryComponents: [DialogConfirmacionTipos, DialogConfirmacionPlaza]
})

export class AdministracionModule { }
