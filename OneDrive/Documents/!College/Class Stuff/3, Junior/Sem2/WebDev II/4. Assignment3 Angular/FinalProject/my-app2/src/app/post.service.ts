import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Post } from './post/post.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:3000/api/posts';
  private posts: Post[] = [];
  private postsUpdated = new BehaviorSubject<Post[]>([]);

  constructor(private http: HttpClient) {}

  getPosts(userId: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/${userId}`);
  }



  addPost(userId: string, postContent: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${userId}`, { content: postContent });
  }


  getPostsUpdateListener(): Observable<Post[]> {
    return this.postsUpdated.asObservable();
  }

  updatePostDone(userId: string, postId: string, done: boolean): Observable<any> {
    const url = `${this.apiUrl}/${userId}/${postId}`;
    return this.http.patch<any>(url, { done });
  }
  
  
}
