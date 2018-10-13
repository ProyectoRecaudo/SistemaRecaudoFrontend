import { Injectable } from "@angular/core";
import { Http, Response, Headers } from '@angular/http';
import { GLOBAL } from "./globales";
import { map } from 'rxjs/operators';

@Injectable()
export class ZonasServices {

    public url: string;
    public token;
    public headers;

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
        this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    }

 
    /**
     * Metodo que constulta los zonaes para listarlos en la tabla, con todos los campos
     */
    consultarTodosZonas() {
        let token = "authorization=" + this.getToken();
        return this._http.post(this.url + '/zona/query', token, { headers: this.headers })
            .pipe(map(res => res.json()));

    }

    /**
     * 
     * Metodo que recibe el idde la plaza y devuelve las zonas que estan asignadas a la plaza
     */
    consultarZonasPorPlaza(pkidplaza, sector){
        let json = sector!=null? JSON.stringify({pkidplaza:pkidplaza , sector: sector}) :JSON.stringify({pkidplaza:pkidplaza});
        let token = "authorization=" + this.getToken()+"&json="+json;
        return this._http.post(this.url + '/zona/query', token, { headers: this.headers })
            .pipe(map(res => res.json()));
    }

    /*
    Metodo que crea un zona 
    recibe como parametro el zona de tipo Zona para insertar
    */
    crearZona(nuevo_zona) {
        let json = JSON.stringify(nuevo_zona);
        let params = "json=" + json + "&authorization=" + this.getToken();

        return this._http.post(this.url + '/zona/new', params, { headers: this.headers }).pipe(map(res => res.json()));

    }


    /**
     * Eliminar el zona por pkidZona
     */

     eliminarZona(pkidZona){
        let zona = { pkidzona: pkidZona };
        let json = JSON.stringify(zona);
        let params = "json=" + json + "&authorization=" + this.getToken();
        console.log(params);
        //console.log(JSON.stringify(this.getToken()));

        return this._http.post(this.url + '/zona/remove', params, { headers: this.headers })
            .pipe(map(res => res.json()));
     }



    //metodo para actualizar un zona
    //parametros de usuario
    /*
        zona_editar: objeto de tipo Zona,
       
    */
    actualizarZona(zona_editar) {

        let json = JSON.stringify(zona_editar);
        let params = "json=" + json + "&authorization=" + this.getToken();

        return this._http.post(this.url + '/zona/edit', params, { headers: this.headers }).pipe(map(res => res.json()));
    }

    /**
     * 
     * @param pkidzona id del zona a cambiarle 
     * @param active valor para cmbiar el estado
     * @param nombre_tabla nombre de la tabla a modificar
     */
    cambiarEstadoZona(pkidzona: number, active: boolean, nombre_tabla: string) {
        let enviarDatos = { pkid: pkidzona, active: String(active), nombretabla: nombre_tabla };
       
        let json = JSON.stringify(enviarDatos);
        let params = "json=" + json + "&authorization=" + this.getToken()
        return this._http.post(this.url + '/active/query', params, { headers: this.headers })
            .pipe(map(res => res.json()));
    }


    /**
     * Metodo que consultar todos los usuarios que sean de tipo recaudador
     */
    consultarUsuariosRecaudadores(){
        let filtro =  JSON.stringify({nombrefiltro:'Recaudador'});
        let params = "authorization="+this.getToken()+"&filtro="+filtro;;
        return this._http.post(this.url + '/user/query', params, { headers: this.headers })
            .pipe(map(res => res.json()));
    }


    /**
     * metodo que consulta las plazas no asignadas
     */
    consultarPlazasAsignadas(zona:boolean){
        let conzona = JSON.stringify({conzonas:String(zona)});
        let params = "authorization="+this.getToken()+"&conzonas="+conzona;
        return this._http.post(this.url + '/plaza/query', params, { headers: this.headers })
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