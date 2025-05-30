  import { Component, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
  import { Router, RouterLink } from '@angular/router';
  import { UserService } from '../../../services/user.service';
  import { AuthService } from '../../../services/auth.service';
  import { CommonModule } from '@angular/common';

  @Component({
    selector: 'app-edit-profile',
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './edit-profile.component.html',
    styleUrl: './edit-profile.component.css'
  })
  export class EditProfileComponent implements OnInit{
    profileForm: FormGroup;
    user: any = {};
    error: string = '';
    previewImageSrc: string = '/assets/images/default-avatar.jpg';
    selectedFile: File | null = null;

    constructor(private fb: FormBuilder, private router: Router, private userService: UserService, private authService: AuthService){
      this.profileForm = this.fb.group({
        firstName: ['', [Validators.required, Validators.pattern(/\S+/)]],
        lastName: ['', [Validators.required, Validators.pattern(/\S+/)]],
        username: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^[a-zA-Z0-9_]+$')]],
        email: ['', [Validators.required, Validators.email]],
        street: ['', [Validators.required, Validators.pattern(/\S+/)]],
        city: ['', [Validators.required, Validators.pattern(/\S+/)]],
        postalCode: ['', [Validators.required, Validators.pattern(/^[0-9]{4}-[0-9]{3}$/)]],
      })
    }

    ngOnInit(): void {
      this.loadUserProfile();
    }

    loadUserProfile(): void {
      this.userService.getUser().subscribe({
        next: (user) => {
          this.user = user;
          this.updateForm(user);
          this.updatePreviewImage(user);
        },
        error: (error) => {
          console.error('Erro ao carregar perfil:', error);
          this.error = 'Erro ao carregar dados do perfil';
        }
      });
    }

    updateForm(user: any): void {
      this.profileForm.patchValue({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        postalCode: user.address?.postalCode || ''
      });
    }

    updatePreviewImage(user: any): void {
      this.previewImageSrc = user.profileImage || '/assets/images/default-avatar.jpg';
    }

    onFileSelected(event: any): void {
      const file = event.target.files[0];
      if (file) {
        // Validar tamanho do arquivo (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          this.error = 'O arquivo deve ter no máximo 5MB';
          return;
        }

        // Validar tipo do arquivo
        if (!file.type.startsWith('image/')) {
          this.error = 'Por favor selecione apenas arquivos de imagem';
          return;
        }

        this.selectedFile = file;
        
        // Criar preview da imagem
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewImageSrc = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    }

    onRemoveImage(): void {
      this.selectedFile = null;
      this.previewImageSrc = '/assets/images/default-avatar.jpg';
      const fileInput = document.getElementById('profileImage') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }

    onSubmit(): void {
      if (this.profileForm.valid) {
        // Preparar dados do formulário
        const profileData = {
          firstName: this.profileForm.value.firstName,
          lastName: this.profileForm.value.lastName,
          username: this.profileForm.value.username,
          email: this.profileForm.value.email,
          address_street: this.profileForm.value.street || '',
          address_city: this.profileForm.value.city || '',
          address_postalCode: this.profileForm.value.postalCode || ''
        };

        // Enviar dados para o servidor
        this.userService.updateProfile(profileData).subscribe({
          next: () => {
            this.router.navigate(['/profile']);
          },
          error: (error) => {
            console.error('Erro ao atualizar perfil:', error);
            this.error = error.error?.message || 'Erro ao atualizar perfil';
          }
        });
      } else {
        this.markFormGroupTouched();
        this.error = 'Por favor, corrija os erros no formulário';
      }
    }

    markFormGroupTouched(): void {
      Object.keys(this.profileForm.controls).forEach(key => {
        const control = this.profileForm.get(key);
        control?.markAsTouched();
      });
    }

    onCancel(): void {
      this.router.navigate(['/profile']);
    }

    clearError(): void {
      this.error = '';
    }
  }
