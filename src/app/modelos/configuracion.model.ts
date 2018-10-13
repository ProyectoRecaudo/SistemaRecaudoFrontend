export class Configuracion {

    constructor(
        public claveconfiguracion: string,
        public valorconfiguracion: string,
        public pkidconfiguracion?: string,
        public fechaconfiguracion?: string,
        public valoranteriorconfiguracion?: string
    ) {
    }

    getValorConfiguracion() {
        const respuesta: boolean = Boolean(this.valorconfiguracion);
        console.log(respuesta);
    }

    setValorConfiguracion(pValor: String) {
        this.valorconfiguracion = String(pValor);
        console.log(this.valorconfiguracion);
    }
}
