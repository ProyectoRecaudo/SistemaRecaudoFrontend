export class TarifaInteres {
    constructor(
        public valortarifainteres: number,
        public descripciontarifainteres: string,
        public numeroresoluciontarifainteres: string,
        public tarifainteresactivo: boolean,
        public fkidplaza: string,
        public documentoresoluciontarifainteres?: string,
        public pkidtarifainteres?: number
    ) { }
}
