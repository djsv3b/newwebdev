import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostService } from '../../post.service';
import { AuthService } from '../../auth-service';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  showDoneTasks: boolean;
  private postsSub: Subscription; 

  constructor(private postService: PostService, private authService: AuthService) {}

  ngOnInit() {
    const userId = this.authService.getUserId();
    if (userId) {
        this.postsSub = this.postService.getPosts(userId).subscribe(posts => {
            this.posts = posts;
        }, error => {
            console.error('Failed to load posts:', error);
        });
    } else {
        console.error('No user ID found');
    }
  }

  ngOnDestroy() {
    if (this.postsSub) {
      this.postsSub.unsubscribe();
    }
  }

  toggleShowDone(): void {
    this.showDoneTasks = !this.showDoneTasks;
  }

  markDone(postId: number): void {
    const task = this.posts.find(post => post.id === postId);
    if (task) {
      const newDoneStatus = !task.done;
      const userId = this.authService.getUserId();
  
      if (!userId) {
        console.error('User ID is null, cannot update post');
        return;
      }
  
      // Convert postId to string if necessary
      this.postService.updatePostDone(userId, postId.toString(), newDoneStatus).subscribe({
        next: (response) => {
          console.log('Post updated:', response);
          task.done = newDoneStatus; // Only update locally if the backend update was successful
        },
        error: (error) => {
          console.error('Error updating post:', error);
        }
      });
    }
  }
  

  
}
