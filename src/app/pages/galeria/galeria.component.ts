
import { Component, computed, inject, signal  } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { GaleriaService } from './galeria.service';
import { FormGaleriaComponent } from './form-galeria/form-galeria.component';
import { response } from 'express';


export interface Galeria{
  id?: string;
  imagen?: string;
  descripcion?: string;
}
@Component({
  selector: 'app-galeria',
  imports: [MatDialogModule],
  templateUrl: './galeria.component.html',
  styleUrl: './galeria.component.css'
})
export class GaleriaComponent {
  galeriaService = inject(GaleriaService);
  loading = signal(false);
  dialog = inject(MatDialog);
  galeria:Galeria={};

  galeriaResource = rxResource({
    loader: () => {
      this.loading.set(true);
      return this.galeriaService.getAll().pipe(

        map((response: any) => {
          this.loading.set(false);
          console.log('data', response.data.data);
          return response.data.data;
        })
      );
    }
  });

  openDialog(data:any){
      this.galeria = data;
      const nuevoForm = this.dialog.open(FormGaleriaComponent,{
        data:this.galeria
      })
      nuevoForm.afterClosed().subscribe(resulta => {
        this.galeriaResource.reload();
      });
    }

    nuevo(){
      this.galeria={
        id:'',imagen:'',descripcion:''
      }
      this.openDialog(this.galeria);
    }

  eliminar(galeria: Galeria) {
    if (!galeria.id) return;
    const confirmado = confirm(`¿Estás seguro de eliminar el galeria "${galeria.imagen}"?`);


    if (confirmado) {
      this.galeriaService.delete(galeria.id).subscribe({
        next: (res: any) => {
          if (res.status === 'success') {
            this.galeriaResource.reload();
          } else {
            alert('No se pudo eliminar: ' + res.message);
          }
        },
        error: err => {
          alert('Error al eliminar: ' + (err.error?.message || 'Error desconocido'));
        }
      });
    }
  }
  editar(item: any) {
    this.openDialog(item);
  }

}
