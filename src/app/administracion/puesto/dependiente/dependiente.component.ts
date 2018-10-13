import { Component, OnInit, Injector } from '@angular/core';
import { AsignaciondependienteService } from 'app/servicios/asignaciondependiente.service';
import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { ExcepcionService } from 'app/servicios/excepcionServices.services';
import { DatosPipe } from 'app/servicios/pipes/pipedatostabla.pipe';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-dependiente',
  templateUrl: './dependiente.component.html',
  styles: [],
  providers: [
    AsignaciondependienteService,
    ExcepcionService,
    DatosPipe
  ]
})
export class DependienteComponent implements OnInit {

  /**
   * Cabeceras de la tabla de dependientes
   */
  cabecerasColumnas: string[] = [
    'identificaciontercero',
    'nombretercero',
    'tipotercero',
    'actions'
  ];

  /**
   * Datos a mostrar en la tabla
   */
  dataSource: MatTableDataSource<any>;

  /**
   * Bandera de existe dependiente
   */
  existeDependiente = false;

  /**
   * Identificador de asignación de puesto
   */
  idAsignacionPuesto: number;

  /**
   * Mensaje de respuesta del servidor
   */
  mensajeRespuestaServidor = '';

  /**
   * clase dinamica pra carga de mensajes
   */
  claseDinamic = 'alert alert-warning alert-with-icon';

  /**
   * Iconono alerta mensaje
   */
  iconAlert = 'warning';

  /**
   * Hint del campo de busqueda al tercero
   */
  hintTercero: string;

  /**
   * Objeto del tercero encontrado en la base de datos
   */
  terceroEncontrado = {
    identificaciontercero: '',
    nombretercero: '',
    tipotercero: '',
    pkidasignaciondependiente: ''
  };

  /**
   * Numero de resolución
   */
  numeroResolucion = '';

  /**
   * Nombre del tercero
   */
  nombreTercero = '';

  /**
   * Cedula
   */
  cedula = '';

  /**
   * Link al documento
   */
  linkDocumento: any;

  /**
   * Archivo a subir
   */
  selectedFile: File = null;

  /**
   * Url de documento
   */
  urlDocumento: any;

  /**
   * Lista de terceros que tiene el puesto
   */
  terceros: any[] = [];

  progreso = false;

