import { Component, OnInit, ViewChild, Injector, AfterViewInit, OnDestroy } from '@angular/core';
import { ExcepcionService } from '../../servicios/excepcionServices.services';
import { PlazaMercado } from '../../modelos/plaza-mercado';
import { PlazaServices } from '../../servicios/plazaServices.services';
import { SectorInterface } from '../../modelos/interfaces/interfaces.inteface';
import { SectoresServices } from '../../servicios/sectorServices.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { PuestosServices } from '../../servicios/puestoServices.service';
import { AsignacionpuestoService } from '../../servicios/asignacionpuesto.service';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { TipoPuesto } from '../../modelos/tipos/tipopuesto';
import { BeneficiarioService } from '../../servicios/beneficiario.service';
import { DatosPipe } from 'app/servicios/pipes/pipedatostabla.pipe';

import swal from 'sweetalert2';
import { Router, NavigationEnd } from '@angular/router';
import { GLOBAL } from 'app/servicios/globales';
declare const $: any;

@Component({
  selector: 'app-puesto',
  templateUrl: './puesto.component.html',
  styleUrls: ['./puesto.component.scss'],
  providers: [
    ExcepcionService,
    PlazaServices,
    SectoresServices,
    PuestosServices,
    BeneficiarioService,
    AsignacionpuestoService,
    DatosPipe
  ]
})
export class PuestoComponent implements OnInit, AfterViewInit, OnDestroy {


  // ----------------------------------------------------------------------------------------------------------
  // Propiedades
  // ----------------------------------------------------------------------------------------------------------

  // pkid
  // Asignacion de Puesto
  // Numero de Resolución
  // Documento
  // Estado
  // Tarifa
  // Saldo
  // Plaza
  // Sector
  // Puesto
  // Beneficiario
  // Asignacion de Puesto Activa/Inactiv
  /**
   * Cabeceras de las columnas de la tabla
   */
  cabecerasColumnas: string[] = [
    'numeroresolucionasignacionpuesto',
    'fkidbeneficiario',
    'fkidplaza',
    'fkidpuesto',
    'valortarifapuesto',
    'asignacionpuestoactivo',
    'estadoasignacionpuesto',
    'rutaresolucionasignacionpuesto',
    'actions'
  ];

  opcionDesactivacion = '';

  asignacionDesactivar = null;

  respuestaAsignaciones = true;
  /**
   * Datos a mostrar en la tabla
   */
  dataSource: MatTableDataSource<any>;

  /**
   * Paginador de la tabla
   */
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * Organizador de la tabla
   */
  @ViewChild(MatSort) sort: MatSort;

  /**
   * Asignaciones de puesto en el sistema
   */
  asignacionesPuesto: any[] = [];

  /**
   * Plazas de mercado en el sistema
   */
  plazas: PlazaMercado[] = [];

  /**
   * Sectores
   */
  sectores: SectorInterface[] = [];

  /**
   * Tipos de puesto
   */
  tiposPuesto: TipoPuesto[] = [];

  /**
   * Usuarios
   */
  beneficiarios: any[] = [];

  /**
   * Listado de puestos
   */
  puestos: any[] = [];

  /**
   * Variable para mostrar u ocultar la tabla
   */
  oculta = false;

  /**
   * mensaje de respuesta
   */
  mensajeRespuestaServidor = '';

  /**
   * variable de entrada de texto del input buscar(nombre tipo sector)
   */
  filtroNombreBeneficiario = '';

  /**
   *  Filtro tipo de puesto
   */
  filtroTipoPuesto = '';

  /**
   *  Filtro tipo de puesto
   */
  filtroPuesto = '';

  /**
   *  Filtro por plaza
   */
  filtroPlaza: any = { nombreplaza: '', pkidplaza: -1 };

  /**
   *  Filtro sector
   */
  filtroSector = '';

  /**
   * Filtro para ocultar los puestos asignados
   */
  filtroPuestosAsignados = false;

