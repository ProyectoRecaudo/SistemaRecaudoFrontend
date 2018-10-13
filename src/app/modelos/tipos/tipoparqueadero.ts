//reflejo identidad Tipo parqueadero
export class TipoParqueadero {

    private pkidtipoparqueadero: number;
    private codigotipoparqueadero: string;
    private nombretipoparqueadero: string;
    private descripciontipoparqueadero: string;
    private creaciontipoparqueadero: Date;
    private modificaciontipoparqueadero: Date;
    private tipoparqueaderoactivo: boolean;

    constructor(){
        
    }

    public getPkidtipoparqueadero(): number {
        return this.pkidtipoparqueadero;
    }

    public setPkidtipoparqueadero(pkidtipoparqueadero: number
    ): void {
        this.pkidtipoparqueadero = pkidtipoparqueadero;
    }

    public getCodigotipoparqueadero(): string {
        return this.codigotipoparqueadero;
    }

    public setCodigotipoparqueadero(codigotipoparqueadero: string
    ): void {
        this.codigotipoparqueadero = codigotipoparqueadero;
    }

    public getNombretipoparqueadero(): string {
        return this.nombretipoparqueadero;
    }

    public setNombretipoparqueadero(nombretipoparqueadero: string
    ): void {
        this.nombretipoparqueadero = nombretipoparqueadero;
    }

    public getDescripciontipoparqueadero(): string {
        return this.descripciontipoparqueadero;
    }

    public setDescripciontipoparqueadero(descripciontipoparqueadero: string
    ): void {
        this.descripciontipoparqueadero = descripciontipoparqueadero;
    }

    public getCreaciontipoparqueadero(): Date {
        return this.creaciontipoparqueadero;
    }

    public setCreaciontipoparqueadero(creaciontipoparqueadero: Date
    ): void {
        this.creaciontipoparqueadero = creaciontipoparqueadero;
    }

    public getModificaciontipoparqueadero(): Date {
        return this.modificaciontipoparqueadero;
    }

    public setModificaciontipoparqueadero(modificaciontipoparqueadero: Date
    ): void {
        this.modificaciontipoparqueadero = modificaciontipoparqueadero;
    }

    public isTipoparqueaderoactivo(): boolean {
        return this.tipoparqueaderoactivo;
    }

    public setTipoparqueaderoactivo(tipoparqueaderoactivo: boolean): void {
        this.tipoparqueaderoactivo = tipoparqueaderoactivo;
    }


}