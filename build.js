#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'posts');
const outputFile = path.join(postsDir, 'posts.json');

// Leer todos los archivos .md en /posts
const files = fs.readdirSync(postsDir)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''));

// Guardar la lista
fs.writeFileSync(outputFile, JSON.stringify(files, null, 2));

console.log(`posts.json actualizado con ${files.length} posts:`, files);
