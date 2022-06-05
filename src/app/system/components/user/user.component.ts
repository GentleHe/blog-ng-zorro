import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BaseComponent, BaseDTO, BaseVO, Pageable} from "../../../shared";
import {UserService} from "../../services/user.service";
import {NzTableQueryParams} from "ng-zorro-antd/table";

export class UserDTO extends BaseDTO {
  name?: string;
  email?: string;
}

export class UserVO extends BaseVO {
  name?: string;
  email?: string;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  // templateUrl: '../../../shared/components/base/base.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent extends BaseComponent<UserDTO, UserVO> implements OnInit {





  constructor(userService: UserService) {
    super(userService);
  }

  override ngOnInit(): void {

  }



}
