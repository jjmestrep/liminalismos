// Detectar en qué página estamos
const isHomePage = window.location.pathname === '/' ||
                   window.location.pathname === '/index.html' ||
                   window.location.pathname === '';

// Parsear frontmatter YAML simple
function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { meta: {}, body: content };

    const meta = {};
    match[1].split('\n').forEach(line => {
        const [key, ...rest] = line.split(':');
        if (key && rest.length) {
            meta[key.trim()] = rest.join(':').trim();
        }
    });

    return { meta, body: match[2] };
}

// Parser simple de Markdown
function parseMarkdown(text) {
    let html = text;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

    // Images
    html = html.replace(/!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" alt="$1">');

    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>');

    // Blockquotes
    html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>');

    // Inline code
    html = html.replace(/`(.*?)`/gim, '<code>$1</code>');

    // Paragraphs
    html = html.split(/\n\n+/).map(para => {
        para = para.trim();
        if (para &&
            !para.startsWith('<h') &&
            !para.startsWith('<blockquote') &&
            !para.startsWith('<pre') &&
            !para.startsWith('<ul') &&
            !para.startsWith('<ol')) {
            return `<p>${para.replace(/\n/g, '<br>')}</p>`;
        }
        return para;
    }).join('\n');

    return html;
}

// Cargar manifiesto
async function loadManifesto() {
    const manifesto = document.getElementById('manifesto');
    if (!manifesto) return;

    try {
        const response = await fetch('/data/home.json');
        const data = await response.json();

        const paragraphs = data.manifesto.split('\n\n');
        manifesto.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
    } catch (error) {
        console.error('Error cargando manifiesto:', error);
    }
}

// Cargar lista de posts en el home
async function loadPostList() {
    const postList = document.getElementById('post-list');
    if (!postList) return;

    try {
        // Cargar lista de slugs
        const response = await fetch('/posts/posts.json');
        const slugs = await response.json();

        // Cargar metadatos de cada post
        for (const slug of slugs) {
            const postResponse = await fetch(`/posts/${slug}.md`);
            const content = await postResponse.text();
            const { meta } = parseFrontmatter(content);

            const li = document.createElement('li');
            li.innerHTML = `
                <a href="/posts/${slug}/">
                    <span class="post-link-title">${meta.title || slug}</span>
                </a>
            `;
            postList.appendChild(li);
        }
    } catch (error) {
        console.error('Error cargando posts:', error);
    }
}

// Cargar contenido de un post
async function loadPost() {
    // Slug desde path (/posts/{slug}/) o query params (?slug=X) como fallback
    const pathMatch = window.location.pathname.match(/\/posts\/([^/]+)/);
    const slug = pathMatch ? pathMatch[1] : new URLSearchParams(window.location.search).get('slug');

    if (!slug) {
        window.location.href = '/';
        return;
    }

    try {
        const response = await fetch(`/posts/${slug}.md`);
        if (!response.ok) throw new Error('Post no encontrado');

        const content = await response.text();
        const { meta, body } = parseFrontmatter(content);

        // Actualizar título y meta tags de la página
        const title = meta.title || slug;
        const description = meta.subtitle || 'Pensando desde los márgenes';
        document.title = `${title} — Liminalismos`;

        const metaUpdates = {
            'og:title': title,
            'og:description': description,
            'twitter:title': title,
            'twitter:description': description,
        };
        for (const [key, value] of Object.entries(metaUpdates)) {
            const el = document.querySelector(`meta[property="${key}"], meta[name="${key}"]`);
            if (el) el.setAttribute('content', value);
        }

        // Actualizar metadatos
        document.getElementById('post-title').textContent = meta.title || slug;
        document.getElementById('post-subtitle').textContent = meta.subtitle || '';

        // Parsear y mostrar contenido
        const html = parseMarkdown(body);
        document.getElementById('post-body').innerHTML = html;

    } catch (error) {
        document.getElementById('post-body').innerHTML = '<p>Error al cargar el contenido.</p>';
        console.error(error);
    }
}

// Cargar apariciones en medios
async function loadMediaList() {
    const mediaList = document.getElementById('media-list');
    if (!mediaList) return;

    try {
        const response = await fetch('/data/media.json');
        const data = await response.json();
        const items = data.items || data;

        items.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="${item.url}" target="_blank">
                    <span class="media-title">${item.title}</span>
                    <span class="media-source">${item.source}</span>
                </a>
            `;
            mediaList.appendChild(li);
        });
    } catch (error) {
        console.error('Error cargando medios:', error);
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    if (isHomePage) {
        loadManifesto();
        loadPostList();
        loadMediaList();
    } else {
        loadPost();
    }
});
