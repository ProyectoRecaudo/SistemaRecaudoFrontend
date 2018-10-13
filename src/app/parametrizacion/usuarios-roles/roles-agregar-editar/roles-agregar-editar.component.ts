import { Component, OnInit, Input, Output, EventEmitter, Injector } from '@angular/core';
import { RolesServices } from '../../../servicios/rolesServices.services';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Rol } from '../../../modelos/rol';
import { Modulo } from '../../../modelos/modulo';
import { ModuloServices } from '../../../servicios/moduloServices.service';
import { plainToClass } from "class-transformer";
import { forEach } from '@angular/router/src/utils/collection';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { ExcepcionService } from '../../../servicios/excepcionServices.services';
import { element } from 'protractor';
@Component({
  selector: 'app-roles-agregar-editar',
  templateUrl: './roles-agregar-editar.component.html',
  styleUrls: ['./roles-agregar-editar.component.scss'],
  providers: [RolesServices, ModuloServices, ExcepcionService]
})
export class RolesAgregarEditarComponent implements OnInit {

  //formulario reactive
  nuevoRolForm: FormGroup;

  //Objeto de tipo usuario
  public identidad: Rol;

  //para mostrar el formulario de usuario
  nRol = true;

  //actvar rol, desactivar rol
  active = true;
  textActive = "Activado";


  //respuesta del servidor
  public respuesta;

  //mensaje dialog error creacion de rol
  msg: string = '';


  //traemos el rol desde el componente tabla rol
  @Input() rol: Rol;

  //PAra alternar entre formularios Y ENVIAR MENSAJE
  @Output() llamarTablaRol = new EventEmitter();
  @Output() enviarMensaje = new EventEmitter();

  //mensaje del boton actulizar guardar
  mensajeBoton: string;


  //progress de envio
  creandoRol = false;


  //variable de consulta de permisos
  permisos: Modulo[];

  msjAgregarEditar = 'Agregar un nuevo rol';


  constructor(private nuevoForm: FormBuilder,
    private _rolesServices: RolesServices, private _modulosServices: ModuloServices, private _exceptionService: ExcepcionService, private injector: Injector) { }

  ngOnInit() {
    //validamos el formulario
    this.consultarPermisos()

    this.identidad = new Rol(0, 0, '', 'true', '', new Date, new Date, '');
  }

