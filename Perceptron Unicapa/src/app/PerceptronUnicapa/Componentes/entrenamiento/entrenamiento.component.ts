import { Component, OnInit, ViewChild } from '@angular/core';
import { StepEntradasComponent } from './secciones/step-entradas/step-entradas.component';
import { StepPesosYUmbralesComponent } from './secciones/step-pesos-y-umbrales/step-pesos-y-umbrales.component';
import { StepEntrenamientoComponent } from './secciones/step-entrenamiento/step-entrenamiento.component';
import { ValidacionesService } from '../../Servicios/validaciones.service';
import { ParametrosEntrada } from '../../Modelos/parametrosEntrada';
import { MatrizPesosSinapticos } from '../../Modelos/matrizPesosSinapticos';
import { ToastrService } from 'ngx-toastr';
import { Umbrales } from '../../Modelos/umbrales';

@Component({
  selector: 'app-entrenamiento',
  templateUrl: './entrenamiento.component.html',
  styleUrls: ['./entrenamiento.component.css']
})
export class EntrenamientoComponent implements OnInit {
  @ViewChild(StepEntradasComponent) childStepEntradas;
  @ViewChild(StepPesosYUmbralesComponent) childStepPesos;
  @ViewChild(StepEntrenamientoComponent) childStepEntrenamiento;

  constructor(private validaciones: ValidacionesService,
    private toastr: ToastrService) { }

  ngOnInit() { }

  //Operaciones de eventos (comunicación entre componentes)

  reiniciarParametrosYConfiguracion() {
    this.reiniciarEntrenamiento();
  }

  reiniciarEntrenamiento() {
    this.reiniciarStepEntradas();
    this.reiniciarStepPesos();
    this.reiniciarStepEntrenamiento();
  }

  entrenar() {
    let ConfigYParamsTraining = {
      checkDelta: this.childStepEntradas.checkDelta,
      checkDeltaModificada: this.childStepEntradas.checkDeltaModificada,
      numeroIteraciones: this.childStepEntradas.numeroIteraciones.value,
      rataAprendizaje: this.childStepEntradas.rataAprendizaje.value,
      errorMaximoPermitido: this.childStepEntradas.errorMaximoPermitido.value,
    }
    if (!this.isValidConfigYParametros(ConfigYParamsTraining, this.childStepEntradas.parametrosEntrada,
      this.childStepPesos.pesosSinapticos, this.childStepPesos.umbrales)) return;
    this.childStepEntrenamiento.entrenar(ConfigYParamsTraining, this.childStepEntradas.parametrosEntrada);
  }

  guardarPesosYUmbrales() {
    let tipoDato = this.childStepEntradas.parametrosEntrada.tipoDato;
    this.childStepEntrenamiento.guardarPesosYUmbrales(tipoDato);
  }

  actualizarParametrosEntrada() {
    this.childStepPesos.parametrosEntrada = this.childStepEntradas.parametrosEntrada;
    this.childStepEntrenamiento.actualizarGraficaSalidasDeseadas();
  }

  reiniciarStepPesos() {
    this.childStepPesos.reiniciarStepPesos();
  }

  //Operaciones de reinicio de valores (comunicación entre componentes)

  reiniciarStepEntradas() {
    this.childStepEntradas.reiniciarStepEntradas();
  }

  reiniciarStepEntrenamiento() {
    this.childStepEntrenamiento.reiniciarStepEntrenamiento();
  }

  //Pre-validacion del entrenamiento

  isValidConfigYParametros(ConfigYParamsTraining, parametrosEntrada: ParametrosEntrada, pesosSinapticos: MatrizPesosSinapticos,
    umbrales: Umbrales): boolean {
    if (!this.validaciones.checkConfiguracionRed(parametrosEntrada, pesosSinapticos, umbrales, ConfigYParamsTraining.checkDelta,
      ConfigYParamsTraining.checkDeltaModificada, ConfigYParamsTraining.numeroIteraciones, ConfigYParamsTraining.rataAprendizaje, ConfigYParamsTraining.errorMaximoPermitido)) {
      this.toastr.warning(!this.validaciones.checkParametrosEntrada(parametrosEntrada) ?
        'Verifique el cargue y la configuración de los parámetros de entrada' :
        !this.validaciones.checkAlgoritmTraining(ConfigYParamsTraining.checkDelta, ConfigYParamsTraining.checkDeltaModificada) ?
          'Verifique la configuración del algoritmo de entrenamiento' : !this.validaciones.checkParametrosEntrenamiento(
            ConfigYParamsTraining.numeroIteraciones, ConfigYParamsTraining.rataAprendizaje, ConfigYParamsTraining.errorMaximoPermitido) ?
            'Verifique la configuración de los parámetros de entrenamiento' : 'Verifique la configuración de los pesos sinápticos y umbrales', '¡Advertencia!');
      return false;
    }
    return true;
  }
}