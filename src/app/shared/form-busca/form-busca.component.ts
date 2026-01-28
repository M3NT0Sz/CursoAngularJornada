import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuscaService } from 'src/app/core/services/form-busca.service';
import { DadosBusca } from 'src/app/core/types/type';

@Component({
  selector: 'app-form-busca',
  templateUrl: './form-busca.component.html',
  styleUrls: ['./form-busca.component.scss'],
})
export class FormBuscaComponent {
  @Output() realizarBusca = new EventEmitter<DadosBusca>();
  constructor(public formBuscaService: FormBuscaService) {}

  buscar() {
    if (this.formBuscaService.formEstaValido) {
      const formBuscaValue = this.formBuscaService.obterDadosDeBusca();
      this.realizarBusca.emit(formBuscaValue);
    } else {
      this.formBuscaService.formBusca.markAllAsTouched();
      alert(
        'Por favor, preencha todos os campos obrigatórios antes de buscar.',
      );
    }
  }
}
