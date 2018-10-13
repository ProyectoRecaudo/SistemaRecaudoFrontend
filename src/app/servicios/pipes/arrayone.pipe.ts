import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'arrayOne' })
export class ArrayOne implements PipeTransform {


  transform(value: any): any {

    if (typeof (value) == 'boolean') {
      if (value == true || value == false) {
        if (value == true) {
          return "Activo";
        }
        else {
          return "Desactivado";

        }

      }

    } else {
      return value;

    }


  }


}
