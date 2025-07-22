import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { BlogService, Post } from '../../../core/services/blog.service';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    ToastModule,
  ],
  providers: [MessageService],
  template: `
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <h1 class="text-900 text-3xl font-medium mb-5">
            {{ isEditMode ? 'Edit Post' : 'Create Post' }}
          </h1>

          <form (ngSubmit)="onSubmit()">
            <div class="p-fluid">
              <div class="field mb-4">
                <label for="title" class="block text-900 font-medium mb-2"
                  >Title</label
                >
                <input
                  id="title"
                  type="text"
                  pInputText
                  [(ngModel)]="post.title"
                  name="title"
                  class="w-full"
                  placeholder="Enter post title"
                  required
                />
              </div>

              <div class="field mb-4">
                <label for="content" class="block text-900 font-medium mb-2"
                  >Content</label
                >
                <textarea
                  id="content"
                  pInputTextarea
                  [(ngModel)]="post.content"
                  name="content"
                  class="w-full"
                  [rows]="10"
                  placeholder="Write your post content"
                  required
                ></textarea>
              </div>

              <div class="col-12 flex justify-content-end gap-2 p-0">
                <button
                  pButton
                  pRipple
                  label="Cancel"
                  class="p-button-secondary"
                  (click)="onCancel()"
                  type="button"
                ></button>
                <button
                  pButton
                  pRipple
                  [label]="isEditMode ? 'Update' : 'Create'"
                  type="submit"
                ></button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <p-toast></p-toast>
  `,
})
export class PostFormComponent implements OnInit {
  isEditMode: boolean = false;
  post: Partial<Post> = {
    title: '',
    content: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadPost(parseInt(id, 10));
    }
  }

  loadPost(id: number): void {
    this.blogService.getPost(id).subscribe({
      next: (post) => {
        this.post = { ...post };
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

  onSubmit(): void {
    if (!this.post.title || !this.post.content) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all fields',
      });
      return;
    }

    const request =
      this.isEditMode && this.post.id
        ? this.blogService.updatePost(
            this.post.id,
            this.post.title,
            this.post.content
          )
        : this.blogService.createPost(this.post.title, this.post.content);

    request.subscribe({
      next: (post) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Post ${
            this.isEditMode ? 'updated' : 'created'
          } successfully`,
        });
        this.router.navigate(['/post', post.id]);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            error.error.message ||
            `Failed to ${this.isEditMode ? 'update' : 'create'} post`,
        });
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }
} 