import { Component, OnInit, ViewChild, Injector, OnDestroy } from '@angular/core';
import { TipoSectorServices } from '../../servicios/tipos-services/tiposectorServices.services';
import { ExcepcionService } from '../../servicios/excepcionServices.services';
import { TipoSector } from '../../modelos/tipos/tiposector';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { plainToClass } from "class-transformer";
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { DialogConfirmacionTipos } from '../dialogTipo.confirm.component';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-tipo-sector',
  templateUrl: './tipo-sector.component.html',
  styleUrls: ['./tipo-sector.component.scss'],
  providers: [TipoSectorServices, ExcepcionService]
})
export class TipoSectorComponent implements OnInit, OnDestroy {

  cabecerasColumnas: string[] = ['nombretiposector', 'descripciontiposector', 'tiposectoractivo', 'actions'];

  //variable de entrada de texto del imput buscar(nombre tipo sector)
  filtroNombreTipoSector: string = '';
  //varible de mostrar desctivados
  toggleActDesc: boolean = false;



  //variable roles para llenar de la consulta
  tiposector: TipoSector[] = [];

  //Variables de paginacion y ordenamiento
  dataSource: MatTableDataSource<TipoSector>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  //respuesta del servidor
  public respuesta;

  //clase dinamica pra carga de mensajes
  claseDinamic = "alert alert-success alert-with-icon";
  iconAlert = "done";

  //mensaje de respuesta
  public mensaje: string;


  //boton desactivado en caso q no hayan roles o este caragndo
  botonBloqueo: boolean = true;


  /*-------------------------------------------------------------------------- */
  //Variables para el formulario de agregar un nuevo tipo
  mostrarFormTipo = false;
  mostrarTabla = true;

  //formulario reactive
  nuevoTipoForm: FormGroup;
  //actvar Plaza, desactivar Plaza
  active = false;
  textActive = "Desactivado";
  //mensaje del boton actulizar guardar
  mensajeBoton: string;
  tipo: TipoSector;

  //mensaje para mostrar en el formulario de agregar
  msg: string = '';
  //progreso de envio
  creandotipo: boolean = false;
  //variable que valida si esta por actualizar o guardar un nuevo
  isUpdate = false;

  //Mensaje de agregar o actualizar
  msjAgregarEditar = 'Nuevo ripo de sector';

  //Mensaje para el toggle de mostrar activos/inactivos
  msjToggle = 'Mostrar Tipos de Sectores desactivados';

  navigationSubscription;


  constructor(private nuevoForm: FormBuilder, private _tiposectorService: TipoSectorServices, public dialog: MatDialog, private injector: Injector, private _exceptionService: ExcepcionService, private router: Router) {
    this.recargarComponente();

  }

  recargarComponente() {
    this.navigationSubscription = this.router.events.subscribe(
      (e: any) => {
        if (e instanceof NavigationEnd) {
          console.log('recargando componente');
          if (this.mostrarFormTipo) {
            this.mostrarFormTipo = !this.mostrarFormTipo;
            this.mostrarTabla = !this.mostrarTabla;
            this.consultarTipoDeSectores();
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
    this.consultarTipoDeSectores();
  }


  //Método para aplicar el filtro en la tabla
  aplicarFiltro() {
    this.dataSource.filter = this.filtroNombreTipoSector + (!this.toggleActDesc);
  }


  closeDialog() {
    this.mensaje = '';
  }


  /*
    Metodo que consulta los roles de usuario y los asigna al dataSource para el ordenamiento, paginacion y demas
    */
  consultarTipoDeSectores() {
    try {
      this.respuesta = null;
      this._tiposectorService.consultarTodosTiposSector().subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor, al consultar tipos de sectores';
            console.log('Error en el servidor, al consultar tipos de sectores');
            this.mostrarMensaje(0);
          } else {

            //console.log(ser);
            //let foo: Rol = Object.assign(Rol, JSON.parse(this.respuesta.rol));
            //console.log(foo);

            //seteamos el valor de los roles en el objeto Rol
            this.tiposector = plainToClass(TipoSector, this.respuesta.tiposector);

            console.log(this.respuesta.tiposector);
            //console.log(this.roles[0].getRolactivo());


            //asignacion de roles en el dataSource
            this.dataSource = new MatTableDataSource<TipoSector>(this.tiposector);
            this.botonBloqueo = false;
            this.aplicarFiltro();
            this.setFilterDataTable();
          }
        },
        error => {
          this.mensaje = 'Error en el servidor, al consultar tipos de sectores';
          this.respuesta = 'error';
          this.mostrarMensaje(0);
          console.log('Error en el servidor: ' + error);
        }

      );
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "consultarTipoDeSectores()"
      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
      //console.log("error asdasd a:" + e.stack);

    }
  }


  setFilterDataTable() {
    try {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: TipoSector, filter: string) => {
        //console.log(this.filtroNombreCedula);
        //console.log("holaaa");
        return ((data.getNombretiposector().toLowerCase().indexOf(this.filtroNombreTipoSector) !== -1) && (data.getTiposectoractivo() == !this.toggleActDesc));
      };
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "setFilterDataTable()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
      //console.log("error asdasd a:" + e.stack);

    }

  }

