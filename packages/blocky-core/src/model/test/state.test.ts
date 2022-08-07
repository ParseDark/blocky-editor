import { BlockRegistry } from "@pkg/registry/blockRegistry";
import { expect, test, describe } from "vitest";
import { makeDefaultIdGenerator } from "@pkg/helper/idHelper";
import {
  BlockElement,
  BlockyDocument,
  BlockyTextModel,
  JSONNode,
  NodeLocation,
} from "blocky-data";
import { State } from "../state";
import Delta from "quill-delta-es";

function makeDefaultUtils() {
  const blockRegistry = new BlockRegistry();
  const idGenerator = makeDefaultIdGenerator();
  return { blockRegistry, idGenerator };
}

function removeId(node: JSONNode) {
  if (node.id) {
    delete node.id;
  }

  if (node.children) {
    node.children.map(removeId);
  }
}

test("serialize", () => {
  const { blockRegistry, idGenerator } = makeDefaultUtils();
  const doc = new BlockyDocument({
    bodyChildren: [
      new BlockElement("Text", idGenerator.mkBlockId(), {
        textContent: new BlockyTextModel(
          new Delta([{ insert: "Hello world" }])
        ),
      }),
    ],
  });
  const state = new State("User-1", doc, blockRegistry, idGenerator);
  const json = state.toJSON();
  removeId(json);
  expect(json).toEqual({
    nodeName: "document",
    children: [
      {
        nodeName: "head",
        children: [
          {
            nodeName: "Title",
            attributes: {
              textContent: [],
            },
            "#meta": {
              textContent: "rich-text",
            },
          },
        ],
      },
      {
        nodeName: "body",
        children: [
          {
            nodeName: "Text",
            attributes: {
              textContent: [
                {
                  insert: "Hello world",
                },
              ],
            },
            "#meta": {
              textContent: "rich-text",
            },
          },
        ],
      },
    ],
  });
});

describe("NodeLocation", () => {
  test("hashCode", () => {
    const l1 = new NodeLocation([]);
    expect(l1.hashCode).toBe(0);
    const l2 = new NodeLocation([1, 2, 3]);
    const l3 = new NodeLocation([1, 2, 3]);
    expect(l2.hashCode).toEqual(l3.hashCode);
    const l4 = new NodeLocation([0, 2, 3]);
    expect(l2.hashCode).not.equal(l4.hashCode);
    const l5 = new NodeLocation([1, 2, 3, 4]);
    expect(l2.hashCode).not.equal(l5.hashCode);
  });
});
