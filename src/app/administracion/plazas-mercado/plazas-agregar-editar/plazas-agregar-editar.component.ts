import { Component, OnInit, Input, Output, EventEmitter, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { PlazaMercado } from '../../../modelos/plaza-mercado';
import { PlazaServices } from '../../../servicios/plazaServices.services';
import { TipoRecaudoServices } from '../../../servicios/tipos-services/tiporecaudoServices.services';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { ExcepcionService } from '../../../servicios/excepcionServices.services';
import { TipoRecaudo } from '../../../modelos/tipos/tiporecaudo';
import { plainToClass } from 'class-transformer';

@Component({
  selector: 'app-plazas-agregar-editar',
  templateUrl: './plazas-agregar-editar.component.html',
  styleUrls: ['./plazas-agregar-editar.component.scss'],
  providers: [PlazaServices, TipoRecaudoServices, ExcepcionService]
})
export class PlazasAgregarEditarComponent implements OnInit {

  //formulario reactive
  nuevoPlazaForm: FormGroup;

  //Objeto de tipo usuario
  public identidad: PlazaMercado;

  //para mostrar el formulario de usuario
  nPlaza = true;

  //actvar Plaza, desactivar Plaza
  active = true;
  textActive = "Activado";


  //respuesta del servidor
  public respuesta;

  //mensaje dialog error creacion de Plaza
  msg: string = '';


  //traemos el Plaza desde el componente tabla Plaza
  @Input() plaza: PlazaMercado;

  //enviar mensaje y alternar entre formualrios
  @Output() llamarPlaza = new EventEmitter();

  //mensaje del boton actulizar guardar
  mensajeBoton: string;


  //progress de envio
  creandoplaza = false;

  //objeto para tiposRecaudo
  tiporecaudos: TipoRecaudo[];

  //MEnsaje para mostrar si es nuevo o actualziar;
  msjAgregarEditar = 'Agregar una nueva plaza de mercado' ;

  constructor(private nuevoForm: FormBuilder,
    private _tiporecaudoServices: TipoRecaudoServices, private injector: Injector, private _exceptionService: ExcepcionService, private _plazaServices: PlazaServices) { }

  ngOnInit() {
    console.log(this.plaza);
    this.consultarTipoRecaduo();
    this.validarFormulario();
    this.identidad = new PlazaMercado();
  }


  nuevaPlaza() {
    try {
      this.creandoplaza = true;
      //seteamos en el objeto rol las variables del formulario
      this.identidad.setCodigoplaza((this.nuevoPlazaForm.get('codigoplaza').value).toString().trim());
      this.identidad.setNombreplaza((this.nuevoPlazaForm.get('nombreplaza').value).toString().trim());
      this.identidad.setPlazaactivo(this.active);
      let arrTipoReca = (this.nuevoPlazaForm.get('pkidtiporecaudo').value);
      //console.log(arrTipoReca);
      let newArrTipo = [];
      for(let i=0; i<arrTipoReca.length;i++){
        let id=i;
        let idtipo= arrTipoReca[i];
        newArrTipo.push('"' + id + '"' + ':' + '"' + idtipo + '"');
      }
     
      console.log(newArrTipo);
      
      if (this.plaza == null) {//significa que esta entrando por un nueva plaza
        this._plazaServices.crearPlaza(this.identidad, newArrTipo).subscribe(
          response => {
            this.respuesta = response;
            if (this.respuesta.length <= 1) {
              this.msg = 'Error en el servidor';
              console.log('Error en el servidor');
            } else {
              //this.msg = this.respuesta.msg;
              this.creandoplaza = false;
              if (this.respuesta.status == "Exito") {
                this.llamarPlaza.emit({ cancel: '1', mensaje: this.respuesta.msg, status:this.respuesta.status });
              } else {
                this.msg = this.respuesta.msg;
              }

            }
          },
          error => {
            this.msg = 'Error en el servidor al crear una plaza, intentelo nuevamente';
            console.log('Error en el servidor'+ error);
          }

        );


      } else {//es en caso que entra por actualizar
        this.identidad.setPkidplaza(this.plaza.getPkidplaza());
        this._plazaServices.actualizarPlaza(this.identidad,newArrTipo,this.valueSelect).subscribe(
          response => {
            this.respuesta = response;
            if (this.respuesta.length <= 1) {
              this.msg = 'Error en el servidor';
              console.log('Error en el servidor');
            } else {
              //this.msg = this.respuesta.msg;
              this.creandoplaza = false;
              if (this.respuesta.status == "Exito") {
                this.llamarPlaza.emit({  cancel: '1' ,mensaje: this.respuesta.msg,status:this.respuesta.status });
              }else{
                this.msg = this.respuesta.msg;
              }
            }
          },
          error => {
            this.msg = 'Error en el servidor al actualizar una plaza, intentelo nuevamente';
            console.log('Error en el servidor'+ error);
          }
        );

      }
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "nuevaPlaza()"
      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
      //console.log("error asdasd a:" + e.stack);
    }
  }


  valueSelect = [];
  validarFormulario() {
    try {
      let tiporReca: TipoRecaudo[];
      this.valueSelect = [];
      this.seleccionados = [];
      if (this.plaza != null) {//si llega por actualizar
        this.active = this.plaza.getPlazaactivo();
        this.textActive = this.active ? "Activado" : "Desactivado";
        this.mensajeBoton = "Actualizar";
        this.msjAgregarEditar = 'Actualizar la plaza de mercado'
        //convierte el parametro en array para poder acceder
        tiporReca = (this.plaza.getTiporecaudo());
       
        tiporReca.map((tipo)=>{
          this.seleccionados.push(tipo.nombretiporecaudo);
          this.valueSelect.push(tipo.pkidtiporecaudo);
        });
        console.log(tiporReca);
        

      } else {
        this.msjAgregarEditar ='Agregar una nueva plaza de mercado';
        this.mensajeBoton = "Guardar";
      }

      this.nuevoPlazaForm = this.nuevoForm.group({
        codigoplaza: [this.plaza != null ? this.plaza.getCodigoplaza() : ''],
        nombreplaza: [this.plaza != null ? this.plaza.getNombreplaza() : '', Validators.required],
        pkidtiporecaudo: [this.plaza != null ? this.valueSelect : '', Validators.required]
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

  //consultar los tipos de recaudo y mostrarlo en el select
  consultarTipoRecaduo() {
    try {

      this._tiporecaudoServices.consultarTipoRecaudo().subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.msg = 'Error en el servidor al consultar los permisos';
            console.log('Error en el servidor al consultar los permisos');
          } else {
            this.tiporecaudos = plainToClass(TipoRecaudo, this.respuesta.tiporecaudo)//recupero los tipos de recuado
            //console.log(this.tiporecaudos);

            //console.log(this.permisos[1].getIcono().length);
          }

        },
        error => {
          this.msg = 'Error en el servidor al consultar los tipos de recaudo';
          console.log('Error en el servidor al consultar los permisos(tabla modulos)');
        }

      );
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "constultarTipoRecaudo()"
      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
      //console.log("error asdasd a:" + e.stack);
    }

  }


  activarDesactivarPlaza() {
    this.active = !this.active;
    this.textActive = this.active ? "Activado" : "Desactivado";
  }


  //metodo que muestra los seleccionados
  seleccionados: string[]=[];
  onChangePermisos(event) {
    this.seleccionados = [];
    let tiposSelected = event.value;
    this.tiporecaudos.map((tipo)=>{
      tiposSelected.map((selec)=>{
        if(selec==tipo.getPkidtiporecaudo()){
          this.seleccionados.push(tipo.getNombretiporecaudo());
        }
      });
    });
    //this.seleccionados = event.value;
    //console.log(this.seleccionados);
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
