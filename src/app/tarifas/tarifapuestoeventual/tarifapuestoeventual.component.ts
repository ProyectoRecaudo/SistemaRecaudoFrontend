import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ExcepcionService } from '../../servicios/excepcionServices.services';
import { TarifaPuestoEventual } from '../../modelos/tarifaPuestoEventual';
import { PlazaMercado } from '../../modelos/plaza-mercado';
import { GLOBAL } from '../../servicios/globales';
import { Router, NavigationEnd } from '@angular/router';
import { TarifasServices } from '../../servicios/tarifasdinamicosService.services';
import { TablaTarifasDinamicaComponent } from '../tabla-tarifas-dinamica/tabla-tarifas-dinamica.component';

@Component({
  selector: 'app-tarifa-puesto-eventual',
  templateUrl: './tarifapuestoeventual.component.html',
  providers: [ExcepcionService, TarifasServices]
})
export class TarifaPuestoEventualComponent implements OnInit, OnDestroy {

  // ----------------------------------------------------------------------------------------------------------
  // Propiedades
  // ----------------------------------------------------------------------------------------------------------

  /**
   * Componente hijo tabla dinamica
   */
  @ViewChild(TablaTarifasDinamicaComponent) tablacomponent: TablaTarifasDinamicaComponent;

  /**
   * Tarifas registradas en el sistema
   */
  tarifasPuestoEventual: TarifaPuestoEventual[] = [];

  /**
   * Filtro de plazas
   */
  filtroplaza: any = {}

  /**
   * Filtro activo/inactivo
   */
  filtroactivo: any = {}

  /**
   * Plazas de mercado en el sistema
   */
  plazas: PlazaMercado[] = [];

  /**
   * Muestra u oculta la tabla de tarifas
   */
  oculta = false;

  /**
   * Estado de filtro activo/inactivo
   */
  estadoToggle = false;

  /**
   * Fecha actual
   */
  currentDate: Date = new Date();

  /**
   * Filtros
   */
  filtros: any[] = [];

  /**
   * clase dinamica pra carga de mensajes
   */
  claseDinamic = 'alert alert-warning alert-with-icon';

  /**
   * Iconono alerta mensaje
   */
  iconAlert = 'warning';

  /**
   * mensaje de respuesta
   */
  public mensaje: string;

  /**
   * Mensaje de error en el formulario
   */
  public mensajeForm: string;

  /**
   * captura de la respuesta del servidor global
   */
  public respuesta;

  /**
   * Url o nombre del controlador
   */
  url: string;

  tarifaEdit: TarifaPuestoEventual;


  msjToggle = 'Mostrar tarifas desactivadas';
  // ----------------------------------------------------------------------------------------------------------
  // Propiedades Formulario
  // ----------------------------------------------------------------------------------------------------------

  /**
   * Plaza seleccionada para el filtro
   */
  plazaselect = '';

  /**
   * Plaza seleccionada para el filtro
   */
  sectorselect = '';

  /**
   * Formulario de registro
   */
  puestoEventualForm: FormGroup;

  /**
   * Texto toggle
   */
  textActive = 'Activado';

  /**
   * Estado de la puerta
   */
  active = true;

  /**
   * Archivo a subir
   */
  selectedFile: File = null;

  /**
   * Url de documento
   */
  urlDocumento: any;

  /**
   * Link al documento
   */
  linkDocumento: any;

  barraProgresoForm = false;

  mensajeBoton = '';

  tablatarifa; // obtener el nombre de la tabla para llenado

  navigationSubscription;
  // ----------------------------------------------------------------------------------------------------------
  // Constructores
  // ----------------------------------------------------------------------------------------------------------

  constructor(
    private _exceptionService: ExcepcionService,
    private injector: Injector,
    private router: Router,
    private _tarifasServices: TarifasServices
  ) {
    this.recargarComponente();
  }

