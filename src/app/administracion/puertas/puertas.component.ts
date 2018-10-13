import { Component, OnInit, ViewChild, Injector, OnDestroy } from '@angular/core';
import { Puerta } from '../../modelos/puerta';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { PuertasService } from '../../servicios/puertasService.service';
import { ExcepcionService } from '../../servicios/excepcionServices.services';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlazaMercado } from '../../modelos/plaza-mercado';
import { PlazaServices } from '../../servicios/plazaServices.services';
import { DialogConfirmacionTipos } from '../../parametrizacion/dialogTipo.confirm.component';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-puertas',
  templateUrl: './puertas.component.html',
  providers: [PuertasService, ExcepcionService, PlazaServices]
})
export class PuertasComponent implements OnInit, OnDestroy {

  // ----------------------------------------------------------------------------------------------------------------
  // Propiedades
  // ----------------------------------------------------------------------------------------------------------------

  /**
   * Puertas registradas en el sistema
   */
  puertas: Puerta[] = [];

  /**
   * Cabeceras de las columnas de la tabla
   */
  cabecerasColumnas: string[] = ['codigopuerta', 'nombrepuerta', 'puertaactivo', 'fkidplaza', 'actions'];

  /**
   * Datos a mostrar en la tabla
   */
  dataSource: MatTableDataSource<Puerta>;

  /**
   * Paginador de la tabla
   */
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * Organizador de la tabla
   */
  @ViewChild(MatSort) sort: MatSort;

  /**
   * Objeto puerta a editar
   */
  puertaEdit = new Puerta('', false, '', '', '');

  /**
   * Estado del toggle para mostrar activos e inactivos
   */
  estadoToggle = false;

  /**
   * Plaza seleccionada para el filtro
   */
  plazaselect = '';

  /**
   * variable de entrada de texto del imput buscar(cedula o nombre)
   */
  filtroNombre = '';

  /**
   * Bandera para la visualización de la tabla o del formulario
   */
  muestraTabla = false;

  /**
   * mensaje de respuesta
   */
  public mensaje: string;

  /**
   * clase dinamica pra carga de mensajes
   */
  claseDinamic = 'alert alert-warning alert-with-icon';

  /**
   * Iconono alerta mensaje
   */
  iconAlert = 'warning';

  //Mensaje para el toggle de mostrar activos/inactivos
  msjToggle = 'Mostrar puestas desactivadas';

  // ----------------------------------------------------------------------------------------------------------------
  // propiedades para formulario
  // ----------------------------------------------------------------------------------------------------------------


  /**
   * Formulario de registro
   */
  puertasForm: FormGroup;

  /**
   * Estado de la puerta
   */
  active = false;

  /**
   * Texto toggle
   */
  textActive = 'Desactivado';

  /**
   * Plazas de mercado en el sistema
   */
  plazas: PlazaMercado[] = [];

  /**
   * Respuesta del servidor
   */
  respuesta: string;

  // ----------------------------------------------------------------------------------------------------------------
  // Constructor
  // ----------------------------------------------------------------------------------------------------------------
  navigationSubscription;

  /**
   * Constructor del componente puertas
   * @param _puertaService Servicio de puertas
   * @param _exceptionService Servicio de excepciones
   * @param dialog Dialogo
   */
  constructor(
    private _puertaService: PuertasService,
    private _plazaService: PlazaServices,
    private _exceptionService: ExcepcionService,
    private injector: Injector,
    public dialog: MatDialog,
    private router: Router) {
    this.recargarComponente();

  }

