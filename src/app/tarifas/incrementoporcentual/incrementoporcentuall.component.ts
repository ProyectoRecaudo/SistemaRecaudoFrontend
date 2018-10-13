import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { TarifasServices } from '../../servicios/tarifasdinamicosService.services';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { GLOBAL } from '../../servicios/globales';
import { TablaTarifasDinamicaComponent } from '../tabla-tarifas-dinamica/tabla-tarifas-dinamica.component';
import { DatePipe } from '@angular/common';
declare const $: any;
@Component({
    selector: 'app-incrementoporcentual',
    templateUrl: './incrementoporcentual.component.html',
    providers: [TarifasServices, DatePipe]
})
export class IncrementoPorcentualComponent implements OnInit,OnDestroy {

    //toggle filtro activos/descativados
    toggleActDesc: boolean = false;

    //url o nombre del controlador
    url: string;
    //variables para los selectores
    plazasmercado: any[] = [];

    //captura de la respuesta del servidor global
    public respuesta;
    //mensaje de respuesta
    mensaje: string;


    //clase dinamica pra carga de mensajes
    claseDinamic = "alert alert-warning alert-with-icon";
    iconAlert = "warning";

    msjToggle = 'Mostrar tarifas desactivadas';

    /**
     * -------------------Variables para el formulario---------------------------
     */

    documento = ' Seleccionar documento de resolución';
    urldocumento: string = '';


    //actvar , desactivar 
    active = true;
    textActive = "Activado";
    //mensaje del boton actulizar guardar
    mensajeBoton: string;

    //mensaje para mostrar en el formulario de agregar
    msg: string = '';
    //progreso de envio
    creandotarifa: boolean = false;

    /**
     * Muestra u oculta la tabla de tarifas
    */
    oculta = false;

    /**
  * Archivo a subir
  */
    selectedFile: File = null;

    //objeto de tipo tarifa
    public tarifa: any = null;

    //objeto de formgroup para obtener los datos del formulario
    nuevoTarifaForm: FormGroup;

    //variable que valida si esta por actualizar o guardar un nuevo
    isUpdate = false;

    tablatarifa;//obtener el nombre de la tabla para llenado

    msjAgregarEditar = 'Nuevo Incremento'; //mensaje para agregar o actualizar

    //instancia del componente hijo para el envio de paramtreos y/o llamads de funciones
    @ViewChild(TablaTarifasDinamicaComponent) tablacomponent: TablaTarifasDinamicaComponent;

    //variable que guarda el estado del incremento para validar y mostrar el modal en caso que el usuario tenga activo el incremento y lo haya desactivado
    activeIncremento: boolean = false;
    //variable para mostrar el modal
    mostrarModal: boolean = false;

    navigationSubscription;


    constructor(private router: Router, private _tarifasServices: TarifasServices, private nuevoForm: FormBuilder, private datePipe: DatePipe) {
        this.recargarComponente();
    }

    recargarComponente() {
        this.navigationSubscription = this.router.events.subscribe(
          (e: any) => {
            if (e instanceof NavigationEnd) {
              console.log('recargando componente');
              if (this.oculta) {
                  this.llamarFormulario(null);
              }
    
            }
          }
        )
      }
      ngOnDestroy() {
        // avoid memory leaks here by cleaning up after ourselves. If we  
        // don't then we will continue to run our initialiseInvites()   
        // method on every navigationEnd event.
        if (this.navigationSubscription) {
          this.navigationSubscription.unsubscribe();
        }
      }

    ngOnInit(): void {
        this.consultarPlazas();
        const index = this.router.url.substring(1).indexOf('/');
        const url = this.router.url.substring(1);
        this.url = url.substring(index);
        console.log(this.url.substring(1));

        this.tablatarifa = this.url.substring(1);
    }

    /**
     * Metodo que consultar todas las plazas de mercado para listarlas en el selector plazas de mercado
     */
    consultarPlazas() {
        this.consultarDatos('plaza', 1);
    }



    //Cambia el mensaje del toggle para mostrar activos o desactivados
    cambiarMensajeToggle() {
        this.msjToggle = this.toggleActDesc ? 'Mostrar incremento activos' : 'Mostrar incremento desactivados';
    }

    /**
        * Metodo que valida y alterna los mensaje de mostrar el documento de tarifas
        */
    deleteFile() {
        this.selectedFile = null; this.documento = 'Seleccionar documento de resolución'; this.urldocumento = '';
        if (this.tarifa != null) {
            this.tarifa['documentoresolucion' + this.tablatarifa] = false;
        }
    }



