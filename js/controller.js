/*
 キーボードを入力した時に一番最初に呼び出される処理
 */
document.body.onkeydown = function( e ) {
    keyPress( e.keyCode );
    // 描画処理を行う
    render();
};
