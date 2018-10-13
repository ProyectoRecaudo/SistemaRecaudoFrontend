import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { UsuarioServices } from "../../../servicios/usuarioServices.services";
import { TerceroInterface } from "../../recaudo-pesaje/recaudo-pesaje.component";
import { RecaudoServices } from "../../../servicios/recaudoService.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";


@Component({
    selector: 'app-modal-recibo',
    templateUrl: './modal-recibo.html',
    providers: [UsuarioServices, RecaudoServices]
})

export class ModalRecibo implements OnInit {
    //datos que vienen desde el componente que lo llama
    @Input() datos: any;
    @Input() otrosdatos: any;
    @Input() datoscompletos: any;
    @Input() nrecibo: number;
    @Output() enviardatos = new EventEmitter();

    //nrecibo: number;//numero de recibo

    totalpagar: number; //total a pagar

    pago: number = 0; // pago que dijita el usuario

    saldo: number = 0; //el saldo total a pagar

    textosaldo: string = 'Saldo'; //texto del saldo /a favor


    //mensaje del hint del tercero
    msjhinttercero: string = 'Busque por la cedula del tercero';


    //informacion del tercero
    tercero: TerceroInterface;

    identity: any; //idebtidiad del usuario logeado

    recibo: any; //datos del recibo 

    datosForm: FormGroup; //formulario de control para los datos

    constructor(private _userServices: UsuarioServices, private _recaudoServices: RecaudoServices, private nuevoForm: FormBuilder, ) {
        this.iniciarFormulario();
        this.iniciarTercero();
    }

    ngOnInit() {
        this.nrecibo = this._userServices.getIdentity().numerorecibo;//traer el numero del recibo desde el token
        this.identity = this._userServices.getIdentity();
    }

    iniciarFormulario() {
        this.datosForm = this.nuevoForm.group({
            valorpagar: ['', Validators.required],
            identificaciontercero: ['', Validators.required],
            nombretercero: ['', Validators.required]
        });

    }

    iniciarTercero() {
        this.tercero = {
            identificaciontercero: '', nombretercero: '', pkidtercero: null, telefonotercero: '', tipotercero: 'Eventual'
        }
    }

    /**
     * 
     * @param event valor del imput campo
     * metodo que calcula el saldo para mostrar en el campo saldo
     */
    calcularSaldo(event) {
        //captura de datos
        this.pago = event == '' ? 0 : event;
        this.totalpagar = this.datos[0].v;

        this.saldo = this.totalpagar - this.pago;
        this.textosaldo = this.saldo >= 0 ? 'Saldo' : 'Saldo a favor';
        this.saldo = Math.abs(this.saldo);
    }


    /**
    * 
    * @param identificacion cedula del tercero para ser consultado cuando se pierda el foco
    */
    consultarTercero(identificacion) {
        console.log(identificacion);
        this.msjhinttercero = 'Consultando datos tercero...';
        this.iniciarTercero();
        this._recaudoServices.consultarDatosTercero(identificacion).subscribe(
            response => {
                let respuesta = response;
                if (respuesta.length <= 1) {
                    this.msjhinttercero = 'Error al consultar el tercero';
                    console.log('Error al consultar el tercero');
                } else {
                    if (respuesta.status != 'error') { //si es diferente de error, treemos los datos del tercero
                        this.tercero = respuesta.tercero[0];
                        this.datosForm.get('nombretercero').setValue(this.tercero.nombretercero);
                        this.msjhinttercero = '';
                        //console.log(this.tercero);

                    } else {//aso contrario, se muestra un mensaje en el hint y se reinicia la variable de tercero

                        this.iniciarTercero();
                        this.datosForm.get('nombretercero').setValue('');
                        this.msjhinttercero = respuesta.msg;
                    }


                }
            },
            error => {
                this.msjhinttercero = 'Error al consultar los datos del tercero, intentelo nuevamente';
                console.log('Error al consultar los datos del tercero, intentelo nuevamente');
            }
        );
    }

    /**
 * reiniciamos la variable de tercero en caso que el usuaario escriba un nuevo valor
 * es para que el texto nombre tercero quede en blanco y se pueda insertar como un nuevo tercero
 */
    reiniciarTercero() {
        if (this.tercero.pkidtercero != null) {
            console.log('reiniciando');
            this.iniciarTercero();
            this.datosForm.get('nombretercero').setValue('');
        }
    }

