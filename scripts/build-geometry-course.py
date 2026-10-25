"""Build private course data from a user-supplied PGN; never downloads material."""
import chess.pgn, hashlib, json, pathlib, re, sys
source, destination = map(pathlib.Path, sys.argv[1:3])
chapters = [
 ('matrix', 'The Matrix Board', 'Approach two goals with one king route.', 'Trace the king route. Compare distance in king moves, not straight-line distance.'),
 ('collinearity', 'Collinearity', 'Notice pieces sharing a rank, file or diagonal.', 'Look for aligned targets and the blocker between them. Alignment alone does not prove a tactic.'),
 ('concurrency', 'Concurrency', 'Find squares where several lines meet.', 'Inspect a square and its controllers. A common target can coordinate distant pieces.'),
 ('novotny', 'Novotny · double interference', 'Look for a crossing point that obstructs two defenders.', 'Study which defensive line is interrupted after each capture on the intersection.'),
 ('cross-pins', 'Cross Pins', 'Recognize a piece constrained in two directions.', 'Follow both pin lines and check what lies behind the pinned piece.'),
 ('zigzag', 'Zigzag', 'Follow a forcing route with changes of direction.', 'Trace successive landing squares and notice how each check or threat makes time.'),
 ('backward', 'Backward Vision', 'Include retreating moves in your candidate search.', 'Look behind the piece. A retreat can create a new attack or preserve a key connection.'),
 ('domination', 'Domination', 'Inspect a piece’s escape squares and tactical restrictions.', 'Geometric control is only the first check. Use the annotated line to understand tactical restrictions.'),
 ('seven', 'Seven of Nine', 'Recognize queen and minor-piece control around an exposed king.', 'A queen a knight’s move from the king combines with a checking minor piece to control the king square and six neighboring squares in the model.'),
 ('mates', 'Geometric Mates', 'Build mating nets through coordinated control.', 'Track checking lines, flight squares and possible interpositions through the supplied continuation.'),
 ('puzzles', 'Geometric Puzzles', 'Combine the geometry without a motif hint.', 'Try recalling the course line first; inspect its geometry after submitting. Other legal moves are not automatically wrong chess.'),
]
pack = {'version':1, 'title':'The Secrets of Chess Geometry', 'author':'GM Maurice Ashley', 'sourceLabel':'Your personal PGN · Chessable attribution in source', 'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(), 'chapters':[], 'examples':[]}
for index, (key,title,goal,cue) in enumerate(chapters,1):
 pack['chapters'].append({'id':key,'number':index,'title':title,'goal':goal,'cue':cue})
clean = lambda text: text.replace('@@StartBracket@@','(').replace('@@EndBracket@@',')').strip()
total, extras, nodes, branches = 0, [], 0, 0
with source.open(encoding='utf-8-sig') as f:
 while (game := chess.pgn.read_game(f)) is not None:
  total += 1
  assert not game.errors, game.errors
  match = re.match(r'^(\d+)\)',game.headers.get('White',''))
  if not match:
   extras.append(game.headers.get('White')); continue
  chapter = chapters[int(match[1])-1][0]
  board = game.board()
  concept = any(not n.move for n in game.mainline())
  assert board.is_valid() or concept, (total,board.status())
  frames, current = [], game
  concept = any(not n.move for n in game.mainline())
  while current.variations:
   nxt = current.variations[0]
   branches += max(0,len(current.variations)-1)
   if not nxt.move:
    assert concept; break
   assert nxt.move in board.legal_moves, (total,nxt.move)
   before, san, uci = board.fen(), board.san(nxt.move), nxt.move.uci()
   board.push(nxt.move)
   frames.append({'fen':before,'san':san,'uci':uci,'afterFen':board.fen(),'note':clean(nxt.comment)})
   current = nxt; nodes += 1
  number = 1+sum(e['chapter']==chapter for e in pack['examples'])
  pack['examples'].append({'id':f'ashley-v1-{chapter}-{number:02d}','chapter':chapter,'number':number,'title':game.headers.get('Black','Example'), 'fen':game.board().fen(), 'note':clean(game.comment), 'frames':frames,'kind':'concept' if concept or not frames else 'line','learner':game.board().turn and 'w' or 'b'})
assert total==228 and len(pack['examples'])==224
destination.parent.mkdir(parents=True,exist_ok=True)
destination.write_text('/* Private study pack derived from the user-owned PGN. Original annotations credited to GM Maurice Ashley. */\nconst GEOMETRY_COURSE='+json.dumps(pack,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
report={'sourceSha256':pack['sourceSha256'],'inputRecords':total,'chapterExamples':len(pack['examples']),'chapters':len(chapters),'playableLines':sum(e['kind']=='line' for e in pack['examples']),'conceptDiagrams':sum(e['kind']=='concept' for e in pack['examples']),'legalMainlinePlies':nodes,'excludedNonChapterRecords':extras,'structuredSideBranchesNotIncluded':branches,'nullMovesAreNotDrills':True}
destination.with_suffix('.audit.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report,indent=2))