  /**
   *
   * @param _asignacionDepService
   */
  constructor(
    private _asignacionDepService: AsignaciondependienteService,
    public activatedRoute: ActivatedRoute,
    private _exceptionService: ExcepcionService,
    private injector: Injector,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      // tslint:disable-next-line:radix
      this.idAsignacionPuesto = parseInt(params['id']);
      this.consultarTerceros(this.idAsignacionPuesto);
    });
  }

  /**
   * Consulta todos los terceros que tiene el puesto
   * @param pId Identificador de la asignación del puesto
   */
  consultarTerceros(pId) {
    this._asignacionDepService.consultarTerceros(pId)
      .subscribe(
        (resp: any) => {
            this.terceros = resp.beneficiario;
            this.dataSource = this.dataSource = new MatTableDataSource<any>(this.terceros);
        }
      );
  }

  /**
   * Consulta un tercero cuando pierda el foco del input
   * @param identificacion cedula del tercero para ser consultado cuando se pierda el foco
   */
  consultarTercero(identificacion) {

    this.hintTercero = 'Consultando tercero ...';
    this.existeDependiente = false;

    this._asignacionDepService.consultarDatosTercero(identificacion)
      .subscribe(
        (resp: any) => {
          if (resp.status === 'error') {
            this.hintTercero = '';
            this.existeDependiente = false;

            this.terceroEncontrado = {
              identificaciontercero: identificacion,
              nombretercero: '',
              tipotercero: 'Dependiente',
              pkidasignaciondependiente: ''
            };
            // swal('Atención', resp.msg + ' Debe crearlo', 'warning');
          } else {
            console.log(resp.tercero[0]);
            this.existeDependiente = true;
            this.terceroEncontrado = resp.tercero[0];
            this.hintTercero = '';
          }
        }
      );
  }

  /**
   * Elimina un dependiente dado el identificador de la asignacion del puesto
   * @param pkid Identificador de la asignación de puesto
   */
  eliminarDependiente(pkid) {
    this.progreso = true;
    this.mensajeRespuestaServidor = '';
    this._asignacionDepService.eliminarDependiente(pkid)
      .subscribe(
        (resp: any) => {
          if (resp.status === 'error') {
            this.mensajeRespuestaServidor = resp.msg;
            this.progreso = false;
            this.mostrarMensaje(2);
            this.consultarTerceros(this.idAsignacionPuesto);
          } else {
            this.mensajeRespuestaServidor = resp.msg;
            this.progreso = false;
            this.mostrarMensaje(1);
            this.consultarTerceros(this.idAsignacionPuesto);
          }
        }
      );
  }

  /**
   * Asigna un dependiente a un puesto
   */
  asignarDependiente() {
    const uploadData = new FormData();

    if (this.selectedFile != null) {
      uploadData.append('fichero_usuario', this.selectedFile, this.selectedFile.name);
    }

    const asignacionDependiente = {
      'numeroresolucionasignaciondependiente': this.numeroResolucion,
      'fkidasignacionpuesto': this.idAsignacionPuesto
    }

    const dependiente = {
      'identificaciontercero': this.terceroEncontrado.identificaciontercero,
      'nombretercero': ((this.existeDependiente) ? this.terceroEncontrado.nombretercero : this.nombreTercero),
      'tipotercero': 'Dependiente'
    }

    this.progreso = true;

    this._asignacionDepService.crearAsignacionDependiente(dependiente, asignacionDependiente, uploadData).subscribe(
      resp => {
        console.log(resp);
        if (resp.status === 'error') {
          this.mensajeRespuestaServidor = resp.status + '. ' + resp.msg;
          this.progreso = false;
          this.mostrarMensaje(2);
          this.consultarTerceros(this.idAsignacionPuesto);
        } else {
          this.mensajeRespuestaServidor = resp.status + '. ' + resp.msg;
          this.progreso = false;
          this.mostrarMensaje(1);
          this.consultarTerceros(this.idAsignacionPuesto);
          this.numeroResolucion = '';
          this.nombreTercero = '';
          this.cedula = '';
          this.selectedFile = null;
          this.linkDocumento = '';
          this.urlDocumento = null;

          this.terceroEncontrado = {
            identificaciontercero: '',
            nombretercero: '',
            tipotercero: 'Dependiente',
            pkidasignaciondependiente: ''
          };
        }
      }
    );
  }

  /**
   * Método de seleccionar archivo
   */
  onFileChanged(event) {
    try {

      if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();
        this.selectedFile = event.target.files[0];
        reader.readAsDataURL(event.target.files[0]); // read file as data url
        if (this.selectedFile !== null) {
          this.urlDocumento = this.selectedFile.name;
        }
        reader.onload = () => { // called once readAsDataURL is completed
          // this.urlDocumento = reader.result;
        }
      }
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      const funcion = 'onFileChanged()';

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
      // console.log("error asdasd a:" + e.stack);

    }
  }

  /**
   * Envia la excepcion
   * @param mensaje
   * @param e
   * @param funcion
   * @param url
   */
  enviarExcepcion(mensaje, e, funcion, url) {
    this._exceptionService.capturarExcepcion({ mensaje, url: url, stack: e.stack, funcion: funcion }).subscribe(
      response => {

        if (response.length <= 1) {
          console.log('Error en el servidor al enviar excepcion');
        } else {
          if (response.status = !'error') {
            console.log('La excepcion se envio correctamente');
          }
        }
      },
      error => {
        console.log('Error en el servidor al enviar excepcion');
      });
  }

  /**
   * Metodo que valida y alterna los mensaje de mostrar el documento de tarifas
   */
  deleteFile() {
    this.selectedFile = null;
    this.linkDocumento = '';
    this.urlDocumento = null;
  }

  /**
   * Muestra el mensaje de confirmación
   * @param codeError Codigo de error
   */
  mostrarMensaje(codeError: number) {
    if (codeError === 0) {
      this.claseDinamic = 'alert alert-warning alert-with-icon';
      this.iconAlert = 'warning';
    } else if (codeError === 1) {
      this.claseDinamic = 'alert alert-success alert-with-icon';
      this.iconAlert = 'done';
    } else if (codeError === 2) {
      this.claseDinamic = 'alert alert-danger alert-with-icon';
      this.iconAlert = 'error';
    }
  }

  /**
   * Navega a la ruta de asignacion de puestos
   */
  volverAsignacionPuesto() {
    this.router.navigate(['administracion/asignacionpuesto']);
  }
}
