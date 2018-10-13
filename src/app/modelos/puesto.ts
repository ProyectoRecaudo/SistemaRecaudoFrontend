import { EstadoInfraestructura } from "./estadoinfraestructura";
import { TipoPuesto } from "./tipos/tipopuesto";
import { ActividadComercial } from "./activiadcomercial";
import { SectorInterface } from "./interfaces/interfaces.inteface";

//Reflejo identnidad tpuesto de la base de datos
export class Puesto {

    private pkidpuesto: number;
    private codigopuesto: string;
    private numeropuesto: string;
    private alto: number;
    private ancho: number;
    private imagenpuesto: string;
    private puestoactivo: boolean;
    private creacionpuesto: Date;
    private modificacionpuesto: Date;
    private sector: SectorInterface;
    private estadoinfraestructura: EstadoInfraestructura;
    private actividadcomercial: ActividadComercial;
    private tipopuesto: TipoPuesto;

    constructor(){
        
    }

    public getPkidpuesto(): number {
        return this.pkidpuesto;
    }

    public setPkidpuesto(pkidpuesto: number
    ): void {
        this.pkidpuesto = pkidpuesto;
    }

    public getCodigopuesto(): string {
        return this.codigopuesto;
    }

    public setCodigopuesto(codigopuesto: string
    ): void {
        this.codigopuesto = codigopuesto;
    }

    public getNumeropuesto(): string {
        return this.numeropuesto;
    }

    public setNumeropuesto(numeropuesto: string
    ): void {
        this.numeropuesto = numeropuesto;
    }

    public getAlto(): number {
        return this.alto;
    }

    public setAlto(alto: number
    ): void {
        this.alto = alto;
    }

    public getAncho(): number {
        return this.ancho;
    }

    public setAncho(ancho: number
    ): void {
        this.ancho = ancho;
    }

    public getImagenpuesto(): string {
        return this.imagenpuesto;
    }

    public setImagenpuesto(imagenpuesto: string
    ): void {
        this.imagenpuesto = imagenpuesto;
    }

    public getPuestoactivo(): boolean {
        return this.puestoactivo;
    }

    public setPuestoactivo(puestoactivo: boolean
    ): void {
        this.puestoactivo = puestoactivo;
    }

    public getCreacionpuesto(): Date {
        return this.creacionpuesto;
    }

    public setCreacionpuesto(creacionpuesto: Date
    ): void {
        this.creacionpuesto = creacionpuesto;
    }

    public getModificacionpuesto(): Date {
        return this.modificacionpuesto;
    }

    public setModificacionpuesto(modificacionpuesto: Date
    ): void {
        this.modificacionpuesto = modificacionpuesto;
    }

    public getSector(): SectorInterface {
        return this.sector;
    }

    public setSector(sector: SectorInterface
    ): void {
        this.sector = sector;
    }

    public getEstadoinfraestructura(): EstadoInfraestructura {
        return this.estadoinfraestructura;
    }

    public setEstadoinfraestructura(estadoinfraestructura: EstadoInfraestructura
    ): void {
        this.estadoinfraestructura = estadoinfraestructura;
    }

    public getActividadcomercial(): ActividadComercial {
        return this.actividadcomercial;
    }

    public setActividadcomercial(actividadcomercial: ActividadComercial
    ): void {
        this.actividadcomercial = actividadcomercial;
    }

    public getTipopuesto(): TipoPuesto {
        return this.tipopuesto;
    }

    public setTipopuesto(tipopuesto: TipoPuesto): void {
        this.tipopuesto = tipopuesto;
    }



}