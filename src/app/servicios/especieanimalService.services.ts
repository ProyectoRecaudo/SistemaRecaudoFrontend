import { Injectable } from "@angular/core";
import { Http, Response, Headers } from '@angular/http';
import { GLOBAL } from "./globales";
import { map } from 'rxjs/operators';

@Injectable()
export class EspecieAnimalService {
    public url: string;
    public token;
    public headers;

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
        this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    }

    /**
        * Metodo que constulta las especies de animales para listarlos en la tabla, con todos los campos
        */
    consultarTodosEspecieAnimal() {
        let token = "authorization=" + this.getToken();
        return this._http.post(this.url + '/especieanimal/query', token, { headers: this.headers })
            .pipe(map(res => res.json()));

    }


    /*
        Metodo que crea un especieanimal 
        recibe como parametro el especieanimal de tipo EspecieAnimal para insertar
        */
    crearEspecieAnimal(nuevo_especieanimal) {
        let json = JSON.stringify(nuevo_especieanimal);
        let params = "json=" + json + "&authorization=" + this.getToken();

        return this._http.post(this.url + '/especieanimal/new', params, { headers: this.headers }).pipe(map(res => res.json()));

    }


    /**
   * Eliminar el especieanimal por pkidEspecieAnimal
   */

    eliminarEspecieAnimal(pkidEspecieAnimal) {
        let especieanimal = { pkidespecieanimal: pkidEspecieAnimal };
        let json = JSON.stringify(especieanimal);
        let params = "json=" + json + "&authorization=" + this.getToken();
        console.log(params);
        //console.log(JSON.stringify(this.getToken()));

        return this._http.post(this.url + '/especieanimal/remove', params, { headers: this.headers })
            .pipe(map(res => res.json()));
    }

    //metodo para actualizar un especieanimal
    //parametros de usuario
    /*
        especieanimal_editar: objeto de tipo EspecieAnimal,
       
    */
    actualizarEspecieAnimal(especieanimal_editar) {
        let json = JSON.stringify(especieanimal_editar);
        let params = "json=" + json + "&authorization=" + this.getToken();
        return this._http.post(this.url + '/especieanimal/edit', params, { headers: this.headers }).pipe(map(res => res.json()));
    }


    /**
    * 
    * @param pkidespecieanimal id del especieanimal a cambiarle 
    * @param active valor para cmbiar el estado
    * @param nombre_tabla nombre de la tabla a modificar
    */
    cambiarEstadoEspecieAnimal(pkidespecieanimal: number, active: boolean, nombre_tabla: string) {
        let enviarDatos = { pkid: pkidespecieanimal, active: String(active), nombretabla: nombre_tabla };
        let json = JSON.stringify(enviarDatos);
        let params = "json=" + json + "&authorization=" + this.getToken();
        return this._http.post(this.url + '/active/query', params, { headers: this.headers })
            .pipe(map(res => res.json()));
    }

     /**
     * consulta todos los tipos de animales para mostrarlos en el selector
     */
    consultarTipoAnimal(){
        let token = "authorization=" + this.getToken();
        return this._http.post(this.url + '/tipoanimal/query', token, { headers: this.headers })
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