  /**
   * clase dinamica pra carga de mensajes
   */
  claseDinamic = 'alert alert-warning alert-with-icon';

  /**
   * Iconono alerta mensaje
   */
  iconAlert = 'warning';

  /**
   * Form control del selector de plazas
   */
  fkidplaza = new FormControl();


  // ----------------------------------------------------------------------------------------------------------
  // Propiedades formulario
  // ----------------------------------------------------------------------------------------------------------

  /**
   * Formulario para la asignación de un puesto
   */
  asignacionPuestoForm: FormGroup;

  /**
   * Filtro de puestos
   */
  filtroPuestos = '';

  /**
   * Filtro de usuarios por identificacion
   */
  filtroIdBeneficiario = '';

  /**
   * Puestos resultantes de la busqueda
   */
  puestosEncontrados: any[] = [];

  /**
   * Puesto seleccionado por el usuario
   */
  puestoSeleccionado: any = { puesto: { numeropuesto: '' } };

  /**
   * Usuarios resultantes de la busqueda
   */
  beneficiariosEncontrados: any[] = [];

  /**
   * usuario seleccionado por el usuario
   */
  beneficiarioSeleccionado: any = { pkidbeneficiario: '', nombrebeneficiario: '', identificacionbeneficiario: '' };

  /**
   * Estado (activo o inactivo) de una asignación
   */
  asignacionActiva = true;

  /**
   * Mensaje de respuesta del servidor cuando se hace una petición desde el formulario de asignación
   */
  mensajeRespuestaForm = '';

  /**
   * Bandera para editar
   */
  banderaEditar = false;

  /**
   * Bandera para editar un inactivo
   */
  banderaEditarInactivo = false;

  // ----------------------------------------------------------------------------------------------------------
  // datos documento
  // ----------------------------------------------------------------------------------------------------------

  /**
   * Link al documento
   */
  linkDocumento: any;

  /**
   * Archivo a subir
   */
  selectedFile: File = null;

  /**
   * Url de documento
   */
  urlDocumento: any;

  navigationSubscription;

  // ----------------------------------------------------------------------------------------------------------
  // Constructores
  // ----------------------------------------------------------------------------------------------------------

  /**
   * Constructor del componente asignación de puestos
   * @param _plazaService Servicio de plazas
   * @param _sectorService Servicio de sector
   * @param _puestoService Servicio de puestos
   * @param _asignacionPuestoService Servicio de asignación de puestos
   * @param _exceptionService Servicio de excepciones
   * @param _beneficiarioService Servicio de beneficiario
   * @param injector Injector
   */
  constructor(
    private _plazaService: PlazaServices,
    private _sectorService: SectoresServices,
    private _puestoService: PuestosServices,
    private _asignacionPuestoService: AsignacionpuestoService,
    private _exceptionService: ExcepcionService,
    private _beneficiarioService: BeneficiarioService,
    private injector: Injector,
    private router: Router
  ) {
    this.recargarComponente();
  }

  /**
   * Método de iniciación del comonente
   */
  ngOnInit() {
    // this.listarAsignacionesPuesto();
    // this.listarPlazas();
    // this.incializarFormulario();
    // this.listarBeneficiarios();
    // this.listarTiposPuesto();
  }

