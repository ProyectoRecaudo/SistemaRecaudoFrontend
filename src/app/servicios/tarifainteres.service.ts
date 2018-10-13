import { Injectable } from '@angular/core';
import { GLOBAL } from './globales';
import { Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { TarifaInteres } from '../modelos/tarifainteres';


@Injectable()
export class TarifaInteresService {

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
   * Crea una nueva Tarifa interés en la base de datos del sistema
   * @param pTarifa - Tarifa interés a agregar
   */
  crearTarifaInteres(pTarifa: TarifaInteres) {
    const json = JSON.stringify(pTarifa);
    const params = 'json=' + json + '&authorization=' + this.token;

    // console.log(params);

    return this._http.post(this.url + '/tarifainteres/new', params, { headers: this.headers })
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
   * Consulta las Tarifas de interés registradas en el sistema
   */
  consultarTarifaInteres() {
    const params = 'authorization=' + this.token;

    return this._http.post(this.url + '/tarifainteres/query', params, { headers: this.headers })
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
   * Edita una Tarifa interés
   * @param pTarifa Tarifa interés a editar
   */
  editarTarifaInteres(pTarifa: TarifaInteres) {

    const json = JSON.stringify(pTarifa);
    const params = 'json=' + json + '&authorization=' + this.token;

    return this._http.post(this.url + '/tarifainteres/edit', params, { headers: this.headers })
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
