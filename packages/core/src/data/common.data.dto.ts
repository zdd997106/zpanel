export interface SelectOptionDto<T = string> {
  label: string;
  value: T;
}

export interface Paged<ItemDto> {
  items: ItemDto[];
  count: number;
}
