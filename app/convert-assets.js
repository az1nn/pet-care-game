const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const pastaOrigem = './assets_brutos';
const pastaDestino = './assets/sprites';
const qualidade = 85;

if (!fs.existsSync(pastaDestino)){
  fs.mkdirSync(pastaDestino, { recursive: true });
}

if (!fs.existsSync(pastaOrigem)){
  fs.mkdirSync(pastaOrigem, { recursive: true });
}

fs.readdir(pastaOrigem, (err, arquivos) => {
  if (err) return console.error(err);

  arquivos.forEach(arquivo => {
    const ext = path.extname(arquivo).toLowerCase();
    if (['.png', '.jpg', '.jpeg'].includes(ext)) {
      const caminhoCompleto = path.join(pastaOrigem, arquivo);
      const nomeSemExt = path.parse(arquivo).name;
      const caminhoSaida = path.join(pastaDestino, `${nomeSemExt}.webp`);

      sharp(caminhoCompleto)
        .webp({ quality: qualidade })
        .toFile(caminhoSaida)
        .then(() => console.log(`✓ Convertido: ${arquivo}`))
        .catch(err => console.error(err));
    }
  });
});
