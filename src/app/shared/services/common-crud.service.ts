import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {forkJoin, Observable} from 'rxjs';
import {Result} from '../domain';
// import {Permission} from "../../system/domain";


export interface CommonCrudServiceInterface<T>{

  // 通过 唯一ID 查询详情数据
  getData(id: number): Observable<Result>;

  // 通过多个条件查询列表数据
  getDatas(pageIndex: number, pageSize: number, sort: string, filters: Array<{ key: string; value: string[] }>): Observable<Result>;

  // 添加单条数据
  addData(data: T): Observable<Result>;

  // 更改单条数据，（通过唯一ID确定，即除了ID和空字段，其它的全部覆盖更新）
  updateData(data: T): Observable<Result>;

  /**
   * 一次性删除所选记录
   * @param ids 记录编号集合
   * 暂时不做这个，有个问题就是， RESTFul delete 标准好像不支持 body 参数，
   */
  deleteSelected(ids: Set<number>): number[];

  /**
   * 一次性删除所选记录
   * @param ids 记录编号集合
   * 暂时不做这个，有个问题就是， RESTFul delete 标准好像不支持 body 参数，
   */
  deleteSelectedByOnce(ids: Set<number>): Observable<Result>;


  /**
   * 指定列的值是否已存在，某些值在更新或者添加的时候不允许唯一
   * @param column 列名
   * @param columnValue 列值
   */
  columnDataHasExists(column: string, columnValue: any): Observable<Result>;
}

/**
 * 通用的 增删改查 实体的父Service
 */
@Injectable({
  providedIn: 'root'
})
export class CommonCrudService<T> implements CommonCrudServiceInterface<T> {

  serviceName = '待子服务定';
  baseUrl = `${environment.baseUrl}/background`;

  constructor(protected http: HttpClient) {
  }

  getData(id: number): Observable<Result> {
    return this.http.get<Result>(`${this.baseUrl}/${id}`);
  }

  getDatas(pageIndex: number, pageSize: number, sort: string, filters: Array<{ key: string; value: string[] }>): Observable<Result> {
    pageIndex = pageIndex - 1;
    let param: any;

    if (sort === '') {
      param = new HttpParams({fromString: `size=${pageSize}&page=${pageIndex}`});
    } else {
      param = new HttpParams( {fromString: `size=${pageSize}&page=${pageIndex}&sort=${sort}`});
    }
    filters.forEach(filter => {
      filter.value.forEach(value => {
        console.log(`filter: ${filter.key} ${value}`);
        param = param.append(filter.key, value);
      });
    });

    return this.http.get<Result>(this.baseUrl, {
      params: param
    });

  }

  addData(data: T): Observable<Result> {
    const dataString = JSON.stringify(data);
    const bodyParam = new HttpParams({fromObject: JSON.parse(dataString)});


    console.log(`新增数据请求的body参数: ${bodyParam.toString()}`);
    return this.http.post<Result>(this.baseUrl, dataString, {
      headers: {'Content-Type': 'application/json'},
    });
  }

  /**
   * 更新数据
   * @param data 待更新的数据
   */
  updateData(data: any): Observable<Result> {
    return this.http.put<Result>(`${this.baseUrl}/${data.id}`, data, );
  }


  /**
   * 一次性删除所选记录
   * @param ids 记录编号集合
   * 暂时不做这个，有个问题就是， RESTFul delete 标准好像不支持 body 参数，
   */
  deleteSelected(ids: Set<number>): number[] {
    const idArray: number[] = [];
    for (const id of ids) {
      idArray.push(id);
    }

    const errorIds: number[] = [];
    const requestArray: Observable<Result>[] = [];

    for (const id of idArray) {
      requestArray.push(this.http.delete<Result>(`${this.baseUrl}/${id}`));
    }


    forkJoin(requestArray).subscribe(results => {
      for (let i = 0; i < results.length; i++) {
        if (results[i].status !== 0) {
          errorIds.push(idArray[i]);
        }
      }
    });

    return errorIds;
  }


  /**
   * 一次性删除所选记录
   * @param ids 记录编号集合
   * 暂时不做这个，有个问题就是， RESTFul delete 标准好像不支持 body 参数，
   */
  deleteSelectedByOnce(ids: Set<number>): Observable<Result> {
    console.log(ids);
    const idsParam = {ids: Array.from(ids)};
    const bodyParam = new HttpParams({fromObject: JSON.parse(JSON.stringify(idsParam))});
    return this.http.delete<Result>(this.baseUrl, {
      headers: {'Content-Type': 'application/json'},
      observe: 'body',
      params: bodyParam,
    });
  }

  // /**
  //  * 获取树形数据
  //  */
  // getTreeData(permission?: Permission): Observable<Result> {
  //   let params!: HttpParams;
  //   if (permission) {
  //     // params.append('permission', permission.permission);
  //     // params.append('status', permission.status.toString());
  //     params = new HttpParams({fromString: `permission=${permission.permission}&status=${permission.status}`});
  //     console.log('params: ' + params.toString());
  //   }
  //   return this.http.get<Result>(`${this.baseUrl}/getTree/0`, {
  //     params
  //   });
  // }

  columnDataHasExists(column: string, columnData: any): Observable<Result> {
    const url = `${this.baseUrl}/hasExists`;
    console.log(`url: ${url}`);
    let params: HttpParams;
    params = new HttpParams()
      .append('column', column)
      .append('value', columnData);
    console.log(`params: ${params.toString()}`);
    return this.http.get<Result>(url, {params});
  }


}
