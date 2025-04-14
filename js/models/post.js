/* Модель для постів */
export class Post {
  constructor(id, authorId, content, date, comments = []) 
  {
    this.id = id;
    this.authorId = authorId;
    this.content = content;
    this.date = date;
    this.comments = comments;
  }

  /* Отримання всіх постів */
  static getAll() 
  {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    return posts.map(postData => new Post(
      postData.id,
      postData.authorId,
      postData.content,
      postData.date,
      postData.comments
    ));
  }

  /* Пошук посту за ID */
  static findById(id) 
  {
    const posts = Post.getAll();
    return posts.find(post => post.id === id);
  }

  /* Збереження посту */
  save() 
  {
    const posts = Post.getAll();
    const index = posts.findIndex(post => post.id === this.id);
    if (index !== -1) 
    {
      posts[index] = this;
    } 
    else 
    {
      this.id = Date.now().toString();
      posts.push(this);
    }
    localStorage.setItem('posts', JSON.stringify(posts));
  }

  /* Видалення посту */
  delete() 
  {
    const posts = Post.getAll();
    const updatedPosts = posts.filter(post => post.id !== this.id);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  }

  /* Додавання коментаря до посту */
  addComment(authorId, content, date) 
  {
    this.comments.push({ authorId, content, date });
    this.save();
  }
}