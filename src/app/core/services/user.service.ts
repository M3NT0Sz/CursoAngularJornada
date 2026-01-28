import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { BehaviorSubject } from 'rxjs';
import { PessoaUsuaria } from '../types/type';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject = new BehaviorSubject<PessoaUsuaria | null>(null);
  constructor(private tokenService: TokenService) {
    if (this.tokenService.possuiToken()) {
      this.decodificarJWT();
    }
  }

  decodificarJWT() {
    const token = this.tokenService.retornarToken();
    console.log('UserService - Token para decodificar:', token);
    if (!token) {
      return;
    }
    try {
      const user = jwtDecode(token) as PessoaUsuaria;
      console.log('UserService - Usuário decodificado:', user);
      this.userSubject.next(user);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      this.logout();
    }
  }

  retornarUser() {
    return this.userSubject.asObservable();
  }

  salvarToken(token: string) {
    console.log('UserService - Recebendo token para salvar:', token);
    this.tokenService.salvarToken(token);
    this.decodificarJWT();
  }

  logout() {
    this.tokenService.excluirToken();
    this.userSubject.next(null);
  }

  estaLogado() {
    return this.tokenService.possuiToken();
  }
}
