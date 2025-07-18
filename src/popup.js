import { parseToJson, formatJsonToTable } from './formatter.js';
import { marked } from 'marked';

document.getElementById('formatBtn').addEventListener('click', async () => {
  const outputEl = document.getElementById('output');
  try {
    const xml = await navigator.clipboard.readText();
    const json = parseToJson(xml);
    const markdown = formatJsonToTable(json, {title: "Formatted XML Data", markdown: true });
    document.getElementById('popupBody').style.width = '400px';
    outputEl.innerHTML = marked.parse(markdown);
  } catch (err) {
    outputEl.textContent = "Error: " + err.message;
  }
});


