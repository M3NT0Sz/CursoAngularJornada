import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { FormBuscaService } from 'src/app/core/services/form-busca.service';

@Component({
  selector: 'app-form-busca',
  templateUrl: './form-busca.component.html',
  styleUrls: ['./form-busca.component.scss'],
})
export class FormBuscaComponent {
  constructor(public formBuscaService: FormBuscaService) {}

  buscar() {
    console.log(
      'Formulário de busca submetido com os seguintes valores: ',
      this.formBuscaService.formBusca.value,
    );
  }
}
