/*
 現在の盤面の状態を描画する処理
 */
var canvas = document.getElementById( 'main_c' );  // キャンバス
var ctx = canvas.getContext( '2d' ); // コンテクスト

var canvas_h = document.getElementById( 'hold_c' );  // キャンバス
var ctx_h = canvas_h.getContext( '2d' ); // コンテクスト


var W = 300, H = 600;  // キャンバスのサイズ
var BLOCK_W = W / COLS, BLOCK_H = H / ROWS;  // マスの幅を設定

// x, yの部分へマスを描画する処理
function drawBlock( x, y ) {
  ctx.fillRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
  ctx.strokeRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
}
function drawBlockH( x, y ) {
  ctx_h.fillRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
  ctx_h.strokeRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
}


// 盤面と操作ブロックを描画する
function render() {
  ctx.clearRect( 0, 0, W, H );  // 一度キャンバスを真っさらにする
  ctx.strokeStyle = 'black';  // えんぴつの色を黒にする

  // 盤面を描画する
  for ( var x = 0; x < COLS; ++x ) {
    for ( var y = 0; y < ROWS; ++y ) {
      if ( board[ y ][ x ] ) {  // マスが空、つまり0ゃなかったら
        ctx.fillStyle = colors[ board[ y ][ x ] - 1 ];  // マスの種類に合わせて塗りつぶす色を設定
        drawBlock( x, y );  // マスを描画
      }
    }
  }

  // 操作ブロックを描画する
  for ( var y = 0; y < 4; ++y ) {
    for ( var x = 0; x < 4; ++x ) {
      if ( current[ y ][ x ] ) {
        ctx.fillStyle = colors[ current[ y ][ x ] - 1 ];  // マスの種類に合わせて塗りつぶす色を設定
        drawBlock( currentX + x, currentY + y );  // マスを描画
      }
    }
  }
  if(lose){
      ctx.fillStyle = 'black';
      ctx.font='50px gothic';
      ctx.fillText('GAME OVER',0,200);
      ctx.font='30px gothic';
      ctx.fillText('Enter To Continue.',0,300);
  }
  // ctx.strokeRect(currentX*30,currentY*30,120,120); //Debug

  ctx_h.clearRect( 0, 0, 120, 120 );  // 一度キャンバスを真っさらにする
  for ( var y = 0; y < 4; ++y ) {
    for ( var x = 0; x < 4; ++x ) {
      if ( hold_space[ y ][ x ] ) {
        ctx_h.fillStyle = colors[ hold_space[ y ][ x ] - 1 ];  // マスの種類に合わせて塗りつぶす色を設定
        drawBlockH( x, y );  // マスを描画
      }
    }
  }
}

// 30ミリ秒ごとに状態を描画する関数を呼び出す
setInterval( render, 30 );
