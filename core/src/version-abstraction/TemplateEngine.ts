/**
 * Template Engine - Renders code templates using Handlebars
 */

import Handlebars from 'handlebars';
import * as fs from 'fs/promises';
import * as path from 'path';

export class TemplateEngine {
  private handlebars: typeof Handlebars;
  private templateCache: Map<string, HandlebarsTemplateDelegate> = new Map();
  private templateDirectory: string;

  constructor(templateDirectory: string) {
    this.templateDirectory = templateDirectory;
    this.handlebars = Handlebars.create();
    this.registerDefaultHelpers();
  }

  /**
   * Render a template with data
   */
  async render(templatePath: string, data: any): Promise<string> {
    const fullPath = path.join(this.templateDirectory, templatePath);

    // Check cache
    let template = this.templateCache.get(fullPath);

    if (!template) {
      // Load and compile template
      const content = await fs.readFile(fullPath, 'utf-8');
      template = this.handlebars.compile(content);
      this.templateCache.set(fullPath, template);
    }

    return template(data);
  }

  /**
   * Register a helper function
   */
  registerHelper(name: string, fn: Handlebars.HelperDelegate): void {
    this.handlebars.registerHelper(name, fn);
  }

  /**
   * Register a partial template
   */
  registerPartial(name: string, template: string): void {
    this.handlebars.registerPartial(name, template);
  }

  /**
   * Clear template cache
   */
  clearCache(): void {
    this.templateCache.clear();
  }

  /**
   * Register default helpers
   */
  private registerDefaultHelpers(): void {
    // Capitalize first letter
    this.handlebars.registerHelper('capitalize', (str: string) => {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1);
    });

    // Convert to PascalCase
    this.handlebars.registerHelper('pascalCase', (str: string) => {
      if (!str) return '';
      return str
        .split(/[_\s-]+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
    });

    // Convert to camelCase
    this.handlebars.registerHelper('camelCase', (str: string) => {
      if (!str) return '';
      const pascal = str
        .split(/[_\s-]+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
      return pascal.charAt(0).toLowerCase() + pascal.slice(1);
    });

    // Convert to snake_case
    this.handlebars.registerHelper('snakeCase', (str: string) => {
      if (!str) return '';
      return str
        .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
        .replace(/^_/, '')
        .replace(/[_\s-]+/g, '_')
        .toLowerCase();
    });

    // Convert to UPPER_SNAKE_CASE
    this.handlebars.registerHelper('upperSnakeCase', (str: string) => {
      if (!str) return '';
      return str
        .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
        .replace(/^_/, '')
        .replace(/[_\s-]+/g, '_')
        .toUpperCase();
    });

    // JSON stringify
    this.handlebars.registerHelper('json', (obj: any) => {
      return JSON.stringify(obj, null, 2);
    });

    // Conditional equality
    this.handlebars.registerHelper('eq', (a: any, b: any) => {
      return a === b;
    });

    // Conditional inequality
    this.handlebars.registerHelper('neq', (a: any, b: any) => {
      return a !== b;
    });

    // Conditional greater than
    this.handlebars.registerHelper('gt', (a: number, b: number) => {
      return a > b;
    });

    // Conditional less than
    this.handlebars.registerHelper('lt', (a: number, b: number) => {
      return a < b;
    });

    // Join array
    this.handlebars.registerHelper('join', (arr: any[], separator: string = ', ') => {
      if (!Array.isArray(arr)) return '';
      return arr.join(separator);
    });

    // Indent text
    this.handlebars.registerHelper('indent', (text: string, spaces: number = 4) => {
      if (!text) return '';
      const indent = ' '.repeat(spaces);
      return text
        .split('\n')
        .map((line) => indent + line)
        .join('\n');
    });

    // Default value
    this.handlebars.registerHelper('default', (value: any, defaultValue: any) => {
      return value !== undefined && value !== null ? value : defaultValue;
    });
  }
}
