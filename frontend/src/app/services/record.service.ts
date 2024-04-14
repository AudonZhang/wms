import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { Inbound } from '../interfaces/inbound';
import { Outbound } from '../interfaces/outbound';
import { Goods } from '../interfaces/goods';

@Injectable({
  providedIn: 'root',
})
export class RecordService {
  public recordUrl = 'http://127.0.0.1:5000/api/record';
  public afterModifyOut = false;
  public afterModifyChart = false;

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

  // 获取用户的入库记录
  getInboundRecordByUserId(userID: string): Observable<Inbound[]> {
    const url = `${this.recordUrl}/get_inbound_record_by_user_id/${userID}`;
    return this.http.get<Inbound[]>(url).pipe(
      tap((_) => console.log(`获取${userID}的入库操作记录！`)),
      catchError(
        this.handleError<Inbound[]>(`获取${userID}的入库操作记录时出错`)
      )
    );
  }

  // 获取用户的出库记录
  getOutboundRecordByUserId(userID: string): Observable<Outbound[]> {
    const url = `${this.recordUrl}/get_outbound_record_by_user_id/${userID}`;
    return this.http.get<Outbound[]>(url).pipe(
      tap((_) => console.log(`获取${userID}的出库操作记录！`)),
      catchError(
        this.handleError<Outbound[]>(`获取${userID}的出库操作记录时出错`)
      )
    );
  }

  // 获取所有入库记录
  getAllInbounds(): Observable<Inbound[]> {
    const url = `${this.recordUrl}/get_all_inbounds`;
    return this.http.get<Inbound[]>(url).pipe(
      tap((_) => console.log(`获取所有入库操作记录！`)),
      catchError(this.handleError<Inbound[]>(`获取所有入库操作记录时出错`))
    );
  }

  // 获取所有出库记录
  getAllOutbounds(): Observable<Outbound[]> {
    const url = `${this.recordUrl}/get_all_outbounds`;
    return this.http.get<Outbound[]>(url).pipe(
      tap((_) => console.log(`获取所有出库操作记录！`)),
      catchError(this.handleError<Outbound[]>(`获取所有出库操作记录时出错`))
    );
  }

  // 获取最大的出库单ID（用于生成新出库单ID）
  getMaxOutboundOrderID(): Observable<string> {
    const url = `${this.recordUrl}/get_max_outboundOrderID`;
    return this.http.get<string>(url).pipe(
      tap((_) => console.log('获取出库单ID的最大值！')),
      catchError(this.handleError<string>('获取出库单ID的最大值时出错'))
    );
  }

  // 获取最大的的出库记录ID（用于生成新出库记录ID）
  getMaxOutboundID(): Observable<string> {
    const url = `${this.recordUrl}/get_max_outboundID`;
    return this.http.get<string>(url).pipe(
      tap((_) => console.log('获取出库记录ID的最大值！')),
      catchError(this.handleError<string>('获取出库记录ID的最大值时出错'))
    );
  }

  // 新增出库记录
  addOutbound(outbound: Outbound): Observable<string> {
    const url = `${this.recordUrl}/add_outbound`;
    return this.http.post<string>(url, outbound, this.httpOptions).pipe(
      tap((_) => console.log(`增加了ID为${outbound.outboundID}的出库记录`)),
      catchError(this.handleError<string>('新增出库记录时出错', '0'))
    );
  }

  // 下载出库单
  downloadOutboundOrder(
    outboundOrderID: string,
    userID: string,
    time: Date
  ): void {
    const formattedTime = time.toLocaleDateString('zh-CN');
    const url = `${this.recordUrl}/generate_outbound_order_by_id/${outboundOrderID}`;
    this.http.get(url, { responseType: 'blob' }).subscribe(
      (data) => {
        const link = document.createElement('a');
        const blob = new Blob([data]);
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute(
          'download',
          `出库单号：${outboundOrderID}，出库人：${userID}，出库时间：${formattedTime}.csv`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      (error) => {
        console.error('下载出库单失败:', error);
      }
    );
  }

  // 入库
  InboundGoods(goodsList: Goods[]): Observable<any> {
    const url = `${this.recordUrl}/inbound`;
    return this.http.post<Goods>(url, goodsList, this.httpOptions).pipe(
      tap((_) => console.log(`上传ID为货物信息`)),
      catchError(this.handleError<any>('更新货物信息时出错'))
    );
  }
}
