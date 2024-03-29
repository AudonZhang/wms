import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { Inbound } from '../interfaces/inbound';
import { Outbound } from '../interfaces/outbound';

@Injectable({
  providedIn: 'root',
})
export class RecordService {
  private recordUrl = 'http://127.0.0.1:5000/api/record';

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

  getInboundRecordByUserId(userID: string): Observable<Inbound[]> {
    const url = `${this.recordUrl}/get_inbound_record_by_user_id/${userID}`;
    return this.http.get<Inbound[]>(url).pipe(
      tap((_) => console.log(`获取${userID}的入库操作记录！`)),
      catchError(
        this.handleError<Inbound[]>(`获取${userID}的入库操作记录时出错`)
      )
    );
  }

  getOutboundRecordByUserId(userID: string): Observable<Outbound[]> {
    const url = `${this.recordUrl}/get_outbound_record_by_user_id/${userID}`;
    return this.http.get<Outbound[]>(url).pipe(
      tap((_) => console.log(`获取${userID}的出库操作记录！`)),
      catchError(
        this.handleError<Outbound[]>(`获取${userID}的出库操作记录时出错`)
      )
    );
  }
}
