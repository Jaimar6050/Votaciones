import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Partido } from './partido.model';
import { environment } from '../../environment/environment';
import { from, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartidoService {
  http = inject(HttpClient)
  url = environment.host+'partido';

  constructor() { }

  private simulateDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 3000));
  } 

  getAll() {
    return from(this.simulateDelay()).pipe(
      switchMap(() => {
        console.log('fin');
        return this.http.get<Partido[]>(this.url);
      })
    );
  }

  create(item:any){
    return this.http.post(this.url,item)
  }

  delete(id: string) {
    return this.http.delete(`http://localhost:3000/partido/${id}`);
  }

  
}
