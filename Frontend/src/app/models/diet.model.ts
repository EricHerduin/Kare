export class DietBook {
  id!: string;
  title!: string;
  sexe!: string;
  pathology!: string;
  nbStage!: number;
  nbWeekPerStage!: number;
  description!: string;
  meal?: string[];
  customerId!: string[];
  online!: number;
}
