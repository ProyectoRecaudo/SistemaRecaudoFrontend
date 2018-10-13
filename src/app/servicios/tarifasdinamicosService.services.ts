import { Injectable } from '@angular/core';
import { Http, Response, Headers, ResponseContentType } from '@angular/http';
import { GLOBAL } from './globales';
import { map } from 'rxjs/operators';
/**
 * Clase dinamica para generar consultas de las tablas de tarifas
 */
@Injectable()
export class TarifasServices {
    public url: string;
    public token;
    public headers;

    constructor(private _http: Http) {
        // this.url = 'http://192.168.1.21/SistemaRecaudoBackend/web/app_dev.php';
        this.url = GLOBAL.url;
        this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    }

    /**
     *
     * @param url url del controlador donde se quiere hacer la peticion(llega del _router)
     * Metodo que consulta las cabeceras de la consulta de tarifas asi como los datos para mostrar en su respectiva columna
     */
    consultarDatos(url: string, activo: boolean = false) {
        const params = 'authorization=' + this.getToken() + (activo ? "&activo=" + true : '');
        return this._http.post(this.url + url + '/query', params, { headers: this.headers })
            .pipe(map(res => res.json()));
    }


    /**
     * Para crea cuqluier tarifa
     * @param pTarifa Tarifa a agregar
     * @param uploadData Datos a subir
     * @param url Url del servicio
     */
    crearTarifa(pTarifa: any, uploadData: FormData, url: string) {
        const json = JSON.stringify(pTarifa);
        uploadData.append('json', json);
        uploadData.append('authorization', this.token);
        return this._http.post(this.url + url + '/new', uploadData)
            .pipe(
                map(
                    resp => {
                        // console.log(resp)
                        return resp.json();
                    }
                )
            );
    }

    /**
     * Edita cualquier tarifa
     * @param pTarifa Tarifa a editar
     * @param uploadData Datos a subir
     * @param url Url del servicio
     */
    editarTarifa(pTarifa: any, uploadData: FormData, url: string, objeto?) {
        if (objeto != null) {
            uploadData.append('tarifa', objeto);
            // pTarifa['tarifa']=objeto;
        }
        const json = JSON.stringify(pTarifa);
        uploadData.append('json', json);
        uploadData.append('authorization', this.token);
        return this._http.post(this.url + url + '/edit', uploadData)
            .pipe(
                map(
                    resp => {
                        // console.log(resp)
                        return resp.json();
                    }
                )
            );
    }


    getToken() {
        const token = JSON.parse(localStorage.getItem('token'));

        if (token !== 'undefined') {
            this.token = token;
        } else {
            this.token = null;
        }
        return this.token;
    }

}
