import { PlazaMercado } from "./plaza-mercado";
import { Usuario } from "./usuario";

export class Zona {
    private pkidzona: number;
    private codigozona: string;
    private nombrezona: string;
    private zonaactivo: string;
    private creacionzona: Date;
    private modificacionzona: Date;
    public plaza: PlazaMercado;
    public usuario: Usuario;
   
    constructor() {

    }


    public getPkidzona(): number {
        return this.pkidzona;
    }

    public setPkidzona(pkidzona: number
    ): void {
        this.pkidzona = pkidzona;
    }

    public getCodigozona(): string {
        return this.codigozona;
    }

    public setCodigozona(codigozona: string
    ): void {
        this.codigozona = codigozona;
    }

    public getNombrezona(): string {
        return this.nombrezona;
    }

    public setNombrezona(nombrezona: string
    ): void {
        this.nombrezona = nombrezona;
    }

    public getZonaactivo(): boolean {
        return Boolean(this.zonaactivo);
    }

    public setZonaactivo(zonaactivo: boolean
    ): void {
        this.zonaactivo = String(zonaactivo);
    }

    public getCreacionzona(): Date {
        return this.creacionzona;
    }

    public setCreacionzona(creacionzona: Date
    ): void {
        this.creacionzona = creacionzona;
    }

    public getModificacionzona(): Date {
        return this.modificacionzona;
    }

    public setModificacionzona(modificacionzona: Date
    ): void {
        this.modificacionzona = modificacionzona;
    }


    public getPlaza(): PlazaMercado {
        return this.plaza;
    }

    public setPlaza(plaza: PlazaMercado
    ): void {
        this.plaza = plaza;
    }

    public getUsuario(): Usuario {
        return this.usuario;
    }

    public setUsuario(usuario: Usuario): void {
        this.usuario = usuario;
    }


}