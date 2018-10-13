import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { UsuarioServices } from "../../../servicios/usuarioServices.services";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { RecaudoServices } from "../../../servicios/recaudoService.service";
import { DatePipe } from "@angular/common";

declare const $: any;
@Component({
    selector: 'app-historicos-pesaje',
    templateUrl: './historicos-pesaje.component.html',
    //   styleUrls: ['./historico-pesaje.component.scss'],
    providers: [UsuarioServices, RecaudoServices, DatePipe]
})
export class HistoricoPesajeComponent implements OnInit {

    //variables de los filtros
    public fkidplaza: string = '';
    public identificaciontercero: string = '';
    public fkidtipoanimal: string = '';

    //variables para llenar las consultas de los selects;
    consultas: any = {};

    //mensaje de los select
    mensajedatos: string = '';

    //datos de envio a las cards
    datos: any[] = [{}];

    //datos del recibo de la consulta
    datosrecibo: any = [];

    //Para mostrar el recibo
    mostrarrecibos = false;

    //cabeceras para armar el recibo dinamicamente
    cabeceras: any[] = [{}];

    //variable de tipo Date para el picker de fechas
    dateinicial = new FormControl(new Date());
    datefinal = new FormControl(new Date());

    //progreso de carga
    cargando = false;

    //Datos del modal que se llena por un output
    datosmodal: any[] = [{}];

    @Output() ocultar = new EventEmitter();

    //variables para controlar la tabla dinamicamente desde la respuesta del backend
    itemsporpagina: number = 10;
    totalitems: number = 0;
    paginaactual: number = 1;
    totalpaginas: number = 0;

    constructor(private _recaudoServices: RecaudoServices, private datePipe: DatePipe) {

    }

    ngOnInit() {
        console.log(this.datosrecibo.length);

        this.consultarDatosSelect('plaza');
        this.consultarDatosSelect('tipoanimal');

        this.cabeceras = [
            { e: 'Nº Recibo', ie: 'numerorecibo', s: true },
            { e: 'Valor recibo', ie: 'valorerecibo', s: true },
            { e: 'C.C Usuario', ie: 'identificaciontercero', s: true },
            { e: 'Usuario', ie: 'nombretercero', s: true },
            { e: 'Plaza', ie: 'plaza', s: true },
            { e: 'Tipoanimal', ie: 'tipoanimal', s: true },
            { e: '', ie: 'recibopesajeactivo', s: false },
            { e: '', ie: 'pkidrecibopesaje', s: false },
        ]
    }



