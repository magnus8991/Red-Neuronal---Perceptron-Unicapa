import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Fila } from "../Modelos/fila";
import { MatrizPesosSinapticos } from "../Modelos/matrizPesosSinapticos";
import { ParametrosEntrada } from "../Modelos/parametrosEntrada";
import { Patron } from "../Modelos/patron";
import { Umbrales } from "../Modelos/umbrales";

@Injectable({
  providedIn: 'root'
})
export class GetterEntradasService {

  constructor(
    private toastr: ToastrService
  ) { }

  getParametrosEntrada(inputFile): ParametrosEntrada {
    let parametros = new ParametrosEntrada();
    parametros.numeroEntradas = this.getNumeroEntradas(inputFile);
    parametros.numeroSalidas = this.getNumeroSalidasDeseadas(inputFile);
    parametros.numeroPatrones = this.getNumberoPatrones(inputFile);
    parametros.encabezados = this.getEncabezados(parametros.numeroEntradas, parametros.numeroSalidas);
    let patronesYTipoDato = this.getPatronesYTipodato(inputFile);
    parametros.patrones = patronesYTipoDato.patrones;
    parametros.tipoDato = patronesYTipoDato.tipoDato;
    return parametros;
  }

  getEncabezados(entradas: number, salidas: number): string[] {
    let encabezados: string[] = [];
    encabezados.push('#');
    for (let i = 1; i <= entradas; i++) encabezados.push('X' + i);
    for (let i = 1; i <= salidas; i++) encabezados.push('YD' + i);
    return encabezados;
  }

  getNumeroSalidasDeseadas(textFile): number {
    let primeraLinea = this.getPrimeraLinea(textFile);
    let salidas = this.getSalidas(primeraLinea);
    return salidas.length;
  }

  getNumeroEntradas(textFile): number {
    let primeraLinea = this.getPrimeraLinea(textFile);
    let entradas = this.getEntradas(primeraLinea);
    return entradas.length;
  }

  getNumberoPatrones(textFile): number {
    return textFile.split("\n").length;
  }

  getEntradas(linea): string[] {
    let entradas = linea.split("|")[0];
    return entradas.split(';');
  }

  getSalidas(linea): string[] {
    let salidas = linea.split("|")[1];
    return salidas.split(';');
  }

  getPrimeraLinea(textFile): string {
    return textFile.split("\n")[0];
  }

  getPatronesYTipodato(textFile): any {
    let tipoDato = '';
    let error = false;
    let patrones: Patron[] = [];
    let lineas: string[] = textFile.split("\n");
    let indice = 0;
    lineas.forEach(linea => {
      indice += 1;
      let valores: number[] = [];
      this.getEntradas(linea).forEach(entrada => {
        valores.push(parseInt(entrada));
        tipoDato = parseInt(entrada) == 1 ? tipoDato : parseInt(entrada) == 0 ? tipoDato == 'bipolar' ? null : 'binario' :
          parseInt(entrada) == -1 ? tipoDato == 'binario' ? null : 'bipolar' : null;
        if (tipoDato == null) error = true;
      });
      this.getSalidas(linea).forEach(salida => {
        valores.push(parseInt(salida));
        tipoDato = parseInt(salida) == 1 ? tipoDato : parseInt(salida) == 0 ? tipoDato == 'bipolar' ? null : 'binario' :
          parseInt(salida) == -1 ? tipoDato == 'binario' ? null : 'bipolar' : null;
        if (tipoDato == null) error = true;
      });
      patrones.push(new Patron(indice, valores));
    });
    if (error) tipoDato = null;
    return { patrones: patrones, tipoDato: tipoDato };
  }

  getPesosSinapticosFile(inputFile, numeroFilas: number, numeroColumnas: number): MatrizPesosSinapticos {
    let matrizPesosSinapticos = new MatrizPesosSinapticos();
    let lineas: string[] = inputFile.split("\n");
    if (lineas.length != numeroFilas || lineas[0].split(';').length != numeroColumnas) {
      this.toastr.warning('El numero de filas o columnas del archivo cargado no coincide con el numero de entradas o salidas', 'Advertencia');
      return matrizPesosSinapticos;
    }
    matrizPesosSinapticos.encabezados = [];
    matrizPesosSinapticos.filas = [];
    matrizPesosSinapticos.encabezados.push('#');
    let indiceFilas = 0;
    for (let i = 0; i < numeroColumnas; i++) matrizPesosSinapticos.encabezados.push((i + 1).toString());
    lineas.forEach(linea => {
      indiceFilas += 1;
      let columnas: number[] = [];
      this.getEntradas(linea).forEach(columna => {
        columnas.push(parseFloat(columna));
      });;
      matrizPesosSinapticos.filas.push(new Fila(indiceFilas, columnas));
    });
    return matrizPesosSinapticos;
  }

  getPesosSinapticosRandom(numeroFilas: number, numeroColumnas: number): MatrizPesosSinapticos {
    let matrizPesosSinapticos = new MatrizPesosSinapticos();
    matrizPesosSinapticos.encabezados = [];
    matrizPesosSinapticos.filas = [];
    matrizPesosSinapticos.encabezados.push('#');
    for (let i = 0; i < numeroColumnas; i++) matrizPesosSinapticos.encabezados.push((i + 1).toString());
    for (let i = 0; i < numeroFilas; i++) matrizPesosSinapticos.filas.push(new Fila(i + 1, []));
    matrizPesosSinapticos.filas.forEach(fila => {
      for (let i = 0; i < numeroColumnas; i++) {
        fila.columnas.push(Math.random() * (1 - (-1)) + (-1));
      }
    });
    return matrizPesosSinapticos;
  }

  getUmbralesFile(inputFile, numeroColumnas: number): Umbrales {
    let umbrales = new Umbrales();
    let valores: string[] = inputFile.split("\n")[0].split(";");
    if (valores.length != numeroColumnas) {
      this.toastr.warning('El numero de columnas del archivo cargado no coincide con el numero de salidas', 'Advertencia');
      return umbrales;
    }
    umbrales.encabezados = [];
    umbrales.valores = [];
    for (let i = 0; i < numeroColumnas; i++) umbrales.encabezados.push('U' + (i + 1).toString());
    valores.forEach(valor => {
      umbrales.valores.push(parseFloat(valor));
    });
    return umbrales;
  }

  getUmbralesRandom(numeroColumnas: number): Umbrales {
    let umbrales = new Umbrales();
    umbrales.encabezados = [];
    umbrales.valores = [];
    for (let i = 0; i < numeroColumnas; i++) {
      umbrales.encabezados.push('U' + (i + 1).toString());
      umbrales.valores.push(Math.random() * (1 - (-1)) + (-1));
    }
    return umbrales;
  }
}