import json, pathlib, sys, chess, re
root=pathlib.Path(__file__).resolve().parents[1]
output=pathlib.Path(sys.argv[1]) if len(sys.argv)>1 else root/'app/build/quality'
raw={x['id']:x for x in json.loads((output/'source-exercises.json').read_text(encoding='utf-8'))}
source={x['PuzzleId']:x for x in json.loads((root/'evidence/lichess-source-rows.json').read_text(encoding='utf-8'))}
rows=json.loads((output/'validated-exercises.json').read_text(encoding='utf-8'));counts={}
def sq(xs): return sorted(chess.square_name(x) for x in xs)
def color(c): return c=='w'
def attacks(b,c,t):return sq(b.attackers(c,t))
for e in rows:
 r=raw[e['quality']['sourceId']];row=source[r['source']['puzzleId']];before=chess.Board(row['FEN']);assert before.is_valid()
 replay=before.copy();moves=[chess.Move.from_uci(m) for m in row['Moves'].split()]
 for move in moves: assert move in replay.legal_moves;replay.push(move)
 after=before.copy();after.push(moves[0]);b=chess.Board(e.get('afterFen') or e['fen']);assert b.fen()==after.fen(),e['id']
 q=e['quality']['rule'];kind=q['kind'];
 if kind in ('loose','convergence'): assert 'non-king' in e['prompt']
 t=chess.parse_square(e['quality']['target']);p=b.piece_at(t);assert p and p.piece_type!=chess.KING
 if kind in ('attackers','defenders','trace','verdict','flash'):
  a=attacks(b,not p.color,t);d=attacks(b,p.color,t)
  if kind=='trace': assert [sorted(s['squares']) for s in e['traceSteps']]==[a,[chess.square_name(t)],d];expected=d
  elif kind=='verdict': expected=[chess.square_name(t)];assert e['correctOption']==('illusion' if d else 'real')
  elif kind=='flash':
   matches=[s for s,v in b.piece_map().items() if v.color==p.color and v.piece_type==p.piece_type and b.attackers(not p.color,s) and bool(b.attackers(p.color,s))==bool(d)];assert matches==[t];expected=[chess.square_name(t)]
  else: expected=a if kind=='attackers' else d
 elif kind in ('loose','convergence'):
  c=color(q['color']);expected=sq(s for s,v in b.piece_map().items() if v.color==c and v.piece_type!=chess.KING and (bool(b.attackers(not c,s)) and not b.attackers(c,s) if kind=='loose' else len(b.attackers(not c,s))>=2))
 elif kind=='transition':
  old=chess.Board(e['fen']);move=old.parse_san(e['moveSan']);old.push(move);assert old.fen()==b.fen();old=chess.Board(e['fen']);c=color(q['color']);typ={'p':1,'n':2,'b':3,'r':4,'q':5,'k':6}[q['type']]
  expected=sq(s for s,v in b.piece_map().items() if v.color==c and v.piece_type==typ and old.piece_at(s)==v and (old.attackers(chess.WHITE,s)!=b.attackers(chess.WHITE,s) or old.attackers(chess.BLACK,s)!=b.attackers(chess.BLACK,s)))
 else: raise ValueError(kind)
 if kind in ('attackers','defenders','trace','verdict'):
  assert ('White ' if p.color else 'Black ')+chess.piece_name(p.piece_type)+' on '+chess.square_name(t) in e['prompt']
 if kind=='flash':
  assert ('White ' if p.color else 'Black ')+chess.piece_name(p.piece_type) in e['prompt']
 for field in ('prompt','explanation'):
  for label in re.finditer(r'\b(White|Black)\s+(pawn|knight|bishop|rook|queen|king)\s+on\s+([a-h][1-8])\b',e[field],re.I):
   actual=b.piece_at(chess.parse_square(label.group(3)));assert actual and actual.color==(label.group(1).lower()=='white') and chess.piece_name(actual.piece_type)==label.group(2).lower()
 assert sorted(e['correctSquares'])==expected,(e['id'],expected,e['correctSquares'])
 assert e['quality']['pieceCount']==len(b.piece_map());counts[kind]=counts.get(kind,0)+1
out={'validator':'python-chess '+chess.__version__,'records':len(rows),'distinctSourceGames':len({e['source']['game'] for e in rows}),'passed':True,'rules':counts,'checks':['complete source PV legal','setup move applied','displayed FEN matches source','piece color and type from board','all accepted answers independently recomputed','verdict and trace steps verified']}
(output/'independent-validation.json').write_text(json.dumps(out,indent=2));print(json.dumps(out,indent=2))

