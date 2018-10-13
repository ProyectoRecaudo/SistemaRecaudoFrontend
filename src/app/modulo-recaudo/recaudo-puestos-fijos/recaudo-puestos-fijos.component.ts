import { Component, OnInit, ViewChild } from "@angular/core";
import { UsuarioServices } from "../../servicios/usuarioServices.services";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { RecaudoServices } from "../../servicios/recaudoService.service";
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ModalRecibo } from "./modal-recibo/modal-recibo";
import { Router, NavigationEnd } from "@angular/router";

declare const $: any;
@Component({
    selector: 'app-recaudo-puestos-fijos',
    templateUrl: './recaudo-puestos-fijos.component.html',
    styleUrls: ['./recaudo-puestos-fijos.component.scss'],
    providers: [UsuarioServices, RecaudoServices]
})
export class RecaudoPuestosFijosComponent implements OnInit {

    //variables para llenar las consultas de los selects;
    consultas: any = {};

    //mensaje de consulta de los select, solo se muestra en caso de error
    mensajedatos: string;

    //sectores dependientes de la plaza
    sectores: any[] = [];

    //formulario para envio de datos
    puestosForm: FormGroup;

    // validacion del progress para cargar datos
    cargandopuestos: boolean = false;

    //ariable para determinar si no hay datos en la consulta
    datosvacios: boolean = false;

    //datos de la factura
    datosfactura: any[] = [];

    /** Datos para armar el recibo dinamicamente */

    //cabeceras para armar el recibo dinamicamente
    cabeceras: any[] = [{}];

    //datos personalizados para el envio al componente dinamico 
    datos: any = [];

    //numero del recibo;
    nrecibo: number;

    //variables para ocultar, mostrar tabla
    mostrarForm: boolean = true;

    //variable para mostrar la interfaz de historico 
    mostrarHistorico: boolean = true;

    //instancia del componente hijo para llamar a resetear el formualario 
    @ViewChild(ModalRecibo) modalRecibo: ModalRecibo;

    navigationSubscription;

    constructor(private _userServices: UsuarioServices, private formBuilder: FormBuilder, private _recaudoServices: RecaudoServices, private router: Router) {
        this.nrecibo = this._userServices.getIdentity().numerorecibo;//traer el numero del recibo desde el token
        this.recargarComponente();

    }


    recargarComponente() {
        this.navigationSubscription = this.router.events.subscribe(
            (e: any) => {
                if (e instanceof NavigationEnd) {
                    console.log('recargando componente');
                    this.mostrarForm = true;
                    this.mostrarHistorico = true;
                }
            }
        )
    }


    public banreiniciar: boolean = false; //bandera para reiniciar los datos de las variables se pone en true cuando inserto los datos
    ngOnInit() {
        this.inicarFormulario();
        this.consultarDatosSelect('plaza');
    }




