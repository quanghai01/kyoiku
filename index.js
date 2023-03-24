(function (cjs, an) {
    var p; // shortcut to reference prototypes
    var lib = {};
    var ss = {};
    var img = {};
    lib.ssMetadata = [
        {
            name: "index_atlas_",
            frames: [
                [212, 962, 107, 107],
                [1282, 882, 99, 61], // page1
                [0, 1023, 107, 107], // 2
                [109, 1023, 99, 61], // page2
                [321, 962, 107, 107], // 3
                [1302, 945, 99, 61], // page3
                [430, 962, 107, 107], // 4
                [539, 962, 107, 107], // 5
                [648, 962, 107, 107], // 6
                [757, 962, 107, 107], // 7
                [866, 962, 107, 107], // 8
                [975, 962, 107, 107], // 9
                [1383, 882, 41, 53], // back
                [1084, 962, 107, 107], // 1M
                [1193, 962, 107, 107], // 2M
                [1282, 119, 107, 107], // 3M
                [1282, 228, 107, 107], // 4M
                [1282, 337, 107, 107], // 5M
                [1282, 446, 107, 107], // 6M
                [1282, 555, 107, 107], // 7 M
                [1282, 664, 107, 107], // 8M
                [1282, 773, 107, 107], // 9M
                [1391, 119, 41, 53], // next
                // [0,0,1280,960], //bg
                [0, 190, 900, 700], // bg

                [1282, 0, 117, 117], // box
                [0, 962, 210, 59],
            ],
        }, // button
    ];
    lib.properties = {
        id: "2E73D8B679F51B408FC46E9A889943BF",
        width: 1480,
        height: 960,
        fps: 30,
        color: "#FFFFFF",
        opacity: 1.0,
        manifest: [{ src: "images/index_atlas_.png?1577584826102", id: "index_atlas_" }],
        preloads: [],
    };

    // symbols:

    (lib._1 = function () {
        this.initialize(ss.index_atlas_);
        this.gotoAndStop(0);
    }).prototype = p = new cjs.Sprite();

    (lib._1_3 = function () {
        this.initialize(ss.index_atlas_);
        this.gotoAndStop(1);
    }).prototype = p = new cjs.Sprite();

    (lib._2 = function () {
        this.initialize(ss.index_atlas_);
        this.gotoAndStop(2);
    }).prototype = p = new cjs.Sprite();

    (lib._2_3 = function () {
        this.initialize(ss.index_atlas_);
        this.gotoAndStop(3);
    }).prototype = p = new cjs.Sprite();

    (lib._3 = function () {
        this.initialize(ss.index_atlas_);
        this.gotoAndStop(4);
    }).prototype = p = new cjs.Sprite();

    (lib._3_3 = function () {
        this.initialize(ss.index_atlas_);
        this.gotoAndStop(5);
    }).prototype = p = new cjs.Sprite();

    (lib._4 = function () {
        this.initialize(ss.index_atlas_);
        this.gotoAndStop(6);
    }).prototype = p = new cjs.Sprite();

    (lib._5 = function () {
        this.initialize(ss.index_atlas_);
        this.gotoAndStop(7);
    }).prototype = p = new cjs.Sprite();

    (lib._6 = function () {
        this.initialize(ss.index_atlas_);
        this.gotoAndStop(8);
    }).prototype = p = new cjs.Sprite();

    (lib._7 = function () {
        this.initialize(ss.index_atlas_);
        this.gotoAndStop(9);
    }).prototype = p = new cjs.Sprite();

    (lib._8 = function () {
        this.initialize(ss.index_atlas_);
        this.gotoAndStop(10);
    }).prototype = p = new cjs.Sprite();

    (lib._9 = function () {
        this.initialize(ss.index_atlas_);
        this.gotoAndStop(11);
    }).prototype = p = new cjs.Sprite();

    (lib.back_b = function () {
        this.initialize(ss.index_atlas_);
        this.gotoAndStop(12);
    }).prototype = p = new cjs.Sprite();

    (lib.gray_1 = function () {
        this.initialize(ss.index_atlas_);
        this.gotoAndStop(13);
    }).prototype = p = new cjs.Sprite();

    (lib.gray_2 = function () {
        this.initialize(ss.index_atlas_);
        this.gotoAndStop(14);
    }).prototype = p = new cjs.Sprite();

    (lib.gray_3 = function () {
        this.initialize(ss.index_atlas_);
        this.gotoAndStop(15);
    }).prototype = p = new cjs.Sprite();

    (lib.gray_4 = function () {
        this.initialize(ss.index_atlas_);
        this.gotoAndStop(16);
    }).prototype = p = new cjs.Sprite();

    (lib.gray_5 = function () {
        this.initialize(ss.index_atlas_);
        this.gotoAndStop(17);
    }).prototype = p = new cjs.Sprite();

    (lib.gray_6 = function () {
        this.initialize(ss.index_atlas_);
        this.gotoAndStop(18);
    }).prototype = p = new cjs.Sprite();

    (lib.gray_7 = function () {
        this.initialize(ss.index_atlas_);
        this.gotoAndStop(19);
    }).prototype = p = new cjs.Sprite();

    (lib.gray_8 = function () {
        this.initialize(ss.index_atlas_);
        this.gotoAndStop(20);
    }).prototype = p = new cjs.Sprite();

    (lib.gray_9 = function () {
        this.initialize(ss.index_atlas_);
        this.gotoAndStop(21);
    }).prototype = p = new cjs.Sprite();

    (lib.next_b = function () {
        this.initialize(ss.index_atlas_);
        this.gotoAndStop(22);
    }).prototype = p = new cjs.Sprite();

    (lib.S336 = function () {
        this.initialize(ss.index_atlas_);
        this.gotoAndStop(23);
    }).prototype = p = new cjs.Sprite();

    (lib.waku = function () {
        this.initialize(ss.index_atlas_);
        this.gotoAndStop(24);
    }).prototype = p = new cjs.Sprite();

    (lib.yarinaosi_b = function () {
        this.initialize(ss.index_atlas_);
        this.gotoAndStop(25);
    }).prototype = p = new cjs.Sprite();
    // helper functions:

    function mc_symbol_clone() {
        var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop));
        clone.gotoAndStop(this.currentFrame);
        clone.paused = this.paused;
        clone.framerate = this.framerate;

        return clone;
    }

    function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
        var prototype = cjs.extend(symbol, cjs.MovieClip);
        prototype.clone = mc_symbol_clone;
        prototype.nominalBounds = nominalBounds;
        prototype.frameBounds = frameBounds;

        return prototype;
    }

    (lib.mc_page3 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // レイヤー_1
        this.instance = new lib._3_3();
        this.instance.setTransform(-49.5, -30.5);

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

        this._renderFirstFrame();
    }).prototype = getMCSymbolPrototype(lib.mc_page3, new cjs.Rectangle(-49.5, -30.5, 99, 61), null);

    (lib.mc_page2 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // レイヤー_1
        this.instance = new lib._2_3();
        this.instance.setTransform(-49.5, -30.5);

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

        this._renderFirstFrame();
    }).prototype = getMCSymbolPrototype(lib.mc_page2, new cjs.Rectangle(-49.5, -30.5, 99, 61), null);

    (lib.mc_page1 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // レイヤー_1
        this.instance = new lib._1_3();
        this.instance.setTransform(-49.5, -30.5);

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

        this._renderFirstFrame();
    }).prototype = getMCSymbolPrototype(lib.mc_page1, new cjs.Rectangle(-49.5, -30.5, 99, 61), null);

    (lib.mc_next = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // レイヤー_1
        this.instance = new lib.next_b();
        this.instance.setTransform(-21, -27);

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

        this._renderFirstFrame();
    }).prototype = getMCSymbolPrototype(lib.mc_next, new cjs.Rectangle(-21, -27, 41, 53), null);

    (lib.mc_g9 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // レイヤー_1
        this.instance = new lib.gray_9();
        this.instance.setTransform(-53.5, -53.5);

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

        this._renderFirstFrame();
    }).prototype = getMCSymbolPrototype(lib.mc_g9, new cjs.Rectangle(-53.5, -53.5, 107, 107), null);

    (lib.mc_g8 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // レイヤー_1
        this.instance = new lib.gray_8();
        this.instance.setTransform(-53.5, -53.5);

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

        this._renderFirstFrame();
    }).prototype = getMCSymbolPrototype(lib.mc_g8, new cjs.Rectangle(-53.5, -53.5, 107, 107), null);

    (lib.mc_g7 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // レイヤー_1
        this.instance = new lib.gray_7();
        this.instance.setTransform(-53.5, -53.5);

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

        this._renderFirstFrame();
    }).prototype = getMCSymbolPrototype(lib.mc_g7, new cjs.Rectangle(-53.5, -53.5, 107, 107), null);

    (lib.mc_g6 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // レイヤー_1
        this.instance = new lib.gray_6();
        this.instance.setTransform(-53.5, -53.5);

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

        this._renderFirstFrame();
    }).prototype = getMCSymbolPrototype(lib.mc_g6, new cjs.Rectangle(-53.5, -53.5, 107, 107), null);

    (lib.mc_g5 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // レイヤー_1
        this.instance = new lib.gray_5();
        this.instance.setTransform(-53.5, -53.5);

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

        this._renderFirstFrame();
    }).prototype = getMCSymbolPrototype(lib.mc_g5, new cjs.Rectangle(-53.5, -53.5, 107, 107), null);

    (lib.mc_g4 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // レイヤー_1
        this.instance = new lib.gray_4();
        this.instance.setTransform(-53.5, -53.5);

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

        this._renderFirstFrame();
    }).prototype = getMCSymbolPrototype(lib.mc_g4, new cjs.Rectangle(-53.5, -53.5, 107, 107), null);

    (lib.mc_g3 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // レイヤー_1
        this.instance = new lib.gray_3();
        this.instance.setTransform(-53.5, -53.5);

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

        this._renderFirstFrame();
    }).prototype = getMCSymbolPrototype(lib.mc_g3, new cjs.Rectangle(-53.5, -53.5, 107, 107), null);

    (lib.mc_g2 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // レイヤー_1
        this.instance = new lib.gray_2();
        this.instance.setTransform(-53.5, -53.5);

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

        this._renderFirstFrame();
    }).prototype = getMCSymbolPrototype(lib.mc_g2, new cjs.Rectangle(-53.5, -53.5, 107, 107), null);

    (lib.mc_g1 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // レイヤー_1
        this.instance = new lib.gray_1();
        this.instance.setTransform(-53.5, -53.5);

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

        this._renderFirstFrame();
    }).prototype = getMCSymbolPrototype(lib.mc_g1, new cjs.Rectangle(-53.5, -53.5, 107, 107), null);

    (lib.mc_card9 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // レイヤー_1
        this.instance = new lib._9();
        this.instance.setTransform(-53.5, -53.5);

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

        this._renderFirstFrame();
    }).prototype = getMCSymbolPrototype(lib.mc_card9, new cjs.Rectangle(-53.5, -53.5, 107, 107), null);

    (lib.mc_card8 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // レイヤー_1
        this.instance = new lib._8();
        this.instance.setTransform(-53.5, -53.5);

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

        this._renderFirstFrame();
    }).prototype = getMCSymbolPrototype(lib.mc_card8, new cjs.Rectangle(-53.5, -53.5, 107, 107), null);

    (lib.mc_card7 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // レイヤー_1
        this.instance = new lib._7();
        this.instance.setTransform(-53.5, -53.5);

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

        this._renderFirstFrame();
    }).prototype = getMCSymbolPrototype(lib.mc_card7, new cjs.Rectangle(-53.5, -53.5, 107, 107), null);

    (lib.mc_card6 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // レイヤー_1
        this.instance = new lib._6();
        this.instance.setTransform(-53.5, -53.5);

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

        this._renderFirstFrame();
    }).prototype = getMCSymbolPrototype(lib.mc_card6, new cjs.Rectangle(-53.5, -53.5, 107, 107), null);

    (lib.mc_card5 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // レイヤー_1
        this.instance = new lib._5();
        this.instance.setTransform(-53.5, -53.5);

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

        this._renderFirstFrame();
    }).prototype = getMCSymbolPrototype(lib.mc_card5, new cjs.Rectangle(-53.5, -53.5, 107, 107), null);

    (lib.mc_card4 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // レイヤー_1
        this.instance = new lib._4();
        this.instance.setTransform(-53.5, -53.5);

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

        this._renderFirstFrame();
    }).prototype = getMCSymbolPrototype(lib.mc_card4, new cjs.Rectangle(-53.5, -53.5, 107, 107), null);

    (lib.mc_card3 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // レイヤー_1
        this.instance = new lib._3();
        this.instance.setTransform(-53.5, -53.5);

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

        this._renderFirstFrame();
    }).prototype = getMCSymbolPrototype(lib.mc_card3, new cjs.Rectangle(-53.5, -53.5, 107, 107), null);

    (lib.mc_card2 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // レイヤー_1
        this.instance = new lib._2();
        this.instance.setTransform(-53.5, -53.5);

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

        this._renderFirstFrame();
    }).prototype = getMCSymbolPrototype(lib.mc_card2, new cjs.Rectangle(-53.5, -53.5, 107, 107), null);

    (lib.mc_card1 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // レイヤー_1
        this.instance = new lib._1();
        this.instance.setTransform(-53.5, -53.5);

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

        this._renderFirstFrame();
    }).prototype = getMCSymbolPrototype(lib.mc_card1, new cjs.Rectangle(-53.5, -53.5, 107, 107), null);

    (lib.mc_btn1 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // レイヤー_1
        this.instance = new lib.yarinaosi_b();
        this.instance.setTransform(-105, -10);

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

        this._renderFirstFrame();
    }).prototype = getMCSymbolPrototype(lib.mc_btn1, new cjs.Rectangle(-105, -29.5, 210, 59), null);

    (lib.mc_box2 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // レイヤー_1
        this.instance = new lib.waku();
        this.instance.setTransform(-58, -58, 0.9915, 0.9915);

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

        this._renderFirstFrame();
    }).prototype = getMCSymbolPrototype(lib.mc_box2, new cjs.Rectangle(-58, -58, 116, 116), null);

    (lib.mc_back = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // レイヤー_1
        this.instance = new lib.back_b();
        this.instance.setTransform(-21, -27);

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

        this._renderFirstFrame();
    }).prototype = getMCSymbolPrototype(lib.mc_back, new cjs.Rectangle(-21, -27, 41, 53), null);

    // stage content:
    (lib.index = function (mode, startPosition, loop) {
        if (loop == null) {
            loop = false;
        }
        this.initialize(mode, startPosition, loop, {});

        this.isSingleFrame = false;
        // timeline functions:
        this.frame_0 = function () {
            if (this.isSingleFrame) {
                return;
            }
            if (this.totalFrames == 1) {
                this.isSingleFrame = true;
            }
            this.stop();

            if (createjs.Touch.isSupported() == true) {
                // タッチ操作を有効にします。
                createjs.Touch.enable(stage);
            }

            stage.enableMouseOver();

            var dragPointX;
            var dragPointY;
            var currentObj;
            var spin_mc;
            var temp_r;
            var p1;
            var p2;
            var box_total;
            var card_total;
            var hitArea_ary;
            var targetX;
            var targetY;
            var cardPoint1_ary;
            var cardPoint2_ary;
            var cardPoint3_ary;
            var cardPointD_ary;
            var pagePoinAry_ary;
            var page_num;
            var back_mc;
            var next_mc;
            var page1_mc;
            var page2_mc;
            var page3_mc;
            var page_ary;
            var currentPage;
            var homePos_ary;
            var card_ary;
            var currentNum;

            init.bind(this)();
            initCard.bind(this)();

            function init() {
                page_num = 0;

                card_total = 9;
                homePos_ary = new Array();

                for (var k = 0; k < card_total; k++) {
                    var homePos = this[`g${k + 1}`];
                    var area = createEventArea(homePos, false, true, "white", 0.01);
                    homePos_ary.push(area);
                }

                box_total = 3;
                hitArea_ary = new Array();

                for (var i = 0; i < box_total; i++) {
                    var box = this[`box${i + 1}`];
                    var area = createEventArea(box, false, true, "white", 0.01);
                    hitArea_ary.push(area);
                }

                btn1_mc = this.btn1_mc;
                var btn1Area = createEventArea(btn1_mc, true, true, "white", 0.01);
                btn1Area.addEventListener("click", btn1Click.bind(this));

                /// ////////////////////////

                back_mc = this.back_mc;
                backArea = createEventArea(back_mc, true, true, "white", 0.01);
                backArea.addEventListener("click", backClick.bind(this));
                back_mc.visible = false;

                next_mc = this.next_mc;
                nextArea = createEventArea(next_mc, true, true, "white", 0.01);
                nextArea.addEventListener("click", nextClick.bind(this));

                page1_mc = this.page1_mc;
                page2_mc = this.page2_mc;
                page3_mc = this.page3_mc;
                page2_mc.x = page1_mc.x;
                page2_mc.y = page1_mc.y;
                page2_mc.visible = false;
                page3_mc.x = page1_mc.x;
                page3_mc.y = page1_mc.y;
                page3_mc.visible = false;
                page_ary = [page1_mc, page2_mc, page3_mc];
                currentPage = page1_mc;
            }

            function initCard() {
                cardPoint1_ary = new Array();
                cardPoint2_ary = new Array();
                cardPoint3_ary = new Array();

                cardPointD_ary = new Array();

                card_ary = new Array();

                for (var i = 0; i < card_total; i++) {
                    var card = this[`card${i + 1}`];
                    var area = createEventArea(card, true, true, "white", 0.01);
                    area.addEventListener("mousedown", objMouseDown.bind(this));

                    var point = new createjs.Point(card.x, card.y);
                    cardPoint1_ary.push(point);
                    cardPoint2_ary.push(point);
                    cardPoint3_ary.push(point);

                    cardPointD_ary.push(point);

                    card_ary.push(card);
                }

                pagePoinAry_ary = [cardPoint1_ary, cardPoint2_ary, cardPoint3_ary];

                // defaultPos.bind(this)();
            }

            function backClick(evt) {
                if (page_num > 0) {
                    // パレットの切換(プラットフォーム側)
                    changePageCanvas(page_num, page_num - 1);

                    savePage.bind(this)(page_num);
                    page_num--;
                    loadPoint.bind(this)(page_num);

                    currentPage.visible = false;
                    currentPage = page_ary[page_num];
                    currentPage.visible = true;
                    next_mc.visible = true;

                    /*
				if (page_num == 0)
				{
					back_mc.visible = false;
				}
				*/

                    changePage.bind(this)(page_num);
                }
            }

            function nextClick(evt) {
                if (page_num < page_ary.length) {
                    // パレットの切換(プラットフォーム側)
                    changePageCanvas(page_num, page_num + 1);

                    savePage.bind(this)(page_num);
                    page_num++;
                    loadPoint.bind(this)(page_num);

                    currentPage.visible = false;
                    currentPage = page_ary[page_num];
                    currentPage.visible = true;
                    back_mc.visible = true;

                    /*
				if (page_num == page_ary.length - 1)
				{
					next_mc.visible = false;
				}
				*/

                    changePage.bind(this)(page_num);
                }
            }

            function savePage(n) {
                console.log("savePage", n);

                var ary = pagePoinAry_ary[n];

                for (var i = 0; i < card_total; i++) {
                    var card = this[`card${i + 1}`];
                    var point = new createjs.Point(card.x, card.y);
                    ary[i] = point;
                }
            }

            function loadPoint(n) {
                console.log("loadPoint", n);

                var ary = pagePoinAry_ary[n];

                for (var i = 0; i < card_total; i++) {
                    var card = this[`card${i + 1}`];
                    card.x = ary[i].x;
                    card.y = ary[i].y;
                }
            }

            function changePage(n) {
                console.log("changePage", n);

                for (var i = 0; i < page_ary.length; i++) {
                    var mc = page_ary[i];
                    mc.visible = false;
                }

                if (n == 0) {
                    back_mc.visible = false;
                    next_mc.visible = true;
                } else if (n == page_ary.length - 1) {
                    back_mc.visible = true;
                    next_mc.visible = false;
                }

                page_ary[n].visible = true;
            }

            function btn1Click(evt) {
                var ary = pagePoinAry_ary[page_num];
                for (var i = 0; i < card_total; i++) {
                    var card = this[`card${i + 1}`];
                    var point = cardPointD_ary[i];

                    card.x = point.x;
                    card.y = point.y;

                    ary[i] = point;
                }
            }

            function defaultPos() {
                for (var i = 0; i < 4; i++) {
                    var card = this[`card${i + 1}`];
                    var box = hitArea_ary[i].parent;
                    card.x = box.x;
                    card.y = box.y;
                }
            }

            /// ////////////////////////////////////////////////
            //	ドラッグアンドドロップ（汎用）
            /// ////////////////////////////////////////////////

            function objMouseDown(evt) {
                console.log("objMouseDown");

                currentObj = evt.target.parent;

                currentNum = card_ary.indexOf(currentObj);
                console.log("currentNum", currentNum);

                this.setChildIndex(currentObj, this.numChildren - 1);

                p1 = exportRoot.globalToLocal(stage.mouseX, stage.mouseY);
                dragPointX = p1.x - currentObj.x;
                dragPointY = p1.y - currentObj.y;

                evt.target.addEventListener("pressmove", objfHandleMove.bind(this));
                evt.target.addEventListener("pressup", objfHandleUp.bind(this));
            }

            function objfHandleMove(evt) {
                console.log("objfHandleMove");

                p1 = exportRoot.globalToLocal(stage.mouseX, stage.mouseY);

                if (currentObj.x >= 0 && currentObj.x <= canvas.clientWidth && currentObj.y >= 0 && currentObj.y <= canvas.clientHeight) {
                    currentObj.x = p1.x - dragPointX;
                    currentObj.y = p1.y - dragPointY;
                }

                if (currentObj.x < 0) {
                    currentObj.x = 0;
                } else if (currentObj.x > canvas.clientWidth) {
                    currentObj.x = canvas.clientWidth;
                }

                if (currentObj.y < 0) {
                    currentObj.y = 0;
                } else if (currentObj.y > canvas.clientHeight) {
                    currentObj.y = canvas.clientHeight;
                }
            }

            function objfHandleUp(evt) {
                console.log("objfHandleUp");

                var isHit;

                for (var i = 0; i < hitArea_ary.length; i++) {
                    hitArea = hitArea_ary[i];

                    var point = evt.target.parent.localToLocal(0, 0, hitArea);
                    isHit = hitArea.hitTest(point.x, point.y);

                    if (isHit) {
                        console.log("isHit", i);
                        evt.target.parent.x = hitArea.parent.x;
                        evt.target.parent.y = hitArea.parent.y;

                        // evt.target.removeAllEventListeners("mousedown", objMouseDown);
                    }
                }

                var isHome;
                var homePos = homePos_ary[currentNum];
                console.log("homePos", homePos);
                point = evt.target.parent.localToLocal(0, 0, homePos);
                isHome = homePos.hitTest(point.x, point.y);

                if (isHome) {
                    console.log("isHome", i);
                    evt.target.parent.x = homePos.parent.x;
                    evt.target.parent.y = homePos.parent.y;
                }

                evt.target.removeAllEventListeners("pressmove", objfHandleMove);
                evt.target.removeAllEventListeners("pressup", objfHandleUp);

                stage.update();
            }

            /// ////////////////////////////////////////////////
            //	イベントエリア生成（汎用）
            /// ////////////////////////////////////////////////
            function createEventArea(mc, bool, bool2, str, num) {
                console.log("createEventArea ", mc);

                if (bool2) {
                    x1 = -mc.nominalBounds.width / 2;
                    y1 = -mc.nominalBounds.height / 2;
                } else {
                    x1 = 0;
                    y1 = 0;
                }

                var eArea = new createjs.Shape();
                eArea.graphics.beginFill(str);
                eArea.graphics.drawRect(x1, y1, mc.nominalBounds.width, mc.nominalBounds.height);
                eArea.setBounds(x1, y1, mc.nominalBounds.width, mc.nominalBounds.height);
                eArea.alpha = num;
                eArea.name = "eArea";

                if (bool) {
                    eArea.cursor = "pointer";
                }

                mc.addChild(eArea);

                return eArea;
            }
        };

        // actions tween:
        this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

        // card
        this.card9 = new lib.mc_card9();
        this.card9.setTransform(1164.35, 507.3);

        this.card8 = new lib.mc_card8();
        this.card8.setTransform(1164.35, 381.05);

        this.card7 = new lib.mc_card7();
        this.card7.setTransform(1164.35, 254.8);

        this.card6 = new lib.mc_card6();
        this.card6.setTransform(1164.35, 128.55);

        this.card5 = new lib.mc_card5();
        this.card5.setTransform(1050.25, 633.55);

        this.card4 = new lib.mc_card4();
        this.card4.setTransform(1050.25, 507.3);

        this.card3 = new lib.mc_card3();
        this.card3.setTransform(1050.25, 381.05);

        this.card2 = new lib.mc_card2();
        this.card2.setTransform(1050.25, 254.8);

        this.card1 = new lib.mc_card1();
        this.card1.setTransform(1050.25, 128.55);

        this.timeline.addTween(
            cjs.Tween.get({})
                .to({
                    state: [
                        { t: this.card1 },
                        { t: this.card2 },
                        { t: this.card3 },
                        { t: this.card4 },
                        { t: this.card5 },
                        { t: this.card6 },
                        { t: this.card7 },
                        { t: this.card8 },
                        { t: this.card9 },
                    ],
                })
                .wait(1)
        );

        // gray
        this.g9 = new lib.mc_g9();
        this.g9.setTransform(1164.35, 507.3);

        this.g8 = new lib.mc_g8();
        this.g8.setTransform(1164.35, 381.05);

        this.g7 = new lib.mc_g7();
        this.g7.setTransform(1164.35, 254.8);

        this.g6 = new lib.mc_g6();
        this.g6.setTransform(1164.35, 128.55);

        this.g5 = new lib.mc_g5();
        this.g5.setTransform(1050.25, 633.55);

        this.g4 = new lib.mc_g4();
        this.g4.setTransform(1050.25, 507.3);

        this.g3 = new lib.mc_g3();
        this.g3.setTransform(1050.25, 381.05);

        this.g2 = new lib.mc_g2();
        this.g2.setTransform(1050.25, 254.8);

        this.g1 = new lib.mc_g1();
        this.g1.setTransform(1050.25, 128.55);

        this.timeline.addTween(
            cjs.Tween.get({})
                .to({
                    state: [
                        { t: this.g1 },
                        { t: this.g2 },
                        { t: this.g3 },
                        { t: this.g4 },
                        { t: this.g5 },
                        { t: this.g6 },
                        { t: this.g7 },
                        { t: this.g8 },
                        { t: this.g9 },
                    ],
                })
                .wait(1)
        );

        // box
        this.box3 = new lib.mc_box2();
        this.box3.setTransform(651.1, 576.55 - 180);

        this.box2 = new lib.mc_box2();
        this.box2.setTransform(651.1, 417.1 - 180);

        this.box1 = new lib.mc_box2();
        this.box1.setTransform(489, 417.1 - 180);

        this.timeline.addTween(
            cjs.Tween.get({})
                .to({ state: [{ t: this.box1 }, { t: this.box2 }, { t: this.box3 }] })
                .wait(1)
        );

        // page
        this.page3_mc = new lib.mc_page3();
        this.page3_mc.setTransform(1508, 893);

        this.page2_mc = new lib.mc_page2();
        this.page2_mc.setTransform(1350.5, 892);

        this.page1_mc = new lib.mc_page1();
        this.page1_mc.setTransform(1102.25, 898);

        this.next_mc = new lib.mc_next();
        this.next_mc.setTransform(1179.25, 890.6);

        this.back_mc = new lib.mc_back();
        this.back_mc.setTransform(1024.25, 890.6);

        this.timeline.addTween(
            cjs.Tween.get({})
                .to({ state: [{ t: this.back_mc }, { t: this.next_mc }, { t: this.page1_mc }, { t: this.page2_mc }, { t: this.page3_mc }] })
                .wait(1)
        );

        // btn
        this.btn1_mc = new lib.mc_btn1();
        this.btn1_mc.setTransform(1101.75, 797.6);

        this.timeline.addTween(cjs.Tween.get(this.btn1_mc).wait(1));

        // BG
        this.instance = new lib.S336();
        this.instance.setTransform(0,10);
        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

        this._renderFirstFrame();
    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(640, 480, 917.5, 480);
    // library properties:

    // bootstrap callback support:

    (lib.Stage = function (canvas) {
        createjs.Stage.call(this, canvas);
    }).prototype = p = new createjs.StageGL();

    p.setAutoPlay = function (autoPlay) {
        this.tickEnabled = autoPlay;
    };
    p.play = function () {
        this.tickEnabled = true;
        this.getChildAt(0).gotoAndPlay(this.getTimelinePosition());
    };
    p.stop = function (ms) {
        if (ms) this.seek(ms);
        this.tickEnabled = false;
    };
    p.seek = function (ms) {
        this.tickEnabled = true;
        this.getChildAt(0).gotoAndStop((lib.properties.fps * ms) / 1000);
    };
    p.getDuration = function () {
        return (this.getChildAt(0).totalFrames / lib.properties.fps) * 1000;
    };

    p.getTimelinePosition = function () {
        return (this.getChildAt(0).currentFrame / lib.properties.fps) * 1000;
    };

    an.bootcompsLoaded = an.bootcompsLoaded || [];
    if (!an.bootstrapListeners) {
        an.bootstrapListeners = [];
    }

    an.bootstrapCallback = function (fnCallback) {
        an.bootstrapListeners.push(fnCallback);
        if (an.bootcompsLoaded.length > 0) {
            for (var i = 0; i < an.bootcompsLoaded.length; ++i) {
                fnCallback(an.bootcompsLoaded[i]);
            }
        }
    };

    an.compositions = an.compositions || {};
    an.compositions["2E73D8B679F51B408FC46E9A889943BF"] = {
        getStage: function () {
            return exportRoot.stage;
        },
        getLibrary: function () {
            return lib;
        },
        getSpriteSheet: function () {
            return ss;
        },
        getImages: function () {
            return img;
        },
    };

    an.compositionLoaded = function (id) {
        an.bootcompsLoaded.push(id);
        for (var j = 0; j < an.bootstrapListeners.length; j++) {
            an.bootstrapListeners[j](id);
        }
    };

    an.getComposition = function (id) {
        return an.compositions[id];
    };

    an.makeResponsive = function (isResp, respDim, isScale, scaleType, domContainers) {
        var lastW;
        var lastH;
        var lastS = 1;
        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();
        function resizeCanvas() {
            var w = lib.properties.width;
            var h = lib.properties.height;
            var iw = window.innerWidth;
            var ih = window.innerHeight;
            var pRatio = window.devicePixelRatio || 1;
            var xRatio = iw / w;
            var yRatio = ih / h;
            var sRatio = 1;
            if (isResp) {
                if ((respDim == "width" && lastW == iw) || (respDim == "height" && lastH == ih)) {
                    sRatio = lastS;
                } else if (!isScale) {
                    if (iw < w || ih < h) sRatio = Math.min(xRatio, yRatio);
                } else if (scaleType == 1) {
                    sRatio = Math.min(xRatio, yRatio);
                } else if (scaleType == 2) {
                    sRatio = Math.max(xRatio, yRatio);
                }
            }
            domContainers[0].width = w * pRatio * sRatio;
            domContainers[0].height = h * pRatio * sRatio;
            domContainers.forEach(function (container) {
                container.style.width = `${w * sRatio}px`;
                container.style.height = `${h * sRatio}px`;
            });
            stage.scaleX = pRatio * sRatio;
            stage.scaleY = pRatio * sRatio;
            lastW = iw;
            lastH = ih;
            lastS = sRatio;
            stage.tickOnUpdate = false;
            stage.update();
            stage.tickOnUpdate = true;
        }
    };
})((createjs = createjs || {}), (AdobeAn = AdobeAn || {}));
var createjs;
var AdobeAn;
