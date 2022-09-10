import { Injectable } from '@angular/core';
import {BaseDTO, BaseService, Pageable, Result} from "../../shared";
import {FruitDTO, FruitVO} from "../domain";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class FruitService extends BaseService<FruitDTO, FruitVO>{

  constructor(http: HttpClient) {
    super(http);
    super.serviceName='fruit'
    console.log(super.baseUrl);
  }

}
