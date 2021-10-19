import { Injectable } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { MatrizPesosSinapticos } from "../Modelos/matrizPesosSinapticos";
import { ParametrosEntrada } from "../Modelos/parametrosEntrada";
import { Umbrales } from "../Modelos/umbrales";

@Injectable({
  providedIn: 'root'
})
export class ValidacionesService {

  constructor() { }

  checkConfiguracionRed(parametrosEntrada: ParametrosEntrada, pesosSinapticos: MatrizPesosSinapticos, umbrales: Umbrales, 
    checkDelta: boolean, checkDeltaModificada: boolean, numeroIteraciones: any, rataAprendizaje: any, errorMaximoPermitido: any) {
    return this.checkParametrosEntrada(parametrosEntrada) && this.checkAlgoritmTraining(checkDelta, checkDeltaModificada) &&
      this.checkParametrosEntrenamiento(numeroIteraciones, rataAprendizaje, errorMaximoPermitido) && 
      this.checkPesosYUmbrales(pesosSinapticos,umbrales) ? true : false;
  }

  checkParametrosEntrada(parametrosEntrada: ParametrosEntrada) {
    return parametrosEntrada.numeroEntradas == 'N/A' || parametrosEntrada.numeroSalidas == 'N/A' ? false : true;
  }

  checkPesosYUmbrales(pesosSinapticos: MatrizPesosSinapticos, umbrales: Umbrales) {
    return this.checkPesos(pesosSinapticos) && this.checkUmbrales(umbrales) ? true : false;
  }

  checkPesos(pesosSinapticos: MatrizPesosSinapticos) {
    return pesosSinapticos.filas[0].columnas[0] == 'N/A' ? false : true;
  }

  checkUmbrales(umbrales: Umbrales) {
    return umbrales.valores[0] == 'N/A' ? false : true;
  }

  checkAlgoritmTraining(checkDelta: boolean, checkDeltaModificada: boolean) {
    return checkDelta || checkDeltaModificada ? true : false;
  }

  checkParametrosEntrenamiento(numeroIteraciones: any, rataAprendizaje: any, errorMaximoPermitido: any) {
    return this.checkNumeroIteraciones(numeroIteraciones) && this.checkRataAprendizaje(rataAprendizaje) &&
      this.checkErrorMaximoPermitido(errorMaximoPermitido) ? true : false;
  }

  checkNumeroIteraciones(numeroIteraciones: any) {
    return numeroIteraciones <= 0 || numeroIteraciones == null || numeroIteraciones == undefined ? false : true;
  }

  checkRataAprendizaje(rataAprendizaje: any) {
    return parseFloat(rataAprendizaje) <= 0 || parseFloat(rataAprendizaje) > 1 ||
      rataAprendizaje == null || rataAprendizaje == undefined ? false : true;
  }

  checkErrorMaximoPermitido(errorMaximoPermitido: any) {
    return parseFloat(errorMaximoPermitido) < 0 || errorMaximoPermitido == null || errorMaximoPermitido == undefined ? false : true;
  }

}