    /**
     * 
     * @param nombrecontrolador nombre de EL CONTROLADOR(TABLA) que se quiere hacer una consulta de todos los datos(query)
     * @param numero numero por el cual se llenara la variable correspondiente 
     */
    consultarDatos(nombrecontrolador: string, numero: number): any {
        this._tarifasServices.consultarDatos("/" + nombrecontrolador, true).subscribe(
            response => {
                this.respuesta = response;
                if (this.respuesta.length <= 1) {
                    this.mensaje = 'Ocurrio un error, intentelo nuevamente';
                    console.log('Ocurrio un error, intentelo nuevamente');
                } else {
                    console.log(this.respuesta[nombrecontrolador]);
                    if (numero == 1) {//si es numero 1 se llena las plazas de mercado
                        this.plazasmercado = this.respuesta[nombrecontrolador];
                    }
                }
            },
            error => {
                this.mensaje = 'Ocurrio un error, intentelo nuevamente';
                console.log(<any>error, 'Ocurrio un error, intentelo nuevamente');
                this.respuesta = null;

            }
        )
    }
    filtros: any[] = [];

    /**
     * 
     * @param event valor del filtro
     */
    filtroplaza: any = {}
    guardarFiltroplaza(event) {
        const index = this.filtros.indexOf(this.filtroplaza);
        if (index > -1) this.filtros.splice(index, 1);
        this.filtroplaza = {
            nombreatributo: 'pkidplaza',
            valor: event.value
        }
        this.filtros.push(this.filtroplaza);
        this.tablacomponent.recibirFiltros(this.filtros);
        //this._tarifasServices.agregarFiltros(this.filtros);
    }

    /**
     * Metodo que guarda el valor del toggle
     */
    filtrotogle: any = {};
    guardarToggle() {
        const index = this.filtros.indexOf(this.filtrotogle);
        if (index > -1) this.filtros.splice(index, 1);
        this.filtrotogle = {
            nombreatributo: (this.tablatarifa + 'activo'),
            valor: !this.toggleActDesc //se envia la negacion del valor del togle que tenga actualmente
        }
        this.filtros.push(this.filtrotogle);
        this.tablacomponent.recibirFiltros(this.filtros);
    }

    /**
     * 
     * @param event objecto a editar que llega desde la tabla
     */
    llamarFormulario(event) {
        this.mensaje = '';
        this.msg = '';
        this.oculta = !this.oculta;//ocultamos la tabla o el formulario respectivamente
        this.selectedFile = null;
        this.tarifa = event != null ? event.objeto : null; //validamos q sea diferente de null
        this.isUpdate = event != null ? true : false; // si es actualizar o nuevo
        //validamos el formulario solo en caso que este este visible
        if (this.oculta) {
            this.nuevoTarifaForm = this.nuevoForm.group({
                valor: [this.tarifa != null ? this.tarifa['valor' + this.tablatarifa] : '', Validators.required],
                numero: [this.tarifa != null ? this.tarifa['resolucion' + this.tablatarifa] : '', Validators.required],
                fkidplaza: [this.tarifa != null ? this.tarifa.pkidplaza : '', Validators.required],
            });
        }
        if (this.tarifa != null) {//validacion para mostrar el documento o url
            if (this.tarifa['documentoresolucion' + this.tablatarifa] != 'sin documento') {
                this.urldocumento = (GLOBAL.urlImagen + this.tarifa['documentoresolucion' + this.tablatarifa].substring(3));
                this.documento = this.tarifa['documentoresolucion' + this.tablatarifa].substring(18);
            } else {
                this.documento = 'Seleccionar documento de resolución';
            }
        } else {
            this.toggleActDesc = false;
            this.cambiarMensajeToggle();
            this.documento = 'Seleccionar documento de resolución';
            this.urldocumento = '';
        }
        this.active = this.tarifa != null ? this.tarifa[this.tablatarifa + 'activo'] : true;
        this.activeIncremento = this.active; // puede ser falso o true respectivamente

        this.textActive = this.active ? "Activado" : "Desactivado";
        //si el zona es nullo, significa que entra por un nuevo objeto
        this.mensajeBoton = this.tarifa == null ? "Guardar" : "Actualizar";
        this.msjAgregarEditar = this.tarifa == null ? "Nuevo incremento porcentual" : "Actualizar el incremento";
        console.log(this.tarifa);
    }

    /**
     * PAra activar y desactivar el toggle
     */
    activarDesactivarTarifa() {
        this.active = !this.active;
        this.textActive = this.active ? "Activado" : "Desactivado";
    }

    uploadData;