  //Cambia el mensaje del toggle para mostrar activos o desactivados
  cambiarMensajeToggle() {
    this.msjToggle = this.toggleActDesc ? 'Mostrar Tipos de Sectores activos' : 'Mostrar Tipos de Sectores desactivados';
  }

  clearInput() {
    this.filtroNombreTipoSector = '';
    this.aplicarFiltro();
  }



  cambiarEstadoTipo(tiposector: TipoSector) {
    try {
      let active = tiposector.getTiposectoractivo();
      console.log("Active: " + active);

      this._tiposectorService.cambiarEstadoTipoSector(tiposector.getPkidtiposector(), !active, "ttiposector").subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor, al cambiar estado tipo sector';
            console.log('Error en el servidor, al cambiar estado tipo sector');
            this.mostrarMensaje(0);
          } else {
            this.mensaje = "El cambio de estado del tipo sector " + tiposector.getNombretiposector() + " : " + this.respuesta.msg;
            //cambiamos eal rol de estado
            this.toggleActDesc = false;
            this.consultarTipoDeSectores();

            this.mostrarMensaje(1);
          }
        },
        error => {
          this.mensaje = 'Error en el servidor, al cambiar estado tipo sector';
          console.log('Error en el servidor, al cambiar estado tipo sector');
          this.mostrarMensaje(0);
        }
      );

    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "CambiarEstadoRol()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
      //console.log("error asdasd a:" + e.stack);

    }

  }

  //dialogo de confirmacion para eliminar o no el usuario
  openDialog(tiposector: TipoSector): void {
    try {
      this.mensaje = '';
      let nombretiposector = tiposector.getNombretiposector();
      let idtiposector = tiposector.getPkidtiposector();

      const dialogRef = this.dialog.open(DialogConfirmacionTipos, {
        width: '250px',
        data: { nombre: nombretiposector, id: idtiposector, tipoIdentifi: 1 }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.mensaje = result.respuesta + " Nombre del tipo sector: " + nombretiposector;
        if (result != null) {
          console.log(result.status);
          if (result.status == "error") {
            this.mostrarMensaje(0);
          } else if (result.status == "Exito") {
            this.mostrarMensaje(1)
            this.toggleActDesc = false;
            this.consultarTipoDeSectores();

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
      //console.log("error asdasd a:" + e.stack);

    }
  }

  /**
  * Metodos para agregar un nuevo tipo o editar un tipo 
   */

  //llamamos al fomrulario para agregar un nuevo tipo y inicializamos las validaciones del formulario
  llamarFormularioAgregarTipo(element) {
    try {
      this.mensaje = '';
      this.mostrarFormTipo = !this.mostrarFormTipo;
      this.mostrarTabla = !this.mostrarTabla;

      this.tipo = element != null ? element : null;
      this.isUpdate = element != null ? true : false;

      //validamos el formulario solo en caso que este este visible
      if (this.mostrarFormTipo) {
        this.nuevoTipoForm = this.nuevoForm.group({
          codigotiposector: [this.tipo != null ? this.tipo.getCodigotiposector() : ''],
          nombretiposector: [this.tipo != null ? this.tipo.getNombretiposector() : '', Validators.required],
          descripciontiposector: [this.tipo != null ? this.tipo.getDescripciontiposector() : '', Validators.required]
        });
      }
      this.active = this.tipo != null ? this.tipo.getTiposectoractivo() : false;
      this.textActive = this.active ? "Activado" : "Desactivado";

      //si el tipo es nullo, significa que entra por un nuevo objeto
      this.mensajeBoton = this.tipo == null ? "Guardar" : "Actualizar";
      this.msjAgregarEditar = this.tipo == null ? "Agregar un nuevo tipo de sector" : "Actualizar el tipo de sector";

    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "LlamarFormularioAgregarTipo()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
      //console.log("error asdasd a:" + e.stack);

    }
  }

  //activar o desctivar el boton y mostrar visualmente
  activarDesactivartipo() {
    this.active = !this.active;
    this.textActive = this.active ? "Activado" : "Desactivado";
  }




  /**
   * 
   * metodo que agrega el tipo de sector o edita un tipo de sector 
   */
  editarAgregarTipo() {
    try {


      //this.tipo = ;
      this.creandotipo = true;
      if (this.tipo == null) this.tipo = new TipoSector();
      this.tipo.setCodigotiposector(this.nuevoTipoForm.get('codigotiposector').value);
      this.tipo.setNombretiposector(this.nuevoTipoForm.get('nombretiposector').value);
      this.tipo.setTiposectoractivo(this.active);
      this.tipo.setDescripciontiposector(this.nuevoTipoForm.get('descripciontiposector').value)

      if (!this.isUpdate) {//entra por agregar un nuevo tipo de sector
        this.closeDialog2();
        this._tiposectorService.crearTipoSector(this.tipo).subscribe(
          response => {
            this.respuesta = response;
            if (this.respuesta.length <= 1) {
              this.msg = 'Error en el servidor, al crear tipo sector';
              console.log('Error en el servidor, al crear tipo sector');
            } else {
              //this.msg = this.respuesta.msg;
              this.creandotipo = false;
              if (this.respuesta.status == "Exito") {//si es exitoso, envia la respuesta al mensaje principal, oculta/muestra el formulario/tabla y recarga los tipos de sector
                this.mensaje = this.respuesta.msg;
                this.mostrarMensaje(1);
                this.mostrarFormTipo = !this.mostrarFormTipo;
                this.mostrarTabla = !this.mostrarTabla;
                this.active = false;
                this.toggleActDesc = false;
                this.consultarTipoDeSectores();
              } else {
                this.msg = this.respuesta.msg;
              }

            }
          },
          error => {
            this.msg = 'Error en el servidor, al crear tipo sector';
            console.log('Error en el servidor, al crear tipo sector' + error);
          }
        );


      } else {//actualizamos el tipo de sector
        this.closeDialog2();
        this._tiposectorService.actualizarTipoSector(this.tipo).subscribe(
          response => {
            this.respuesta = response;
            if (this.respuesta.length <= 1) {
              this.msg = 'Error en el servidor, actualizar tipo sector';
              console.log('Error en el servidor, actualizar tipo sector');
            } else {
              //this.msg = this.respuesta.msg;
              this.creandotipo = false;
              if (this.respuesta.status == "Exito") {//si es exitoso, envia la respuesta al mensaje principal, oculta/muestra el formulario/tabla y recarga los tipos de sector
                this.mensaje = this.respuesta.msg;
                this.mostrarMensaje(1);
                this.mostrarFormTipo = !this.mostrarFormTipo;
                this.mostrarTabla = !this.mostrarTabla;
                this.active = false;
                this.toggleActDesc = false;
                this.consultarTipoDeSectores();
              } else {
                this.msg = this.respuesta.msg;
              }

            }
          },
          error => {
            this.msg = 'Error en el servidor, actualizar tipo sector';
            console.log('Error en el servidor, actualizar tipo sector' + error);
          }
        );



      }

    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "agregarEditarTipo()"
      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
      //console.log("error asdasd a:" + e.stack);

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
