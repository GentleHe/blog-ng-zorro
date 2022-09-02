import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ErrorService{


  constructor(private http: HttpClient) {
  }

  /**
   * 上报异常
   * @param error 错误信息
   */
  postError(error: any): void{
    // todo
  }
}
