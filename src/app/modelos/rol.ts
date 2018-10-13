//Reflejo de la clase rol de la base de datos
export class Rol {

    //definicion explicita de los atributos
    public pkidrol: number;
    private codigorol: number;
    public nombrerol: string;
    private rolactivo: string;
    private descripcionrol: string;
    private creacionrol: Date;
    private modificacionrol: Date;
    private permiso: any[];
    constructor(
        pkidrol: number,
        codigorol: number,
        nombrerol: string,
        rolactivo: string,
        descripcionrol: string,
        creacionrol: Date,
        modificacionrol: Date,
        permiso: any

    ) {
        this.pkidrol = pkidrol;
        this.codigorol = codigorol;
        this.nombrerol = nombrerol;
        this.rolactivo = rolactivo;
        this.descripcionrol = descripcionrol;
        this.creacionrol = creacionrol;
        this.modificacionrol = modificacionrol;
        this.permiso = permiso;

    }
    public getPkidrol(): number {
        return this.pkidrol;
    }

    public setPkidrol(pkidrol: number
    ): void {
        this.pkidrol = pkidrol;
    }

    public getCodigoRol(): number {
        return this.codigorol;
    }

    public setCodigoRol(codigoRol: number
    ): void {
        this.codigorol = codigoRol;
    }

    public getNombreRol(): string {
        return this.nombrerol;
    }

    public setNombreRol(nombreRol: string
    ): void {
        this.nombrerol = nombreRol;
    }

    public getRolactivo(): boolean {
        return Boolean(this.rolactivo);
    }

    public setRolactivo(rolactivo: boolean
    ): void {
        this.rolactivo = String(rolactivo);
    }

    public getDescripcionRol(): string {
        return this.descripcionrol;
    }

    public setDescripcionRol(descripcionRol: string
    ): void {
        this.descripcionrol = descripcionRol;
    }

    public getCreacionrol(): Date {
        return this.creacionrol;
    }

    public setCreacionrol(creacionrol: Date
    ): void {
        this.creacionrol = creacionrol;
    }

    public getModificacionrol(): Date {
        return this.modificacionrol;
    }

    public setModificacionrol(modificacionrol: Date
    ): void {
        this.modificacionrol = modificacionrol;
    }

    public getPermiso(): any[] {
        return this.permiso;
    }

    public setPermiso(permiso: any): void {
        this.permiso = permiso;
    }

}