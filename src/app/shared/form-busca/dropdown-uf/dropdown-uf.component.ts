import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { UnidadeFederativaService } from 'src/app/core/services/unidade-federativa.service';
import { UnidadeFederativa } from 'src/app/core/types/type';

@Component({
  selector: 'app-dropdown-uf',
  templateUrl: './dropdown-uf.component.html',
  styleUrls: ['./dropdown-uf.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownUfComponent),
      multi: true
    }
  ]
})
export class DropdownUfComponent implements OnInit, ControlValueAccessor {
  @Input() label: string = '';
  @Input() iconePrefixo: string = '';

  unidadesFederativas: UnidadeFederativa[] = [];

  filteredOptions$!: Observable<UnidadeFederativa[]>;
  
  control = new FormControl('');

  onChange = (value: any) => {};
  onTouched = () => {};

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

    this.control.valueChanges.subscribe(value => {
      this.onChange(value);
      this.onTouched();
    });
  }

  writeValue(value: any): void {
    this.control.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }

  private filtrarUfs(valor: string): UnidadeFederativa[] {
    const valorFiltro = valor.toLowerCase();
    return this.unidadesFederativas.filter(uf => 
      uf.nome.toLowerCase().includes(valorFiltro) || 
      uf.sigla.toLowerCase().includes(valorFiltro)
    );
  }
}
