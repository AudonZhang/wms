import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { Goods } from '../interfaces/goods';

@Injectable({
  providedIn: 'root',
})
export class GoodsService {
  private goodsUrl = 'http://127.0.0.1:5000/api/goods';
  private planUrl = 'http://127.0.0.1:5000/api/plan';
  public modifyID = ''; // The user ID being modified.
  public afterModify = false; //  Refresh all-goods page.
  public afterModifyGoods = false; // Refresh goods page
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

  // Retrieve goods information based on ID.
  getGoodsById(goodsID: string): Observable<Goods> {
    const url = `${this.goodsUrl}/get_goods_by_id/${goodsID}`;
    return this.http.get<Goods>(url).pipe(
      tap((_) => console.log(`获取ID为${goodsID}的货物信息！`)),
      catchError(
        this.handleError<Goods>(`获取货物信息时出错，货物ID为${goodsID}`)
      )
    );
  }

  // Retrieve all goods information.
  getAllGoods(): Observable<Goods[]> {
    const url = `${this.goodsUrl}/get_all_goods`;
    return this.http.get<Goods[]>(url).pipe(
      tap((_) => console.log('获取所有货物的信息！')),
      catchError(this.handleError<Goods[]>('获取所有货物信息时出错', []))
    );
  }

  // Modify goods information.
  updateGoods(goods: Goods): Observable<string> {
    const url = `${this.goodsUrl}/update_goods`;
    return this.http.post<Goods>(url, goods, this.httpOptions).pipe(
      tap((_) => console.log(`修改了ID为${goods.goodsID}的货物信息`)),
      catchError(this.handleError<any>('修改货物信息时出错'))
    );
  }

  // Ship out goods.
  outGoods(goods: Goods): Observable<string> {
    const url = `${this.goodsUrl}/out_goods`;
    return this.http.post<Goods>(url, goods, this.httpOptions).pipe(
      tap((_) => console.log(`ID为${goods.goodsID}的货物出库`)),
      catchError(this.handleError<any>('货物出库时出错'))
    );
  }

  // Add new goods
  addGoods(goods: Goods): Observable<string> {
    const url = `${this.goodsUrl}/add_goods`;
    return this.http.post<string>(url, goods, this.httpOptions).pipe(
      tap((_) => console.log(`新增了ID为${goods.goodsID}的货物`)),
      catchError(this.handleError<string>('新增货物信息时出错', '0'))
    );
  }

  // Retrieve the largest goods ID from the database (used for generating new goods IDs).
  getMaxGoodsID(): Observable<string> {
    const url = `${this.goodsUrl}/get_max_goodsID`;
    return this.http.get<string>(url).pipe(
      tap((_) => console.log('获取货物ID的最大值！')),
      catchError(this.handleError<string>('获取货物ID的最大值时出错'))
    );
  }

  // Retrieve all goods information that can be used to set up shipping plans.
  getAllOutPlanGoods(): Observable<Goods[]> {
    const url = `${this.planUrl}/get_all_out_plan_goods`;
    return this.http.get<Goods[]>(url).pipe(
      tap((_) => console.log('获取所有可以设置出库计划的货物信息!')),
      catchError(
        this.handleError<Goods[]>(
          '获取所有可以设置出库计划的货物信息时出错',
          []
        )
      )
    );
  }
}