  ngAfterViewInit() {
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
            this.listarAsignacionesPuesto();
          } else {
            this.listarAsignacionesPuesto();
            this.listarPlazas();
            this.incializarFormulario();
            this.listarBeneficiarios();
            this.listarTiposPuesto();
          }
        }
      }
    )
  }

  /**
   * Modifica el filtro por plaza
   */
  modificaFiltroPlaza() {
    if (this.filtroPlaza !== '') {
      this.aplicarFiltro();
      this.listarSectores(this.filtroPlaza.pkidplaza);
    } else {
      this.filtroPlaza = { nombreplaza: '', pkidplaza: -1 };
      this.filtroSector = '';
      this.sectores = [];
      this.aplicarFiltro();
    }
  }

  /**
   * Aplica los filtros seleccionados por el usuario
   */
  aplicarFiltro() {

    this.dataSource.filter = this.filtroNombreBeneficiario + this.filtroTipoPuesto + this.filtroPuesto + (!this.filtroPuestosAsignados);
    if (this.filtroPlaza !== undefined) {
      this.dataSource.filter += this.filtroPlaza.nombreplaza + this.filtroSector;
    }
  }

  /**
   * Agrega el filtro de la tabla
   */
  setFilterDataTable() {
    try {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: any, filter: string) => {

        if (
          data.beneficiario.nombrebeneficiario != null && data.tipopuesto.pkidtipopuesto != null &&
          data.plaza !== undefined && data.plaza != null && data.plaza.nombreplaza != null && data.sector.nombresector != null
        ) {
          // console.log('entroooooooooooooooooooooooooo');
          return (
            (
              (data.beneficiario.nombrebeneficiario.toLowerCase().indexOf(this.filtroNombreBeneficiario) !== -1) ||
              (data.beneficiario.nombrebeneficiario.toLowerCase().indexOf('Sin Asignar') !== -1)
            ) &&
            (data.tipopuesto.nombretipopuesto.indexOf(this.filtroTipoPuesto) !== -1) &&
            (data.plaza.nombreplaza.indexOf(this.filtroPlaza.nombreplaza) !== -1) &&
            (data.sector.nombresector.indexOf(this.filtroSector) !== -1) &&
            (data.puesto.numeropuesto.indexOf(this.filtroPuesto) !== -1) &&
            // ((this.filtroPuestosAsignados === true) ? (data.asignacionpuestoactivo === false) : (data.asignacionpuestoactivo === true))
            (data.asignacionpuestoactivo === !this.filtroPuestosAsignados)
          );
        } else {
          return (data.asignacionpuestoactivo === !this.filtroPuestosAsignados);
        }
      };
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      const funcion = 'setFilterDataTable()';

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);

    }

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
      });
  }

  /**
   * Lista las asignaciones de puesto registradas en el sistema
   */
  listarAsignacionesPuesto() {
    try {
      this.respuestaAsignaciones = true;
      this._asignacionPuestoService.consultarAsignacionesPuesto()
        .subscribe(
          (resp: any) => {
            // console.log(resp);
            this.respuestaAsignaciones = false;
            if (resp.status === 'Exito' || resp.status === 'Success') {
              this.asignacionesPuesto = resp.asignacionpuesto;
              // console.log(this.asignacionesPuesto);

              this.dataSource = this.dataSource = new MatTableDataSource<any>(this.asignacionesPuesto);

              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              this.aplicarFiltro();
              this.setFilterDataTable();

            } else {
              this.mensajeRespuestaServidor = 'Se produjo un error en el servidor al consultar asignaciones de puesto.' +
                'Por favor intente nuevamente';
            }
          }
        );
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
   * Lista las plazas de mercado registradas en el sistema
   */
  listarTiposPuesto() {
    try {
      this._puestoService.consultarTiposdePuesto()
        .subscribe(
          (resp: any) => {
            // console.log(resp);
            if (resp.status === 'Exito') {
              this.tiposPuesto = resp.tipopuesto;
            } else {
              this.mensajeRespuestaServidor = 'Se produjo un error en el servidor al consultar plazas. Por favor intente nuevamente';
            }
          });
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
   * Lista las plazas de mercado registradas en el sistema
   */
  listarPlazas() {
    try {
      this._plazaService.consultarTodasPlazas()
        .subscribe(
          (resp: any) => {
            // console.log(resp);
            if (resp.status === 'Exito') {
              this.plazas = resp.plaza;
            } else {
              this.mensajeRespuestaServidor = 'Se produjo un error en el servidor al consultar plazas. Por favor intente nuevamente';
            }
          });
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
   * Lista los puestos de mercado registradas en el sistema
   */
  listarPuestos() {
    try {
      this._asignacionPuestoService.consultarPuestosDisponibles()
        .subscribe(
          (resp: any) => {
            // console.log(resp);

            if (resp.status.toString().indexOf('Exito') !== -1) {
              this.puestos = resp.puesto;
              // console.log('puestos:' + JSON.stringify(this.puestos));
            } else {
              this.mensajeRespuestaServidor = 'Se produjo un error en el servidor al consultar puestos. Por favor intente nuevamente';
            }
          });
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
   * Lista los puestos de mercado registradas en el sistema
   */
  listarBeneficiarios() {
    try {
      this._beneficiarioService.consultarBeneficiarios()
        .subscribe(
          (resp: any) => {
            if (resp.status === 'Success') {
              this.beneficiarios = resp.beneficiario;
              // console.log(this.beneficiarios);
            } else {
              this.mensajeRespuestaServidor = 'Se produjo un error en el servidor al consultar beneficiarios. Por favor intente nuevamente';
            }
          });
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
   * Busca sectores por plaza
   * @param pkidPlaza pkid de la plaza a la cual pertenecen los sectores a listar
   */
  listarSectores(pkidPlaza) {
    try {
      this.sectores = [];
      if (pkidPlaza !== '') {
        this._sectorService.consultarSectoresPorPlaza(pkidPlaza).subscribe(
          resp => {
            if (resp.length <= 1) {
              this.mensajeRespuestaServidor = 'Error en el servidor al consultar sectores.';
            } else {
              this.sectores = resp.sector;
            }
          },
          error => {
            this.mensajeRespuestaServidor = 'Error en el servidor al consultar sectores, intentelo nuevamente';
          }
        );
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

  // ----------------------------------------------------------------------------------------------------------
  // Métodos Formulario
  // ----------------------------------------------------------------------------------------------------------

  /**
   * Inicializa el formulario para asignación de puestos en blanco
   */
  incializarFormulario() {
    this.asignacionPuestoForm = new FormGroup({
      numeroresolucion: new FormControl(null, Validators.required),
      estadoasignacionpuesto: new FormControl(null, Validators.required),
      asignacionpuestoactivo: new FormControl(true),
      valortarifapuesto: new FormControl(null, Validators.required)
    });
  }

  /**
   * Busca por numero de puesto
   * @param pNumeroPuesto Termino de busueda
   */
  buscarPuestoPorNumero() {
    if (this.filtroPuestos !== '') {

      const resultado = this.puestos.filter(puesto => puesto.numeropuesto.indexOf(this.filtroPuestos) > -1);

      // const resultado = this.puestos.filter(puesto =>
      //   (puesto.numeropuesto.indexOf(this.filtroPuestos) > -1) ||
      //   (puesto.puestoactivo === false));
      // return resultado;
      // console.log('Resultado de busqueda: ');
      // console.log(resultado);

      this.puestosEncontrados = resultado;
      $('#myModal').modal('show');

    } else {
      this.puestosEncontrados = [];
    }

  }

  /**
   * Asigna a una variable el puesto seleccionado por el usuario
   */
  seleccionarPuesto(pPuesto) {
    this.puestoSeleccionado.puesto = pPuesto;
    // console.log(pPuesto);

    console.log(this.puestoSeleccionado);
  }

  /**
   * Busca un beneficiario por identificación
   */
  buscarBeneficiarioId() {
    // console.log(this.usuarios[0].pkidusuario);
    if (this.filtroIdBeneficiario !== '') {
      // console.log(this.filtroIdBeneficiario);
      const resultado = this.beneficiarios.filter(
        beneficiario => beneficiario.identificacionbeneficiario === this.filtroIdBeneficiario
      );
      // return resultado;
      // console.log('Resultado de busqueda: ');
      // console.log(resultado);

      this.beneficiariosEncontrados = resultado;
      $('#modalBeneficiario').modal('show');

    } else {
      this.beneficiariosEncontrados = [];
    }
  }

  /**
   * Asigna a una variable el puesto seleccionado por el usuario
   */
  seleccionarBeneficiario(pBeneficiario) {
    this.beneficiarioSeleccionado = pBeneficiario;
    // console.log(this.beneficiarioSeleccionado);
  }

  guardarCambios() {
    if (this.banderaEditar === true) {
      this.editarAsignacionPuesto();
    } else {
      this.crearAsignaciónPuesto();
    }
  }

  /**
   * Crear una asignación de puesto
   */
  crearAsignaciónPuesto() {
    this.respuestaAsignaciones = true;
    const uploadData = new FormData();

    if (this.selectedFile != null) {
      uploadData.append('fichero_usuario', this.selectedFile, this.selectedFile.name);
      // console.log('-----------------------------------------------');
      // console.log(uploadData);
      // console.log('-----------------------------------------------');
    }

    const nuevaAsignacionPuesto = {
      'fkidpuesto': this.puestoSeleccionado.puesto.pkidpuesto,
      'fkidbeneficiario': this.beneficiarioSeleccionado.pkidbeneficiario,
      'numeroresolucionasignacionpuesto': this.asignacionPuestoForm.value.numeroresolucion,
      'estadoasignacionpuesto': 'Habilitado',
      'asignacionpuestoactivo': true,
      'valortarifapuesto': this.asignacionPuestoForm.value.valortarifapuesto
    }

    try {
      // console.log(nuevaAsignacionPuesto);
      this._asignacionPuestoService.crearAsignacionPuesto(nuevaAsignacionPuesto, uploadData)
        .subscribe(
          (resp: any) => {
            this.respuestaAsignaciones = false;
            // console.log(resp);
            if (resp.status === 'Exito') {
              this.listarAsignacionesPuesto();
              this.mostrarMensaje(1);
              this.mensajeRespuestaServidor = resp.status + ':  ' + resp.msg;
              this.oculta = !this.oculta;
              this.listarAsignacionesPuesto();
              this.selectedFile = null;
              this.linkDocumento = '';
              this.urlDocumento = '';
            } else {
              this.mensajeRespuestaForm = resp.status + ':  ' + resp.msg;
              this.iconAlert = 'error';
              console.log(resp.status + ':  ' + resp.msg);
            }
          }
        );
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
   * Edita una asignaciòn de puesto
   */
  editarAsignacionPuesto() {
    this.respuestaAsignaciones = true;

    const uploadData = new FormData();

    if (this.selectedFile != null) {
      uploadData.append('fichero_usuario', this.selectedFile, this.selectedFile.name);
      // console.log('-----------------------------------------------');
      // console.log(uploadData);
      // console.log('-----------------------------------------------');
    }


    const asignacioneditar = {
      'fkidpuesto': this.puestoSeleccionado.puesto.pkidpuesto,
      'fkidbeneficiario': this.beneficiarioSeleccionado.pkidbeneficiario,
      'numeroresolucionasignacionpuesto': this.asignacionPuestoForm.value.numeroresolucion,
      'estadoasignacionpuesto': this.asignacionPuestoForm.value.estadoasignacionpuesto,
      'asignacionpuestoactivo': this.asignacionPuestoForm.value.asignacionpuestoactivo,
      'valortarifapuesto': this.asignacionPuestoForm.value.valortarifapuesto,
      'pkidasignacionpuesto': this.puestoSeleccionado.pkidasignacionpuesto,
      'rutaresolucionasignacionpuesto': this.puestoSeleccionado.rutaresolucionasignacionpuesto
    }

    // console.log(asignacioneditar);

    try {
      this._asignacionPuestoService.editarAsignacion(asignacioneditar, uploadData)
        .subscribe(
          (resp: any) => {
            this.respuestaAsignaciones = false;
            if (resp.status === 'Exito') {
              this.listarAsignacionesPuesto();
              this.mostrarMensaje(1);
              this.mensajeRespuestaServidor = resp.status + ':  ' + resp.msg;
              this.oculta = !this.oculta;
              this.listarAsignacionesPuesto();
            } else {
              this.mostrarMensaje(2);
              this.mensajeRespuestaForm = resp.status + ':  ' + resp.msg;
              console.log(resp.status + ':  ' + resp.msg);
            }
          }
        );
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
   * Metodo que valida y alterna los mensaje de mostrar el documento de tarifas
   */
  deleteFile() {
    this.selectedFile = null;
    this.linkDocumento = '';
    this.urlDocumento = null;
    this.puestoSeleccionado.rutaresolucionasignacionpuesto = false;
  }

  /**
   * Muestra el mensaje de confirmación
   * @param codeError Codigo de error
   */
  mostrarMensaje(codeError: number) {
    if (codeError === 0) {
      this.claseDinamic = 'alert alert-warning alert-with-icon';
      this.iconAlert = 'warning';
    } else if (codeError === 1) {
      this.claseDinamic = 'alert alert-success alert-with-icon';
      this.iconAlert = 'done';
    } else if (codeError === 2) {
      this.claseDinamic = 'alert alert-danger alert-with-icon';
      this.iconAlert = 'error';
    }
  }

  /**
   * Valida el formulario, el puesto y usuario seleccionados para habilidar el boton de guardar
   */
  validarFormulario(): boolean {
    // console.log(this.beneficiarioSeleccionado.identificacionbeneficiario);
    return (
      (this.asignacionPuestoForm.valid) &&
      (this.puestoSeleccionado.numeropuesto !== '') &&
      (this.beneficiarioSeleccionado.identificacionbeneficiario !== '')
    ) ? false : true;
  }

  /**
   * Opción nueva asignación (Botón)
   */
  opcionNuevaAsignacion() {
    this.oculta = true;
    this.banderaEditar = false;
    this.banderaEditarInactivo = false;
    this.puestoSeleccionado = { puesto: { numeropuesto: '' } };
    this.beneficiarioSeleccionado = { pkidbeneficiario: '', nombrebeneficiario: '', identificacionbeneficiario: '' };
    this.filtroIdBeneficiario = '';
    this.filtroPuestos = '';
    this.linkDocumento = '';
    this.urlDocumento = '';
    this.mensajeRespuestaForm = '';
    this.mensajeRespuestaServidor = '';
    this.incializarFormulario();
    this.listarPuestos();
  }

  /**
   * Acción del botón cancelar
   */
  cancelarEdicion() {
    this.oculta = false;
    this.filtroNombreBeneficiario = '';
    this.filtroTipoPuesto = '';
    this.filtroPlaza = { nombreplaza: '', pkidplaza: -1 };
    this.filtroSector = '';
    this.filtroPuestosAsignados = false;
    this.puestoSeleccionado = {};
    this.beneficiarioSeleccionado = { pkidbeneficiario: '', nombrebeneficiario: '', identificacionbeneficiario: '' };
    this.incializarFormulario();
    this.aplicarFiltro();
    this.mensajeRespuestaForm = '';
    this.mensajeRespuestaServidor = '';
  }

  /**
   *
   */
  opcionEditarActivos(pAsignacion) {
    if (pAsignacion.asignacionpuestoactivo === false) {
      // console.log(this.puestoSeleccionado);
      this.banderaEditarInactivo = true;
    } else {
      this.banderaEditarInactivo = false;
    }

    this.oculta = true;
    this.banderaEditar = true;
    this.puestoSeleccionado = pAsignacion;
    // console.log(this.puestoSeleccionado);

    if (this.puestoSeleccionado.beneficiario.pkidbeneficiario == null) {
      this.beneficiarioSeleccionado = { pkidbeneficiario: '', nombrebeneficiario: '', identificacionbeneficiario: '' };
    } else {
      this.beneficiarioSeleccionado = this.puestoSeleccionado.beneficiario;
      // console.log(this.beneficiarioSeleccionado);
    }

    this.linkDocumento = (this.puestoSeleccionado.rutaresolucionasignacionpuesto !== 'sin documento') ?
      this.puestoSeleccionado.rutaresolucionasignacionpuesto : '';

    this.urlDocumento = (this.puestoSeleccionado.rutaresolucionasignacionpuesto !== 'sin documento') ?
      this.puestoSeleccionado.rutaresolucionasignacionpuesto : '';

    console.log(this.puestoSeleccionado);

    this.asignacionPuestoForm = new FormGroup({
      numeroresolucion: new FormControl(this.puestoSeleccionado.numeroresolucionasignacionpuesto, Validators.required),
      estadoasignacionpuesto: new FormControl(this.puestoSeleccionado.estadoasignacionpuesto, Validators.required),
      asignacionpuestoactivo: new FormControl(this.puestoSeleccionado.asignacionpuestoactivo),
      valortarifapuesto: new FormControl(this.puestoSeleccionado.valortarifapuesto, Validators.required)
    });
  }

  asignarDependiente(pElement) {
    if (pElement !== undefined && pElement !== null) {
      this.router.navigate(['administracion/dependiente', pElement.pkidasignacionpuesto]);
    }
  }

  /**
   *
   */
  asignarPuesto(pAsignacion) {
    this.oculta = true;
    this.puestoSeleccionado = pAsignacion;

    if (this.puestoSeleccionado.beneficiario.pkidbeneficiario == null) {
      this.beneficiarioSeleccionado = { pkidbeneficiario: '', nombrebeneficiario: '', identificacionbeneficiario: '' };
    } else {
      this.beneficiarioSeleccionado = this.puestoSeleccionado.beneficiario;
      // console.log(this.beneficiarioSeleccionado);
    }

    // console.log(this.puestoSeleccionado);

    this.asignacionPuestoForm = new FormGroup({
      numeroresolucion: new FormControl(this.puestoSeleccionado.numeroresolucionasignacionpuesto, Validators.required),
      estadoasignacionpuesto: new FormControl(this.puestoSeleccionado.estadoasignacionpuesto, Validators.required),
      asignacionpuestoactivo: new FormControl(true),
      valortarifapuesto: new FormControl(this.puestoSeleccionado.valortarifapuesto, Validators.required)
    });

  }

  /**
   * Método para el botón de desactivar asignación en la tabla de asignaciones
   * @param element Asignación a desactivar
   */
  desactivarAsignacion(element) {
    this.opcionDesactivacion = 'Terminado';
    $('#modalCancelarAsignacion').modal('show');
    this.asignacionDesactivar = element;
  }

  /**
   * Confirma la cancelaciòn de la asignaciòn
   */
  confirmarCancelacion() {

    const asignacionCancelar = {
      'fkidpuesto': this.asignacionDesactivar.puesto.pkidpuesto,
      'fkidbeneficiario': this.asignacionDesactivar.beneficiario.pkidbeneficiario,
      'numeroresolucionasignacionpuesto': this.asignacionDesactivar.numeroresolucionasignacionpuesto,
      'estadoasignacionpuesto': this.opcionDesactivacion,
      'asignacionpuestoactivo': false,
      'valortarifapuesto': this.asignacionDesactivar.valortarifapuesto,
      'pkidasignacionpuesto': this.asignacionDesactivar.pkidasignacionpuesto,
      'rutaresolucionasignacionpuesto': this.puestoSeleccionado.rutaresolucionasignacionpuesto
    }

    this._asignacionPuestoService.cancelarAsignacion(asignacionCancelar)
      .subscribe(
        (resp: any) => {
          console.log(resp);
          if (resp.status.toString().toLowerCase().indexOf('exito') > -1) {
            this.listarAsignacionesPuesto();
            this.mostrarMensaje(1);
            this.mensajeRespuestaServidor = resp.status + ':  ' + resp.msg;
            this.oculta = false;
            this.asignacionDesactivar = null;
            this.opcionDesactivacion = '';
            this.listarAsignacionesPuesto();
            $('#modalCancelarAsignacion').modal('hide');

          } else {
            this.mensajeRespuestaForm = resp.status + ':  ' + resp.msg;
            this.iconAlert = 'error';
            console.log(resp.status + ':  ' + resp.msg);
          }
        }
      );
  }
}

