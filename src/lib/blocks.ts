/**
 * Renders Strapi "Blocks" rich text to HTML that matches Webflow's rich-text output,
 * so the original `.w-richtext` styles apply unchanged.
 */
import type { Blocks, BlocksInline, BlocksNode, BlocksText } from './types';
import { mediaUrl } from './strapi';

export const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function text(node: BlocksText): string {
  let out = esc(node.text).replace(/\n/g, '<br>');
  if (node.code) out = `<code>${out}</code>`;
  if (node.bold) out = `<strong>${out}</strong>`;
  if (node.italic) out = `<em>${out}</em>`;
  if (node.underline) out = `<u>${out}</u>`;
  if (node.strikethrough) out = `<s>${out}</s>`;
  return out;
}

function inline(nodes: BlocksInline[]): string {
  return nodes
    .map((n) => {
      if (n.type === 'link') {
        const external = /^https?:\/\//.test(n.url);
        return `<a href="${esc(n.url)}"${external ? ' target="_blank" rel="noopener"' : ''}>${n.children.map(text).join('')}</a>`;
      }
      return text(n);
    })
    .join('');
}

function block(node: BlocksNode): string {
  switch (node.type) {
    case 'paragraph':
      return `<p>${inline(node.children)}</p>`;
    case 'heading':
      return `<h${node.level}>${inline(node.children)}</h${node.level}>`;
    case 'quote':
      return `<blockquote>${inline(node.children)}</blockquote>`;
    case 'code':
      return `<pre><code>${esc(node.children.map((c) => c.text).join(''))}</code></pre>`;
    case 'list': {
      // Webflow adds role="list" to rich-text lists.
      const tag = node.format === 'ordered' ? 'ol' : 'ul';
      const items = node.children
        .map((child) => (child.type === 'list' ? block(child) : `<li>${inline(child.children)}</li>`))
        .join('');
      return `<${tag} role="list">${items}</${tag}>`;
    }
    case 'image': {
      const img = node.image;
      return `<figure class="w-richtext-align-normal w-richtext-figure-type-image"><div><img alt="${esc(img.alternativeText ?? '')}" src="${esc(mediaUrl(img))}" loading="lazy"></div></figure>`;
    }
    default:
      return '';
  }
}

export function renderBlocks(blocks: Blocks | null | undefined): string {
  return (blocks ?? []).map(block).join('');
}
