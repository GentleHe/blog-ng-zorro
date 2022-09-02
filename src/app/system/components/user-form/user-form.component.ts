import {Component, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Observable, Observer} from 'rxjs';
import {UserService} from '../../services';
import {User} from '../../domain';
import {NzMessageService} from 'ng-zorro-antd/message';
import {BaseFormComponent} from '../../../shared';


@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent extends BaseFormComponent<User> implements OnInit, OnChanges {

  constructor(fb: FormBuilder, private userService: UserService, message: NzMessageService) {
    super(new User(), fb, userService, message);

    this.validateForm = this.fb.group({
      id: [''],
      username: ['', [Validators.required], [this.userNameAsyncValidator]],
      nickname: [''],
      email: ['', [Validators.email, Validators.required]],
      gender: [''],
      password: ['', [Validators.required]],
      confirm: ['', [this.confirmValidator]],
      comment: ['', [Validators.required]]
    })
  }

  override ngOnInit(): void {
  }

  /**
   * 用户名校验器 判断是否已经存在
   * @param control
   */
  userNameAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {

        this.userService.columnDataExists('username', control.value).subscribe(x => {
          console.log(JSON.stringify(x));
          if (x.status === 0) {
            // 服务器中不存在
            if (x.data !== true) {
              observer.next(null);
            }else{
              // 服务器中存在的情况下，如果是新增模式肯定不行，如果是编辑模式，且不等于编辑对象的值也不行(因为不能占别人的名字吧)
              if (this.isCreate || !this.isCreate && control.value !== this.data.username) {
                observer.next({error: true, duplicated: true});
              }
              else {
                observer.next(null);
              }
            }
          }else{
            observer.next({error: true});
          }
          observer.complete();
        });

      }, 100);
    })

  /**
   * 重复密码校验器 判断重复密码是否和密码一致
   * @param control
   */
  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {error: true, required: true};
    } else if (control.value !== this.validateForm.controls['password'].value) {
      return {confirm: true, error: true};
    }
    return {};
  }


  override quickFillColumnChange(value: any) {

    if (this.quickFill) {
      this.validateForm.get('nickname')!.setValue(value);
      this.validateForm.get('email')!.setValue(value + `@163.com`);
      this.validateForm.get('password')!.setValue(value);
      this.validateForm.get('confirm')!.setValue(value);
      this.validateForm.get('comment')!.setValue(`用户[${value}]还没有备注`);


      // 改变了这么多值，需要每个都校验一遍
      for (const key of Object.keys(this.validateForm.controls)) {
        this.validateForm.controls[key].markAsDirty();
        this.validateForm.controls[key].updateValueAndValidity();
      }

    }
  }
}
