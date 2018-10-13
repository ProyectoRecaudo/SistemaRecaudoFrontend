import { Injectable } from "@angular/core";
import { Http, Response, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { GLOBAL } from "../globales";

@Injectable()
export class TipoRecaudoServices {
    public url: string;
    public identity;
    public token;
    public headers;

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
        this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    }


    //consulta todos los tipos de recaudo para mostrarlo en el selector de plazas de mercado
    consultarTipoRecaudo(){
        let token = "authorization=" + this.getToken();
        return this._http.post(this.url + '/tiporecaudo/query', token, { headers: this.headers })
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