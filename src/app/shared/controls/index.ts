import {FormControl, ValidationErrors} from '@angular/forms';
import {Observable, Observer} from 'rxjs';
// import {isNumeric} from 'rxjs/internal-compatibility';

export * from './data-tree-select';
export * from './tree-view';
export * from './icon-view';
export * from './upload';


/*
 * 排序权重的异步验证方法
 * @param control 表单控件
 */
// export const columnSortAsyncValidator = (control: FormControl) =>
//   new Observable((observer: Observer<ValidationErrors | null>) => {
//     setTimeout(() => {
//       if (!isNumeric(control.value) || (control.value < 1 || control.value > 999)) {
//         observer.next({error: true, overRange: true});
//       } else {
//         observer.next(null);
//       }
//       observer.complete();
//     }, 100);
//   });
