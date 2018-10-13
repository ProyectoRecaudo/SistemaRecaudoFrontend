import { Component, OnInit } from "@angular/core";
import { UsuarioServices } from "../../servicios/usuarioServices.services";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { RecaudoServices } from "../../servicios/recaudoService.service";
import { Router, NavigationEnd } from "@angular/router";

declare const $: any;
@Component({
  selector: 'app-recaudo-pesaje',
  templateUrl: './recaudo-pesaje.component.html',
  styleUrls: ['./recaudo-pesaje.component.scss'],
  providers: [UsuarioServices, RecaudoServices]
})
export class RecaudoPesajeComponent implements OnInit {

  //variables para ocultar, mostrar tabla
  mostrarForm: boolean = true;

  //variable para mostrar la interfaz de historico 
  mostrarHistorico : boolean = true;

  //n° de recibo actual del usuario
  nrecibo: number = 0;

  //formulario para crear el recibo
  nuevoReciboForm: FormGroup;

  //variables para llenar las consultas de los selects;
  consultas: any = {};


  //clase dinamica pra carga de mensajes
  claseDinamic = "alert alert-warning alert-with-icon";
  iconAlert = "warning";

  //mensaje de error / exito para la creacion de el recibo
  mensajecreacion: String = '';

  //mensaje de error en caso que no se puedan consultar algunos datos
  mensajedatos: string = '';

  //informacion del tercero
  tercero: TerceroInterface;

  //mensaje del hint del tercero
  msjhinttercero: string = 'Busque por la cedula del tercero';

  //mensaje del hint tarifa
  msjhinttarifa: string = 'Seleccione la plaza para obtener la tarifa';

  //mensaje del hhint para la especie animal
  msjhintespecie: string = 'Seleccione Tipo animal para consultar la especie de animal';
  //variable que tiene los valores texualtes de dinero
  textovalor: string = '';

  //datos para enviar al servidor de inserción 
  datos: any = {};

  //datos para enviar al modal
  datosmodal: any[] = [];

  //variable para el progreso de guardado
  creandorecibo = false;

  navigationSubscription;

  ngOnInit() {
    this.inicarFormulario();
    this.consultarDatosSelect('plaza');
    this.consultarDatosSelect('tipoanimal');
    this.consultarDatosSelect('categoriaanimal');
  }

  constructor(private _userServices: UsuarioServices, private nuevoForm: FormBuilder, private _recaudoServices: RecaudoServices,private router: Router) {

    this.iniciarTercero();
    this.recargarComponente();

  }

  recargarComponente() {
    this.navigationSubscription = this.router.events.subscribe(
      (e: any) => {
        if (e instanceof NavigationEnd) {
          console.log('recargando componente');
          this.mostrarForm = true;
          this.mostrarHistorico= true;
        }
      }
    )
  }

  iniciarTercero() {
    this.tercero = {
      identificaciontercero: '', nombretercero: '', pkidtercero: null, telefonotercero: '', tipotercero: 'Eventual'
    }
  }

  //inicializacion del formulario
  inicarFormulario() {
    this.nrecibo = this._userServices.getIdentity().numerorecibo;
    this.nuevoReciboForm = this.nuevoForm.group({
      numerorecibopesaje: [this.nrecibo, Validators.required],
      valorrecibopesaje: ['', Validators.required],
      pesoanimal: ['', Validators.required],
      identificacionterceropesaje: [null, Validators.required],
      nombreterceropesaje: ['', Validators.required],
      valortarifa: ['', Validators.required],
      fkidplaza: ['', Validators.required],
      fkidtipoanimal: ['', Validators.required],
      fkidespecieanimal: ['', Validators.required],
      fkidcategoriaanimal: ['', Validators.required]
    });
  }


