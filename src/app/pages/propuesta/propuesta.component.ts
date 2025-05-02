import { Component, computed, inject, signal  } from '@angular/core';
import { PropuestaService } from './propuesta.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { FormPropuestaComponent } from './form-propuesta/form-propuesta.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

export interface Propuesta{
  id?: string,
  nombre?: string,
  descripcion?: string,
  partidoId?: string
}

@Component({
  selector: 'app-propuesta',
  imports: [MatDialogModule,CommonModule,MatProgressSpinnerModule],
  templateUrl: './propuesta.component.html',
  styleUrl: './propuesta.component.css'
})
export class PropuestaComponent {
  propuestaService = inject(PropuestaService);
  loading = signal(false);
  isLoading = computed(()=>this.loading());
  dialog = inject(MatDialog);
  propuesta:Propuesta={};	


  propuestaResource = rxResource({
    loader: () => {
      this.loading.set(true);
      return this.propuestaService.getAll().pipe(
        map((response: any) => {
          this.loading.set(false);
          return response.data.data;
        })
      );
    }
  });

  openDialog(data:any){
    this.propuesta = data;
    const nuevoForm = this.dialog.open(FormPropuestaComponent,{
      data:this.propuesta
    })
    nuevoForm.afterClosed().subscribe(resulta=>{
      if(resulta)
        //
        this.propuestaResource.reload();
    })
    this.propuestaResource.reload();
  }

  nuevo(){
    this.propuesta={
      id:'',nombre:'',descripcion:'',partidoId:''
    }
    this.openDialog(this.propuesta);
  }

  editar(item:any){
    this.openDialog(item);
  }

  eliminar(propuesta: Propuesta){
    if (!propuesta.id) return;

    const confirm = window.confirm('¿Está seguro de eliminar la propuesta?');
    if (confirm) {
      this.propuestaService.delete(propuesta.id).subscribe({
        next: (res: any) => {
          if (res.status === 'success') {
            this.propuestaResource.reload();
          } else {
            alert(res.message);
          }
        },
        error: (err) => {
          alert(err.error.message);
        },
      });
    }
  }

}
