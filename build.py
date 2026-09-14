from pathlib import Path
import re
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED

root = Path(__file__).resolve().parent
systems = (root/'src/systems.js').read_text()
exports = re.findall(r'export\s+(?:async\s+)?(?:function|const|let|class)\s+(\w+)', systems)
systems = re.sub(r'\bexport\s+(?=(?:async\s+)?(?:function|const|let|class)\b)', '', systems)
if re.search(r'^\s*(?:import|export)\s', systems, re.M):
    raise RuntimeError('Unsupported module syntax in domain bundle')
game = (root/'src/game.js').read_text()
game = re.sub(r"import\s*\{([^}]+)\}\s*from\s*'./systems.js';", r'const {\1}=CastleSystems;', game)
bundle = 'const CastleSystems=(()=>{\n' + systems + '\nreturn {' + ','.join(exports) + '};\n})();\n' + game
html = (root/'index.html').read_text()
html = html.replace('<link rel="stylesheet" href="style.css">', '<style>'+(root/'style.css').read_text()+'</style>')
html = html.replace('<script src="vendor/three.min.js"></script>', '<script>'+(root/'vendor/three.min.js').read_text().replace('</script','<\\/script')+'</script>')
html = html.replace('<script type="module" src="src/game.js"></script>', '<script>(()=>{\n'+bundle.replace('</script','<\\/script')+'\n})();</script>')
out=root/'dist'
out.mkdir(exist_ok=True)
(out/'castle-realm-slice.html').write_text(html)
(out/'index.html').write_text(html)
# Both playable entrypoints and the source download belong to the same release.
files = [root/name for name in ['index.html','style.css','build.py','package.json','README.md','CONTRIBUTING.md','AGENTS.md','.gitignore']]
for folder in ['src','docs','tests','vendor','.github']:
    files.extend(p for p in (root/folder).rglob('*') if p.is_file())
with ZipFile(out/'castle-realm-source.zip','w',compression=ZIP_DEFLATED) as archive:
    for path in sorted(files):
        info=ZipInfo('castle-realm/'+path.relative_to(root).as_posix(),(2026,9,14,0,0,0))
        info.compress_type=ZIP_DEFLATED
        info.external_attr=0o100644<<16
        archive.writestr(info,path.read_bytes())
print(f'Built matching hosted and offline games ({len(html.encode())} bytes each), plus source download.')