  /**
  * 
  * @param nombretabla variable que determina la tabla a la cual hacer la consulta
  */
  consultarDatosSelect(nombretabla) {
    this.mensajedatos = '';//reiniciamos la variable del mensaje de error
    this._recaudoServices.consultarCamposSelect(nombretabla).subscribe(
      response => {
        let respuesta = response;
        if (respuesta.length <= 1) {
          this.mensajedatos = 'Error al consultar los datos del select, por favor intentelo nuevamente';
          console.log('Error al consultar los datos del select, por favor intentelo nuevamente');
        } else {
          //console.log(respuesta[nombretabla]);
          if (respuesta.status != 'error') {
            this.consultas[nombretabla] = (respuesta[nombretabla]);//guardamos el arreglo en otro arreglo
            //console.log(this.consultas[nombretabla]);
          } else {
            this.mensajedatos = respuesta.msg;//muestra el mensaje de error
          }

        }

      },
      error => {
        this.mensajedatos = 'Error al consultar los datos del select, por favor intentelo nuevamente';
        console.log('Error al consultar los datos del select, por favor intentelo nuevamente');
        //this.respuesta = null;
      }

    );
  }

  /**
   * 
   * @param valor valor ingresado por el input para ser convertido en letras
   */
  conversionTextual(valor) {
    this.textovalor = valor == '' ? '' : ValidacionTexto.numeroALetras(valor, 0)
  }

  /**
   * MEtodo que guarda el recibo en la base de datos
   */
  guardarRecibo() {
    //Variable para definir el objeto que se enviara al backend
    const nombreplaza = this.consultarNombres('plaza', this.nuevoReciboForm.get('fkidplaza').value);
    const nombrecategoriaanimal = this.consultarNombres('categoriaanimal', this.nuevoReciboForm.get('fkidcategoriaanimal').value);
    const nombretipoanimal = this.consultarNombres('tipoanimal', this.nuevoReciboForm.get('fkidtipoanimal').value);
    const nombreespecieanimal = this.consultarNombres('especieanimal', this.nuevoReciboForm.get('fkidespecieanimal').value);

    const recibopesaje =
    {
      numerorecibopesaje: this.nuevoReciboForm.get('numerorecibopesaje').value,
      valorecibopesaje: this.nuevoReciboForm.get('valorrecibopesaje').value,
      pesoanimal: this.nuevoReciboForm.get('pesoanimal').value,
      identificacionterceropesaje: this.nuevoReciboForm.get('identificacionterceropesaje').value,
      nombreterceropesaje: this.nuevoReciboForm.get('nombreterceropesaje').value,
      valortarifa: this.nuevoReciboForm.get('valortarifa').value,
      nombreplaza: nombreplaza,
      nombrecategoriaanimal: nombrecategoriaanimal,
      nombretipoanimal: nombretipoanimal,
      nombreespecieanimal: nombreespecieanimal,
      identificacionrecaudador: this._userServices.getIdentity().identificacion,
      nombrerecaudador: this._userServices.getIdentity().name,
      apellidorecaudador: this._userServices.getIdentity().surname,
      recibopesajeactivo: true,
      fkidtarifapesaje: this.tarifa.pkidtarifapesaje,
      fkidplaza: this.nuevoReciboForm.get('fkidplaza').value,
      fkidcategoriaanimal: this.nuevoReciboForm.get('fkidcategoriaanimal').value,
      fkidtipoanimal: this.nuevoReciboForm.get('fkidtipoanimal').value,
      fkidespecieanimal: this.nuevoReciboForm.get('fkidespecieanimal').value,
      fkidusuariorecaudador: this._userServices.getIdentity().sub,
    }




    this.datosmodal = [
      { e: 'Nº Recibo: ', v: recibopesaje.numerorecibopesaje },
      { e: 'Valor Recibo: ', v: this.convertirPesosColombia(recibopesaje.valorecibopesaje) },
      { e: 'Peso animal: ', v: recibopesaje.pesoanimal },
      { e: 'Identificación tercero: ', v: recibopesaje.identificacionterceropesaje },
      { e: 'Nombre tercero: ', v: recibopesaje.nombreterceropesaje },
      { e: 'Valor Tarifa: ', v: this.convertirPesosColombia(recibopesaje.valortarifa) },
      { e: 'Plaza: ', v: recibopesaje.nombreplaza },
      { e: 'Categoria animal: ', v: recibopesaje.nombrecategoriaanimal },
      { e: 'Tipo animal: ', v: recibopesaje.nombretipoanimal },
      { e: 'Especie animal: ', v: recibopesaje.nombreespecieanimal },
      { e: 'Identificación recaudador: ', v: recibopesaje.identificacionrecaudador },
      { e: 'Nombre recaudador: ', v: recibopesaje.nombrerecaudador },
      { e: 'Apellido recaudador: ', v: recibopesaje.apellidorecaudador }
    ]


    console.log(this.datosmodal);


    this.datos = recibopesaje;

    //console.log(recibopesaje);


  }

