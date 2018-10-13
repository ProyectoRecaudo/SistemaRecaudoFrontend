import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { VerificaTokenService } from '../verificaToken.service';
import { GLOBAL } from '../globales';
import swal from 'sweetalert2';

@Injectable()
export class TokenGuard implements CanActivate {
    respuesta = false;
    constructor(public _tokenService: VerificaTokenService, public router: Router) { }

    canActivate(): Promise<boolean> | boolean {
        return this.verificaExpiracionToken();
    }

    verificaExpiracionToken(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this._tokenService.validarToken().subscribe(
                (resp) => {
                    if (resp !== true) {

                        swal('ACCESO DENEGADO', 'Es necesario volver a iniciar sesión', 'error');
                        this.router.navigate(['/' + GLOBAL.urlBase + '/login', 1]);
                        resolve(false);
                    } else {
                        // console.log('entro al resolve');
                        resolve(true);
                    }
                },
                () => {
                    // console.log('entro al reject');
                    reject(false);
                }
            );
        });
    }

}