  recargarComponente() {
    this.navigationSubscription = this.router.events.subscribe(
      (e: any) => {
        if (e instanceof NavigationEnd) {
          console.log('recargando componente');
          if (this.muestraTabla) {
            this.muestraTabla = !this.muestraTabla;
            this.listarPuertas();
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

  ngOnInit() {
    this.listarPuertas();
    this.inicializaForm();
    this.consultarPlazas();
  }

  // ----------------------------------------------------------------------------------------------------------------
  // Métodos
  // ----------------------------------------------------------------------------------------------------------------

  /**
   * Lista todas las puertas registradas en el sistema
   */
  listarPuertas() {
    // this.dataSource = new MatTableDataSource<Puerta>(this.puertas);
    try {
      this.respuesta = null;
      this._puertaService.consultarPuertas().subscribe(
        resp => {
          this.respuesta = resp;
          this.puertas = resp;
          this.dataSource = this.dataSource = new MatTableDataSource<Puerta>(this.puertas);

          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.aplicarFiltro();
          this.setFilterDataTable();
          // console.log(this.puertas);
        }
      );

    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      const funcion = 'consultarParqueaderos()';
      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
    }
  }

  /**
   * Accion que realiza el botón editar
   */
  editarPuerta(pPuerta: Puerta) {
    this.muestraOcultaTabla();
    this.puertaEdit = pPuerta;
    this.inicializaFormEdit();
  }

  /**
   * Desactiva una puerta en el sistema
   */
  desactivarPuerta(pPuerta: Puerta) {
    try {

      pPuerta.puertaactivo = false;
      this._puertaService.editarPuerta(pPuerta).subscribe(
        (resp: any) => {
          // console.log(resp);
          this.mensaje = resp.msg + ' Nombre Puerta : ' + resp.puerta.nombrepuerta;
          this.mostrarMensaje(1);
        }
      );
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      const funcion = 'desactivarPuerta()';

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
    }
  }

  /**
   * Aplica el filtro por nombre, por plaza o por estado
   */
  aplicarFiltro() {
    this.dataSource.filter = this.filtroNombre + (!this.estadoToggle) + this.plazaselect;
  }

  //Cambia el mensaje del toggle para mostrar activos o desactivados
  cambiarMensajeToggle() {
    this.msjToggle = this.estadoToggle ? 'Mostrar puertas activas' : 'Mostrar puertas desactivadas';
  }

  /**
   * Limpia el imput de buscar por nombre
   */
  clearInput() {
    this.filtroNombre = '';
    this.aplicarFiltro();
  }

  /**
   * Alterna la visualizacion de la tabla o el formulario
   */
  muestraOcultaTabla() {
    this.muestraTabla = !this.muestraTabla;
  }

  /**
   * Cancela la edición de una puerta
   */
  cancelarEdicion() {
    this.puertaEdit = new Puerta('', false, '', '', '');
    this.inicializaForm();
    this.muestraTabla = !this.muestraTabla;
    this.mensaje = '';
    this.filtroNombre = '';
    this.estadoToggle = false;
    this.plazaselect = '';
  }


  /**
   * Despliega el dialogo de eliminar
   * @param pPuerta Puerta a eliminar
   */
  openDialog(pPuerta: Puerta): void {
    try {
      const nombrepuerta = pPuerta.nombrepuerta;
      const idPuerta = pPuerta.pkidpuerta;

      const dialogRef = this.dialog.open(DialogConfirmacionTipos, {
        width: '250px',
        data: { nombre: nombrepuerta, id: idPuerta, tipoIdentifi: 6 }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.mensaje = result.respuesta + ' Nombre Puerta : ' + nombrepuerta;
        if (result != null) {
          console.log(result.status);
          if (result.status === 'error') {
            this.mostrarMensaje(0);
          } else if (result.status === 'Exito') {
            this.mostrarMensaje(1)
            this.estadoToggle = false;
            this.listarPuertas();
            console.log('LISTANDO PUERTAS');

          }
        }
      });
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      const funcion = 'openDialog()';

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);

    }
  }

  /**
   * Cierra el dialogo del mensaje
   */
  closeDialog() {
    this.mensaje = '';
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

  /**
   * Agrega el filtro de la tabla
   */
  setFilterDataTable() {
    try {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: Puerta, filter: string) => {

        return ((data.nombrepuerta.toLowerCase().indexOf(this.filtroNombre) !== -1) &&
          (data.puertaactivo === !this.estadoToggle) &&
          (data.nombreplaza.indexOf(this.plazaselect) !== -1));
      };
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      const funcion = 'setFilterDataTable()';

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);

    }

  }

  // ----------------------------------------------------------------------------------------------------------------
  // Métodos Formulario
  // ----------------------------------------------------------------------------------------------------------------

  /**
   * Inicializa el formulario de plazas
   */
  inicializaForm() {
    this.puertasForm = new FormGroup({
      codigopuerta: new FormControl(null),
      nombrepuerta: new FormControl(null, Validators.required),
      puertaactivo: new FormControl(true),
      fkidplaza: new FormControl(null, Validators.required)
    });
  }

  /**
   * Inicializa el formulario para editar una puerta
   */
  inicializaFormEdit() {
    console.log(this.puertaEdit);
    if (this.puertaEdit !== undefined) {
      this.puertasForm = new FormGroup({
        codigopuerta: new FormControl(this.puertaEdit.codigopuerta),
        nombrepuerta: new FormControl(this.puertaEdit.nombrepuerta, Validators.required),
        puertaactivo: new FormControl(this.puertaEdit.puertaactivo),
        fkidplaza: new FormControl(this.puertaEdit.fkidplaza, Validators.required)
      });
    }
  }

  /**
   * Crea una nueva puerta
   */
  guardarCambios() {
    try {
      if (this.puertaEdit.pkidpuerta === '') {
        const nuevaPuerta = new Puerta(
          this.puertasForm.value.nombrepuerta,
          this.puertasForm.value.puertaactivo,
          this.puertasForm.value.fkidplaza + '',
          this.puertasForm.value.codigopuerta
        );
        this._puertaService.crearPuerta(nuevaPuerta).subscribe(
          (resp: any) => {
            this.muestraOcultaTabla();
            this.inicializaForm();
            this.listarPuertas();
            // console.log(resp);
            this.mensaje = resp.msg + ' Nombre Puerta : ' + resp.puerta.nombrepuerta;
            this.mostrarMensaje(1);

            this.filtroNombre = '';
            this.estadoToggle = false;
            this.plazaselect = '';
          }
        );
      } else {
        const puertaEditada = new Puerta(
          this.puertasForm.value.nombrepuerta,
          this.puertasForm.value.puertaactivo,
          this.puertasForm.value.fkidplaza + '',
          this.puertasForm.value.codigopuerta,
          this.puertaEdit.pkidpuerta + ''
        );

        this._puertaService.editarPuerta(puertaEditada).subscribe(
          resp => {
            this.muestraOcultaTabla();
            this.inicializaForm();
            this.listarPuertas();
            // console.log(resp);
            this.mensaje = resp.msg + ' Nombre Puerta : ' + resp.puerta.nombrepuerta;
            this.mostrarMensaje(1);

            this.filtroNombre = '';
            this.estadoToggle = false;
            this.plazaselect = '';
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
   * Cambia el estado de una puerta
   */
  cambiarEstadoForm() {
    this.active = !this.active;
    this.textActive = this.active ? 'Activado' : 'Desactivado';
  }

  /**
   * Consulta las plazas que existen en el sistema
   */
  consultarPlazas() {
    try {

      this._plazaService.consultarTodasPlazas().subscribe(
        (resp: any) => {
          this.plazas = resp.plaza;
          // console.log(this.plaza);
        }
      );

    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      const funcion = 'consultarPlazas()';

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
    }
  }
}

