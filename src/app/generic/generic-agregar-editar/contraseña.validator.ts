import { AbstractControl, ValidatorFn } from '@angular/forms';

export function ValidateContrasenia(contrasenia1: string) : ValidatorFn{

    return(control: AbstractControl):{ [key: string]: boolean } => {
        if (control.value != contrasenia1) {
            return { validContra: true };
        }
        return  { validContra: false };
    }
}