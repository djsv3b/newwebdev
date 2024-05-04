import { Component } from '@angular/core';
import { PostService } from '../../post.service';
import { AuthService } from '../../auth-service.service';
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {
  newPostText: string = '';

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) {}

  addPost(): void {
    const userId = this.authService.getUserId();
    if (this.newPostText.trim()) {
      this.postService.addPost(userId, this.newPostText.trim()).subscribe({
        next: (post) => {
          console.log('Post added:', post);
          this.newPostText = ''; // Clear the text area after the post is added
        },
        error: (error) => {
          console.error('Error adding post:', error);
        }
      });
    }
  }
}
