import { Injectable } from '@angular/core';
import { GLOBAL } from './globales';
import { Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BeneficiarioService {

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
   * Consulta las puertas registradas en el sistema
   */
  consultarBeneficiarios() {
    // const puerta = new Puerta('puerta 1', true, 3, '123');
    const params = 'authorization=' + this.getToken();

    return this._http.post(this.url + '/beneficiario/query', params, { headers: this.headers })
      .pipe(
        map(
          (resp: any) => {
            return resp.json();
          }
        )
      );
  }

 
    //obtener de manera global los datos del token
    getToken() {
      let token = JSON.parse(localStorage.getItem('token'));

      if (token != "undefined") {
          this.token = token;
      } else {
          this.token = null;
      }
      return this.token;
  }
}
