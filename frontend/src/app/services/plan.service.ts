import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { Plan } from '../interfaces/plan';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  private planUrl = 'http://127.0.0.1:5000/api/plan';
  public afterModifyLayout = false;
  public afterModifyPlan = false;
  constructor(private http: HttpClient) {}
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      return of(result as T);
    };
  }

  // 获取所有计划
  getAllPlans(): Observable<Plan[]> {
    const url = `${this.planUrl}/get_all_plans`;
    return this.http.get<Plan[]>(url).pipe(
      tap((_) => console.log('获取所有计划！')),
      catchError(this.handleError<Plan[]>('获取所有计划时出错', []))
    );
  }

  // 获得现有的最大计划ID（用于生成新的计划ID）
  getMaxPlanID(): Observable<string> {
    const url = `${this.planUrl}/get_max_planID`;
    return this.http.get<string>(url).pipe(
      tap((_) => console.log('获取计划ID的最大值！')),
      catchError(this.handleError<string>('获取计划ID的最大值时出错'))
    );
  }

  // 新增计划
  addPlan(plan: Plan): Observable<string> {
    const url = `${this.planUrl}/add_plan`;
    return this.http.post<string>(url, plan, this.httpOptions).pipe(
      tap((_) => console.log(`增加了ID为${plan.planID}的计划`)),
      catchError(this.handleError<string>('新增计划时出错', '0'))
    );
  }

  // 完成计划
  finishPlan(plan: Plan): Observable<string> {
    const url = `${this.planUrl}/finish_plan`;
    return this.http.post<string>(url, plan, this.httpOptions).pipe(
      tap((_) => console.log(`完成了ID为${plan.planID}的计划`)),
      catchError(this.handleError<string>('完成计划时出错', '0'))
    );
  }
  // 删除计划
  deletePlan(planID: string): Observable<string> {
    const url = `${this.planUrl}/delete_plan/${planID}`;
    return this.http.post<string>(url, this.httpOptions).pipe(
      // POST需要删除的学生id到对应api实现删除学生用户功能
      tap((_) => console.log(`删除学号为${planID}的学生信息`)),
      catchError(this.handleError<string>('deleteStudent'))
    );
  }
}
