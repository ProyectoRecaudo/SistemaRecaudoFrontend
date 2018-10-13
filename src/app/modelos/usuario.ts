import { Rol } from "./rol";

//Clase usuario que refleja la identidad de la base de datos
export class Usuario {
    //Definicion implicita de los atributos
    private pkidusuario: number;
    private idusuario: number;
    private codigousuario: string;
    private identificacion: number;
    public nombreusuario: string;
    private apellido: string;
    public usuarioactivo: string;
    private creacionusuario: Date;
    private modificacionusuario: Date;
    private roles: Rol;
    private contrasenia: string;
    private rutaimagen: string;
    private fkidrol: number;




    constructor(


    ) {

    }
    //Metodos getter and setters

    public getIdUsuario(): number {
        return this.idusuario;
    }

    public setIdUsuario(idUsuario: number
    ): void {
        this.idusuario = idUsuario;
    }

    public getCodigoUsuario(): string {
        return this.codigousuario;
    }

    public setCodigoUsuario(codigoUsuario: string
    ): void {
        this.codigousuario = codigoUsuario;
    }

    public getIdentificacion(): number {
        return this.identificacion;
    }

    public setIdentificacion(identificacion: number
    ): void {
        this.identificacion = identificacion;
    }

    public getNombreUsuario(): string {
        return this.nombreusuario;
    }

    public setNombreUsuario(nombreUsuario: string
    ): void {
        this.nombreusuario = nombreUsuario;
    }

    public getApellido(): string {
        return this.apellido;
    }

    public setApellido(apellido: string
    ): void {
        this.apellido = apellido;
    }

    public getUsuarioActivo(): boolean {
        return Boolean(this.usuarioactivo);
    }

    public setUsuarioActivo(usuarioActivo: boolean
    ): void {
        this.usuarioactivo = String(usuarioActivo);
    }

    public getCreacionUsuario(): Date {
        return this.creacionusuario;
    }

    public setCreacionUsuario(creacionUsuario: Date
    ): void {
        this.creacionusuario = creacionUsuario;
    }

    public getModificacionUsuario(): Date {
        return this.modificacionusuario;
    }

    public setModificacionUsuario(modificacionUsuario: Date
    ): void {
        this.modificacionusuario = modificacionUsuario;
    }


    public getContrasenia(): string {
        return this.contrasenia;
    }

    public setContrasenia(contrasenia: string): void {
        this.contrasenia = contrasenia;
    }


    public getRutaimagen(): string {
        return this.rutaimagen;
    }

    public setRutaimagen(rutaimagen: string): void {
        this.rutaimagen = rutaimagen;
    }


    public getRoles(): Rol {
        return this.roles;
    }

    public setRoles(roles: Rol): void {
        this.roles = roles;
    }


    public getFkidrol(): number {
        return this.fkidrol;
    }

    public setFkidrol(fkidrol: number): void {
        this.fkidrol = fkidrol;
    }

    public getPkidusuario(): number {
        return this.pkidusuario;
    }

    public setPkidusuario(pkidusuario: number): void {
        this.pkidusuario = pkidusuario;
    }
}