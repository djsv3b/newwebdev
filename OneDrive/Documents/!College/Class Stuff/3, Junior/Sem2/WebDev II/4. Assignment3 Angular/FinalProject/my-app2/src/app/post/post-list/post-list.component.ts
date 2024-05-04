import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const userId = this.authService.getUserId();
    this.postsSub = this.postService.getPostsUpdateListener().subscribe(posts => {
      this.posts = posts;
      this.cd.detectChanges();  // Ensure the view is updated immediately
    });

    if (userId) {
      this.postService.getPosts(userId).subscribe();
    }
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

  toggleShowDone(): void {
    this.showDoneTasks = !this.showDoneTasks;
  }

  markDone(postId: string): void {
    // Convert postId explicitly to a string to avoid type issues
    postId = postId.toString();

    const post = this.posts.find(p => p._id.toString() === postId);
    if (post) {
        const newDoneStatus = !post.done;
        const userId = this.authService.getUserId();

        if (!userId) {
            console.error('User ID is null, cannot update post');
            return;
        }

        this.postService.updatePostDone(userId, postId, newDoneStatus).subscribe({
            next: (response) => {
                console.log('Post updated:', response);
                post.done = newDoneStatus; // Locally update the done status immediately
                this.cd.detectChanges();  // Force Angular to detect changes immediately
            },
            error: (error) => {
                console.error('Error updating post:', error);
            }
        });
    } else {
        console.error("No post found with ID:", postId);
    }
}


  trackPostById(index: number, post: Post): any {
    return post._id;
  }
}
