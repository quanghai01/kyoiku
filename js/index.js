$(function() {
    $("#stage_0").on('contextmenu', function(e) {
        return false;
    });

    // キャンバスのID
    let canvasId = "appCanvas";


    let three = new ThreejsLocal();

    // キャンバス情報
    let canvas = document.getElementById(canvasId);
    let ctx = canvas.getContext("2d");
    let canvasPosition = canvas.getBoundingClientRect();
    let canvasTop = canvasPosition.top;
    let canvasLeft = canvasPosition.left;
    let canvasWidth = canvasPosition.width;
    let canvasHeight = canvasPosition.height;
    // キャンバスのサイズを再設定
    canvas.width  = canvasWidth;
    canvas.height = canvasHeight;

    // threejs初期化
    three.init(canvasPosition);


    // 各ボタンDOM
    let $btns = $('.btn');
    let $restartBtn  = $('#restart');    // 「やりなおし」ボタン
    let openBtnList  = document.getElementById("stage_0").getElementsByClassName("open");
    let closeBtnList = document.getElementById("stage_0").getElementsByClassName("close");

    // ボタン位置を調整
    let btnCssSet = function() {
        let btnWidth = canvasWidth * 0.15;
        let btnHeight = btnWidth / 221 * 68;
        $btns.height(btnHeight).width(btnWidth);
        $restartBtn.css({'bottom': canvasHeight * 0.07,'right': canvasWidth * 0.04});

        let leftOffset = 0;
        $("#stage_0 .open").each(function(index,elm){
            leftOffset = canvasWidth * 0.08*index*3;
            $(elm).css({'left': canvasWidth * 0.08+leftOffset,'bottom': canvasHeight * 0.14})
        })
        $("#stage_0 .close").each(function(index,elm){
            leftOffset = canvasWidth * 0.08*index*3;
            $(elm).css({'left': canvasWidth * 0.08+leftOffset,'bottom': canvasHeight * 0.07})
        })
    };
    btnCssSet();    // 初期実行

    //ひらく,とじる　タッチ中のボタンのindexを格納 すべて未タッチならnull
    let btnTouchFlg = {"open":null,"close":null};

    // 画面リサイズ時（Canvasのレスポンシブ対応）
    let resize = function() {
        // キャンバスの位置、サイズを再取得
        let canvasPosition = canvas.getBoundingClientRect();
        // 変化の倍率を計算
        let scale = canvasPosition.height / canvasHeight;
        // 各設定値を更新
        canvasTop = canvasPosition.top;
        canvasLeft = canvasPosition.left;
        canvasWidth = canvasPosition.width;
        canvasHeight = canvasPosition.height;
        // キャンバスのサイズを再設定
        canvas.width  = canvasWidth;
        canvas.height = canvasHeight;
        //
        // ボタン位置を調整
        btnCssSet();
        //
    };
    $(window).resize(resize);


        /**
     * ボタンのアクティブ状態の切替
     * @param className : string
     * @param index : number
     * @parm flg boolean : true=active add /  false=active remove
     */
    let changeBtnActive = function(className,index,flg) {
        $("#stage_0 ." + className).each(function(i,elm){

            if(i === index){
                if(flg){
                    $(this).addClass('active');
                }
                else{
                    $(this).removeClass('active');
                }
            }
        })
    };
    /**
     * ボタンのアクティブ状態の切替トグル
     * @param className : string
     * @param index : number
     * @return boolean : 変更後の状態を返す
     */
    let changeBtnActiveToggle = function(className,index) {

        let status = false;
        $("#stage_0 ." + className).each(function(i,elm){

            if(i === index){
                if($(this).hasClass('active')){
                    $(this).removeClass('active');
                }
                else{
                    $(this).addClass('active');
                }

                status = $(this).hasClass('active');
            }
        })

        return status;
    };
    /**
     * ボタンのdisabled状態の切り替え
     * @param className : string
     * @param flg : boolean true=add / false=remove
     */
    let changeBtnDisabled = function(className,index,flg) {

        $("#stage_0 ." + className).each(function(i,elm){

            if(i === index){
                if(flg){
                    $(this).addClass('disabled');
                }
                else{
                    $(this).removeClass('disabled');
                }
            }
        })
    }
    let isBtnDisabled = function(className,index){
        let result = false;
        $("#stage_0 ." + className).each(function(i,elm){
            if(i === index){
                result = $(this).hasClass('disabled');
            }
        })
        return result
    }

    /**
     * 「ひらく」ボタンのタッチ時処理
     */
    let onOpenBtnTouchHandler = function(e) {
        if(e.preventDefault){
            e.preventDefault();
        }
        let index = 0;
        for(index =0; index<openBtnList.length; index++){
            if(e.currentTarget == openBtnList[index]){
                    break;
            }
        }

        //タッチ中 indexを格納
        btnTouchFlg["open"] = index;

        //開ききっていないか確認
        let angle = three.getAngle(index);
        if(Math.abs(angle) >= 180 ){
            return;
        }

        let status = changeBtnActiveToggle("open",index);
        if(status){
            three.setAnimationMode(1,index);
        }
        //アニメーション中はline false
        three.setLineDrawFlg(index,false);

        //とじるボタンのdisabled解除
        changeBtnDisabled("close",index,false);

        three.setPlateLineVisible(index,true);
    }
    for(let i =0; i<openBtnList.length; i++){
        openBtnList[i].addEventListener('mousedown', onOpenBtnTouchHandler, false);
        openBtnList[i].addEventListener('touchstart', onOpenBtnTouchHandler, false);
    }
    /**
     * 「ひらく」ボタンのタッチアップ時処理
     */
    let onOpenBtnTouchUpHandler = function(e) {
        if(e.preventDefault){
            e.preventDefault();
        }
        let index = 0;
        for(index =0; index<openBtnList.length; index++){
            if(e.currentTarget == openBtnList[index]){
                    break;
            }
        }

        //タッチ中 を解除
        btnTouchFlg["open"] = null;

        //line visible true
        three.setLineDrawFlg(index,true);

        let angle = three.getAngle(index);
        if(angle >= 180 ){
            changeBtnDisabled("open",index,true);
            return;
        }

        changeBtnActive("open",index,false);
        three.setAnimationMode(0,index);
    }
    for(let i =0; i<openBtnList.length; i++){
        openBtnList[i].addEventListener('mouseup', onOpenBtnTouchUpHandler, false);
        openBtnList[i].addEventListener('touchend', onOpenBtnTouchUpHandler, false);
    }

    /**
     * 「とじる」ボタンのタッチ時処理
     */
    let onCloseBtnTouchHandler = function(e) {
        if(e.preventDefault){
            e.preventDefault();
        }
        let index = 0;
        for(index =0; closeBtnList.length; index++){
            if(e.currentTarget == closeBtnList[index]){
                    break;
            }
        }
        btnTouchFlg["close"] = index;

        let status = changeBtnActiveToggle("close",index);
        if(status){
            three.setAnimationMode(-1,index);
        }
        //アニメーション中はline false
        three.setLineDrawFlg(index,false);
        //ひらくボタンのdisabled解除
        changeBtnDisabled("open",index,false);
    }
    for(let i =0; i<closeBtnList.length; i++){
        closeBtnList[i].addEventListener('mousedown', onCloseBtnTouchHandler, false);
        closeBtnList[i].addEventListener('touchstart', onCloseBtnTouchHandler, false);
    }
    /**
     * 「とじる」ボタンのタッチアップ時処理
     */
    let onCloseBtnTouchUpHandler = function(e) {
        if(e.preventDefault){
            e.preventDefault();
        }
        let index = 0;
        for(index =0; closeBtnList.length; index++){
            if(e.currentTarget == closeBtnList[index]){
                    break;
            }
        }
        btnTouchFlg["close"] = null;
        changeBtnActive("close",index,false);
        three.setAnimationMode(0,index);

        if(isBtnDisabled("close",index)){
            //disabled なら line visible false
            three.setLineDrawFlg(index,false);
        }
        else{
            // line visible true
            three.setLineDrawFlg(index,true);
        }

    }
    for(let i =0; i<closeBtnList.length; i++){
        closeBtnList[i].addEventListener('mouseup', onCloseBtnTouchUpHandler, false);
        closeBtnList[i].addEventListener('touchend', onCloseBtnTouchUpHandler, false);
    }


    /**
     * 「やりなおし」ボタンのクリック時処理
     */
    $restartBtn.click(function () {
        location.reload();
    });
    $restartBtn.on('contextmenu', function(e) {
        return false;
    });



    /**
     * レンダリング処理
     * （「切る」モードや「移動」モード時のみレンダリングを実行する）
     */
    let renderAnimation = null;
    let render = function() {
        three.loop();

        //ひらくボタンdisable
        if(btnTouchFlg["open"] !==null){
            let angle = three.getAngle( btnTouchFlg["open"] );
            if(Math.abs(angle) >= 180 ){
                changeBtnDisabled("open",btnTouchFlg["open"],true);
                changeBtnActive("open",btnTouchFlg["open"],false);
                three.setLineDrawFlg(btnTouchFlg["open"],true);
            }
        }
        //とじるボタンdisable
        if(btnTouchFlg["close"] !==null){
            let angle = three.getAngle( btnTouchFlg["close"] );

            if(angle >= 0 ){
                changeBtnDisabled("close",btnTouchFlg["close"],true);
                changeBtnActive("close",btnTouchFlg["close"],false);
                three.setLineDrawFlg(btnTouchFlg["close"],false);
                three.setPlateLineVisible(btnTouchFlg["close"],false);
            }
        }

        renderAnimation = window.requestAnimationFrame(render);
    };
    render();

});

