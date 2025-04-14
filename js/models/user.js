/* Модель для користувачів */
export class User {
  constructor(id, email, password, gender, dateOfBirth, surname = '', name = '', patronymic = '', avatarUrl = 'img/avatar.png') 
  {
    this.id = id;
    this.email = email;
    this.password = password;
    this.gender = gender;
    this.dateOfBirth = dateOfBirth;
    this.surname = surname;
    this.name = name;
    this.patronymic = patronymic;
    this.avatarUrl = avatarUrl;
  }

  /* Отримання всіх користувачів */
  static getAll() 
  {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.map(userData => new User(
      userData.id,
      userData.email,
      userData.password,
      userData.gender,
      userData.dateOfBirth,
      userData.surname,
      userData.name,
      userData.patronymic,
      userData.avatarUrl
    ));
  }

  /* Пошук користувача за ID */
  static findById(id) 
  {
    const users = User.getAll();
    return users.find(user => user.id === id) || null;
  }

  /* Пошук користувача за email */
  static findByEmail(email) 
  {
    const users = User.getAll();
    return users.find(user => user.email === email) || null;
  }

  /* Збереження користувача */
  save() 
  {
    const users = User.getAll();
    const index = users.findIndex(user => user.id === this.id);
    if (index !== -1) 
    {
      users[index] = this;
    } 
    else 
    {
      this.id = this.id || Date.now().toString();
      users.push(this);
    }
    localStorage.setItem('users', JSON.stringify(users));
  }
}