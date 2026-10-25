/* Paired examples differ in one decisive feature; they are practice-only. */
function contrastPair(id, lesson, title, positive, negative, target, question, yes, no, verify, extras={}) {
  return [true,false].map(truth => {
    const pieces=truth?positive:negative;
    const exercise=lessonExercise(lesson,'contrast-'+id+'-'+truth,title,pieces,target,question+' Choose a verdict, then tap the target.',truth?yes:no,[],{
      mode:'pattern_or_illusion',responseType:'verdict_and_square',isTruePattern:truth,correctOption:truth?'real':'illusion',
      contrastFamily:id,contrastVerifier:verify,activity:'illusion',errorKind:extras.errorKind || 'premature_recognition',...extras
    });
    const game=new Chess(exercise.fen), piece=game.get(target);
    const attackers=game.attackers(target,'w'), defenders=piece?game.attackers(target,piece.color):[];
    exercise.overlay.arrows=attackers.filter(from=>game.get(from)?.color!==piece?.color).map(from=>A(from,target));
    if(truth && verify.kind==='support') exercise.overlay.arrows=game.attackers(target,'w').map(from=>A(from,target,'defense'));
    if(extras.afterMove) {
      const after=new Chess(exercise.fen);after.move(extras.afterMove);exercise.afterFen=after.fen();exercise.moveSan=extras.afterMove;
      exercise.overlay.arrows=[A('e4','c5','move'),A('e1','e7',truth?'attack':'blocked')];
    }
    return exercise;
  });
}
const CONTRAST_EXERCISES = [
  ...contrastPair('loose','pressure','Undefended or protected?',{g1:'K',h8:'k',a1:'R',a5:'n'},{g1:'K',h8:'k',a1:'R',a5:'n',b6:'p'},'a5','Is the attacked knight on a5 undefended?','The knight is attacked down the a-file and has no defender.','The b6 pawn defends a5. The rook attack is real, but the knight is not undefended.',{kind:'undefended',target:'a5',color:'b'},{errorKind:'missed_defender'}),
  ...contrastPair('bishop-line','board','Clear or interrupted diagonal?',{g1:'K',h8:'k',b2:'B',f6:'q'},{g1:'K',h8:'k',b2:'B',f6:'q',d4:'p'},'f6','Does the bishop directly attack the queen?','b2–c3–d4–e5–f6 is clear.','The d4 pawn interrupts the diagonal; the bishop does not currently attack f6.',{kind:'attack',from:'b2',target:'f6',color:'w'},{errorKind:'blocked_ray'}),
  ...contrastPair('rook-line','board','Clear or interrupted file?',{g1:'K',h8:'k',e1:'R',e7:'q'},{g1:'K',h8:'k',e1:'R',e7:'q',e4:'P'},'e7','Does the rook directly attack the queen?','The e-file is clear from e1 to e7.','The white pawn on e4 blocks its own rook’s attack.',{kind:'attack',from:'e1',target:'e7',color:'w'},{errorKind:'blocked_ray'}),
  ...contrastPair('knight','board','Jump or visual illusion?',{a1:'K',h8:'k',d4:'N',f5:'r'},{a1:'K',h8:'k',d3:'N',f5:'r'},'f5','Does the white knight attack the rook on f5?','d4–f5 is a two-file, one-rank knight jump.','d3–f5 is a two-file, two-rank change, which is not a knight move.',{kind:'attack',fromType:'n',target:'f5',color:'w'}),
  ...contrastPair('pin','alignment','Pin or second blocker?',{a1:'K',e8:'k',e7:'r',e1:'R'},{a1:'K',e8:'k',e7:'r',e1:'R',e5:'p'},'e7','Is the black rook absolutely pinned to its king by the white rook?','The e7 rook is the only blocker between e1 and the king on e8.','The e5 pawn remains as another blocker, so moving e7 sideways would not expose this rook’s check.',{kind:'pin',target:'e7',color:'b'},{errorKind:'blocked_ray'}),
  ...contrastPair('fork','forks','Clean or guarded fork square?',{g1:'K',e8:'k',a8:'r',d5:'N'},{g1:'K',e8:'k',a8:'r',d5:'N',b8:'q'},'c7','After Nc7, is the knight’s landing square free of black defenders?','The jump is legal and c7 has no black geometric defender in this study diagram.','The b8 queen guards c7. A geometric fork is not automatically a safe fork.',{kind:'fork',from:'d5',target:'c7'},{errorKind:'false_fork'}),
  ...contrastPair('discovery','change','Does the line really open?',{g1:'K',h8:'k',e1:'R',e4:'N',e7:'q'},{g1:'K',h8:'k',e1:'R',e4:'N',e7:'q',e6:'p'},'e7','After Nc5, will the rook directly attack the queen on e7?','Vacating e4 opens the entire rook line to e7.','Vacating e4 is not enough: the pawn on e6 still blocks the e-file.',{kind:'afterAttack',from:'e1',target:'e7',color:'w'},{afterMove:'Nc5',errorKind:'failed_transformation'}),
  ...contrastPair('pawn-support','pressure','Real pawn support?',{a1:'K',h8:'k',d4:'N',e3:'P'},{a1:'K',h8:'k',d4:'N',e2:'P'},'d4','Does the white pawn protect the knight?','The e3 pawn attacks d4.','A pawn on e2 attacks d3 and f3, not d4.',{kind:'support',target:'d4',color:'w'},{errorKind:'missed_defender'}),
  ...contrastPair('king-space','king','Is the escape square controlled?',{a1:'K',g8:'k',c4:'B'},{a1:'K',g8:'k',b4:'B'},'f7','Does the white bishop control the king’s adjacent square f7?','The c4 bishop reaches f7 through d5 and e6.','The b4 bishop is not on a diagonal to f7.',{kind:'attack',fromType:'b',target:'f7',color:'w'}),
  ...contrastPair('outpost','positional','Supported or merely central?',{a1:'K',h8:'k',d5:'N',e4:'P'},{a1:'K',h8:'k',d5:'N',e3:'P'},'d5','Is the knight on d5 supported by the white pawn?','The e4 pawn protects d5.','The e3 pawn protects d4 and f4. A central knight is not automatically pawn-supported.',{kind:'support',target:'d5',color:'w'}),
  ...contrastPair('overload','helpers','One duty or two?',{a1:'K',h8:'k',e5:'q',b5:'r',e2:'b'},{a1:'K',h8:'k',e5:'q',b5:'r',e2:'b',e4:'p'},'e5','Does the queen directly defend both the rook on b5 and bishop on e2?','The queen on e5 connects to b5 along the rank and e2 along the file.','The pawn on e4 interrupts the queen’s line to e2.',{kind:'twoDuties',from:'e5',targets:['b5','e2'],color:'b'},{errorKind:'blocked_ray'}),
  ...contrastPair('passed','pawns','Passed or challenged?',{a1:'K',h8:'k',e5:'P',a6:'p'},{a1:'K',h8:'k',e5:'P',a6:'p',d6:'p'},'e5','Is White’s e5 pawn a passed pawn?','No enemy pawn lies ahead on d-, e- or f-files.','The black pawn on d6 is ahead on an adjacent file; e5 is not passed.',{kind:'passed',target:'e5',color:'w'}),
  ...contrastPair('opposition','endgames','Direct opposition?',{e4:'K',e6:'k'},{e4:'K',f6:'k'},'e5','Are the kings facing each other in direct opposition along a file?','e5 is the single square between e4 and e6.','The kings on e4 and f6 are not aligned on one file.',{kind:'opposition'}),
  ...contrastPair('reply','routine','Can the king capture the checking rook?',{a1:'K',h8:'k',h7:'R'},{a1:'K',h8:'k',h7:'R',g6:'B'},'h7','Can the black king legally capture the rook on h7?','The rook is undefended, so Kxh7 is legal.','The bishop on g6 protects h7; the king may not move onto that attacked square.',{kind:'legalCapture',from:'h8',target:'h7'},{turn:'b',errorKind:'premature_recognition'})
];
