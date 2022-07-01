import { Component, JSX } from "preact";
import { EditorController, type IPlugin } from "blocky-core";
import * as Y from "yjs";
import {
  BlockyEditor,
  makePreactBanner,
  makePreactToolbar,
  type BannerRenderProps,
} from "blocky-preact";
import { makeYjsPlugin } from "blocky-yjs";
import makeBoldedTextPlugin from "blocky-core/dist/plugins/boldedTextPlugin";
import makeBulletListPlugin from "blocky-core/dist/plugins/bulletListPlugin";
import makeHeadingsPlugin from "blocky-core/dist/plugins/headingsPlugin";
import { makeImageBlockPlugin } from "./plugins/imageBlock";
import BannerMenu from "./bannerMenu";
import ToolbarMenu from "./toolbarMenu";
import TianShuiWeiImage from "./tianshuiwei.jpg";
import { ReadMeContent } from "./readme";
import "blocky-core/css/bolded-text-plugin.css";
import "blocky-core/css/blocky-core.css";
import "./app.scss";

interface AppState {
  headingContent: string;
}

function makeEditorPlugins(doc: Y.Doc, allowInit?: boolean): IPlugin[] {
  return [
    makeBoldedTextPlugin(),
    makeBulletListPlugin(),
    makeHeadingsPlugin(),
    makeImageBlockPlugin(),
    makeYjsPlugin({ doc, allowInit }),
  ];
}

/**
 * The controller is used to control the editor.
 */
function makeController(doc: Y.Doc): EditorController {
  return new EditorController({
    collaborativeCursorOptions: {
      id: "User-1",
      idToName: (id: string) => id,
      idToColor: () => "orange",
    },
    /**
     * Define the plugins to implement customize features.
     */
    plugins: makeEditorPlugins(doc, false),
    /**
     * Tell the editor how to render the banner.
     * We use a banner written in Preact here.
     */
    bannerFactory: makePreactBanner(
      ({ editorController, focusedNode }: BannerRenderProps) => (
        <BannerMenu
          editorController={editorController}
          focusedNode={focusedNode}
        />
      )
    ),
    /**
     * Tell the editor how to render the banner.
     * We use a toolbar written in Preact here.
     */
    toolbarFactory: makePreactToolbar((editorController: EditorController) => {
      return <ToolbarMenu editorController={editorController} />;
    }),
  });
}

function makeRightController(doc: Y.Doc): EditorController {
  return EditorController.emptyState({
    plugins: makeEditorPlugins(doc, true),
    collaborativeCursorOptions: {
      id: "User-2",
      idToName: (id: string) => id,
      idToColor: () => "red",
    },
    bannerFactory: makePreactBanner(
      ({ editorController, focusedNode }: BannerRenderProps) => (
        <BannerMenu
          editorController={editorController}
          focusedNode={focusedNode}
        />
      )
    ),
    toolbarFactory: makePreactToolbar((editorController: EditorController) => {
      return <ToolbarMenu editorController={editorController} />;
    }),
  });
}

class App extends Component<{}, AppState> {
  private doc1: Y.Doc;
  private doc2: Y.Doc;
  private editorControllerLeft: EditorController;
  private editorControllerRight: EditorController;

  constructor(props: {}) {
    super(props);
    this.doc1 = new Y.Doc();
    this.doc2 = new Y.Doc();

    this.doc1.on('update', update => {
      // simulate the network
      setTimeout(() => {
        Y.applyUpdate(this.doc2, update)
      }, 0);
    });
    
    this.doc2.on('update', update => {
      setTimeout(() => {
        Y.applyUpdate(this.doc1, update)
      }, 0);
    });

    this.editorControllerLeft = makeController(this.doc1);
    this.editorControllerLeft.enqueueNextTick(this.firstTick);

    this.editorControllerRight = makeRightController(this.doc2);

    this.editorControllerLeft.cursorChanged.on(evt => {
      this.editorControllerRight.applyCursorChangedEvent(evt);
    });

    this.editorControllerRight.cursorChanged.on(evt => {
      this.editorControllerLeft.applyCursorChangedEvent(evt);
    });

    this.state = {
      headingContent: "Blocky Editor",
    };
  }

  private firstTick = () => {
    const { editor } = this.editorControllerLeft;
    if (!editor) {
      return;
    }
    // force reset the paste cursor state
    editor.state.cursorState = {
      type: "collapsed",
      targetId: (editor.state.root.firstChild! as any).id,
      offset: 0,
    };
    editor.pasteHTMLAtCursor(ReadMeContent);
  };

  private handleHeadingChanged = (e: JSX.TargetedEvent<HTMLInputElement>) => {
    this.setState({
      headingContent: (e.target! as HTMLInputElement).value,
    });
  };

  render() {
    return (
      <div className="blocky-example-app-window">
        <div className="blocky-example-container">
          <div className="blocky-example-image">
            <img src={TianShuiWeiImage} />
          </div>
          <div className="blocky-example-badge-container">
            <a
              href="https://github.com/vincentdchan/blocky-editor"
              target="_blank"
            >
              <img
                alt="GitHub Repo stars"
                src="https://img.shields.io/github/stars/vincentdchan/blocky-editor?style=social"
              />
            </a>
            <a href="https://twitter.com/cdz_solo" target="_blank">
              <img
                alt="Twitter Follow"
                src="https://img.shields.io/twitter/follow/cdz_solo?style=social"
              ></img>
            </a>
          </div>
          <div className="blocky-example-editors" >
            <div className="blocky-example-editor-container left">
              <div className="blocky-example-user">User 1</div>
              <div className="blocky-example-title-container">
                <input
                  value={this.state.headingContent}
                  onChange={this.handleHeadingChanged}
                />
              </div>
              <BlockyEditor controller={this.editorControllerLeft} />
            </div>
            <div className="blocky-example-editor-container right">
              <div className="blocky-example-user">User 2</div>
              <div className="blocky-example-title-container">
                <input
                  value={this.state.headingContent}
                  onChange={this.handleHeadingChanged}
                />
              </div>
              <BlockyEditor controller={this.editorControllerRight} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
