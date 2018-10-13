import { Component, OnInit, ViewChild, Injector, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ExcepcionService } from '../../servicios/excepcionServices.services';
import { EspecieAnimalService } from '../../servicios/especieanimalService.services';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { DialogConfirmacionTipos } from '../dialogTipo.confirm.component';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-especie-animal',
  templateUrl: './especie-animal.component.html',
  styleUrls: ['./especie-animal.component.scss'],
  providers: [EspecieAnimalService, ExcepcionService]
})
export class EspecieAnimalComponent implements OnInit, OnDestroy {

  cabecerasColumnas = ['codigoespecieanimal', 'nombreespecieanimal', 'nombretipoanimal', 'especieanimalactivo', 'actions'];
  //variable de entrada de texto del imput buscar(nombre zona )
  filtroNombreEspecie: string = '';
  //varible de mostrar desctivados
  toggleActDesc: boolean = false;

  //variable especies para llenar de la consulta
  especieanimal: any[] = [];

  //Variables de paginacion y ordenamiento
  dataSource: MatTableDataSource<any>;
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
  especieanimalinter: EspecieAnimalInterface[] = [];

  //variable para retornar las plazas de mercado
  tipoanimales: any[] = [];

  //boton desactivado en caso q no hayan roles o este caragndo
  botonBloqueo: boolean = true;

  //variable asignada al selector de busqeuda por plaza
  tipoanimalselect: string = '';

  /*-------------------------------------------------------------------------- */
  //Variables para el formulario de agregar un nuevo especie
  mostrarFormEspecie = false;
  mostrarTabla = true;

  //formulario reactive
  nuevoEspecieForm: FormGroup;
  //actvar especies, desactivar especies
  active = true;
  textActive = "Activado";
  //mensaje del boton actulizar guardar
  mensajeBoton: string;
  especie2: EspecieAnimalInterface;

  //mensaje para mostrar en el formulario de agregar
  msg: string = '';
  //progreso de envio
  creandoespecie: boolean = false;
  //variable que valida si esta por actualizar o guardar un nuevo
  isUpdate = false;

  msjAgregarEditar = 'Agregar una especie de animal';

  //Mensaje para el toggle de mostrar activos/inactivos
  msjToggle = 'Mostrar especies desactivados';

  navigationSubscription;


  constructor(private nuevoForm: FormBuilder, public dialog: MatDialog, private injector: Injector, private _exceptionService: ExcepcionService, private _especieanimalSerice: EspecieAnimalService, private router: Router) {
    this.recargarComponente();

  }


