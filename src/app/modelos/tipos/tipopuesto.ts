export class TipoPuesto {

    public pkidtipopuesto: number;
    private codigotipopuesto: string;
    public nombretipopuesto: string;
    private descripciontipopuesto: string;
    private creaciontipopuesto: Date;
    private modificaciontipopuesto: Date;
    private tipopuestoactivo: boolean;

    constructor(){
        
    }

    public getPkidtipopuesto(): number {
        return this.pkidtipopuesto;
    }

    public setPkidtipopuesto(pkidtipopuesto: number
    ): void {
        this.pkidtipopuesto = pkidtipopuesto;
    }

    public getCodigotipopuesto(): string {
        return this.codigotipopuesto;
    }

    public setCodigotipopuesto(codigotipopuesto: string
    ): void {
        this.codigotipopuesto = codigotipopuesto;
    }

    public getNombretipopuesto(): string {
        return this.nombretipopuesto;
    }

    public setNombretipopuesto(nombretipopuesto: string
    ): void {
        this.nombretipopuesto = nombretipopuesto;
    }

    public getDescripciontipopuesto(): string {
        return this.descripciontipopuesto;
    }

    public setDescripciontipopuesto(descripciontipopuesto: string
    ): void {
        this.descripciontipopuesto = descripciontipopuesto;
    }

    public getCreaciontipopuesto(): Date {
        return this.creaciontipopuesto;
    }

    public setCreaciontipopuesto(creaciontipopuesto: Date
    ): void {
        this.creaciontipopuesto = creaciontipopuesto;
    }

    public getModificaciontipopuesto(): Date {
        return this.modificaciontipopuesto;
    }

    public setModificaciontipopuesto(modificaciontipopuesto: Date
    ): void {
        this.modificaciontipopuesto = modificaciontipopuesto;
    }

    public isTipopuestoactivo(): boolean {
        return this.tipopuestoactivo;
    }

    public setTipopuestoactivo(tipopuestoactivo: boolean): void {
        this.tipopuestoactivo = tipopuestoactivo;
    }


}