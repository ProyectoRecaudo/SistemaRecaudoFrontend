import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";


@Component({
    selector: 'app-modal-confirmacion',
    templateUrl: './modalconfirmacion.html'
})

export class ModalConfirmacion implements OnInit {

    //datos que vienen desde el componente que lo llama
    @Input() datos: any = [];


    ngOnInit() {
    }
}