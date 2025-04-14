/* Контролер для управління користувачами */
import { User } from '../models/user.js';

export class UserController {
  /* Авторизація користувача */
  static login(email, password) 
  {
    const users = User.getAll();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) 
    {
      localStorage.setItem('currentUserId', user.id);
      return true;
    }
    return false;
  }

  /* Реєстрація нового користувача */
  static register(email, password, gender, dateOfBirth) 
  {
    const users = User.getAll();
    if (users.some(u => u.email === email)) 
    {
      return false; // Email вже існує
    }
    const newUser = new User(null, email, password, gender, dateOfBirth);
    newUser.save();
    return true;
  }

  /* Отримання поточного користувача */
  static getCurrentUser() 
  {
    const userId = localStorage.getItem('currentUserId');
    return userId ? User.findById(userId) : null;
  }
}