import fs from 'fs';

const file = './storefront/src/lib/products_data.json';
let content = fs.readFileSync(file, 'utf8');

// Convertir Unicode escapes a caracteres reales
content = content.replace(/\\u[\dA-Fa-f]{4}/g, (match) => {
    return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
});

// Corregir dobles escapes si existen (\\n a \n)
content = content.replace(/\\\\n/g, '\\n');

fs.writeFileSync(file, content, 'utf8');
console.log('✅ Archivo corregido');