  ngOnInit() {
    // this.inicializaForm();
    // this.consultarPlazas();
    // this.listarTarifasPuestoEventual();
    // const index = this.router.url.substring(1).indexOf('/');
    // const url = this.router.url.substring(1);
    // this.url = url.substring(index);

    // this.tablatarifa = this.url.substring(1);
  }

  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseInvites()
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
  // ----------------------------------------------------------------------------------------------------------
  // Métodos
  // ----------------------------------------------------------------------------------------------------------

  /**
   * Recarga el componente cuando el usuario vuelve a dar click en el sidebar
   */
  recargarComponente() {
    this.navigationSubscription = this.router.events.subscribe(
      (e: any) => {
        if (e instanceof NavigationEnd) {
          console.log('recargando componente');
          if (this.oculta) {
            this.oculta = !this.oculta;
            this.listarTarifasPuestoEventual();
          } else {
            this.inicializaForm();
            this.consultarPlazas();
            this.listarTarifasPuestoEventual();
            const index = this.router.url.substring(1).indexOf('/');
            const url = this.router.url.substring(1);
            this.url = url.substring(index);

            this.tablatarifa = this.url.substring(1);
          }
        }
      }
    )
  }

  /**
   * Muestra u oculta la lista de tarifas
   */
  mostrarOcultar() {
    this.oculta = !this.oculta;
    this.estadoToggle = false;
    this.plazaselect = '';
    this.filtroplaza = '';
    this.cambiarMensajeToggle();
    console.log('edit:   ' + this.tarifaEdit);

  }

  /**
   * Modifica el filtro
   */
  guardarFiltroplaza(event) {
    const index = this.filtros.indexOf(this.filtroplaza);
    if (index > -1) {
      this.filtros.splice(index, 1)
    }
    this.filtroplaza = {
      nombreatributo: 'pkidplaza',
      valor: event.value
    }
    this.filtros.push(this.filtroplaza);
    this.tablacomponent.recibirFiltros(this.filtros);
  }

  /**
   * Guarda el filtro por activo o inactivo
   */
  guardarFiltroActivo() {
    const index = this.filtros.indexOf(this.filtroactivo);
    if (index > -1) {
      this.filtros.splice(index, 1)
    }

    this.filtroactivo = {
      nombreatributo: 'tarifapuestoeventualactivo',
      valor: !this.estadoToggle
    }
    this.filtros.push(this.filtroactivo);
    // console.log(this.filtros);
    this.tablacomponent.recibirFiltros(this.filtros);
  }

  /**
   * Cierra el dialogo del mensaje
   */
  closeDialog() {
    this.mensaje = '';
  }

  /**
   * Cierra el dialogo del mensaje
   */
  closeDialogForm() {
    this.mensajeForm = '';
  }

  // Cambia el mensaje del toggle para mostrar activos o desactivados
  cambiarMensajeToggle() {
    this.msjToggle = this.estadoToggle ? 'Mostrar tarifas activas' : 'Mostrar tarifas desactivadas';
  }


