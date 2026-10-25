"""Build custom PGN dataset JSON from user-supplied PGN directory."""
import json, pathlib, sys

def build_pgn_pack(source_dir, output_file):
    source_path = pathlib.Path(source_dir)
    output_path = pathlib.Path(output_file)

    pgn_files = list(source_path.glob('*.pgn'))
    pack = {'version': 1, 'filesCount': len(pgn_files), 'items': []}

    for pgn_file in pgn_files:
        content = pgn_file.read_text(encoding='utf-8-sig', errors='ignore')
        pack['items'].append({
            'filename': pgn_file.name,
            'content': content
        })

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text('const USER_PGN_PACK = ' + json.dumps(pack, ensure_ascii=False) + ';\n', encoding='utf-8')
    print(f"Successfully compiled {len(pgn_files)} PGN files into {output_path}")

if __name__ == '__main__':
    if len(sys.argv) >= 3:
        build_pgn_pack(sys.argv[1], sys.argv[2])
    else:
        print("Usage: python scripts/build-pgn-pack.py <source_dir> <output_file>")
