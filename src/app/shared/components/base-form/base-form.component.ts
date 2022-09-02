import {Component, EventEmitter, Inject, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidationErrors} from "@angular/forms";
import {observable, Observable, Observer} from "rxjs";
import {BaseService} from "../../services";
import {NzMessageService} from "ng-zorro-antd/message";

export interface BaseFormInterface<T> {

  /**
   * 快速填充，开启此项，可以给所有数值都和 主要键 联动进行自动填充。。
   */
  quickFill: boolean;

  /**
   * 表单组
   */
  validateForm: FormGroup;

  /**
   * 是添加还是编辑？ true 默认表示添加，false为编辑
   */
  isCreate: boolean;

  /**
   * 编辑模式，传入对应的编辑数据进来
   */
  data: T;

  operationFinished: EventEmitter<T>;

  columnAsyncValidators: ((control: FormControl) => (Observable<ValidationErrors | null> | { [s: string]: boolean }))[] | undefined;

  /**
   * 提交表单前的操作，把表单数据映射到编辑数据上
   * @param value 表单数据
   */
  beforeSubmitForm(value: any): void;

  /**
   * 提交表单数据到服务器进行 添加
   * @param value 表单数据
   */
  submitForm(value: any): void;

  /**
   * 重置表单
   * 注意：一些复杂的表单需要一些额外重置操作（比如表单项是用的自定义的子组件），可以在子类重写本方法，super()之后，额外添加自己的重置逻辑
   * @param e 鼠标事件
   */
  resetForm(e: MouseEvent): void;

  /**
   * 初始化表单
   */
  initForm(): void;

  /**
   * 初始化表单之后的后续操作
   */
  afterInitForm(): void;

  /**
   * 更新当前的数据到服务器
   * @param data 当前表单数据
   */
  updateDatum(data: T): void;

  /**
   * 当填充的基准列的值改变时，做自动填充  主要是方便后台管理人员和测试
   *  比如你添加用户，以 username 作为基准列，那么你的 username 的值为 Admin 时，
   *  其它的列根据该列变化自动变化，如 性别就是默认男，用户自我介绍就是 ”Admin的自我介绍“ 用户邮箱就是 "Admin@163.com" 这样的一个联动填充的效果
   * @param value 快速填充的基准列的值
   */
  quickFillColumnChange(value: any): void;
}

@Component({
  selector: 'app-base-form',
  templateUrl: './base-form.component.html',
  styleUrls: ['./base-form.component.css']
})
export class BaseFormComponent<T> implements OnInit, BaseFormInterface<T> {

  constructor(@Inject({providerIn: 'root'}) protected initData: T, protected fb: FormBuilder,
              protected baseService: BaseService<T, T>, protected message: NzMessageService) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  columnAsyncValidators: ((control: FormControl) => (Observable<ValidationErrors | null> | { [p: string]: boolean }))[] | undefined;
  data: any;
  isCreate = true;
  operationFinished = new EventEmitter();
  quickFill = true;
  validateForm!: FormGroup;

