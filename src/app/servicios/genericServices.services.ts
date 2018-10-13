import { Usuario } from "../modelos/usuario";
import { Injectable } from "@angular/core";
import { Http, Response, Headers } from '@angular/http';
import { GLOBAL } from "./globales";
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable()
export class GenericServices {
    public url: string;
    public identity;
    public token;
    public headers;
    public route;

    constructor(private _http: Http,private router: Router) {
        this.url = GLOBAL.url;
        //this.route= this.router.url.substring(15);
        const url = this.router.url.substring(1);
        const indiceRuta = url.indexOf("/"); 
        
        this.route= url.substring(indiceRuta);
        console.log(this.route);
        
        //this.route= this.router.url.substring(6);
        this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    }

    //Servicio para crear un usuario
    //parametros de usuario
    /*
        nuevo_usuario:
        Clase usuario con todos los atrinutos del form,
        uploadData:
        foto, usuario_editar,token
        va como FormData
    */
    crearUsuario(nuevo_usuario: any, uploadData: FormData) {
        let json = JSON.stringify(nuevo_usuario);
        //let params =  "json="+json+"&authorization="+this.getToken()+"&fichero_usuario="+(uploadData);
        uploadData.append('json', json);
        uploadData.append('authorization', this.getToken());
        console.log(uploadData);
        return this._http.post(this.url + this.route+'/new', uploadData)
            .pipe(map(res => res.json()));
    }


    //Servicio para iniciar sesion
    //parametros de usuario
    /*
        usuario_editar:
        Clase usuario con todos los atrinutos del form,
        uploadData:
        foto, usuario_editar,token
        va como FormData
    */
    actualizarUsuario(usuario_editar: any, uploadData: FormData) {
        let json = JSON.stringify(usuario_editar);
        uploadData.append('json', json);
        uploadData.append('authorization', this.getToken());

        return this._http.post(this.url + this.route+'/edit', uploadData)
            .pipe(map(res => res.json()));
    }


    //metodo para eliminar usuario
    //parametros de usuario
    /*
        pkidusuario:id del usuario
        authorization: token
    */
    eliminarUsuario(pkidusuario:number,pkey:string) {
        let user:any={};
        user[pkey] = pkidusuario ;
        let json = JSON.stringify(user);
        let params = "json=" + json + "&authorization=" + this.getToken();
        console.log("parametros");
        console.log(params);
        //console.log(JSON.stringify(this.getToken()));
        return this._http.post(this.url + this.route+'/remove', params, { headers: this.headers })
            .pipe(map(res => res.json()));
    }

    //Servicio para iniciar sesion
    //parametros de usuario
    /*
        usuario_logeado=>
        nombreusuario,contrasenia
    */
    iniciarSesion(usuario_logeado) {
        let json = JSON.stringify(usuario_logeado);
        let params = "json=" + json;
        return this._http.post(this.url + '/login', params, { headers: this.headers })
            .pipe(map(res => res.json()));
    }


    //metodo q consulta todos los usuarios de la base de datos
    //paramtros de usuario
    /*
        authorization: token del usuario
    */
    consultarUsuarios() {
        let token = "authorization=" + this.getToken();
        console.log("Consulta");
        return this._http.post(this.url + this.route+'/query', token, { headers: this.headers })
            .pipe(map(res => res.json()));
    }


    //
    //paramtros de usuario
    /*
      pkidusuario: identificador del usuario a cambiar estado
      active : valor de usuario activo/inactivo
      nombre_tabla: nombre de la tabla a eliminar
    */
    cambiarEstadoUsuario(pkidusuario: number, active: boolean, nombre_tabla: string,pkname:string) {
        let enviarDatos = {};
        enviarDatos['pkid']=pkidusuario;
        enviarDatos['active']=(active);
        enviarDatos['nombretabla']=nombre_tabla;
        let json = JSON.stringify(enviarDatos);
        console.log(enviarDatos);
        let params = "json=" + json + "&authorization=" + this.getToken();
        return this._http.post(this.url + '/active/query', params, { headers: this.headers })
            .pipe(map(res => res.json()));

    }


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






    //Si el usuario esta identificado, se redirige
    redirigirSiEstaIdentificado(_router: Router) {
        let identity = this.getIdentity();
        if (identity != null && identity.sub) {
            _router.navigate(["/dashboard"]);
            console.log("redirigir");

        } else {
            _router.navigate(["/"]);
        }
    }




}
