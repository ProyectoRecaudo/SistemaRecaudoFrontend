import { Injectable } from "@angular/core";
import { Excepcion } from "../modelos/excepcion";
import { GLOBAL } from "./globales";
import { Http, Response, Headers } from '@angular/http';
import { map } from "rxjs/operators";

@Injectable()
export class ExcepcionService {
    public url: string;
    public headers;
    public identity;
    public token;


    constructor(private _http: Http) {
        this.url = GLOBAL.url;
        this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    }


    /**
     * 
     * Metodo que captura la excepcion
     * excepcion:any
     * mensaje: mensaje de error del catch
     * url: ruta del modulo que genera la excepcion
     * funcion : funcion que genera el error
     * stack: la pila del error
     */
    capturarExcepcion(excepcion: any) {
         
        let excepcions: Excepcion = new Excepcion();
        excepcions.setFkidusuario(this.getIdentity().sub);
        excepcions.setNombreusuario(this.getIdentity().name + this.getIdentity().surname);
        excepcions.setModulo(excepcion.url);
        excepcions.setMetodo(excepcion.funcion);
        excepcions.setMensaje(excepcion.mensaje);
        excepcions.setPila(excepcion.stack);
        excepcions.setTipoexcepcion('');
        excepcions.setOrigen('web');
        let json = JSON.stringify(excepcions);
       
        let params = "json="+json+"&authorization=" + this.getToken();
        console.log(params);

        return this._http.post(this.url + '/excepcion', params,{headers:this.headers})
            .pipe(map(res => res.json()));

            
            
        }
        //let indiceFin = excepcion.stack.indexOf(" (");
        //let indiceIni = excepcion.stack.indexOf("at");
        //console.log(indiceFin);

        //let funcion = excepcion.stack.substr(indiceIni+2,(indiceFin));




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