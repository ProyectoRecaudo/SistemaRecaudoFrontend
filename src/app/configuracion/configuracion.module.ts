import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ConfiguracionRoutes } from "./configuracion.routing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../app.module";
import { ConfiguracionComponent } from "./configuracion.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ConfiguracionRoutes),
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
    ],
    declarations: [ConfiguracionComponent]
})

export class ConfiguracionModule {}
