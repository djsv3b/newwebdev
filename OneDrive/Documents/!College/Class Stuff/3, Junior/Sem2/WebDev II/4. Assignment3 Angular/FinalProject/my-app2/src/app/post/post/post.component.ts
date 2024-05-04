import { Component } from '@angular/core';
import { PostService } from '../../post.service';
import { AuthService } from '../../auth-service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {
  newPostText: string = '';  // Define the property to bind with ngModel
  currentUserId: string;  // Define a variable to hold the current user ID

  constructor(private postService: PostService, private authService: AuthService) {
    this.currentUserId = this.authService.getUserId(); // Fetch the current user ID
  }
  // Define the method to add a post
  addPost(postContent: string) {
    const userId = this.authService.getUserId();
    console.log('User ID:', userId); // Log user ID
    
    if (!userId) {
      console.error('User ID is null, cannot add post');
      return;
    }
    if (!postContent.trim()) {
      console.error('Post content is empty');
      return;
    }
    this.postService.addPost(userId, postContent.trim()).subscribe({
      next: (newPost) => {
        console.log('Post added:', newPost);
        this.newPostText = ''; // Clear the textarea after successful post submission
      },
      error: (error) => {
        console.error('Error adding post:', error);
        alert('Failed to add post: ' + error.message);
      }
    });
  }

}