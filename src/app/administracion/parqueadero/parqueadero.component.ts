import { Component, OnInit, ViewChild, Injector, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { plainToClass } from "class-transformer";
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { PlazaServices } from '../../servicios/plazaServices.services';
import { ParqueaderoServices } from '../../servicios/parqueaderoService.services';
import { ExcepcionService } from '../../servicios/excepcionServices.services';
import { TipoParqueaderoServices } from '../../servicios/tipos-services/tipoparqueaderoServices.service';
import { Parqueadero } from '../../modelos/parqueadero';
import { TipoParqueadero } from '../../modelos/tipos/tipoparqueadero';
import { PlazaMercado } from '../../modelos/plaza-mercado';
import { DialogConfirmacionTipos } from '../../parametrizacion/dialogTipo.confirm.component';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-parqueadero',
  templateUrl: './parqueadero.component.html',
  styleUrls: ['./parqueadero.component.scss'],
  providers: [ExcepcionService, PlazaServices, ParqueaderoServices, TipoParqueaderoServices]

})
export class ParqueaderoComponent implements OnInit, OnDestroy {

  cabecerasColumnas = ['numeroparqueadero', 'tipoparqueadero', 'nombreplaza', 'parqueaderoactivo', 'actions'];
  //variable de entrada de texto del imput buscar(nombre parqueadero )
  filtronumeroParqueadero: string = '';
  //varible de mostrar desctivados
  toggleActDesc: boolean = false;

  //variable para obtener los datos de la consulta
  parqueadero: Parqueadero[];

  //Variables de paginacion y ordenamiento
  dataSource: MatTableDataSource<ParqueaderoInterface>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  //respuesta del servidor
  public respuesta;

  //clase dinamica pra carga de mensajes
  claseDinamic = "alert alert-warning alert-with-icon";
  iconAlert = "warning";

  //mensaje de respuesta
  public mensaje: string;

  //variable para retornar las plazas de mercado y tipo parqueadero y filtralos en el select
  plazasmercado: PlazaMercado[];
  tipoparqueaderos: TipoParqueadero[] = [];

  //boton desactivado en caso q no hayan roles o este caragndo
  botonBloqueo: boolean = true;

  //variable asignada al selector de busqeuda por plaza y tipo de parqueadero
  plazaselect: string = '';
  tipoparqueselect: string = '';

  //variable de tipo interface para envio y muestra en la mattable
  parqueaderoInterface: ParqueaderoInterface[];

  //Mensaje para el toggle de mostrar activos/inactivos
  msjToggle = 'Mostrar Parqueaderos desactivados';
  /*-------------------------------------------------------------------------- */
  //Variables para el formulario de agregar un nuevo parqeu
  mostrarFormParqueadero = false;
  mostrarTabla = true;
  //formulario reactive
  nuevoParqueaderoForm: FormGroup;
  //actvar zonas, desactivar zonas
  active = true;
  textActive = "true";
  //mensaje del boton actulizar guardar
  mensajeBoton: string;
  parqueadero2: ParqueaderoInterface;

  //mensaje para mostrar en el formulario de agregar
  msg: string = '';
  //progreso de envio
  creandoparqueadero: boolean = false;
  //variable que valida si esta por actualizar o guardar un nuevo
  isUpdate = false;

  navigationSubscription;

  //MEnsaje para mostrar si es nuevo o actualziar;
  msjAgregarEditar = 'Agregar un nuevo parqueadero';
  constructor(private nuevoForm: FormBuilder, public dialog: MatDialog, private injector: Injector, private _exceptionService: ExcepcionService, private _plazaService: PlazaServices, private _parqueaderoService: ParqueaderoServices, private _tipoparqueService: TipoParqueaderoServices, private router: Router) {

    this.recargarComponente();

  }


