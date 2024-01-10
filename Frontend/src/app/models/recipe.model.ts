export class Recipe {
  id!: string;
  title!: string;
  dietbookIds!: number[];
  ingredients!: string[];
  recipe!: string[];
  preparationTime!: number;
  cookingTime!: number;
  breakTime!: number;
  pics!: string[];
  online!: boolean;
  customerId!: string[];
}
