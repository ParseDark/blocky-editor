import type { TreeNode, DocNode, Block } from "@pkg/model";
import { CursorState } from "@pkg/model/cursor";

export enum BlockContentType {
  Text,
  Custom,
}

export interface BlockCreatedEvent {
  element: HTMLElement;
  clsPrefix: string;
  node: TreeNode<DocNode>;
  block: Block,
}

export interface BlockFocusedEvent {
  selection: Selection;
  node: HTMLDivElement;
  cursor: CursorState;
}


export interface IBlockDefinition {
  name: string;
  type: BlockContentType;

  /**
   * if a block's type is [[Text]],
   * this method must be provided.
   * 
   * A text block must have a child element to contain
   * the text content.
   */
  findContentContainer?: (parent: HTMLElement) => HTMLElement;

  onContainerCreated?: (e: BlockCreatedEvent) => void;

  /**
   * Handle the block is focused.
   * 
   * This hook will only be triggered when the focused id is
   * equal to the block'id. The children is out of situation.
   * 
   */
  onBlockFocused?: (e: BlockFocusedEvent) => void;

}
