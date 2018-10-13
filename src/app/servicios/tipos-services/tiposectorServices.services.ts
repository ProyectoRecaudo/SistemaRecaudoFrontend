import { Injectable } from "@angular/core";
import { Http, Response, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { GLOBAL } from "../globales";

@Injectable()
export class TipoSectorServices {
    public url: string;
    public identity;
    public token;
    public headers;
    constructor(private _http: Http) {
        this.url = GLOBAL.url;
        this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    }


    //metodo q consulta todos los tipos de sectores de la base de datos
    //paramtros de envio
    /*
        authorization: token del usuario
    */
    consultarTodosTiposSector() {
        let token = "authorization=" + this.getToken();
        return this._http.post(this.url + '/tiposector/query', token, { headers: this.headers })
            .pipe(map(res => res.json()));
    }

    /**
     * 
     * @param pkidtiporol id del tipo de rol
     * @param active valor para cambiarle a la base de datos
     * @param nombre_tabla nombre de la tabla
     */

    cambiarEstadoTipoSector(pkidtipo: number, active: boolean, nombre_tabla: string) {
        let enviarDatos = { pkid: pkidtipo, active: String(active), nombretabla: nombre_tabla };
        let json = JSON.stringify(enviarDatos);
        let params = "json=" + json + "&authorization=" + this.getToken();
        return this._http.post(this.url + '/active/query', params, { headers: this.headers })
            .pipe(map(res => res.json()));
    }

    /*
       Metodo que crea un tipoSector 
       recibe como parametro el rol de tipo Rol para insertar
       adicionalemte, los permisos como un array por aparte
*/
    crearTipoSector(nuevo_sector) {
        let json = JSON.stringify(nuevo_sector);
        let params = "json=" + json + "&authorization=" + this.getToken();

        return this._http.post(this.url + '/tiposector/new', params, { headers: this.headers }).pipe(map(res => res.json()));

    }


    /**
       * Eliminar la tiposector por pkidtiposector
       */

    eliminartiposector(pkidtiposector) {
        let tiposector = { pkidtiposector: pkidtiposector };
        let json = JSON.stringify(tiposector);
        let params = "json=" + json + "&authorization=" + this.getToken();
        console.log(params);
        //console.log(JSON.stringify(this.getToken()));

        return this._http.post(this.url + '/tiposector/remove', params, { headers: this.headers })
            .pipe(map(res => res.json()));
    }


    /**
     * MEtodo que actualiza el tipo de sector con el id del tipo de sector
     */
    actualizarTipoSector(sector_actualizar){
        let json = JSON.stringify(sector_actualizar);
        let params = "json="+json+"&authorization="+this.getToken();
        console.log(params);
        

        return this._http.post(this.url + '/tiposector/edit', params, { headers: this.headers })
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