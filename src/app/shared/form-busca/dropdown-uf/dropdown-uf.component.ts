import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { UnidadeFederativaService } from 'src/app/core/services/unidade-federativa.service';
import { UnidadeFederativa } from 'src/app/core/types/type';

@Component({
  selector: 'app-dropdown-uf',
  templateUrl: './dropdown-uf.component.html',
  styleUrls: ['./dropdown-uf.component.scss'],
})
export class DropdownUfComponent implements OnInit {
  @Input() label: string = '';
  @Input() iconePrefixo: string = '';

  unidadesFederativas: UnidadeFederativa[] = [];

  filteredOptions$!: Observable<UnidadeFederativa[]>;
  
  control = new FormControl('');

  constructor(private unidadeFederativaService: UnidadeFederativaService) {}

  ngOnInit(): void {
    this.unidadeFederativaService.listar().subscribe((dados) => {
      this.unidadesFederativas = dados;
      console.log(this.unidadesFederativas);
      this.filteredOptions$ = this.control.valueChanges.pipe(
        startWith(''),
        map(value => this.filtrarUfs(value || ''))
      );
    });
  }

  private filtrarUfs(valor: string): UnidadeFederativa[] {
    const valorFiltro = valor.toLowerCase();
    return this.unidadesFederativas.filter(uf => 
      uf.nome.toLowerCase().includes(valorFiltro) || 
      uf.sigla.toLowerCase().includes(valorFiltro)
    );
  }
}
