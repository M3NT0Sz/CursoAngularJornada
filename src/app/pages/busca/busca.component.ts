import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { FormBuscaService } from 'src/app/core/services/form-busca.service';
import { PassagensService } from 'src/app/core/services/passagens.service';
import { DadosBusca, Passagem } from 'src/app/core/types/type';

@Component({
  selector: 'app-busca',
  templateUrl: './busca.component.html',
  styleUrls: ['./busca.component.scss'],
})
export class BuscaComponent implements OnInit {
  passagens: Passagem[] = [];
  carregando: boolean = false;
  destaques: {
    maisBarata?: any;
    sugerida?: any;
    maisRapida?: any;
  } = {};
  constructor(
    private passagensService: PassagensService,
    private formBuscaService: FormBuscaService,
  ) {}

  ngOnInit(): void {
    this.carregando = true;
    const buscaPadrao: DadosBusca = {
      dataIda: new Date().toISOString(),
      pagina: 1,
      porPagina: 25,
      somenteIda: false,
      passageirosAdultos: 1,
      tipo: 'Executiva',
    };
    const busca = this.formBuscaService.formEstaValido
      ? this.formBuscaService.obterDadosDeBusca()
      : buscaPadrao;
    this.passagensService
      .getPassagens(busca)
      .pipe(take(1))
      .subscribe((res) => {
        this.passagens = res.resultado;
        this.calcularDestaques();
        this.formBuscaService.formBusca.patchValue({
          precoMin: res.precoMin,
          precoMax: res.precoMax,
        });
        this.carregando = false;
      });
  }

  busca(ev: DadosBusca) {
    this.carregando = true;
    this.carregando = true;
    this.passagensService.getPassagens(ev).subscribe((res) => {
      console.log(res);
      this.passagens = res.resultado;
      this.calcularDestaques();
      this.carregando = false;
    });
  }

  calcularDestaques() {
    if (this.passagens.length === 0) {
      this.destaques = {};
      return;
    }

    // Mais barata - menor preço total
    this.destaques.maisBarata = this.passagens.reduce((prev, current) => 
      (prev.total < current.total) ? prev : current
    );

    // Mais rápida - menor tempo de duração
    this.destaques.maisRapida = this.passagens.reduce((prev, current) => {
      const duracaoPrev = this.calcularDuracao(prev.tempoVoo);
      const duracaoCurrent = this.calcularDuracao(current.tempoVoo);
      return (duracaoPrev < duracaoCurrent) ? prev : current;
    });

    // Sugerida - melhor equilíbrio entre preço e tempo
    this.destaques.sugerida = this.passagens.reduce((prev, current) => {
      const scorePrev = this.calcularScore(prev);
      const scoreCurrent = this.calcularScore(current);
      return (scorePrev < scoreCurrent) ? prev : current;
    });
  }

  calcularDuracao(tempoVoo: number): number {
    return tempoVoo;
  }

  calcularScore(passagem: Passagem): number {
    // Normaliza preço e tempo para criar um score balanceado
    const maxPreco = Math.max(...this.passagens.map(p => p.total));
    const minPreco = Math.min(...this.passagens.map(p => p.total));
    const maxTempo = Math.max(...this.passagens.map(p => p.tempoVoo));
    const minTempo = Math.min(...this.passagens.map(p => p.tempoVoo));
    
    const precoNormalizado = (passagem.total - minPreco) / (maxPreco - minPreco || 1);
    const tempoNormalizado = (passagem.tempoVoo - minTempo) / (maxTempo - minTempo || 1);
    
    // Score: 60% peso no preço, 40% peso no tempo
    return precoNormalizado * 0.6 + tempoNormalizado * 0.4;
  }
}
