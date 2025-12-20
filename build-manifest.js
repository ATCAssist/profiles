const fs = require('fs');
const path = require('path');

const PROFILES_DIR = __dirname;
const MANIFEST_FILE = path.join(PROFILES_DIR, 'manifest.json');

function buildManifest() {
  const files = fs.readdirSync(PROFILES_DIR);

  const profiles = files
    .filter(file => file.endsWith('.json') && file !== 'manifest.json' && file !== 'vercel.json')
    .map(file => {
      const filePath = path.join(PROFILES_DIR, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const profile = JSON.parse(content);

      return {
        id: profile.id,
        name: profile.name,
        description: profile.description,
        version: profile.version,
        file: file
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));

  const manifest = {
    generated: new Date().toISOString(),
    count: profiles.length,
    profiles: profiles
  };

  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
  console.log(`Manifest generated with ${profiles.length} profile(s): ${MANIFEST_FILE}`);
}

buildManifest();
