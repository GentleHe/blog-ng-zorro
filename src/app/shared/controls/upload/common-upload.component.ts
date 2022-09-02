import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzUploadChangeParam, NzUploadFile, NzUploadListType, NzUploadXHRArgs} from 'ng-zorro-antd/upload';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Observable, Observer, Subscription} from 'rxjs';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Result} from '../../domain';
import {toNumber} from 'ng-zorro-antd/core/util';


interface CommonUpload {

  /**
   * 处理上传的URL
   */
  baseUrl: string;


  /**
   * 是否允许多选
   */
  isMultipleEnable: boolean;

  /**
   * 一次最多允许选择多少个上传
   */
  limitOnce: number;

  /**
   * 总共最多允许上传多少个文件，多个按先进先出先出的方式剔除
   */
  maxFileCount: number;


  /**
   * 上传列表展示形式 文本、图片预览图、图片卡片，默认文本的兼容行最强：上传非视频图片类型文件也不会有显示
   */
  listShowType: NzUploadListType;

  /**
   * 是否支持选择文件夹，不是上传文件夹，而是上传里面的所有文件、且开启此选项就不能选择文件了
   */
  isDirectoryEnable: boolean;

  /**
   * 接受的文件类型
   * acceptFileType = 'image/png,image/jpeg,image/gif,image/bmp';
   */
  acceptFileType: string;

  /**
   * 已上传的文件列表  作为组件的双向绑定值
   */
  fileList: NzUploadFile[];

  /**
   * 处理每次 上传文件改变时的状态\开始、上传进度、完成、失败都会调用这个函数。
   * @param info 改变参数
   */
  handleChange: (info: NzUploadChangeParam) => void;

  /**
   * 处理上传文件，加水印啥的
   * @param file 准备上传的文件
   */
  transformFile: (file: NzUploadFile) => {};


  /**
   * 自定义上传请求，默认是通过 nzAction 以表单的形式提交
   * @param args 请求参数
   */
  nzCustomRequest: (args: NzUploadXHRArgs) => Subscription;

}

@Component({
  selector: 'app-upload',
  templateUrl: './common-upload.component.html',
  styleUrls: ['./common-upload.component.css']
})
export class CommonUploadComponent implements CommonUpload, OnInit {

  baseUrl = `${environment.baseUrl}/file`;


  // 是否允许多选
  @Input() isMultipleEnable = true;

  // 一次最多允许选择多少个上传
  @Input() limitOnce = 3;

  // 总共最多允许上传多少个文件，多个按先进先出先出的方式剔除
  @Input() maxFileCount = 4;


  // 上传列表展示形式 文本、图片预览图、图片卡片，默认文本的兼容行最强：上传非视频图片类型文件也不会有显示
  @Input() listShowType: NzUploadListType = 'text';

  // 是否支持选择文件夹，不是上传文件夹，而是上传里面的所有文件、且开启此选项就不能选择文件了
  @Input() isDirectoryEnable = false;

  // 接受的文件类型
  // acceptFileType = 'image/png,image/jpeg,image/gif,image/bmp';
  @Input() acceptFileType = '*/*';

  @Output() uploadedFiles = new EventEmitter();


  // 已上传的文件列表
  @Input() fileList: NzUploadFile[] = [];

  handleChange(info: NzUploadChangeParam): void {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-this.maxFileCount);


    /**
     * 遍历所有文件，有响应的，需把上传成功后的url赋给文件对象，这样才能显示真实的地址、点击下载
     */
    fileList.map(file => {
      if (file.response) {
        console.log(`${file.name}: ${file.url}: ${file.response.url}`);
        file.url = file.response.url;
      }
    });

    if (info.file.status === 'uploading') {
      // console.log(info.file, info.fileList)
    }

    if (info.file.status === 'done') {
      this.msg.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} file uploaded failed`);
    }

    this.fileList = fileList;
    // 发送文件列表给上层
    this.uploadedFiles.emit(this.fileList);
  }

  transformFile = (file: NzUploadFile) => {
    return new Observable((observer: Observer<Blob>) => {
      const reader = new FileReader();
      // tslint:disable-next-line:no-any
      reader.readAsDataURL(file as any);
      reader.onload = () => {
        const canvas = document.createElement('canvas');
        const img = document.createElement('img');
        img.src = reader.result as string;
        img.onload = () => {
          const ctx = canvas.getContext('2d');
          if (null != ctx) {
            ctx.drawImage(img, 0, 0);
            ctx.fillStyle = 'red';
            ctx.textBaseline = 'middle';
            ctx.fillText('Ant Design', 20, 20);
            canvas.toBlob(blob => {
              if (null !== blob) {
                observer.next(blob);
                observer.complete();
              }
            });
          }
        };
      };
    });
  }


  nzCustomRequest = (args: NzUploadXHRArgs): Subscription => {
    console.log(`自定义上传逻辑: ${JSON.stringify(args)}`);
    const index = this.fileList.length;

    // 上传进度 percent%
    let percent: number;

    // 表单参数，采用form提交
    const body = new FormData();
    body.append('file', args.file as any);
    return this.http.post<Result>(`${this.baseUrl}/upload`, body, {
      reportProgress: true,
      observe: 'events'
    })
      // .pipe(
      // map(event => {
      //   switch (event.type) {
      //     case HttpEventType.UploadProgress:
      //       return event;
      //     case HttpEventType.Response:
      //       return event;
      //   }
      //   return event;
      // }),
      // todo 有些example例子，会将操作放到管道中进行，我是放在 subscribe中不知道哪个更好。。
      // )

      .subscribe((event: any) => {
        if (null !== event && event.type === HttpEventType.UploadProgress) {
          percent = toNumber(((event.loaded / event.total) * 100).toFixed(2));
          console.log(`percent: ${percent}`);
          console.log(`currentUploadFile: ${JSON.stringify(args.file)}`);


          this.fileList[index].percent = percent;

          this.fileList = [...this.fileList];

        } else if (event.type === HttpEventType.Response) {
          const result = event.body;
          if (result.status === 0) {
            if (percent >= 100) {
              args.file.status = 'done';
              console.log(`${JSON.stringify(result)}`);
              this.fileList[index].url = result.data;
              // args.file.url = 'http://baidu.com/z.png';
              args.onSuccess?.('', args.file, '');
            }
            this.msg.success('上传成功');
          } else {
            this.msg.error('上传失败');
          }
        }
      });
  }


  constructor(private msg: NzMessageService, private http: HttpClient) {
  }

  ngOnInit(): void {
  }

}

