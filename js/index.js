$(function() {
    // スライダーの数
    let sliderTotal = 4;

    // 各スライダーのイベント定義
    for (let i = 1; i < sliderTotal+1; i++) {
        (function(){
            let $slider = $("#slider_"+i);
            $slider.slider({
                classes: {
                    "ui-slider-range": "ui-corner-all slider-back"
                },
                orientation: "vertical",    // スライダーの縦横向き
                min: 0,         // スライダーの最小値
                max: 30,        // スライダーの最大値
                step: 1,       // 最小から最大までの1ステップの間隔
                range: "min",   // 最小値からのスライド
                value: 0, // スライダーの値（初期値）
                slide: function(event, ui) {
                    let value = ui.value;
                    if (0 === value) {
                       $slider.find('.slider-back').css({
                           'border-top': 'none',
                           'border-left': 'none',
                           'border-right': 'none',
                       });
                   } else {
                        $slider.find('.slider-back').css({
                           'border-top': 'solid 1px #000000',
                           'border-left': 'solid 1px #000000',
                           'border-right': 'solid 1px #000000',
                       });
                   }
                }
            });
        })();
    }

    let $unitTop = $('#unitTop');
    let $unitMiddle = $('#unitMiddle');
    let $unitBottom = $('#unitBottom');
    let $unit0 = $('#unit0');

    /**
     * テキストボックスへの入力時処理
     */
    $unitBottom.bind('input', function () {
        let val = $(this).val();
        val = val.slice(0, 3);   // 入力制限:3桁まで
        $(this).val(val);
    });

    /**
     * テキストボックスへの入力確定時処理（Canvas上タッチ時に実行）
     * safari等ではinput以外z-indexではcanvasが上のため、フォーカスアウトイベントが走らない
     * @param e 操作イベント
     */
    let onMouseUp = function (e) {
        e.preventDefault(); // デフォルトイベントをキャンセル

        let val = $unitBottom.val();

        if (val !== '') {
            $unitTop.val(val * 3);
            $unitMiddle.val(val * 2);
        } else {
            $unitTop.val('');
            $unitMiddle.val('');
        }

        $unitBottom.blur();
    };
    let canvas = document.getElementById("appCanvas");
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('touchend', onMouseUp, false);


    /**
     * フォントサイズを入力フォームのサイズに合わせて設定
     */
    let setFontSize = function() {
        let fontSize = ($unitBottom.height() - 10) * 0.45;
        $unitTop.css('font-size', fontSize+'px');
        $unitMiddle.css('font-size', fontSize+'px');
        $unitBottom.css('font-size', fontSize+'px');
        $unit0.css('font-size', fontSize+'px');
    };
    setFontSize();
    $(window).resize(setFontSize);

    /**
     * 「やりなおし」ボタンのクリック時処理
     */
    $('#restart').click(function () {
        location.reload();
    });
});

