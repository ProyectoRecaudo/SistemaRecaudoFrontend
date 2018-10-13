import { Injectable } from "@angular/core";
import { Http, Response, Headers, ResponseContentType } from '@angular/http';
import { GLOBAL } from "./globales";
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";
import { Subject, Observable } from "rxjs";
@Injectable()
export class RecaudoServices {



    public url: string;
    public token;
    public headers;
    public route;

    public datosrecibos;


    constructor(private _http: Http, private router: Router) {
        //this.url = 'http://192.168.1.21/SistemaRecaudoBackend/web/app_dev.php';
        this.url = GLOBAL.url;
        this.route = this.router.url.substring(15);
        this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    }


    /**
    * 
    * @param nombretabla nombre del controlador(mismo que la tabla) donde se procedera hacer la consulta para generar un select dinamico 
    */
    consultarCamposSelect(nombretabla) {
        let token = "authorization=" + this.getToken() + "&activo=true";
        //console.log(this.url + "/" + nombretabla + '/query');
        return this._http.post(this.url + "/" + nombretabla + '/query', token, { headers: this.headers })
            .pipe(map(res => res.json()));
    }


    /**
     * 
     * @param identificacion cedula del tercero
     * Metodo para consultar la informacion del tercero(beneficiario)
     */
    consultarDatosTercero(identificacion) {
        let token = 'authorization=' + this.getToken() + "&identificaciontercero=" + identificacion;
        return this._http.post(this.url + "/asignaciondependiente/query", token, { headers: this.headers })
            .pipe(map(res => res.json()));
    }

    /**
     * 
     * @param pkidplaza 
     */
    consultarTarifa(pkidplaza, controlador) {
        let token = 'authorization=' + this.getToken() + "&pkidplaza=" + pkidplaza;
        return this._http.post(this.url + "/" + controlador + "/query", token, { headers: this.headers })
            .pipe(map(res => res.json()));
    }


    /**
     * 
     * @param pkidtipoanimal identificador del tipo de animal
     */
    consultarEspecieAnimal(pkidtipoanimal) {
        let token = 'authorization=' + this.getToken() + "&pkidtipoanimal=" + pkidtipoanimal;
        return this._http.post(this.url + "/especieanimal/query", token, { headers: this.headers })
            .pipe(map(res => res.json()));
    }


    /**
     * 
     * @param datos datos que llegan 
     */
    crearRecibo(datos: any) {
        let dato: any[] = [datos];//convertir en array el dato
        let json = JSON.stringify(dato);
        let params = "authorization=" + this.getToken() + "&json=" + json;
        return this._http.post(this.url + this.route + "/new", params, { headers: this.headers })
            .pipe(map(res => res.json()));
    }


    /**
    * 
    * @param fkidplaza id de la plaza para consultar por zonas el sector
    * 
    */
    consultarSectoresPorPlaza(fkidplaza) {
        let token = "authorization=" + this.getToken();
        const params = token + "&pkidplaza=" + fkidplaza;
        return this._http.post(this.url + '/sector/query', params, { headers: this.headers })
            .pipe(map(res => res.json()));
    }


    /**
     * 
     * @param filtros 
     */
    consultarPuestosFijos(filtros: any) {
        //console.log(filtros);

        let token = "authorization=" + this.getToken() + "&identificacionbeneficiario=" + filtros.identificacionbeneficiario + "&pkidsector=" + filtros.fkidsector + "&pkidplaza=" + filtros.fkidplaza + "&filtro=true";
        const params = token;
        return this._http.post(this.url + '/recaudo/query', params, { headers: this.headers })
            .pipe(map(res => res.json()));
    }


    /**
     * 
     * @param filtros filtros para buscar en el controler de recibos pesaje
     * @param pagina pagina que se quiere consultar
     * @param nombretabla nombre de la tabla para hacer la consulta
     */
    consultarRecibosPaginados(filtros: any, pagina: number, nombretabla: string) {
        let token = "authorization=" + this.getToken() + "&nombretabla=" + nombretabla + "&filtros=" + JSON.stringify(filtros);
        const params = token;
        if (pagina == null) {
            pagina = 1;
        }
        return this._http.post(this.url + '/paginador/?page=' + pagina, params, { headers: this.headers })
            .pipe(map(res => res.json()));
    }


    /**
    * 
    * @param pkid id del rol a cambiarle 
    * @param active valor para cmbiar el estado
    * @param nombre_tabla nombre de la tabla a modificar
    */
    cambiarEstado(pkid: number, nombre_tabla: string) {
        let enviarDatos = { pkid: pkid, active: 'false', nombretabla: nombre_tabla };
        let json = JSON.stringify(enviarDatos);
        let params = "json=" + json + "&authorization=" + this.getToken();
        return this._http.post(this.url + '/active/query', params, { headers: this.headers })
            .pipe(map(res => res.json()));
    }


    /**
     * 
     * @param datosinsertar datos del recibo y del usuario para insertar
     */
    pagarReciboPuestoFijo(datosinsertar) {
        let json = JSON.stringify(datosinsertar);
        let params = "json=" + json + "&authorization=" + this.getToken();
        return this._http.post(this.url + '/recibopuesto/new', params, { headers: this.headers })
            .pipe(map(res => res.json()));
    }

    /**
   * 
   * @param pkid filtros para generar un pdf 
   * genera un reporte PDF pasando al controlador de la api el nombre del reporte
   */
    generarPDF(pkid, nombrereporte) {

        let token = "authorization=" + this.getToken();
        const params = token + "&nombrereporte=" + nombrereporte + "&pkidrecibopesaje=" + pkid;
        return this._http.post(this.url + '/export/pdf', params, { responseType: ResponseContentType.Blob, headers: this.headers })
            .pipe(map(res => { return new Blob([res.blob()], { type: 'application/pdf' }) }));
    }

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