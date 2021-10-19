import { Injectable } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { MatrizPesosSinapticos } from "../Modelos/matrizPesosSinapticos";
import { ParametrosEntrada } from "../Modelos/parametrosEntrada";
import { Patron } from "../Modelos/patron";
import { Umbrales } from "../Modelos/umbrales";

@Injectable({
  providedIn: 'root'
})
export class EntrenamientoService {

  constructor() { }

  obtenerPesosYUmbralesNuevos(parametrosEntrada: ParametrosEntrada, pesosSinapticos: MatrizPesosSinapticos, umbrales: Umbrales,
    rataAprendizaje: number, rataDinamica: number, erroresLineales: number[], entradas: number[], checkDelta: boolean): any {
    let umbralAnterior = 0;
    for (let i = 0; i < parametrosEntrada.numeroSalidas; i++) {
      let indiceEntradas = 0;
      let pesoAnterior = 0;
      pesosSinapticos.filas.forEach(fila => {
        let pesoNuevo = fila.columnas[i] + (rataAprendizaje * erroresLineales[i] * entradas[indiceEntradas]) + (checkDelta ? 0 :
          rataDinamica * (fila.columnas[i] - pesoAnterior));
        pesoAnterior = fila.columnas[i];
        fila.columnas[i] = pesoNuevo;
        indiceEntradas += 1;
      })
      let umbralNuevo = umbrales.valores[i] + (rataAprendizaje * erroresLineales[i] * entradas[0]) + (checkDelta ? 0 :
        rataDinamica * (umbrales.valores[i] - umbralAnterior));
      umbralAnterior = umbrales.valores[i];
      umbrales.valores[i] = umbralNuevo;
    }
    return { pesosOptimos: pesosSinapticos, umbrales: umbrales };
  }

  calcularErroresLineales(parametrosEntrada: ParametrosEntrada, pesosSinapticos: MatrizPesosSinapticos, umbrales: Umbrales,
    patron: Patron): any {
    let erroresLineales: number[] = [];
    let salidasRed: number[] = [];
    for (let i = 0; i < parametrosEntrada.numeroSalidas; i++) {
      let salidaDeseada = patron.valores[parametrosEntrada.numeroEntradas + i];
      let indicePatrones = 0;
      let salidaSoma = 0;
      pesosSinapticos.filas.forEach(fila => {
        salidaSoma += patron.valores[indicePatrones] * fila.columnas[i];
        indicePatrones += 1;
      })
      salidaSoma = salidaSoma - umbrales.valores[i];
      let salidaRed = this.funcionActivacion(salidaSoma, parametrosEntrada.tipoDato);
      salidasRed.push(salidaRed);
      erroresLineales.push(salidaDeseada - salidaRed);
    }
    return { erroresLineales: erroresLineales, salidas: salidasRed };
  }

  funcionActivacion(salidaSoma: number, tipoDato: string): number {
    return this.funcionEscalon1(salidaSoma, tipoDato);
  }

  funcionEscalon1(salidaSoma: number, tipoDato: string): number {
    return salidaSoma >= 0 ? 1 : tipoDato == 'binario' ? 0 : -1;
  }

  funcionEscalon2(salidaSoma: number, tipoDato: string): number {
    return salidaSoma > 0 ? 1 : tipoDato == 'binario' ? 0 : -1;
  }

  errorPatron(erroresLineales: number[], numeroSalidas: number) {
    return (erroresLineales.reduce((sum, current) => sum + Math.abs(current), 0)) / numeroSalidas;
  }

  errorRMS(erroresPatrones: number[]) {
    return (erroresPatrones.reduce((sum, current) => sum + current, 0)) / erroresPatrones.length;
  }

  getSalidasDeseadas(patrones: Patron[], numeroEntradas: number, numeroSalidas: number): any[] {
    let listaSalidas: any[] = [];
    for (let i = 0; i < numeroSalidas; i++) {
      let salidas: number[] = [];
      patrones.forEach(patron => {
        salidas.push(patron.valores[numeroEntradas + i]);
      });
      listaSalidas.push(salidas);
    }
    return listaSalidas;
  }

  getInitSalidasRed(numeroSalidas: number): any[] {
    let listaSalidas: any[] = [];
    for (let i = 0; i < numeroSalidas; i++) {
      let salidas: number[] = [];
      listaSalidas.push(salidas);
    }
    return listaSalidas;
  }

  getSalidasRed(numeroSalidas: number): any[] {
    let listaSalidas: any[] = [];
    for (let i = 0; i < numeroSalidas; i++) {
      let salidas: number[] = [];
      listaSalidas.push(salidas);
    }
    return listaSalidas;
  }

}
