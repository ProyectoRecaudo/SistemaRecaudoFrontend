import { Injectable } from '@angular/core';
import { GLOBAL } from './globales';
import { Http, Headers } from '@angular/http';
import { Puerta } from '../modelos/puerta';
import { map } from 'rxjs/operators';

@Injectable()
export class PuertasService {

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
    this.getToken();
  }

  // -------------------------------------------------------------------------
  // Métodos
  // -------------------------------------------------------------------------

  /**
   * Crea una nueva puerta en la base de datos del sistema
   * @param pPuerta - Puerta a agregar
   */
  crearPuerta(pPuerta: Puerta) {
    const p = {
      codigopuerta: pPuerta.codigopuerta,
      nombrepuerta: pPuerta.nombrepuerta,
      puertaactivo: pPuerta.puertaactivo + '',
      fkidplaza: pPuerta.fkidplaza + ''
    };

    const json = JSON.stringify(p);
    const params = 'json=' + json + '&authorization=' + this.token;

    // console.log(params);

    return this._http.post(this.url + '/puerta/new', params, { headers: this.headers })
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
   * Consulta las puertas registradas en el sistema
   */
  consultarPuertas() {
    // const puerta = new Puerta('puerta 1', true, 3, '123');
    const params = 'authorization=' + this.token;

    return this._http.post(this.url + '/puerta/query', params, { headers: this.headers })
      .pipe(
        map(
          (resp: any) => {
            const respuesta = JSON.parse(resp._body);
            return respuesta.puerta;
          }
        )
      );
  }

  /**
   * Edita una puerta
   * @param pPuerta Puerta a editar
   */
  editarPuerta(pPuerta: Puerta) {
    const p = {
      codigopuerta: pPuerta.codigopuerta,
      nombrepuerta: pPuerta.nombrepuerta,
      puertaactivo: pPuerta.puertaactivo + '',
      fkidplaza: pPuerta.fkidplaza + '',
      pkidpuerta: pPuerta.pkidpuerta + ''
    };
    const json = JSON.stringify(p);
    const params = 'json=' + json + '&authorization=' + this.token;
    // console.log(json);

    return this._http.post(this.url + '/puerta/edit', params, { headers: this.headers })
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
   * Elimina una puerta del sistema
   * @param pkidpuerta identificador de la puerta que se quiere eliminar
   */
  eliminarPuerta(pkidpuerta: number) {
    const id = { pkidpuerta: pkidpuerta + '' };
    const json = JSON.stringify(id);
    const params = 'json=' + json + '&authorization=' + this.token;

    return this._http.post(this.url + '/puerta/remove', params, { headers: this.headers })
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
