export class TipoSector {

	private pkidtiposector: number;
	private codigotiposector: string;
	private nombretiposector: string;
	private descripciontiposector: string;
	private tiposectoractivo: string;
	private creacionriposector: Date;
	private modificaciontiposector: Date;

	constructor() {

	}


	public getPkidtiposector(): number {
		return this.pkidtiposector;
	}

	public setPkidtiposector(pkidtiposector: number
	): void {
		this.pkidtiposector = pkidtiposector;
	}

	public getCodigotiposector(): string {
		return this.codigotiposector;
	}

	public setCodigotiposector(codigotiposector: string
	): void {
		this.codigotiposector = codigotiposector;
	}

	public getNombretiposector(): string {
		return this.nombretiposector;
	}

	public setNombretiposector(nombretiposector: string
	): void {
		this.nombretiposector = nombretiposector;
	}

	public getDescripciontiposector(): string {
		return this.descripciontiposector;
	}

	public setDescripciontiposector(descripciontiposector: string
	): void {
		this.descripciontiposector = descripciontiposector;
	}

	public getTiposectoractivo(): boolean {
		return Boolean(this.tiposectoractivo);
	}

	public setTiposectoractivo(tiposectoractivo: boolean
	): void {
		this.tiposectoractivo = String(tiposectoractivo);
	}

	public getCreacionriposector(): Date {
		return this.creacionriposector;
	}

	public setCreacionriposector(creacionriposector: Date
	): void {
		this.creacionriposector = creacionriposector;
	}

	public getModificaciontiposector(): Date {
		return this.modificaciontiposector;
	}

	public setModificaciontiposector(modificaciontiposector: Date): void {
		this.modificaciontiposector = modificaciontiposector;
	}





}