    /**
     * metodo que busca los recibos con los filtros seleccionados
     */
    buscarRecibo() {
        const filtros = {
            fkidplaza: this.puestosForm.get('fkidplaza').value,
            fkidsector: this.puestosForm.get('fkidsector').value,
            numeropuesto: this.puestosForm.get('filtro1').value,
            identificacionbeneficiario: this.puestosForm.get('filtro2').value,
        }

        console.log(filtros);
        //reinicio de variables
        this.cargandopuestos = true;
        this.datosvacios = false;
        this.datos = [];
        this.mensajedatos = '';
        //definicion de las cabeceras para armar el recibo
        this.cabeceras = [
            { e: 'Puesto: ', ie: 'nombrepuesto', s: true },
            { e: null, ie: 'mesfacturaletras', s: true },
            { e: 'Beneficiario', ie: 'nombrebeneficiario', s: true },
            { e: 'Total a pagar', ie: 'saldodeuda', s: true },
            { e: 'Total deuda', ie: 'saldoasignacion', s: true },
            { e: 'Numero Factura', ie: 'numerofactura', s: false },
            { e: 'Sector', ie: 'nombresector', s: false },
        ]

        this._recaudoServices.consultarPuestosFijos(filtros).subscribe(
            response => {
                let respuesta = response;
                if (respuesta.length <= 1) {
                    this.mensajedatos = 'Error al consultar los recibos de puestos fijos, por favor intentelo nuevamente';
                    console.log('Error al consultar los recibos de puestos fijos, por favor intentelo nuevamente');
                } else {
                    this.cargandopuestos = false;
                    if (respuesta.status == 'Success') {
                        if (respuesta.factura.length != 0) {
                            this.datosfactura = respuesta.factura;

                            this.datosfactura.map(//recorrer el array de los datos de la factura
                                (d) => {

                                    let otrosdatos = [
                                        { e: 'Puesto: ', v: d.nombrepuesto },
                                        { e: null, v: d.mesfacturaletras },
                                        { e: 'Beneficiario: ', v: d.nombrebeneficiario },
                                        { e: 'Identificación: ', v: d.identificacionbeneficiario },
                                        { e: 'Tarifa puesto: ', v: d.tarifapuesto },
                                    ]
                                    /**Validacion si hay un acuerdo */
                                    if (d.fkidacuerdo != null) { //si tiene un acuerdo, se define la seccion de acuerdo

                                        let dacuerdos = [
                                            { e: '--ACUERDO--', v: null },
                                            { e: 'Nº Acuerdo: ', v: d.numeroacuerdo },
                                            { e: 'Cuota acuerdo: ', v: d.valorcuotaacuerdo },
                                            { e: 'Cuotas pagadas: ', v: d.cuotaspagadas },
                                            { e: 'Cuotas incumplidas: ', v: d.cuotasincumplidas },
                                            { e: 'Deuda acuerdo: ', v: d.saldodeudaacuerdo },
                                            { e: 'Saldo Total acuerdo: ', v: d.saldoacuerdo },
                                        ]
                                        dacuerdos.map( //se recorre el mapa para insertar en el dato principal
                                            x => {
                                                otrosdatos.push(x);
                                            }
                                        )
                                    }

                                    /**Validacion de si hay deuda */
                                    if (d.saldodeuda > 0) { //si la deuda es mayor a 0 tiene deuda
                                        let deuda = [
                                            { e: '--DEUDA--', v: null },
                                            { e: 'Debe desde: ', v: d.debermes + " / " + d.deberyear },
                                            { e: 'Total deuda: ', v: d.saldodeuda },
                                        ]
                                        deuda.map( //se recorre el mapa para insertar en el dato principal
                                            x => {
                                                otrosdatos.push(x);
                                            }
                                        )
                                    }

                                    /**Validacion de si tiene multas */
                                    if (d.saldomultas > 0) {
                                        let multa = [
                                            { e: '--MULTAS--', v: null },
                                            { e: 'Valor multa: ', v: d.valormultas },
                                            { e: 'Interes multa: ', v: d.valorinteres },
                                            { e: 'Saldo multa: ', v: d.saldomultas },

                                        ]
                                        multa.map( //se recorre el mapa para insertar en el dato principal
                                            x => {
                                                otrosdatos.push(x);
                                            }
                                        )
                                    }

                                    /**Valdiacion de pago total */
                                    otrosdatos.push({ e: '--PAGO TOTAL--', v: null });
                                    otrosdatos.push({ e: 'Total a pagar', v: d.totalapagarmes });
                                    otrosdatos.push({ e: 'En letras', v: d.totalapagarmes });


                                    const customdata = {
                                        nombrepuesto: d.nombrepuesto,
                                        mesfacturaletras: d.mesfacturaletras,
                                        nombrebeneficiario: d.nombrebeneficiario,
                                        saldodeuda: d.saldodeuda,
                                        saldoasignacion: d.saldoasignacion,
                                        numerofactura: d.numerofactura,
                                        nombresector: d.nombresector,
                                        otrosdatos: otrosdatos,
                                        datoscompletos: d
                                    }
                                    this.datos.push(customdata);
                                }
                            )

                            //console.log(this.datos);



                        } else {
                            this.datosvacios = true; //mostramos el mensaje de que hay cdatos vacios con los filtros
                        }
                    } else {
                        this.mensajedatos = respuesta
                    }
                }

            },
            error => {
                this.cargandopuestos = false;
                this.mensajedatos = 'Error al consultar los recibos de puestos fijos, por favor intentelo nuevamente';
                console.log('Error al consultar los recibos de puestos fijos, por favor intentelo nuevamente');
            }
        );

    }

