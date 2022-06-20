import type { IPlugin } from "@pkg/registry/pluginRegistry";
import type { Editor } from "@pkg/view/editor";
import type { Block } from "@pkg/block/basic";
import { TextModel, TextType, type TextInsertEvent } from "@pkg/model";

function makeBulletListPlugin(): IPlugin {
  const turnTextBlockIntoBulletList = (editor: Editor, blockId: string, textModel: TextModel) => {
    textModel.delete(0, 2);
    textModel.textType = TextType.Bulleted;
    editor.render(() => {
      editor.state.cursorState = {
        type: "collapsed",
        targetId: blockId,
        offset: 0,
      };
    });
  };
  const handleNewBlockCreated = (editor: Editor) => (block: Block) => {
    const blockData = block.props.data;
    if (blockData && blockData instanceof TextModel) {
      blockData.onInsert.on((e: TextInsertEvent) => {
        if (e.index === 1 && e.text === " ") {
          const content = blockData.toString();
          if (content[0] === "-") {
            turnTextBlockIntoBulletList(editor, block.props.id, blockData);
          }
        }
      });
    }
  };
  return {
    name: "bullet-list",
    onInitialized(editor: Editor) {
      editor.state.newBlockCreated.on(handleNewBlockCreated(editor));
    },
  };
}

export default makeBulletListPlugin;
