import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { GLOBAL } from './globales';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AsignaciondependienteService {

  // -------------------------------------------------------------------------
  // Propiedades
  // -------------------------------------------------------------------------

  /**
   * url api
   */
  public url: string;

  /**
   * Token de usuario
   */
  public token;

  /**
   * Headers
   */
  public headers;

  // -------------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------------

  /**
   * Constructor del servicio de puertas
   * @param _http - Modulo http de angular
   */
  constructor(private _http: Http) {
    this.url = GLOBAL.url;
    this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    // this.getToken();
  }

  // -------------------------------------------------------------------------
  // Métodos
  // -------------------------------------------------------------------------

  /**
   * Metodo para consultar la informacion del tercero(beneficiario)
   * @param identificacion cedula del tercero
   */
  consultarDatosTercero(identificacion) {
    const params = 'identificaciontercero=' + identificacion + '&authorization=' + this.getToken();

    return this._http.post(this.url + '/asignaciondependiente/query', params, { headers: this.headers })
      .pipe(
        map(
          res => res.json()
        )
      );
  }

  /**
   * Consulta todos los terceros asignados al puesto
   * @param fkidasignacionpuesto id de la asignación del puesto
   */
  consultarTerceros(fkidasignacionpuesto) {
    const params = 'fkidasignacionpuesto=' + fkidasignacionpuesto + '&authorization=' + this.getToken();

    return this._http.post(this.url + '/asignaciondependiente/query', params, { headers: this.headers })
      .pipe(
        map(
          res => res.json()
        )
      );
  }

  /**
   * Crea una nueva asignacion de puestos en la base de datos del sistema
   * @param pAsignacion - Asignacion a agregar
   */
  crearAsignacionDependiente(pDendiente: any, pAsignacion: any, uploadData: FormData) {

    const dependiente = JSON.stringify(pDendiente);
    const asignacion = JSON.stringify(pAsignacion);
    // const params = 'json=' + json + '&authorization=' + this.getToken();
    uploadData.append('datosasignaciondependiente', asignacion);
    uploadData.append('datosdependiente', dependiente);
    uploadData.append('authorization', this.token);
    uploadData.append('tabla', 'tasignaciondependiente');

    return this._http.post(this.url + '/asignaciondependiente/dependiente', uploadData)
      .pipe(
        map(
          resp => {
            // console.log(resp)
            return resp.json();
          }
        )
      );
  }


  /**
   * Elimina un dependiente del puesto
   */
  eliminarDependiente(pkidasignaciondependiente) {
    const params = 'pkidasignaciondependiente=' + pkidasignaciondependiente + '&authorization=' + this.getToken();

    return this._http.post(this.url + '/asignaciondependiente/remove', params, { headers: this.headers })
      .pipe(
        map(
          res => res.json()
        )
      );
  }

  /**
   * Obtiene el token del localstorage si existe
   */
  getToken() {
    const token = JSON.parse(localStorage.getItem('token'));

    if (token !== 'undefined') {
      this.token = token;
    } else {
      this.token = null;
    }
    return this.token;
  }
}
