import { Component, OnInit, ViewChild, Injector, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { plainToClass } from "class-transformer";
import { ExcepcionService } from '../../servicios/excepcionServices.services';
import { ZonasServices } from '../../servicios/zonaServices.services';
import { Zona } from '../../modelos/zona';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { PlazaMercado } from '../../modelos/plaza-mercado';
import { Usuario } from '../../modelos/usuario';
import { PlazaServices } from '../../servicios/plazaServices.services';
import { DialogConfirmacionTipos } from '../../parametrizacion/dialogTipo.confirm.component';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-zonas',
  templateUrl: './zonas.component.html',
  styleUrls: ['./zonas.component.scss'],
  providers: [ExcepcionService, ZonasServices]

})
export class ZonasComponent implements OnInit,OnDestroy {

  cabecerasColumnas = ['nombrezona', 'nombreplaza', 'nombreusuario', 'zonaactivo', 'actions'];
  //variable de entrada de texto del imput buscar(nombre zona )
  filtroNombreZona: string = '';
  //varible de mostrar desctivados
  toggleActDesc: boolean = false;

  //variable zonas para llenar de la consulta
  zona: Zona[] = [];

  //Variables de paginacion y ordenamiento
  dataSource: MatTableDataSource<ZonaInterface>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  //respuesta del servidor
  public respuesta;

  //clase dinamica pra carga de mensajes
  claseDinamic = "alert alert-warning alert-with-icon";
  iconAlert = "warning";

  //mensaje de respuesta
  public mensaje: string;

  //variable zona interface
  zonainter: ZonaInterface[] = [];

  //variable para retornar las plazas de mercado
  plazasmercado: PlazaMercado[] = [];

  //boton desactivado en caso q no hayan roles o este caragndo
  botonBloqueo: boolean = true;

  //variable asignada al selector de busqeuda por plaza
  plazaselect: string = '';

  
  //Mensaje para el toggle de mostrar activos/inactivos
  msjToggle = 'Mostrar zonas desactivados';


  /*-------------------------------------------------------------------------- */
  //Variables para el formulario de agregar un nuevo zona
  mostrarFormZona = false;
  mostrarTabla = true;

  //formulario reactive
  nuevoZonaForm: FormGroup;
  //actvar zonas, desactivar zonas
  active = false;
  textActive = "Desactivado";
  //mensaje del boton actulizar guardar
  mensajeBoton: string;
  zona2: ZonaInterface;

  //mensaje para mostrar en el formulario de agregar
  msg: string = '';
  //progreso de envio
  creandozona: boolean = false;
  //variable que valida si esta por actualizar o guardar un nuevo
  isUpdate = false;

  //variables select de plazas no asignadas y usuarioos de tipo recaudador
  selectusuarios: any[] = [];
  selectplazas: any[] = [];

  //MEnsaje para mostrar si es nuevo o actualziar;
  msjAgregarEditar = 'Agregar una nueva zona' ;
  navigationSubscription;


  constructor(private nuevoForm: FormBuilder, private _zonaService: ZonasServices, public dialog: MatDialog, private injector: Injector, private _exceptionService: ExcepcionService,private router: Router) { 
this.recargarComponente();

  }

