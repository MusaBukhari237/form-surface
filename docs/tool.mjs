export function formFields(root) {
  const idMap = new Map();
  for (const entry of root.querySelectorAll("[id]")) {
    if (!idMap.has(entry.id)) idMap.set(entry.id, []);
    idMap.get(entry.id).push(entry);
  }
  const labels = [...root.querySelectorAll("label")];
  const text = el => el?.textContent.trim().replace(/\s+/g," ") ?? "";
  return [...root.querySelectorAll('input:not([type="hidden"]),select,textarea,button')].map(el => {
    const refs = (el.getAttribute("aria-labelledby") ?? "").trim().split(/\s+/);
    const referenceLabel = refs.map(id => text(idMap.get(id)?.[0])).filter(Boolean).join(" ");
    const nativeLabel = labels.filter(label => label.htmlFor === el.id && el.id || !label.htmlFor && label.contains(el)).map(text).filter(Boolean).join(" ");
    return {
      type:el.tagName.toLowerCase() + (el.tagName === "INPUT" ? ":" + el.type : ""),
      name:el.name || el.id || "—",
      label:referenceLabel || el.getAttribute("aria-label")?.trim() || nativeLabel || (el.tagName === "BUTTON" ? text(el) : "") || "—",
      flags:[el.required || el.getAttribute("aria-required") === "true" ? "required" : "", (idMap.get(el.id)?.length ?? 0) > 1 ? "duplicate ID" : ""].filter(Boolean).join(", ") || "—"
    };
  });
}
