import { Routes } from '@angular/router';
import { TarifaanimalComponent } from './tarifaanimal/tarifaanimal.component';
import { TarifaInteresComponent } from './tarifaInteres/tarifainteres.component';
import { TarifaPuestoEventualComponent } from './tarifapuestoeventual/tarifapuestoeventual.component';
import { TarifavehiculoComponent } from './tarifavehiculo/tarifavehiculo.component';
import { TarifaParqueaderoComponent } from './tarifaparqueadero/tarifaparqueadero.component';
import { TarifaPesajeComponent } from './tarifapesaje/tarifapesaje.component';
import { IncrementoPorcentualComponent } from './incrementoporcentual/incrementoporcentuall.component';

export const TarifasRoutes: Routes = [
    {
        path: '',
        children: [ {
            path: 'tarifaanimal',
            component: TarifaanimalComponent
        }]
    },{
        path: '',
        children: [ {
            path: 'tarifapuestoeventual',
            component: TarifaPuestoEventualComponent
        }]
    },{
        path: '',
        children: [ {
            path: 'tarifainteres',
            component: TarifaInteresComponent
        }]
    },{
        path: '',
        children: [ {
            path: 'tarifavehiculo',
            component: TarifavehiculoComponent
        }]
    },{
        path: '',
        children: [ {
            path: 'tarifaparqueadero',
            component: TarifaParqueaderoComponent
        }]
    },{
        path: '',
        children: [ {
            path: 'tarifapesaje',
            component: TarifaPesajeComponent
        }]
    },{
        path: '',
        children: [ {
            path: 'incremento',
            component: IncrementoPorcentualComponent
        }]
    }
]