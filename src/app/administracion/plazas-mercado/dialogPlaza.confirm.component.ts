import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RolesServices } from '../../servicios/rolesServices.services';
import { DialogData } from '../../servicios/globales';
import { PlazaServices } from '../../servicios/plazaServices.services';
//import { RolesServices } from '../../servicios/rolesServices.services';
//import { DialogDataRol } from './tabla-roles.component';


@Component({
    selector: 'app-dialog-interface',
    template: `
    <h1 mat-dialog-title>¿Esta seguro de que eliminara la plaza {{nombre}} ?</h1>
    <div mat-dialog-actions>
     <button mat-button (click)="onNoClick()">Cancelar</button>
    <button mat-button cdkFocusInitial  (click)="eliminarPlaza()">Eliminar</button>
    </div>
        
    `,
    providers: [PlazaServices]

})

/**
 * Clase que se encargara de gestionar los mensaje para la eliminacion de cualquier tipo
 */
export class DialogConfirmacionPlaza implements DialogData {
    nombre: string;
    id: number;
    //variables de la interfaz
  
    //variable respuesta servidor
    public respuesta ;

    constructor(public dialogRef: MatDialogRef<DialogConfirmacionPlaza>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData, private _plazaServices: PlazaServices) {

        this.nombre = data['nombre'];
        this.id = data['id'];

    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    
    //Metodo q elimina el rol desde la base de datos
    eliminarPlaza() {
        this._plazaServices.eliminarPlaza(this.id).subscribe(
            respose => {
                this.respuesta = respose;
                if (this.respuesta.length <= 1) {
                    this.respuesta = 'Error en el servidor';
                    console.log('Error en el servidor');
                }else{
                    this.dialogRef.close({respuesta:this.respuesta.msg,status:this.respuesta.status});
                    
                }

            },
            error => {
                console.log("Error de conexion");

            }

        );
    }

}