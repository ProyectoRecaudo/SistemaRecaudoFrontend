//reflejo de la entidad de la base de datos de tmodulo
export class Modulo {

    private pkidmodulo: number;
    private nombremodulo: string;
    private moduloactivo: string;
    private icono: string;
    private nombrepermiso: string;

    public getPkidmodulo(): number {
        return this.pkidmodulo;
    }

    public setPkidmodulo(pkidmodulo: number
    ): void {
        this.pkidmodulo = pkidmodulo;
    }

    public getNombremodulo(): string {
        return this.nombremodulo;
    }

    public setNombremodulo(nombremodulo: string
    ): void {
        this.nombremodulo = nombremodulo;
    }

    public getModuloactivo(): boolean {
        return Boolean(this.moduloactivo);
    }

    public setModuloactivo(moduloactivo: boolean
    ): void {
        this.moduloactivo = String(moduloactivo);
    }

    public getIcono(): string {
        return this.icono;
    }

    public setIcono(icono: string
    ): void {
        this.icono = icono;
    }

    public getNombrepermiso(): string {
        return this.nombrepermiso;
    }

    public setNombrepermiso(nombrepermiso: string): void {
        this.nombrepermiso = nombrepermiso;
    }



}