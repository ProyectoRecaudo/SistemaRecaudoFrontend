import { Component, OnInit, ViewChild, Output, EventEmitter, Input, Injector } from '@angular/core';
import { Rol } from '../../../modelos/rol';
import { RolesServices } from '../../../servicios/rolesServices.services';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { plainToClass} from "class-transformer";
import { ExcepcionService } from '../../../servicios/excepcionServices.services';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { DialogConfirmacionRol } from './dialogRol.confirm.component';
@Component({
  selector: 'app-tabla-roles',
  templateUrl: './tabla-roles.component.html',
  styleUrls: ['./tabla-roles.component.scss'],
  providers: [RolesServices,ExcepcionService]
})
export class TablaRolesComponent implements OnInit {
  //Cabeceras de las columnas
  //cabecerasColumnas: string[] = [];

  cabecerasColumnas: string[] = ['nombrerol', 'descripcionrol', 'rolactivo', 'actions'];

  //variable de entrada de texto del imput buscar(nombre Rol)
  filtroNombreRol: string = '';
  //varible de mostrar desctivados
  toggleActDesc: boolean = false;


  //variable roles para llenar de la consulta
  roles: Rol[] = [];

  //Variables de paginacion y ordenamiento
  dataSource: MatTableDataSource<Rol>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //respuesta del servidor
  public respuesta;


  msjToggle= 'Mostrar roles desactivados';
  //para alternar entre el fomrulario de agregar nuevo rol y la tabla usuarios
  @Output() llamarFormularioAgregarRol = new EventEmitter()
  @Output() llamarFormUsuarios = new EventEmitter();

  //envia el rol al componente editar
  @Output() enviarRol = new EventEmitter();

  //para recibir el mensaje del rol agregado
  @Input() mensaje: string;

  //clase dinamica pra carga de mensajes
  claseDinamic = "alert alert-success alert-with-icon";
  iconAlert = "done";


  //boton desactivado en caso q no hayan roles o este caragndo
  botonBloqueo: boolean = true;



  constructor(private _rolService: RolesServices, public dialog: MatDialog,private injector: Injector, private _exceptionService: ExcepcionService) { }

  ngOnInit() {
  }
  
  ngAfterViewInit() {
    this.consultarRoles();
  }


  //Método para aplicar el filtro en la tabla
  aplicarFiltro() {
    this.dataSource.filter = this.filtroNombreRol + (!this.toggleActDesc);
  }


  closeDialog() {
    this.mensaje = '';
  }

    //Cambia el mensaje del toggle para mostrar activos o desactivados
    cambiarMensajeToggle(){
      this.msjToggle = this.toggleActDesc?'Mostrar roles activos':'Mostrar roles desactivados';
    }
  

  /*
  Metodo que consulta los roles de usuario y los asigna al dataSource para el ordenamiento, paginacion y demas
  */
  consultarRoles() {
    try {
    this.respuesta = null;
    this._rolService.consultarTodosRoles().subscribe(
      response => {
        this.respuesta = response;
        if (this.respuesta.length <= 1) {
          this.mensaje = 'Error en el servidor, al consultar roles';
          console.log('Error en el servidor, al consultar roles');
          this.mostrarMensaje(0);
        } else {

          //console.log(ser);
          //let foo: Rol = Object.assign(Rol, JSON.parse(this.respuesta.rol));
          //console.log(foo);
          
          //seteamos el valor de los roles en el objeto Rol
          this.roles = plainToClass(Rol,this.respuesta.rol);

          console.log(this.respuesta.rol);
          //console.log(this.roles[0].getRolactivo());
          

          //asignacion de roles en el dataSource
          this.dataSource = new MatTableDataSource<Rol>(this.roles);
          this.botonBloqueo = false;
          this.aplicarFiltro();
          this.setFilterDataTable();
        }
      },
      error => {
        this.mensaje = 'Error en el servidor, al consultar roles';
        this.respuesta = 'error';
        this.mostrarMensaje(0);
        console.log('Error en el servidor: '+error);
      }

    );
     } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "constultarRol()"
      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
      ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion,url);
      //console.log("error asdasd a:" + e.stack);

    }
  }

  setFilterDataTable() {
    try{
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: Rol, filter: string) => {
      //console.log(this.filtroNombreCedula);
      //console.log("holaaa");
      return ((data.getNombreRol().toLowerCase().indexOf(this.filtroNombreRol) !== -1 ) && (data.getRolactivo()== !this.toggleActDesc ));
    };
  } catch (e) {
    const mensaje = e.message ? e.message : e.toString();
    let funcion = "setFilterDataTable()"

    const location = this.injector.get(LocationStrategy);
    const url = location instanceof PathLocationStrategy
    ? location.path() : '';
    this.enviarExcepcion(mensaje, e, funcion,url);
    //console.log("error asdasd a:" + e.stack);

  }

  }


  clearInput() {
    this.filtroNombreRol = '';
    this.aplicarFiltro();
  }

  
  //dialogo de confirmacion para eliminar o no el rol
  openDialog(rol:Rol): void {
    try {

    let nombreRol = rol.getNombreRol();
    let idRol = rol.getPkidrol();

      const dialogRef = this.dialog.open(DialogConfirmacionRol, {
        width: '250px',
        data: { nombre: nombreRol, id: idRol }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.mensaje =  result.respuesta +" Nombre del Rol: "+nombreRol;
        if (result != null) {
          console.log(result.status);
          if (result.status == "error") {
            this.mostrarMensaje(0);
          } else if (result.status == "Exito") {
            this.mostrarMensaje(1)
            this.toggleActDesc = false;
            this.consultarRoles();

          }
        }
      });
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "openDialog()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
      ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion,url);
      //console.log("error asdasd a:" + e.stack);
    }
  }


  cambiarEstadoRol(rol: Rol) {
    try {
      let active = rol.getRolactivo();
      console.log("Active: " + active);

      this._rolService.cambiarEstadoRol(rol.getPkidrol(), !active, "trol").subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor, al cambiar el estado del rol';
            console.log('Error en el servidor, al cambiar el estado del rol');
            this.mostrarMensaje(0);
          } else {
            this.mensaje = "El cambio de estado del rol " + rol.getNombreRol() + " : " + this.respuesta.msg;
            //cambiamos eal rol de estado
            this.toggleActDesc = false;
            this.consultarRoles();
          
            this.mostrarMensaje(1);
          }
        },
        error => {
          this.mensaje = 'Error en el servidor, al cambiar el estado del rol';
          console.log('Error en el servidor, al cambiar el estado del rol');
          this.mostrarMensaje(0);
        }
      );

    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "CambiarEstadoRol()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
      ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion,url);
      //console.log("error asdasd a:" + e.stack);

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


   /*
    MEtoido que captura las excepciones y las envia al servicio de capturar la excepcion
  */
 enviarExcepcion(mensaje, e, funcion,url) {
  this._exceptionService.capturarExcepcion({ mensaje, url: url, stack: e.stack, funcion: funcion }).subscribe(
    response => {
      
      if (response.length <= 1) {
        console.log('Error en el servidor al enviar excepcion');
      } else {
        if(response.status=!"error"){
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

