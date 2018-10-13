import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { UsuarioServices } from "../../../servicios/usuarioServices.services";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { RecaudoServices } from "../../../servicios/recaudoService.service";

declare const $: any;
@Component({
    selector: 'app-recibo-dinamico-puestos',
    templateUrl: './recibo-dinamico-puestos.component.html',
    //   styleUrls: ['./historico-pesaje.component.scss'],
    providers: [UsuarioServices, RecaudoServices]
})
export class ReciboDinamicoPuestosComponent implements OnInit {

    /**
     * Datos que llegan desde el componente que lo llama
     */
    @Input() datos: any;
    @Input() i: number;
    @Input() cabeceras: any;

    @Output() enviarObjeto = new EventEmitter();
    @Output() enviarObjetoPagar = new EventEmitter();

    //clase por defecto a el primer recibo
    clase: string = 'card-header-danger';

    //modelo de datos para enviar al pagar recibo
    datospagar: any[] = []

    ngOnInit() {
        console.log(this.datos);
        console.log(this.i);
        console.log(this.cabeceras);

        //Validacion para aplicar los estilos personalizados
        if (this.i == 0 || this.i % 3 == 0) {
            this.clase = 'card-header-rose';
        } else if (this.i % 2 == 0) {
            this.clase = 'card-header-info';
        }
    }


    //MODAL SENCILLO DE MUESTRA DE DATOS VER DETALLE
    mostrarModal() {//enviar el objeto al modal del padre recaudopuestos ffijos
        this.enviarObjeto.emit({ datosmodal: this.datos.otrosdatos });
    }

    //MODAL PERSONALIZADO CON DATOS DE INPUT Y DEMAS
    mostrarModalPagar() {//enviar el objeto al padre para que este lo procese
        this.datospagar = [];
        this.datospagar.push(this.datos.otrosdatos[13]);//total a pagar
        this.datospagar.push({ e: 'Nombre del usuario: ', v: this.datos.otrosdatos[2].v });//nombre del beneficiario/usuario
        this.datospagar.push({ e: 'C.C. Nº: ', v: this.datos.otrosdatos[3].v });//identificacion beneficiario
        this.datospagar.push({ e: 'Nº Factura: ', v: this.datos.numerofactura });
        this.datospagar.push({ e: 'Sector: ', v: this.datos.nombresector });

        console.log(this.datos);
        


        this.enviarObjetoPagar.emit({ datospagar: this.datospagar, otrosdatos: this.datos, datoscompletos: this.datos.datoscompletos });


    }

}