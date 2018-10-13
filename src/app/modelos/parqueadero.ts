import { PlazaMercado } from "./plaza-mercado";
import { TipoParqueadero } from "./tipos/tipoparqueadero";

//reflejo entidad tparqueadero
export class Parqueadero {

    private pkidparqueadero: number;
    private codigoparqueadero: string;
    private numeroparqueadero: string;
    private parqueaderoactivo: boolean;
    private creacionparqueadero: Date;
    private modificacionparqueadero: Date;
    private tipoparqueadero: TipoParqueadero;
    public plaza: PlazaMercado;

    constructor(){
        
    }

    public getPkidparqueadero(): number {
        return this.pkidparqueadero;
    }

    public setPkidparqueadero(pkidparqueadero: number
    ): void {
        this.pkidparqueadero = pkidparqueadero;
    }

    public getCodigoparqueadero(): string {
        return this.codigoparqueadero;
    }

    public setCodigoparqueadero(codigoparqueadero: string
    ): void {
        this.codigoparqueadero = codigoparqueadero;
    }

    public getNumeroparqueadero(): string {
        return this.numeroparqueadero;
    }

    public setNumeroparqueadero(numeroparqueadero: string
    ): void {
        this.numeroparqueadero = numeroparqueadero;
    }

    public getParqueaderoactivo(): boolean {
        return this.parqueaderoactivo;
    }

    public setParqueaderoactivo(parqueaderoactivo: boolean
    ): void {
        this.parqueaderoactivo = parqueaderoactivo;
    }

    public getCreacionparqueadero(): Date {
        return this.creacionparqueadero;
    }

    public setCreacionparqueadero(creacionparqueadero: Date
    ): void {
        this.creacionparqueadero = creacionparqueadero;
    }

    public getModificacionparqueadero(): Date {
        return this.modificacionparqueadero;
    }

    public setModificacionparqueadero(modificacionparqueadero: Date
    ): void {
        this.modificacionparqueadero = modificacionparqueadero;
    }

    public getTipoparqueadero(): TipoParqueadero {
        return this.tipoparqueadero;
    }

    public setTipoparqueadero(tipoparqueadero: TipoParqueadero
    ): void {
        this.tipoparqueadero = tipoparqueadero;
    }

    public getPlaza(): PlazaMercado {
        return this.plaza;
    }

    public setPlaza(plaza: PlazaMercado): void {
        this.plaza = plaza;
    }


}