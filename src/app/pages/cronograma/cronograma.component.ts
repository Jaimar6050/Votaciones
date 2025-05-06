import { Component, computed, inject, signal  } from '@angular/core';
import { CronogramaService } from './cronograma.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { FormCronogramaComponent } from './form-cronograma/form-cronograma.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { PartidoService } from '../partido/partido.service';

export interface Cronograma{
  id?: string,
  actividad?: string,
  descripcion?: string,
  fecha?: Date,
  hora?: string,
  partidoId?: string
}
@Component({
  selector: 'app-cronograma',
  imports: [MatDialogModule,CommonModule],
  templateUrl: './cronograma.component.html',
  styleUrl: './cronograma.component.css'
})
export class CronogramaComponent {
  partidoService = inject(PartidoService);
partidos = signal<{ id: string; nombre: string }[]>([]);
  cronogramaService = inject(CronogramaService);
  loading = signal(false);
  dialog = inject(MatDialog);
  cronograma:Cronograma={};


  cronogramaResource = rxResource({
    loader: () => {
      this.loading.set(true);
      return this.cronogramaService.getAll().pipe(
        map((response: any) => {
          this.loading.set(false);
          return response.data.data;
        })
      );
    }
  });

  openDialog(data:any){
    this.cronograma = data;
    const nuevoForm = this.dialog.open(FormCronogramaComponent,{
      data:this.cronograma
    })
    nuevoForm.afterClosed().subscribe(resulta=>{
      if(resulta)
        //
        this.cronogramaResource.reload();
    })
    this.cronogramaResource.reload();
  }

  nuevo(){
    this.cronograma={
      id:'',actividad:'',descripcion:'',fecha:new Date(),hora:'',partidoId:''
    }
    this.openDialog(this.cronograma);
  }

  eliminar(cronograma: Cronograma) {
    if (!cronograma.id) return;

    const confirmado = confirm(`¿Estás seguro de eliminar el cronograma "${cronograma.actividad}"?`);
    if (confirmado) {
      this.cronogramaService.delete(cronograma.id).subscribe({
        next: (res: any) => {
          if (res.status === 'success') {
            this.cronogramaResource.reload();
          } else {
            alert('No se pudo eliminar: ' + res.message);
          }
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }

  editar(item: any) {
    this.openDialog(item);
  }
  constructor() {
    this.partidoService.getAll().subscribe((res: any) => {
      this.partidos.set(res.data.data);
    });
  }
  getNombrePartido(partidoId: string): string {
    const partido = this.partidos().find(p => p.id === partidoId);
    return partido ? partido.nombre : 'Desconocido';
  }




}