    /**
  * 
  * @param nombretabla variable que determina la tabla a la cual hacer la consulta
  */
    consultarDatosSelect(nombretabla) {
        this.mensajedatos = '';//reiniciamos la variable del mensaje de error
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
                        //console.log(this.consultas[nombretabla]);
                    } else {
                        this.mensajedatos = respuesta.msg;//muestra el mensaje de error
                    }

                }

            },
            error => {
                this.mensajedatos = 'Error al consultar los datos del select, por favor intentelo nuevamente';
                console.log('Error al consultar los datos del select, por favor intentelo nuevamente');
                //this.respuesta = null;
            }

        );
    }


    buscarRecibo(pagina) {
        if (pagina == 0) {
            pagina = 1;
        }
        this.mensajedatos = '';
        this.mostrarrecibos = false;
        this.datosrecibo = [];
        this.cargando = true;
        let filtros = {

        }
        if (this.identificaciontercero != '') {
            filtros['identificacionterceropesaje'] = this.identificaciontercero;
        }
        if (this.fkidtipoanimal != '') {
            filtros['fkidtipoanimal'] = this.fkidtipoanimal;

        }
        if (this.fkidplaza != '') {
            filtros['fkidplaza'] = this.fkidplaza;

        }

        filtros['fechainicio'] = this.datePipe.transform(this.dateinicial.value, 'yyyy-MM-dd');
        filtros['fechafin'] = this.datePipe.transform(this.datefinal.value, 'yyyy-MM-dd');

        this._recaudoServices.consultarRecibosPaginados(filtros, pagina, 'trecibopesaje').subscribe(
            response => {
                console.log(response);
                let respuesta = response;
                if (respuesta.length <= 1) {
                    this.mensajedatos = 'Error al consultar los historicos, por favor intentelo nuevamente';
                    console.log('Error al consultar los historicos, por favor intentelo nuevamente');
                } else {
                    if (respuesta.status == 'Exito') {
                        this.datos = respuesta.datos;
                        //definicion de datos para el paginador de recibos
                        if (this.datos.length != 0) {
                            this.itemsporpagina = response.item_per_page;
                            this.totalitems = response.total_items_count;
                            this.totalpaginas = response.total_pages;
                            this.paginaactual = response.page_actual;
                            this.datos.map( //se recorre el objeto
                                (d) => {
                                    let datoscompletos = [
                                        { e: 'Nº Recibo: ', v: d.numerorecibopesaje },
                                        { e: 'Valor Recibo: ', v: d.valorecibopesaje },
                                        { e: 'Peso animal: ', v: d.pesoanimal },
                                        { e: 'Identificación tercero: ', v: d.identificacionterceropesaje },
                                        { e: 'Nombre tercero: ', v: d.nombreterceropesaje },
                                        { e: 'Valor Tarifa: ', v: d.valortarifa },
                                        { e: 'Plaza: ', v: d.nombreplaza },
                                        { e: 'Categoria animal: ', v: d.nombrecategoriaanimal },
                                        { e: 'Tipo animal: ', v: d.nombretipoanimal },
                                        { e: 'Especie animal: ', v: d.nombreespecieanimal },
                                        { e: 'Identificación recaudador: ', v: d.identificacionrecaudador },
                                        { e: 'Nombre recaudador: ', v: d.nombrerecaudador },
                                        { e: 'Apellido recaudador: ', v: d.apellidorecaudador }
                                    ]

                                    let customdata = {
                                        numerorecibo: d.numerorecibopesaje,
                                        valorerecibo: d.valorecibopesaje,
                                        identificaciontercero: d.identificacionterceropesaje,
                                        nombretercero: d.nombreterceropesaje,
                                        plaza: d.nombreplaza,
                                        tipoanimal: d.nombretipoanimal,
                                        recibopesajeactivo: d.recibopesajeactivo,
                                        pkidrecibopesaje: d.pkidrecibopesaje,
                                        datoscompletos: datoscompletos
                                    }
                                    this.datosrecibo.push(customdata);

                                }
                            );
                        } else {
                            this.mensajedatos = 'No hay datos para los filtros seleccionados';
                        }
                        this.cargando = false;
                    } else {
                        this.mensajedatos = respuesta.msg;

                    }

                }
            },
            error => {
                this.mensajedatos = 'Error al consultar los historicos, por favor intentelo nuevamente';
                console.log('Error al consultar los historicos, por favor intentelo nuevamente');
            }
        );
    }

    cambiarPagina(param) {
        console.log(param);
        let page = this.paginaactual;
        page = param ? page - 1 : page + 1;

        this.buscarRecibo(page);
    }

    /**
     * 
     * @param event datos que llegan por parametro, {datosmodal}
     */
    pkidpesaje: number;
    recibirObjeto(event) {
        //console.log('llamando evento');
        //console.log(event);
        this.datosmodal = event.datosmodal; //se llena el objeto de datos modal 
        $("#exampleModalLong").modal("show");//llamamos al modal
        this.pkidpesaje = event.pkid;

    }


    imprimirRecibo() {
        this._recaudoServices.generarPDF(this.pkidpesaje,'reporterecibopesaje').subscribe(
            response => {
                if (response.size <= 59) {
                    //this.mensaje = 'No se pudo generar el pdf correctamente, intente nuevamente'
                } else {
                    console.log(response);
                    var fileURL = URL.createObjectURL(response);
                    window.open(fileURL);
                }

            },
            error => {
                //this.mensaje = 'Error en el servidor al generar el PDF, intentelo nuevamente';
                console.log('Error en el servidor');
            }
        );
    }

}



