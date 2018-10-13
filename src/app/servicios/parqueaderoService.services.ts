import { Injectable } from "@angular/core";
import { Http, Response, Headers } from '@angular/http';
import { GLOBAL } from "./globales";
import { map } from 'rxjs/operators';

@Injectable()
export class ParqueaderoServices {
    public url: string;
    public token;
    public headers;

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
        this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    }

    /**
    * Metodo que constulta los parqueaderos para listarlos en la tabla, con todos los campos
    */
    consultarTodosParqueaderos() {
        let token = "authorization=" + this.getToken();
        return this._http.post(this.url + '/parqueadero/query', token, { headers: this.headers })
            .pipe(map(res => res.json()));

    }


    /*
        Metodo que crea un parqueadero 
        recibe como parametro el parqueadero de tipo Parqueadero para insertar
        */
    crearParqueadero(nuevo_parqueadero) {
        let json = JSON.stringify(nuevo_parqueadero);
        let params = "json=" + json + "&authorization=" + this.getToken();

        return this._http.post(this.url + '/parqueadero/new', params, { headers: this.headers }).pipe(map(res => res.json()));

    }


      /**
     * Eliminar el parqueadero por pkidParqueadero
     */

    eliminarParqueadero(pkidParqueadero){
        let parqueadero = { pkidparqueadero: pkidParqueadero };
        let json = JSON.stringify(parqueadero);
        let params = "json=" + json + "&authorization=" + this.getToken();
        console.log(params);
        //console.log(JSON.stringify(this.getToken()));

        return this._http.post(this.url + '/parqueadero/remove', params, { headers: this.headers })
            .pipe(map(res => res.json()));
     }

     //metodo para actualizar un parqueadero
    //parametros de usuario
    /*
        parqueadero_editar: objeto de tipo Parqueadero,
       
    */
    actualizarParqueadero(parqueadero_editar) {
        let json = JSON.stringify(parqueadero_editar);
        let params = "json=" + json + "&authorization=" + this.getToken();
        return this._http.post(this.url + '/parqueadero/edit', params, { headers: this.headers }).pipe(map(res => res.json()));
    }


     /**
     * 
     * @param pkidparqueadero id del parqueadero a cambiarle 
     * @param active valor para cmbiar el estado
     * @param nombre_tabla nombre de la tabla a modificar
     */
    cambiarEstadoParqueadero(pkidparqueadero: number, active: boolean, nombre_tabla: string) {
        let enviarDatos = { pkid: pkidparqueadero, active: String(active), nombretabla: nombre_tabla };
        let json = JSON.stringify(enviarDatos);
        let params = "json=" + json + "&authorization=" + this.getToken();
        return this._http.post(this.url + '/active/query', params, { headers: this.headers })
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