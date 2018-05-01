var COLS = 10, ROWS = 20;  // 盤面のマスの数
var board = [];  // 盤面の状態を保持する変数
var lose;  // 一番うえまで積み重なっちゃったフラグ
var interval;  // ゲームタイマー保持用変数
var current; // 現在操作しているブロック
var currentX, currentY; // 現在操作しているブロックのいち
var score;
var holded;
var hold_used;
var shuffle;
// ブロックのパターン
var shapes = [
    [
        [ 0, 0, 1, 0 ],
        [ 0, 0, 1, 0 ],
        [ 0, 0, 1, 0 ],
        [ 0, 0, 1, 0 ],
    ],
    [
        [ 0, 0, 0, 0 ],
        [ 0, 1, 1, 1 ],
        [ 0, 1, 0, 0 ],
        [ 0, 0, 0, 0 ],
    ],
    [
        [ 0, 0, 0, 0 ],
        [ 1, 1, 1, 0 ],
        [ 0, 0, 1, 0 ],
        [ 0, 0, 0, 0 ],
    ],
    [
        [ 0, 0, 0, 0 ],
        [ 0, 1, 1, 0 ],
        [ 0, 1, 1, 0 ],
        [ 0, 0, 0, 0 ],
    ],
    [
        [ 0, 0, 0, 0 ],
        [ 1, 1, 0, 0 ],
        [ 0, 1, 1, 0 ],
        [ 0, 0, 0, 0 ],
    ],
    [
        [ 0, 0, 0, 0 ],
        [ 0, 0, 1, 1 ],
        [ 0, 1, 1, 0 ],
        [ 0, 0, 0, 0 ],
    ],
    [
        [ 0, 0, 0, 0 ],
        [ 0, 1, 0, 0 ],
        [ 1, 1, 1, 0 ],
        [ 0, 0, 0, 0 ],
    ],
];
// ブロックの色
var colors = [
  'cyan', 'orange', 'blue', 'yellow', 'red', 'green', 'purple'
];

// shapesからランダムにブロックのパターンを出力し、盤面の一番上へセットする
function newShape() {
  if(shuffle.length==0){
      for(var i=0;i<shapes.length;i++){
          shuffle.push(i);
      }
      console.log(shuffle);
      for(var i=0;i<shapes.length;i++){
          var dest=Math.floor( Math.random() * shapes.length );
          var buf=shuffle[dest];
          shuffle[dest]=shuffle[i];
          shuffle[i]=buf;
      }
      console.log(shuffle);
  }

  var id = shuffle[0];  // ランダムにインデックスを出す
  shuffle.shift();
  var shape = shapes[ id ];
  // パターンを操作ブロックへセットする
  current=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],];
  for ( var y = 0; y < 4; ++y ) {
    for ( var x = 0; x < 4; ++x ) {
      if ( shape[y][x] ) {
        current[ y ][ x ] = id + 1;
      }
    }
  }
  // ブロックを盤面の上のほうにセットする
  currentX = 5;
  currentY = 0;
}

// 盤面を空にする
function init() {
  for ( var y = 0; y < ROWS; ++y ) {
    board[ y ] = [];
    for ( var x = 0; x < COLS; ++x ) {
      board[ y ][ x ] = 0;
    }
  }
  hold_space=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],];
}

function hold() {
    if(hold_used)return;
    if(holded){
        var buf=current;
        current=hold_space;
        hold_space=buf;
    }else{
        hold_space=current;
        newShape();
    }
    hold_used=true;
}

// newGameで指定した秒数毎に呼び出される関数。
// 操作ブロックを下の方へ動かし、
// 操作ブロックが着地したら消去処理、ゲームオーバー判定を行う
function tick() {
    document.getElementById('score').innerHTML=score.toString();
  // １つ下へ移動する
  if(lose)return false;
  if ( valid( 0, 1 ) ) {
    ++currentY;
  }
  // もし着地していたら(１つしたにブロックがあったら)
  else {
    freeze();  // 操作ブロックを盤面へ固定する
    clearLines();  // ライン消去処理
    // 新しい操作ブロックをセットする
    newShape();
  }
}

