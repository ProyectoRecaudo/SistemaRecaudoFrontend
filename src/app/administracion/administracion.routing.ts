import { Routes } from '@angular/router';
import { EquiposComponent } from './equipos/equipos.component';
import { GenericComponent } from '../generic/generic.component';
import { ParqueaderoComponent } from './parqueadero/parqueadero.component';
import { PlazasMercadoComponent } from './plazas-mercado/plazas-mercado.component';
import { PuertasComponent } from './puertas/puertas.component';
import { PuestosComponent } from './puestos/puestos.component';
import { SectoresComponent } from './sectores/sectores.component';
import { ZonasComponent } from './zonas/zonas.component';
import { PuestoComponent } from './puesto/puesto.component';
import { DependienteComponent } from './puesto/dependiente/dependiente.component';

export const AdministracionRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'equipo',
                component: EquiposComponent
            },
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'abogado',
                component: GenericComponent
            },
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'parqueadero',
                component: ParqueaderoComponent
            },
        ]
    }, {
        path: '',
        children: [
            {
                path: 'plazamercado',
                component: PlazasMercadoComponent
            },
        ]
    }, {
        path: '',
        children: [
            {
                path: 'puerta',
                component: PuertasComponent
            },
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'puesto',
                component: PuestosComponent
            },
        ]
    }, {
        path: '',
        children: [
            {
                path: 'sector',
                component: SectoresComponent
            },
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'zona',
                component: ZonasComponent
            },
        ]
    }, {
        path: '',
        children: [
            {
                path: 'beneficiario',
                component: GenericComponent
            },
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'asignacionpuesto',
                component: PuestoComponent
            },
            {
                path: 'dependiente/:id',
                component: DependienteComponent
            }
        ]
    }
]
