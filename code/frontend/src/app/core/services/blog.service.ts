import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  createdAt: string;
  author?: {
    id: number;
    email: string;
  };
}

export interface PostsResponse {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  posts: Post[];
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPosts(page: number = 1): Observable<PostsResponse> {
    return this.http.get<PostsResponse>(`${this.API_URL}/posts/?page=${page}`);
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.API_URL}/posts/post/${id}`);
  }

  createPost(title: string, content: string): Observable<Post> {
    return this.http.post<Post>(`${this.API_URL}/posts/post`, { title, content });
  }

  updatePost(id: number, title: string, content: string): Observable<Post> {
    return this.http.put<Post>(`${this.API_URL}/posts/post/${id}`, { title, content });
  }

  deletePost(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/posts/post/${id}`);
  }
} 