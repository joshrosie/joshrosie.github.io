// Minimal, dependency-free Markdown -> HTML renderer.
// Handles: headings, fenced code, blockquotes, lists, hr,
// bold/italic/inline-code, links and images. Enough for a personal blog.
(function (global) {
    function esc(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function inline(s) {
        // images first, then links
        s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img alt="$1" src="$2">');
        s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,
            '<a href="$2" target="_blank" rel="noopener">$1</a>');
        s = s.replace(/`([^`]+)`/g, function (_, c) { return '<code>' + c + '</code>'; });
        s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        s = s.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');
        return s;
    }

    function render(md) {
        var lines = md.replace(/\r\n/g, '\n').split('\n');
        var html = [], i = 0;

        while (i < lines.length) {
            var line = lines[i];

            // fenced code block
            if (/^```/.test(line)) {
                var buf = [];
                i++;
                while (i < lines.length && !/^```/.test(lines[i])) { buf.push(esc(lines[i])); i++; }
                i++;
                html.push('<pre><code>' + buf.join('\n') + '</code></pre>');
                continue;
            }
            // horizontal rule
            if (/^\s*(---|\*\*\*)\s*$/.test(line)) { html.push('<hr>'); i++; continue; }
            // heading
            var h = /^(#{1,6})\s+(.*)$/.exec(line);
            if (h) { var lvl = h[1].length; html.push('<h' + lvl + '>' + inline(esc(h[2])) + '</h' + lvl + '>'); i++; continue; }
            // blockquote
            if (/^>\s?/.test(line)) {
                var q = [];
                while (i < lines.length && /^>\s?/.test(lines[i])) { q.push(esc(lines[i].replace(/^>\s?/, ''))); i++; }
                html.push('<blockquote>' + inline(q.join(' ')) + '</blockquote>');
                continue;
            }
            // unordered list
            if (/^\s*[-*]\s+/.test(line)) {
                var ul = [];
                while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
                    ul.push('<li>' + inline(esc(lines[i].replace(/^\s*[-*]\s+/, ''))) + '</li>'); i++;
                }
                html.push('<ul>' + ul.join('') + '</ul>');
                continue;
            }
            // ordered list
            if (/^\s*\d+\.\s+/.test(line)) {
                var ol = [];
                while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
                    ol.push('<li>' + inline(esc(lines[i].replace(/^\s*\d+\.\s+/, ''))) + '</li>'); i++;
                }
                html.push('<ol>' + ol.join('') + '</ol>');
                continue;
            }
            // blank line
            if (/^\s*$/.test(line)) { i++; continue; }
            // paragraph (gather consecutive non-blank, non-special lines)
            var p = [];
            while (i < lines.length && !/^\s*$/.test(lines[i]) &&
                   !/^(#{1,6})\s|^```|^>\s?|^\s*[-*]\s+|^\s*\d+\.\s+|^\s*(---|\*\*\*)\s*$/.test(lines[i])) {
                p.push(esc(lines[i])); i++;
            }
            html.push('<p>' + inline(p.join(' ')) + '</p>');
        }
        return html.join('\n');
    }

    global.renderMarkdown = render;
})(window);
