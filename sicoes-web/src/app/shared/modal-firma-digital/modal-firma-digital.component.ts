import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { functionsAlert } from "src/helpers/functionsAlert";

@Component({
  selector: "vex-modal-firma-digital",
  templateUrl: "./modal-firma-digital.component.html",
  styleUrls: ["./modal-firma-digital.component.scss"],
})
export class ModalFirmaDigitalComponent implements OnInit {
  action: any;
  loginUsuario: any;
  passwordUsuario: any;
  archivosFirmar: any;
  listaIdArchivo = [];

  constructor(
    private dialogRef: MatDialogRef<ModalFirmaDigitalComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.action = data.action;
    this.loginUsuario = data.loginUsuario;
    this.passwordUsuario = data.passwordUsuario;
    this.archivosFirmar = data.archivosFirmar;
  }

  ngOnInit() {
    this.firmaDigital();
  }

  firmaDigital() {
    const formulario = document.querySelector<HTMLFormElement>("#formulario");
    const loginUsuario = document.querySelector<HTMLInputElement>(
      "#loginUsuario"
    );
    const passwordUsuario = document.querySelector<HTMLInputElement>(
      "#passwordUsuario"
    );
    const archivosFirmar = document.querySelector<HTMLInputElement>(
      "#archivosFirmar"
    );

    formulario.setAttribute("action", this.action);
    loginUsuario.value = this.loginUsuario;
    passwordUsuario.value = this.passwordUsuario;
    //archivosFirmar.value = this.archivosFirmar;
    archivosFirmar.remove();

    this.listaIdArchivo = this.archivosFirmar.split(",");

    for (let i = 0; i < this.listaIdArchivo.length; i++) {
      const input: HTMLInputElement = document.createElement("input");
      input.type = "hidden";
      input.id = "archivosFirmar";
      input.name = "archivosFirmar";
      input.value = this.listaIdArchivo[i].toString();
      formulario.appendChild(input);
    }
    console.log(formulario);
    formulario.submit();

    const win: Window = window;
    win.addEventListener(
      "message",
      this.onReceiveResultCallbackOsifirma.bind(this),
      false
    );
  }

  onReceiveResultCallbackOsifirma(e) {
    if (e.origin != null && e.origin != "null") {
      try {
        var respuestaJSON = JSON.parse(e.data);
        if (respuestaJSON.resultado == -1) {
          //se trata de un error
          //this.dialogRef.close('OK');
          alert(respuestaJSON.mensaje);
        } else if (respuestaJSON.resultado == 1) {
          //se trata de una cancelación
          this.dialogRef.close('OK');
          alert(respuestaJSON.mensaje);
        } else if (respuestaJSON.resultado == 0) {
          //se trata de un éxito
          let mensaje = "";
          let i = 1;

          respuestaJSON.mensaje.forEach((archivoFirmado) => {
            mensaje +=
              i +
              ".- ID archivo original: " +
              archivoFirmado.idArchivoOriginal +
              ", ID archivo firmado: " +
              archivoFirmado.idArchivoFirmado +
              ". ";
            i++;
          });

          this.dialogRef.close('OK');
          alert(mensaje);
        } else {
          //se trata de una situación inesperada
          //this.dialogRef.close('OK');
          alert("Algo Inesperado");
        }
      } catch (err) {
        console.error(err);
        //this.dialogRef.close('OK');
        alert(
          "Ocurrió un error inesperado en el proceso de firmado digital: " +
            e.data
        );
        
      }
    } else {
      //this.dialogRef.close('OK');
      this.cerrar();
    }
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
