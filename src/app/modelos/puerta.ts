export class Puerta {
    constructor(
        public nombrepuerta: string,
        public puertaactivo: boolean,
        public fkidplaza: string,
        public codigopuerta?: string,
        public pkidpuerta?: string,
        public pkidplaza?: string,
        public nombreplaza?: string
    ) {
    }
}
