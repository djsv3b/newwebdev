import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostService } from '../../post.service';
import { AuthService } from '../../auth-service.service';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
    posts: Post[] = [];
    private postsSub: Subscription;

    constructor(private postService: PostService, private authService: AuthService) {}

    ngOnInit() {
      this.postsSub = this.postService.getPostsUpdateListener().subscribe(posts => {
          this.posts = posts; // Check if this line is executed when new posts are added
      });
  
      this.loadPosts();
  }

  loadPosts() {
    const userId = this.authService.getUserId();
    this.postService.getPosts(userId).subscribe(); // Ensure this triggers the BehaviorSubject update
  }

    ngOnDestroy() {
        this.postsSub.unsubscribe();
    }
    refreshPosts() {
      this.loadPosts();  // Call loadPosts to refresh the post list
    }

    onDeletePost(postId: string): void {
      const userId = this.authService.getUserId(); // Assuming you have a way to get the userId
      this.postService.deletePost(userId, postId).subscribe({
          next: () => {
              this.posts = this.posts.filter(post => post._id !== postId);
          },
          error: (error) => console.error('Error deleting post:', error)
      });
    }
}