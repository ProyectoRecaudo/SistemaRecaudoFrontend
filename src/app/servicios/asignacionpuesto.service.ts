import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { GLOBAL } from './globales';
import { Http, Headers } from '@angular/http';
import { Puerta } from '../modelos/puerta';

@Injectable({
  providedIn: 'root'
})
export class AsignacionpuestoService {

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
   * Crea una nueva asignacion de puestos en la base de datos del sistema
   * @param pAsignacion - Asignacion a agregar
   */
  crearAsignacionPuesto(pAsignacion: any, uploadData: FormData) {

    const json = JSON.stringify(pAsignacion);
    // const params = 'json=' + json + '&authorization=' + this.getToken();
    uploadData.append('json', json);
    uploadData.append('authorization', this.token);

    return this._http.post(this.url + '/asignacionpuesto/new', uploadData)
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
   * Consulta las asignaciones registradas en el sistema
   */
  consultarAsignacionesPuesto() {
    const params = 'authorization=' + this.getToken();

    return this._http.post(this.url + '/asignacionpuesto/query', params, { headers: this.headers })
      .pipe(
        map(
          (resp: any) => {
            return resp.json();
          }
        )
      );
  }

  /**
   * Edita una asignación
   * @param pAsignacion Asignación a editar
   */
  editarAsignacion(pAsignacion: any, uploadData: FormData) {

    const json = JSON.stringify(pAsignacion);
    // const params = 'json=' + json + '&authorization=' + this.getToken();
    uploadData.append('json', json);
    uploadData.append('authorization', this.token);

    return this._http.post(this.url + '/asignacionpuesto/edit', uploadData)
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
   * Edita una asignación
   * @param pAsignacion Asignación a editar
   */
  cancelarAsignacion(pAsignacion) {

    const json = JSON.stringify(pAsignacion);
    const params = 'json=' + json + '&authorization=' + this.getToken();
    // console.log(json);

    return this._http.post(this.url + '/asignacionpuesto/edit', params, { headers: this.headers })
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
   * Consulta todos los puestos disponibles para hacer la asignación
   */
  consultarPuestosDisponibles() {

    const params = 'puesto=' + true + '&authorization=' + this.getToken();
    // console.log(json);

    return this._http.post(this.url + '/asignacionpuesto/query', params, { headers: this.headers })
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
