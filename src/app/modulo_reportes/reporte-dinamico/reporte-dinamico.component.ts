import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ReportesServices } from '../../servicios/reportedinamicoService.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { ArrayOne } from '../../servicios/pipes/arrayone.pipe';

@Component({
  selector: 'app-reporte-dinamico',
  templateUrl: './reporte-dinamico.component.html',
  styleUrls: ['./reporte-dinamico.component.scss'],
  providers: [ReportesServices, DatePipe, ArrayOne]
})
export class ReporteDinamicoComponent implements OnInit {

  nombrereporte: string;
  //respuesta del servidor
  public respuesta;
  //mensaje de respuesta
  mensaje: string;

  //numero filtro para los 3 casos posirbles
  numerofiltro: number = 0;

  //nombre tabla para el paginador dinamico
  nombretabla: string = '';

  //arreglo de filtros para generar los select y los inputs
  filtros: any[] = [];

  //variable de tipo Date para el picker de fechas
  dateinicial = new FormControl(new Date());
  datefinal = new FormControl(new Date());
  fkidplaza = new FormControl();
  fkidsector = new FormControl();
  fkidpuerta = new FormControl();
  fkidtipovehiculo = new FormControl();
  fkidespecieanimal = new FormControl();
  fkidcategoriaanimal = new FormControl();
  fkidtipoanimal = new FormControl();

  //variables para llenar las consultas de los selects;
  consultas: any = {};

  //Formulario reactive para enviar de filtros al backend
  formDatos: FormGroup = new FormGroup({
    default: new FormControl()
  });

  //ruta dinamica para consultar los datos
  public route = '';

  //plazas de mercado
  plazas: any[] = [];

  //sectores
  sectores: any[] = [];
  // puertas
  puertas: any[] = [];
  // puertas
  tiposvehiculo: any[] = [];
  // puertas
  especieanimal: any[] = [];

  /**-----Variables para la tabla -----*/

  //datos de la tabla
  datostabla: any[] = [];

  //cabeceras columnas
  cabeceras: any[] = [];

  //data source para la tabla 
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //variable para mostrar/ocultar tabla
  mostrartabla: boolean = false;

  //para mostrar solo las cabeceras
  cabecerasColumnas: string[] = [];

  //para mostrar el msj de datos vacios tabla
  datosvacios: boolean = false;
  //para bloquear los botones de generar excel y pdf hasta que carguen los datos
  bloqueo: boolean = true;

  //variables para controlar la tabla dinamicamente desde la respuesta del backend
  itemsporpagina: number = 10;
  totalitems: number = 0;
  paginaactual: number = 1;
  totalpaginas: number = 0;



  constructor(private _reporteService: ReportesServices, private datePipe: DatePipe, private router: Router) {
    this.route = this.router.url.substring(15);
  }

  

  ngOnInit() {
    this.consultarDatos();
    this.consultarTiposvehiculo();
    this.consultarDatosSelect("plaza");
    this.consultarDatosSelect("categoriaanimal");
    this.consultarDatosSelect("tipoanimal");



    if (this.filtros.length != 0) {

    }
  }

  closeDialog() {
    this.datosvacios = false;
  }

  /**
   * metodo que consulta los filtros para armar los select y los inputs
   */
  consultarTiposvehiculo() {
    this._reporteService.consultarTiposVehiculo().subscribe(
      response => {
        if (response.length < 1) {
          this.mensaje = 'Error en el servidor';
        } else {
          this.tiposvehiculo = response.tipovehiculo;

        }

      }, error => {
        console.log(error);
      }
    );
  }

