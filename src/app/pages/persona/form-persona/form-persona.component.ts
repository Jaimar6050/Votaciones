
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import { PersonaService } from '../persona.service';
import { Persona } from '../persona.model';


@Component({
  selector: 'app-form-persona',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './form-persona.component.html',
  styleUrl: './form-persona.component.css'
})
export class FormPersonaComponent {


    fb = inject(NonNullableFormBuilder);
    personaService = inject(PersonaService);
    readonly persona = inject<Persona>(MAT_DIALOG_DATA);
    readonly dialog = inject(MatDialogRef<FormPersonaComponent>);
    msg = signal('');

    form = this.fb.group({
      nombreCompleto: this.fb.control(this.persona.nombreCompleto ?? '', Validators.required),
      ci: this.fb.control(this.persona.ci ?? '', Validators.required),
      fechaNacimiento: this.fb.control(this.persona.fechaNacimiento ?? new Date(), Validators.required),
      email: this.fb.control(this.persona.email ?? '', Validators.required),
      rol: this.fb.control(this.persona.rol ?? '', Validators.required),
      voto: this.fb.control(this.persona.voto ?? false, Validators.required),
    });


    enviar() {
      const raw = this.form.getRawValue();

      const payload = {
        nombreCompleto: raw.nombreCompleto,
        ci: raw.ci,
        fechaNacimiento: new Date(raw.fechaNacimiento),
        email: raw.email,
        rol: raw.rol,
        voto: raw.voto,
      };


      if (this.persona.id) {
        // Modo edición
        this.personaService.update(this.persona.id, payload).subscribe({
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
        this.personaService.create(payload).subscribe({
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




}
