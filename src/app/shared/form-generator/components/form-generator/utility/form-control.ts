export interface IFormControl {
  type: string;
  id: string;
  // return error msg or null if valid
  validators?: ((value: any) => string | null)[];
}
