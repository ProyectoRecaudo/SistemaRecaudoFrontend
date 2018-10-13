

export class Excepcion {

    private pkidexepcion: number;
    private fkidusuario: number;
    private nombreusuario: string;
    private modulo: string;
    private metodo: string;
    private mensaje: string;
    private tipoexcepcion: string;
    private pila: string;
    private origen: string;
    private creacionexcepcion: Date;

    public getPkidexepcion(): number {
        return this.pkidexepcion;
    }

    public setPkidexepcion(pkidexepcion: number
    ): void {
        this.pkidexepcion = pkidexepcion;
    }

    public getFkidusuario(): number {
        return this.fkidusuario;
    }

    public setFkidusuario(fkidusuario: number
    ): void {
        this.fkidusuario = fkidusuario;
    }

    public getNombreusuario(): string {
        return this.nombreusuario;
    }

    public setNombreusuario(nombreusuario: string): void {
        this.nombreusuario = nombreusuario;
    }



    public getModulo(): string {
        return this.modulo;
    }

    public setModulo(modulo: string
    ): void {
        this.modulo = modulo;
    }

    public getMetodo(): string {
        return this.metodo;
    }

    public setMetodo(metodo: string
    ): void {
        this.metodo = metodo;
    }

    public getMensaje(): string {
        return this.mensaje;
    }

    public setMensaje(mensaje: string): void {
        this.mensaje = mensaje;
    }

    public getTipoexcepcion(): string {
        return this.tipoexcepcion;
    }

    public setTipoexcepcion(tipoexcepcion: string
    ): void {
        this.tipoexcepcion = tipoexcepcion;
    }

    public getPila(): string {
        return this.pila;
    }

    public setPila(pila: string
    ): void {
        this.pila = pila;
    }

    public getOrigen(): string {
        return this.origen;
    }

    public setOrigen(origen: string): void {
        this.origen = origen;
    }




    public getCreacionexcepcion(): Date {
        return this.creacionexcepcion;
    }

    public setCreacionexcepcion(creacionexcepcion: Date): void {
        this.creacionexcepcion = creacionexcepcion;
    }




}