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
  public modifyID = ''; // 正在修改的用户ID
  public afterModify = false; //  货物信息界面刷新
  public afterModifyGoods = false; // 货物图表页刷新
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

  // 通过ID获取货物信息
  getGoodsById(goodsID: string): Observable<Goods> {
    const url = `${this.goodsUrl}/get_goods_by_id/${goodsID}`;
    return this.http.get<Goods>(url).pipe(
      tap((_) => console.log(`获取${goodsID}对应的货物信息！`)),
      catchError(
        this.handleError<Goods>(`通过货物ID获取货物信息时出错，id=${goodsID}`)
      )
    );
  }

  // 获取所有货物信息
  getAllGoods(): Observable<Goods[]> {
    const url = `${this.goodsUrl}/get_all_goods`;
    return this.http.get<Goods[]>(url).pipe(
      tap((_) => console.log('获取所有货物的信息！')),
      catchError(this.handleError<Goods[]>('获取所有货物信息时出错', []))
    );
  }

  // 更新货物信息
  updateGoods(goods: Goods): Observable<string> {
    const url = `${this.goodsUrl}/update_goods`;
    return this.http.post<Goods>(url, goods, this.httpOptions).pipe(
      tap((_) => console.log(`修改了ID为${goods.goodsID}的货物信息`)),
      catchError(this.handleError<any>('更新货物信息时出错'))
    );
  }

  // 出库货物信息
  outGoods(goods: Goods): Observable<string> {
    const url = `${this.goodsUrl}/out_goods`;
    return this.http.post<Goods>(url, goods, this.httpOptions).pipe(
      tap((_) => console.log(`修改了ID为${goods.goodsID}的货物信息`)),
      catchError(this.handleError<any>('更新货物信息时出错'))
    );
  }

  // 新增货物
  addGoods(goods: Goods): Observable<string> {
    const url = `${this.goodsUrl}/add_goods`;
    return this.http.post<string>(url, goods, this.httpOptions).pipe(
      tap((_) => console.log(`更新了ID为${goods.goodsID}的货物信息`)),
      catchError(this.handleError<string>('新增货物信息时出错', '0'))
    );
  }

  // 货物数据库中最大的货物ID（用于生成新增的货物ID）
  getMaxGoodsID(): Observable<string> {
    const url = `${this.goodsUrl}/get_max_goodsID`;
    return this.http.get<string>(url).pipe(
      tap((_) => console.log('获取货物ID的最大值！')),
      catchError(this.handleError<string>('获取货物ID的最大值时出错'))
    );
  }

  // 获取所有可以设置出库计划的货物信息
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
