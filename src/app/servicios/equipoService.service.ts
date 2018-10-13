import { Injectable } from "@angular/core";
import { Http, Response, Headers } from '@angular/http';
import { GLOBAL } from "./globales";
import { map } from 'rxjs/operators';

@Injectable()
export class EquipoService {
    public url: string;
    public token;
    public headers;

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
        this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    }

    /**
        * Metodo que constulta equipos para listarlos en la tabla, con todos los campos
        */
    consultarTodosEquipo() {
        let token = "authorization=" + this.getToken();
        return this._http.post(this.url + '/equipo/query', token, { headers: this.headers })
            .pipe(map(res => res.json()));

    }


    /*
        Metodo que crea un equipo 
        recibe como parametro el equipo de tipo Equipo para insertar
        */
    crearEquipo(nuevo_equipo,token) {
        
        let json = JSON.stringify(nuevo_equipo);
        let params = "json=" + json + "&authorization=" + (token!=null?token:this.getToken());

        return this._http.post(this.url + '/equipo/new', params, { headers: this.headers }).pipe(map(res => res.json()));

    }


    /**
   * Eliminar el equipo por pkidEquipo
   */

    eliminarEquipo(pkidEquipo) {
        let equipo = { pkidequipo: pkidEquipo };
        let json = JSON.stringify(equipo);
        let params = "json=" + json + "&authorization=" + this.getToken();
        console.log(params);
        //console.log(JSON.stringify(this.getToken()));

        return this._http.post(this.url + '/equipo/remove', params, { headers: this.headers })
            .pipe(map(res => res.json()));
    }

    //metodo para actualizar un equipo
    //parametros de usuario
    /*
        equipo_editar: objeto de tipo Equipo,
       
    */
    actualizarEquipo(equipo_editar) {
        let json = JSON.stringify(equipo_editar);
        let params = "json=" + json + "&authorization=" + this.getToken();
        return this._http.post(this.url + '/equipo/edit', params, { headers: this.headers }).pipe(map(res => res.json()));
    }


    /**
    * 
    * @param pkidequipo id del equipo a cambiarle 
    * @param active valor para cmbiar el estado
    * @param nombre_tabla nombre de la tabla a modificar
    */
    cambiarEstadoEquipo(pkidequipo: number, active: boolean, nombre_tabla: string) {
        let enviarDatos = { pkid: pkidequipo, active: String(active), nombretabla: nombre_tabla };
        let json = JSON.stringify(enviarDatos);
        let params = "json=" + json + "&authorization=" + this.getToken();
        return this._http.post(this.url + '/active/query', params, { headers: this.headers })
            .pipe(map(res => res.json()));
    }

     /**
     * consulta todos los usuarios para mostrarlos en el selector
     */
    consultarUsuarios(){
        let token = "authorization=" + this.getToken();
        return this._http.post(this.url + '/usuario/query', token, { headers: this.headers })
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