// 操作ブロックを盤面にセットする関数
function freeze() {
  for ( var y = 0; y < 4; ++y ) {
    for ( var x = 0; x < 4; ++x ) {
      if ( current[ y ][ x ] ) {
        board[ y + currentY ][ x + currentX ] = current[ y ][ x ];
      }
    }
  }
  hold_used=false;
}

// 操作ブロックを回す処理
function rotate( current ) {
  var newCurrent = [];
  for ( var y = 0; y < 4; ++y ) {
    newCurrent[ y ] = [];
    for ( var x = 0; x < 4; ++x ) {
      newCurrent[ y ][ x ] = current[ 3 - x ][ y ];
    }
  }
  return newCurrent;
}

// 一行が揃っているか調べ、揃っていたらそれらを消す
function clearLines() {
  for ( var y = ROWS - 1; y >= 0; --y ) {
    var rowFilled = true;
    // 一行が揃っているか調べる
    for ( var x = 0; x < COLS; ++x ) {
      if ( board[ y ][ x ] == 0 ) {
        rowFilled = false;
        break;
      }
    }
    var combo=0;
    // もし一行揃っていたら, サウンドを鳴らしてそれらを消す。
    if ( rowFilled ) {
      document.getElementById( 'clearsound' ).play();  // 消滅サウンドを鳴らす
      // その上にあったブロックを一つずつ落としていく
      for ( var yy = y; yy > 0; --yy ) {
        for ( var x = 0; x < COLS; ++x ) {
          board[ yy ][ x ] = board[ yy - 1 ][ x ];
        }
      }
      ++y;  // 一行落としたのでチェック処理を一つ下へ送る
      combo++;
    }
    score+=[0,1,4,9,100][combo];
  }
}


// キーボードが押された時に呼び出される関数
function keyPress( key ) {
  switch ( key ) {
  case 65: // A
    if ( valid( -1 ) ) {
      --currentX;  // 左に一つずらす
    }
    break;
  case 68: // D
    if ( valid( 1 ) ) {
      ++currentX;  // 右に一つずらす
    }
    break;
  case 83: //S
    if ( valid( 0, 1 ) ) {
      ++currentY;  // 下に一つずらす
    }
    break;
  case 16:
    hold();
    break;
  case 87: // W
    // 操作ブロックを回す
    var rotated = rotate( current );
    if ( valid( 0, 0, rotated ) ) {
      current = rotated;  // 回せる場合は回したあとの状態に操作ブロックをセットする
    }
    break;
  case 13: // Return
    lose=false;
    newGame();
    break;
  }
}

// 指定された方向に、操作ブロックを動かせるかどうかチェックする
// ゲームオーバー判定もここで行う
function valid( offsetX, offsetY, newCurrent ) {
  offsetX = offsetX || 0;
  offsetY = offsetY || 0;
  offsetX = currentX + offsetX;
  offsetY = currentY + offsetY;
  newCurrent = newCurrent || current;
  for ( var y = 0; y < 4; ++y ) {
    for ( var x = 0; x < 4; ++x ) {
      if ( newCurrent[ y ][ x ] ) {
        if(x + offsetX < 0){
              currentX++;
              offsetX++;
              continue;
          }else if(x + offsetX >= COLS ) {
              currentX--;
              offsetX--;
              continue;
          }else if (y + offsetY >= ROWS || board[ y + offsetY ][ x + offsetX ]){
            if (offsetY == 1 && offsetX-currentX == 0 && offsetY-currentY == 1){
                console.log('game over');
                lose = true; // もし操作ブロックが盤面の上にあったらゲームオーバーにする
            }
            return false;
        }
      }
    }
  }
  return true;
}

function newGame() {
  shuffle=[];
  clearInterval(interval);  // ゲームタイマーをクリア
  init();  // 盤面をまっさらにする
  newShape();  // 新しい

  lose = false;
  score=0;
  hold_used=false;
  interval = setInterval( tick, 500 );  // 250ミリ秒ごとにtickという関数を呼び出す
}

newGame();  // ゲームを開始する
