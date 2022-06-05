import {Injectable} from '@angular/core';
import {BaseService} from "../../shared";
import {UserDTO, UserVO} from '../components'
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<UserDTO, UserVO> {



  constructor(http: HttpClient) {
    super(http);
    super.serviceName='user'
    console.log(super.baseUrl);
  }

}