  recargarComponente() {
    this.navigationSubscription = this.router.events.subscribe(
      (e: any) => {
        if (e instanceof NavigationEnd) {
          console.log('recargando componente');
          if (this.mostrarFormEspecie) {
            this.mostrarFormEspecie = !this.mostrarFormEspecie;
            this.mostrarTabla = !this.mostrarTabla;
            this.consultarEspeciesAnimal();

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
    this.consultarEspeciesAnimal();
    this.consultarTiposdeAnimal();
  }

  /**
   * Metodo que consulta todos los datos de 
   */
  consultarEspeciesAnimal() {
    try {
      this.respuesta = null;
      this.especieanimalinter = [];
      this.filtroNombreEspecie = '';
      this.tipoanimalselect = '';
      this.toggleActDesc = false;
      this._especieanimalSerice.consultarTodosEspecieAnimal().subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor';
            console.log('Error en el servidor');
            this.mostrarMensaje(0);
          } else {
            //conversion del json de plazas a la clase plazas 
            //guardamos el objeto en la variable
            this.especieanimal = this.respuesta.especieanimal;

            //setear en una interfaz para el correcto ordenamiento en la tabla
            //contenidos en el y no ordenaba
            this.especieanimal.map((x) => {
              let especie: EspecieAnimalInterface = {
                codigoespecieanimal: '', especieanimalactivo: false, fkidtipoanimal: null, nombreespecieanimal: '', nombretipoanimal: '', pkidespecieanimal: null
              }
              especie.codigoespecieanimal = x.codigoespecieanimal;
              especie.nombreespecieanimal = x.nombreespecieanimal;
              especie.pkidespecieanimal = x.pkidespecieanimal;
              especie.fkidtipoanimal = x['tipoanimal'].pkidtipoanimal;
              especie.nombretipoanimal = x['tipoanimal'].nombretipoanimal;
              especie.especieanimalactivo = x.especieanimalactivo;
              this.especieanimalinter.push(especie);
            });

            this.dataSource = new MatTableDataSource<any>(this.especieanimalinter);

            this.botonBloqueo = false;
            this.aplicarFiltro();
            //this.setFilterDataTable();

          }

        },
        error => {
          this.mensaje = 'Error en el servidor al consultar especies de animales, intente nuevamente';
          this.respuesta = 'error';
          this.mostrarMensaje(0);
          console.log('Error en el servidor');
        }

      );
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "consultarEspeciesAnimal()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);

    }

  }


  /**
   * consultar todos los tipos de animal para el select de filtro y en el insertar
   */
  consultarTiposdeAnimal() {
    try {
      this.respuesta = null;

      this._especieanimalSerice.consultarTipoAnimal().subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor';
            console.log('Error en el servidor');
            this.mostrarMensaje(0);
          } else {
            //conversion del json de plazas a la clase plazas 
            //guardamos el objeto en la variable
            this.tipoanimales = this.respuesta.tipoanimal;
          }

        },
        error => {
          this.mensaje = 'Error en el servidor al consultar tipos de animales, intente nuevamente';
          this.respuesta = 'error';
          this.mostrarMensaje(0);
          console.log('Error en el servidor');
        }

      );
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "consultarTiposdeAnimal()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);

    }
  }

  closeDialog() {
    this.mensaje = '';
  }

  //Método para aplicar el filtro en la tabla
  aplicarFiltro() {
    //this.dataSource.filter = '';
    this.dataSource.filter = this.filtroNombreEspecie + (!this.toggleActDesc) + this.tipoanimalselect;
    this.setFilterDataTable();
    console.log(this.dataSource.filter);
  }

  setFilterDataTable() {
    try {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: EspecieAnimalInterface, filter: string) => {

        return ((data.nombreespecieanimal.toLowerCase().indexOf(this.filtroNombreEspecie) !== -1) && (data.especieanimalactivo == !this.toggleActDesc) && (data.nombretipoanimal.indexOf(this.tipoanimalselect) !== -1));
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

  clearInput() {
    this.filtroNombreEspecie = '';
    this.aplicarFiltro();
  }


  /**
   * 
   * Metodo que cambia el estado de la especieanimal de la base de datos
   */
  cambiarEstadoEspecie(especies) {
    //console.log(especies);
    try {
      let active = especies.especieanimalactivo;
      //console.log("Active: " + active);

      this._especieanimalSerice.cambiarEstadoEspecieAnimal(especies.pkidespecieanimal, !active, "tespecieanimal").subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor';
            console.log('Error en el servidor');
            this.mostrarMensaje(0);
          } else {
            this.mensaje = "El cambio de estado de   " + especies.nombreespecieanimal + " : " + this.respuesta.msg;
            //cambiamos eal rol de estado
            this.toggleActDesc = false;
            this.consultarEspeciesAnimal();
            this.mostrarMensaje(1);
          }
        },
        error => {
          this.mensaje = 'Error en el servidor al cambiar el estado';
          console.log('Error en el servidor');
          this.mostrarMensaje(0);
        }
      );

    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "cambiarEstadoEspecie()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);

    }

  }

  //dialogo de confirmacion para eliminar o no el usuario
  openDialog(especies): void {
    this.mensaje = '';
    try {
      let nombreespecieanimal = especies.nombreespecieanimal;
      let idespecieanimal = especies.pkidespecieanimal;

      const dialogRef = this.dialog.open(DialogConfirmacionTipos, {
        width: '250px',
        data: { nombre: nombreespecieanimal, id: idespecieanimal, tipoIdentifi: 7 }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result != null) {
          this.mensaje = result.respuesta + " Nombre Especie animal : " + nombreespecieanimal;
          console.log(result.status);
          if (result.status == "error") {
            this.mostrarMensaje(0);
          } else if (result.status == "Exito") {
            this.mostrarMensaje(1)
            this.toggleActDesc = false;
            this.consultarEspeciesAnimal();

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
  llamarFormularioAgregarEspecie(element: EspecieAnimalInterface) {
    try {
      this.mensaje = '';
      console.log(element);

      this.mostrarFormEspecie = !this.mostrarFormEspecie;
      this.mostrarTabla = !this.mostrarTabla;
      //si llega por actualizar seteamos el objeto zona 2 con los campos de las variables
      this.especie2 = element != null ? element : null;
      this.isUpdate = element != null ? true : false;

      //Consultar los usuaros de tipo recaudo y consultar las plazas de mercadp q no tengan ninguna asignacion en zonas


      //validamos el formulario solo en caso que este este visible
      if (this.mostrarFormEspecie) {
        this.nuevoEspecieForm = this.nuevoForm.group({
          codigoespecieanimal: [this.especie2 != null ? this.especie2.codigoespecieanimal : ''],
          nombreespecieanimal: [this.especie2 != null ? this.especie2.nombreespecieanimal : '', Validators.required],
          pkidtipoanimal: [this.especie2 != null ? this.especie2.fkidtipoanimal : '', Validators.required],
        });
      }
      this.active = this.especie2 != null ? this.especie2.especieanimalactivo : true;
      this.textActive = this.active ? "Activado" : "Desactivado";
      //si el zona es nullo, significa que entra por un nuevo objeto
      this.mensajeBoton = this.especie2 == null ? "Guardar" : "Actualizar";
      this.msjAgregarEditar = this.especie2 == null ? "Agregar una especie de animal" : "Actualizar la especie de animal";

    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "llamarFormularioAgregarEspecie()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
    }
  }


  //Cambia el mensaje del toggle para mostrar activos o desactivados
  cambiarMensajeToggle() {
    this.msjToggle = this.toggleActDesc ? 'Mostrar especies activos' : 'Mostrar especies desactivados';
  }

  editarAgregarEspecie() {
    this.mensaje = '';
    try {
      //this.zona = ;
      this.creandoespecie = true;
      if (this.especie2 == null) {
        this.especie2 = {
          codigoespecieanimal: '', especieanimalactivo: false, fkidtipoanimal: null, nombreespecieanimal: '', nombretipoanimal: '', pkidespecieanimal: null
        };

      }

      this.especie2.codigoespecieanimal = (this.nuevoEspecieForm.get('codigoespecieanimal').value);
      this.especie2.nombreespecieanimal = (this.nuevoEspecieForm.get('nombreespecieanimal').value);
      this.especie2.fkidtipoanimal = (this.nuevoEspecieForm.get('pkidtipoanimal').value);
      this.especie2.especieanimalactivo = (this.active);

      this.closeDialog2();
      if (!this.isUpdate) {//entra por agregar un nuevo zona de 
        this._especieanimalSerice.crearEspecieAnimal(this.especie2).subscribe(
          response => {
            this.respuesta = response;
            if (this.respuesta.length <= 1) {
              this.msg = 'Error en el servidor';
              console.log('Error en el servidor');
            } else {
              //this.msg = this.respuesta.msg;
              this.creandoespecie = false;
              if (this.respuesta.status == "Exito") {//si es exitoso, envia la respuesta al mensaje principal, oculta/muestra el formulario/tabla y recarga los zonas de 
                this.mensaje = this.respuesta.msg;
                this.mostrarMensaje(1);
                this.mostrarFormEspecie = !this.mostrarFormEspecie;
                this.mostrarTabla = !this.mostrarTabla;
                this.active = false;
                this.toggleActDesc = false;
                this.consultarEspeciesAnimal();
              } else {
                this.msg = this.respuesta.msg;
              }

            }
          },
          error => {
            this.msg = 'Error en el servidor';
            console.log('Error en el servidor' + error);
          }
        );

      } else {//actualizamos el zona de 
        this._especieanimalSerice.actualizarEspecieAnimal(this.especie2).subscribe(
          response => {
            this.respuesta = response;
            if (this.respuesta.length <= 1) {
              this.msg = 'Error en el servidor';
              console.log('Error en el servidor');
            } else {
              //this.msg = this.respuesta.msg;
              this.creandoespecie = false;
              if (this.respuesta.status == "Exito") {//si es exitoso, envia la respuesta al mensaje principal, oculta/muestra el formulario/tabla y recarga los zonas de 
                this.mensaje = this.respuesta.msg;
                this.mostrarMensaje(1);
                this.mostrarFormEspecie = !this.mostrarFormEspecie;
                this.mostrarTabla = !this.mostrarTabla;
                this.active = false;
                this.toggleActDesc = false;
                this.consultarEspeciesAnimal();
              } else {
                this.msg = this.respuesta.msg;
              }

            }
          },
          error => {
            this.msg = 'Error en el servidor';
            console.log('Error en el servidor' + error);
          }
        );



      }
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "editarAgregarEspecie()"
      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);

    }
  }

  //activar o desctivar el boton y mostrar visualmente
  activarDesactivarespecie() {
    this.active = !this.active;
    this.textActive = this.active ? "Activado" : "Desactivado";
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

export interface EspecieAnimalInterface {
  pkidespecieanimal: number;
  codigoespecieanimal: string;
  nombreespecieanimal: string;
  especieanimalactivo: boolean;
  fkidtipoanimal: number;
  nombretipoanimal: string;

}