  /**
   * 字段值是否重复存在？
   * 适用于添加和修改的时候，和该字段值已经存在于数据库中，则提示错误信息
   * @param columnName 字段名
   * @param originValue 控件的原来的值，如果是编辑模式下，比如这个记录当前的数据库值是 Bob，现在你输入的也是Bob（等于没有修改这个数据），
   *                    数据库中是存在，但是也是你的，所以自然不能认为是“重复”
   * @param control 控件
   */
  columnValueIsExists = (columnName: string, originValue: any, control: FormControl) => {
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        // todo
        this.baseService.columnDataExists(columnName, control.value).subscribe(x => {
          if (x.status === 0) {
            // 服务器中不存在
            if (!x.data) {
              observer.next(null);
            } else {
              // 服务器中存在的情况下，如果是新增模式肯定不行，如果是编辑模式，且不等于编辑对象的值也不行(因为不能占别人的名字吧)
              if (this.isCreate || !this.isCreate && control.value !== originValue) {
                observer.next({error: true, duplicated: true});
              } else {
                observer.next(null);
              }
            }
          } else {
            observer.next({error: true});
          }
          observer.complete();
        })

      }, 100);
    })
  }



  /**
   * 提交表单前的操作，把表单数据映射到编辑数据上
   * 但是我们这里是普通的单体对象的映射，即该对象没有和其它对象有任何关系：聚合、包含、关联等等。
   * 做法是 控件名 和 类的字段 保持一致，然后通过JSON直接反序列化成该类对象
   *
   * 弊端：如果和其它对象有关系的话，比如产品涉及到所属分类，表单控件中关于分类的控件名是 categoryId，而实际上产品类关于分类的字段是 category: Category
   * 那么分类这部分的数据在反序列化过程中就会丢失，因为名称不匹配，且字段不是基本类型（string、number等）
   * 解决办法：可以手动重写本方法，可以在子类中 super.beforeSubmitForm() 然后再写自定义的拼装逻辑，将涉及到其它对象的部分补上去
   *
   * @param value 表单数据
   */
  beforeSubmitForm(value: any): void {
    console.log(`提交表单值: ${JSON.stringify(value)}`);
    /**
     *
     * 遍历每个表单控件，将表单控件值标记为已改变，重新计算表单控件的值和验证状态
     */
    for (const key of Object.keys(this.validateForm.controls)) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }

    this.data = JSON.parse(JSON.stringify(value));
    console.log(`准备新增到服务器的数据: ${JSON.stringify(this.data)}`);
  }

  /**
   * 初始化表单
   * 几乎每个实体的表单项目都不一样，需要重写本方法自定义一个响应式表单
   *
   */
  initForm(): void {
    this.afterInitForm();
  }

  /**
   * 初始化表单之后
   * 如果是编辑模式的话，那还需要一个 将编辑数据 赋值到表单对应项目的过程，即自动填充原有值的过程，而这个过程是可以抽出来的。
   * 在子类中自定好表单后，再调用 super.initForm(); 这个方法走一遍赋值和验证过程就行了。
   */
  afterInitForm(): void {


    /**
     * 如果是编辑模式，就线验证一遍
     */
    if (!this.isCreate) {

      /**
       * 想一来就触发一次验证的话：
       * 要延时一定时间，我们需要在表单的第一次pending之后再赋值，否则无法接受到statusChange事件
       * 参考 todo https://github.com/NG-ZORRO/ng-zorro-antd/issues/6550
       * 源于angular的不支持，angular在初始化表单的时候，不会向外发射任何异步验证器事件，所以需要初始化之后再来触发验证
       */
      setTimeout(() => {
        // 通过匹配控件名和对象的字段名，直接1对1赋值， 使用patch而不是set方法，表示如果有就赋值，没有就不管
        this.validateForm.patchValue(this.data);
        console.log(`初始化表单数据: ${JSON.stringify(this.validateForm.value)}`);
        // console.log(`准备用于表单初始化的对象数据: ${JSON.stringify(this.data)}`)
      }, 100);

      // 如果是编辑模式，则主动触发一次表单验证，避免已经有数据的表单项目还要手动去触发验证
      for (const key of Object.keys(this.validateForm.controls)) {
        this.validateForm.controls[key].markAsDirty();
        this.validateForm.controls[key].updateValueAndValidity({emitEvent: true});
      }


    }
  }

  quickFillColumnChange(value: any): void {
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key of Object.keys(this.validateForm.controls)) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }

  /**
   * 添加用户提交表单
   * @param value 表单数据
   */
  submitForm(value: any): void {
    this.beforeSubmitForm(value);


    this.baseService.addDatum(this.data).subscribe(x => {
      if (x.status === 0) {
        this.message.create('success', x.message);
        this.data = this.initData;
        this.operationFinished.emit(true);
      }
    });


  }

  updateDatum(data: T): void {
    console.log(`即将更新到服务器的数据: ${JSON.stringify(data)}`);

    this.beforeSubmitForm(data);

    this.baseService.updateDatum(data).subscribe(x => {
      console.log(`更新结果: ${JSON.stringify(x)}`);
      // 如果更新成功
      if (x.status === 0) {
        this.message.create('success', x.message);
        this.operationFinished.emit(true);
      } else {
        this.message.create('error', x.message);
      }
    });
  }

  /**
   * 当输入属性改变时
   * 主要应用场景是：当用户编辑完表单数据后，点击新建，需要重置表单数据
   * //todo 也许可以从input()上面动手脚，直接传进来空对象不香吗。
   * @param changes 值的改变..
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (this.isCreate) {
      this.data = this.initData;
    }

  }

}
