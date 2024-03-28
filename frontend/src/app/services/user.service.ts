import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Login } from '../interfaces/login';
import { User } from '../interfaces/user';
import { Inbound } from '../interfaces/inbound';
import { Outbound } from '../interfaces/outbound';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userUrl = 'http://127.0.0.1:5000/api/user';
  private recordUrl = 'http://127.0.0.1:5000/api/record';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  public loginID = ''; // record logging user's id
  public loginName = ''; // record logging user's name
  public loginRole = ''; // record logging user's role
  public modifyID = '';

  constructor(private http: HttpClient) {}

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      return of(result as T);
    };
  }

  // post to api to log in
  login(loginMessage: Login): Observable<string> {
    const url = `${this.userUrl}/login`;
    return this.http.post<string>(url, loginMessage, this.httpOptions).pipe(
      tap((_) => console.log(`登录！`)),
      catchError(this.handleError<string>('login', '0'))
    );
  }

  // post to api to get logging user's information
  getUserById(userID: string): Observable<User> {
    const url = `${this.userUrl}/get_user_by_id/${userID}`;
    return this.http.get<User>(url).pipe(
      tap((_) => console.log(`获取${userID}的信息！`)),
      catchError(this.handleError<User>(`getUserid=${userID}`))
    );
  }
  // post to api to change user information
  updateUser(user: User): Observable<any> {
    const url = `${this.userUrl}/update_user`;
    return this.http.post<User>(url, user, this.httpOptions).pipe(
      tap((_) => console.log(`修改了ID为${user.userID}的用户信息`)),
      catchError(this.handleError<any>('updateUser'))
    );
  }
  addUser(user: User): Observable<any> {
    const url = `${this.userUrl}/add_user`;
    return this.http.post<User>(url, user, this.httpOptions).pipe(
      tap((_) => console.log(`修改了ID为${user.userID}的用户信息`)),
      catchError(this.handleError<any>('updateUser'))
    );
  }
  getUsers(): Observable<User[]> {
    const url = `${this.userUrl}/get_all_users`;
    console.log('在浏览器控制台中显示:已获取学生信息列表！');
    return this.http.get<User[]>(url).pipe(
      // 通过url对应的api获取所有学生信息
      tap((_) => console.log('获取所有学生的信息！')),
      catchError(this.handleError<User[]>('getUsers', []))
    );
  }

  deleteUser(userID: string): Observable<User> {
    const url = `${this.userUrl}/delete_user/${userID}`;
    return this.http.post<User>(url, this.httpOptions).pipe(
      // POST需要删除的学生id到对应api实现删除学生用户功能
      tap((_) => console.log(`删除学号为${userID}的学生信息`)),
      catchError(this.handleError<User>('deleteUser'))
    );
  }

  takeUser(userID: string): Observable<User> {
    const url = `${this.userUrl}/take_user/${userID}`;
    return this.http.post<User>(url, this.httpOptions).pipe(
      // POST需要删除的学生id到对应api实现删除学生用户功能
      tap((_) => console.log(`删除学号为${userID}的学生信息`)),
      catchError(this.handleError<User>('takeUser'))
    );
  }

  getInboundRecordByUserId(userID: string): Observable<Inbound[]> {
    const url = `${this.recordUrl}/get_inbound_record_by_user_id/${userID}`;
    return this.http.get<Inbound[]>(url).pipe(
      // 通过url对应的api获取对应学生的预约信息
      tap((_) => console.log(`获取${userID}的预约信息！`)),
      catchError(this.handleError<Inbound[]>(`getUser id=${userID}`))
    );
  }

  getOutboundRecordByUserId(userID: string): Observable<Outbound[]> {
    const url = `${this.recordUrl}/get_outbound_record_by_user_id/${userID}`;
    return this.http.get<Outbound[]>(url).pipe(
      // 通过url对应的api获取对应学生的预约信息
      tap((_) => console.log(`获取${userID}的预约信息！`)),
      catchError(this.handleError<Outbound[]>(`getUser id=${userID}`))
    );
  }
}
