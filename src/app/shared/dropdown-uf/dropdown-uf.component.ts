import { Component, forwardRef, Injector, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
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
      multi: true,
    },
  ],
})
export class DropdownUfComponent implements OnInit, ControlValueAccessor {
  @Input() label: string = '';
  @Input() iconePrefixo: string = '';
  @Input() placeholder: string = '';

  control: FormControl = new FormControl();
  unidadesFederativas: UnidadeFederativa[] = [];
  
  filteredOptions$!: Observable<UnidadeFederativa[]>;
  
  disabled = false;
  touched = false;
  value: any = null;
  ngControl: NgControl | null = null;
  errorStateMatcher: ErrorStateMatcher;

  onChange = (value: any) => {};
  onTouched = () => {};

  constructor(
    private unidadeFederativaService: UnidadeFederativaService,
    private injector: Injector
  ) {
    this.errorStateMatcher = {
      isErrorState: () => {
        return this.ngControl ? !!(this.ngControl.invalid && this.ngControl.touched) : false;
      }
    };
  }

  ngOnInit(): void {
    this.ngControl = this.injector.get(NgControl, null);
    console.log('NgControl injetado:', this.ngControl);
    
    this.unidadeFederativaService.listar().subscribe((dados) => {
      this.unidadesFederativas = dados;
      console.log(this.unidadesFederativas);
      this.filteredOptions$ = this.control.valueChanges.pipe(
        startWith(''),
        map((value) => this.filtrarUfs(value || '')),
      );
    });

    this.control.valueChanges.subscribe((value) => {
      this.value = value;
      this.onChange(value);
    });
  }

  get invalid(): boolean {
    return this.ngControl ? this.ngControl.invalid! && this.ngControl.touched! : false;
  }

  mostrarErro(): boolean {
    if (this.ngControl) {
      console.log(`${this.label} - Invalid:`, this.ngControl.invalid, 'Touched:', this.ngControl.touched);
      return !!(this.ngControl.invalid && this.ngControl.touched);
    }
    return false;
  }

  markAsTouched(): void {
    if (!this.touched) {
      this.touched = true;
      this.onTouched();
    }
  }

  writeValue(value: any): void {
    this.value = value;
    this.control.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    isDisabled ? this.control.disable() : this.control.enable();
  }

  private filtrarUfs(value: string | UnidadeFederativa): UnidadeFederativa[] {
    const nomeUf = typeof value === 'string' ? value : value?.nome;
    const valorFiltro = nomeUf?.toLowerCase();
    return this.unidadesFederativas.filter(
      (uf) =>
        uf.nome.toLowerCase().includes(valorFiltro) ||
        uf.sigla.toLowerCase().includes(valorFiltro),
    );
  }

  displayFn(estado: UnidadeFederativa): string {
    return estado && estado.nome ? estado.nome : '';
  }
}
