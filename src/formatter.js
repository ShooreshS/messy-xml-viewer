// change imports to web style
import { XMLParser } from 'fast-xml-parser';

function sanitizeTags(xml) {
  // Match all opening and closing tags with spaces in tag names
  return xml.replace(/<\/?([a-zA-Z0-9]+(?:\s+[a-zA-Z0-9]+)+)\s*>/g, (match, tagName) => {
    const cleanedTag = tagName.replace(/\s+/g, '');
    return match.startsWith('</') ? `</${cleanedTag}>` : `<${cleanedTag}>`;
  });
}

export function parseToJson(xmlString) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    allowBooleanAttributes: true,
    parseTagValue: true,
    parseAttributeValue: true
  });

  const cleanedXml = sanitizeTags(xmlString);
  return parser.parse(cleanedXml);
}

export function formatJsonToTable(json, {
  title = "Formatted XML Data",
  markdown = false,
  keysToInclude = null,
  level = 0
} = {}) {
  let output = "";
  let levelStr = '__'.repeat(level);
  let levelTitle = "#".repeat(level + 1);

  if (title) {
    output += markdown ? `#${levelTitle} ${title}\n` : `=== ${title} ===\n`;
  }

  const entries = Object.entries(json);

  for (const [key, value] of entries) {
    if (typeof value === 'object' && !Array.isArray(value)){
      output += formatJsonToTable(value, { title: key, markdown, keysToInclude, level: level + 1 })+ '\n';
      continue;
    } 

    if (keysToInclude && !keysToInclude.includes(key)) continue;

    const label = markdown ? `**${key}:**` : `${key}:`;
    const val = Array.isArray(value) ? value.join(", ") : value;
    
    output += `${levelStr}${label} ${val}\n\n`;
  }

  return output;
}

