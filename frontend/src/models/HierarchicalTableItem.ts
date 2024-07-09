export default interface HierarchicalTableItem {
  id: number;
  article: string;
  name: string;
  amount: number;
  price: string;
  totalPrice: string;
  subItems?: HierarchicalTableItem[];
}
