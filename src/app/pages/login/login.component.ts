import { Component, inject, signal  } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-login',
  imports: [
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  fb = inject(NonNullableFormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  msg = signal('');
  form = this.fb.group<{
    ci:FormControl<string>,
  }>({
    ci:this.fb.control('',Validators.required),
  });
  protected onEntrar(){
    
      const data = this.form.getRawValue();
      this.authService.login(data).subscribe({
         next:(request:any)=>{
          if(request.status=="success"){
            this.router.navigate(['/menu']);
            
            this.authService.saveToken(request.data);
          }
         },
         error:err=>{
          console.log(err);
          this.msg.set(err.error.message);
         }
      });
      console.log(data);
  }
}
