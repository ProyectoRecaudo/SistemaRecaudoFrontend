export var GLOBAL = {
    //url: 'http://localhost/SistemaRecaudoBackend/web/app_dev.php',
    //url: 'http://192.168.1.21/SistemaRecaudoBackend/web/app_dev.php',
     url: 'http://contalentosas.com/SistemaRecaudoBackend/web/app_dev.php',
     urlBase: 'SistemaRecaudo',
     urlImagen: 'http://contalentosas.com/SistemaRecaudoBackend/',
    
}

//interfaz para comunicarse con el dialogo
export interface DialogData {
    nombre: string;
    id: number;
    respuesta: string;
  }
//interfaz para comunicarse con el dialogo
export interface DialogDataTipo {
    nombre: string;
    id: number;
    respuesta: string;
    tipoIdentifi: number;//para identificar el tipo y poder llamar el servicio correspondiente para la eliminarcion
  }
  