export function generateMarkdown(frontmatter: Record<string, any>, body: string = ''): string {
  let content = '---\n';
  for (const [key, value] of Object.entries(frontmatter)) {
    if (value !== undefined && value !== null) {
      if (typeof value === 'string' && (value.includes(':') || value.includes('\n') || value.startsWith('@'))) {
        // Enclose in quotes and escape internal quotes
        content += `${key}: "${value.replace(/"/g, '\\"')}"\n`;
      } else {
        content += `${key}: ${value}\n`;
      }
    }
  }
  content += '---\n';
  if (body) {
    content += `${body}\n`;
  }
  return content;
}