    /**
     * Metodo que envia los datos al padre / mostrando una vista previa en otro modal
     */
    nuevosdatos: any[] = [];
    enviarDatos() {
        this.tercero.nombretercero = this.datosForm.get('nombretercero').value;
        this.tercero.identificaciontercero = this.datosForm.get('identificaciontercero').value;

        let datos = {
            tercero: this.tercero,
            valorpagar: this.datosForm.get('valorpagar').value
        }
        this.nuevosdatos = [];

        this.nuevosdatos = this.otrosdatos.otrosdatos.slice();

        //console.log(this.nuevosdatos);
        this.nuevosdatos.push({ e: '--PAGO--', v: null })
        this.nuevosdatos.push({ e: 'Valor pagar', v: this.datosForm.get('valorpagar').value })
        this.nuevosdatos.push({ e: 'Tercero', v: this.tercero.nombretercero })
        this.nuevosdatos.push({ e: 'Identificacion tercero', v: this.tercero.identificaciontercero })


        this.recibo =
            {
                "numerofactura": this.otrosdatos.numerofactura,
                "nombrebeneficiario": this.otrosdatos.nombrebeneficiario,
                "identificacionbeneficiario": this.datoscompletos.identificacionbeneficiario,
                "saldo": this.datoscompletos.saldoasignacion,
                "numeroacuerdo": this.datoscompletos.numeroacuerdo,
                "valorcuotaacuerdo": this.datoscompletos.valorcuotaacuerdo,
                "valormultas": this.datoscompletos.valormultas,
                "valorinteres": this.datoscompletos.valorinteres,
                "mesfactura": this.datoscompletos.mesfacturanumero,
                "creacionrecibo": false,
                "modificacionrecibo": false,
                "fkidfactura": this.datoscompletos.pkidfactura,
                "numerorecibo": this.nrecibo,
                "nombreterceropuesto": this.tercero.nombretercero,
                "identificacionterceropuesto": this.tercero.identificaciontercero,
                "nombreplaza": this.datoscompletos.nombreplaza,
                "recibopuestoactivo": 1,
                "numeroresolucionasignacionpuesto": "RESOLUCION_01",
                "numeropuesto": this.datoscompletos.nombrepuesto,
                "nombresector": this.datoscompletos.nombresector,
                "fkidzona": this.datoscompletos.fkidzona,
                "fkidsector": this.datoscompletos.fkidsector,
                "fkidpuesto": this.datoscompletos.fkidpuesto,
                "fkidasignacionpuesto": this.datoscompletos.fkidasignacionpuesto,
                "fkidplaza": this.datoscompletos.fkidplaza,
                "fkidbeneficiario": 1,
                "fkidacuerdo": this.datoscompletos.fkidacuerdo,
                "identificacionrecaudador": this.identity.identificacion,
                "nombrerecaudador": this.identity.name,
                "apellidorecaudador": this.identity.surname,
                "fkidusuariorecaudador": this.identity.sub,
                "valorpagado": this.datosForm.get('valorpagar').value,
                "saldoporpagar": this.datoscompletos.saldoporpagar,
                "nombrezona": this.datoscompletos.nombrezona,
                "abonototalacuerdo": 0,
                "abonocuotaacuerdo": 0,
                "abonodeudaacuerdo": 0,
                "abonodeuda": 0,
                "abonomultas": 0,
                "abonocuotames": 0
            }


        this.aplicarPagos();
        this.nuevosdatos.push({ e: '--ABONOS--', v: null })
        if (this.recibo.abonototalacuerdo != 0) this.nuevosdatos.push({ e: 'Total acuerdo', v: this.recibo.abonototalacuerdo })
        if (this.recibo.abonocuotaacuerdo != 0) this.nuevosdatos.push({ e: 'Cuota acuerdo', v: this.recibo.abonocuotaacuerdo })
        if (this.recibo.abonodeudaacuerdo != 0) this.nuevosdatos.push({ e: 'Deuda acuerdo', v: this.recibo.abonodeudaacuerdo })
        if (this.recibo.abonodeuda != 0) this.nuevosdatos.push({ e: 'Deuda', v: this.recibo.abonodeuda })
        if (this.recibo.abonomultas != 0) this.nuevosdatos.push({ e: 'Multas', v: this.recibo.abonomultas })
        if (this.recibo.abonocuotames != 0) this.nuevosdatos.push({ e: 'Cuota mes', v: this.recibo.abonocuotames })
        //console.log(JSON.stringify(this.recibo));
        this.enviardatos.emit({ datosinsertar: this.recibo, nuevosotrosdatos: this.nuevosdatos, tercero: this.tercero });

    }

