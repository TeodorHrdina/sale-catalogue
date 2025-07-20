export enum Category {
  PCs = 'PCs',
  MonitorsAndTVs = 'Monitors and TVs',
  Laptops = 'Laptops',
  Tablets = 'Tablets',
  Headphones = 'Headphones',
  Cables = 'Cables',
  Peripherals = 'Peripherals',
  Misc = 'Misc'
}

export interface CatalogueItem {
  id: string;
  category: Category;
  name: string;
  description: string;
  price: number;
  count: number;
  imageLinks: string[];
}