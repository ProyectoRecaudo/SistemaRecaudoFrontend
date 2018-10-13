import { Injectable } from '@angular/core';
import { GLOBAL } from './globales';
import { Http, Headers } from '@angular/http';
import { Puerta } from '../modelos/puerta';
import { map } from 'rxjs/operators';
import { Configuracion } from '../modelos/configuracion.model';

@Injectable()
export class ConfiguracionService {

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
    this.url = GLOBAL.url + '/configuracion/';
    this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    this.getToken();
  }

  // -------------------------------------------------------------------------
  // Métodos
  // -------------------------------------------------------------------------
  /**
   * Consulta las configuraciones registradas en el sistema
   */
  consultarConfiguraciones() {
    const params = 'authorization=' + this.token;

    return this._http.post(this.url + 'query', params, { headers: this.headers })
      .pipe(
        map(
          resp => {
            const respuesta = resp.json();
            return respuesta;
          }
        )
      );
  }

  /**
   * Edita una configuracion
   * @param pConfiguracion Configuración a editar
   */
  editarConfiguracion(pConfiguraciones: Configuracion[]) {
    const json = JSON.stringify(pConfiguraciones);
    console.log('Servicio Config: ' + json);
    const params = 'json=' + json + '&authorization=' + this.token;
    // console.log(json);
    return this._http.post(this.url + 'edit', params, { headers: this.headers })
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