    /**
     * MEtodo que guarda los datos y los imprime(genera el pdf y lo abre en otra pestaña)
     */
    guardarImprimir() {

    }


    public limpiarRegistros() {
        console.log('hola desde el padre');
        this.datosForm.reset();
        this.textosaldo = 'Saldo';
        this.saldo = 0;
    }


    aplicarPagos() {
        /*
                * Prioridad: Orden de pagos y descuentos (siempre deuda primero y pago del mes luego)
                * 1. acuerdo
                * 2. deuda
                * 3. multa
                * 4. interés de multa
                * 5. tarifa del mes
                */
        let totalPagado = (this.datosForm.get('valorpagar').value);
        let saldoasignacion: number = this.datoscompletos["saldoasignacion"];
        let saldomultas: number = this.datoscompletos["saldomultas"];
        let saldoacuerdo: number = this.datoscompletos["saldoacuerdo"];
        let saldodeuda: number = this.datoscompletos["saldodeuda"];
        let saldodeudaacuerdo: number = this.datoscompletos["saldodeudaacuerdo"];

        if (this.datoscompletos["fkidacuerdo"] != null) //si tiene un acuerdo (los datos del acuerdo  ya están cargados)
        {
            if (saldodeudaacuerdo < 0) //si tiene deuda en el acuerdo
            {
                if (saldodeudaacuerdo + totalPagado < 0) //si el pago actual no alcanza a cubrir toda la deuda
                {
                    this.recibo["abonototalacuerdo"] += Math.abs(totalPagado);
                    this.recibo["abonodeudaacuerdo"] = Math.abs(totalPagado);

                    saldoacuerdo = saldoacuerdo + totalPagado; //se disminuye el saldo total del acuerdo
                    saldodeudaacuerdo = saldodeudaacuerdo + totalPagado; //se disminuye el saldo de la deuda del acuerdo
                    totalPagado = 0; //no queda pago para aplicar
                }
                else //si el total pagado sí cubre toda la deuda
                {
                    this.recibo["abonototalacuerdo"] += Math.abs(saldodeudaacuerdo);
                    this.recibo["abonodeudaacuerdo"] = Math.abs(saldodeudaacuerdo);

                    totalPagado = totalPagado + saldodeudaacuerdo; //se obtiene lo que sobra después de pagar la deuda
                    saldoacuerdo = saldoacuerdo - saldodeudaacuerdo; //se disminuye el saldo del acuerdo total en el valor cubierto o pagado
                    saldodeudaacuerdo = 0; //no queda deuda
                }
            }
        }
        //si tiene deuda por fuera del acuerdo
        if (saldodeuda < 0) {
            //si el total pagado no cubre la totalidad de la deuda
            if (saldodeuda + totalPagado < 0) {
                this.recibo["abonodeuda"] = Math.abs(totalPagado);
                saldodeuda = saldodeuda + totalPagado; //se abona todo a la deuda
                totalPagado = 0;
            }
            else //si el total pagado cubre tota la deuda (es mayor o igual que la deuda)
            {
                this.recibo["abonodeuda"] = Math.abs(saldodeuda);
                totalPagado = totalPagado + saldodeuda; //se calcula lo que sobra luego de pagar la deuda
                saldodeuda = 0; //se cancela la deuda
            }
        }

        if (saldomultas < 0) {
            //si el puesto tiene multas activas
            if (saldomultas + totalPagado < 0) //si el total pagado no cubre toda la multa
            {
                this.recibo["abonomultas"] += Math.abs(totalPagado);
                saldomultas = saldomultas + totalPagado; //se disminuye el saldo de la multa
                totalPagado = 0;
            }
            else //si si cubre el total de la multa
            {
                this.recibo["abonomultas"] += Math.abs(saldomultas);
                totalPagado = totalPagado + saldomultas; //se calcula lo que sobra luego de pagar la multa
                saldomultas = 0;
                //se paga la multa 
            }
        }

        //luego de pagar deudas y multas, se pasa a realizar los pagos de las cuotas actuales del mes actual
        if (this.datoscompletos["fkidacuerdo"] != null) //si tiene acuerdo
        {

            //despues de pagar la deuda del acuerdo se verifica si después de pagarla se pagó todo el acuerdo ya
            if (saldoacuerdo >= 0) {
                saldoacuerdo = 0;
                saldodeudaacuerdo = 0;
            }
            else //sino se pasa a realizar el pago de la cuota del mes del acuerdo
            {
                if (saldoacuerdo + this.datoscompletos["valorcuotaacuerdo"] <= 0) //si el total que se debe del acuerdo es mayor a la cuota del mes
                {
                    //si el total pagado es menor que la cuota del mes
                    if (totalPagado - this.datoscompletos["valorcuotaacuerdo"] < 0) {
                        this.recibo["abonocuotaacuerdo"] += Math.abs(totalPagado);
                        this.recibo["abonototalacuerdo"] += Math.abs(totalPagado);
                        saldoacuerdo = saldoacuerdo + totalPagado; //se disminuye el acuerdo en el valor pagado
                        totalPagado = totalPagado - this.datoscompletos["valorcuotaacuerdo"]; //se le resta al total pagado la cuota actual para calcular la deuda con la que queda
                        saldodeudaacuerdo = saldodeudaacuerdo + totalPagado; //se le suma lo que ya debía la deuda que quedó
                        totalPagado = 0; //ya no queda pago o saldo  a favor
                    }
                    else if (totalPagado > 0) //si el total pagado es mayor o igual que la cuota del mes
                    {
                        this.recibo["abonocuotaacuerdo"] += Math.abs(this.datoscompletos["valorcuotaacuerdo"]);
                        this.recibo["abonototalacuerdo"] += Math.abs(this.datoscompletos["valorcuotaacuerdo"]);
                        //se reduce el saldo total en el valor de la cuota del mes... no se reduce el total pagado porque puede ser superior a la cuota del mes 
                        saldoacuerdo = saldoacuerdo + this.datoscompletos["valorcuotaacuerdo"];
                        totalPagado = totalPagado - this.datoscompletos["valorcuotaacuerdo"];//se le quita la total pagado el valor de la cuota
                    }
                }
                else //si el total que se debe en el acuerdo es menor que la cuota del mes (ej. la cuota a pagar mensual es de 10.000 pero lo que le resta para terminar por pagar el acuerdo es de 5.000)
                {
                    //si el total pagado no cubre la totalidad del saldo
                    if (totalPagado + saldoacuerdo < 0) {
                        this.recibo["abonototalacuerdo"] += Math.abs(totalPagado);
                        this.recibo["abonocuotaacuerdo"] = Math.abs(totalPagado);
                        saldoacuerdo = saldoacuerdo + totalPagado; //se disminuye el saldo total

                        saldodeudaacuerdo = saldoacuerdo; //la deuda pasa a ser igual a lo que falta por cubrir porque el saldo total es menor que la cuota del mes
                        totalPagado = 0; //no quedan pago para aplicar
                    }
                    else if (totalPagado > 0) //si el total pagado cubre todo el saldo del acuerdo
                    {
                        this.recibo["abonocuotaacuerdo"] = Math.abs(saldoacuerdo);
                        this.recibo["abonototalacuerdo"] += Math.abs(saldoacuerdo);
                        totalPagado = totalPagado + saldoacuerdo; //se calcula cuanto sorba después de pagar el saldo 
                        //se paga por completo el acuerdo
                        saldoacuerdo = 0;
                        saldodeudaacuerdo = 0;
                    }
                }
            }

        }

        if (totalPagado > 0) {
            if (totalPagado - this.datoscompletos["tarifapuesto"] < 0) //si el totalpagado restante no cubre la tarifa de mes
            {
                this.recibo.abonocuotames = Math.abs(totalPagado);
                totalPagado = 0;
            }
            else {
                this.recibo.abonocuotames = Math.abs(this.datoscompletos["tarifapuesto"]);
                totalPagado = totalPagado - this.datoscompletos["tarifapuesto"];
            }
        }

        //saldo a favor se aplicará a al acuerdo
        if (totalPagado > 0 && this.datoscompletos["fkidacuerdo"] != null) {
            if (saldoacuerdo + totalPagado < 0) //si no alcanza cubrir todo el saldo
            {
                this.recibo["abonototalacuerdo"] += Math.abs(totalPagado);
                saldoacuerdo = saldoacuerdo + totalPagado;

                totalPagado = 0;
            }
            else //si sí cubre todo el saldo
            {
                this.recibo["abonototalacuerdo"] += Math.abs(saldoacuerdo);

                totalPagado = totalPagado + saldoacuerdo;
                saldoacuerdo = 0;

                saldodeudaacuerdo = 0;
            }

        }
        //this.guardar();


    }


}