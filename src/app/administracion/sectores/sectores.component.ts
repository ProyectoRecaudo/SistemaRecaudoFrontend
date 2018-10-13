import { Component, OnInit, ViewChild, Injector, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { plainToClass } from "class-transformer";
import { ExcepcionService } from '../../servicios/excepcionServices.services';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { PlazaMercado } from '../../modelos/plaza-mercado';
import { SectoresServices } from '../../servicios/sectorServices.service';
import { ZonasServices } from '../../servicios/zonaServices.services';
import { Zona } from '../../modelos/zona';
import { TipoSectorServices } from '../../servicios/tipos-services/tiposectorServices.services';
import { TipoSector } from '../../modelos/tipos/tiposector';
import { DialogConfirmacionTipos } from '../../parametrizacion/dialogTipo.confirm.component';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-sectores',
  templateUrl: './sectores.component.html',
  styleUrls: ['./sectores.component.scss'],
  providers: [ExcepcionService, SectoresServices, ZonasServices, TipoSectorServices]

})
export class SectoresComponent implements OnInit,OnDestroy {


  cabecerasColumnas = ['nombresector', 'nombrezona', 'nombretiposector', 'sectoractivo', 'actions'];
  //variable de entrada de texto del imput buscar(nombre sector )
  filtroNombreSector: string = '';
  //varible de mostrar desctivados
  toggleActDesc: boolean = false;

  sector: SectorInterface[];

  //Variables de paginacion y ordenamiento
  dataSource: MatTableDataSource<SectorInterface>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  //respuesta del servidor
  public respuesta;

  //clase dinamica pra carga de mensajes
  claseDinamic = "alert alert-warning alert-with-icon";
  iconAlert = "warning";

  //mensaje de respuesta
  public mensaje: string;

  //variable para retornar las plazas de mercado
  plazasmercado: PlazaMercado[];
  zonas: Zona[] = [];

  //boton desactivado en caso q no hayan roles o este caragndo
  botonBloqueo: boolean = true;

  //variable asignada al selector de busqeuda por plaza
  plazaselect: string = '';
  zonaselect: string = '';

  //Mensaje para el toggle de mostrar activos/inactivos
  msjToggle = 'Mostrar equipos desactivados';

  /*-------------------------------------------------------------------------- */
  //Variables para el formulario de agregar un nuevo sector
  mostrarFormSector = false;
  mostrarTabla = true;

  //formulario reactive
  nuevoSectorForm: FormGroup;
  //actvar Plaza, desactivar Plaza
  active = false;
  textActive = "Desactivado";
  //mensaje del boton actulizar guardar
  mensajeBoton: string;
  //variable sector en caso que sea editar
  sectoredit: SectorInterface;

  //mensaje para mostrar en el formulario de agregar
  msg: string = '';
  //progreso de envio
  creandosector: boolean = false;
  //variable que valida si esta por actualizar o guardar un nuevo
  isUpdate = false;

  //variables de seleccion para los select de plazas y zonas
  //selectplazas: any[] = [];
  //selectzonas: any[] = [];
  //MEnsaje para mostrar si es nuevo o actualziar;
  msjAgregarEditar = 'Agregar un nuevo sector' ;

  navigationSubscription;


  constructor(private nuevoForm: FormBuilder, private _tiposectorService: TipoSectorServices, private _zonaService: ZonasServices, private _sectorService: SectoresServices, public dialog: MatDialog, private _exceptionService: ExcepcionService, private injector: Injector,private router: Router) { 
    this.recargarComponente();


  }

  recargarComponente() {
    this.navigationSubscription = this.router.events.subscribe(
      (e: any) => {
        if (e instanceof NavigationEnd) {
          console.log('recargando componente');
          if (this.mostrarFormSector) {
            this.mostrarFormSector = !this.mostrarFormSector;
            this.mostrarTabla = !this.mostrarTabla;
            this.consultarPlazasMercado();
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


  }


  ngAfterViewInit() {


    this.consultarPlazasMercado();
    this.consultarSectores();
  }

  /*
    Metodo que consulta las zonas y los asigna al dataSource para el ordenamiento, paginacion y demas
    */
  consultarSectores() {
    try {
      this.sector = [];
      this.respuesta = null;
      this.toggleActDesc = false;
      this.filtroNombreSector='';
      this.plazaselect='';
      this.zonaselect='';
      this._sectorService.consultarTodosSectores().subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor, al consultar sectores';
            console.log('Error en el servidor, al consultar sectores');
            this.mostrarMensaje(0);
          } else {

            console.log(this.respuesta.sector);

            //seteamos el valor de los sectore en el objeto sector
            this.sector = this.respuesta.sector;
            this.dataSource = new MatTableDataSource<any>(this.sector);

            this.botonBloqueo = false;
            this.aplicarFiltro();
            this.setFilterDataTable();
          }
        },
        error => {
          this.mensaje = 'Error en el servidor, al consultar sectores';
          this.respuesta = 'error';
          this.mostrarMensaje(0);
          console.log('Error en el servidor: ' + error);
        }

      );
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "consultarSectores()"
      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);

    }
  }



