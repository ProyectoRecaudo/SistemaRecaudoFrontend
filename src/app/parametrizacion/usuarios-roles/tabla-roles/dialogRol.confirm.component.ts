import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RolesServices } from '../../../servicios/rolesServices.services';
import { DialogData } from '../../../servicios/globales';


@Component({
    selector: 'app-dialog-interface',
    template: `
    <h1 mat-dialog-title>¿Esta seguro de que eliminara el Rol {{nombre}} ?</h1>
    <div mat-dialog-actions>
     <button mat-button (click)="onNoClick()">Cancelar</button>
    <button mat-button cdkFocusInitial  (click)="eliminarRol()">Eliminar</button>
    </div>
        
    `,
    providers: [RolesServices]

})
export class DialogConfirmacionRol implements DialogData {
    nombre: string;
    id: number;
    //variables de la interfaz
   
    //variable respuesta servidor
    public respuesta ;

    constructor(public dialogRef: MatDialogRef<DialogConfirmacionRol>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData, private _RolServices: RolesServices) {

        this.nombre = data['nombre'];
        this.id = data['id'];

    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    //Metodo q elimina el rol desde la base de datos
    eliminarRol() {
        this._RolServices.eliminarRol(this.id).subscribe(
            respose => {
                this.respuesta = respose;
                if (this.respuesta.length <= 1) {
                    this.respuesta = 'Error en el servidor, eliminar un rol';
                    console.log('Error en el servidor, eliminar un rol');
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