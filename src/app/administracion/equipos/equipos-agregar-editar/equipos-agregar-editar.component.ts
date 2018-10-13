import { Component, OnInit, Input, Output, EventEmitter, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { ExcepcionService } from '../../../servicios/excepcionServices.services';
import { EquipoService } from '../../../servicios/equipoService.service';
import { UsuarioServices } from '../../../servicios/usuarioServices.services';
import { EquiposInterface } from '../equipos.component';
import { Usuario } from '../../../modelos/usuario';
import { plainToClass } from 'class-transformer';

@Component({
  selector: 'app-equipos-agregar-editar',
  templateUrl: './equipos-agregar-editar.component.html',
  styleUrls: ['./equipos-agregar-editar.component.scss'],
  providers: [ExcepcionService, EquipoService, UsuarioServices]
})
export class EquiposAgregarEditarComponent implements OnInit {
   //formulario reactive
   nuevoEquipoForm: FormGroup;

   //Objeto de tipo 
   public identidad: EquiposInterface;
 
   //para mostrar el formulario
   nEquipo = true;
 
   //actvar Equipo, desactivar Equipo
   active = true;
   textActive = "Activado";
 
 
   //respuesta del servidor
   public respuesta;
 
   //mensaje dialog error creacion de Equipo
   msg: string = '';
 
 
   //traemos el Equipo desde el componente tabla Equipo
   @Input() equipo: EquiposInterface;
 
   //enviar mensaje y alternar entre formualrios
   @Output() llamarEquipo = new EventEmitter();
 
   //mensaje del boton actulizar guardar
   mensajeBoton: string;
 
 
   //progress de envio
   creandoequipo = false;
 
   //objeto para tiposRecaudo
   usuarios: Usuario[];

   //usuario seleccionado
   userSelect;

   //MEnsaje para mostrar si es nuevo o actualziar;
   msjAgregarEditar = 'Agregar un nuevo Equipo' ;


  constructor(
    private nuevoForm: FormBuilder,
    private injector: Injector,
    private _exceptionService: ExcepcionService,
    private _userService: UsuarioServices,
    private _equipoService: EquipoService
  ) { }

  ngOnInit() {
    this.consultarUsuarios();
    this.validarFormulario();
    this.identidad = {
      codigoequipo:'',descripcionequipo:'',equipoactivo:false,identificacion:null,identificacionequipo:'',nombrequipo:'',nombreusuario:'',pkidequipo:null,fkidusuario:null
    };
  }


  nuevoEquipo() {
    try {
      this.creandoequipo = true;
      //seteamos en el objeto rol las variables del formulario
      this.identidad.codigoequipo=(this.nuevoEquipoForm.get('codigoequipo').value).toString().trim();
      this.identidad.nombrequipo=(this.nuevoEquipoForm.get('nombrequipo').value).toString().trim();
      this.identidad.descripcionequipo = (this.nuevoEquipoForm.get('descripcionequipo').value).toString().trim();
      this.identidad.identificacionequipo = (this.nuevoEquipoForm.get('identificacionequipo').value).toString().trim();
      this.identidad.fkidusuario = (this.nuevoEquipoForm.get('pkidusuario').value).toString().trim();
      this.identidad.equipoactivo=(this.active);
     
      
      if (this.equipo == null) {//significa que esta entrando por un nueva equipo
        this._equipoService.crearEquipo(this.identidad,null).subscribe(
          response => {
            this.respuesta = response;
            if (this.respuesta.length <= 1) {
              this.msg = 'Error en el servidor';
              console.log('Error en el servidor');
            } else {
              //this.msg = this.respuesta.msg;
              this.creandoequipo = false;
              if (this.respuesta.status == "Exito") {
                this.llamarEquipo.emit({ cancel: '1', mensaje: this.respuesta.msg, status: this.respuesta.status });
              } else {
                this.msg = this.respuesta.msg;
              }

            }
          },
          error => {
            this.msg = 'Error en el servidor al agregar un nuevo equipo, intentelo nuevamente';
            console.log('Error en el servidor'+ error);
          }

        );


      } else {//es en caso que entra por actualizar
        this.identidad.pkidequipo = this.equipo.pkidequipo;
        this._equipoService.actualizarEquipo(this.identidad).subscribe(
          response => {
            this.respuesta = response;
            if (this.respuesta.length <= 1) {
              this.msg = 'Error en el servidor';
              console.log('Error en el servidor');
            } else {
              //this.msg = this.respuesta.msg;
              this.creandoequipo = false;
              if (this.respuesta.status == "Exito") {
                this.llamarEquipo.emit({  cancel: '1' ,mensaje: this.respuesta.msg,status: this.respuesta.status });
              }else{
                this.msg = this.respuesta.msg;
              }
            }
          },
          error => {
            this.msg = 'Error en el servidor al actualizar un nuevo equipo, intentelo nuevamente';
            console.log('Error en el servidor'+ error);
          }
        );

      }
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "nuevoEquipo()"
      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
      //console.log("error asdasd a:" + e.stack);
    }
  }


  /**
   * metodo que consulta los usuarios para listarlos en el select
   */
  consultarUsuarios(){
    try {
      this.usuarios = [];
      this._userService.consultarUsuarios().subscribe(
        response=>{

         this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.msg = 'Error en el servidor al consultar los usuarios';
            console.log('Error en el servidor al consultar los usuarios');
          } else {
            this.usuarios = plainToClass(Usuario, this.respuesta.users)//recupero los tipos de recuado
            //console.log(this.tiporecaudos);

            //console.log(this.usuarios[1].getIcono().length);
          }

        },
        error => {
          this.msg = 'Error en el servidor al consultar los usuarios';
          console.log('Error en el servidor al consultar los usuarios(tabla modulos)');
        }
      );

    }catch(e){
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "consultarUsuarios()"
      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
      //console.log("error asdasd a:" + e.stack);
    }
  }

  validarFormulario(){
    try {
      this.userSelect = null;
      if (this.equipo != null) {//si llega por actualizar
        this.active = this.equipo.equipoactivo;
        this.textActive = this.active ? "Activado" : "Desactivado";
        this.mensajeBoton = "Actualizar";
        this.msjAgregarEditar = 'Actualizar el equipo';
        
      } else {
        
        this.msjAgregarEditar = 'Agregar un nuevo Equipo';
        this.mensajeBoton = "Guardar";
      }

      this.nuevoEquipoForm = this.nuevoForm.group({
        codigoequipo: [this.equipo != null ? this.equipo.codigoequipo : ''],
        nombrequipo: [this.equipo != null ? this.equipo.nombrequipo : '', Validators.required],
        descripcionequipo: [this.equipo != null ? this.equipo.descripcionequipo : ''],
        identificacionequipo: [this.equipo != null ? this.equipo.identificacionequipo : '',Validators.required],
        pkidusuario: [this.equipo != null ? this.equipo.fkidusuario : '', Validators.required]
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

  
  activarDesactivarequipo() {
    this.active = !this.active;
    this.textActive = this.active ? "Activado" : "Desactivado";
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
