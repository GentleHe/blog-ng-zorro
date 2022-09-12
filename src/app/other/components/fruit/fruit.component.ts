import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../../../shared";
import {FruitDTO, FruitVO} from "../../domain";
import {FruitService} from "../../services";
import {NzTableSortFn, NzTableSortOrder} from "ng-zorro-antd/table";
import {FormGroup} from "@angular/forms";

export class ColumnItem {
  name!: string;
  key!: string;
  sortFn: boolean = true;
  sortPriority: boolean = true;
  showFilter: boolean = false;
  filterFn: boolean = true;
  filters: Array<{ text: string; value: any }> = [];
  filterMultiple: boolean = false;


  constructor(name: string, key: string) {
    this.name = name;
    this.key = key;
  }

}

export const basicColumnItemId = new ColumnItem('编号', 'id');
export const basicColumnItemCreateBy = new ColumnItem('创建人', 'createBy');
export const basicColumnItemCreateTime = new ColumnItem('创建时间', 'createTime');
export const basicColumnItemUpdateBy = new ColumnItem('更新人', 'updateBy');
export const basicColumnItemUpdateTime = new ColumnItem('更新时间', 'updateTime');

@Component({
  selector: 'app-fruit',
  templateUrl: './fruit.component.html',
  styleUrls: ['./fruit.component.scss']
})
export class FruitComponent extends BaseComponent<FruitDTO, FruitVO> implements OnInit {

  override baseDTO: FruitDTO = new FruitDTO();


  columnItems: ColumnItem[] = [];
  filterForm!: FormGroup;


  searchValue = '';

  constructor(private fruitService: FruitService) {
    super(fruitService);
  }

  override ngOnInit(): void {

    // 初始化字段定义
    this.columnItems = []
    this.columnItems.push(basicColumnItemId);
    this.columnItems.push(new ColumnItem('名称', 'name'),);
    this.columnItems.push(new ColumnItem('重量', 'weight'),);
    this.columnItems.push(new ColumnItem('价格', 'price'),);
    var isSweetColumnItem = new ColumnItem('甜吗', 'isSweet');
    isSweetColumnItem.showFilter = true;
    isSweetColumnItem.filters = [{text: 'sweet', value: true}, {text: 'sour', value: false}]

    this.columnItems.push(isSweetColumnItem);
    this.columnItems.push(new ColumnItem('备注', 'remark'));
    this.columnItems.push(
      basicColumnItemCreateBy,
      basicColumnItemCreateTime,
      basicColumnItemUpdateBy,
      basicColumnItemUpdateTime);

    this.filterForm = new FormGroup({})
  }

  /**
   * 重新加载数据（强制刷新缓存）
   */
  reloadData() {
    console.log('重新加载数据，刷新缓存');
    this.loadDataFromServer(this.pageable);
  }


  // override assembleQueryDTO(filter: Array<{ key: string; value: NzTableFilterValue }>) {
  //   super.assembleQueryDTO(filter);
  //
  //   for (let filterElement of filter) {
  //     // if (filterElement.key === 'isSweet') {
  //     //   this.baseDTO.isSweet
  //     // }
  //
  //     (this.baseDTO as any)[filterElement.key] = filterElement.value
  //   }
  // }
}
