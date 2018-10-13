import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from "@angular/core";
import { UsuarioServices } from "../../../servicios/usuarioServices.services";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { RecaudoServices } from "../../../servicios/recaudoService.service";
import { ModalConfirmacion } from "../../modal-dinamico/modalconfirmacion";

declare const $: any;
@Component({
    selector: 'app-recibo-dinamico',
    templateUrl: './recibo-dinamico.component.html',
    //   styleUrls: ['./historico-pesaje.component.scss'],
    providers: [UsuarioServices, RecaudoServices],
})
export class ReciboDinamicoComponent implements OnInit {

    @Input() datos: any;
    @Input() i: number;
    @Input() cabeceras: any;
    

    @Output() enviarObjeto = new EventEmitter();//metodo que envia el objeto mediante una funcion a el padre que es historicos, para asi mostrar el modal con la informacion correcta

    //variables de validacion de ocultar/mostrar botones
    ocultarVer = false;

    //texto desactivar
    textDesac = 'Desactivar';

    //variable para bloquear y evitar que se vuelva a presionar el boton
    bloquearboton = false;

    //mensaje de error o de confirmacion
    msjrecibo = '¿Está seguro de desactivar este recibo?';

    clase: string = 'card-header-danger'; //el primer elemento es de color rojo

    constructor(private _recaudoService: RecaudoServices) {

    }

    ngOnInit() {
        if (this.i == 0 || this.i % 3 == 0) {
            this.clase = 'card-header-rose';
        } else if (this.i % 2 == 0) {
            this.clase = 'card-header-info';
        }
    }

    /**
     *Metodo que envia el objeto al padre, y dispara el evento de mostrar modal desde el padre 
     */
    mostrarModal() {
        this.enviarObjeto.emit({ datosmodal: this.datos.datoscompletos,pkid:this.datos.pkidrecibopesaje });
    }


    /**
     * metodo que valida y muestra todo lo necesario para confirmar la desactivacion
     */
    desactivarRegistro() {
        if (this.ocultarVer) {
            //Se desactiva el registro por pkid del recibo
            this.bloquearboton = true; // se bloquea el boton mientras realiza el proceso de desactivacion
            this.ocultarVer = false;
            console.log(this.datos.recibopesajeactivo);
            let pkid = this.datos.pkidrecibopesaje;
            this._recaudoService.cambiarEstado(pkid, 'trecibopesaje').subscribe(
                response => {
                    let respuesta = response;
                    if (respuesta.status == 'Exito') {
                        //reinicio de las variables
                        //y muestra la etiqueta de anulada
                        this.datos.recibopesajeactivo = false;
                    } else {
                        this.msjrecibo = respuesta.msg;
                        this.ocultarVer = true;
                    }
                    this.bloquearboton = false;

                },
                error => {
                    this.ocultarVer = true;
                    this.msjrecibo = 'Error en el servidor al anular el recibo, intentelo nuevamente';
                    this.bloquearboton = false;
                }
            );

        } else {
            this.ocultarVer = true;
            this.textDesac = 'Si, desactivar';
        }

    }

    //cancela la desactivacion y vuelven a la normalidad los botones y demas
    cancelarDesactivar() {
        this.ocultarVer = false;
        this.textDesac = 'Desactivar';
    }

}