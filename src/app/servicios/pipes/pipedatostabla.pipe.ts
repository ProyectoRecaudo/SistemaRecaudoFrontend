import { Pipe, PipeTransform } from '@angular/core';
import { GLOBAL } from '../globales';


@Pipe({ name: 'DatosPipe' })
export class DatosPipe implements PipeTransform {



    transform(contenido: any): any {

        if (contenido != null) {

            if (contenido.toString().indexOf('../web/documentos')) {

                if(typeof(contenido)== 'boolean'){

                    if (contenido == true || contenido == false) {
                        if (contenido == true ) {
                            return "Activo";
                        }
                        else if(contenido == false ){
                            return "Inactivo";
                        }
                    }
                    else {
                        return contenido;
                    }
                }else{
                    return contenido;
                }
                    
            } else {

                const link = GLOBAL.urlImagen;
                const urlDocumento = contenido.toString().substring(3);
                const direccion = link + urlDocumento;
                //console.log(direccion);
                return `<a class="btn btn-outline-info" href="${direccion}" role="button" target="_blank">Ver Documento</a>`
            }

        } else {
            return contenido;
        }

    }


}