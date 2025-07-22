import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { AuthService, User } from '../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MenubarModule,
    ButtonModule,
    AvatarModule,
    MenuModule,
  ],
  template: `
    <div class="min-h-screen flex flex-column">
      <p-menubar
        [model]="menuItems"
        styleClass="surface-card border-none border-bottom-1 surface-border px-2 sm:px-4 md:px-6"
      >
        <ng-template pTemplate="start">
          <a
            routerLink="/"
            class="inline-flex align-items-center gap-2 text-900 font-bold text-xl no-underline"
          >
            <span class="pi pi-prime text-primary-500 text-3xl"></span>
            <span>Blog App</span>
          </a>
        </ng-template>

        <ng-template pTemplate="end">
          <div class="flex align-items-center gap-2">
            <ng-container *ngIf="!currentUser; else userMenu">
              <button
                pButton
                pRipple
                label="Login"
                class="p-button-text"
                routerLink="/auth/login"
              ></button>
              <button
                pButton
                pRipple
                label="Register"
                routerLink="/auth/register"
              ></button>
            </ng-container>

            <ng-template #userMenu>
              <p-menu #menu [popup]="true" [model]="userMenuItems"></p-menu>
              <div
                class="flex align-items-center gap-2 cursor-pointer"
                (click)="menu.toggle($event)"
              >
                <p-avatar
                  icon="pi pi-user"
                  styleClass="mr-2"
                  [style]="{ 'background-color': '#2196F3', color: '#ffffff' }"
                ></p-avatar>
                <span class="font-medium">{{ currentUser?.email }}</span>
              </div>
            </ng-template>
          </div>
        </ng-template>
      </p-menubar>

      <main class="flex-grow-1 p-2 sm:p-4 md:p-6">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class LayoutComponent implements OnInit {
  menuItems: MenuItem[] = [];
  userMenuItems: MenuItem[] = [];
  currentUser: User | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.setupUserMenuItems();

    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  private setupUserMenuItems(): void {
    this.userMenuItems = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => {
          // Handle profile click
        },
      },
      {
        separator: true,
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        },
      },
    ];
  }
} 