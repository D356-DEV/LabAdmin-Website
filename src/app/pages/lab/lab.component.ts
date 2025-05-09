import { Component, inject, OnInit } from '@angular/core';
import { LabData } from '../../interfaces/LabInterfaces';
import { AuthService } from '../../services/auth.service';
import { LabService } from '../../services/lab.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { AdminData } from '../../interfaces/AdminInterfaces';
import { AdminsService } from '../../services/admins.service';
import { CreateReserv, ReservData } from '../../interfaces/ReservInterfaces';
import { ReservService } from '../../services/reserv.service';
import { NoticeService } from '../../services/notice.service';
import {
  NoticeData,
  createNotice,
  deleteNotice,
} from '../../interfaces/NoticeInterfaces';
import {
  CreateSchedule,
  ScheduleData,
  UpdateSchedule,
} from '../../interfaces/ScheduleInterfaces';
import { SchedulesService } from '../../services/schedules.service';
@Component({
  selector: 'app-lab',
  imports: [NgTemplateOutlet, ReactiveFormsModule, DatePipe],
  templateUrl: './lab.component.html',
  styleUrl: './lab.component.css',
})
export class LabComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private labService = inject(LabService);
  private authService = inject(AuthService);
  private adminService = inject(AdminsService);
  private reservService = inject(ReservService);
  private noticeService = inject(NoticeService);
  private scheduleService = inject(SchedulesService);

  user_id: number = 0;
  lab_id: number = 0;
  admin_id: number = 0;

  reservs: ReservData[] | any;
  lab: LabData | undefined;
  admin: AdminData | undefined;
  schedule: ScheduleData | undefined;

  isLoading: boolean = true;
  isAdmin: boolean = false;
  isOwner: boolean = false;

  showNoticesSection: boolean = false;
  showAllNotices: boolean = false;

  noticeForm: FormGroup;
  notices: NoticeData[] | undefined;
  isLoadingNotices: boolean = false;
  showNoticeForm: boolean = false;
  noticeErrorMessage: string = '';
  noticeSuccessMessage: string = '';

  quoteSent: boolean = false;
  requestingQuote: boolean = false;
  errorSending: boolean = false;

  reservationForm: FormGroup;
  reservationMessage: string = '';

  updateNameForm: FormGroup;
  updateNameMessage: string = '';

  updateInstitutionForm: FormGroup;
  updateInstitutionMessage: string = '';

  updateCampusForm: FormGroup;
  updateCampusMessage: string = '';

  updateSpecializationForm: FormGroup;
  updateSpecialtyMessage: string = '';

  updateLocationForm: FormGroup;
  updateLocationMessage: string = '';

  updateDescriptionForm: FormGroup;
  updateDescriptionMessage: string = '';

  updateCapacityForm: FormGroup;
  updateCapacityMessage: string = '';

  deleteLabMessage: string = '';

  scheduleForm: FormGroup;
  scheduleMessage: string = '';

  constructor(fb: FormBuilder) {
    this.updateNameForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
    });

    this.updateInstitutionForm = new FormGroup({
      institution: new FormControl('', [Validators.required]),
    });

    this.updateCampusForm = new FormGroup({
      campus: new FormControl('', [Validators.required]),
    });

    this.updateSpecializationForm = new FormGroup({
      specialization: new FormControl('', [Validators.required]),
    });

    this.updateLocationForm = new FormGroup({
      location: new FormControl('', [Validators.required]),
    });

    this.updateDescriptionForm = new FormGroup({
      udescription: new FormControl('', [Validators.required]),
    });

    this.updateCapacityForm = new FormGroup({
      capacity: new FormControl('', [Validators.required, Validators.min(1)]),
    });

    this.reservationForm = new FormGroup(
      {
        reserv_date: new FormControl('', [
          Validators.required,
          this.minDateValidator(),
        ]),
        start_time: new FormControl('', [Validators.required]),
        end_time: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
      },
      { validators: this.timeRangeValidator() }
    );

    this.scheduleForm = fb.group({
      shcedule_id: [''],
      lab_id: [''],
      active_monday: [false],
      start_time_monday: [''],
      end_time_monday: [''],
      active_tuesday: [false],
      start_time_tuesday: [''],
      end_time_tuesday: [''],
      active_wednesday: [false],
      start_time_wednesday: [''],
      end_time_wednesday: [''],
      active_thursday: [false],
      start_time_thursday: [''],
      end_time_thursday: [''],
      active_friday: [false],
      start_time_friday: [''],
      end_time_friday: [''],
      active_saturday: [false],
      start_time_saturday: [''],
      end_time_saturday: [''],
      active_sunday: [false],
      start_time_sunday: [''],
      end_time_sunday: [''],
    });

    this.noticeForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      message: new FormControl('', [
        Validators.required,
        Validators.maxLength(500),
      ]),
    });
  }

  async ngOnInit() {
    // Scroll to top of the page on component init
    window.scroll({ top: 0, behavior: 'smooth' });

    try {
      // Extract lab_id from route parameters
      this.lab_id = Number(this.route.snapshot.paramMap.get('lab_id'));

      // Validate lab_id
      if (!this.lab_id || this.lab_id < 1) {
        this.router.navigate(['/labs']);
        return;
      }

      // Fetch lab details
      this.lab = await this.labService.getLab(this.lab_id);
      if (!this.lab) {
        this.router.navigate(['/labs']);
        return;
      }

      // Fetch reservations for the lab
      this.reservs = await this.reservService.getByLab(this.lab_id);

      // Retrieve and validate current user ID
      this.user_id = Number(this.authService.getStoredUserId());
      if (!this.user_id || this.user_id < 1) {
        this.router.navigate(['/labs']);
        return;
      }

      // Check if the user is an admin
      const isAdminUser = await this.adminService.isUserAdmin(this.user_id);
      if (isAdminUser) {
        this.isAdmin = true;

        // Load admin details
        this.admin = await this.adminService.getByUser(this.user_id);
        this.admin_id = this.admin?.admin_id || 0;

        // Check if the admin is the owner (creator) of the lab
        if (this.admin_id && this.admin_id === this.lab.creator_id) {
          this.isOwner = true;
        }
      }

      // Load schedule for the lab
      this.schedule = await this.scheduleService.getByLabId(this.lab.lab_id);

      // Load additional notices for the lab
      await this.loadNotices();
    } catch (error) {
      console.error('Error during lab initialization:', error);
      this.router.navigate(['/labs']);
    } finally {
      // Mark loading as complete
      this.isLoading = false;
    }
  }

  async toggleAllNotices(): Promise<void> {
    this.showAllNotices = !this.showAllNotices;
    await this.loadNotices();
  }

  async createSchedule() {
    if (!this.isOwner) {
      this.scheduleMessage = 'No tienes permiso para crear un horario.';
      return;
    }

    if (this.schedule) {
      let scheduleData: UpdateSchedule = {
        schedule_id: this.schedule?.schedule_id,
        lab_id: this.lab_id,
        active_monday: this.scheduleForm.value.active_monday ? 1 : 0,
        start_time_monday: this.scheduleForm.value.start_time_monday
          ? this.scheduleForm.value.start_time_monday
          : '00:00:00',
        end_time_monday: this.scheduleForm.value.end_time_monday
          ? this.scheduleForm.value.end_time_monday
          : '00:00:00',
        active_tuesday: this.scheduleForm.value.active_tuesday ? 1 : 0,
        start_time_tuesday: this.scheduleForm.value.start_time_tuesday
          ? this.scheduleForm.value.start_time_tuesday
          : '00:00:00',
        end_time_tuesday: this.scheduleForm.value.end_time_tuesday
          ? this.scheduleForm.value.end_time_tuesday
          : '00:00:00',
        active_wednesday: this.scheduleForm.value.active_wednesday ? 1 : 0,
        start_time_wednesday: this.scheduleForm.value.start_time_wednesday
          ? this.scheduleForm.value.start_time_wednesday
          : '00:00:00',
        end_time_wednesday: this.scheduleForm.value.end_time_wednesday
          ? this.scheduleForm.value.end_time_wednesday
          : '00:00:00',
        active_thursday: this.scheduleForm.value.active_thursday ? 1 : 0,
        start_time_thursday: this.scheduleForm.value.start_time_thursday
          ? this.scheduleForm.value.start_time_thursday
          : '00:00:00',
        end_time_thursday: this.scheduleForm.value.end_time_thursday
          ? this.scheduleForm.value.end_time_thursday
          : '00:00:00',
        active_friday: this.scheduleForm.value.active_friday ? 1 : 0,
        start_time_friday: this.scheduleForm.value.start_time_friday
          ? this.scheduleForm.value.start_time_friday
          : '00:00:00',
        end_time_friday: this.scheduleForm.value.end_time_friday
          ? this.scheduleForm.value.end_time_friday
          : '00:00:00',
        active_saturday: this.scheduleForm.value.active_saturday ? 1 : 0,
        start_time_saturday: this.scheduleForm.value.start_time_saturday
          ? this.scheduleForm.value.start_time_saturday
          : '00:00:00',
        end_time_saturday: this.scheduleForm.value.end_time_saturday
          ? this.scheduleForm.value.end_time_saturday
          : '00:00:00',
        active_sunday: this.scheduleForm.value.active_sunday ? 1 : 0,
        start_time_sunday: this.scheduleForm.value.start_time_sunday
          ? this.scheduleForm.value.start_time_sunday
          : '00:00:00',
        end_time_sunday: this.scheduleForm.value.end_time_sunday
          ? this.scheduleForm.value.end_time_sunday
          : '00:00:00',
      };

      console.log('scheduleData', scheduleData);
      try {
        const response = await this.scheduleService.updateSchedule(
          scheduleData
        );
        if (response) {
          this.scheduleMessage = 'Horario creado exitosamente.';
          this.scheduleForm.reset();
          window.location.reload();
        } else {
          this.scheduleMessage = 'No se pudo crear el horario.';
          console.error('Error al crear el horario:', response);
        }
      } catch (error) {
        console.error('Error al crear el horario:', error);
        this.scheduleMessage = 'Ocurrió un error inesperado.';
      }
    }

    let scheduleData: CreateSchedule = {
      lab_id: this.lab_id,
      active_monday: this.scheduleForm.value.active_monday ? 1 : 0,
      start_time_monday: this.scheduleForm.value.start_time_monday
        ? this.scheduleForm.value.start_time_monday
        : '00:00:00',
      end_time_monday: this.scheduleForm.value.end_time_monday
        ? this.scheduleForm.value.end_time_monday
        : '00:00:00',
      active_tuesday: this.scheduleForm.value.active_tuesday ? 1 : 0,
      start_time_tuesday: this.scheduleForm.value.start_time_tuesday
        ? this.scheduleForm.value.start_time_tuesday
        : '00:00:00',
      end_time_tuesday: this.scheduleForm.value.end_time_tuesday
        ? this.scheduleForm.value.end_time_tuesday
        : '00:00:00',
      active_wednesday: this.scheduleForm.value.active_wednesday ? 1 : 0,
      start_time_wednesday: this.scheduleForm.value.start_time_wednesday
        ? this.scheduleForm.value.start_time_wednesday
        : '00:00:00',
      end_time_wednesday: this.scheduleForm.value.end_time_wednesday
        ? this.scheduleForm.value.end_time_wednesday
        : '00:00:00',
      active_thursday: this.scheduleForm.value.active_thursday ? 1 : 0,
      start_time_thursday: this.scheduleForm.value.start_time_thursday
        ? this.scheduleForm.value.start_time_thursday
        : '00:00:00',
      end_time_thursday: this.scheduleForm.value.end_time_thursday
        ? this.scheduleForm.value.end_time_thursday
        : '00:00:00',
      active_friday: this.scheduleForm.value.active_friday ? 1 : 0,
      start_time_friday: this.scheduleForm.value.start_time_friday
        ? this.scheduleForm.value.start_time_friday
        : '00:00:00',
      end_time_friday: this.scheduleForm.value.end_time_friday
        ? this.scheduleForm.value.end_time_friday
        : '00:00:00',
      active_saturday: this.scheduleForm.value.active_saturday ? 1 : 0,
      start_time_saturday: this.scheduleForm.value.start_time_saturday
        ? this.scheduleForm.value.start_time_saturday
        : '00:00:00',
      end_time_saturday: this.scheduleForm.value.end_time_saturday
        ? this.scheduleForm.value.end_time_saturday
        : '00:00:00',
      active_sunday: this.scheduleForm.value.active_sunday ? 1 : 0,
      start_time_sunday: this.scheduleForm.value.start_time_sunday
        ? this.scheduleForm.value.start_time_sunday
        : '00:00:00',
      end_time_sunday: this.scheduleForm.value.end_time_sunday
        ? this.scheduleForm.value.end_time_sunday
        : '00:00:00',
    };

    console.log('scheduleData', scheduleData);
    try {
      const response = await this.scheduleService.createSchedule(scheduleData);
      if (response) {
        this.scheduleMessage = 'Horario creado exitosamente.';
        this.scheduleForm.reset();
        window.location.reload();
      } else {
        this.scheduleMessage = 'No se pudo crear el horario.';
        console.error('Error al crear el horario:', response);
      }
    } catch (error) {
      console.error('Error al crear el horario:', error);
      this.scheduleMessage = 'Ocurrió un error inesperado.';
    }
  }

  async loadNotices(): Promise<void> {
    this.isLoadingNotices = true;
    this.noticeErrorMessage = '';

    try {
      if (this.isAdmin && this.showAllNotices) {
        this.notices = await this.noticeService.getbyAdmin(this.admin_id);
      } else {
        this.notices = await this.noticeService.getbyLab(this.lab_id);
      }
      this.notices = this.notices.sort(
        (a, b) =>
          new Date(b.creation_date).getTime() -
          new Date(a.creation_date).getTime()
      );
    } catch (error) {
      this.noticeErrorMessage =
        'Error al cargar los anuncios. Intente de nuevo más tarde.';
      console.error('Error en loadNotices:', error);
    } finally {
      this.isLoadingNotices = false;
    }
  }

  async submitNotice() {
    if (this.noticeForm.invalid || !this.isAdmin || !this.admin_id) return;
    this.isLoadingNotices = true;
    this.noticeErrorMessage = '';
    this.noticeSuccessMessage = '';
    const newNotice: createNotice = {
      admin_id: this.admin_id,
      lab_id: this.lab_id,
      title: this.noticeForm.value.title,
      message: this.noticeForm.value.message,
    };
    try {
      const success = await this.noticeService.createNotice(newNotice);
      if (success) {
        this.noticeSuccessMessage = 'Anuncio creado correctamente.';
        this.noticeForm.reset();
        this.showNoticeForm = false;
        await this.loadNotices();
      } else {
        this.noticeErrorMessage =
          'No se pudo crear el anuncio. Intente de nuevo.';
      }
    } catch (error) {
      this.noticeErrorMessage =
        'Error al crear el anuncio. Intente de nuevo más tarde.';
      console.error('Error al crear anuncio:', error);
    } finally {
      this.isLoadingNotices = false;
    }
  }

  async deleteNotice(noticeId: number) {
    if (!this.isAdmin || !this.admin_id) {
      return;
    }

    if (!confirm('¿Está seguro que desea eliminar este anuncio?')) {
      return;
    }

    this.isLoadingNotices = true;
    this.noticeErrorMessage = '';
    this.noticeSuccessMessage = '';

    const deleteReq: deleteNotice = {
      admin_id: this.admin_id,
      notice_id: noticeId,
    };

    try {
      const success = await this.noticeService.deleteNotice(deleteReq);
      if (success) {
        this.noticeSuccessMessage = 'Anuncio eliminado correctamente.';
        await this.loadNotices();
      } else {
        this.noticeErrorMessage =
          'No se pudo eliminar el anuncio. Intente de nuevo.';
      }
    } catch (error) {
      this.noticeErrorMessage =
        'Error al eliminar el anuncio. Intente de nuevo más tarde.';
      console.error('Error al eliminar anuncio:', error);
    } finally {
      this.isLoadingNotices = false;
    }
  }

  async createReserv() {
    const dateControl = this.reservationForm.get('reserv_date');
    const startTimeControl = this.reservationForm.get('start_time');
    const endTimeControl = this.reservationForm.get('end_time');

    this.reservationForm.markAllAsTouched();

    if (this.reservationForm.invalid) {
      if (dateControl?.errors) {
        if (dateControl.errors['required']) {
          this.reservationMessage = 'La fecha es obligatoria.';
        } else if (dateControl.errors['minDate']) {
          this.reservationMessage = 'La fecha no puede ser anterior a hoy.';
        } else {
          this.reservationMessage = 'Error en el campo de fecha.';
        }
      } else if (startTimeControl?.errors) {
        if (startTimeControl.errors['required']) {
          this.reservationMessage = 'La hora de inicio es obligatoria.';
        } else {
          this.reservationMessage = 'Error en la hora de inicio.';
        }
      } else if (endTimeControl?.errors) {
        if (endTimeControl.errors['required']) {
          this.reservationMessage = 'La hora de fin es obligatoria.';
        } else {
          this.reservationMessage = 'Error en la hora de fin.';
        }
      } else if (this.reservationForm.errors?.['invalidTimeRange']) {
        this.reservationMessage =
          'La hora de fin debe ser posterior a la hora de inicio.';
      } else {
        this.reservationMessage = 'Formulario incompleto o con errores.';
      }
      return;
    }

    const reservData: CreateReserv = {
      ...this.reservationForm.value,
      lab_id: this.lab_id,
      user_id: this.user_id,
    };

    try {
      const response = await this.reservService.createReserv(reservData);
      if (response) {
        this.reservationMessage = 'Solicitud creada exitosamente.';
        this.reservationForm.reset();
        window.location.reload();
      } else {
        this.reservationMessage =
          'No se pudo crear la solicitud. Intenta nuevamente.';
        console.error(
          'Respuesta nula o inválida al generar la solicitud de reservación.'
        );
      }
    } catch (error) {
      console.error('Error al crear la reservación:', error);
      this.reservationMessage =
        'Ocurrió un error inesperado al generar la reservación.';
    }
  }

  async updateName() {
    if (this.updateNameForm.invalid) {
      this.updateNameMessage = 'Formulario incompleto.';
      return;
    }
    const nameData = this.updateNameForm.value;
    try {
      const response = await this.labService.updateName(
        this.lab_id,
        nameData.name
      );
      if (response) {
        this.updateNameMessage = 'Nombre actualizado exitosamente.';
        window.location.reload();
      } else {
        this.updateNameMessage = 'No se pudo actualizar el nombre.';
        console.error('Error al actualizar el nombre:', response);
      }
    } catch (error) {
      console.error('Error al actualizar el nombre:', error);
      this.updateNameMessage = 'Ocurrió un error inesperado.';
    }
  }

  async updateInstitution() {
    if (this.updateInstitutionForm.invalid) {
      this.updateInstitutionMessage = 'Formulario incompleto.';
      return;
    }

    const institutionData = this.updateInstitutionForm.value;

    try {
      const response = await this.labService.updateInstitution(
        this.lab_id,
        institutionData.institution
      );
      if (response) {
        this.updateInstitutionMessage = 'Institución actualizada exitosamente.';
        window.location.reload();
      } else {
        this.updateInstitutionMessage = 'No se pudo actualizar la institución.';
        console.error('Error al actualizar la institución:', response);
      }
    } catch (error) {
      console.error('Error al actualizar la institución:', error);
      this.updateInstitutionMessage = 'Ocurrió un error inesperado.';
    }
  }

  async updateCampus() {
    if (this.updateCampusForm.invalid) {
      this.updateCampusMessage = 'Formulario incompleto.';
      return;
    }

    const campusData = this.updateCampusForm.value;

    try {
      const response = await this.labService.updateCampus(
        this.lab_id,
        campusData.campus
      );
      if (response) {
        this.updateCampusMessage = 'Campus actualizado exitosamente.';
        this.updateCampusForm.reset();
        window.location.reload();
      } else {
        this.updateCampusMessage = 'No se pudo actualizar el campus.';
        console.error('Error al actualizar el campus:', response);
      }
    } catch (error) {
      console.error('Error al actualizar el campus:', error);
      this.updateCampusMessage = 'Ocurrió un error inesperado.';
    }
  }

  async updateSpecialization() {
    if (this.updateSpecializationForm.invalid) {
      this.updateSpecialtyMessage = 'Formulario incompleto.';
      return;
    }

    const specializationData = this.updateSpecializationForm.value;

    try {
      const response = await this.labService.updateSpecialization(
        this.lab_id,
        specializationData.specialization
      );
      if (response) {
        this.updateSpecialtyMessage =
          'Especialización actualizada exitosamente.';
        window.location.reload();
      } else {
        this.updateSpecialtyMessage =
          'No se pudo actualizar la especialización.';
        console.error('Error al actualizar la especialización:', response);
      }
    } catch (error) {
      console.error('Error al actualizar la especialización:', error);
      this.updateSpecialtyMessage = 'Ocurrió un error inesperado.';
    }
  }

  async updateLocation() {
    if (this.updateLocationForm.invalid) {
      this.updateLocationMessage = 'Formulario incompleto.';
      return;
    }

    const locationData = this.updateLocationForm.value;

    try {
      const response = await this.labService.updateLocation(
        this.lab_id,
        locationData.location
      );
      if (response) {
        this.updateLocationMessage = 'Ubicación actualizada exitosamente.';
        window.location.reload();
      } else {
        this.updateLocationMessage = 'No se pudo actualizar la ubicación.';
        console.error('Error al actualizar la ubicación:', response);
      }
    } catch (error) {
      console.error('Error al actualizar la ubicación:', error);
      this.updateLocationMessage = 'Ocurrió un error inesperado.';
    }
  }

  async updateDescription() {
    if (this.updateDescriptionForm.invalid) {
      this.updateDescriptionMessage = 'Formulario incompleto.';
      return;
    }

    const descriptionData = this.updateDescriptionForm.value;

    try {
      const response = await this.labService.updateDescription(
        this.lab_id,
        descriptionData.udescription
      );
      if (response) {
        this.updateDescriptionMessage = 'Descripción actualizada exitosamente.';
        window.location.reload();
      } else {
        this.updateDescriptionMessage = 'No se pudo actualizar la descripción.';
        console.error('Error al actualizar la descripción:', response);
      }
    } catch (error) {
      console.error('Error al actualizar la descripción:', error);
      this.updateDescriptionMessage = 'Ocurrió un error inesperado.';
    }
  }

  async updateCapacity() {
    if (this.updateCapacityForm.invalid) {
      this.updateCapacityMessage = 'Formulario incompleto.';
      return;
    }

    const capacityData = this.updateCapacityForm.value;

    try {
      const response = await this.labService.updateCapacity(
        this.lab_id,
        capacityData.capacity
      );
      if (response) {
        this.updateCapacityMessage = 'Capacidad actualizada exitosamente.';
        window.location.reload();
      } else {
        this.updateCapacityMessage = 'No se pudo actualizar la capacidad.';
        console.error('Error al actualizar la capacidad:', response);
      }
    } catch (error) {
      console.error('Error al actualizar la capacidad:', error);
      this.updateCapacityMessage = 'Ocurrió un error inesperado.';
    }
  }

  async deleteLab() {
    try {
      if (!this.lab?.creator_id) {
        this.deleteLabMessage =
          'No se pudo obtener el creador del laboratorio.';
        console.log('creator_id no está disponible');
        return;
      }

      const deleted = await this.labService.deleteLab(
        this.lab_id,
        this.lab.creator_id
      );

      if (deleted) {
        this.deleteLabMessage = 'Laboratorio eliminado exitosamente.';
        this.router.navigate(['/labs']);
      } else {
        this.deleteLabMessage = 'No se pudo eliminar el laboratorio.';
      }
    } catch (error) {
      console.error('Error al eliminar el laboratorio:', error);
      this.deleteLabMessage =
        'Ocurrió un error inesperado al eliminar el laboratorio.';
    }
  }

  capitalizeString(str: string | undefined): string {
    if (!str) return '';
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  minDateValidator() {
    return (control: AbstractControl) => {
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Eliminar la hora para comparar solo fecha

      if (!control.value) return null;

      return selectedDate < today ? { minDate: true } : null;
    };
  }

  timeRangeValidator() {
    return (group: AbstractControl) => {
      const start = group.get('start_time')?.value;
      const end = group.get('end_time')?.value;
      if (!start || !end) return null;

      const [startH, startM] = start.split(':').map(Number);
      const [endH, endM] = end.split(':').map(Number);
      const startTotal = startH * 60 + startM;
      const endTotal = endH * 60 + endM;

      return endTotal > startTotal ? null : { invalidTimeRange: true };
    };
  }

  toggleNoticeForm(): void {
    this.showNoticeForm = !this.showNoticeForm;
    if (!this.showNoticeForm) {
      this.noticeForm.reset();
    }
  }
}
