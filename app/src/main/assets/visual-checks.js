/* Two original, separate visual teaching positions per lesson. Not assessment items. */
const VISUAL_CHECK_BASES = [
  ['board','Find the blocker on c1–h6',{g1:'K',a8:'k',c1:'B',e3:'P',h6:'q'},'e3','c1','h6','blocked','w','The pawn interrupts the diagonal.'],
  ['pressure','Who defends the queen on e5?',{g1:'K',g8:'k',b2:'B',e5:'q',f6:'p'},'f6','f6','e5','defense','b','The pawn protects the queen diagonally.'],
  ['alignment','Find the knight pinned to its king',{g1:'K',e8:'k',e1:'R',e5:'n'},'e5','e1','e8','pin','w','Moving the knight would expose its king.'],
  ['forks','Who guards the c7 fork square?',{g1:'K',e8:'k',b5:'N',a8:'r',c8:'r'},'c8','c8','c7','attack','b','The rook controls the tempting landing square.'],
  ['change','Which piece can uncover the rook’s line?',{g1:'K',g8:'k',e1:'R',e4:'N',e7:'q'},'e4','e1','e7','blocked','w','The knight currently interrupts the file.'],
  ['helpers','Who protects the knight on d5?',{g1:'K',g8:'k',d8:'r',d5:'n',c4:'B'},'d8','d8','d5','defense','b','The rook has a defensive duty on this file.'],
  ['king','Which square beside g8 does the bishop control?',{g1:'K',g8:'k',c4:'B'},'f7','c4','f7','attack','w','The diagonal takes away this escape square.'],
  ['memory','Find the knight’s queen target',{g1:'K',g8:'k',d4:'N',f5:'q'},'f5','d4','f5','attack','w','Remember the knight and queen as one relationship.'],
  ['pawns','Which pawn supports d5?',{g1:'K',g8:'k',c4:'P',d5:'P'},'c4','c4','d5','defense','w','Pawns protect one square diagonally forward.'],
  ['positional','Who supports the knight on d5?',{g1:'K',g8:'k',d5:'N',c4:'P',h7:'p'},'c4','c4','d5','defense','w','Pawn support is one part of an outpost.'],
  ['endgames','Which forward pawn square does its king control?',{e5:'K',g8:'k',f5:'P'},'f6','e5','f6','attack','w','The king supports the pawn’s advance.'],
  ['routine','Which White piece does the b5 pawn attack?',{g1:'K',g8:'k',b5:'p',c4:'B'},'c4','b5','c4','attack','b','Scan the opponent’s threat before your own plan.']
];
function mirroredSquare(square) { return 'hgfedcba'['abcdefgh'.indexOf(square[0])]+square[1]; }
const VISUAL_CHECKS=VISUAL_CHECK_BASES.flatMap(([lessonId,goal,pieces,target,from,to,kind,color,explanation])=>[false,true].map(mirror=>{
  const sq=mirror?mirroredSquare:s=>s;
  const board=Object.fromEntries(Object.entries(pieces).map(([s,p])=>[sq(s),p]));
  return {id:'visual-'+lessonId+'-'+(mirror?2:1),lessonId,goal:mirror?goal.replace(/[a-h][1-8]/g,mirroredSquare):goal,
    fen:diagramFen(board,lessonId==='king'?'b':'w'),correctSquares:[sq(target)],
    assertion:{from:sq(from),to:sq(to),kind,color,blocker:sq(target)},
    arrows:[{from:sq(from),to:kind==='blocked'||kind==='pin'?sq(target):sq(to),kind:kind==='defense'?'defense':kind==='blocked'?'blocked':'attack'},...(['blocked','pin'].includes(kind)?[{from:sq(target),to:sq(to),kind}]:[])],explanation};
}));
