import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from './tabla-generic.component';
import { GenericServices } from '../../servicios/genericServices.services';


@Component({
    selector: 'app-dialog-interface',
    template: `
    <h1 mat-dialog-title>¿Esta seguro de que eliminara este registro?</h1>
    <div mat-dialog-actions>
     <button mat-button (click)="onNoClick()">Cancelar</button>
    <button mat-button cdkFocusInitial  (click)="eliminarUsuario()">Eliminar</button>
    </div>

    `,
    providers: [GenericServices]

})
export class DialogConfirmacionGenericComponent implements DialogData {
    //variables de la interfaz
    nombreUser: string;
    idUser: number;
    //variable respuesta servidor
    public respuesta ;

    constructor(public dialogRef: MatDialogRef<DialogConfirmacionGenericComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData, private _genericServices: GenericServices) {

        this.nombreUser = data['nombreUser'];
        this.idUser = data['idUser'];

    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    //Metodo q elimina el usuario desde la base de datos
    eliminarUsuario() {
    console.log("primary key;")
    console.log(this.nombreUser);
        this._genericServices.eliminarUsuario(this.idUser,this.nombreUser).subscribe(
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
