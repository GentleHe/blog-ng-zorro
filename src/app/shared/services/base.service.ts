import {Injectable} from '@angular/core';
import {BaseDTO, BaseVO, Pageable, Result} from "../domain";
import {Observable} from "rxjs";
import {HttpClient, HttpParams, HttpRequest} from "@angular/common/http";
import {environment} from "../../../environments/environment";

export interface BaseInterface<DTO extends BaseDTO, VO extends BaseVO> {

  /**
   * 通过 id 查询数据详情
   * @param id
   */
  getDatum(id: number): Observable<Result>;

  /**
   * 列表查询
   * @param pageable 分页对象
   * @param baseDTO 传输层对象
   */
  getData(pageable: Pageable, baseDTO: BaseDTO): Observable<Result>;

  /**
   * 添加单条数据
   * （通过唯一ID确定，即除了ID和空字段，其它的全部覆盖更新）
   * @param data 传输层对象
   */
  addDatum(data: DTO): Observable<Result>;

  /**
   * 更改单条数据
   * @param data 传输层对象
   */
  updateDatum(data: DTO): Observable<Result>;

  /**
   * 删除所选的数据
   * @param ids
   * todo 暂时不做这个，有个问题就是， RESTFul delete 标准好像不支持 body 参数，
   */
  deleteSelect(ids: Set<Number>): number[];

  /**
   * 指定列的对应值是否存在
   * 用途：如添加用户时，检测用户名、邮箱是否已经存在等的判定
   */
  columnDataExists(columnName: string, columnValue: any): Observable<Result>;
}


@Injectable({providedIn: 'root'})
export class BaseService<DTO extends BaseDTO, VO extends BaseVO> implements BaseInterface<DTO, VO> {

  //服务名
  serviceName?: string;

  baseUrl = `${environment.baseUrl}/background/`;

  constructor(protected http: HttpClient) {
    console.log('this.baseUrl: ' + this.baseUrl);
  }

  addDatum(data: DTO): Observable<Result> {
    const bodyJson = new HttpParams({fromString: JSON.stringify(data)})
    return this.http.post<Result>(this.baseUrl + this.serviceName, bodyJson);
  }

  columnDataExists(columnName: string, columnValue: any): Observable<Result> {
    const url = `${this.baseUrl}/hasExists`;

    let params = new HttpParams()
      .append('column', columnName)
      .append('value', columnValue);

    return this.http.get<Result>(url, {params})
  }

  deleteSelect(ids: Set<Number>): number[] {
    return [];
  }

  getDatum(id: number): Observable<Result> {
    return this.http.get<Result>(`${this.baseUrl}/id`);

  }

  getData(pageable: Pageable, baseDTO: BaseDTO): Observable<Result> {

    // todo 记得补充

    let params = new HttpParams()
      .append('size', pageable.size)
      .append('page', pageable.page)

    for (let sortElement of pageable.sort) {
      if (sortElement.value) {
        params = params.append('sort', `${sortElement.key},${sortElement.value==='ascend'?'asc':'desc'}`)
      }
    }

    // var resultObservable = this.http.get<Result>(`${this.baseUrl}${this.serviceName}`, {
    //   params: param
    // });
    console.log('pageable: ' + JSON.stringify(pageable))
    console.log('params: ' + JSON.stringify(params.keys()))

    var resultObservable = this.http.request<Result>('get', `${this.baseUrl}${this.serviceName}`, {
      params, body: baseDTO
    });


    return resultObservable;
  }

  updateDatum(data: DTO): Observable<Result> {

    const param = new HttpParams({fromString: JSON.stringify(data)})

    return this.http.patch<Result>(this.baseUrl, param);
  }


}
