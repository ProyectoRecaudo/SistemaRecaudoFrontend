export class TarifaPuestoEventual {
    constructor(
        public valortarifapuestoeventual: number,
        public numeroresoluciontarifapuestoeventual: string,
        public tarifapuestoeventualactivo: boolean,
        public descripciontarifapuestoeventual: string,
        public fkidplaza: string,
        public documentoresoluciontarifapuestoeventual?: string,
        public pkidtarifapuestoeventual?: number,
        public pkidplaza?: number
    ) { }
}
