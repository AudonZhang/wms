import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { Goods } from '../interfaces/goods';

@Injectable({
  providedIn: 'root',
})
export class GoodsService {
  private goodsUrl = 'http://127.0.0.1:5000/api/goods';
  public modifyID = '';
  public afterModify = false;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      return of(result as T);
    };
  }

  getGoodsById(goodsID: string): Observable<Goods> {
    const url = `${this.goodsUrl}/get_goods_by_id/${goodsID}`;
    return this.http.get<Goods>(url).pipe(
      tap((_) => console.log(`获取${goodsID}对应的货物信息！`)),
      catchError(
        this.handleError<Goods>(`通过货物ID获取货物信息时出错，id=${goodsID}`)
      )
    );
  }

  getAllGoods(): Observable<Goods[]> {
    const url = `${this.goodsUrl}/get_all_goods`;
    return this.http.get<Goods[]>(url).pipe(
      tap((_) => console.log('获取所有货物的信息！')),
      catchError(this.handleError<Goods[]>('获取所有货物信息时出错', []))
    );
  }

  // 更新用户信息
  updateGoods(goods: Goods): Observable<any> {
    const url = `${this.goodsUrl}/update_goods`;
    return this.http.post<Goods>(url, goods, this.httpOptions).pipe(
      tap((_) => console.log(`修改了ID为${goods.goodsID}的货物信息`)),
      catchError(this.handleError<any>('更新货物信息时出错'))
    );
  }
  addUser(goods: Goods): Observable<string> {
    const url = `${this.goodsUrl}/add_goods`;
    return this.http.post<string>(url, goods, this.httpOptions).pipe(
      tap((_) => console.log(`增加了ID为${goods.goodsID}的货物`)),
      catchError(this.handleError<string>('更新货物信息时出错', '0'))
    );
  }
}
