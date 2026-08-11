/* ==========================================================================
   Tiny Markdown renderer (subset) - used for the profile bio
   --------------------------------------------------------------------------
   Supports: paragraphs, hard line breaks (two trailing spaces or a trailing
   backslash), headings (# .. ######), blockquotes (>), unordered (- * +)
   and ordered (1.) lists, fenced code blocks (```), horizontal rules,
   bold (**), italic (*), inline code (`) and links ([text](url)).
   All input is HTML-escaped first, so raw HTML is never injected.
   ========================================================================== */

'use strict';

function markdownToHtml(md) {
  if (md == null || md === '') return '';
  const lines = String(md).replace(/\r\n?/g, '\n').split('\n');
  const out = [];
  let inCode = false;
  let codeBuf = [];
  let list = null;

  function flushList() {
    if (!list) return;
    const tag = list.ordered ? 'ol' : 'ul';
    out.push(
      '<' + tag + '>' + list.items.map((i) => '<li>' + i + '</li>').join('') + '</' + tag + '>'
    );
    list = null;
  }

  function flushCode() {
    if (!inCode) return;
    out.push('<pre><code>' + codeBuf.join('\n') + '</code></pre>');
    inCode = false;
    codeBuf = [];
  }

  function escapeHtml(s) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function inline(text) {
    let s = escapeHtml(text);
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
    s = s.replace(/(^|[^*])\*([^*]+)\*/g, '$1<i>$2</i>');
    s = s.replace(
      /\[([^\]]+)]\(([^)\s]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>'
    );
    return s;
  }

  function hardBreak(line) {
    return line.replace(/(?: {2}|\\$)($|\n)/, '<br>$1');
  }

  /* escape first so inserted tags (from hardBreak/lists) are never escaped */
  function renderLine(line) {
    return hardBreak(inline(line));
  }

  for (const raw of lines) {
    const line = raw;

    /* fenced code block */
    if (/^\s*```/.test(line)) {
      flushList();
      if (inCode) flushCode();
      else {
        inCode = true;
        codeBuf = [];
      }
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      continue;
    }

    /* blank line separates blocks */
    if (/^\s*$/.test(line)) {
      flushList();
      out.push('');
      continue;
    }

    /* heading */
    if (/^\s{0,3}#{1,6}\s+/.test(line)) {
      flushList();
      const level = line.match(/^#{1,6}/)[0].length;
      const text = line.replace(/^\s{0,3}#+\s*/, '').replace(/\s+#+\s*$/, '');
      out.push('<h' + level + '>' + inline(text) + '</h' + level + '>');
      continue;
    }

    /* horizontal rule */
    if (/^\s{0,3}(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      flushList();
      out.push('<hr>');
      continue;
    }

    /* blockquote */
    if (/^\s{0,3}>/.test(line)) {
      flushList();
      out.push(
        '<blockquote>' + renderLine(line.replace(/^\s{0,3}>\s?/, '')) + '</blockquote>'
      );
      continue;
    }

    /* unordered list */
    const ulMatch = line.match(/^\s{0,3}[-*+]\s+(.*)$/);
    if (ulMatch) {
      const item = renderLine(ulMatch[1]);
      if (list && !list.ordered) list.items.push(item);
      else {
        flushList();
        list = { ordered: false, items: [item] };
      }
      continue;
    }

    /* ordered list */
    const olMatch = line.match(/^\s{0,3}\d+\.\s+(.*)$/);
    if (olMatch) {
      const item = renderLine(olMatch[1]);
      if (list && list.ordered) list.items.push(item);
      else {
        flushList();
        list = { ordered: true, items: [item] };
      }
      continue;
    }

    /* plain line -> paragraph */
    flushList();
    out.push(renderLine(line));
  }
  flushList();
  flushCode();

  /* group consecutive lines into paragraphs (single newlines -> spaces) */
  const html = [];
  let para = [];
  const isBlock = /^<(?:h\d|ul|ol|pre|blockquote|hr)/;
  for (const block of out) {
    if (block === '') {
      if (para.length) {
        html.push('<p>' + para.join(' ') + '</p>');
        para = [];
      }
    } else if (isBlock.test(block)) {
      if (para.length) {
        html.push('<p>' + para.join(' ') + '</p>');
        para = [];
      }
      html.push(block);
    } else {
      para.push(block);
    }
  }
  if (para.length) html.push('<p>' + para.join(' ') + '</p>');
  return html.join('\n');
}
