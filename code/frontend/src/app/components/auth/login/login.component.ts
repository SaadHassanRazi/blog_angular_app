import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ToastModule,
  ],
  providers: [MessageService],
  template: `
    <div
      class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden"
    >
      <div class="flex flex-column align-items-center justify-content-center">
        <div
          style="
            border-radius: 56px;
            padding: 0.3rem;
            background: linear-gradient(
              180deg,
              var(--primary-color) 10%,
              rgba(33, 150, 243, 0) 30%
            );
          "
        >
          <div
            class="w-full surface-card py-8 px-5 sm:px-8"
            style="border-radius: 53px"
          >
            <div class="text-center mb-5">
              <div class="text-900 text-3xl font-medium mb-3">
                Welcome Back
              </div>
              <span class="text-600 font-medium">Sign in to continue</span>
            </div>

            <form (ngSubmit)="onLogin()">
              <div class="p-fluid">
                <div class="field mb-4">
                  <label for="email" class="block text-900 text-xl font-medium mb-2">Email</label>
                  <input
                    id="email"
                    type="text"
                    [(ngModel)]="email"
                    name="email"
                    pInputText
                    class="w-full"
                    style="padding: 1rem"
                    placeholder="Email address"
                    required
                  />
                </div>

                <div class="field mb-4">
                  <label for="password" class="block text-900 font-medium text-xl mb-2">Password</label>
                  <p-password
                    id="password"
                    [(ngModel)]="password"
                    name="password"
                    [toggleMask]="true"
                    styleClass="w-full"
                    [inputStyle]="{ padding: '1rem' }"
                    [style]="{ width: '100%' }"
                    [feedback]="false"
                    placeholder="Password"
                    required
                  ></p-password>
                </div>

                <div
                  class="flex align-items-center justify-content-between mb-5"
                >
                  <a
                    class="font-medium no-underline text-right cursor-pointer"
                    style="color: var(--primary-color)"
                    routerLink="/auth/register"
                    >Create account</a
                  >
                </div>

                <button
                  pButton
                  pRipple
                  label="Sign In"
                  class="w-full p-3 text-xl"
                  type="submit"
                ></button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <p-toast></p-toast>
  `,
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  onLogin(): void {
    if (!this.email || !this.password) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all fields',
      });
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message || 'An error occurred during login',
        });
      },
    });
  }
} 