export class ActividadComercial {

    public pkidactividadcomercial: number;
    private codigoactividadcomercial: string;
    public nombreactividadcomercial: string;
    private descripcionactividadcomercial: string;
    private actividadcomercialactivo: boolean;
    private creacionactividadcomercial: Date;
    private modificacionactividadcomercial: Date;
 
    constructor(){
        
    }

    public getPkidactividad(): number {
        return this.pkidactividadcomercial;
    }

    public setPkidactividad(pkidactividadcomercial: number
    ): void {
        this.pkidactividadcomercial = pkidactividadcomercial;
    }

    public getCodigoactividad(): string {
        return this.codigoactividadcomercial;
    }

    public setCodigoactividad(codigoactividadcomercial: string
    ): void {
        this.codigoactividadcomercial = codigoactividadcomercial;
    }

    public getNombreactividad(): string {
        return this.nombreactividadcomercial;
    }

    public setNombreactividad(nombreactividadcomercial: string
    ): void {
        this.nombreactividadcomercial = nombreactividadcomercial;
    }

    public getDescripcionactividad(): string {
        return this.descripcionactividadcomercial;
    }

    public setDescripcionactividad(descripcionactividadcomercial: string
    ): void {
        this.descripcionactividadcomercial = descripcionactividadcomercial;
    }

    public getActividadactivo(): boolean {
        return this.actividadcomercialactivo;
    }

    public setActividadactivo(actividadcomercialactivo: boolean
    ): void {
        this.actividadcomercialactivo = actividadcomercialactivo;
    }

    public getCreacionactividad(): Date {
        return this.creacionactividadcomercial;
    }

    public setCreacionactividad(creacionactividadcomercial: Date
    ): void {
        this.creacionactividadcomercial = creacionactividadcomercial;
    }

    public getModificacionactividad(): Date {
        return this.modificacionactividadcomercial;
    }

    public setModificacionactividad(modificacionactividadcomercial: Date): void {
        this.modificacionactividadcomercial = modificacionactividadcomercial;
    }


}