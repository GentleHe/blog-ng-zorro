import {CollectionViewer, DataSource, SelectionChange} from '@angular/cdk/collections';
import {FlatTreeControl, TreeControl} from '@angular/cdk/tree';
import {SelectionModel} from '@angular/cdk/collections';
import {AfterViewInit, EventEmitter, Component, OnInit, Output, OnDestroy} from '@angular/core';
import {NzTreeFlatDataSource, NzTreeFlattener} from 'ng-zorro-antd/tree-view';
import {BehaviorSubject, Observable, of, merge} from 'rxjs';
import {delay, map, tap} from 'rxjs/operators';
import {Permission} from '../../../system/domain';
import {HttpClient} from '@angular/common/http';
import {Result} from '../../domain';
import {environment} from '../../../../environments/environment';

interface FlatNode {
  expandable: boolean;
  permission: string;
  id: number;
  // permission: string;
  level: number;
  loading?: boolean;
}

interface TreeNode {
  permission: string;
  disabled?: boolean;
  children?: TreeNode[];
}


/**
 * 暂时用不到！
 * 可能后期做文件树形管理再用吧。
 */
@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css']
})
export class TreeViewComponent implements OnInit, AfterViewInit, OnDestroy {

  treeName = 'permission';
  baseUrl = `${environment.baseUrl}/${this.treeName}/getTree`;

  permissions: Permission[] = [];
  @Output() permissionSelected = new EventEmitter();



  selectListSelection = new SelectionModel<FlatNode>(true);

  treeFlattener!: NzTreeFlattener<any, any>;


  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

  dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);

  private transformer = (node: Permission, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      permission: node.permission,
      id: node.id,
      level,
    };
  }

  loadTreeFormServer(): Observable<Result> {
    return this.http.get<Result>(`${this.baseUrl}/1`);
  }

  /**
   * 处理点击事件
   */
  handleClick(node: any): void {
    console.log('sub' + node.permission);
    this.permissionSelected.emit((node));
    // 展开收缩
    this.selectListSelection.toggle(node);
  }

  constructor(private http: HttpClient) {
    this.loadTreeFormServer().subscribe(x => {
      const data = x.data;
      this.permissions[0] = data;
      // console.log('Permission: ' + JSON.stringify(Permission));
    });
    setTimeout(() => {
      // console.log('permissions: ' + JSON.stringify(this.permissions));
      // this.dataSource.setData(TREE_DATA);
      this.dataSource.setData(this.permissions);
      this.treeControl.expandAll();
    }, 1000);

  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  ngAfterViewInit(): void {
  }


  ngOnInit(): void {

   this.treeFlattener = new NzTreeFlattener(
      this.transformer,
      node => node.level,
      node => node.expandable,
      node => node.children
    );
  }

  ngOnDestroy(): void {
    console.log('tree-view 组件被销毁了');
  }
}
