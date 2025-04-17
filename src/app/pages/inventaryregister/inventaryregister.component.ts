import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-inventaryregister',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './inventaryregister.component.html',
  styleUrls: ['./inventaryregister.component.css']
})
export class InventaryregisterComponent {
  equipoForm: FormGroup;
  selectedFile: File | null = null;
  fileError: string | null = null;

  constructor(private fb: FormBuilder) {
    this.equipoForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      lab_id: ['', Validators.required],
      file: [null]
    });
  }

  onSubmit() {
    if (this.equipoForm.valid) {
      // Lógica para procesar el formulario
      console.log('Formulario enviado:', this.equipoForm.value);
    } else {
      console.log('Formulario no válido');
    }
  }

  getInputClass(controlName: string): string {
    const control = this.equipoForm.get(controlName);
    return control?.touched && control?.invalid ? 'is-invalid' : '';
  }

  hasError(controlName: string): boolean {
    const control = this.equipoForm.get(controlName);
    return (control?.touched && control?.invalid) ?? false;
  }

  getErrorMessage(controlName: string): string {
    const control = this.equipoForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (control?.hasError('min')) {
      return 'El valor debe ser mayor que 0';
    }
    return '';
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileError = null;
    }
  }
}
