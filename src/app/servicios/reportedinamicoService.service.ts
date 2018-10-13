import { Injectable } from "@angular/core";
import { Http, Response, Headers, ResponseContentType } from '@angular/http';
import { GLOBAL } from "./globales";
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


//Servicio dinamico para generar los reportes
@Injectable()
export class ReportesServices {
    public url: string;
    public token;
    public headers;
    public route;


    constructor(private _http: Http, private router: Router) {
        //this.url = 'http://192.168.1.21/SistemaRecaudoBackend/web/app_dev.php';
        this.url = GLOBAL.url;
        this.route = this.router.url.substring(15);
        this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    }


    /**
     * Metodo que consulta los campos de tipo input
     */
    consultarCampos() {
        let token = "authorization=" + this.getToken();
        console.log(this.url + this.route + '/query');
        const key = this.route.substring(1);
        //let json = {}
        //json[key]=false;
        //console.log(json);
        const params = token + "&" + key + "=" + false;
        //console.log(params);

        return this._http.post(this.url + this.route + '/query', params, { headers: this.headers })
            .pipe(map(res => res.json()));
    }

    /**
     * 
     * @param nombretabla nombre del controlador(mismo que la tabla) donde se procedera hacer la consulta para generar un select dinamico 
     */
    consultarCamposSelect(nombretabla) {
        let token = "authorization=" + this.getToken()+"&activo=true";
        console.log(this.url + "/" + nombretabla + '/query');
        return this._http.post(this.url + "/" + nombretabla + '/query', token, { headers: this.headers })
            .pipe(map(res => res.json()));
    }


    /**
     * 
     * @param filtros array con parametros de filtros para la generacion de un reporte dinamico
     */
    consultarDatosTablaConFiltros(filtros) {
        let token = "authorization=" + this.getToken();
        console.log(this.url + this.route + '/query');
        const key = this.route.substring(1);
        const params = token + "&" + key + "=" + true + "&filtros=" + JSON.stringify(filtros);
        return this._http.post(this.url + this.route + '/query', params, { headers: this.headers })
            .pipe(map(res => res.json()));

    }

    /**
     * 
     * @param page numero de la pagina a consultar, enviada por get
     * @param filtros filtros, todos los campos select e imputs, llega como array
     * @param nombretabla nombre de la tabla(controlador) donde se hara la consulta
     */
    consultarDatosPaginadosConFiltros(page = null, filtros, nombretabla: string) {
        let params = "authorization=" + this.getToken()+"&nombretabla="+nombretabla+"&filtros="+JSON.stringify(filtros);
        if (page == null) {
            page = 1;
        }

        return this._http.post(this.url + '/paginador/?page=' + page, params, { headers: this.headers })
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
     * @param fkidtipoanimal id del tipo de animal para obtener las especies del tipo seleccionado
     * 
     */
    consultarEspecieAnimalPorTipo(fkidtipoanimal) {
        let token = "authorization=" + this.getToken();
        const params = token + "&pkidtipoanimal=" + fkidtipoanimal;
        return this._http.post(this.url + '/especieanimal/query', params, { headers: this.headers })
            .pipe(map(res => res.json()));
    }

    /**
     * 
     * @param filtros filtros para generar un pdf 
     * genera un reporte PDF pasando al controlador de la api el nombre del reporte
     */
    generarPDF(filtros) {
        const nombrereporte = this.route.substring(1);//obteniendo el nombre de el reporte
        let token = "authorization=" + this.getToken();
        const params = token + "&nombrereporte=" + nombrereporte + "&filtros=" + JSON.stringify(filtros);
        return this._http.post(this.url + '/export/pdf', params, { responseType: ResponseContentType.Blob, headers: this.headers })
            .pipe(map(res => { return new Blob([res.blob()], { type: 'application/pdf' }) } ));
    }

    /**
     * 
     * @param filtros filtros para generar un excel 
     * genera un reporte Excel pasando al controlador de la api el nombre del reporte
     */
    generarExcel(filtros) {
        const nombrereporte = this.route.substring(1);//obteniendo el nombre de el reporte
        let token = "authorization=" + this.getToken();
        const params = token + "&nombrereporte=" + nombrereporte + "&filtros=" + JSON.stringify(filtros);
        return this._http.post(this.url + '/export/excel', params, { responseType: ResponseContentType.Blob, headers: this.headers })
            .pipe(map(res => { return new Blob([res.blob()], { type: 'application/vnd.ms-excel' }) }));
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
    //DanielJ
    /**
     * 
     * Consultar los tipos de vehiculo para agregarlos al select del componente dinamico
     * 
     */
    consultarTiposVehiculo() {
        let token = "authorization=" + this.getToken();
        const params = token; 
        return this._http.post(this.url + '/tipovehiculo/query', params, { headers: this.headers })
            .pipe(map(res => res.json()));
    }
    /**
     * 
     * @param fkidplaza id de la plaza para consultar por zonas el sector
     * 
     */
    consultarPuertasPorPlaza(fkidplaza) {
        let token = "authorization=" + this.getToken();
        const params = token + "&pkidplaza=" + fkidplaza;
        return this._http.post(this.url + '/puerta/query', params, { headers: this.headers })
            .pipe(map(res => res.json()));
    }

}