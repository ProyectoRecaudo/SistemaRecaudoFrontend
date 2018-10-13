export class TarifaPuesto {
    constructor(
        public valortarifapuesto: number,
        public numeroresoluciontarifapuesto: string,
        public tarifapuestoactivo: boolean,
        public fkidplaza: string,
        public documentoresoluciontarifapuesto?: string,
        public pkidpuesto?: number
    ) { }
}
