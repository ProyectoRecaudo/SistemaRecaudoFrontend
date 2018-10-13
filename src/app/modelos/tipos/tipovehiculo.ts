//Reflejo entidad tipo vehiculo
export class TipoVehiculo {

    private pkidtipovehiculo: number;
    private codigotipovehiculo: string;
    private nombretipovehiculo: string;
    private descripciontipovehiculo: string;
    private creaciontipovehiculo: Date;
    private modificaciontipovehiculo: Date;
    private tipovehiculoactivo: boolean;

    constructor(){
        
    }

    public getPkidtipovehiculo(): number {
        return this.pkidtipovehiculo;
    }

    public setPkidtipovehiculo(pkidtipovehiculo: number
    ): void {
        this.pkidtipovehiculo = pkidtipovehiculo;
    }

    public getCodigotipovehiculo(): string {
        return this.codigotipovehiculo;
    }

    public setCodigotipovehiculo(codigotipovehiculo: string
    ): void {
        this.codigotipovehiculo = codigotipovehiculo;
    }

    public getNombretipovehiculo(): string {
        return this.nombretipovehiculo;
    }

    public setNombretipovehiculo(nombretipovehiculo: string
    ): void {
        this.nombretipovehiculo = nombretipovehiculo;
    }

    public getDescripciontipovehiculo(): string {
        return this.descripciontipovehiculo;
    }

    public setDescripciontipovehiculo(descripciontipovehiculo: string
    ): void {
        this.descripciontipovehiculo = descripciontipovehiculo;
    }

    public getCreaciontipovehiculo(): Date {
        return this.creaciontipovehiculo;
    }

    public setCreaciontipovehiculo(creaciontipovehiculo: Date
    ): void {
        this.creaciontipovehiculo = creaciontipovehiculo;
    }

    public getModificaciontipovehiculo(): Date {
        return this.modificaciontipovehiculo;
    }

    public setModificaciontipovehiculo(modificaciontipovehiculo: Date
    ): void {
        this.modificaciontipovehiculo = modificaciontipovehiculo;
    }

    public isTipovehiculoactivo(): boolean {
        return this.tipovehiculoactivo;
    }

    public setTipovehiculoactivo(tipovehiculoactivo: boolean): void {
        this.tipovehiculoactivo = tipovehiculoactivo;
    }





}