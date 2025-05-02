import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PropuestaService } from '../propuesta.service';
import { Propuesta } from '../propuesta.component';
import { CommonModule } from '@angular/common';
import { PartidoService } from '../../partido/partido.service';

@Component({
  selector: 'app-form-propuesta',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './form-propuesta.component.html',
  styleUrl: './form-propuesta.component.css'
})
export class FormPropuestaComponent {
  partidoService = inject(PartidoService);
  partidos = signal<{ id: string, nombre: string }[]>([]);

  fb = inject(NonNullableFormBuilder);
  propuestaService = inject(PropuestaService);
  readonly propuesta = inject<Propuesta>(MAT_DIALOG_DATA);
  readonly dialog = inject(MatDialogRef<FormPropuestaComponent>);
  msg = signal('');

  form = this.fb.group({
    nombre: this.fb.control(this.propuesta.nombre ?? '', Validators.required),
    descripcion: this.fb.control(this.propuesta.descripcion ?? '', Validators.required),
    partidoId: this.fb.control(this.propuesta.partidoId ?? '', Validators.required),
  });

  enviar() {
    const raw = this.form.getRawValue();
  
    const payload = {
      nombre: raw.nombre,
      descripcion: raw.descripcion,
      partidoId: raw.partidoId,
    };
  
    if (this.propuesta.id) {
      // Modo edición
      this.propuestaService.update(this.propuesta.id, payload).subscribe({
        next: (res: any) => {
          if (res.status === 'success') {
            this.dialog.close(true);
          } else {
            this.msg.set(res.message);
          }
        },
        error: (err) => {
          this.msg.set(err.message);
        },
      });
    } else {
      // Modo creación
      this.propuestaService.create(payload).subscribe({
        next: (res: any) => {
          if (res.status === 'success') {
            this.dialog.close(true);
          } else {
            this.msg.set(res.message);
          }
        },
        error: (err) => {
          this.msg.set(err.message);
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
