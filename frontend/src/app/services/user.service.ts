import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Login } from '../interfaces/login';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userUrl = 'http://127.0.0.1:5000/api/user';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  public loginID = '';
  public loginName = '';
  public loginRole = '';
  public modifyID = '';
  public updateAllUsers = false; // Update the allUsers page.
  public updateName = false; // Update the name in the top right corner of the system.
  public updateRoot = false; // Update the charts on the root page.

  constructor(private http: HttpClient) {}

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      return of(result as T);
    };
  }

  // login
  login(loginMessage: Login): Observable<string> {
    const url = `${this.userUrl}/login`;
    return this.http.post<string>(url, loginMessage, this.httpOptions).pipe(
      tap((_) => console.log(`登录！`)),
      catchError(this.handleError<string>('登录时出错'))
    );
  }

  // Retrieve user information based on ID.
  getUserById(userID: string): Observable<User> {
    const url = `${this.userUrl}/get_user_by_id/${userID}`;
    return this.http.get<User>(url).pipe(
      tap((_) => console.log(`获取${userID}的信息！`)),
      catchError(this.handleError<User>(`根据ID:${userID}获取用户信息时出错`))
    );
  }
  // Modify user information.
  updateUser(user: User): Observable<string> {
    const url = `${this.userUrl}/update_user`;
    return this.http.post<User>(url, user, this.httpOptions).pipe(
      tap((_) => console.log(`修改了ID为${user.userID}的用户信息`)),
      catchError(this.handleError<any>('修改用户信息时出错'))
    );
  }

  // Add new user
  addUser(user: User): Observable<string> {
    const url = `${this.userUrl}/add_user`;
    return this.http.post<string>(url, user, this.httpOptions).pipe(
      tap((_) => console.log(`增加了ID为${user.userID}的用户`)),
      catchError(this.handleError<string>('新增用户时出错', '0'))
    );
  }

  // Retrieve all user information.
  getAllUsers(): Observable<User[]> {
    const url = `${this.userUrl}/get_all_users`;
    return this.http.get<User[]>(url).pipe(
      tap((_) => console.log('获取所有用户的信息！')),
      catchError(this.handleError<User[]>('获取所有用户信息时出错', []))
    );
  }

  // Set the employee status to "离职".
  unemployUser(userID: string): Observable<string> {
    const url = `${this.userUrl}/unemploy_user/${userID}`;
    return this.http.post<User>(url, this.httpOptions).pipe(
      tap((_) => console.log(`解雇ID为${userID}的员工`)),
      catchError(this.handleError<any>(`解雇ID为${userID}的员工时出错`))
    );
  }

  // Set the employee status to "在职".
  employUser(userID: string): Observable<string> {
    const url = `${this.userUrl}/employ_user/${userID}`;
    return this.http.post<User>(url, this.httpOptions).pipe(
      tap((_) => console.log(`继续聘用ID为${userID}的员工`)),
      catchError(this.handleError<any>(`继续聘用ID为${userID}的员工时出错`))
    );
  }

  // Retrieve the largest user ID (automatically generated when adding new users).
  getMaxUserID(): Observable<string> {
    const url = `${this.userUrl}/get_max_userID`;
    return this.http.get<string>(url).pipe(
      tap((_) => console.log('获取用户ID的最大值！')),
      catchError(this.handleError<string>('获取用户ID的最大值时出错'))
    );
  }
}
