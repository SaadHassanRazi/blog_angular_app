import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BlogService, Post } from '../../../core/services/blog.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="grid">
      <div class="col-12">
        <div class="card" *ngIf="post">
          <div
            class="flex flex-column md:flex-row md:justify-content-between md:align-items-start mb-5 gap-3"
          >
            <div class="flex-1">
              <h1 class="text-900 text-4xl font-bold m-0 mb-2">
                {{ post.title }}
              </h1>
              <div class="text-600 font-medium mb-3">
                By {{ post.author?.email }} on
                {{ post.createdAt | date : 'longDate' }}
              </div>
            </div>
            <div class="flex gap-2" *ngIf="isAuthor">
              <button
                pButton
                pRipple
                label="Edit"
                icon="pi pi-pencil"
                class="p-button-primary"
                (click)="onEdit()"
              ></button>
              <button
                pButton
                pRipple
                label="Delete"
                icon="pi pi-trash"
                class="p-button-danger"
                (click)="onDelete()"
              ></button>
            </div>
          </div>

          <div class="post-content text-lg line-height-3">
            {{ post.content }}
          </div>
        </div>
      </div>
    </div>

    <p-confirmDialog
      header="Confirmation"
      icon="pi pi-exclamation-triangle"
    ></p-confirmDialog>
    <p-toast></p-toast>
  `,
})
export class PostDetailComponent implements OnInit {
  post: Post | null = null;
  isAuthor: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPost(parseInt(id, 10));
    }
  }

  loadPost(id: number): void {
    this.blogService.getPost(id).subscribe({
      next: (post) => {
        this.post = post;
        const currentUser = this.authService.getCurrentUser();
        this.isAuthor = currentUser?.id === post.authorId;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load post',
        });
        this.router.navigate(['/']);
      },
    });
  }

  onEdit(): void {
    if (this.post) {
      this.router.navigate(['/post/edit', this.post.id]);
    }
  }

  onDelete(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this post?',
      accept: () => {
        if (this.post) {
          this.blogService.deletePost(this.post.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Post deleted successfully',
              });
              this.router.navigate(['/']);
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete post',
              });
            },
          });
        }
      },
    });
  }
} 