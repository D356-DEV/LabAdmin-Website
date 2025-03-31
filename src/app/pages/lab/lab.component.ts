// app/pages/lab/lab.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LabService } from '../../services/lab.service';
import { Laboratory } from '../../interfaces/labinterfaces';
import { CommonModule } from '@angular/common';

enum ViewMode {
  LIST,
  CREATE,
  EDIT,
  DETAILS
}

@Component({
  selector: 'app-lab',
  templateUrl: './lab.component.html',
  styleUrls: ['./lab.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class LabComponent implements OnInit {
  // View mode management
  viewMode: ViewMode = ViewMode.LIST;
  ViewMode = ViewMode; // Expose enum to template
  
  // Data
  laboratories: Laboratory[] = [];
  selectedLab: Laboratory | null = null;
  
  // Form
  labForm: FormGroup;
  selectedImage: File | null = null;
  
  // UI state
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private labService: LabService
  ) {
    this.labForm = this.createLabForm();
  }

  ngOnInit(): void {
    this.loadLabs();
  }

  // Form initialization
  createLabForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      location: ['', [Validators.required, Validators.maxLength(255)]],
      capacity: [0, [Validators.required, Validators.min(1)]],
      description: ['', Validators.required],
      institution: ['', [Validators.required, Validators.maxLength(100)]],
      campus: ['', [Validators.required, Validators.maxLength(100)]],
      specialization: ['', [Validators.required, Validators.maxLength(255)]],
      manager_id: [null],
      creator_id: [1, Validators.required] // Default value, should be the logged in user's ID
    });
  }

  // View mode changes
  showCreateForm(): void {
    this.labForm.reset();
    this.labForm.patchValue({ creator_id: 1 }); // Set default values
    this.selectedImage = null;
    this.viewMode = ViewMode.CREATE;
  }

  showEditForm(lab: Laboratory): void {
    this.selectedLab = lab;
    this.labForm.reset();
    this.labForm.patchValue(lab);
    this.selectedImage = null;
    this.viewMode = ViewMode.EDIT;
  }

  showDetails(lab: Laboratory): void {
    this.selectedLab = lab;
    this.viewMode = ViewMode.DETAILS;
  }

  backToList(): void {
    this.viewMode = ViewMode.LIST;
    this.selectedLab = null;
  }

  // Data loading
  async loadLabs(): Promise<void> {
    try {
      this.loading = true;
      this.laboratories = await this.labService.getLabs();
      this.loading = false;
    } catch (error) {
      this.errorMessage = 'Failed to load laboratories';
      this.loading = false;
    }
  }

  // Form handling
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
    }
  }

  async onSubmit(): Promise<void> {
    if (this.labForm.invalid) {
      return;
    }

    try {
      this.loading = true;
      const formData: Laboratory = this.labForm.value;
      
      let result;
      if (this.viewMode === ViewMode.EDIT && this.selectedLab) {
        formData.lab_id = this.selectedLab.lab_id;
        result = await this.labService.updateLab(formData);
      } else {
        result = await this.labService.createLab(formData);
      }

      // Upload image if selected
      if (this.selectedImage && result.lab_id) {
        await this.labService.uploadLabImage(result.lab_id, this.selectedImage);
      }

      this.loading = false;
      await this.loadLabs(); // Refresh the list
      this.backToList();
    } catch (error) {
      this.errorMessage = this.viewMode === ViewMode.EDIT 
        ? 'Failed to update laboratory' 
        : 'Failed to create laboratory';
      this.loading = false;
    }
  }

  // Delete operation
  async deleteLab(labId: number): Promise<void> {
    if (confirm('Are you sure you want to delete this laboratory?')) {
      try {
        this.loading = true;
        await this.labService.deleteLab(labId);
        await this.loadLabs(); // Refresh the list
        
        if (this.viewMode !== ViewMode.LIST) {
          this.backToList();
        }
        
        this.loading = false;
      } catch (error) {
        this.errorMessage = 'Failed to delete laboratory';
        this.loading = false;
      }
    }
  }
}