  recargarComponente() {
    this.navigationSubscription = this.router.events.subscribe(
      (e: any) => {
        if (e instanceof NavigationEnd) {
          console.log('recargando componente');
          if (this.mostrarFormParqueadero) {
            this.mostrarFormParqueadero = !this.mostrarFormParqueadero;
            this.mostrarTabla = !this.mostrarTabla;
            this.consultarParqueaderos();
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

    this.consultarParqueaderos();
    this.consultarPlazasMercado();
    this.consultarTiposParque();
  }



  /**
   * MEtodo que consulta todos los parqueaderos, los transforma a la interfaz para el datasource y tambien para ordenamiento 
   */
  consultarParqueaderos() {

    try {
      this.respuesta = null;
      this.parqueaderoInterface = [];
      this.filtronumeroParqueadero = '';
      this.plazaselect = '';
      this.tipoparqueselect = '';
      this.toggleActDesc = false;
      this._parqueaderoService.consultarTodosParqueaderos().subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor';
            console.log('Error en el servidor');
            this.mostrarMensaje(0);
          } else {

            console.log(this.respuesta.parqueaderos);

            //seteamos el valor de los parqueaderos en el objeto parqueadero
            this.parqueadero = plainToClass(Parqueadero, this.respuesta.parqueaderos);
            this.parqueadero.map((z) => {
              z.plaza = plainToClass(PlazaMercado, z.getPlaza());
              z.setTipoparqueadero(plainToClass(TipoParqueadero, z.getTipoparqueadero()));
            }

            );
            //asignacion de parqueaderos en el dataSource

            //setear en una interfaz para el correcto ordenamiento en la tabla
            //puesto que daba problemas al acceder desde el objeto Zona a las propiedades de los sub objetos
            //contenidos en el y no ordenaba
            this.parqueadero.map((z) => {
              let pi: ParqueaderoInterface = {
                pkidparqueadero: null, codigoparqueadero: '', nombreplaza: '', numeroparqueadero: '', nombretipoparqueadero: '', parqueaderoactivo: false, fkidplaza: null, fkidtipoparqueadero: null
              };
              pi.pkidparqueadero = z.getPkidparqueadero();
              pi.codigoparqueadero = z.getCodigoparqueadero();
              pi.numeroparqueadero = z.getNumeroparqueadero();
              pi.nombreplaza = z.getPlaza().getNombreplaza();
              pi.nombretipoparqueadero = z.getTipoparqueadero().getNombretipoparqueadero();
              pi.parqueaderoactivo = z.getParqueaderoactivo();
              pi.fkidtipoparqueadero = z.getTipoparqueadero().getPkidtipoparqueadero();
              pi.fkidplaza = z.getPlaza().getPkidplaza();
              this.parqueaderoInterface.push(pi)
            }
            );

            this.dataSource = new MatTableDataSource<any>(this.parqueaderoInterface);

            this.botonBloqueo = false;
            this.aplicarFiltro();
            this.setFilterDataTable();
          }
        },
        error => {
          this.mensaje = 'Error en el servidor al consultar los parqueaderos, intentelo nuevamente';
          this.respuesta = 'error';
          this.mostrarMensaje(0);
          console.log('Error en el servidor: ' + error);
        }

      );
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "consultarParqueaderos()"
      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);

    }
  }

  //Cambia el mensaje del toggle para mostrar activos o desactivados
  cambiarMensajeToggle() {
    this.msjToggle = this.toggleActDesc ? 'Mostrar Parqueaderos activos' : 'Mostrar Parqueaderos desactivados';
  }

