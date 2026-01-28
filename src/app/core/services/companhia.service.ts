import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Companhia } from 'jornada-milhas-api/src/companhias/entities/companhia.entity';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CompanhiaService {
  private apiUrl: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  listar(): Observable<Companhia[]> {
    return this.httpClient.get<Companhia[]>(`${this.apiUrl}/companhias`);
  }
}
