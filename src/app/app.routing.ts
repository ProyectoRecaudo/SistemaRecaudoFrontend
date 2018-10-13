import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { LoginComponent } from './pages/login/login.component';

export const AppRoutes: Routes = [
    // {
    //   path: '',
    //   redirectTo: 'dashboard',
    //   pathMatch: 'full',
    // },
    {
      path: '',
      pathMatch: 'full',
      component : LoginComponent
    },
    {
      path: 'login',
      component : LoginComponent
    },
    {
      path: 'login/:id',
      component : LoginComponent
    },
    
    {
      path: '',
      component: AdminLayoutComponent,
      children: [
          {
        path: '',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
    }, {
        path: 'components',
        loadChildren: './components/components.module#ComponentsModule'
    }, {
        path: 'forms',
        loadChildren: './forms/forms.module#Forms'
    }, {
        path: 'tables',
        loadChildren: './tables/tables.module#TablesModule'
    }, {
        path: 'maps',
        loadChildren: './maps/maps.module#MapsModule'
    }, {
        path: 'widgets',
        loadChildren: './widgets/widgets.module#WidgetsModule'
    }, {
        path: 'charts',
        loadChildren: './charts/charts.module#ChartsModule'
    }, {
        path: 'calendar',
        loadChildren: './calendar/calendar.module#CalendarModule'
    }, {
        path: '',
        loadChildren: './userpage/user.module#UserModule'
    }, {
        path: '',
        loadChildren: './timeline/timeline.module#TimelineModule'
    }, {
        path: 'administracion',
        loadChildren: './administracion/administracion.module#AdministracionModule'
    }, {
        path: 'modulo-reporte',
        loadChildren: './modulo_reportes/modulo-reporte.module#ModuloReporteModule'
    }, {
        path: 'parametrizacion',
        loadChildren: './parametrizacion/parametrizacion.module#ParametrizacionModule'
    },{
        path: 'tarifas',
        loadChildren: './tarifas/tarifas.module#TarifasModule'
    },{
        path: 'configuracion',
        loadChildren: './configuracion/configuracion.module#ConfiguracionModule'
    }
    ,{
        path: 'modulo-recaudo',
        loadChildren: './modulo-recaudo/modulo-recaudo.module#ModuloRecaudoModule'
    }
    ,{
        path: 'modulo-cartera',
        loadChildren: './modulo-cartera/modulo-cartera.module#ModuloCarteraModule'
    }

  ],
  runGuardsAndResolvers: 'always'

}, {
      path: '',
      component: AuthLayoutComponent,
      children: [{
        path: 'pages',
        loadChildren: './pages/pages.module#PagesModule'
      }]
    }
];
