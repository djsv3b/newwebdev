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
        this.posts.next(posts);  // Update the BehaviorSubject with the new posts
      })
    );
  }

  getPostsUpdateListener(): Observable<Post[]> {
    return this.posts.asObservable();
  }

  addPost(userId: string, postContent: string): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/${userId}`, { content: postContent }).pipe(
      tap((newPost) => {
        const currentPosts = this.posts.getValue();
        this.posts.next([...currentPosts, newPost]);  // Include the new post in the current posts array
      })
    );
  }
  
  updatePostDone(userId: string, postId: string, done: boolean): Observable<any> {
    const url = `${this.apiUrl}/${userId}/posts/${postId}`;
    return this.http.patch<any>(url, { done }).pipe(
      tap(() => {
        this.updatePostStatus(postId, done);  // Also update the local state
      })
    );
  }

  private updatePostStatus(postId: string, done: boolean) {
    postId = postId.toString(); // Ensure postId is a string
    const updatedPosts = this.posts.getValue().map(post => {
        // Ensure post._id is treated as a string as well
        if (post._id.toString() === postId) {
            return { ...post, done: done };  // Update done status
        }
        return post;
    });
    this.posts.next(updatedPosts);  // Emit the updated posts array
}

}
