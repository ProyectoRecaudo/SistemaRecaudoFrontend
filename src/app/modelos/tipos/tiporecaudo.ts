
export class TipoRecaudo{

    public pkidtiporecaudo: number;
    private codigotiporecaudo: string;
    public nombretiporecaudo: string;
    private tiporecaudoactivo: boolean;
    private creaciontiporecaudo: Date;
    private modificaciontiporecaudo: Date;

    constructor(){
        
    }

	public getPkidtiporecaudo(): number
 {
		return this.pkidtiporecaudo;
	}

	public setPkidtiporecaudo(pkidtiporecaudo: number
): void {
		this.pkidtiporecaudo = pkidtiporecaudo;
	}

	public getCodigotiporecaudo(): string
 {
		return this.codigotiporecaudo;
	}

	public setCodigotiporecaudo(codigotiporecaudo: string
): void {
		this.codigotiporecaudo = codigotiporecaudo;
	}

	public getNombretiporecaudo(): string
 {
		return this.nombretiporecaudo;
	}

	public setNombretiporecaudo(nombretiporecaudo: string
): void {
		this.nombretiporecaudo = nombretiporecaudo;
	}

	public getTiporecaudoactivo(): boolean
 {
		return this.tiporecaudoactivo;
	}

	public setTiporecaudoactivo(tiporecaudoactivo: boolean
): void {
		this.tiporecaudoactivo = tiporecaudoactivo;
	}

	public getCreaciontiporecaudo(): Date
 {
		return this.creaciontiporecaudo;
	}

	public setCreaciontiporecaudo(creaciontiporecaudo: Date
): void {
		this.creaciontiporecaudo = creaciontiporecaudo;
	}

	public getModificaciontiporecaudo(): Date {
		return this.modificaciontiporecaudo;
	}

	public setModificaciontiporecaudo(modificaciontiporecaudo: Date): void {
		this.modificaciontiporecaudo = modificaciontiporecaudo;
	}





}