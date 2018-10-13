import { Component, OnInit, ViewChild, Injector, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ExcepcionService } from '../../servicios/excepcionServices.services';
import { EquipoService } from '../../servicios/equipoService.service';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { DialogConfirmacionTipos } from '../../parametrizacion/dialogTipo.confirm.component';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.component.html',
  styleUrls: ['./equipos.component.scss'],
  providers: [EquipoService, ExcepcionService]
})
export class EquiposComponent implements OnInit,OnDestroy {


  //Cabeceras de las columnas
  //cabecerasColumnas: string[] = [];
  cabecerasColumnas: string[] = ['identificacionequipo', 'nombrequipo', 'descripcionequipo', 'nombreusuario', 'equipoactivo', 'actions'];

  //variable de entrada de texto del imput buscar(cedula o nombre)
  filtroNombreEquipo: string = '';
  //varible de mostrar desctivados
  toggleActDesc: boolean = false;

  //objeto equipo de mercado
  equipo: EquiposInterface[] = [];

  //Variables de paginacion y ordenamiento
  dataSource: MatTableDataSource<EquiposInterface>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //msg de error
  msg: string = '';

  //respuesta del servidor
  public respuesta;

  //clase dinamica pra carga de mensajes
  claseDinamic = "alert alert-warning alert-with-icon";
  iconAlert = "warning";

  //boton desactivado en caso q no hayan equipos o este caragndo
  botonBloqueo: boolean = true;

  //para recibir el mensaje del equipo agregado
  @Input() mensaje: string;


  equipoEdit: EquiposInterface = null;

  //variables booleanas para ocultar tabla y formulario
  tablaequipo = true;
  formequipo = false;

  //Mensaje para el toggle de mostrar activos/inactivos
  msjToggle = 'Mostrar equipos desactivados';

  navigationSubscription;


  constructor(public dialog: MatDialog, private injector: Injector, private _exceptionService: ExcepcionService, private _equipoService: EquipoService,private router: Router) {
    this.recargarComponente();
  }

  recargarComponente() {
    this.navigationSubscription = this.router.events.subscribe(
      (e: any) => {
        if (e instanceof NavigationEnd) {
          console.log('recargando componente');
          if(this.formequipo){
            this.tablaequipo= !this.tablaequipo;
            this.formequipo = !this.formequipo;
            this.consultarEquipos();
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
    this.consultarEquipos();
  }

  //Metodo que consulta todos los equipos de computo
  consultarEquipos() {
    try {
      this.respuesta = null;
      this.equipo = [];
      this.toggleActDesc = false;
      this.filtroNombreEquipo = '';
      this._equipoService.consultarTodosEquipo().subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor';
            console.log('Error en el servidor');
            this.mostrarMensaje(0);
          } else {
            this.respuesta.equipos.map((x) => {
              let equi: EquiposInterface = {
                codigoequipo: '', descripcionequipo: '', equipoactivo: false, identificacion: null, identificacionequipo: '', nombrequipo: '', nombreusuario: '', pkidequipo: null, fkidusuario: null
              }
              equi.pkidequipo = x.pkidequipo;
              equi.identificacionequipo = x.identificacionequipo;
              equi.nombrequipo = x.nombrequipo;
              equi.codigoequipo = x.codigoequipo;
              equi.descripcionequipo = x.descripcionequipo;
              equi.equipoactivo = x.equipoactivo;
              equi.fkidusuario = x['usuario'].pkidusuario;
              equi.identificacion = x['usuario'].identificacion;
              equi.nombreusuario = x['usuario'].nombreusuario;
              this.equipo.push(equi);

            });
            //asignacion de los datos en el datasource para la tabla
            this.dataSource = new MatTableDataSource<EquiposInterface>(this.equipo);
            //Aplicamos el filtro de paginado, ordenamiento y filtros
            this.botonBloqueo = false;
            this.aplicarFiltro();
            this.setFilterDataTable();
          }
        },
        error => {
          this.mensaje = 'Error en el servidor al consultar los equipos, intentelo nuevamente';
          this.respuesta = 'error';
          this.mostrarMensaje(0);
          console.log('Error en el servidor');
        }
      );
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "consultarEquipos()"
      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);


    }
  }