  //metodo que consulta los permisos de la tabla modulo
  //para setearlos en el objeto de permisos
  consultarPermisos() {
    try {
      this._modulosServices.consultarModulos().subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.msg = 'Error en el servidor al consultar los permisos';
            console.log('Error en el servidor al consultar los permisos');
          } else {
            this.permisos = plainToClass(Modulo, this.respuesta.modulo)//recupero los permisos
            this.validarFormulario();
            //console.log(this.permisos[1].getIcono().length);
          }

        },
        error => {
          this.msg = 'Error en el servidor al consultar los permisos';
          console.log('Error en el servidor al consultar los permisos(tabla modulos)');

        }

      );
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "constultarPermisos()"
      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
      //console.log("error asdasd a:" + e.stack);
    }
  }


  //conecta a la api rest e inserta o actualiza  los campos del rol
  nuevoRol() {
    try {
      this.creandoRol = true;
      //seteamos en el objeto rol las variables del formulario
      this.identidad.setCodigoRol(this.nuevoRolForm.get('codigorol').value);
      this.identidad.setNombreRol(this.nuevoRolForm.get('nombrerol').value);
      this.identidad.setDescripcionRol(this.nuevoRolForm.get('descripcionrol').value);
      this.identidad.setRolactivo(this.active);
      let arrPermisos = this.nuevoRolForm.get('pkidmodulo').value;
      let arrModulo = [];

      arrPermisos.forEach(element => {
        let rol = element.split('-');
        let id = rol[0];
        let nombre = rol[1];

        arrModulo.push('"' + id + '"' + ':' + '"' + nombre + '"');
      });

      console.log(arrModulo);

      if (this.rol == null) {//Si el rol de entrada por input es vacio significa q es un nuevo usuario

        this._rolesServices.crearRol(this.identidad, arrModulo).subscribe(
          response => {
            this.respuesta = response;
            if (this.respuesta.length <= 1) {
              this.msg = 'Error en el servidor';
              console.log('Error en el servidor');
            } else {
              //this.msg = this.respuesta.msg;
              this.creandoRol = false;
              if (this.respuesta.status == "Exito") {
                this.enviarMensaje.emit({ mensaje: this.respuesta.msg });
                this.llamarTablaRol.emit({ cancel: '1' });
              } else {
                this.msg = this.respuesta.msg;
              }

            }
          },
          error => {
            this.msg = 'Error en el servidor';
            console.log('Error en el servidor');
          }

        );


      } else {//si llega el rol por el parametro input es actualizar

        console.log(this.valueSelect);

        this.identidad.setPkidrol(this.rol.getPkidrol());
        this._rolesServices.actualizarRol(this.identidad, arrModulo, this.valueSelect).subscribe(
          response => {
            this.respuesta = response;
            if (this.respuesta.length <= 1) {
              this.msg = 'Error en el servidor';
              console.log('Error en el servidor');
            } else {
              //this.msg = this.respuesta.msg;
              this.creandoRol = false;
              this.enviarMensaje.emit({ mensaje: this.respuesta.msg });
              this.llamarTablaRol.emit({ cancel: '1' });
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
      let funcion = "nuevoRol()"
      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
      //console.log("error asdasd a:" + e.stack);
    }

  }

  valueSelect = []; //valores seleccionados(tipos de recaudo)
  validarFormulario() {
    try {

      let perm: any[];
      this.seleccionados = [];
      if (this.rol != null) {//si llega por actualizar
        this.active = this.rol.getRolactivo();
        this.textActive = this.active ? "Activado" : "Desactivado";
        this.mensajeBoton = "Actualizar";
        this.msjAgregarEditar = 'Actualizar el rol';

        //console.log(this.rol.getPermiso());


        perm = (this.rol.getPermiso());
        //convierte el parametro en array para poder acceder
        var res = Object.keys(perm)
          // iterate over them and generate the array
          .map(function (k) {
            // generate the array element 
            return [+k, perm[k]];
          });
        //console.log(res);


        for (let i = 0; i < res.length; i++) {
          //console.log(res[i]);
          let unir = '';
          this.permisos.map((p) => {
            if (p.getPkidmodulo() == res[i][0]) {
              this.seleccionados.push(p.getNombremodulo());
            }
          });
          for (let j = 0; j < res[i].length; j++) {
            //console.log(res[i][j]);
            unir += res[i][j] + "-";
          }
          this.valueSelect.push(unir.slice(0, -1));//cortamos el - final
        }

        // this.seleccionados = this.valueSelect;

      } else {
        this.msjAgregarEditar = 'Agregar un nuevo rol';
        this.mensajeBoton = "Guardar";
      }

      this.nuevoRolForm = this.nuevoForm.group({
        codigorol: [this.rol != null ? this.rol.getCodigoRol() : ''],
        nombrerol: [this.rol != null ? this.rol.getNombreRol() : '', Validators.required],
        descripcionrol: [this.rol != null ? this.rol.getDescripcionRol() : '', Validators.required],
        pkidmodulo: [this.rol != null ? this.valueSelect : '', Validators.required]
      });



    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "ValidarFormulario()"
      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
      //console.log("error asdasd a:" + e.stack);
    }



  }

  activarDesactivarRol() {
    this.active = !this.active;
    this.textActive = this.active ? "Activado" : "Desactivado";
  }


  closeDialog() {
    this.msg = '';
  }

  seleccionados = [];
  //metodo que muestra los seleccionados
  onChangePermisos(event) {
    console.log(this.permisos);

    this.seleccionados = [];
    event.value.forEach(element => {
      let perm = element.split('-');
      let id = perm[0];
      this.permisos.map((p) => {
        if (p.getPkidmodulo() == id) {
          this.seleccionados.push(p.getNombremodulo());
        }
      });

    });


    //this.seleccionados = element.value;
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
