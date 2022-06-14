import { BlockRegistry } from "@pkg/registry/blockRegistry";
import { test, expect } from "vitest";
import { makeDefaultIdGenerator } from "@pkg/helper/idHelper";
import { MarkupGenerator } from "@pkg/model/markup";
import { createNode, type TreeNode } from "@pkg/model/tree";
import State, { serializeJSON } from "@pkg/model/state";
import { DocNode } from "@pkg/model/nodes";
import { ValidateError } from "@pkg/model/validator";

function makeDefaultUtils() {
  const blockRegistry = new BlockRegistry;
  const idGenerator = makeDefaultIdGenerator();
  const m = new MarkupGenerator(idGenerator);
  return { blockRegistry, m, idGenerator };
}

test("tree validator", () => {
  const { blockRegistry, m } = makeDefaultUtils();
  State.fromMarkup(
    m.doc([m.line([m.span("Hello World")])]),
    blockRegistry
  );
});

test("tree validate root", () => {
  const { blockRegistry, idGenerator } = makeDefaultUtils();
  const node: TreeNode<DocNode> =  createNode({
    t: "span",
    id: idGenerator.mkSpanId(),
    flags: 0,
    content: ""
  });
  expect(() => {
    new State(node, blockRegistry);
  }).toThrowError(ValidateError);
});

test("serialize", () => {
  const { blockRegistry, m } = makeDefaultUtils();
  const state = State.fromMarkup(
    m.doc([m.line([m.span("Hello World")])]),
    blockRegistry
  );
  console.log(serializeJSON(state));
});
