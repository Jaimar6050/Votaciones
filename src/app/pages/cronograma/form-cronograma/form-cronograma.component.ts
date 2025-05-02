import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CronogramaService } from '../cronograma.service';
import { Cronograma } from '../cronograma.component';
import { CommonModule } from '@angular/common';
import { PartidoService } from '../../partido/partido.service';

@Component({
  selector: 'app-form-cronograma',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './form-cronograma.component.html',
  styleUrl: './form-cronograma.component.css'
})
export class FormCronogramaComponent {
  partidoService = inject(PartidoService);
  partidos = signal<{ id: string, nombre: string }[]>([]);

  fb = inject(NonNullableFormBuilder);
  cronogramaService = inject(CronogramaService);
  readonly cronograma = inject<Cronograma>(MAT_DIALOG_DATA);
  readonly dialog = inject(MatDialogRef<FormCronogramaComponent>);
  msg = signal('');

  form = this.fb.group({
    actividad: this.fb.control(this.cronograma.actividad ?? '', Validators.required),
    descripcion: this.fb.control(this.cronograma.descripcion ?? '', Validators.required),
    fecha: this.fb.control(this.cronograma.fecha ?? new Date(), Validators.required),
    hora: this.fb.control(this.cronograma.hora ?? '', Validators.required),
    partidoId: this.fb.control(this.cronograma.partidoId ?? '', Validators.required),
  });

  enviar() {
    const raw = this.form.getRawValue();
  
    const payload = {
      actividad: raw.actividad,
      descripcion: raw.descripcion,
      fecha: new Date(raw.fecha),
      hora: raw.hora,
      partidoId: raw.partidoId,
    };
  
    if (this.cronograma.id) {
      // Modo edición
      this.cronogramaService.update(this.cronograma.id, payload).subscribe({
        next: (res: any) => {
          if (res.status === 'success') {
            this.dialog.close(true);
          } else {
            this.msg.set(res.message);
          }
        },
        error: (err) => {
          this.msg.set(err.error.message);
        },
      });
    } else {
      // Modo creación
      this.cronogramaService.create(payload).subscribe({
        next: (res: any) => {
          if (res.status === 'success') {
            this.dialog.close(true);
          } else {
            this.msg.set(res.message);
          }
        },
        error: (err) => {
          this.msg.set(err.error.message);
        },
      });
    }
  }
  
  

  constructor() {
    this.partidoService.getAll().subscribe((res: any) => {
      this.partidos.set(res.data.data);
    });
  }
}
