import { Routes } from '@angular/router';
import { RecaudoPesajeComponent } from './recaudo-pesaje/recaudo-pesaje.component';
import { RecaudoPuestosFijosComponent } from './recaudo-puestos-fijos/recaudo-puestos-fijos.component';


export const ModuloRecaudoRoutes: Routes = [
    {
        path: '',
        children: [ {
            path: 'recibopesaje',
            component: RecaudoPesajeComponent
        }]
    },{
        path: '',
        children: [ {
            path: 'recibopuesto',
            component: RecaudoPuestosFijosComponent
        }]
    }

]