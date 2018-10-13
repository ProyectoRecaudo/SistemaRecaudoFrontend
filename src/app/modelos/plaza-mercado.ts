import { TipoRecaudo } from "./tipos/tiporecaudo";

export class PlazaMercado {

    private pkidplaza: number;
    private codigoplaza: string;
    public nombreplaza: string;
    private plazaactivo: string;
    private creacionplaza: Date;
    private modificacion: Date;
    private tiporecaudo: TipoRecaudo[];
    constructor(){
        
    }

	public getTiporecaudo(): TipoRecaudo[] {
		return this.tiporecaudo;
	}

	public setTiporecaudo(tiporecaudo: TipoRecaudo[]): void {
		this.tiporecaudo = tiporecaudo;
	}


    

    public getPkidplaza(): number {
        return this.pkidplaza;
    }

    public setPkidplaza(pkidplaza: number
    ): void {
        this.pkidplaza = pkidplaza;
    }

    public getCodigoplaza(): string {
        return this.codigoplaza;
    }

    public setCodigoplaza(codigoplaza: string
    ): void {
        this.codigoplaza = codigoplaza;
    }

    public getNombreplaza(): string {
        return this.nombreplaza;
    }

    public setNombreplaza(nombreplaza: string
    ): void {
        this.nombreplaza = nombreplaza;
    }

    public getPlazaactivo(): boolean {
        return Boolean(this.plazaactivo);
    }

    public setPlazaactivo(plazaactivo: boolean
    ): void {
        this.plazaactivo = String(plazaactivo);
    }

    public getCreacionplaza(): Date {
        return this.creacionplaza;
    }

    public setCreacionplaza(creacionplaza: Date
    ): void {
        this.creacionplaza = creacionplaza;
    }

    public getModificacion(): Date {
        return this.modificacion;
    }

    public setModificacion(modificacion: Date): void {
        this.modificacion = modificacion;
    }





}