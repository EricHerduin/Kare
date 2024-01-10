// dialog-data.model.ts

export interface StageToRemove {
  value: number;
  selected: boolean;
}

export interface ConfirmationDialogData {
  message: string;
  stagesToRemove?: StageToRemove[];
}
