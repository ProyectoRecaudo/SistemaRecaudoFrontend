import { Injectable } from "@angular/core";
import { Http, Response, Headers } from '@angular/http';
import { GLOBAL } from "./globales";
import { map } from 'rxjs/operators';
import { PuestoInterface } from "../modelos/interfaces/interfaces.inteface";

@Injectable()
export class PuestosServices {

 

    public url: string;
    public token;
    public headers;

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
        this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    }

    /**
     * 
     * @param puesto2 interfaz con todos los campos para insertar en la tabla puestos
     */
    crearPuesto(puesto2: PuestoInterface,uploadData: FormData) {
        let json = JSON.stringify(puesto2);
        //let params =  "json="+json+"&authorization="+this.getToken()+"&fichero_usuario="+(uploadData);
        uploadData.append('json', json);
        uploadData.append('authorization', this.getToken());
        console.log(uploadData);
        return this._http.post(this.url + '/puesto/new', uploadData)
            .pipe(map(res => res.json()));
      }
    
      /**
       * 
       * @param puesto2 
       * @param uploadData 
       */
      actualizarPuesto(puesto2: PuestoInterface, uploadData: FormData): any {
        let json = JSON.stringify(puesto2);
        //let params =  "json="+json+"&authorization="+this.getToken()+"&fichero_usuario="+(uploadData);
        uploadData.append('json', json);
        uploadData.append('authorization', this.getToken());
        console.log(uploadData);
        return this._http.post(this.url + '/puesto/edit', uploadData)
            .pipe(map(res => res.json()));
      }

    /**
    * Metodo que constulta los sectores para listarlos en la tabla, con todos los campos
    */
    consultarTodosPuestos() {
        let token = "authorization=" + this.getToken();
        return this._http.post(this.url + '/puesto/query', token, { headers: this.headers })
            .pipe(map(res => res.json()));
    }


    /**
      * Metodo que cambia el estado del campo
      */
    cambiarEstadoPuesto(pkidpuesto: number, active: boolean, nombre_tabla: string) {
        let enviarDatos = { pkid: pkidpuesto, active: String(active), nombretabla: nombre_tabla };
        let json = JSON.stringify(enviarDatos);
        let params = "json=" + json + "&authorization=" + this.getToken();
        return this._http.post(this.url + '/active/query', params, { headers: this.headers })
            .pipe(map(res => res.json()));
    }


       /**
     * Eliminar el puesto por pkidPuesto
     */

    eliminarPuesto(pkidPuesto){
        let puesto = { pkidpuesto: pkidPuesto };
        let json = JSON.stringify(puesto);
        let params = "json=" + json + "&authorization=" + this.getToken();
        console.log(params);
        //console.log(JSON.stringify(this.getToken()));

        return this._http.post(this.url + '/puesto/remove', params, { headers: this.headers })
            .pipe(map(res => res.json()));
     }


     /**
      * consulta todos los estados
      */
     consultarEstadosInfraestructura(){
        let token = "authorization=" + this.getToken();
        return this._http.post(this.url + '/estadoinfraestructura/query', token, { headers: this.headers })
            .pipe(map(res => res.json()));
     }

     /**
      * Consultar todas las actividades
      */
     consultarActividadComercial(){
        let token = "authorization=" + this.getToken();
        return this._http.post(this.url + '/actividadcomercial/query', token, { headers: this.headers })
            .pipe(map(res => res.json()));
     }


     /**
      * consultar Tipos de puestos
      */
     consultarTiposdePuesto(){
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