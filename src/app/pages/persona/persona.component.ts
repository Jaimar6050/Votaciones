

import { Component, computed, inject, signal  } from '@angular/core';

import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { PersonaService } from './persona.service';
import { FormPersonaComponent } from './form-persona/form-persona.component';


export interface Persona{
  id?: string,
  nombreCompleto?: string,
  ci?: string,
  fechaNacimiento?: Date,
  email?: string,
  rol?: string,
  voto?: boolean
}


@Component({
  selector: 'app-persona',
  imports: [MatDialogModule],
  templateUrl: './persona.component.html',
  styleUrl: './persona.component.css'
})
export class PersonaComponent  {
  personaService = inject(PersonaService);
  loading = signal(false);
  dialog = inject(MatDialog);
  persona:Persona={};

  personaResource = rxResource({
    loader: () => {
      this.loading.set(true);
      return this.personaService.getAll().pipe(
        map((response: any) => {
          this.loading.set(false);
          return response.data.data;
        })
      );
    }
  });

  nuevo(){
    this.persona={
      id:'',nombreCompleto:'',ci:'',fechaNacimiento:new Date(),email:'',rol:'',voto:false
    }
    const nuevoForm = this.dialog.open(FormPersonaComponent,{
      data:this.persona
    })
    nuevoForm.afterClosed().subscribe(resulta=>{
      if(resulta)
        this.personaResource.reload();
    })
  }

  eliminar(persona: Persona) {
    if (!persona.id) return;

    const confirmado = confirm(`¿Estás seguro de eliminar el partido "${persona.nombreCompleto}"?`);
    if (confirmado) {
      this.personaService.delete(persona.id).subscribe({
        next: (res: any) => {
          if (res.status === 'success') {
            this.personaResource.reload();
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
