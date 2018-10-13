import { Injectable } from '@angular/core';
import { GLOBAL } from './globales';
import { Http, Headers } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { throws } from 'assert';
import { Router } from '@angular/router';


@Injectable()
export class VerificaTokenService {

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
    constructor(private _http: Http,
        public router: Router) {
        this.url = GLOBAL.url;
        this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    }

    // -------------------------------------------------------------------------
    // Métodos
    // -------------------------------------------------------------------------

    /**
     * Consulta las puertas registradas en el sistema
     */
    validarToken() {
        // const puerta = new Puerta('puerta 1', true, 3, '123');
        this.getToken();

        const params = 'authorization=' + this.token;

        return this._http.post(this.url + '/validationtoken/', params, { headers: this.headers })
            .pipe(
                map(
                    (resp: any) => {
                        const respuesta = JSON.parse(resp._body);
                        // console.log(respuesta.token_valido);
                        return respuesta.token_valido;
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