  //para consultar las plazas de mercado y seterala en el select
  consultarPlazasMercado() {
    try {
      this.respuesta = null;

      this._plazaService.consultarTodasPlazas(true).subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor al consultar las plazas';
            console.log('Error en el servidor');
            this.mostrarMensaje(0);
          } else {
            //conversion del json de plazas a la clase plazas 
            //guardamos el objeto en la variable
            this.plazasmercado = plainToClass(PlazaMercado, this.respuesta.plaza);
          }

        },
        error => {
          this.mensaje = 'Error en el servidor al consultar las plazas, intetelo nuevamente';
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

  //metodo que consulta todos los tipos de parqueadero
  consultarTiposParque() {
    try {
      this.respuesta = null;

      this._tipoparqueService.consultarTipoParqueadero(true).subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor al los tipos de parqueadero';
            console.log('Error en el servidor');
            this.mostrarMensaje(0);
          } else {
            //conversion del json de plazas a la clase plazas 
            //guardamos el objeto en la variable
            this.tipoparqueaderos = plainToClass(TipoParqueadero, this.respuesta.tipoparqueadero);
          }

        },
        error => {
          this.mensaje = 'Error en el servidor al consultar los tipos de parqueadero, intentelo nuevamente';
          this.respuesta = 'error';
          this.mostrarMensaje(0);
          console.log('Error en el servidor ' + error);
        }

      );
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "consultarTiposParque()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);

    }
  }

  //Método para aplicar el filtro en la tabla
  aplicarFiltro() {
    //console.log(this.plazaselect);
    this.dataSource.filter = this.filtronumeroParqueadero + (!this.toggleActDesc) + this.plazaselect + this.tipoparqueselect;
  }


  closeDialog() {
    this.mensaje = '';
  }


  setFilterDataTable() {
    try {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: ParqueaderoInterface, filter: string) => {

        return ((data.numeroparqueadero.toLowerCase().indexOf(this.filtronumeroParqueadero) !== -1) && (data.parqueaderoactivo == !this.toggleActDesc) && (data.nombreplaza.indexOf(this.plazaselect) !== -1) && (data.nombretipoparqueadero.indexOf(this.tipoparqueselect) !== -1));
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


  cambiarEstadoParqueadero(parqueaderos) {
    let parqueadero: Parqueadero = new Parqueadero();
    parqueadero.setPkidparqueadero(parqueaderos.pkidparqueadero);
    parqueadero.setNumeroparqueadero(parqueaderos.numeroparqueadero);
    try {
      let active = parqueaderos.parqueaderoactivo;
      console.log("Active: " + active);

      this._parqueaderoService.cambiarEstadoParqueadero(parqueadero.getPkidparqueadero(), !active, "tparqueadero").subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor';
            console.log('Error en el servidor');
            this.mostrarMensaje(0);
          } else {
            this.mensaje = "El cambio de estado del parqueadero " + parqueadero.getNumeroparqueadero() + " : " + this.respuesta.msg;
            //cambiamos eal rol de estado
            this.toggleActDesc = false;
            this.consultarParqueaderos();

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
      let funcion = "cambiarEstadoZona()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);

    }
  }

  //dialogo de confirmacion para eliminar o no el usuario
  openDialog(parqueaderos): void {
    try {
      this.mensaje = '';
      let numeroparqueadero = parqueaderos.numeroparqueadero;
      let idparqueadero = parqueaderos.pkidparqueadero;

      const dialogRef = this.dialog.open(DialogConfirmacionTipos, {
        width: '250px',
        data: { nombre: numeroparqueadero, id: idparqueadero, tipoIdentifi: 4 }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result != null) {
          this.mensaje = result.respuesta + " Nombre parqueadero : " + numeroparqueadero;
          console.log(result.status);
          if (result.status == "error") {
            this.mostrarMensaje(0);
          } else if (result.status == "Exito") {
            this.mostrarMensaje(1)
            this.toggleActDesc = false;
            this.consultarParqueaderos();
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
  llamarFormularioAgregarParqueadero(element: ParqueaderoInterface) {
    try {
      console.log(element);
      this.mensaje = '';
      this.mostrarFormParqueadero = !this.mostrarFormParqueadero;
      this.mostrarTabla = !this.mostrarTabla;
      //si llega por actualizar seteamos el objeto zona 2 con los campos de las variables
      this.parqueadero2 = element != null ? element : null;
      this.isUpdate = element != null ? true : false;
      //validamos el formulario solo en caso que este este visible
      if (this.mostrarFormParqueadero) {
        this.nuevoParqueaderoForm = this.nuevoForm.group({
          codigoparqueadero: [this.parqueadero2 != null ? this.parqueadero2.codigoparqueadero : ''],
          numeroparqueadero: [this.parqueadero2 != null ? this.parqueadero2.numeroparqueadero : '', Validators.required],
          pkidplaza: [this.parqueadero2 != null ? this.parqueadero2.fkidplaza : '', Validators.required],
          pkidtipoparqueadero: [this.parqueadero2 != null ? this.parqueadero2.fkidtipoparqueadero : '', Validators.required],
        });
      }
      this.active = this.parqueadero2 != null ? this.parqueadero2.parqueaderoactivo : true;
      this.textActive = this.active ? "Activado" : "Desactivado";
      //si el parqueadero es nullo, significa que entra por un nuevo objeto
      this.mensajeBoton = this.parqueadero2 == null ? "Guardar" : "Actualizar";
      this.msjAgregarEditar = this.parqueadero2 == null ? 'Agregar un nuevo parqueadero' : 'Actualizar el parqueadero';

      if (element == null) {
        this.consultarParqueaderos();
        //this.dataSource = new MatTableDataSource<any>(this.parqueaderoInterface);
      }

    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "llamarFormularioAgregarParqueadero()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);

    }
  }

  /**
  * 
  * metodo que agrega el parqeuadero de  o edita un parqeuadero de  
  */
  editarAgregarParqueadero() {
    try {


      //this.zona = ;
      this.creandoparqueadero = true;
      if (this.parqueadero2 == null) {
        this.parqueadero2 = {
          pkidparqueadero: null, codigoparqueadero: '', numeroparqueadero: '', nombreplaza: '', nombretipoparqueadero: '', parqueaderoactivo: false, fkidplaza: null, fkidtipoparqueadero: null
        };

      }

      this.parqueadero2.codigoparqueadero = (this.nuevoParqueaderoForm.get('codigoparqueadero').value).toString().trim();
      this.parqueadero2.numeroparqueadero = (this.nuevoParqueaderoForm.get('numeroparqueadero').value).toString().trim();
      this.parqueadero2.fkidplaza = (this.nuevoParqueaderoForm.get('pkidplaza').value);
      this.parqueadero2.fkidtipoparqueadero = (this.nuevoParqueaderoForm.get('pkidtipoparqueadero').value);
      this.parqueadero2.parqueaderoactivo = (this.active);

      this.closeDialog2();
      if (!this.isUpdate) {//entra por agregar un nuevo zona de 
        this._parqueaderoService.crearParqueadero(this.parqueadero2).subscribe(
          response => {
            this.respuesta = response;
            if (this.respuesta.length <= 1) {
              this.msg = 'Error en el servidor';
              console.log('Error en el servidor');
            } else {
              //this.msg = this.respuesta.msg;
              this.creandoparqueadero = false;
              if (this.respuesta.status == "Exito") {//si es exitoso, envia la respuesta al mensaje principal, oculta/muestra el formulario/tabla y recarga los zonas de 
                this.mensaje = this.respuesta.msg;
                this.mostrarMensaje(1);
                this.mostrarFormParqueadero = !this.mostrarFormParqueadero;
                this.mostrarTabla = !this.mostrarTabla;
                this.active = false;
                this.toggleActDesc = false;
                this.consultarParqueaderos();
              } else {
                this.msg = this.respuesta.msg;
              }

            }
          },
          error => {
            this.msg = 'Error en el servidor al crear , intentelo nuevamente';
            console.log('Error en el servidor' + error);
          }
        );

      } else {//actualizamos el zona de 
        this._parqueaderoService.actualizarParqueadero(this.parqueadero2).subscribe(
          response => {
            this.respuesta = response;
            if (this.respuesta.length <= 1) {
              this.msg = 'Error en el servidor';
              console.log('Error en el servidor');
            } else {
              //this.msg = this.respuesta.msg;
              this.creandoparqueadero = false;
              if (this.respuesta.status == "Exito") {//si es exitoso, envia la respuesta al mensaje principal, oculta/muestra el formulario/tabla y recarga los zonas de 
                this.mensaje = this.respuesta.msg;
                this.mostrarMensaje(1);
                this.mostrarFormParqueadero = !this.mostrarFormParqueadero;
                this.mostrarTabla = !this.mostrarTabla;
                this.active = false;
                this.toggleActDesc = false;
                this.consultarParqueaderos();
              } else {
                this.msg = this.respuesta.msg;
              }

            }
          },
          error => {
            this.msg = 'Error en el servidor al actualizar, intetelo nuevamente';
            console.log('Error en el servidor' + error);
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

  activarDesactivarparqueadero() {
    this.active = !this.active;
    this.textActive = this.active ? "Activado" : "Desactivado";
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

  /**
   * Limpia el filtro por numero de parqueadero
   */
  clearInput() {
    this.filtronumeroParqueadero = '';
    this.aplicarFiltro();
  }


}


interface ParqueaderoInterface {
  pkidparqueadero: number;
  codigoparqueadero: string;
  numeroparqueadero: string;
  nombreplaza: string;
  nombretipoparqueadero: string;
  parqueaderoactivo: boolean;
  fkidplaza: number;
  fkidtipoparqueadero: number;
}
