import { Component, Input } from '@angular/core';
import { Passagem } from 'src/app/core/types/type';

@Component({
  selector: 'app-destaques',
  templateUrl: './destaques.component.html',
  styleUrls: ['./destaques.component.scss'],
})
export class DestaquesComponent {
  @Input() destacadaPor: string = '';
  @Input() passagem?: Passagem;
  @Input() variant: 'primary' | 'secondary' | 'default' = 'primary';
}
