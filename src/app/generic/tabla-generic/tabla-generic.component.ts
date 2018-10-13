import { Component, OnInit, ViewChild, Output, EventEmitter, Inject, Input, Injector } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Usuario } from '../../modelos/usuario';
import { GenericServices } from '../../servicios/genericServices.services';
import { plainToClass } from "class-transformer";
import { Rol } from '../../modelos/rol';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogConfirmacionGenericComponent } from './dialog.confirmgeneric.component';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { ExcepcionService } from '../../servicios/excepcionServices.services';
import { Router } from '@angular/router';
import { ArrayOne } from '../../servicios/pipes/arrayone.pipe';


@Component({
  selector: 'app-tabla-generic',
  templateUrl: './tabla-generic.component.html',
  styleUrls: ['./tabla-generic.component.scss'],
  providers: [GenericServices, ExcepcionService, ArrayOne],



})
export class TablaGenericComponent implements OnInit {

  public route;

  filtroGeneric: string = '';
  cabecerasColumnas: string[] = [];
  etiquetasColumnas: any[] = [];
  title: string = "";
  newTitle: string = "";
  genericActive: string = '';
  //variable de entrada de texto del imput buscar(cedula o nombre)
  filtroNombreCedula: string = '';
  //varible de mostrar desctivados
  toggleActDesc: boolean = false;


  //datos a llenar mediante la consulta
  usuarios: Usuario[] = [];
  rol: Rol[] = [];



  //Mensaje para el toggle de mostrar activos/inactivos
  msjToggle = 'Mostrar desactivados';


  //Variables de paginacion y ordenamiento
  //  dataSource: MatTableDataSource;
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //msg de error
  msg: string = '';
  primaryKey: string = ''
  //respuesta del servidor
  public respuesta;

  //PAra alternar entre formularios
  @Output() llamarFormulario = new EventEmitter();
  //envia el usuario al componente de editar
  @Output() enviarUSuario = new EventEmitter();

  //para recibir el mensaje del usuario agregado
  @Input() mensaje: string;


  //para llamar el formulario de Roles;
  @Output() llamarFormRoles = new EventEmitter();

  //clase dinamica pra carga de mensajes
  claseDinamic = "alert alert-success alert-with-icon";
  iconAlert = "done";

  //boton desactivado en caso q no hayan usuarios o este caragndo
  botonBloqueo: boolean = false;



  constructor(private _genericService: GenericServices, public dialog: MatDialog, private injector: Injector, private _exceptionService: ExcepcionService, private router: Router) {

    //this.route= this.router.url;
    const url = this.router.url.substring(1);
    const indiceRuta = url.indexOf("/");

    this.route = url.substring(indiceRuta);
    console.log(this.route);
  }


  closeDialog() {
    this.mensaje = '';//this.respuesta.cabeceras[i].nombrecampo

  }


  //Metodo que consulta los usuarios y los envia a la tabla

  nuevaCadena;

