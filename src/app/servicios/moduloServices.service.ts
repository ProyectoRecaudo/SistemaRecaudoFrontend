import { Usuario } from "../modelos/usuario";
import { Injectable } from "@angular/core";
import { Http, Response, Headers } from '@angular/http';
import { GLOBAL } from "./globales";
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ModuloServices {


    public url: string;
    public identity;
    public token;
    public headers;
    constructor(private _http: Http) {
        this.url = GLOBAL.url;
        this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        //let headers = new Headers({'Content-Type': 'multipart/form-data'});
    }

    /**
     * consulta los permisos para listarlos en el selector de roles
     * Solo se envia el token como parametro en authorization
     */
    consultarModulos(){
        let params = "authorization="+this.getToken();
        return this._http.post(this.url+'/modulo/query',params,{headers:this.headers}).pipe(map(res=>res.json()));

    }


     //Obtener de manera globar los datos del usuario
     getIdentity() {
        let identity = JSON.parse(localStorage.getItem('identity'));

        if (identity != "undefined") {
            this.identity = identity;
        } else {
            this.identity = null;
        }
        return this.identity;
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