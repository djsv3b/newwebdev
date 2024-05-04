import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Post } from './post/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
    private apiUrl = 'http://localhost:3000/api/posts';
    private posts = new BehaviorSubject<Post[]>([]);

    constructor(private http: HttpClient) {}

    getPosts(userId: string): Observable<Post[]> {
        return this.http.get<Post[]>(`${this.apiUrl}/${userId}`).pipe(
            tap(posts => {
                this.posts.next(posts); // Update the BehaviorSubject with the new posts
            })
        );
    }

    getPostsUpdateListener(): Observable<Post[]> {
        return this.posts.asObservable();
    }

    addPost(userId: string, postContent: string): Observable<Post> {
        return this.http.post<Post>(`${this.apiUrl}/${userId}`, { content: postContent }).pipe(
            tap((newPost) => {
                const updatedPosts = [...this.posts.getValue(), newPost];
                this.posts.next(updatedPosts); // Update the BehaviorSubject with the new list
            })
        );
    }

    deletePost(userId: string, postId: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${userId}/${postId}`).pipe(
            tap(() => {
                const updatedPosts = this.posts.getValue().filter(post => post._id !== postId);
                this.posts.next(updatedPosts); // Update the BehaviorSubject with the new list
            })
        );
    }
}