import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-recovery',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './recovery.component.html',
  styleUrl: './recovery.component.css',
})
export class RecoveryComponent {
  userService = inject(UsersService);
  recoveryForm: FormGroup;
  recoveryMessage: string = '';
  isLoading: boolean = false;
  isSuccess: boolean = false;

  constructor(private fb: FormBuilder) {
    this.recoveryForm = this.fb.group({
      email: new FormControl('', [Validators.required]),
    });
  }

  async resetPassword() {
    this.isLoading = true;

    if (this.recoveryForm.invalid) {
      this.recoveryMessage = 'El correo electrónico es necesario.';
      this.isLoading = false;
      return;
    }

    const email = this.recoveryForm.controls['email'].value.trim();

    if (await this.userService.verifyEmail(email)) {
      this.recoveryMessage =
        'Este correo no está asociado a una cuenta en LabAdmin.';
      this.isLoading = false;
      return;
    }

    try {
      const response = await this.userService.resetPassword(email);

      if (response) {
        this.isSuccess = true;
        this.recoveryMessage =
          'Se ha enviado un correo electrónico con su contraseña temporal.';
      } else {
        this.recoveryMessage =
          'Ocurrió un error al intentar enviar el correo. Intente de nuevo más tarde.';
      }
    } catch (error) {
      console.error('Error al enviar la solicitud de recuperación:', error);
      this.recoveryMessage = 'Hubo un problema al procesar su solicitud.';
    } finally {
      this.isLoading = false;
    }
  }
}
