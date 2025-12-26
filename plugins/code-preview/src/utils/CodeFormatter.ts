/**
 * Code formatting and syntax highlighting utilities
 */

/**
 * Highlights Java code with basic syntax highlighting
 */
export function highlightJavaCode(code: string): string {
  if (!code) return '';

  // Escape HTML
  let highlighted = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Java keywords
  const keywords = [
    'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char',
    'class', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum',
    'extends', 'final', 'finally', 'float', 'for', 'goto', 'if', 'implements',
    'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new', 'package',
    'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp',
    'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient',
    'try', 'void', 'volatile', 'while', 'true', 'false', 'null',
  ];

  // Highlight keywords
  keywords.forEach((keyword) => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
    highlighted = highlighted.replace(regex, '<span style="color: #569cd6">$1</span>');
  });

  // Highlight strings
  highlighted = highlighted.replace(
    /"([^"\\]*(\\.[^"\\]*)*)"/g,
    '<span style="color: #ce9178">"$1"</span>'
  );

  // Highlight numbers
  highlighted = highlighted.replace(
    /\b(\d+\.?\d*[fFdDlL]?)\b/g,
    '<span style="color: #b5cea8">$1</span>'
  );

  // Highlight comments (single-line)
  highlighted = highlighted.replace(
    /\/\/(.*?)$/gm,
    '<span style="color: #6a9955">//$1</span>'
  );

  // Highlight comments (multi-line and javadoc)
  highlighted = highlighted.replace(
    /\/\*\*?([\s\S]*?)\*\//g,
    '<span style="color: #6a9955">/*$1*/</span>'
  );

  // Highlight annotations
  highlighted = highlighted.replace(
    /@(\w+)/g,
    '<span style="color: #4ec9b0">@$1</span>'
  );

  // Highlight class names (capitalized words)
  highlighted = highlighted.replace(
    /\b([A-Z][a-zA-Z0-9_]*)\b/g,
    '<span style="color: #4ec9b0">$1</span>'
  );

  // Highlight method calls
  highlighted = highlighted.replace(
    /(\w+)(?=\()/g,
    '<span style="color: #dcdcaa">$1</span>'
  );

  return highlighted;
}

/**
 * Formats Java code with proper indentation
 */
export function formatJavaCode(code: string): string {
  const lines = code.split('\n');
  let indentLevel = 0;
  const formatted: string[] = [];

  for (let line of lines) {
    const trimmed = line.trim();

    // Decrease indent for closing braces
    if (trimmed.startsWith('}')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    // Add line with proper indentation
    if (trimmed.length > 0) {
      formatted.push('  '.repeat(indentLevel) + trimmed);
    } else {
      formatted.push('');
    }

    // Increase indent for opening braces
    if (trimmed.endsWith('{')) {
      indentLevel++;
    }
  }

  return formatted.join('\n');
}

/**
 * Extracts code statistics
 */
export function getCodeStats(code: string) {
  const lines = code.split('\n');
  const nonEmptyLines = lines.filter((line) => line.trim().length > 0);
  const commentLines = lines.filter((line) => {
    const trimmed = line.trim();
    return trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*');
  });

  return {
    totalLines: lines.length,
    codeLines: nonEmptyLines.length - commentLines.length,
    commentLines: commentLines.length,
    emptyLines: lines.length - nonEmptyLines.length,
    characters: code.length,
  };
}
