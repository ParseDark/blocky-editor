import { TextModel } from "@pkg/model/textModel";
import { test, expect } from "vitest";

function modelToSpans(model: TextModel): string[] {
  const textSpans: string[] = [];

  let ptr = model.nodeBegin;
  while (ptr) {
    textSpans.push(ptr.content);
    ptr = ptr.next;
  }

  return textSpans;
}

function modelToStyles(model: TextModel): any[] {
  const textSpans: any[] = [];

  let ptr = model.nodeBegin;
  while (ptr) {
    textSpans.push(ptr.attributes);
    ptr = ptr.next;
  }

  return textSpans;
}

test("textModel init", () => {
  const text = new TextModel();
  text.insert(0, "Hello world");
  expect(text.length).toBe("Hello world".length);
});

test("textModel delete", () => {
  const text = new TextModel();
  text.insert(0, "Hello world");
});

test("textModel delete all", () => {
  const text = new TextModel();
  text.insert(0, "Hello world");
  text.delete(0, "Hello world".length);
  expect(text.length).toBe(0);
  expect(text.toString()).toBe("");
});

test("textModel format", () => {
  const text = new TextModel();
  text.insert(0, "This is bolded text");
  text.format(8, 6, {
    bold: true,
  });

  const textSpans: string[] = modelToSpans(text);
  const styles = modelToStyles(text);
  expect(styles[0]).toBeUndefined();
  expect(styles[2]).toBeUndefined();

  expect(textSpans).toEqual([
    "This is ",
    "bolded",
    " text",
  ]);
});

test("textModel delete node #1", () => {
  const text = new TextModel();
  text.insert(0, "This is bolded text");
  text.format(8, 6, {
    bold: true,
  });

  text.delete(8, 4);

  const textSpans: string[] = modelToSpans(text);

  expect(textSpans).toEqual([
    "This is ",
    "ed",
    " text",
  ]);
});

test("textModel delete node #2", () => {
  const text = new TextModel();
  text.insert(0, "This is bolded text");
  text.format(8, 6, {
    bold: true,
  });

  text.delete(12, 4);

  const textSpans: string[] = modelToSpans(text);

  expect(textSpans).toEqual([
    "This is ",
    "bold",
    "ext",
  ]);
});

test("textModel delete node #3", () => {
  const text = new TextModel();
  text.insert(0, "This is bolded text");
  text.format(8, 6, {
    bold: true,
  });

  text.delete(8, 7);

  const textSpans: string[] = modelToSpans(text);
  const styles: any[] = modelToStyles(text);

  expect(textSpans).toEqual([
    "This is text",
  ]);
  expect(styles[0]).toBeUndefined();
});