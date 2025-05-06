
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import { GaleriaService } from '../galeria.service';
import { Galeria } from '../galeria.model';


@Component({
  selector: 'app-form-galeria',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './form-galeria.component.html',
  styleUrl: './form-galeria.component.css'
})
export class FormGaleriaComponent {
  fb = inject(NonNullableFormBuilder);
  galeriaService = inject(GaleriaService);
  readonly galeria = inject<Galeria>(MAT_DIALOG_DATA);
  readonly dialog = inject(MatDialogRef<FormGaleriaComponent>);
  msg = signal('');

  form = this.fb.group({
    imagen: this.fb.control<File | null>(null),
    descripcion: this.fb.control(this.galeria.descripcion ?? '', Validators.required),
  });

  onFileChange(event: Event, controlName: 'imagen' ) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.form.get(controlName)?.setValue(input.files[0]);
    }
  }

  enviar() {
    const formData = new FormData();
    const raw = this.form.getRawValue();
    formData.append('descripcion', raw.descripcion);
    if (raw.imagen) formData.append('imagen', raw.imagen);


    this.galeriaService.create(formData).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          this.dialog.close(true);
        } else {
          this.msg.set(res.message);
        }
      },
      error: err => {
        this.msg.set(err.error?.message || 'Error al guardar el partido');
      }
    });
  }
}