  consultarUsuarios() {
    try {
      //throw new Error('Im errorn');
      this.respuesta = null;

      this._genericService.consultarUsuarios().subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor';
            console.log('Error en el servidor');
            this.mostrarMensaje(0);
          } else {
            //cabeceras
            //this.cabecerasColumnas = this.respuesta.cabeceras;
            //this.cabecerasColumnas.push('actions');
            //conversion del json de usuarios a la clase Usuarios
            //guardamos el objeto en la variable

            //asignacion de los datos en el datasource para la tabla
            console.log(this.respuesta);
            this.etiquetasColumnas = [];
            this.cabecerasColumnas = [];
            this.title = this.respuesta.title[1];
            this.newTitle = this.respuesta.title[0] + " " + this.respuesta.title[1];
            let j = 0;
            for (let i = 0; i < this.respuesta.cabeceras.length; i++) {
              /*
                            this.respuesta.cabeceras[i].nombrecampo
                            this.respuesta.cabeceras[i].pkidusuario
                            this.respuesta.cabeceras[i].update
                            this.respuesta.cabeceras[i].create
                            this.respuesta.cabeceras[i].show
                            this.respuesta.cabeceras[i].fk
                            this.respuesta.cabeceras[i].fktable
                            this.respuesta.cabeceras[i].number*/

              if (this.respuesta.cabeceras[i].nombrecampo.toLowerCase().includes("activ")) {
                this.genericActive = this.respuesta.cabeceras[i].nombrecampo;

              }

              if (this.respuesta.cabeceras[i].pk == true) {
                this.primaryKey = this.respuesta.cabeceras[i].nombrecampo;
              }
              if (this.respuesta.cabeceras[i].show == true) {
                this.cabecerasColumnas[j] = this.respuesta.cabeceras[i].nombrecampo;
                j = j + 1;
                this.etiquetasColumnas.push({ etiqueta: this.respuesta.cabeceras[i].nombreetiqueta, item: this.respuesta.cabeceras[i].nombrecampo });
              }
            }
            this.etiquetasColumnas.push({ etiqueta: 'Acciones', item: 'actions' });
            this.cabecerasColumnas.push('actions');


            //meustra nombres de cabeceras



            //let cadena = this.router.url.substring(6);;
            this.nuevaCadena = this.route.substring(1);

            this.router.url
            let valoresgen = Object["keys"](this.respuesta[this.nuevaCadena]);
            let llavesgen = Object["values"](this.respuesta[this.nuevaCadena]);
            //para aplicar a llaves fk
            /*let level =  0;
            for(var property in this.respuesta.users) {
                console.log('  '.repeat(level) + property);
                if(typeof this.respuesta.users["property"] === 'object') {
                    listProps(this.respuesta.users["property"], ++level);
                }
            }*/

            //  console.log(this.respuesta.users[0].nombrerol);

            /*  for (let i = 0; i < this.usuarios.length; i++) {
                console.log(this.respuesta.users[i].roles);
                this.usuarios[i].setRoles(this.respuesta.users[i].roles);
  
  
              }*/
            this.dataSource = new MatTableDataSource(llavesgen);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.aplicarFiltro();
            this.setFilterDataTable();
            //this.dataSource.filter=this.filtroGeneric;

            //console.log("rol: "+this.usuarios[0].getRoles().pkidrol);
            //Aplicamos el filtro de paginado, ordenamiento y filtros
          }

        },
        error => {
          this.mensaje = 'Error en el servidor';
          this.respuesta = 'error';
          this.mostrarMensaje(0);
          console.log('Error en el servidor');
        }
      );
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "constultarUsuario()"
      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
      //console.log("error asdasd a:" + e.stack);

    }
  }

  cambiarMensajeToggle() {
    this.msjToggle = this.toggleActDesc ? 'Mostrar activos' : 'Mostrar desactivados';
  }


  setFilterDataTable() {
    try {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        //console.log(this.filtroNombreCedula);
        //console.log("holaaa");
        try {
          return ((data['nombre' + this.nuevaCadena].toLowerCase().indexOf(this.filtroGeneric) !== -1) && (data[this.nuevaCadena + "activo"] == !this.toggleActDesc));

        } catch (e) {
          return null;
        }
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


  ngAfterViewInit() {
    this.consultarUsuarios();

  }


  ngOnInit() {
  }

  //Método para aplicar el filtro en la tabla
  aplicarFiltro() {
    this.dataSource.filter = this.filtroGeneric + (!this.toggleActDesc);
  }


  clearInput() {
    this.filtroNombreCedula = '';
  }



  //LLama al dialogo de confirmacion para eliminar o no el usuario,
  //le enviamos el parametro del nombre de usuario y el id
  llamarDialog(user: any) {
    try {
      this.openDialog(this.primaryKey, user[this.primaryKey]);
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "llamarDialog()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
      //console.log("error asdasd a:" + e.stack);

    }

  }



  //dialogo de confirmacion para eliminar o no el usuario
  openDialog(nombreUser, idUser): void {
    try {
      console.log("primary key;")
      console.log(nombreUser);
      const dialogRef = this.dialog.open(DialogConfirmacionGenericComponent, {
        width: '250px',
        data: { nombreUser: nombreUser, idUser: idUser }
      });

      dialogRef.afterClosed().subscribe(result => {//.getUsuarioActivo();
        console.log('The dialog was closed');//this.respuesta.cabeceras[i].nombrecampo
        this.mensaje = result.respuesta;
        if (result != null) {
          console.log(result.status);
          if (result.status == "error") {
            this.mostrarMensaje(0);
          } else if (result.status == "Exito") {
            console.log("reload...");
            this.mostrarMensaje(1)
            this.toggleActDesc = false;
            this.consultarUsuarios();

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


  cambiarEstado(usuario: any) {
    try {
      let active: boolean = usuario[this.genericActive];
      console.log(this.genericActive);

      console.log("Active: " + active);

      this._genericService.cambiarEstadoUsuario(usuario[this.primaryKey], !active, "t" + this.route.substring(1), this.primaryKey).subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor';
            console.log('Error en el servidor');
            this.mostrarMensaje(0);
          } else {
            this.mensaje = "Cambio de estado: " + this.respuesta.msg;
            //cambiamos el usuario de estado
            this.toggleActDesc = false;
            this.consultarUsuarios();
            this.mostrarMensaje(1);
          }
        },
        error => {
          this.mensaje = 'Error en el servidor';
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

//interfaz para comunicarse con el dialogo
export interface DialogData {
  nombreUser: string;
  idUser: number;
  respuesta: string;
}
