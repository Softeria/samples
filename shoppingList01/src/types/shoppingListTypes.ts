/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ShoppingList {
  id?: string;
  name?: string;
  status?: "active" | "completed";
  comment?: string;
  shoppingListItem?: ShoppingListItem[];
}

export interface Item {
  id?: string;
  name?: string;
  price?: number;
  comment?: string;
  itemCategory?: ItemItemCategory[];
  inputValue?: string;
}

export interface ItemItemCategory {
  id?: string;
  category: Category;
}

export interface ShoppingListItem {
  id?: string;
  item: Item;
  shoppingList?: ShoppingList;
  comment?: string;
  isPurchased: boolean;
  quantity: number;
}

export interface Category {
  id?: string;
  name?: string;
  inputValue?: string;
  icon?: string;
}

export interface ItemCategory {
  id?: string;
  item: Item;
  category: Category;
}

export interface shoppingListItemWithCategory {
  listId?: string;
  shoppingListItemId?: string;
  itemId?: string;
  categoryId?: string;
  listName?: string;
  listStatus?: string;
  listComment?: string;
  itemName?: string;
  itemPrice?: number;
  isPurchased?: boolean;
  quantity?: number;
  categoryName?: string;
  icon?: string;
}