  recargarComponente() {
    this.navigationSubscription = this.router.events.subscribe(
      (e: any) => {
        if (e instanceof NavigationEnd) {
          console.log('recargando componente');
          if (this.mostrarFormZona) {
            this.mostrarFormZona = !this.mostrarFormZona;
            this.mostrarTabla = !this.mostrarTabla;
            this.consultarZonaDeSectores();
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
    this.consultarZonaDeSectores();
  }


  //Método para aplicar el filtro en la tabla
  aplicarFiltro() {
    //console.log(this.plazaselect);
    this.dataSource.filter = this.filtroNombreZona + (!this.toggleActDesc) + this.plazaselect;
  }

  
  //Cambia el mensaje del toggle para mostrar activos o desactivados
  cambiarMensajeToggle() {
    this.msjToggle = this.toggleActDesc ? 'Mostrar zonas activas' : 'Mostrar zonas desactivadas';
  }

  closeDialog() {
    this.mensaje = '';
  }


  /*
    Metodo que consulta las zonas y los asigna al dataSource para el ordenamiento, paginacion y demas
    */
  consultarZonaDeSectores() {
    try {
      this.zonainter = [];
      this.respuesta = null;
      this.toggleActDesc = false;
      this.plazaselect = '';
      this.filtroNombreZona = '';
      this._zonaService.consultarTodosZonas().subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor, al consultar zonas de sectores';
            console.log('Error en el servidor, al consultar zonas de sectores');
            this.mostrarMensaje(0);
          } else {

            console.log(this.respuesta.zonas);

            //seteamos el valor de los zonas en el objeto zona
            this.zona = plainToClass(Zona, this.respuesta.zonas);
            this.zona.map((z) => {
              z.plaza = plainToClass(PlazaMercado, z.getPlaza());
              z.usuario = plainToClass(Usuario, z.getUsuario());
            }

            );
            //asignacion de zonas en el dataSource

            //setear en una interfaz para el correcto ordenamiento en la tabla
            //puesto que daba problemas al acceder desde el objeto Zona a las propiedades de los sub objetos
            //contenidos en el y no ordenaba
            this.zona.map((z) => {
              let zi: ZonaInterface = {
                pkidzona: null, codigozona: '', nombrezona: '', nombreplaza: '', nombreusuario: '', zonaactivo: false, fkidplaza: null, fkidusuario: null
              };
              zi.pkidzona = z.getPkidzona();
              zi.codigozona = z.getCodigozona();
              zi.nombrezona = z.getNombrezona();
              zi.nombreplaza = z.getPlaza().getNombreplaza();
              zi.nombreusuario = z.getUsuario().nombreusuario;
              zi.zonaactivo = z.getZonaactivo();
              zi.fkidusuario = z.getUsuario().getPkidusuario();
              zi.fkidplaza = z.getPlaza().getPkidplaza();
              this.zonainter.push(zi)
            }
            );

            this.dataSource = new MatTableDataSource<any>(this.zonainter);

            this.botonBloqueo = false;
            this.aplicarFiltro();
            this.setFilterDataTable();
          }
        },
        error => {
          this.mensaje = 'Error en el servidor, al consultar zonas de sectores';
          this.respuesta = 'error al consultar zonas de sectores';
          this.mostrarMensaje(0);
          console.log('Error en el servidor: ' + error);
        }

      );
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "consultarZonaDeSectores()"
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
      this.dataSource.filterPredicate = (data: ZonaInterface, filter: string) => {

        return ((data.nombrezona.toLowerCase().indexOf(this.filtroNombreZona) !== -1) && (data.zonaactivo == !this.toggleActDesc) && (data.nombreplaza.indexOf(this.plazaselect) !== -1));
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


  consultarPlazasMercado() {
    try {
      this.respuesta = null;

      this._zonaService.consultarPlazasAsignadas(true).subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor, al consultar plazas de mercado';
            console.log('Error en el servidor, al consultar plazas de mercado');
            this.mostrarMensaje(0);
          } else {
            //conversion del json de plazas a la clase plazas 
            //guardamos el objeto en la variable
            this.plazasmercado = plainToClass(PlazaMercado, this.respuesta.plaza);
          }

        },
        error => {
          this.mensaje = 'Error en el servidor, al consultar plazas de mercado';
          this.respuesta = 'error';
          this.mostrarMensaje(0);
          console.log('Error en el servidor, al consultar plazas de mercado');
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


  clearInput() {
    this.filtroNombreZona = '';
    this.aplicarFiltro();
  }


  /**
   * 
   * Metodo que cambia el estado de la zona de la base de datos
   */
  cambiarEstadoZona(zonas) {
    //console.log(zonas);

    let zona: Zona = new Zona();
    zona.setPkidzona(zonas.pkidzona);
    zona.setNombrezona(zonas.nombrezona);
    try {
      let active = zonas.zonaactivo;
      console.log("Active: " + active);

      this._zonaService.cambiarEstadoZona(zona.getPkidzona(), !active, "tzona").subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor, al cambiar el estado de la zona';
            console.log('Error en el servidor, al cambiar el estado de la zona');
            this.mostrarMensaje(0);
          } else {
            this.mensaje = "El cambio de estado Zona  " + zona.getNombrezona() + " : " + this.respuesta.msg;
            //cambiamos eal rol de estado
            this.toggleActDesc = false;
            this.consultarZonaDeSectores();

            this.mostrarMensaje(1);
          }
        },
        error => {
          this.mensaje = 'Error en el servidor, al cambiar el estado de la zona';
          console.log('Error en el servidor, al cambiar el estado de la zona');
          this.mostrarMensaje(0);
        }
      );

    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "cambiarEstadoZona()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);

    }

  }

  //dialogo de confirmacion para eliminar o no el usuario
  openDialog(zonas): void {
    try {
      this.mensaje='';
      let nombrezona = zonas.nombrezona;
      let idzona = zonas.pkidzona;

      const dialogRef = this.dialog.open(DialogConfirmacionTipos, {
        width: '250px',
        data: { nombre: nombrezona, id: idzona, tipoIdentifi: 2 }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.mensaje = result.respuesta + " Nombre Zona : " + nombrezona;
        if (result != null) {
          console.log(result.status);
          if (result.status == "error") {
            this.mostrarMensaje(0);
          } else if (result.status == "Exito") {
            this.mostrarMensaje(1)
            this.toggleActDesc = false;
            this.consultarZonaDeSectores();
            this.consultarPlazasMercado();

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

  /**
  * Metodos para agregar un nuevo zona o editar un zona 
   */

  //llamamos al fomrulario para agregar un nuevo zona y inicializamos las validaciones del formulario
  llamarFormularioAgregarZona(element: ZonaInterface) {
    try {
      console.log(element);
      this.mensaje='';
      this.mostrarFormZona = !this.mostrarFormZona;
      this.mostrarTabla = !this.mostrarTabla;
      //si llega por actualizar seteamos el objeto zona 2 con los campos de las variables
      this.zona2 = element != null ? element : null;
      this.isUpdate = element != null ? true : false;

      //Consultar los usuaros de tipo recaudo y consultar las plazas de mercadp q no tengan ninguna asignacion en zonas


      //validamos el formulario solo en caso que este este visible
      if (this.mostrarFormZona) {
        this.consultarUsuariosRecaudo();
        this.consultarPlazasMercadoNoAsignadas();


        this.nuevoZonaForm = this.nuevoForm.group({
          codigozona: [this.zona2 != null ? this.zona2.codigozona : ''],
          nombrezona: [this.zona2 != null ? this.zona2.nombrezona : '', Validators.required],
          pkidplaza: [this.zona2 != null ? this.zona2.fkidplaza : '', Validators.required],
          pkidusuario: [this.zona2 != null ? this.zona2.fkidusuario : '', Validators.required],
        });
      }
      this.active = this.zona2 != null ? this.zona2.zonaactivo : false;
      this.textActive = this.active ? "Activado" : "Desactivado";
      //si el zona es nullo, significa que entra por un nuevo objeto
      this.mensajeBoton = this.zona2 == null ? "Guardar" : "Actualizar";
      this.msjAgregarEditar = this.zona2 == null ? "Agregar una nueva zona" : "Actualizar la zona";


    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "LlamarFormularioAgregarZona()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);

    }
  }

  //activar o desctivar el boton y mostrar visualmente
  activarDesactivarzona() {
    this.active = !this.active;
    this.textActive = this.active ? "Activado" : "Desactivado";
  }


  //metodo q conslta todos los usuarios de tipo recaudo para setearlosen el select de usuarios
  consultarUsuariosRecaudo() {
    try {
      this.respuesta = null;
      this._zonaService.consultarUsuariosRecaudadores().subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor, al consultar usuarios';
            console.log('Error en el servidor, al consultar usuarios');
            this.mostrarMensaje(0);
          } else {
            this.selectusuarios = this.respuesta.users;
            console.log(response.users);

          }

        },
        error => {
          this.mensaje = 'Error en el servidor: al consultar usuarios';
          this.respuesta = 'error';
          this.mostrarMensaje(0);
          console.log('Error en el servidor' + error);

        }
      );


    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "ConsultarUsuariosRecaudo()"
      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);

    }
  }

  /**
   * Metodo que consulta todas las plazas no asignadas a ninguna zona y las setea select plazas
   */
  consultarPlazasMercadoNoAsignadas() {
    try {
      this.respuesta = null;
      this._zonaService.consultarPlazasAsignadas(false).subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor, al consultar plazas de mercado no asignadas';
            console.log('Error en el servidor, al consultar plazas de mercado no asignadas');
            this.mostrarMensaje(0);
          } else {
            this.selectplazas = this.respuesta.plaza;
            console.log(response.plaza);

          }

        },
        error => {
          this.mensaje = 'Error en el servidor al consultar usuarios';
          this.respuesta = 'error';
          this.mostrarMensaje(0);
          console.log('Error en el servidor' + error);

        }
      );
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "ConsultarUsuariosRecaudo()"
      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
    }
  }


  /**
   * 
   * metodo que agrega el zona de  o edita un zona de  
   */
  editarAgregarZona() {
    try {


      //this.zona = ;
      this.creandozona = true;
      if (this.zona2 == null) {
        this.zona2 = {
          pkidzona: null, codigozona: '', nombrezona: '', nombreplaza: '', nombreusuario: '', zonaactivo: false, fkidplaza: null, fkidusuario: null
        };

      }

      this.zona2.codigozona = (this.nuevoZonaForm.get('codigozona').value);
      this.zona2.nombrezona = (this.nuevoZonaForm.get('nombrezona').value);
      this.zona2.fkidplaza = (this.nuevoZonaForm.get('pkidplaza').value);
      this.zona2.fkidusuario = (this.nuevoZonaForm.get('pkidusuario').value);
      this.zona2.zonaactivo = (this.active);

      this.closeDialog2();
      if (!this.isUpdate) {//entra por agregar un nuevo zona de 
        this._zonaService.crearZona(this.zona2).subscribe(
          response => {
            this.respuesta = response;
            if (this.respuesta.length <= 1) {
              this.msg = 'Error en el servidor, al crear zona';
              console.log('Error en el servidor, al crear zona');
            } else {
              //this.msg = this.respuesta.msg;
              this.creandozona = false;
              if (this.respuesta.status == "Exito") {//si es exitoso, envia la respuesta al mensaje principal, oculta/muestra el formulario/tabla y recarga los zonas de 
                this.mensaje = this.respuesta.msg;
                this.mostrarMensaje(1);
                this.mostrarFormZona = !this.mostrarFormZona;
                this.mostrarTabla = !this.mostrarTabla;
                this.active = false;
                this.toggleActDesc = false;
                this.consultarZonaDeSectores();
                this.consultarPlazasMercado();
              } else {
                this.msg = this.respuesta.msg;
              }

            }
          },
          error => {
            this.msg = 'Error en el servidor, al crear zona';
            console.log('Error en el servidor, al crear zona' + error);
          }
        );

      } else {//actualizamos el zona de 
        this._zonaService.actualizarZona(this.zona2).subscribe(
          response => {
            this.respuesta = response;
            if (this.respuesta.length <= 1) {
              this.msg = 'Error en el servidor, actualizar zona';
              console.log('Error en el servidor, actualizar zona');
            } else {
              //this.msg = this.respuesta.msg;
              this.creandozona = false;
              if (this.respuesta.status == "Exito") {//si es exitoso, envia la respuesta al mensaje principal, oculta/muestra el formulario/tabla y recarga los zonas de 
                this.mensaje = this.respuesta.msg;
                this.mostrarMensaje(1);
                this.mostrarFormZona = !this.mostrarFormZona;
                this.mostrarTabla = !this.mostrarTabla;
                this.active = false;
                this.toggleActDesc = false;
                this.consultarZonaDeSectores();
                this.consultarPlazasMercado();
              } else {
                this.msg = this.respuesta.msg;
              }

            }
          },
          error => {
            this.msg = 'Error en el servidor, actualizar zona';
            console.log('Error en el servidor, actualizar zona' + error);
          }
        );



      }
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "agregarEditarZona()"
      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);

    }

  }


  closeDialog2() {
    this.msg = '';
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

interface ZonaInterface {
  pkidzona: number;
  codigozona: string;
  nombrezona: string;
  nombreplaza: string;
  nombreusuario: string;
  zonaactivo: boolean;
  fkidplaza: number;
  fkidusuario: number;
}
