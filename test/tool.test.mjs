import test from "node:test";
import assert from "node:assert/strict";
import * as core from "../docs/tool.mjs";

test("handles an empty form and missing label and name fallbacks", () => {
  assert.deepEqual(core.formFields({querySelectorAll:() => []}),[]);
  const input={id:"",name:"",tagName:"INPUT",type:"text",getAttribute:()=>null};
  const root={querySelectorAll:selector => selector.startsWith("input")?[input]:[]};
  assert.deepEqual(core.formFields(root),[{type:"input:text",name:"—",label:"—",flags:"—"}]);
});
