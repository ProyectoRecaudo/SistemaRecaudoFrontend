export interface SectorInterface {
    pkidsector: number;
    codigosector: string;
    nombresector: string;
    sectoractivo: boolean;
    fkidzona: number;
    nombrezona: string;
    fkidtiposector: number;
    nombretiposector: string;
    fkidplaza: number;
    nombreplaza: string;
  }


  export interface PuestoInterface {
    pkidpuesto: number;
    codigopuesto: string;
    numeropuesto: string;
    alto: number;
    ancho: number;
    puestoactivo: boolean;
    fkidsector: number;
    nombresector: string;
    fkidestadoinfraestructura: number;
    fkidactividadcomercial: number;
    fkidtipopuesto: number;
    nombretipopuesto: string;
    imagenpuesto: string;
    //nombreplaza y nombre zona para el mattable, pueden ser vacias 
    nombreplaza: string;
    pkidplaza: number;
    nombrezona: string;
    pkizona: number;
  
  }