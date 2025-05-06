
import { Component, inject } from '@angular/core';
import { PartidoService } from '../partido/partido.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-votacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule,

    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './votacion.component.html',
  styleUrl: './votacion.component.css'
})
export class VotacionComponent{
  partidoService = inject(PartidoService);
  http = inject(HttpClient);
  fb = inject(FormBuilder);

  partidos: any[] = [];
  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      personaId: ['']
    });

    this.partidoService.getAll().subscribe((res: any) => {
      this.partidos = res.data.data;
    });
  }

  votar(partidoId: string) {
    const personaId = this.form.get('personaId')?.value;
    if (!personaId) {
      alert('Debe ingresar su ID como persona');
      return;
    }

    const voto = { partidoId, personaId };
    this.http.post(`${environment.host}votacion`, voto).subscribe({
      next: (res) => alert('¡Voto registrado correctamente!'),
      error: (err) => alert('Error al votar: ' + (err.error?.message || 'Error desconocido'))
    });
  }
}

