import { describe, it, expect } from 'vitest';
import { generateMarkdown } from './markdown';

describe('generateMarkdown', () => {
  it('should generate basic frontmatter', () => {
    const frontmatter = { title: 'Test Title', author: 'Author Name' };
    const result = generateMarkdown(frontmatter);
    expect(result).toBe('---\ntitle: Test Title\nauthor: Author Name\n---\n');
  });

  it('should handle strings with colons by quoting them', () => {
    const frontmatter = { title: 'Test: Title' };
    const result = generateMarkdown(frontmatter);
    expect(result).toBe('---\ntitle: "Test: Title"\n---\n');
  });

  it('should include the body if provided', () => {
    const frontmatter = { title: 'Test' };
    const result = generateMarkdown(frontmatter, 'This is the body text.');
    expect(result).toBe('---\ntitle: Test\n---\nThis is the body text.\n');
  });
});
