import { Injectable } from "@angular/core";
import { Http, Response, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { GLOBAL } from "../globales";

@Injectable()
export class TipoParqueaderoServices {
    public url: string;
    public identity;
    public token;
    public headers;

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
        this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    }
    /*
    * @param url url del controlador donde se quiere hacer la peticion(llega del _router)
     consulta todos los tipos de parqeuadero para mostrarlo en el selector de gestion de parqueadero
    */
    consultarTipoParqueadero(activo: boolean = false){
        let token = "authorization=" + this.getToken()+ (activo? "&activo="+true:'');
        return this._http.post(this.url + '/tipoparqueadero/query', token, { headers: this.headers })
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