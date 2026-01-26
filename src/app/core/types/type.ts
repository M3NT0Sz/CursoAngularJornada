export interface Promocao {
  id: number;
  destino: string;
  imagem: string;
  preco: number;
}

export interface UnidadeFederativa {
  id: number;
  nome: string;
  sigla: string;
}

export interface Depoimento {
  id: number;
  autor: string;
  texto: string;
  imagem: string;
}
