import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UnidadeFederativa } from '../types/type';

@Injectable({
  providedIn: 'root'
})
export class UnidadeFederativaService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  listar(): Observable<UnidadeFederativa[]> {
    return this.http.get<UnidadeFederativa[]>(`${this.apiUrl}/estados`);
  }
}