  /**
   * 
   * @param valor valor/numero para convertir en peso colombiano
   */
  convertirPesosColombia(valor: number) {
    const nuevoValor = valor.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
    });

    return nuevoValor;
  }


  /**
   * Metodo que guarda el recibo en la base de datos, en el controlador de 
   */
  crearRecibo() {
    this.creandorecibo = true;
    this._recaudoServices.crearRecibo(this.datos).subscribe(
      response => {
        let respuesta = response;
        if (respuesta.length <= 1) {
          this.mensajecreacion = 'Error al inserta el recibo';
          console.log('Error al inserta el recibo');
        } else {
          this.mensajecreacion = respuesta.msg;
          if (respuesta.status != 'error') {
            this.mostrarMensaje(1);
            //en caso de exito se actualiza el numero de recibo del usuario
            //this.actualizarReciboUsuario(); //descomentar cuando el metodo exista :)
            const numerorecibo = this.datos.numerorecibopesaje + 1;
            this.nuevoReciboForm.get('numerorecibopesaje').setValue(numerorecibo);
            let identity = this._userServices.getIdentity();
            identity.numerorecibo = numerorecibo;
            localStorage.setItem('identity', JSON.stringify(identity)); //modificar el identity del local storage para el numero de recibo
            this.nrecibo = numerorecibo;
            this.editarAgregarTercero();//agregar el tercero
            this.inicarFormulario();//reiniciar el formulario de recibo
            this.textovalor='';
            //validar si el usuario tercero es nuevo si es este caso, lo vamos actualizar
          } else {
            this.mostrarMensaje(0);
          }
         
        }
      },
      error => {
        this.creandorecibo = false;
        this.mensajecreacion = "Error en el servidor al crear el recibo, Intentelo nuevamente o comuniquese con el administrador";
        this.mostrarMensaje(0);
        console.log(error);

      }

    );
  }

  /**
   * reiniciamos la variable de tercero en caso que el usuaario escriba un nuevo valor
   * es para que el texto nombre tercero quede en blanco y se pueda insertar como un nuevo tercero
   */
  reiniciarTercero() {
    if (this.tercero.pkidtercero != null) {
      console.log('reiniciando');
      this.iniciarTercero();
      this.nuevoReciboForm.get('nombreterceropesaje').setValue('');
    }
  }

  // /**
  //  * metodo que actualiza el numero de recibo usuario, tanto desde el servidor como del front end
  //  */
  // actualizarReciboUsuario() {
  //   const numerorecibo = this.datos.numerorecibopesaje + 1;
  //   this._userServices.actualizarNumeroRecibo(this._userServices.getToken().sub, numerorecibo).subscribe(
  //     response => {
  //       let respuesta = response;
  //       if (respuesta.length <= 1) {
  //         this.mensajecreacion = 'Error al inserta el recibo';
  //         console.log('Error al inserta el recibo');
  //       } else {
  //         if (respuesta.status != 'error') {//si es diferente de null, actualizamos la vista del numero de recibo y los datos del token
  //           let identity = this._userServices.getIdentity();
  //           identity.numerorecibo = numerorecibo;
  //           localStorage.setItem('identity', JSON.stringify(identity));
  //           this.nrecibo = numerorecibo;
  //         } else {//en caso de error solo mostramos el mensaje de respuesta del servidor
  //           this.mensajecreacion = respuesta.msg;
  //         }
  //       }
  //     },
  //     error => {
  //       this.mensajecreacion = "Error en el servidor al actualizar el numero de recibo";
  //       this.mostrarMensaje(0);
  //     }
  //   );


  // }

  /**
   * Metodo que envia la informacion del tercero para actualizar o agregar dependiendo de la base de datos
   */
  editarAgregarTercero() {
    console.log(this.tercero);
    this.tercero.identificaciontercero = this.nuevoReciboForm.get('identificacionterceropesaje').value;
    this.tercero.nombretercero = this.nuevoReciboForm.get('nombreterceropesaje').value;

    this._userServices.editarAgregarTercero(this.tercero).subscribe(
      response => {
        let respuesta = response;
        if (respuesta.length <= 1) {
          this.mensajecreacion = 'Error al inserta el tercero';
          console.log('Error al inserta el tercero');
        } else {
          if(respuesta.status=='Exito'){
            this.mensajecreacion += " y "+ respuesta.msg;//concatenar la otra respuesta del servidor al crear o actualizar el tercero
          }else{
            this.mensajecreacion = respuesta.msg;
            this.mostrarMensaje(0);
          }
          this.creandorecibo = false;
          $("#exampleModalLong").modal("hide");//ocultamos el modal
        }

      },
      error => {
        console.log('error');
        this.mostrarMensaje(0);
        this.creandorecibo = false;
        this.mensajecreacion = "Error en el servidor al crear el Tercero, Intentelo nuevamente o comuniquese con el administrador";
        console.log(error);
      }
    );
  }

  /**
   * para mostrar el modal de confirmacion
   */
  mostrarModal() {
    $("#exampleModalLong").modal("show");//ocultamos el modal
  }

  /**
   * 
   * @param nombretabla nombre de la tabla a buscar en el arreglo
   * @param datocomparar dato que se quiere comparar
   */
  consultarNombres(nombretabla, datocomparar): string {
    let nombre = '';
    this.consultas[nombretabla].map(
      (objeto) => {
        if (objeto['pkid' + nombretabla] == datocomparar) {
          nombre = objeto['nombre' + nombretabla];
          console.log(nombre);

        }
      }
    );
    return nombre;
  }


  /**
   * 
   * @param identificacion cedula del tercero para ser consultado cuando se pierda el foco
   */
  consultarTercero(identificacion) {
    console.log(identificacion);
    this.msjhinttercero = 'Consultando datos tercero...';
    this.iniciarTercero();
    this._recaudoServices.consultarDatosTercero(identificacion).subscribe(
      response => {
        let respuesta = response;
        if (respuesta.length <= 1) {
          this.msjhinttercero = 'Error al consultar el tercero';
          console.log('Error al consultar el tercero');
        } else {
          if (respuesta.status != 'error') { //si es diferente de error, treemos los datos del tercero
            this.tercero = respuesta.tercero[0];
            this.nuevoReciboForm.get('nombreterceropesaje').setValue(this.tercero.nombretercero);
            this.msjhinttercero = '';
            console.log(this.tercero);

          } else {//aso contrario, se muestra un mensaje en el hint y se reinicia la variable de tercero

            this.iniciarTercero();
            this.nuevoReciboForm.get('nombreterceropesaje').setValue('');
            this.msjhinttercero = respuesta.msg;
          }


        }
      },
      error => {
        this.msjhinttercero = 'Error al consultar los datos del tercero, intentelo nuevamente';
        console.log('Error al consultar los datos del tercero, intentelo nuevamente');
      }
    );
  }

  /**
   * 
   * @param pkidplaza el id de la plaza para consultar tarifa
   * @param nombretarifa nombre de la tarifa a consultar
   */
  tarifa;
  consultarTarifa(pkidplaza, nombretarifa) {
    this.msjhinttarifa = 'Consultando Tarifa...';
    this._recaudoServices.consultarTarifa(pkidplaza, nombretarifa).subscribe(
      response => {
        let respuesta = response;
        if (respuesta.length <= 1) {
          this.msjhinttercero = 'Error al consultar la tarifa';
          console.log('Error al consultar la tarifa');
        } else {
          if (respuesta.status == 'Exito') {//si es igual a exito es porque tiene tarifa
            nombretarifa = 'tarifaspesaje';
            this.tarifa = respuesta[nombretarifa].length != 0 ? respuesta[nombretarifa][0] : 0;
            console.log(this.tarifa);
            if (this.tarifa != 0) {//significa que tiene una tarifa
              console.log(this.tarifa.valortarifapesaje);

              this.nuevoReciboForm.get('valortarifa').setValue(this.tarifa.valortarifapesaje);
              this.nuevoReciboForm.get('valorrecibopesaje').setValue(this.tarifa.valortarifapesaje);
              this.conversionTextual(this.tarifa.valortarifapesaje);
              this.msjhinttarifa = '';
            } else {//mostrar un mensaje en el hint para indicar que no hay tarifas para la plaza seleccionada
              this.nuevoReciboForm.get('valortarifa').setValue('');
              this.nuevoReciboForm.get('valorrecibopesaje').setValue('');
              this.conversionTextual('');
              this.msjhinttarifa = 'No hay tarifa para la plaza seleccionada';
            }


          } else {//caso contrrio resultado de error
            this.nuevoReciboForm.get('valortarifa').setValue('');
            this.nuevoReciboForm.get('valorrecibopesaje').setValue('');
            this.conversionTextual('');
            this.msjhinttarifa = respuesta.msg;
          }


        }
      },
      error => {
        this.msjhinttarifa = 'Error al consultar la tarifa, intentelo nuevamente';
        this.nuevoReciboForm.get('valortarifa').setValue('');
        this.nuevoReciboForm.get('valorrecibopesaje').setValue('');
        this.conversionTextual('');
      }
    );

  }

  /**
   * 
   * @param $pkidtipoanimal id del tipo animal para consultar
   */
  consultarEspecieAnimal(pkidtipoanimal) {
    console.log(pkidtipoanimal);
    this.consultas['especieanimal'] = [];
    this.msjhintespecie = 'consultando especies...';
    this.nuevoReciboForm.get('fkidespecieanimal').setValue('');
    this._recaudoServices.consultarEspecieAnimal(pkidtipoanimal).subscribe(
      response => {
        let respuesta = response;
        if (respuesta.length <= 1) {
          this.msjhintespecie = 'Error al consultar la tarifa';
          console.log('Error al consultar la tarifa');
        } else {
          if (respuesta.status == 'Exito') {
            console.log(respuesta['especieanimal']);
            this.consultas['especieanimal'] = respuesta['especieanimal'];
            if (this.consultas['especieanimal'].length == 0) {//significa que no tiene especie de animal
              this.msjhintespecie = 'No hay especies para el tipo seleccionado';
            } else {
              this.msjhintespecie = 'Seleccione una especie de animal';
            }


          } else {
            this.msjhintespecie = respuesta.msg;
            this.consultas['especieanimal'] = [];
            this.msjhintespecie = '';
          }

        }
      },
      error => {
        this.msjhintespecie = 'Ocurrio un error al consultar las especies de animales'
        this.consultas['especieanimal'] = [];
      }

    );


  }






  /**
   *@param codeError codigo identificador para diferenciar los tipos de errores
   *@param 1: alerta de exito
   *@param 2: alerta de error
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

}

export interface TerceroInterface {
  nombretercero: string;
  identificaciontercero: string;
  telefonotercero: string;
  pkidtercero: number;
  tipotercero: string;

}




//Validacion del valor(pesos,dinero) para convertir en cadena
class ValidacionTexto {
  static Unidades(num) {

    switch (num) {
      case 1: return 'UN';
      case 2: return 'DOS';
      case 3: return 'TRES';
      case 4: return 'CUATRO';
      case 5: return 'CINCO';
      case 6: return 'SEIS';
      case 7: return 'SIETE';
      case 8: return 'OCHO';
      case 9: return 'NUEVE';
    }

    return '';
  }//Unidades()

  static Decenas(num) {

    let decena = Math.floor(num / 10);
    let unidad = num - (decena * 10);

    switch (decena) {
      case 1:
        switch (unidad) {
          case 0: return 'DIEZ';
          case 1: return 'ONCE';
          case 2: return 'DOCE';
          case 3: return 'TRECE';
          case 4: return 'CATORCE';
          case 5: return 'QUINCE';
          default: return 'DIECI' + this.Unidades(unidad);
        }
      case 2:
        switch (unidad) {
          case 0: return 'VEINTE';
          default: return 'VEINTI' + this.Unidades(unidad);
        }
      case 3: return this.DecenasY('TREINTA', unidad);
      case 4: return this.DecenasY('CUARENTA', unidad);
      case 5: return this.DecenasY('CINCUENTA', unidad);
      case 6: return this.DecenasY('SESENTA', unidad);
      case 7: return this.DecenasY('SETENTA', unidad);
      case 8: return this.DecenasY('OCHENTA', unidad);
      case 9: return this.DecenasY('NOVENTA', unidad);
      case 0: return this.Unidades(unidad);
    }
  }//Unidades()

  static DecenasY(strSin, numUnidades) {
    if (numUnidades > 0)
      return strSin + ' Y ' + this.Unidades(numUnidades)

    return strSin;
  }//DecenasY()

  static Centenas(num) {
    let centenas = Math.floor(num / 100);
    let decenas = num - (centenas * 100);

    switch (centenas) {
      case 1:
        if (decenas > 0)
          return 'CIENTO ' + this.Decenas(decenas);
        return 'CIEN';
      case 2: return 'DOSCIENTOS ' + this.Decenas(decenas);
      case 3: return 'TRESCIENTOS ' + this.Decenas(decenas);
      case 4: return 'CUATROCIENTOS ' + this.Decenas(decenas);
      case 5: return 'QUINIENTOS ' + this.Decenas(decenas);
      case 6: return 'SEISCIENTOS ' + this.Decenas(decenas);
      case 7: return 'SETECIENTOS ' + this.Decenas(decenas);
      case 8: return 'OCHOCIENTOS ' + this.Decenas(decenas);
      case 9: return 'NOVECIENTOS ' + this.Decenas(decenas);
    }

    return this.Decenas(decenas);
  }//Centenas()

  static Seccion(num, divisor, strSingular, strPlural) {
    let cientos = Math.floor(num / divisor)
    let resto = num - (cientos * divisor)

    let letras = '';

    if (cientos > 0)
      if (cientos > 1)
        letras = this.Centenas(cientos) + ' ' + strPlural;
      else
        letras = strSingular;

    if (resto > 0)
      letras += '';

    return letras;
  }//Seccion()

  static Miles(num) {
    let divisor = 1000;
    let cientos = Math.floor(num / divisor)
    let resto = num - (cientos * divisor)

    let strMiles = this.Seccion(num, divisor, 'MIL', 'MIL');
    let strCentenas = this.Centenas(resto);

    if (strMiles == '')
      return strCentenas;

    return strMiles + ' ' + strCentenas;
  }//Miles()

  static Millones(num) {
    let divisor = 1000000;
    let cientos = Math.floor(num / divisor)
    let resto = num - (cientos * divisor)

    let strMillones = this.Seccion(num, divisor, 'UN MILLON', 'MILLONES');
    let strMiles = this.Miles(resto);

    if (strMillones == '')
      return strMiles;

    return strMillones + ' ' + strMiles;
  }//Millones()

  public static numeroALetras(num, currency) {
    currency = currency || {};
    let data = {
      numero: num,
      enteros: Math.floor(num),
      centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
      letrasCentavos: '',
      letrasMonedaPlural: currency.plural || 'PESOS',//'PESOS', 'Dólares', 'Bolívares', 'etcs'
      letrasMonedaSingular: currency.singular || 'PESO', //'PESO', 'Dólar', 'Bolivar', 'etc'
      letrasMonedaCentavoPlural: currency.centPlural || 'CENTAVOS',
      letrasMonedaCentavoSingular: currency.centSingular || 'CENTAVO'
    };

    if (data.centavos > 0) {
      let centavos = ''
      if (data.centavos == 1)
        centavos = this.Millones(data.centavos) + ' ' + data.letrasMonedaCentavoSingular;
      else
        centavos = this.Millones(data.centavos) + ' ' + data.letrasMonedaCentavoPlural;
      data.letrasCentavos = 'CON ' + centavos
    };

    if (data.enteros == 0)
      return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
    if (data.enteros == 1)
      return this.Millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
    else
      return this.Millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
  };

  //para miles
  DECIMAL_SEPARATOR = ".";
  GROUP_SEPARATOR = ",";
  budget = 0;
  format(valString) {
    if (!valString) {
      return '';
    }
    let val = valString.toString();
    const parts = this.unFormat(val).split(this.DECIMAL_SEPARATOR);
    return parts[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, this.GROUP_SEPARATOR)

  };

  unFormat(val) {
    if (!val) {
      return '';
    }
    val = val.replace(/^0+/, '').replace(/\D/g, '');
    if (this.GROUP_SEPARATOR === ',') {
      return val.replace(/,/g, '');
    } else {
      return val.replace(/\./g, '');
    }
  }




}