  /**
   * Consulta los datos
   * @param nombrecontrolador nombre de EL CONTROLADOR(TABLA) que se quiere hacer una consulta de todos los datos(query)
   * @param numero numero por el cual se llenara la variable correspondiente
   */
  consultarDatos(nombrecontrolador: string, numero: number): any {
    this._tarifasServices.consultarDatos('/' + nombrecontrolador, true).subscribe(
      response => {
        this.respuesta = response;
        console.log(this.respuesta);
        if (this.respuesta.length <= 1) {
          this.mensaje = 'Ocurrio un error, intentelo nuevamente';
          console.log('Ocurrio un error, intentelo nuevamente');
        } else {
          // console.log(this.respuesta[nombrecontrolador]);
          if (numero === 1) { // si es numero 1 se llena las plazas de mercado
            this.plazas = this.respuesta[nombrecontrolador];
          } else if (numero === 2) {
            this.tarifasPuestoEventual = this.respuesta[nombrecontrolador];
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

  /**
   * Método llamado cuando se va a crear una nueva tarifa
   */
  nuevaTarifa() {
    this.tarifaEdit = null;
    this.inicializaForm();
    this.mostrarOcultar();
  }

  // ----------------------------------------------------------------------------------------------------------
  // Métodos Formulario
  // ----------------------------------------------------------------------------------------------------------

  /**
   * Inicializa el formulario de plazas
   */
  inicializaForm() {
    this.puestoEventualForm = new FormGroup({
      valortarifapuestoeventual: new FormControl(null, Validators.required),
      numeroresoluciontarifapuestoeventual: new FormControl(null, Validators.required),
      tarifapuestoeventualactivo: new FormControl(true),
      descripciontarifapuestoeventual: new FormControl(null),
      fkidplaza: new FormControl(null, Validators.required)
    });
    this.mensajeBoton = 'Guardar';
  }

  /**
   * Inicializa el formulario de plazas
   */
  inicializaFormEdit() {

    if (this.tarifaEdit !== undefined || this.tarifaEdit !== null) {
      // console.log('Tarifa a editar:  ' + JSON.stringify(this.tarifaEdit));
      this.puestoEventualForm = new FormGroup({
        valortarifapuestoeventual: new FormControl(this.tarifaEdit.valortarifapuestoeventual, Validators.required),
        numeroresoluciontarifapuestoeventual: new FormControl(this.tarifaEdit.numeroresoluciontarifapuestoeventual, Validators.required),
        tarifapuestoeventualactivo: new FormControl(this.tarifaEdit.tarifapuestoeventualactivo),
        descripciontarifapuestoeventual: new FormControl(this.tarifaEdit.descripciontarifapuestoeventual),
        fkidplaza: new FormControl(this.tarifaEdit.pkidplaza, Validators.required)
      });

      this.linkDocumento = (GLOBAL.urlImagen + this.tarifaEdit.documentoresoluciontarifapuestoeventual.substring(3));
      this.urlDocumento = this.tarifaEdit.documentoresoluciontarifapuestoeventual.substring(18);
      this.mensajeBoton = 'Actualizar';

    }
  }

  /**
      * Metodo que valida y alterna los mensaje de mostrar el documento de tarifas
      */
  deleteFile() {
    this.selectedFile = null;
    this.linkDocumento = 'Seleccionar documento de resolución';
    this.urlDocumento = '';
    if (this.tarifaEdit != null) {
      this.tarifaEdit['documentoresolucion' + this.tablatarifa] = false;
    }
  }



  /**
   * Lista todas las tarifas de puesto eventual registradas en el sistema
   */
  listarTarifasPuestoEventual() {
    this.consultarDatos('tarifapuestoeventual', 2);
  }

  /**
   * Guarda los cambios del formulario (Agregar - Editar)
   */
  guardarCambios() {

    try {
      const nuevaTarifa = new TarifaPuestoEventual(
        this.puestoEventualForm.value.valortarifapuestoeventual,
        this.puestoEventualForm.value.numeroresoluciontarifapuestoeventual,
        this.puestoEventualForm.value.tarifapuestoeventualactivo,
        this.puestoEventualForm.value.descripciontarifapuestoeventual,
        this.puestoEventualForm.value.fkidplaza

      );

      if (this.tarifaEdit === null || this.tarifaEdit === undefined) {
        this.selectedFile = null;
        this.urlDocumento = '';
        this.inicializaForm();
        const uploadData = new FormData();

        if (this.selectedFile != null) {
          uploadData.append('fichero_usuario', this.selectedFile, this.selectedFile.name);
          // console.log(this.selectedFile.size);
        }

        // this.barraProgresoForm = true;

        this._tarifasServices.crearTarifa(nuevaTarifa, uploadData, this.url).subscribe(
          resp => {
            // console.log(resp);
            this.mostrarOcultar();
            this.mensaje = resp.msg;
            this.mostrarMensaje(1);
            this.barraProgresoForm = false;
            this.selectedFile = null;
            this.linkDocumento = '';
            this.urlDocumento = '';
            this.estadoToggle = false;

          }, error => {
            this.mostrarMensaje(0);
            this.mensajeForm = 'Error en el servidor al crear una nueva tarifa, por favor intentelo nuevamente';
            this.barraProgresoForm = false;
          }
        );
      } else {

        nuevaTarifa.pkidtarifapuestoeventual = this.tarifaEdit.pkidtarifapuestoeventual;
        nuevaTarifa.documentoresoluciontarifapuestoeventual = this.tarifaEdit.documentoresoluciontarifapuestoeventual;
        // = this.tarifaEdit.documentoresoluciontarifapuestoeventual;
        const uploadData = new FormData();

        if (this.selectedFile != null) {
          uploadData.append('fichero_usuario', this.selectedFile, this.selectedFile.name);
          console.log(this.selectedFile.size);
        }

        this.barraProgresoForm = true;

        this._tarifasServices.editarTarifa(nuevaTarifa, uploadData, this.url).subscribe(
          resp => {
            // console.log(resp);
            if (resp.status === 'error') {
              this.mostrarMensaje(0);
              this.mensajeForm = resp.msg;
              this.barraProgresoForm = false;
              this.selectedFile = null;
              this.linkDocumento = '';
              this.urlDocumento = '';
            } else {
              this.estadoToggle = false;
              this.mostrarMensaje(1);
              this.mostrarOcultar();
              this.mensaje = resp.msg;
              this.barraProgresoForm = false;
              this.selectedFile = null;
              this.linkDocumento = '';
              this.urlDocumento = '';
              this.estadoToggle = false;

            }
          }, error => {
            this.mostrarMensaje(0);
            this.mensajeForm = 'Error en el servidor al editar la tarifa, por favor intentelo nuevamente';
            this.barraProgresoForm = false;
          }
        );
      }

    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      const funcion = 'guardarCambios()';

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
    }
  }

  /**
   * Muestra el mensaje de confirmación
   * @param codeError Codigo de error
   */
  mostrarMensaje(codeError: number) {
    if (codeError === 1) {
      this.claseDinamic = 'alert alert-success alert-with-icon';
      this.iconAlert = 'done';
    } else if (codeError === 0) {
      this.claseDinamic = 'alert alert-warning alert-with-icon';
      this.iconAlert = 'warning';
    }
  }

  /**
   * Cancela una edición
   */
  cancelarEdicion() {
    this.selectedFile = null;
    this.urlDocumento = '';
    this.tarifaEdit = null;
    this.mostrarOcultar();
  }
  /**
   * Cambia el estado de una puerta
   */
  cambiarEstadoForm() {
    this.active = !this.active;
    this.textActive = this.active ? 'Activado' : 'Desactivado';
  }

  /**
   * Método de seleccionar archivo
   */
  onFileChanged(event) {
    try {

      if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();
        this.selectedFile = event.target.files[0];
        reader.readAsDataURL(event.target.files[0]); // read file as data url
        if (this.selectedFile !== null) {
          this.urlDocumento = this.selectedFile.name;
        }
        reader.onload = () => { // called once readAsDataURL is completed
          // this.urlDocumento = reader.result;
        }
      }
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      const funcion = 'onFileChanged()';

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
      // console.log("error asdasd a:" + e.stack);

    }
  }

  /**
   * llama el formulario de editar con el objeto respectivo
   * @param event Evento del emmiter
   */
  llamarFormularioEditar(event) {
    this.tarifaEdit = event.objeto;
    this.inicializaFormEdit();
    this.mostrarOcultar();
  }

  /**
   * Consulta las plazas que existen en el sistema
   */
  consultarPlazas() {
    this.consultarDatos('plaza', 1);
  }

  /**
   * Envia la excepcion
   * @param mensaje
   * @param e
   * @param funcion
   * @param url
   */
  enviarExcepcion(mensaje, e, funcion, url) {
    this._exceptionService.capturarExcepcion({ mensaje, url: url, stack: e.stack, funcion: funcion }).subscribe(
      response => {

        if (response.length <= 1) {
          console.log('Error en el servidor al enviar excepcion');
        } else {
          if (response.status = !'error') {
            console.log('La excepcion se envio correctamente');
          }
        }
      },
      error => {
        console.log('Error en el servidor al enviar excepcion');
      }

    );
  }


}
