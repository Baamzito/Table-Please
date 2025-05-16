import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  searchForm: FormGroup

  constructor(private fb: FormBuilder, private router: Router) {
    this.searchForm = fb.group({
      name: ['', [Validators.required]],
      city: ['', [Validators.required]]
    })
   }

  onSearchSubmit(): void {

  }

}
