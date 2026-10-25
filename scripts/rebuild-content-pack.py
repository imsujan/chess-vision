import csv, hashlib, io, json, pathlib, sys, urllib.request
ROOT = pathlib.Path(__file__).resolve().parents[1]
import chess, zstandard

URL = 'https://database.lichess.org/lichess_db_puzzle.csv.zst'
TARGETS = {False:384, True:96}
counts = {False:0, True:0}
positions, raw_rows, seen_games = [], [], set()
NAME = {chess.PAWN:'pawn',chess.KNIGHT:'knight',chess.BISHOP:'bishop',chess.ROOK:'rook',chess.QUEEN:'queen',chess.KING:'king'}
sq = chess.square_name
def arrow(a,b,kind='attack'): return {'from':sq(a),'to':sq(b),'kind':kind}
def attacks(board, color, target): return sorted(board.attackers(color,target))
def label(board, target):
    piece = board.piece_at(target)
    return ('White ' if piece.color else 'Black ') + NAME[piece.piece_type] + ' on ' + sq(target)

def candidate(row, before, after, number):
    targets=[]
    for target, piece in after.piece_map().items():
        if piece.piece_type == chess.KING: continue
        atk = attacks(after, not piece.color, target); defense = attacks(after,piece.color,target)
        if atk: targets.append((target,atk,defense))
    if not targets: return None
    # A type/color/defense description must identify exactly one piece. Otherwise
    # a correct human response could be unfairly rejected as a different target.
    targets=[t for t in targets if sum(1 for other in targets if after.piece_at(other[0]).piece_type==after.piece_at(t[0]).piece_type and after.piece_at(other[0]).color==after.piece_at(t[0]).color and bool(other[2])==bool(t[2]))==1]
    if not targets: return None
    activity = ['threat_scan','illusion','relationship_trace','before_after','flash','mixed'][number % 6]
    if activity == 'relationship_trace':
        eligible = [t for t in targets if t[2]]
        if not eligible: activity='threat_scan'
        else: targets=eligible
    target, atk, defense = sorted(targets,key=lambda t:(bool(t[2]),t[0]))[number % len(targets)]
    piece=after.piece_at(target)
    text = label(after,target)
    is_loose = not defense
    category = 'hanging_piece' if is_loose else 'protected_illusion'
    mode = 'geometry_xray'
    prompt = 'Find the attacked, undefended piece.' if is_loose else 'Tap the defended target: ' + text + '.'
    lesson='pressure'
    correct=[sq(target)]
    description = text + ' is attacked by ' + ', '.join(map(sq,atk)) + '. ' + ('It has no geometric defender.' if is_loose else 'It is defended by ' + ', '.join(map(sq,defense)) + '.')
    data = dict(id='game-'+row['PuzzleId'],title='Read the relationships',lessonId=lesson,category=category,mode=mode,activity=activity,fen=after.fen(),orientation='w' if after.turn else 'b',responseType='select_square',correctSquares=correct,isTruePattern=is_loose,prompt=prompt,subPrompt='Real-game position · geometric control is not a complete exchange evaluation.',hint='Trace every file, diagonal and knight jump aimed at '+sq(target)+'.',explanation=description,overlay={'arrows':[arrow(a,target) for a in atk]+[arrow(d,target,'defense') for d in defense],'badges':[{'square':sq(target),'role':'target'}],'raySquares':[sq(target)]},source={'provider':'Lichess CC0 puzzle database','puzzleId':row['PuzzleId'],'game':row['GameUrl'],'setupMove':row['Moves'].split()[0]},validation={'target':sq(target),'attackers':list(map(sq,atk)),'defenders':list(map(sq,defense))})
    if activity == 'illusion':
        data.update(mode='pattern_or_illusion',responseType='verdict_and_square',correctOption='real' if is_loose else 'illusion',prompt='Is '+text+' attacked and undefended? Choose a verdict, then tap it.',title='Threat or defended illusion?')
    elif activity == 'relationship_trace':
        data.update(title='Trace attacker → target → defender',prompt='Trace the connection around '+text+'. Select an attacker, then the target, then a defender.',traceSteps=[{'label':'Select an attacker','squares':list(map(sq,atk))},{'label':'Select the target','squares':[sq(target)]},{'label':'Select a defender','squares':list(map(sq,defense))}],correctSquares=list(map(sq,defense)))
    elif activity == 'before_after':
        old_atk=attacks(before,not piece.color,target); old_def=attacks(before,piece.color,target)
        changed = [(t,a,d) for t,a,d in targets if a!=attacks(before,not after.piece_at(t).color,t) or d!=attacks(before,after.piece_at(t).color,t)]
        if changed:
            # This drill asks about a concrete changed connection, not a best move.
            unique_changed=[t for t in changed if sum(1 for other in changed if after.piece_at(other[0]).piece_type==after.piece_at(t[0]).piece_type and after.piece_at(other[0]).color==after.piece_at(t[0]).color)==1]
            if not unique_changed: return None
            t,a,d=unique_changed[0]; p=after.piece_at(t)
            move=chess.Move.from_uci(row['Moves'].split()[0]); san=before.san(move)
            olda=attacks(before,not p.color,t); oldd=attacks(before,p.color,t)
            data.update(mode='before_after',lessonId='change',category='before_after',fen=before.fen(),afterFen=after.fen(),moveSan=san,title='Update the position',prompt='Visualize '+san+'. Find the '+('White ' if p.color else 'Black ')+NAME[p.piece_type]+' whose attack or defense connections change.',correctSquares=[sq(t)],isTruePattern=True,explanation=label(after,t)+': attackers '+(', '.join(map(sq,olda)) or 'none')+' → '+(', '.join(map(sq,a)) or 'none')+'; defenders '+(', '.join(map(sq,oldd)) or 'none')+' → '+(', '.join(map(sq,d)) or 'none')+'. Recheck both the origin and destination of the move.',overlay={'arrows':[arrow(move.from_square,move.to_square,'move')]+[arrow(x,t) for x in a]+[arrow(x,t,'defense') for x in d],'badges':[{'square':sq(t),'role':'target'}],'raySquares':[sq(t)]},validation={'target':sq(t),'attackers':list(map(sq,a)),'defenders':list(map(sq,d))})
            data['subPrompt']='After the move, the requested target is attacked and '+('undefended.' if not d else 'defended. Check the connections that changed.')
        else: data['activity']='mixed'
    elif activity == 'flash':
        data.update(mode='flash_vision',lessonId='memory',title='Remember the relationship',prompt='Remember the attacked '+('undefended ' if is_loose else 'defended ')+('White ' if piece.color else 'Black ')+NAME[piece.piece_type]+'. Tap its square after the pieces hide.',flashDurationMs=5000)
    # For scanning, state the color so another side's target cannot be a valid competing answer.
    if data['activity'] in ['threat_scan','mixed']:
        data['prompt']='Find the attacked, '+('undefended ' if is_loose else 'defended ')+('White ' if piece.color else 'Black ')+NAME[piece.piece_type]+'. Tap the piece after checking its connections.'
    return data

