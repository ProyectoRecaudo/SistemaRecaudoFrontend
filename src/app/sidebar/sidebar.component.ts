import { Component, OnInit } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';
import { GLOBAL } from '../servicios/globales';
import { Modulo } from '../modelos/modulo';
import { plainToClass } from 'class-transformer';

declare const $: any;

//Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    collapse?: string;
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
    valor?: number;
}



//Menu Items
export const ROUTES: RouteInfo[] = [
    // {
    //     path: '/dashboard',
    //     title: 'Dashboard',
    //     type: 'link',
    //     icontype: 'dashboard'
    // }, {
    //     path: '/components',
    //     title: 'Components',
    //     type: 'sub',
    //     icontype: 'apps',
    //     collapse: 'components',
    //     children: [
    //         { path: 'buttons', title: 'Buttons', ab: 'B' },
    //         { path: 'grid', title: 'Grid System', ab: 'GS' },
    //         { path: 'panels', title: 'Panels', ab: 'P' },
    //         { path: 'sweet-alert', title: 'Sweet Alert', ab: 'SA' },
    //         { path: 'notifications', title: 'Notifications', ab: 'N' },
    //         { path: 'icons', title: 'Icons', ab: 'I' },
    //         { path: 'typography', title: 'Typography', ab: 'T' }
    //     ]
    // }, {
    //     path: '/forms',
    //     title: 'Forms',
    //     type: 'sub',
    //     icontype: 'content_paste',
    //     collapse: 'forms',
    //     children: [
    //         { path: 'regular', title: 'Regular Forms', ab: 'RF' },
    //         { path: 'extended', title: 'Extended Forms', ab: 'EF' },
    //         { path: 'validation', title: 'Validation Forms', ab: 'VF' },
    //         { path: 'wizard', title: 'Wizard', ab: 'W' }
    //     ]
    // }, {
    //     path: '/tables',
    //     title: 'Tables',
    //     type: 'sub',
    //     icontype: 'grid_on',
    //     collapse: 'tables',
    //     children: [
    //         { path: 'regular', title: 'Regular Tables', ab: 'RT' },
    //         { path: 'extended', title: 'Extended Tables', ab: 'ET' },
    //         { path: 'datatables.net', title: 'Datatables.net', ab: 'DT' }
    //     ]
    // }, {
    //     path: '/maps',
    //     title: 'Maps',
    //     type: 'sub',
    //     icontype: 'place',
    //     collapse: 'maps',
    //     children: [
    //         { path: 'google', title: 'Google Maps', ab: 'GM' },
    //         { path: 'fullscreen', title: 'Full Screen Map', ab: 'FSM' },
    //         { path: 'vector', title: 'Vector Map', ab: 'VM' }
    //     ]
    // }, {
    //     path: '/widgets',
    //     title: 'Widgets',
    //     type: 'link',
    //     icontype: 'widgets'

    // }, {
    //     path: '/charts',
    //     title: 'Charts',
    //     type: 'link',
    //     icontype: 'timeline'

    // }, {
    //     path: '/calendar',
    //     title: 'Calendar',
    //     type: 'link',
    //     icontype: 'date_range'
    // }, {
    //     path: '/pages',
    //     title: 'Pages',
    //     type: 'sub',
    //     icontype: 'image',
    //     collapse: 'pages',
    //     children: [
    //         { path: 'pricing', title: 'Pricing', ab: 'P' },
    //         { path: 'timeline', title: 'Timeline Page', ab: 'TP' },
    //         { path: 'login', title: 'Login Page', ab: 'LP' },
    //         { path: 'register', title: 'Register Page', ab: 'RP' },
    //         { path: 'lock', title: 'Lock Screen Page', ab: 'LSP' },
    //         { path: 'user', title: 'User Page', ab: 'UP' }
    //     ]
    // },
    {
        path: '/administracion',
        title: 'Administración',
        type: 'sub',
        icontype: 'ballot',
        collapse: 'administracion',
        children: [
            { path: 'equipo', title: 'Equipos', ab: 'E', valor: 18 },
            { path: 'abogado', title: 'Abogados', ab: 'A', valor: 11 },
            { path: 'parqueadero', title: 'Parqueaderos', ab: 'P', valor: 6 },
            { path: 'plazamercado', title: 'Plazas de mercado', ab: 'PM', valor: 2 },
            { path: 'puerta', title: 'Puertas', ab: 'P', valor: 9 },
            { path: 'puesto', title: 'Puestos', ab: 'P', valor: 8 },
            { path: 'sector', title: 'Sectores', ab: 'S', valor: 5 },
            { path: 'zona', title: 'Zonas', ab: 'Z', valor: 4 },
            { path: 'beneficiario', title: 'Beneficiarios', ab: 'B', valor: 25 },
            { path: 'asignacionpuesto', title: 'Asignación de puesto', ab: 'AP', valor: 28 },
        ]
    }, {
        path: '/modulo-reporte',
        title: 'Reportes',
        type: 'sub',
        icontype: 'description',
        collapse: 'modulo-reporte',
        children: [
            { path: 'reporterecibopuestoeventual', title: 'Reporte Puesto Eventual', ab: 'RPE', valor: 21 },
            { path: 'reporteauditoria', title: 'Reporte Auditoria', ab: 'RA', valor: 21 },
            { path: 'reporterecibovehiculo', title: 'Reporte Vehiculo', ab: 'RV', valor: 21 },
            { path: 'reportereciboanimal', title: 'Reporte Recibo Animal', ab: 'RRA', valor: 21 },
            { path: 'reporterecibopesaje', title: 'Reporte Pesaje Animal', ab: 'RPA', valor: 21 }
        ]
    }, {
        path: '/parametrizacion',
        title: 'Parametrización',
        type: 'sub',
        icontype: 'assignment',
        collapse: 'tipos',
        children: [
            { path: 'usuario-roles', title: 'Usuarios y Roles', ab: 'UR', valor: 1 },
            { path: 'tiposector', title: 'Tipos de sectores', ab: 'TS', valor: 3 },
            { path: 'tipoanimal', title: 'Tipos de animales', ab: 'TA', valor: 7 },
            { path: 'tipoparqueadero', title: 'Tipos de parqueaderos', ab: 'TP', valor: 10 },
            { path: 'tipovehiculo', title: 'Tipos de vehiculos', ab: 'TV', valor: 12 },
            { path: 'tipopuesto', title: 'Tipos de puesto', ab: 'TP', valor: 13 },
            { path: 'actividadcomercial', title: 'Actividad comercial', ab: 'AC', valor: 14 },
            { path: 'estadoinfraestructura', title: 'Estado infraestructura', ab: 'EI', valor: 15 },
            { path: 'categoriaanimal', title: 'Categoria animal', ab: 'CA', valor: 26 },
            { path: 'especieanimal', title: 'Especie de animales', ab: 'CA', valor: 16 },

        ]
    }, {
        path: '/tarifas',
        title: 'Tarifas',
        type: 'sub',
        icontype: 'attach_money',
        collapse: 'tarifas',
        children: [
            { path: 'tarifaanimal', title: 'Tarifa animal', ab: 'TA', valor: 20 },
            { path: 'tarifapuestoeventual', title: 'Tarifa puesto eventual', ab: 'TPE', valor: 20 },
            { path: 'tarifainteres', title: 'Tarifa interes', ab: 'TI', valor: 20 },
            { path: 'tarifavehiculo', title: 'Tarifa vehiculos', ab: 'TV', valor: 20 },
            { path: 'tarifaparqueadero', title: 'Tarifa parqueadero', ab: 'TP', valor: 20 },
            { path: 'tarifapesaje', title: 'Tarifa pesaje', ab: 'TP', valor: 20 },
            { path: 'incremento', title: 'Incremento Porcentual', ab: 'IP', valor: 30 },

        ]
    }
    , {
        path: '/modulo-recaudo',
        title: 'Recaudos',
        type: 'sub',
        icontype: 'gavel',
        collapse: 'modulo-recaudo',
        children: [
            { path: 'recibopesaje', title: 'Recaudo Pesaje', ab: 'RP', valor: 29 },
            { path: 'recibopuesto', title: 'Recaudo Puestos Fijos', ab: 'RPF', valor: 29 },
        ]
    }
    , {
        path: '/modulo-cartera',
        title: 'Cartera',
        type: 'sub',
        icontype: 'card_travel',
        collapse: 'modulo-cartera',
        children: [
            { path: 'proceso', title: 'Procesos y Cartera', ab: 'PC', valor: 29 },
        ]
    }
];
@Component({
    selector: 'app-sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    public identity;
    urlimagen: string = '../' + GLOBAL.urlBase + '/assets/img/empleado.png';
    nombreUsuario: string;
    logOut2: any;
    setting: any;


    modulos: Modulo[];

    constructor() {
        this.logOut2 = ['/login', 1];
        this.setting = ['/configuracion'];
        this.identity = this.getIdentity();
        if (this.identity.rutaimagen != null) {
            let imagen: string = this.identity.rutaimagen;
            this.urlimagen = GLOBAL.urlImagen + (imagen.substring(3));
        }


        this.nombreUsuario = this.identity.name + " " + this.identity.surname;
    }


    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };

    ngOnInit() {
        this.mostrarMenu();
    }

    mostrarMenu() {
        this.modulos = plainToClass(Modulo, this.identity.modulos);
        //console.log(ROUTES.length);

        let nuevoRoutes: RouteInfo[] = [];
        ROUTES.map((menuitem) => {
            // console.log("Principal: ",menuitem);
            let contadorperm = 0; //cuenta cuantos permisos tiene en total
            let permisoshijos: ChildrenItems[] = [];
            menuitem.children.map((children) => {//se recorre todos los subhijos
                //console.log("Hijo: ",children);
                this.modulos.map((modulo) => {//se reccore todos los modulos del usuario
                    if (children.valor == modulo.getPkidmodulo()) {
                        contadorperm++;
                        permisoshijos.push(children);
                       
                    }
                });

            });
            //console.log("permisos del menu: ",contadorperm);
            /**En caso que no tenga un submenu, no se muestra en el sidebar */
            if (contadorperm != 0) {//significa que tiene al menos un submenu
                menuitem.children = permisoshijos;
                nuevoRoutes.push(menuitem);
            }
        });

        this.menuItems = nuevoRoutes.filter(menuItem => menuItem);
    }

    updatePS(): void {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
            let ps = new PerfectScrollbar(elemSidebar, { wheelSpeed: 2, suppressScrollX: true });
        }
    }
    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }


    //Obtener de manera globar los datos del usuario
    getIdentity() {
        let identity = JSON.parse(localStorage.getItem('identity'));

        if (identity != "undefined") {
            this.identity = identity;
        } else {
            this.identity = null;
        }
        return this.identity;
    }
}
