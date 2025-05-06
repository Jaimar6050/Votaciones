import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { from, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VotacionService {
  http = inject(HttpClient)
  url = environment.host + 'votacion';

  constructor() { }

  private simulateDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 3000));
  }

  votar(partidoId: string, personaId: string) {
    return this.http.post(this.url, { partidoId, personaId });
  }

  getVotosPorPersona(personaId: string) {
    return from(this.simulateDelay()).pipe(
      switchMap(() => {
        return this.http.get(`${this.url}?personaId=${personaId}`);
      })
    );
  }

  eliminarVoto(id: string) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
