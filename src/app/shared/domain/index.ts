export interface Result {
  status: number;
  message: string;
  data: any;
}

export class Pageable {
  page: number = 0;
  size: number = 5;

  constructor(page: number, size: number) {
    this.page = page;
    this.size = size;
  }
}

export class BaseDTO {

}

export class BaseVO {
  id?: number;
  createTime?: number;
  updateTime?: number;
  createBy?: string;
  updateBy?: string;
}