  /**
   * metodo que consulta los filtros para armar los select y los inputs
   */
  consultarDatos() {
    this._reporteService.consultarCampos().subscribe(
      response => {
        this.respuesta = response;
        if (this.respuesta.length <= 1) {
          this.mensaje = 'Error en el servidor';
          console.log('Error en el servidor');
        } else {
          //console.log(this.respuesta);
          this.nombrereporte = this.respuesta.title;
          if (this.respuesta.filtros != null) {
            this.filtros = this.respuesta.filtros;
            this.consultarDatosSelect("plaza");
          }
          this.numerofiltro = this.respuesta.numerofiltro;
          this.nombretabla = this.respuesta.nombretabla;
          //this.generarReportePaginado();

          /*
          this.filtros.map((filtro) => {
            if (filtro.tipofiltro == 'select') {//solo si es de tipo select hacemos consulta pasando el nombre de la tabla
              this.consultarDatosSelect(filtro.nombretabla);
            }

          });*/

          this.validarFormulario();
          //console.log(this.consultas);


        }

      },
      error => {
        this.mensaje = 'Error en el servidor al consultar el reporte';
        console.log('Error en el servidor');

      }
    );

  }

  /**
   * 
   * @param nombretabla variable que determina la tabla a la cual hacer la consulta
   */
  consultarDatosSelect(nombretabla) {
    this._reporteService.consultarCamposSelect(nombretabla).subscribe(
      response => {
        let respuesta = response;
        if (respuesta.length <= 1) {
          this.mensaje = 'Error en el servidor';
          console.log('Error en el servidor');
        } else {
          //console.log(respuesta[nombretabla]);
          this.consultas[nombretabla] = (respuesta[nombretabla]);//guardamos el arreglo en otro arreglo
          console.log(this.consultas[nombretabla]);

        }

      },
      error => {
        this.mensaje = 'Error en el servidor';
        console.log('Error en el servidor');
        this.respuesta = null;
      }

    );
  }

  /**
   * Metodo que inicia los datos del formulario
   */
  group: any = {

  };
  validarFormulario() {
    //group["fkidplaza"] = new FormControl('');
    for (let campo of this.filtros) {
      this.group[campo.nombreatributo] = new FormControl();
    }
    this.formDatos = new FormGroup(this.group);
  }

  clearInput(nombreatributo: string) {
    this.formDatos.get(nombreatributo).setValue('');
  }

  //varible para obtener los datos de la consulta despues de enviar el json de filtros
  public datos: any = {};

  //MEtodo que consulta a la bd los datos con filtros para luego mostrarlos en la tabla y las cabeceras pàra armar la tabla dinamicamente
  generarReporte() {
    this.datosvacios = false;
    this.bloqueo = true;

    console.log(this.dateinicial.value);
    console.log(this.datefinal.value);
    this.datos = {};
    this.cabecerasColumnas = [];
    for (let dato of this.filtros) {
      if (this.formDatos.get(dato.nombreatributo).value != null) {
        //llenado de datos en un array de json, como clave el valor del atributo
        this.datos[dato.nombreatributo] = this.formDatos.get(dato.nombreatributo).value;
      }
    }
    //opciones
    if (this.fkidplaza.value != '' && this.fkidplaza.value != null) this.datos['fkidplaza'] = this.fkidplaza.value;
    if (this.fkidsector.value != '' && this.fkidsector.value != null) this.datos['fkidsector'] = this.fkidsector.value;
    this.datos['fechainicio'] = this.datePipe.transform(this.dateinicial.value, 'yyyy-MM-dd');
    this.datos['fechafin'] = this.datePipe.transform(this.datefinal.value, 'yyyy-MM-dd');
    console.log(this.datos);

    //reinicio de la variable datos tabla
    this.datostabla = [];
    //enviamos el json y recibimos la respuesta
    this._reporteService.consultarDatosTablaConFiltros(this.datos).subscribe(
      response => {
        this.respuesta = response;
        if (this.respuesta.length <= 1) {
          this.mensaje = 'Error en el servidor';
          console.log('Error en el servidor');
        } else {
          //console.log(this.respuesta[nombretabla]);
          //llenado de cabeceras y los datos de la tabla
          this.cabeceras = this.respuesta.cabeceras;
          this.datostabla = this.respuesta[this.route.substring(1)];

          console.log(this.datostabla);
          console.log(this.cabeceras);

          this.cabeceras.map((dato) => {
            this.cabecerasColumnas.push(dato.nombrecampo);//llenado de las cabeceras para las columnas
          });
          this.datosvacios = this.datostabla.length == 0 ? true : false;
          this.bloqueo = this.datostabla.length != 0 ? false : true;

          this.dataSource = new MatTableDataSource(this.datostabla);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.mostrartabla = true;


        }

      },
      error => {
        this.mensaje = 'Error en el servidor al generar el reporte';
        console.log('Error en el servidor');
        this.respuesta = null;
      }
    );

  }

