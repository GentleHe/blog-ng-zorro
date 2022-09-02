export class User {
  id = 0;
  username = '';
  nickname = '';
  gender = 1;
  email = '';
  password = '';
  createTime = 0;
  updateTime = 0;
}

export class Role {
  id = 0;
  role = '';
  status = 0;
  createTime = 0;
  updateTime = 0;
  // permissions: Set<Permission> = new Set();
  permissions: Array<Permission | string> = [];
}


export class Permission{
  id = 0;
  permission = '';
  // parent: {
  //   expand: boolean;
  //   id: number, permission: string } = {id: 0, permission: ''};
  parent?: Permission | undefined;
  url = '';
  icon = '';
  type = '';
  sort = 1;
  status = 0;
  createTime = 0;
  updateTime = 0;
  expression = '';
  children?: Permission[] | undefined;
  level = 0;
  expand?: boolean;


}

export class PermissionNode {
  id = 0;
  permission = '';
  parent: PermissionNode | undefined;
  url = '';
  icon = '';
  type = '';
  children: PermissionNode[] | undefined;
}
