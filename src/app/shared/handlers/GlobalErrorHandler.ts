import {ErrorHandler, Injectable, Injector} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd/message';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private router: Router, private message: NzMessageService) {
  }

  handleError(error: Error): void {
    console.log('******************');
    console.error(error);
    // this.message.error(error.message);
    // console.log(`${JSON.stringify(error)}`);
    console.log('******************');
    // console.log(`error: ${JSON.stringify(error)}`)

    if (error instanceof HttpErrorResponse) {
      switch (error.status) {

        case 401: {
          console.log(`${error.url} 请求未授权，现跳转登录页`);
          this.router.navigate(['signIn'], undefined).then(r => {
            if (r) {
              console.log(`跳转登录页成功`);
            }
          });
          break;
        }
        case 500: {
          this.message.error(error.error.message);
          break;
        }
        default: {
          console.log(`${error.url} 的响应状态码未知: ${error.status}`);
          break;
        }
      }
    }


    if (error instanceof HttpErrorResponse) {
      const index = error.url?.lastIndexOf('authentication/require');
      console.log(`httpErrorResponse ${index}`);
      if (index !== -1) {
        this.message.error('未登录或登录信息过期，请重新登录！');
        this.router.navigateByUrl('/signIn');
      }
    }

  }

}
