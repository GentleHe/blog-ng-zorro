export interface Result {
  status: number;
  message: string;
  data: any;
}

export class Pageable {
  page: number = 0;
  size: number = 5;
  sort: Array<{ key: string; value: string | 'ascend' | 'descend' | null }> = [];
  filter: Array<{ key: string; value: any | any[] }> = [];


  constructor(page: number, size: number, sort: Array<{ key: string; value: "ascend" | "descend" | null }>, filter: Array<{ key: string; value: any }>) {
    this.page = page;
    this.size = size;
    this.sort = sort;
    this.filter = filter;
  }
}

export class BaseDTO {
  id?: number;
  createTime?: number;
  updateTime?: number;
  createBy?: string;
  updateBy?: string;
}

export class BaseVO {
  id?: number;
  createTime?: number;
  updateTime?: number;
  createBy?: string;
  updateBy?: string;
}