  consultarPlazasMercado() {
    try {
      this.respuesta = null;

      this._zonaService.consultarPlazasAsignadas(false).subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor, al consultar plazas asignadas';
            console.log('Error en el servidor, al consultar plazas asignadas');
            this.mostrarMensaje(0);
          } else {
            this.plazasmercado = plainToClass(PlazaMercado, this.respuesta.plaza);
          }

        },
        error => {
          this.mensaje = 'Error en el servidor, al consultar plazas asignadas';
          this.respuesta = 'error';
          this.mostrarMensaje(0);
          console.log('Error en el servidor');
        }

      );
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "consultarPlazasMercado()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);

    }
  }


  aplicarFiltro() {
    console.log(this.zonaselect);

    this.dataSource.filter = this.filtroNombreSector + (!this.toggleActDesc) + this.zonaselect;
  }


  //Cambia el mensaje del toggle para mostrar activos o desactivados
  cambiarMensajeToggle() {
    this.msjToggle = this.toggleActDesc ? 'Mostrar sectores activos' : 'Mostrar sectores desactivados';
  }


  //metodo que recibe desde plaza seleccionada el id de la plaza y la envia en una consulta para buscar por nombre de la zona
  buscarZonaPorPlaza() {
    try {
      if (this.plazaselect != '') {

        let pkidplaza = this.plazaselect; //capturar el id de la plaza para enviarla a la consulta de zonas
        this.respuesta = null;

        this._zonaService.consultarZonasPorPlaza(pkidplaza, null).subscribe(
          response => {
            this.respuesta = response;
            if (this.respuesta.length <= 1) {
              this.mensaje = 'Error en el servidor, al consultar zonas por plaza';
              console.log('Error en el servidor, al consultar zonas por plaza');
              this.mostrarMensaje(0);
            } else {
              this.zonas = this.respuesta.zonas;
            }

          },
          error => {
            this.mensaje = 'Error en el servidor, al consultar zonas por plaza';
            this.respuesta = 'error';
            this.mostrarMensaje(0);
            console.log('Error en el servidor');
          }

        );
      } else {//en caso que sean todos, reseteamos las variables
        this.zonaselect = '';
        this.zonas = [];
        this.aplicarFiltro();
      }

    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "buscarZonaPorPlaza()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);

    }

  }

  /**
  * 
  * Metodo que cambia el estado de la sector de la base de datos
  */
  cambiarEstadoSector(sector) {

    try {
      let active = sector.sectoractivo;
      console.log("Active: " + active);

      this._sectorService.cambiarEstadoSector(sector.pkidsector, !active, "tsector").subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor, al cambiar estado sector';
            console.log('Error en el servidor, al cambiar estado sector');
            this.mostrarMensaje(0);
          } else {
            this.mensaje = "El cambio de estado del Sector " + sector.nombresector + " : " + this.respuesta.msg;
            //cambiamos eal rol de estado
            this.toggleActDesc = false;
            this.consultarSectores();

            this.mostrarMensaje(1);
          }
        },
        error => {
          this.mensaje = 'Error en el servidor, al cambiar estado sector';
          console.log('Error en el servidor, al cambiar estado sector');
          this.mostrarMensaje(0);
        }
      );

    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "cambiarEstadoSector()"
      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);

    }

  }


  setFilterDataTable() {
    try {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: SectorInterface, filter: string) => {

        return ((data.nombresector.toLowerCase().indexOf(this.filtroNombreSector) !== -1) && (data.sectoractivo == true || this.toggleActDesc == true) && (data.fkidzona.toString().indexOf(this.zonaselect) !== -1));
      };
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "setFilterDataTable()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);

    }

  }

  //limpiar los campos de filtro 
  clearInput() {
    this.filtroNombreSector = '';
    this.aplicarFiltro();
  }

  //cerrar el dialogo de la vista tabla
  closeDialog() {
    this.mensaje = '';
  }



  /**
* Metodos para agregar un nuevo sector o editar 
 */

  //llamamos al fomrulario para agregar nuevo sector y inicializamos las validaciones del formulario
  llamarFormularioAgregarSector(element: SectorInterface) {
    try {
      console.log(element);
      this.mensaje = '';
      this.mostrarFormSector = !this.mostrarFormSector;
      this.mostrarTabla = !this.mostrarTabla;
      //si llega por actualizar seteamos el objeto zona 2 con los campos de las variables
      this.sectoredit = element != null ? element : null;
      this.isUpdate = element != null ? true : false;
      this.zonasform = [];
      //validamos el formulario solo en caso que este este visible
      if (this.mostrarFormSector) {
        //this.consultarUsuariosRecaudo();
        //this.consultarPlazasMercadoNoAsignadas();
        this.consultarTiposDeSector();
        if (this.sectoredit != null) {
          this.buscarZonaPorPlazaForm(this.sectoredit.fkidplaza);
        }


        this.nuevoSectorForm = this.nuevoForm.group({
          codigosector: [this.sectoredit != null ? this.sectoredit.codigosector : ''],
          nombresector: [this.sectoredit != null ? this.sectoredit.nombresector : '', Validators.required],
          pkidplaza: [this.sectoredit != null ? this.sectoredit.fkidplaza : ''],
          pkidzona: [this.sectoredit != null ? this.sectoredit.fkidzona : '', Validators.required],
          pkidtiposector: [this.sectoredit != null ? this.sectoredit.fkidtiposector : '', Validators.required]
        });

      }
      this.active = this.sectoredit != null ? this.sectoredit.sectoractivo : true;
      this.textActive = this.active ? "Activado" : "Desactivado";
      //si el zona es nullo, significa que entra por un nuevo objeto
      this.mensajeBoton = this.sectoredit == null ? "Guardar" : "Actualizar";
      this.msjAgregarEditar = this.sectoredit == null ? "Agregar un nuevo sector" : "Actualizar el sector";

    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "LlamarFormularioAgregarZona()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);

    }
  }


  editarAgregarSector() {
    try {
      this.creandosector = true;
      if (this.sectoredit == null) {
        this.sectoredit = {
          pkidsector: null, codigosector: '', nombresector: '', nombrezona: '', nombretiposector: '', sectoractivo: false, fkidzona: null, fkidtiposector: null, fkidplaza: null, nombreplaza: ''
        };

      }

      this.sectoredit.codigosector = (this.nuevoSectorForm.get('codigosector').value);
      this.sectoredit.nombresector = (this.nuevoSectorForm.get('nombresector').value);
      this.sectoredit.fkidzona = (this.nuevoSectorForm.get('pkidzona').value);
      this.sectoredit.fkidtiposector = (this.nuevoSectorForm.get('pkidtiposector').value);
      this.sectoredit.sectoractivo = (this.active);

      this.closeDialog2();
      if (!this.isUpdate) {//entra por agregar un nuevo zona de 
        this._sectorService.crearSector(this.sectoredit).subscribe(
          response => {
            this.respuesta = response;
            if (this.respuesta.length <= 1) {
              this.msg = 'Error en el servidor, al crear sector';
              console.log('Error en el servidor, al crear sector');
            } else {
              //this.msg = this.respuesta.msg;
              this.creandosector = false;
              if (this.respuesta.status == "Exito") {//si es exitoso, envia la respuesta al mensaje principal, oculta/muestra el formulario/tabla y recarga los zonas de 
                this.mensaje = this.respuesta.msg;
                this.mostrarMensaje(1);
                this.mostrarFormSector = !this.mostrarFormSector;
                this.mostrarTabla = !this.mostrarTabla;
                this.active = false;
                this.toggleActDesc = false;
                this.consultarSectores();
                this.consultarPlazasMercado();
              } else {
                this.msg = this.respuesta.msg;
              }

            }
          },
          error => {
            this.msg = 'Error en el servidor, al crear sector';
            console.log('Error en el servidor, al crear sector' + error);
          }
        );

      } else {//actualizamos el zona de 
        this._sectorService.actualizarSector(this.sectoredit).subscribe(
          response => {
            this.respuesta = response;
            if (this.respuesta.length <= 1) {
              this.msg = 'Error en el servidor, al actualizar sector';
              console.log('Error en el servidor, al actualizar sector');
            } else {
              //this.msg = this.respuesta.msg;
              this.creandosector = false;
              if (this.respuesta.status == "Exito") {//si es exitoso, envia la respuesta al mensaje principal, oculta/muestra el formulario/tabla y recarga los zonas de 
                this.mensaje = this.respuesta.msg;
                this.mostrarMensaje(1);
                this.mostrarFormSector = !this.mostrarFormSector;
                this.mostrarTabla = !this.mostrarTabla;
                this.active = false;
                this.toggleActDesc = false;
                this.consultarSectores();
                this.consultarPlazasMercado();
              } else {
                this.msg = this.respuesta.msg;
              }

            }
          },
          error => {
            this.msg = 'Error en el servidor, al actualizar sector';
            console.log('Error en el servidor, al actualizar sector' + error);
          }
        );



      }
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "editarAgregarSector()"
      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);

    }
  }



  //variable para setear el selector de zonas en el formulario con respecto al pkid de la plaza
  zonasform: Zona[];
  //metodo que busca las zonas y las setea en el select zonas de plazas
  buscarZonaPorPlazaForm(event) {
    try {
      //this.nuevoSectorForm.get('pkidzona').setValue('');//cada vez q cambie el selector de plazas, se reinicia el select de zonas
      let pkidplaza = event.value != null ? event.value : event;//capturar el value (pkidplaza) cuando cambie el select me lleve el zonasForm para el select de zonas
      this.respuesta = null;

      this._zonaService.consultarZonasPorPlaza(pkidplaza, null).subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor, al consultar zonas por plaza';
            console.log('Error en el servidor, al consultar zonas por plaza');
            this.mostrarMensaje(0);
          } else {
            this.zonasform = this.respuesta.zonas;
          }

        },
        error => {
          this.mensaje = 'Error en el servidor, al consultar zonas por plaza';
          this.respuesta = 'error';
          this.mostrarMensaje(0);
          console.log('Error en el servidor, al consultar zonas por plaza');
        }

      );


    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "buscarZonaPorPlazaForm()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);

    }

  }






  tiposectores: TipoSector[];
  /*
     Metodo que consulta los tipos de sector para el select
     */
  consultarTiposDeSector() {
    try {
      this.respuesta = null;
      this._tiposectorService.consultarTodosTiposSector().subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor, al consultar tipos de sector';
            console.log('Error en el servidor, al consultar tipos de sector');
          } else {
            //seteamos el valor de los roles en el objeto tipo sector
            this.tiposectores = plainToClass(TipoSector, this.respuesta.tiposector);
          }
        },
        error => {
          this.mensaje = 'Error en el servidor, al consultar tipos de sector';
          this.respuesta = 'error';
          console.log('Error en el servidor: ' + error);
        }

      );
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "consultarTiposDeSector()"
      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
      //console.log("error asdasd a:" + e.stack);

    }
  }


  //activar o desctivar el boton y mostrar visualmente
  activarDesactivarsector() {
    this.active = !this.active;
    this.textActive = this.active ? "Activado" : "Desactivado";
  }



  //dialogo de confirmacion para eliminar o no el usuario
  openDialog(sector: SectorInterface): void {
    try {
      this.mensaje = '';
      let nombre = sector.nombresector;
      let id = sector.pkidsector;

      const dialogRef = this.dialog.open(DialogConfirmacionTipos, {
        width: '250px',
        data: { nombre: nombre, id: id, tipoIdentifi: 3 }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.mensaje = result.respuesta + " Nombre Sector : " + nombre;
        if (result != null) {
          console.log(result.status);
          if (result.status == "error") {
            this.mostrarMensaje(0);
          } else if (result.status == "Exito") {
            this.mostrarMensaje(1)
            this.toggleActDesc = false;
            this.consultarSectores();
          }
        }
      });
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "openDialog()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);

    }
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

  closeDialog2() {
    this.msg = '';
  }



  /*
   MEtoido que captura las excepciones y las envia al servicio de capturar la excepcion
 */
  enviarExcepcion(mensaje, e, funcion, url) {
    this._exceptionService.capturarExcepcion({ mensaje, url: url, stack: e.stack, funcion: funcion }).subscribe(
      response => {

        if (response.length <= 1) {
          console.log('Error en el servidor al enviar excepcion');
        } else {
          if (response.status = !"error") {
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

export interface SectorInterface {
  pkidsector: number;
  codigosector: string;
  nombresector: string;
  sectoractivo: boolean;
  fkidzona: number;
  nombrezona: string;
  fkidtiposector: number;
  nombretiposector: string;
  fkidplaza: number;
  nombreplaza: string;
}
