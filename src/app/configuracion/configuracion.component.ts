import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { ConfiguracionService } from '../servicios/configuracion.service';
import { Configuracion } from '../modelos/configuracion.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-configuracion',
    templateUrl: './configuracion.component.html',
    providers: [ConfiguracionService]
})
export class ConfiguracionComponent implements OnInit {

    // -------------------------------------------------------------------------
    // Propiedades
    // -------------------------------------------------------------------------
    /**
     * Arreglo de configuraciones
     */
    configuraciones: Configuracion[] = [];

    /**
     * Formulario de configuraciones
     */
    configuracionForm: FormGroup;

    /**
     * configuracion numero de factura
     */
    noFactura: Configuracion;

    configuracion1: Configuracion;

    configuracion2: Configuracion;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    /**
     * Constructor del comnponente de configuraciones
     * @param _configuracionService Servicio de configuraciones
     */
    constructor(
        private _configuracionService: ConfiguracionService
    ) {

    }

    ngOnInit() {
        this.inicializarFormulario();
        this.listarConfiguraciones();
    }

    // -------------------------------------------------------------------------
    // Métodos
    // -------------------------------------------------------------------------
    /**
     * Inicializa el formulario
     */
    inicializarFormulario() {
        this.configuracionForm = new FormGroup({
            noFactura: new FormControl(null, Validators.required),
            conf1: new FormControl(false),
            conf2: new FormControl(null, Validators.required)
        });
    }

    /**
     * Lista las configuraciones registradas en la base de datos
     */
    listarConfiguraciones() {
        this._configuracionService.consultarConfiguraciones().subscribe(
            resp => {
                this.configuraciones = resp.configuracion;
                console.log(this.configuraciones);
                this.inicializaFormularioCampos();
            }
        );
    }

    cambiarEstadoConfig(pConfiguracion: Configuracion) {

    }

    /**
     * Inicializa el formulario con la informacion de las configuraciones actualizada
     */
    inicializaFormularioCampos() {
        this.noFactura = this.buscarConfiguracion('NoFactura');
        this.configuracion1 = this.buscarConfiguracion('Configuracion 1');
        this.configuracion2 = this.buscarConfiguracion('Configuracion 2');

        if (this.noFactura !== null && this.configuracion1 !== null && this.configuracion2 !== null) {
            this.configuracionForm = new FormGroup({
                noFactura: new FormControl(this.noFactura.valorconfiguracion, Validators.required),
                conf1: new FormControl(this.configuracion1.valorconfiguracion === 'true' ? true : false),
                conf2: new FormControl(this.configuracion2.valorconfiguracion, Validators.required)
            });

        } else {
            this.configuracionForm = new FormGroup({
                noFactura: new FormControl(null, Validators.required),
                conf1: new FormControl(false),
                conf2: new FormControl(null, Validators.required)
            });
        }
    }

    guardarCambios() {
        if (this.noFactura !== null && this.configuracion1 !== null && this.configuracion2 !== null) {
            this.noFactura.valorconfiguracion = this.configuracionForm.value.noFactura;
            this.configuracion1.valorconfiguracion = String(this.configuracionForm.value.conf1);
            this.configuracion2.valorconfiguracion = this.configuracionForm.value.conf2;

            console.log(this.configuraciones);
            console.log(this.configuracion1);
            this._configuracionService.editarConfiguracion(this.configuraciones).subscribe(
                resp => {
                    console.log(resp);
                    this.listarConfiguraciones();
                }
            );
        }
    }

    /**
     * Busca una configuración en el arreglo de configuraciones por su clave
     * @param pClaveConfiguracion Clave de la configuracion a buscar
     */
    buscarConfiguracion(pClaveConfiguracion: string): Configuracion {
        let bandera = false;
        let configuracionEncontrada = null;

        for (let i = 0; i < this.configuraciones.length && !bandera; i++) {
            const miConf = this.configuraciones[i];
            if (miConf.claveconfiguracion === pClaveConfiguracion) {
                configuracionEncontrada = miConf;
                bandera = !bandera;
            }
        }

        return configuracionEncontrada;
    }


}
