import { Routes } from '@angular/router';
import { GenericComponent } from '../generic/generic.component';
import { TipoSectorComponent } from './tipo-sector/tipo-sector.component';
import { EspecieAnimalComponent } from './especie-animal/especie-animal.component';
import { UsuariosRolesComponent } from './usuarios-roles/usuarios-roles.component';


export const ParametrizacionRoutes: Routes = [
    {
        path: '',
        children: [ {
            path: 'usuario-roles',
            component: UsuariosRolesComponent
        }]
    },{
        path: '',
        children: [ {
            path: 'tipovehiculo',
            component: GenericComponent
        }]
    },{
        path: '',
        children: [ {
            path: 'tiposector',
            component: TipoSectorComponent
        }]
    },{
        path: '',
        children: [ {
            path: 'tipopuesto',
            component: GenericComponent
        }]
    },{
        path: '',
        children: [ {
            path: 'tipoparqueadero',
            component: GenericComponent
        }]
    },{
        path: '',
        children: [ {
            path: 'tipoanimal',
            component: GenericComponent
        }]
    },
    {
        path: '',
        children: [ {
            path: 'actividadcomercial',
            component: GenericComponent
        }]
    },
    {
        path: '',
        children: [ {
            path: 'estadoinfraestructura',
            component: GenericComponent
        }]
    },  {
        path: '',
        children: [ {
            path: 'categoriaanimal',
            component: GenericComponent
        }]
    }, {
        path: '',
        children: [ {
            path: 'especieanimal',
            component: EspecieAnimalComponent
        }]
    }
]