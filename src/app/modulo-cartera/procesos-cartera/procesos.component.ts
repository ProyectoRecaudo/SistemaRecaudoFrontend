import { Component, OnInit } from "@angular/core";
import { UsuarioServices } from "../../servicios/usuarioServices.services";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { RecaudoServices } from "../../servicios/recaudoService.service";

declare const $: any;
@Component({
    selector: 'app-procesos',
    templateUrl: './procesos.component.html',
    // styleUrls: ['./procesos.component.scss'],
    providers: [RecaudoServices]
})
export class ProcesosComponent implements OnInit {
    //formulario para envio de datos
    procesosForm: FormGroup;

    //mensaje de consulta de los select, solo se muestra en caso de error
    mensajedatos: string;

    //variables para llenar las consultas de los selects;
    consultas: any = {};


    //sectores dependientes de la plaza
    sectores: any[] = [];


    constructor(private formBuilder: FormBuilder, private _recaudoServices: RecaudoServices) {

    }

    ngOnInit() {
        this.inicarFormulario();
        this.consultarDatosSelect('plaza');
    }

    //inicializacion del formulario
    inicarFormulario() {
        this.procesosForm = this.formBuilder.group({
            fkidplaza: '',
            fkidsector: '',
            filtro1: '',
            filtro2: ''
        });
    }


    /**
     * 
     * @param nombretabla variable que determina la tabla a la cual hacer la consulta
     */
    consultarDatosSelect(nombretabla) {
        this._recaudoServices.consultarCamposSelect(nombretabla).subscribe(
            response => {
                let respuesta = response;
                if (respuesta.length <= 1) {
                    this.mensajedatos = 'Error al consultar los datos del select, por favor intentelo nuevamente';
                    console.log('Error al consultar los datos del select, por favor intentelo nuevamente');
                } else {
                    //console.log(respuesta[nombretabla]);
                    if (respuesta.status != 'error') {
                        this.consultas[nombretabla] = (respuesta[nombretabla]);//guardamos el arreglo en otro arreglo
                    } else {
                        this.mensajedatos = respuesta.msg;//muestra el mensaje de error
                    }

                }

            },
            error => {
                this.mensajedatos = 'Error al consultar los datos del select, por favor intentelo nuevamente';
                console.log('Error al consultar los datos del select, por favor intentelo nuevamente');
            }

        );
    }


    /**
  * 
  * @param fkidplaza id de la plaza para consultar sectores
  * MEtodo que consulta sectores para el caso numerofiltro (2)
  */
    consultarSectores(fkidplaza) {
        console.log(fkidplaza);
        //reinicio de variables
        this.sectores = [];
        this.procesosForm.get('fkidsector').setValue('');
        if (fkidplaza != '') {

            this._recaudoServices.consultarSectoresPorPlaza(fkidplaza).subscribe(
                response => {
                    let respuesta = response;
                    if (respuesta.length <= 1) {
                        this.mensajedatos = 'Error en el servidor al consultar los sectores, por favor intentelo nuevamente';
                        console.log('Error en el servidor');
                    } else {
                        this.sectores = respuesta.sector;
                    }

                },
                error => {
                    this.mensajedatos = 'Error en el servidor al consultar sectores, intentelo nuevamente';
                    console.log('Error en el servidor');
                }

            );
        }


    }
}