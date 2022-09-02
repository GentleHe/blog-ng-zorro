import {Component, OnInit, EventEmitter, Output, Input, OnChanges, SimpleChanges, forwardRef} from '@angular/core';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import {icons} from '../../../icons-provider.module';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';


// const antDesignIcons = AllIcons as {
//   [key: string]: IconDefinition;
// };
// const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key]);

@Component({
  selector: 'app-icon-view',
  templateUrl: './icon-view.component.html',
  styleUrls: ['./icon-view.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => IconViewComponent),
    multi: true
  }]
})
export class IconViewComponent implements OnInit, OnChanges, ControlValueAccessor {

  constructor() {
    // for (let i = 80; i < 105; i++) {
    //   const current = icons[i];
    //   // console.log(current.name);
    //   this.allIcons.push(current);
    // }
    // console.log('length: ' + this.allIcons.length);
  }

  // 绑定值
  selectedIcon = '';


  // allIcons: IconDefinition[] = [];
  allIcons: IconDefinition[] = icons;


  @Input() assignIcon = '';


  @Output() icon = new EventEmitter();

  propagateChange = (_: any) => {};

  onChange(event: any): void{
    this.propagateChange(this.selectedIcon);
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(obj: any): void {
    this.selectedIcon = obj;
  }

}
