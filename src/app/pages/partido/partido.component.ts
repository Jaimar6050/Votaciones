import { Component, computed, inject, signal  } from '@angular/core';
import { PartidoService } from './partido.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { FormPartidoComponent } from './form-partido/form-partido.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';

export interface Partido{
  id?: string,
  nombre?: string,
  siglas?: string,
  nombreCandidato?: string,
  logo?: string,
  fotoCandidato?: string,
  descripcion?: string
}
@Component({
  selector: 'app-partido',
  imports: [MatDialogModule],
  templateUrl: './partido.component.html',
  styleUrl: './partido.component.css'
})
export class PartidoComponent {
  partidoService = inject(PartidoService);
  loading = signal(false);
  dialog = inject(MatDialog);
  partido:Partido={};	

  partidoResource = rxResource({
    loader: () => {
      this.loading.set(true);
      return this.partidoService.getAll().pipe(
        map((response: any) => {
          this.loading.set(false);
          return response.data.data;
        })
      );
    }
  });

  nuevo(){
    this.partido={
      id:'',nombre:'',siglas:'',nombreCandidato:'',logo:'',fotoCandidato:'',descripcion:''
    }
    const nuevoForm = this.dialog.open(FormPartidoComponent,{
      data:this.partido
    })
    nuevoForm.afterClosed().subscribe(resulta=>{
      if(resulta)
        this.partidoResource.reload();
    })
  }

  eliminar(partido: Partido) {
    if (!partido.id) return;
  
    const confirmado = confirm(`¿Estás seguro de eliminar el partido "${partido.nombre}"?`);
    if (confirmado) {
      this.partidoService.delete(partido.id).subscribe({
        next: (res: any) => {
          if (res.status === 'success') {
            this.partidoResource.reload();
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
  
}