def source_rows():
    cached=ROOT/'evidence/lichess-source-rows.json'
    if cached.exists():
        yield from json.loads(cached.read_text(encoding='utf-8'))
        return
    request=urllib.request.Request(URL,headers={'User-Agent':'ChessVision-offline-content-builder/1.1'})
    with urllib.request.urlopen(request,timeout=120) as response:
        with zstandard.ZstdDecompressor().stream_reader(response) as stream:
            yield from csv.DictReader(io.TextIOWrapper(stream,encoding='utf-8'))

for index,row in enumerate(source_rows()):
    if index>15000: break
    game=row['GameUrl'].split('#')[0].replace('/white','').replace('/black','')
    heldout=int(hashlib.sha256(game.encode()).hexdigest()[:8],16)%5==0
    if counts[heldout]>=TARGETS[heldout] or game in seen_games: continue
    try:
        before=chess.Board(row['FEN'])
        if not before.is_valid(): continue
        moves=[chess.Move.from_uci(m) for m in row['Moves'].split()]
        replay=before.copy()
        for move in moves:
            if move not in replay.legal_moves: raise ValueError('invalid PV')
            replay.push(move)
        after=before.copy(); after.push(moves[0])
        item=candidate(row,before,after,len(positions))
        if not item: continue
        item['assessmentOnly']=heldout
        positions.append(item); raw_rows.append(row); seen_games.add(game); counts[heldout]+=1
    except (ValueError,KeyError,IndexError): continue
    if len(positions)%100==0: print('Validated',len(positions),'real-game positions',flush=True)
    if all(counts[k]>=TARGETS[k] for k in TARGETS): break
if any(counts[k]!=TARGETS[k] for k in TARGETS): raise RuntimeError('Insufficient positions: '+str(counts))
assets=ROOT/'app/src/main/assets'
(assets/'positions.js').write_text('/* Lichess CC0 data; first setup move applied, legal replay checked with python-chess. */\nconst REAL_GAME_EXERCISES = '+json.dumps(positions,separators=(',',':'))+';\n',encoding='utf-8')
(ROOT/'evidence/lichess-source-rows.json').write_text(json.dumps(raw_rows,indent=2),encoding='utf-8')
(ROOT/'evidence/content-provenance.json').write_text(json.dumps({'source':URL,'license':'CC0-1.0','total':len(positions),'practice':counts[False],'assessment':counts[True],'distinctGames':len(seen_games),'validation':'python-chess 1.11.2: legal source FEN, complete supplied PV replay, first setup move applied, target attackers and defenders recorded','selection':'First suitable distinct games from a streamed prefix. This is not a random population sample or a certified best-move curriculum.'},indent=2),encoding='utf-8')
print('Content pack complete:',counts,flush=True)
