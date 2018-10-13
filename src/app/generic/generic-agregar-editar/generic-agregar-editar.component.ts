import { Component, OnInit, Output, EventEmitter, Input, Injector } from '@angular/core';
import { GenericServices } from '../../servicios/genericServices.services';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Usuario } from '../../modelos/usuario';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidateContrasenia } from './contrase\u00F1a.validator';
import { plainToClass } from "class-transformer";
import { ExcepcionService } from '../../servicios/excepcionServices.services';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';


@Component({
  selector: 'app-generic-agregar-editar',
  templateUrl: './generic-agregar-editar.component.html',
  styleUrls: ['./generic-agregar-editar.component.scss'],
  providers: [GenericServices, ExcepcionService]
})
export class GenericAgregarEditarComponent implements OnInit {


  //formulario reactive
  nuevoUsuarioForm: FormGroup = new FormGroup({
    default: new FormControl()
  });

  public files: any[];

  //Objeto de tipo usuario
  public identidad: any = {};

  //para mostrar el formulario de usuario
  nUsuario = true;
  primaryKey: string = '';
  title: string = "";
  newTitle: string = "";
  //actvar user, desactivar usuario
  active = true;
  textActive = "Activado";
  etiquetasColumnas: any[] = [];
  //campos de las contraseñas
  contrasenia: string = '123';
  contrasenia2: string = '';

  //mensaje validacion contraseña
  msg2: string = '';
  ban = false;

  //respuesta del servidor
  public respuesta;


  msjAgreEdit = 'Agregar un';

  //mensaje dialog error creacion de usuario
  msg: string = '';

  //PAra alternar entre formularios Y ENVIAR MENSAJE
  @Output() llamarFormulario = new EventEmitter();
  @Output() enviarMensaje = new EventEmitter();
  @Input() mensaje: string;
  //traemos el usuario desde el componente tabla
  @Input() usuario: any;
  //mensaje del boton actulizar guardar
  mensajeBoton: string;
  //progress de envio
  creandoUsuario = false;



  constructor(
    private nuevoForm: FormBuilder,
    private _genericService: GenericServices,
    private injector: Injector, private _exceptionService: ExcepcionService
  ) {
    this.files = [];

  }

  ngOnInit() {
    //console.log("oninit");
    //validamos el formulario
    if (this.usuario != null) { let update: boolean = true; this.consultarUsuarios(update, this.usuario); } else { let update: boolean = false; this.consultarUsuarios(update); }
    this.validarFormulario();
    //this.identidad = new Usuario(0, '', 0, '', '', "true", new Date, new Date, '');


    this.onChanges();
  }


  //observador para validar las contraseñas si son las mismas
  onChanges() {
    try {
      this.nuevoUsuarioForm.valueChanges.subscribe(
        valor => {
          this.contrasenia = valor.contrasenia;
          this.contrasenia2 = valor.repetirContrasenia;

          if (this.usuario != null) {//actualziacion
            //los campos de contraseña no son obligatorios
            if (this.contrasenia != '' || valor.repetirContrasenia != '') {

              if (this.contrasenia != this.contrasenia2) {
                this.nuevoUsuarioForm.get('repetirContrasenia').setValidators([ValidateContrasenia(this.contrasenia)]);
                this.msg2 = "las contraseñas no coinciden";
                this.ban = true;
              } else {
                this.nuevoUsuarioForm.get('repetirContrasenia').setValidators([Validators.required]);
                this.ban = false;
              }
              this.nuevoUsuarioForm.get('repetirContrasenia').updateValueAndValidity({ emitEvent: false, onlySelf: false });
            }
          } else {//si el usuario no esta definido(nuevo usuario)
            //se agrega siempre la validacion
            if (this.contrasenia != this.contrasenia2) {
              this.nuevoUsuarioForm.get('repetirContrasenia').setValidators([ValidateContrasenia(this.contrasenia)]);
              this.msg2 = "las contraseñas no coinciden";
              this.ban = true;
            } else {
              this.nuevoUsuarioForm.get('repetirContrasenia').setValidators([Validators.required]);
              this.ban = false;
            }
            this.nuevoUsuarioForm.get('repetirContrasenia').updateValueAndValidity({ emitEvent: false, onlySelf: false });
          }

        }
      );
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "onChanges()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
      //console.log("error asdasd a:" + e.stack);

    }


  }


  activarDesactivarUsuario() {
    console.log('aqui');
    console.log(this.active);
    this.active = !this.active;
    console.log(this.active);

    this.textActive = this.active ? "Activado" : "Desactivado";
    console.log(this.textActive);

  }


