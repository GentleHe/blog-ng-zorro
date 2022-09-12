import {AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BaseDTO, BaseVO, Pageable} from "../../domain";
import {BaseService} from "../../services";
import {NzTableFilterValue, NzTableQueryParams, NzTableSortFn, NzTableSortOrder} from "ng-zorro-antd/table";


export interface BaseComponentInterface<DTO extends BaseDTO, VO extends BaseVO> {

  /**
   * 从远程服务器加载数据
   * @param pageable 分页对象
   * @param baseDTO 传输层对象
   */
  loadDataFromServer(pageable: Pageable, baseDTO: DTO): void;


  /**
   * 查询参数改变时触发的事件
   * @param params 查询参数
   */
  onQueryParamsChange(params: NzTableQueryParams): void
}


@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent<DTO extends BaseDTO, VO extends BaseVO> implements OnInit, BaseComponentInterface<DTO, VO> {

  //todo 如果改成 any 类型，就能根据属性名去访问属性值
  // data: VO[] = []
  data: any[] = []

  // 字段名数组
  propertyNames: Array<string> = []

  // 页码
  pageIndex = 1

  // 页码数据量
  pageSize = 5

  // 总数据量
  total: number = 20

  // 加载动画
  loading = false

  // 被勾选的数据
  selectedData: any[] = [];

  // 被勾选的数据的 id 集合
  checkedIds = new Set<number>()

  // 默认的传输层对象，初始为空，没有任何限制条件
  baseDTO = new BaseDTO() as DTO;

  // 分页对象
  pageable = new Pageable(this.pageIndex, this.pageSize, [], []);

  checked = false;
  indeterminate = false;

  // id 的下拉选项
  idSelection: any;


  // 添加/编辑表单的对话框的可视化
  modalVisible = false;

  constructor(protected baseService: BaseService<DTO, VO>) {
  }

  ngOnInit(): void {

    // 一上来就要加载数据的
    this.loadDataFromServer(this.pageable)


  }

  /**
   * 从远程加载数据
   * @param pageable 分页对象
   * @param baseDTO 传输层对象
   */
  loadDataFromServer(pageable: Pageable): void {
    this.loading = true
    console.log('从服务器加载数据列表')

    var data = this.baseService.getData(pageable, this.baseDTO);
    data.subscribe(x => {
      console.log("获取到的数据列表: " + JSON.stringify(x.data.total))


      // 赋值
      this.data = x.data.rows
      this.total = x.data.total

      // todo 获取对象的属性名的列表，通过属性名访问属性值
      // const datum = this.data[0];
      // console.log(datum)
      // for (let dataKey in datum) {
      //   console.log('datumKey: ' + dataKey)
      //   console.log('datumValue: ' + datum[dataKey])
      //   this.propertyNames.push(dataKey)
      // }


      this.loading = false
    })


  }


  /**
   * 查询参数改变时触发的事件
   * @param params
   */
  onQueryParamsChange(params: NzTableQueryParams) {

    const {pageSize, pageIndex, sort, filter} = params;

    //页码需要“减1”，ng-zorro是以 1 为起始页的索引的
    this.pageable = new Pageable(pageIndex - 1, pageSize, sort as Array<{ key: string; value: 'ascend' | 'descend' | null }>, filter);



    this.loadDataFromServer(this.pageable)
  }


  /**
   * 单个数据 check/uncheck 事件
   * @param id
   * @param $event
   */
  onDatumCheckedChange(id: number, checked: boolean) {
    this.updateCheckedIds(id, checked)
    this.refreshCheckedStatus();
  }


  /**
   * 当前页所有的数据切换 check/uncheck
   * @param checked 是否勾选
   */
  onAllCheckedChange(checked: boolean) {

    this.data.forEach(datum => {
      this.updateCheckedIds(datum.id!, checked)
    })
    this.refreshCheckedStatus()
  }

  /**
   * 更新 checkedIds 中的集合元素
   * @param id 哪个数据的 id
   * @param checked 勾选与否
   * @private
   */
  private updateCheckedIds(id: number, checked: boolean) {
    // 如果是勾选就添加，否则就删除
    if (checked) {
      // console.log('添加')
      this.checkedIds.add(id)
    } else {
      // console.log('删除')
      this.checkedIds.delete(id)
    }

    // console.log('当前: ' + JSON.stringify(this.checkedIds.size))
    // console.log(this.checkedIds)
  }

  /**
   * 刷新表格的勾选状态
   * @private
   */
  private refreshCheckedStatus() {

    // 是否全部勾选
    this.checked = this.data.every(datum => this.checkedIds.has(datum.id!))

    /**
     * 是否 “不确定的”
     * 全部勾选或者全部都没有被勾选，则是“确定的” false
     * 部分勾选，则是“不确定的” true
     */
    this.indeterminate = this.data.some(datum => this.checkedIds.has(datum.id!)) && !this.checked
    console.log('indeterminate: ' + this.indeterminate)
  }

  goAddDatum() {
    this.modalVisible = true
  }

  handleCancel() {
    this.modalVisible = false
  }

  /**
   * 拼装 baseDTO 用于字段查询
   * @private
   */
  assembleQueryDTO(filter: Array<{ key: string; value: NzTableFilterValue }>) {

  }
}
