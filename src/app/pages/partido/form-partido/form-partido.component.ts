import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PartidoService } from '../partido.service';
import { Partido } from '../partido.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-form-partido',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './form-partido.component.html',
  styleUrl: './form-partido.component.css'
})
export class FormPartidoComponent {
  fb = inject(NonNullableFormBuilder);
  partidoService = inject(PartidoService);
  readonly partido = inject<Partido>(MAT_DIALOG_DATA);
  readonly dialog = inject(MatDialogRef<FormPartidoComponent>);
  msg = signal('');

  form = this.fb.group({
    nombre: this.fb.control(this.partido.nombre ?? '', Validators.required),
    siglas: this.fb.control(this.partido.siglas ?? '', Validators.required),
    nombreCandidato: this.fb.control(this.partido.nombreCandidato ?? '', Validators.required),
    descripcion: this.fb.control(this.partido.descripcion ?? '', Validators.required),
    logo: this.fb.control<File | null>(null),
    fotoCandidato: this.fb.control<File | null>(null),
  });

  onFileChange(event: Event, controlName: 'logo' | 'fotoCandidato') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.form.get(controlName)?.setValue(input.files[0]);
    }
  }

  enviar() {
    const formData = new FormData();
    const raw = this.form.getRawValue();
    formData.append('nombre', raw.nombre);
    formData.append('siglas', raw.siglas);
    formData.append('nombreCandidato', raw.nombreCandidato);
    formData.append('descripcion', raw.descripcion);
    if (raw.logo) formData.append('logo', raw.logo);
    if (raw.fotoCandidato) formData.append('fotoCandidato', raw.fotoCandidato);

    this.partidoService.create(formData).subscribe({
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