    /**
     * Metodo que guarda o actualiza los cambios de una tarifa
     */
    guardarActualizarCambios() {

        this.msg = '';
        if (this.tarifa == null) {//significa que es una nueva tarifa
            /*this.tarifa = {
              pkidtarifavehiculo: null,valortarifavehiculo:0, descripciontarifavehiculo: '', numeroresoluciontarifavehiculo: '', documentoresoluciontarifavehiculo: null, fkidplaza: null, fkidtipoanimal: null,tarifavehiculoactivo: false
            };*/
            //this.selectedFile = null;
            this.tarifa = {};

        }


        this.tarifa['valor' + this.tablatarifa] = (this.nuevoTarifaForm.get('valor').value).toString().trim();
        this.tarifa['resolucion' + this.tablatarifa] = (this.nuevoTarifaForm.get('numero').value).toString().trim();
        this.tarifa['fkidplaza'] = (this.nuevoTarifaForm.get('fkidplaza').value).toString().trim();
        this.tarifa[this.tablatarifa + 'activo'] = (this.active);

        console.log(this.tarifa);


        this.msg = ''; //cerramos el mensaje de alerta del formulario
        this.uploadData = new FormData();
        if (this.selectedFile != null) {
            this.uploadData.append('fichero_usuario', this.selectedFile, this.selectedFile.name);
            console.log(this.selectedFile.name);
        }

        if (!this.isUpdate) {//entra por agregar una nueva tarifa 
            this.creandotarifa = true;
            this._tarifasServices.crearTarifa(this.tarifa, this.uploadData, this.url).subscribe(
                response => {
                    this.respuesta = response;
                    if (this.respuesta.length <= 1) {
                        this.msg = 'Error en el servidor';
                        console.log('Error en el servidor');
                    } else {
                        this.creandotarifa = false;
                        if (this.respuesta.status == "Exito") {//Si lo creo, mostramos el mensaje en la pantalla princiapl
                            this.mensaje = this.respuesta.msg;
                            this.mostrarMensaje(1);
                            this.oculta = !this.oculta;//ocultamos la tabla o el formulario respectivamente
                            this.active = false;
                            this.toggleActDesc = false;
                            this.cambiarMensajeToggle();
                        } else {//mostramos el mensaje de respeusta desde el formulario
                            this.msg = this.respuesta.msg;
                        }

                    }
                },
                error => {
                    this.creandotarifa = false;
                    this.msg = 'Error en el servidor'; //se muestra el mensaje en el formualrio
                    console.log('Error en el servidor');
                }

            );

        } else {//actualizar una tarifa, el pkid de la tarifa ya viene asignado

            if (this.activeIncremento == true && this.activeIncremento != this.active) {//significa que cambio el estado del toggle

                if (this.active == false) {//solo si es igual a falso mostramos un modal de confirmnacion
                    console.log('aquiiii');
                    this.mostrarModal = true;
                    $("#exampleModalLong").modal("show");//ocultamos el modal
                }
            } else {
                this.confirmar(null);

            }


        }

    }

    confirmar(objeto) {
        this.creandotarifa = true;
        this._tarifasServices.editarTarifa(this.tarifa, this.uploadData, this.url, objeto).subscribe(
            response => {
                this.respuesta = response;
                if (this.respuesta.length <= 1) {
                    this.msg = 'Error en el servidor';
                    console.log('Error en el servidor');
                } else {
                    this.creandotarifa = false;
                    $("#exampleModalLong").modal("hide");//ocultamos el modal
                    if (this.respuesta.status == "Exito") {//Si lo creo, mostramos el mensaje en la pantalla princiapl
                        this.mensaje = this.respuesta.msg;
                        this.mostrarMensaje(1);
                        this.oculta = !this.oculta;//ocultamos la tabla o el formulario respectivamente
                        this.active = false;
                        this.toggleActDesc = false;
                        this.cambiarMensajeToggle();

                    } else {//mostramos el mensaje de respeusta desde el formulario
                        this.msg = this.respuesta.msg;
                    }

                }
            },
            error => {
                this.creandotarifa = false;
                this.msg = 'Error en el servidor'; //se muestra el mensaje en el formualrio
                console.log('Error en el servidor');
                $("#exampleModalLong").modal("hide");//ocultamos el modal
            }
        )
    }


    //Mostrar mensaje variable estilizado de error o de confirmacion 
    mostrarMensaje(codeError: number) {
        if (codeError == 1) {
            this.claseDinamic = "alert alert-success alert-with-icon";
            this.iconAlert = "done";
        } else if (codeError == 0) {
            this.claseDinamic = "alert alert-warning alert-with-icon";
            this.iconAlert = "warning";
        }
    }


    /**
   * Método de seleccionar archivo
   */
    onFileChanged(event) {

        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            this.selectedFile = event.target.files[0];
            console.log(this.selectedFile.name);
            this.urldocumento = '';
            this.documento = this.selectedFile.name;
            reader.readAsDataURL(event.target.files[0]); // read file as data url
            reader.onload = () => { // called once readAsDataURL is completed
                // this.url = reader.result;
            }
        }
    }


}