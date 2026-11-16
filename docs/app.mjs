const el = id => document.getElementById(id);
function show(value) { el("result").textContent = value; }
function appendText(value) {
  const p = document.createElement("p"); p.textContent = value; el("result").append(p);
}
function action(callback) {
  const button = el("run");
  button.onclick = async () => {
    button.disabled = true;
    try { await callback(); } catch (error) { show(error.message); }
    finally { button.disabled = false; }
  };
}
function renderTable(rows) {
  const wrapper = document.createElement("div"), table = document.createElement("table");
  wrapper.className = "grid";
  rows.forEach((row,index) => {
    const tr = table.insertRow();
    row.forEach(value => {
      const cell = document.createElement(index ? "td" : "th");
      cell.textContent = String(value);
      if (!index) cell.scope = "col";
      tr.append(cell);
    });
  });
  wrapper.append(table); el("result").append(wrapper);
}
let previousUrl;
function download(filename, contents, type = "text/csv") {
  if (previousUrl) URL.revokeObjectURL(previousUrl);
  previousUrl = URL.createObjectURL(new Blob([contents],{type}));
  const link = document.createElement("a");
  link.className = "download"; link.href = previousUrl;
  link.download = filename; link.textContent = "Download " + filename;
  el("result").append(link);
}
import {formFields} from "./tool.mjs";
el("example").onclick = () => { el("markup").value = '<label for="email">Email address</label>\n<input id="email" name="email" type="email" required>\n<select name="region" aria-label="Region"><option>North</option></select>\n<input id="email" name="backup">\n<button>Submit</button>'; };
action(() => {
  const template = document.createElement("template");
  template.innerHTML = el("markup").value;
  const results = formFields(template.content);
  show(results.length + " controls");
  if (results.length) renderTable([["Type","Name","Label","Flags"],...results.slice(0,250).map(Object.values)]);
  if (results.length > 250) appendText("Showing the first 250 controls.");
});
