#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'posts');
const outputFile = path.join(postsDir, 'posts.json');
const templateFile = path.join(__dirname, 'post.html');
const baseUrl = 'https://liminalismos.com';

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

// Extraer primera imagen del cuerpo markdown
function extractFirstImage(body) {
    const match = body.match(/!\[.*?\]\((\S+?)(?:\s+".*?")?\)/);
    return match ? match[1] : null;
}

// Escapar HTML en atributos
function escapeAttr(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

// Leer todos los archivos .md en /posts
const slugs = fs.readdirSync(postsDir)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''));

// Guardar la lista de slugs
fs.writeFileSync(outputFile, JSON.stringify(slugs, null, 2));
console.log(`posts.json actualizado con ${slugs.length} posts:`, slugs);

// Leer template de post
const template = fs.readFileSync(templateFile, 'utf-8');

// Generar HTML individual por post
for (const slug of slugs) {
    const mdContent = fs.readFileSync(path.join(postsDir, `${slug}.md`), 'utf-8');
    const { meta, body } = parseFrontmatter(mdContent);

    const title = escapeAttr(meta.title || slug);
    const description = escapeAttr(meta.subtitle || 'Pensando desde los márgenes');
    const image = meta.image || extractFirstImage(body) || '/images/og-default.jpg';
    const absoluteImage = image.startsWith('http') ? image : `${baseUrl}${image}`;
    const postUrl = `${baseUrl}/posts/${slug}/`;

    // Reemplazar meta tags en el template
    let html = template
        .replace(/<title>.*?<\/title>/, `<title>${title} — Liminalismos</title>`)
        .replace(/(<meta property="og:title" content=").*?(">)/, `$1${title}$2`)
        .replace(/(<meta property="og:description" content=").*?(">)/, `$1${description}$2`)
        .replace(/(<meta property="og:url" content=").*?(">)/, `$1${postUrl}$2`)
        .replace(/(<meta property="og:image" content=").*?(">)/, `$1${absoluteImage}$2`)
        .replace(/(<meta name="twitter:title" content=").*?(">)/, `$1${title}$2`)
        .replace(/(<meta name="twitter:description" content=").*?(">)/, `$1${description}$2`)
        .replace(/(<meta name="twitter:image" content=").*?(">)/, `$1${absoluteImage}$2`);

    // Crear directorio y escribir archivo
    const postDir = path.join(postsDir, slug);
    if (!fs.existsSync(postDir)) {
        fs.mkdirSync(postDir, { recursive: true });
    }
    fs.writeFileSync(path.join(postDir, 'index.html'), html);
    console.log(`  Generado: posts/${slug}/index.html`);
}
