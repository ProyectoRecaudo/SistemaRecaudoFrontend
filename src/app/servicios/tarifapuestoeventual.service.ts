import { Injectable } from '@angular/core';
import { GLOBAL } from './globales';
import { Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { TarifaPuestoEventual } from '../modelos/tarifaPuestoEventual';

@Injectable()
export class TarifaPuestoEventualService {

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
   * Constructor del servicio de Tarifas puesto eventual
   * @param _http - Modulo http de angular
   */
  constructor(private _http: Http) {
    this.url = GLOBAL.url;
    this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    this.getToken();
  }

  // -------------------------------------------------------------------------
  // Métodos
  // -------------------------------------------------------------------------

  /**
   * Crea una nueva Tarifa puesto eventual en la base de datos del sistema
   * @param pTarifa - Tarifa puesto eventual a agregar
   */
  crearTarifaPuestoEventual(pTarifa: TarifaPuestoEventual, uploadData: FormData) {
    const json = JSON.stringify(pTarifa);
    uploadData.append('json', json);
    uploadData.append('authorization', this.token);

    //const params = 'json=' + json + '&authorization=' + this.token;

    // console.log(params);

    return this._http.post(this.url + '/tarifapuestoeventual/new', uploadData)
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
   * Consulta las Tarifas puesto eventual registradas en el sistema
   */
  consultarTarifaPuestoEventual() {
    const params = 'authorization=' + this.token;

    return this._http.post(this.url + '/tarifapuestoeventual/query', params, { headers: this.headers })
      .pipe(
        map(
          (resp: any) => {
            // console.log(resp);
            // const respuesta = JSON.parse(resp._body);
            return resp.json();
          }
        )
      );
  }

  /**
   * Edita una Tarifa puesto eventual
   * @param pTarifa Tarifa puesto eventual a editar
   */
  editarTarifaPuestoEventual(pTarifa: TarifaPuestoEventual) {

    const json = JSON.stringify(pTarifa);
    const params = 'json=' + json + '&authorization=' + this.token;

    return this._http.post(this.url + '/tarifapuestoeventual/edit', params, { headers: this.headers })
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
   * Obtiene el token del localStorage
   */
  getToken() {
    const token = JSON.parse(localStorage.getItem('token'));

    if (token !== 'undefined') {
      this.token = token;
    } else {
      this.token = null;
    }
  }
}
