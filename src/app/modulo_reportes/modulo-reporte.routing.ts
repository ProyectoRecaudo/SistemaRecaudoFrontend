import { Routes } from '@angular/router';
import { ReporteDinamicoComponent } from './reporte-dinamico/reporte-dinamico.component';


export const ModuloReporteRoutes: Routes = [
    {
        path: '',
        children: [ {
            path: 'reporterecibopuestoeventual',
            component: ReporteDinamicoComponent
        }]
    },{
        path: '',
        children: [ {
            path: 'reporteauditoria',
            component: ReporteDinamicoComponent
        }]
    },{
        path: '',
        children: [ {
            path: 'reporterecibovehiculo',
            component: ReporteDinamicoComponent
        }]
    },{
        path: '',
        children: [ {
            path: 'reportereciboanimal',
            component: ReporteDinamicoComponent
        }]
    },{
        path: '',
        children: [ {
            path: 'reporterecibopesaje',
            component: ReporteDinamicoComponent
        }]
    }

]