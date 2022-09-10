/**
 * 水果
 */
import {BaseDTO, BaseVO} from "../../shared";

export class FruitDTO extends BaseDTO{
  name!: string;
  weight!: number;
  isSweet!: boolean;
  price!: number;
}

export class FruitVO extends BaseVO{
  name!: string;
  weight!: number;
  isSweet!: boolean;
  price!: number;
}