  //conecta a la api rest e inserta o actualiza  los campos del usuario
  nuevoUsuario() {
    try {

      this.msg = '';
      this.creandoUsuario = true;



      for (let etiqueta of this.etiquetasColumnas) {

        this.identidad[etiqueta.item] = this.nuevoUsuarioForm.get(etiqueta.item).value;
        console.log("identidad");
        console.log(this.identidad[etiqueta.item]);
      }

      const uploadData = new FormData();

      if (this.usuario == null) {//es un usuario nuevo

        this._genericService.crearUsuario(this.identidad, uploadData).subscribe(
          response => {
            this.respuesta = response;
            if (this.respuesta.length <= 1) {
              this.msg = 'Error en el servidor';
              console.log('Error en el servidor');
            } else {
              //this.msg = this.respuesta.msg;
              console.log(this.respuesta);
              this.creandoUsuario = false;
              if (this.respuesta.status == "Exito") {
                this.enviarMensaje.emit({ mensaje: this.respuesta.msg });
                this.llamarFormulario.emit({ cancel: '1' });
              } else {
                this.msg = this.respuesta.msg;
              }

            }
          },
          error => {
            this.creandoUsuario = false;
            this.msg = 'Error en el servidor';
            console.log('Error en el servidor');
          }

        );
      } else {//{Actualziar usuario

        console.log("Antes de Envio:")
        console.log(this.identidad);
        console.log(this.usuario[this.primaryKey]);

        this.identidad[this.primaryKey] = this.usuario[this.primaryKey];
        console.log(this.primaryKey);

        this._genericService.actualizarUsuario(this.identidad, uploadData).subscribe(
          response => {
            this.respuesta = response;
            if (this.respuesta.length <= 1) {
              this.msg = 'Error en el servidor';
              console.log('Error en el servidor');
            } else {
              //this.msg = this.respuesta.msg;
              this.creandoUsuario = false;
              if (this.respuesta.status != "error") {
                this.enviarMensaje.emit({ mensaje: this.respuesta.msg });
                this.llamarFormulario.emit({ cancel: '1' });
              } else {
                this.msg = this.respuesta.msg;
                console.log(this.msg);
              }
            }
          },
          error => {
            this.creandoUsuario = false;
            this.msg = 'Error en el servidor';
            console.log('Error en el servidor');

          }

        );
      }
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "nuevoUsuario()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
      console.log("error asdasd a:" + e.stack);

    }
    //console.log(this.identidad);

  }


  validarFormulario() {
    try {
      if (this.usuario != null) {//si llega por actualizar
        //this.url = this.url.substring(2);
        this.mensajeBoton = "Actualizar";
        console.log(this.usuario);

      } else {
        this.mensajeBoton = "Guardar";
        //hay que hacer el cambio con otro formulario

      }
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "validarFormulario()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
      //console.log("error asdasd a:" + e.stack);

    }
  }


  enviarExcepcion(mensaje, e, funcion, url) {
    this._exceptionService.capturarExcepcion({ mensaje, url: url, stack: e.stack, funcion: funcion }).subscribe(
      response => {
        if (this.respuesta.length <= 1) {
          //this.mensaje = 'Error en el servidor';
          console.log('Error en el servidor al enviar excepcion');
        } else {
          console.log('La excepcion se envio correctamente');
        }
      },
      error => {
        console.log('Error en el servidor al enviar excepcion');
      }

    );
  }
  closeDialog() {
    this.msg = '';
  }

  consultarUsuarios(update: boolean, element?: any) {
    try {
      //throw new Error('Im errorn');
      this.respuesta = null;
      this._genericService.consultarUsuarios().subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor';
            console.log('Error en el servidor');

          } else {

            this.title = this.respuesta.title[1];
            this.newTitle = update ? this.respuesta.title[1] : this.respuesta.title[0] + " " + this.respuesta.title[1];

            console.log(this.newTitle);

            for (let i = 0; i < this.respuesta.cabeceras.length; i++) {

              if (this.respuesta.cabeceras[i].pk == true) {
                this.primaryKey = this.respuesta.cabeceras[i].nombrecampo;
              }
              if (update) {

                if (this.respuesta.cabeceras[i].update == true) {
                  console.log("update..");
                  this.etiquetasColumnas.push({ etiqueta: this.respuesta.cabeceras[i].nombreetiqueta, item: this.respuesta.cabeceras[i].nombrecampo, type: this.respuesta.cabeceras[i].type, required: this.respuesta.cabeceras[i]["update-required"] });
                }
              }
              else {
                if (this.respuesta.cabeceras[i].create == true) {
                  console.log("create...");
                  this.etiquetasColumnas.push({ etiqueta: this.respuesta.cabeceras[i].nombreetiqueta, item: this.respuesta.cabeceras[i].nombrecampo, type: this.respuesta.cabeceras[i].type, required: this.respuesta.cabeceras[i]["create-required"] });
                }
              }

            }

            let group: any = {};
            this.etiquetasColumnas
            for (let campo of this.etiquetasColumnas) {
              if (update) {
                this.msjAgreEdit = 'Actualizar';
                if (campo.required) {
                  group[campo.item] = new FormControl(element[campo.item], Validators.required);
                }
                else {
                  if (campo.type == 'boolean') {
                    console.log('aqui');
                    this.textActive = element[campo.item] ? 'Activado' : 'Desactivado';
                  }

                  group[campo.item] = new FormControl(element[campo.item]);
                }

              }
              else {
                this.msjAgreEdit = 'Agregar ';
                if (campo.required) {
                  group[campo.item] = new FormControl('', Validators.required);

                }
                else {
                  if (campo.type == 'boolean') {
                    console.log('aqui');

                    group[campo.item] = new FormControl(true);

                  } else {
                    group[campo.item] = new FormControl();

                  }
                }

              }
              //  this.nuevoUsuarioForm.addControl(campo.item,new FormControl(campo.item));
            }
            this.nuevoUsuarioForm = new FormGroup(group);

          }

        },
        error => {
          this.mensaje = 'Error en el servidor';
          this.respuesta = 'error';

          console.log('Error en el servidor');
        }
      );
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "consultarUsuario()"
      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
      //console.log("error asdasd a:" + e.stack);

    }
  }

  ngAfterViewInit() {
    //this.consultarUsuarios();



  }


}
