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
      this.carregando = false;
    });
  }
}
