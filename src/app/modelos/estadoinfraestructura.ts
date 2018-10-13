//reflejo identidad de la base de datos
export class EstadoInfraestructura {

    public pkidestadoinfraestructura: number;
    private codigoestadoinfraestructura: string;
    public nombreestadoinfraestructura: string;
    private descripcionestadoinfraestructura: string;
    private estadoinfraestructuraactivo: boolean;
    private creacionestadoinfraestructura: Date;
    private modificacionestadoinfraestructura: Date;

    constructor() {

    }

    public getPkidestado(): number {
        return this.pkidestadoinfraestructura;
    }

    public setPkidestado(pkidestadoinfraestructura: number
    ): void {
        this.pkidestadoinfraestructura = pkidestadoinfraestructura;
    }

    public getCodigoestado(): string {
        return this.codigoestadoinfraestructura;
    }

    public setCodigoestado(codigoestadoinfraestructura: string
    ): void {
        this.codigoestadoinfraestructura = codigoestadoinfraestructura;
    }

    public getNombreestado(): string {
        return this.nombreestadoinfraestructura;
    }

    public setNombreestado(nombreestadoinfraestructura: string
    ): void {
        this.nombreestadoinfraestructura = nombreestadoinfraestructura;
    }

    public getDescripcionestado(): string {
        return this.descripcionestadoinfraestructura;
    }

    public setDescripcionestado(descripcionestadoinfraestructura: string
    ): void {
        this.descripcionestadoinfraestructura = descripcionestadoinfraestructura;
    }

    public getEstadoactivo(): boolean {
        return this.estadoinfraestructuraactivo;
    }

    public setEstadoactivo(estadoinfraestructuraactivo: boolean
    ): void {
        this.estadoinfraestructuraactivo = estadoinfraestructuraactivo;
    }

    public getCreacionestado(): Date {
        return this.creacionestadoinfraestructura;
    }

    public setCreacionestado(creacionestadoinfraestructura: Date
    ): void {
        this.creacionestadoinfraestructura = creacionestadoinfraestructura;
    }

    public getModificacionestado(): Date {
        return this.modificacionestadoinfraestructura;
    }

    public setModificacionestado(modificacionestadoinfraestructura: Date): void {
        this.modificacionestadoinfraestructura = modificacionestadoinfraestructura;
    }



}