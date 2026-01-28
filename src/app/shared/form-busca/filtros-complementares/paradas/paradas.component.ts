import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormBuscaService } from 'src/app/core/services/form-busca.service';
interface OpcoesDeParada {
  display: string;
  value: string;
}
@Component({
  selector: 'app-paradas',
  templateUrl: './paradas.component.html',
  styleUrls: ['./paradas.component.scss'],
})
export class ParadasComponent implements OnInit {
  opcoesSelecionadas: OpcoesDeParada | null = null;
  opcoes: OpcoesDeParada[] = [
    {
      display: 'Direto',
      value: '0',
    },
    {
      display: '1 conexão',
      value: '1',
    },
    {
      display: '2 conexões',
      value: '2',
    },
    {
      display: 'Mais de 2 conexões',
      value: '3',
    },
  ];
  conexoesControl: FormControl<number | null>;

  constructor(private formBuscaService: FormBuscaService) {
    this.conexoesControl =
      this.formBuscaService.obterControle<number>('conexoes');
  }
  ngOnInit() {
    this.conexoesControl.valueChanges.subscribe((value) => {
      if (value === null) {
        this.opcoesSelecionadas = null;
      }
    });
  }
  alternarParada(opcao: OpcoesDeParada, checked: boolean) {
    if (!checked) {
      this.opcoesSelecionadas = null;
      this.formBuscaService.formBusca.patchValue({ conexoes: null });
      return;
    }
    this.opcoesSelecionadas = opcao;
    this.formBuscaService.formBusca.patchValue({
      conexoes: Number(opcao.value),
    });
  }

  paradaSelecionada(opcao: OpcoesDeParada): boolean {
    return this.opcoesSelecionadas === opcao;
  }

  incluirParada(opcao: OpcoesDeParada) {
    if (!this.opcoesSelecionadas) {
      return false;
    }
    return this.opcoesSelecionadas.value > opcao.value;
  }
}
