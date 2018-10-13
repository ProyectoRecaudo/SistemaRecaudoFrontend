import { Routes } from '@angular/router';
import { ProcesosComponent } from './procesos-cartera/procesos.component';


export const ModuloCarteraRoutes: Routes = [
    {
        path: '',
        children: [ {
            path: 'proceso',
            component: ProcesosComponent
        }]
    }

]