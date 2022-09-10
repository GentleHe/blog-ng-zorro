import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../../../shared";
import {FruitDTO, FruitVO} from "../../domain";
import {FruitService} from "../../services";
import {NzTableSortFn, NzTableSortOrder} from "ng-zorro-antd/table";
import {FormGroup} from "@angular/forms";

interface ColumnItem{
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: boolean | NzTableSortFn<any> | null;

}

@Component({
  selector: 'app-fruit',
  templateUrl: './fruit.component.html',
  styleUrls: ['./fruit.component.scss']
})
export class FruitComponent extends BaseComponent<FruitDTO, FruitVO> implements OnInit {

  columnItems: ColumnItem[] = [{
    name: '价格1',
    sortOrder: 'ascend',
    // sortDirections: ['ascend', 'descend', null],
    sortFn: true
  }];
  filterForm!: FormGroup;





  constructor(private fruitService: FruitService) {
    super(fruitService);
  }

  override ngOnInit(): void {
    this.filterForm = new FormGroup({

    })
  }

  /**
   * 重新加载数据（强制刷新缓存）
   */
  reloadData() {
    console.log('重新加载数据，刷新缓存');
    this.loadDataFromServer(this.pageable, this.baseDTO);
  }
}
