import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {Result, SelectTree} from '../../domain';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Observable} from 'rxjs';

export class DataTreeSelect {

}


/**
 * Typescript 不能注入接口，所以改成一个空类
 */
export class TreeService<T> {
  getTreeData(data?: any): Observable<Result> {
    return new Observable();
  }
}

@Component({
  selector: 'app-data-tree-select',
  templateUrl: './data-tree-select.component.html',
  styleUrls: ['./data-tree-select.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DataTreeSelectComponent),
    multi: true
  }]
})
export class DataTreeSelectComponent<T> implements OnInit, ControlValueAccessor {

  constructor(protected treeService: TreeService<T>) {

    this.treeService.getTreeData().subscribe(result => {
      const data: T = result.data[0];
      this.treeArray.push(this.convert2SelectTree(data));
      this.treeArray = [...this.treeArray];
      console.log(`treeArray: ${JSON.stringify(this.treeArray)}`);
    });
  }


  isRelation = true;
  isExpandAll = true;

  @Input() isMulti = true;


  /**
   * 选中编号
   * 值得一提的是，单选的时候，保证模板的 checkable 指令为 false，那么该绑定值自动变为 字符串类型 而不是 字符串数组类型
   */
  checkedIds: number[] = [];


  tree: SelectTree = new SelectTree();
  treeArray: SelectTree[] = [];


  propagateChange = (_: any) => {
  };

  onChange($event: string): void {
    this.propagateChange(this.checkedIds);
  }


  /**
   * 数据转为树形节点
   * todo 本方法需要被重写，不是每个树形结构都强制有 value字段，而是特殊的名称
   * @param data 数据
   */
  convert2SelectTree(data: any): SelectTree {

    const tree = new SelectTree();
    tree.title = `${data.id} - ${data.value}`;
    tree.key = data.id.toString();
    tree.value = data.value;
    tree.icon = data.icon;

    if (data.children !== undefined) {
      tree.children = [];
      tree.isLeaf = data.children.length === 0;
      for (let i = 0; i < (data.children as T[]).length; i++) {
        const temp = this.convert2SelectTree((data.children as T[])[i]);
        tree.children?.push(temp);
      }
      // }else {
      // console.log('无了');
    }
    return tree;
  }


  ngOnInit(): void {
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(obj: any): void {
    this.checkedIds = obj;
  }


}
