export interface IProduct {
  id?: number | undefined;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  score: number;
  imgUrl?: string | undefined;
}
