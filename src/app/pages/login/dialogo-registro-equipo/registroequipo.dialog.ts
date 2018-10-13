import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EquipoService } from '../../../servicios/equipoService.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { EquiposInterface } from '../../../administracion/equipos/equipos.component';

@Component({
    selector: 'app-dialog-interface',
    templateUrl: './dialogoequipo.dialog.html',
    providers: [EquipoService]

})


export class DialogRegistroEquipo implements OnInit {
    //informacion que llega por parametro
    nombreusuario: string;
    fkidusuario: number;
    identificador: string;

    nuevoEquipoForm: FormGroup;//validacion de formulario
    guardando = false;//para el mat progress


    //mensaje dialog error creacion de Equipo
    msg: string = '';

    //respuesta del servidor
    public respuesta;

    //token
    public token = null;

    //Objeto de tipo 
    public identidad: EquiposInterface;

    constructor(
        public dialogRef: MatDialogRef<DialogRegistroEquipo>,
        @Inject(MAT_DIALOG_DATA) public data,
        private _equipoService: EquipoService,
        private fb: FormBuilder,
    ) {
        this.nombreusuario = data['nombreusuario'];
        this.fkidusuario = data['fkidusuario'];
        this.identificador = data['identificador'];
        this.token = data['token'];

        //equipo activo por defecto
        this.identidad = {
            codigoequipo: '', descripcionequipo: '', equipoactivo: true, identificacion: null, identificacionequipo: this.identificador, nombrequipo: '', nombreusuario: '', pkidequipo: null, fkidusuario: this.fkidusuario
        };
    }


    ngOnInit() {
        this.nuevoEquipoForm = this.fb.group({
            nombrequipo: ['', Validators.required],
            codigoequipo: [''],
            descripcionequipo: ['']

        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }


    //metodo para registrar un equipo en la tabla equipos
    registrarEquipo() {
        this.guardando = !this.guardando;
        this.identidad.codigoequipo = (this.nuevoEquipoForm.get('codigoequipo').value);
        this.identidad.nombrequipo = (this.nuevoEquipoForm.get('nombrequipo').value);
        this.identidad.descripcionequipo = this.nuevoEquipoForm.get('descripcionequipo').value;

        console.log(this.identidad);

        this._equipoService.crearEquipo(this.identidad, this.token).subscribe(
            response => {
                this.respuesta = response;
                if (this.respuesta.length <= 1) {
                    this.msg = 'Error en el servidor';
                    console.log('Error en el servidor');
                } else {
                    //this.msg = this.respuesta.msg;
                    this.guardando = false;
                    if (this.respuesta.status == "Exito") {

                        this.dialogRef.close({ respuesta: this.respuesta.msg, status: this.respuesta.status });
                    } else {
                        this.msg = this.respuesta.msg;
                    }

                }
            },
            error => {
                this.msg = 'Error en el servidor';
                console.log('Error en el servidor' + error);
            }

        );


    }

}


