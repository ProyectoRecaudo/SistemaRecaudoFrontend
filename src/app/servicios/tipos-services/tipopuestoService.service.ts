import { Injectable } from "@angular/core";
import { Http, Response, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { GLOBAL } from "../globales";

@Injectable()
export class TipoPuestoServices {
    public url: string;
    public identity;
    public token;
    public headers;

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
        this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    }


    
    //consulta todos los tipos de parqeuadero para mostrarlo en el selector de gestion de parqueadero
    consultarTipoParqueadero(){
        let token = "authorization=" + this.getToken();
        return this._http.post(this.url + '/tipopuesto/query', token, { headers: this.headers })
            .pipe(map(res => res.json()));
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