  //Método para aplicar el filtro en la tabla
  aplicarFiltro() {
    
    this.dataSource.filter = this.filtroNombreEquipo + (!this.toggleActDesc);
  }

  //Cambia el mensaje del toggle para mostrar activos o desactivados
  cambiarMensajeToggle(){
    this.msjToggle = this.toggleActDesc?'Mostrar equipos activos':'Mostrar equipos desactivados';
  }


  clearInput() {
    this.filtroNombreEquipo = '';
    this.aplicarFiltro();
  }


  closeDialog() {
    this.mensaje = '';
  }

  setFilterDataTable() {
    try {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: EquiposInterface, filter: string) => {
        //console.log(this.filtroNombreCedula);
        //console.log("holaaa");
        return ((data.nombrequipo.toLowerCase().indexOf(this.filtroNombreEquipo) !== -1) && (data.equipoactivo ==  !this.toggleActDesc));
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

  /**
   * 
   * @param equipo identidad para cambiar el estado por el pkid
   */
  cambiarEstado(equipo: EquiposInterface) {
    try {
      let active = equipo.equipoactivo;
      this.mensaje = '';

      this._equipoService.cambiarEstadoEquipo(equipo.pkidequipo, !active, "tequipo").subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor';
            console.log('Error en el servidor');
            this.mostrarMensaje(0);
          } else {
            this.mensaje = "El cambio de estado del equipo " + equipo.nombrequipo + " : " + this.respuesta.msg;
            //cambiamos el equipo de estado
            this.toggleActDesc = false;
            this.consultarEquipos();
            this.mostrarMensaje(1);
          }
        },
        error => {
          this.mensaje = 'Error en el servidor al cambiar el estado, intentelo nuevamente';
          console.log('Error en el servidor');
          this.mostrarMensaje(0);
        }
      );

    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "CambiarEstado()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
      //console.log("error asdasd a:" + e.stack);

    }

  }

  openDialog(equipo: EquiposInterface) {
    try {
      this.mensaje = '';
      let nombreequipo = equipo.nombrequipo;
      let idequipo = equipo.pkidequipo;

      const dialogRef = this.dialog.open(DialogConfirmacionTipos, {
        width: '250px',
        data: { nombre: nombreequipo, id: idequipo, tipoIdentifi: 8 }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result != null) {
          this.mensaje = result.respuesta + " Nombre Equipo : " + nombreequipo;
          console.log(result.status);
          if (result.status == "error") {
            this.mostrarMensaje(0);
          } else if (result.status == "Exito") {
            this.mostrarMensaje(1)
            this.toggleActDesc = false;
            this.consultarEquipos();

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


  //alternar entre el formulario de agregar equipo y la tabla de equipos
  ocultarTablaEquipo(event) {
    this.mensaje = '';
    if (event != null) {
      if (event.cancel == '1') {
        this.equipoEdit = null;
        console.log("cancel");
        //el mensaje pasa a null en caso que solo sea cancelar
        if (event.mensaje != null) {
          if (event.status == "Exito") {
            this.mostrarMensaje(1)
          } else {
            this.mostrarMensaje(0)
          }
          this.mensaje = event.mensaje;
        } else {
          this.mensaje = null;
        }
        //reiniciamos variables
        this.consultarEquipos();

      }
    }
    this.formequipo = !this.formequipo;
    this.tablaequipo = !this.tablaequipo;
  }


  /*
MEtodo que asigna de manera dinamica el estilo de agregado y alerta
*/
  mostrarMensaje(codeError: number) {
    if (codeError == 1) {
      this.claseDinamic = "alert alert-success alert-with-icon";
      this.iconAlert = "done";
    } else if (codeError == 0) {
      this.claseDinamic = "alert alert-warning alert-with-icon";
      this.iconAlert = "warning";
    }
  }


  //Mwtodo que recibe el equipo y la envia al componente para editar
  enviarEquipo(element) {
    //console.log(element);
    this.equipoEdit = element;
    this.ocultarTablaEquipo(null);
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

export interface EquiposInterface {
  pkidequipo: number;
  identificacionequipo: string;
  nombrequipo: string;
  codigoequipo: string;
  descripcionequipo: string;
  fkidusuario: number;
  identificacion: number;
  nombreusuario: string;
  equipoactivo: boolean;
}