    //inicializacion del formulario
    inicarFormulario() {
        this.puestosForm = this.formBuilder.group({
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
        this.puestosForm.get('fkidsector').setValue('');
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

    /**
     * 
     * @param event llegada de los datos introducidos por el usuario
     * meotodo que recibe los datos del recibo modal
     */
    datosinsertar: any[] = [];
    tercero: any;
    guardarRecibo(event) {

        this.nuevosotrosdatos = event.nuevosotrosdatos;
        this.datosinsertar = [event.datosinsertar]; //objeto con los datos a insertar convertido en array
        this.tercero = event.tercero;
        $("#modalconformacion").modal("show");
        $("#modalPagarFactura").modal("hide");//mostrar el modal
        // $('#modalPagarFactura').on('hidden.bs.modal', function (e) {
        //     // do something...
        //     console.log('cerrando modal pagar');

        // })
    }

    /**
     * para intercalar el modal de confirmacion del recibo y el modal de pagar factrura cuando se presiona cancelar o el boton de la x
     */
    ocultarmodal() {
        $("#modalconformacion").modal("hide");

        $("#modalPagarFactura").modal("show");//mostrar el modal
        //$("#modalconformacion").modal("dispose");
    }


    /**
     * Metodo que confirma desde el modal los datos para guardar el recibo en la tabla
     */
    mensajeErrorRecibo: string = ''; //mensaje de error en caso que no inserte los datos
    guardandorecibo = false;//variable del progreso de envio de los datos
    mensajenotificacion = '';
    aceptarGuardarRecibo() {
        //reinicio de las variables
        this.mensajeErrorRecibo = '';
        this.guardandorecibo = true;
        this._recaudoServices.pagarReciboPuestoFijo(this.datosinsertar).subscribe(
            response => {
                let respuesta = response;
                if (respuesta.status = 'Exito') {
                    console.log(response);
                    this.mensajenotificacion = respuesta.msg;
                    //si es exitoso
                    // se actualiza el numero del recibo del local storage
                    // si el usuario tercero no existe, se inserta, 
                    //se reinician las varibles del formulario del modal de pagar
                    let identity = this._userServices.getIdentity();
                    identity.numerorecibo = identity.numerorecibo + 1;
                    localStorage.setItem('identity', JSON.stringify(identity));
                    this.editarAgregarTercero();//agregar el tercero

                } else {
                    this.mensajeErrorRecibo = respuesta.msg; //caso de error se muestaa el msj en el modal
                    this.guardandorecibo = false;
                }
            },
            error => {
                this.mensajeErrorRecibo = "Ha ocurrido un error, al insertar el recibo pesaje, por favor intentelo nuevamente"; //caso de error se muestaa el msj en el modal
                console.log(<any>error);
                this.guardandorecibo = false;

            }
        );

    }


    /**
   * Metodo que envia la informacion del tercero para actualizar o agregar dependiendo de la base de datos
   */


    editarAgregarTercero() {
        console.log(this.tercero);
        this._userServices.editarAgregarTercero(this.tercero).subscribe(
            response => {
                let respuesta = response;
                if (respuesta.length <= 1) {
                    this.mensajeErrorRecibo = 'Error al inserta el tercero';
                    console.log('Error al inserta el tercero');
                } else {
                    if (respuesta.status == 'Exito') {
                        this.mensajenotificacion += " y " + respuesta.msg;//concatenar la otra respuesta del servidor al crear o actualizar el tercero
                        this.showNotification('bottom', 'right', this.mensajenotificacion); // se muestra la notificacion de exito
                        //ocultar los modales y reiniciar las variables
                        $("#modalconformacion").modal("hide");
                    } else {
                        this.mensajeErrorRecibo = respuesta.msg;
                    }
                    this.guardandorecibo = false;
                }

            },
            error => {
                console.log('error');
                this.guardandorecibo = false;
                this.mensajeErrorRecibo = "Error en el servidor al crear el Tercero, Intentelo nuevamente o comuniquese con el administrador";
                console.log(error);
            }
        );
    }


    nuevosotrosdatos: any[] = [{}];

    datospagar: any[] = [];
    datosmodal: any[] = [{}];
    otrosdatos: any[] = [];
    datoscompletos: any[] = [];
    /**
     * 
     * @param event objeto completo para llenar el modal de pagar factura
     */
    recibirObjetoPagar(event) {
        this.datospagar = event.datospagar;
        this.otrosdatos = event.otrosdatos;
        this.datoscompletos = event.datoscompletos;
        this.nrecibo = this._userServices.getIdentity().numerorecibo;//traer el numero del recibo desde el token

        this.modalRecibo.limpiarRegistros();

        $("#modalPagarFactura").modal("show");//mostrar el modal

    }

    /**
     * 
     * @param event objeto de datos a mostrar en el modal de detalle
     */
    recibirObjeto(event) {
        this.datosmodal = event.datosmodal;
        $("#exampleModalLong").modal("show");//mostrar el modal

    }

    showNotification(from: any, align: any, msg) {

        $.notify({
            icon: 'done',
            message: 'Información: <b>' + msg + '</b>'
        }, {
                type: 'success',
                timer: 20000,
                placement: {
                    from: from,
                    align: align
                },
                template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0} alert-with-icon" role="alert">' +
                    '<button mat-raised-button type="button" aria-hidden="true" class="close" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
                    '<i class="material-icons" data-notify="icon">done</i> ' +
                    '<span data-notify="title">{1}</span> ' +
                    '<span data-notify="message">{2}</span>' +
                    '<div class="progress" data-notify="progressbar">' +
                    '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                    '</div>' +
                    '<a href="{3}" target="{4}" data-notify="url"></a>' +
                    '</div>'
            });
    }

}