  /**
   * Metodo que genera el reporte de la tabla paginado dinamicamente
   */
  generarReportePaginado(page) {
    //this._route.params.forEach((paramms: Params) => {
    //let page = +paramms['page'];

    if (page == 0) {
      page = 1;
      this.datosvacios = false;
      this.bloqueo = true;
    }

    console.log(this.dateinicial.value);
    console.log(this.datefinal.value);
    this.datos = {};
    this.cabecerasColumnas = [];
    for (let dato of this.filtros) {
      if (this.formDatos.get(dato.nombreatributo).value != null) {
        //llenado de datos en un array de json, como clave el valor del atributo
        this.datos[dato.nombreatributo] = this.formDatos.get(dato.nombreatributo).value;
      }
    }
    //opciones
    if (this.fkidplaza.value != '' && this.fkidplaza.value != null) this.datos['fkidplaza'] = this.fkidplaza.value;
    if (this.fkidsector.value != '' && this.fkidsector.value != null) this.datos['fkidsector'] = this.fkidsector.value;
    if (this.fkidtipovehiculo.value != '' && this.fkidtipovehiculo.value != null) this.datos['fkidtipovehiculo'] = this.fkidtipovehiculo.value;
    if (this.fkidpuerta.value != '' && this.fkidpuerta.value != null) this.datos['fkidpuerta'] = this.fkidpuerta.value;
    if (this.fkidespecieanimal.value != '' && this.fkidespecieanimal.value != null) this.datos['fkidespecieanimal'] = this.fkidespecieanimal.value;
    if (this.fkidcategoriaanimal.value != '' && this.fkidcategoriaanimal.value != null) this.datos['fkidcategoriaanimal'] = this.fkidcategoriaanimal.value;
    if (this.fkidtipoanimal.value != '' && this.fkidtipoanimal.value != null) this.datos['fkidtipoanimal'] = this.fkidtipoanimal.value;
    this.datos['fechainicio'] = this.datePipe.transform(this.dateinicial.value, 'yyyy-MM-dd');
    this.datos['fechafin'] = this.datePipe.transform(this.datefinal.value, 'yyyy-MM-dd');
    //console.log(this.datos);

    //reinicio de la variable datos tabla
    this.datostabla = [];
    this.dataSource = [];

    //enviamos el json y recibimos la respuesta

    this._reporteService.consultarDatosPaginadosConFiltros(page, this.datos, this.nombretabla)
      .subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.status == 'Exito') {

            //console.log(response.datos);
            this.cabeceras = this.respuesta.cabeceras;
            this.datostabla = this.respuesta.datos;

            console.log(this.datostabla);
            console.log(this.cabeceras);

            this.cabeceras.map((dato) => {
              this.cabecerasColumnas.push(dato.nombrecampo);//llenado de las cabeceras para las columnas
            });

            this.itemsporpagina = response.item_per_page;
            this.totalitems = response.total_items_count;
            this.totalpaginas = response.total_pages;
            this.paginaactual = response.page_actual;

            console.log(this.paginaactual);
            this.datosvacios = this.datostabla.length == 0 ? true : false;
            this.bloqueo = this.datostabla.length != 0 ? false : true;

            this.dataSource = new MatTableDataSource(this.datostabla);
            this.dataSource.sort = this.sort;
            this.mostrartabla = true;

          }
        },
        error => {
          console.log(<any>error);
          this.mensaje = 'Error en el servidor al generar el reporte, intentelo nuevamente';
        }
      );
    //});
  }

  changePage(event) {
    const pagina = (event.pageIndex + 1);//capturamos el indice de la pagina y se suma +1 porque el indice comienza en 0
    console.log("hola pagina: " + pagina);
    this.generarReportePaginado(pagina);
    //this.router.navigate([GLOBAL.urlBase + this.route,pagina ]);
  }

  /**
   * 
   * @param fkidplaza id de la plaza para consultar sectores
   * MEtodo que consulta sectores para el caso numerofiltro (2)
   */
  consultarSectores(fkidplaza) {
    console.log(fkidplaza);
    //reinicio de variables
    this.sectores = [];
    this.fkidsector = new FormControl();
    this.fkidtipovehiculo = new FormControl();
    if (fkidplaza != '') {

      this._reporteService.consultarSectoresPorPlaza(fkidplaza).subscribe(
        response => {
          let respuesta = response;
          if (respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor';
            console.log('Error en el servidor');
          } else {
            //console.log(respuesta[nombretabla]);
            this.sectores = respuesta.sector;
          }

        },
        error => {
          this.mensaje = 'Error en el servidor al consultar sectores, intentelo nuevamente';
          console.log('Error en el servidor');
        }

      );
    }


  }
  /**
   * 
   * @param fkidtipoanimal id del tipo de animal para obtener las epecies relacianadasa este tipo
   * MEtodo que consulta sectores para el caso numerofiltro (5)
   */
  consultarEspecieAnimal(fkidtipoanimal) {
    console.log(fkidtipoanimal);
    //reinicio de variables
    this.especieanimal = [];
    this.fkidcategoriaanimal = new FormControl();
    if (fkidtipoanimal != '') {

      this._reporteService.consultarEspecieAnimalPorTipo(fkidtipoanimal).subscribe(
        response => {
          let respuesta = response;
          if (respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor';
            console.log('Error en el servidor');
          } else {
            //console.log(respuesta[nombretabla]);
            this.especieanimal = respuesta.especieanimal;
            console.log(`${response} -> esta es la respuesta`)
          }

        },
        error => {
          this.mensaje = 'Error en el servidor al consultar sectores, intentelo nuevamente';
          console.log('Error en el servidor');
        }

      );
    }


  }
  /**
   * 
   * @param fkidplaza id de la plaza para consultar Puertas de la plaza
   * MEtodo que consulta sectores para el caso numerofiltro (4)
   */
  consultarPuertas(fkidplaza) {
    console.log(fkidplaza);
    //reinicio de variables
    this.puertas = [];
    this.fkidpuerta = new FormControl();
    if (fkidplaza != '') {

      this._reporteService.consultarPuertasPorPlaza(fkidplaza).subscribe(
        response => {
          let respuesta = response;
          if (respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor';
            console.log('Error en el servidor');
          } else {
            //console.log(respuesta[nombretabla]);
            this.puertas = respuesta.puerta;
          }

        },
        error => {
          this.mensaje = 'Error en el servidor al consultar sectores, intentelo nuevamente';
          console.log('Error en el servidor');
        }

      );
    }


  }

  //metodo que llama al metodo de generar un pdf con los parametros de filtros
  generarPDF() {
    this._reporteService.generarPDF(this.datos).subscribe(
      response => {
        if (response.size <= 59) {
          this.mensaje = 'No se pudo generar el pdf correctamente, intente nuevamente'
        } else {
          console.log(response);
          var fileURL = URL.createObjectURL(response);
          window.open(fileURL);
        }

      },
      error => {
        this.mensaje = 'Error en el servidor al generar el PDF, intentelo nuevamente';
        console.log('Error en el servidor');
      }
    );
  }

  generarEXCEL() {
    this._reporteService.generarExcel(this.datos).subscribe(
      response => {
        if (response.size <= 59) {
          this.mensaje = 'No se pudo generar el Excel correctamente, intente nuevamente'
        } else {
          console.log(response);
          var fileURL = URL.createObjectURL(response);
          window.open(fileURL);
        }

      },
      error => {
        this.mensaje = 'Error en el servidor al generar el Excel, intentelo nuevamente';
        console.log('Error en el servidor');
      }
    );
  }

}
