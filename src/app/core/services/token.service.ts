import { Injectable } from '@angular/core';

const KEY = 'token';
@Injectable({
  providedIn: 'root',
})
export class TokenService {
  salvarToken(token: string) {
    console.log('TokenService - Salvando token:', token);
    localStorage.setItem(KEY, token);
    console.log('TokenService - Token salvo, verificando:', localStorage.getItem(KEY));
  }

  excluirToken() {
    return localStorage.removeItem(KEY);
  }

  retornarToken() {
    return localStorage.getItem(KEY) ?? '';
  }

  possuiToken() {
    return !!this.retornarToken();
  }
}
