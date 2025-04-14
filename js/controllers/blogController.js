/* Контролер для управління блогом */
import { Post } from '../models/post.js';
import { BlogView } from '../views/blogView.js';
import { UserController } from '../controllers/userController.js';

export class BlogController {
  /* Ініціалізація контролера */
  constructor() 
  {
    this.view = new BlogView();
    this.postsPerPage = 2;
    this.currentPage = 1;
  }

  /* Ініціалізація подій та рендерингу */
  init() 
  {
    const currentUser = UserController.getCurrentUser();
    if (!currentUser) 
    {
      window.location.href = 'login.html';
      return;
    }

    this.render();

    /* Обробка додавання нового посту */
    document.getElementById('addPostForm').addEventListener('submit', (event) => 
    {
      event.preventDefault();
      const content = document.getElementById('postContent').value;
      const currentUser = UserController.getCurrentUser();
      if (!currentUser) 
      {
        alert('Будь ласка, увійдіть, щоб додати пост');
        return;
      }
      const newPost = new Post(null, currentUser.id, content, new Date().toLocaleDateString());
      newPost.save();
      this.currentPage = 1;
      this.render();
      document.getElementById('addPostForm').reset();
      const modal = bootstrap.Modal.getInstance(document.getElementById('addBlogModal'));
      modal.hide();
    });

    /* Обробка редагування посту */
    document.getElementById('editPostForm').addEventListener('submit', (event) => 
    {
      event.preventDefault();
      const postId = document.getElementById('editPostId').value;
      const content = document.getElementById('editPostContent').value;
      const post = Post.findById(postId);
      if (post) 
      {
        post.content = content;
        post.save();
        this.render();
        const modal = bootstrap.Modal.getInstance(document.getElementById('editPostModal'));
        modal.hide();
      }
    });

    /* Обробка кліків для видалення, редагування та пагінації */
    document.addEventListener('click', (event) => 
    {
      if (event.target.matches('[data-action="delete"]')) 
      {
        const postId = event.target.dataset.id;
        const post = Post.findById(postId);
        if (post) 
        {
          post.delete();
          this.render();
        }
      }
      else if (event.target.matches('[data-action="edit"]')) 
      {
        const postId = event.target.dataset.id;
        const post = Post.findById(postId);
        if (post) 
        {
          document.getElementById('editPostId').value = post.id;
          document.getElementById('editPostContent').value = post.content;
        }
      }
      else if (event.target.matches('.page-link')) 
      {
        event.preventDefault();
        const page = parseInt(event.target.dataset.page);
        if (page && !isNaN(page)) 
        {
          this.currentPage = page;
          this.render();
        }
      }
    });

    /* Обробка додавання коментарів */
    document.addEventListener('submit', (event) => 
    {
      if (event.target.matches('.add-comment-form')) 
      {
        event.preventDefault();
        const postId = event.target.dataset.postId;
        const content = event.target.querySelector(`#commentContent${postId}`).value;
        const currentUser = UserController.getCurrentUser();
        if (!currentUser) 
        {
          alert('Будь ласка, увійдіть, щоб додати коментар');
          return;
        }
        const post = Post.findById(postId);
        if (post) 
        {
          post.addComment(currentUser.id, content, new Date().toLocaleDateString());
          this.render();
        }
      }
    });
  }

  /* Рендеринг постів */
  render() 
  {
    const posts = Post.getAll();
    this.view.renderPosts(posts, this.currentPage, this.postsPerPage);
  }
}