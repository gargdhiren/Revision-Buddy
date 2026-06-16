type TiptapNode = {
  text?: string;
  content?: TiptapNode[];
};

export function extractPlainText(content: string): string {
  if (!content) return "";
  try {
    const doc = JSON.parse(content);
    const texts: string[] = [];
    function walk(node: TiptapNode) {
      if (node.text) texts.push(node.text);
      if (node.content) node.content.forEach(walk);
    }
    walk(doc);
    return texts.join(" ");
  } catch {
    return content;
  }
}
