import { OrderItem } from "./treeStore";

export function findTreeArray(
  searchPath: Array<string>,
  searchItems: Array<OrderItem>,
): Array<OrderItem> {
  if (searchPath.length === 0) {
    return searchItems;
  }
  // finn neste i searchPath:
  const searchIndex = searchItems.findIndex((x) => x.linkId === searchPath[0]);
  return findTreeArray(searchPath.slice(1), searchItems[searchIndex].items);
}
