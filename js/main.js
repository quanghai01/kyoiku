
window.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', onResize);  //リサイズ対応
document.oncontextmenu = function () {return false;}
document.addEventListener('touchmove', function(e) {e.preventDefault();}, {passive: false});　//スクロール禁止



// window.addEventListener('mousedown',removePlane)

var CONTENT_W = 1280;
var CONTENT_H = 960;

(function (global, $) {
	"use strict";

	var init = {
		ctrls: function () {
			// 自動リサイズライブラリ呼び出し
			fsi_adjustStageSize(CONTENT_W, CONTENT_H);

			//canvasの論理サイズ調整
			$("#appCanvas").attr("width", CONTENT_W);
			$("#appCanvas").attr("height", CONTENT_H);
		},
		handler: function () {
			$("#txtTestText").val("※共通基盤から受け取ったpostMessageを出力します。");
			$(window).resize(function () {
				// 自動リサイズライブラリ呼び出し
				fsi_adjustStageSize(CONTENT_W, CONTENT_H);

			});

			// iPad対応（ピンチインピンチアウトによる拡大縮小を禁止）
			document.documentElement.addEventListener('touchstart', function (e) {
				if (e.touches.length >= 2) {
					e.preventDefault();
				}
			}, {
				passive: false
			});

			// iPad対応（ダブルタップによる拡大を禁止）
			var t = 0;
			document.documentElement.addEventListener('touchend', function (e) {
				var now = new Date().getTime();
				if ((now - t) < 350) {
					e.preventDefault();
				}
				t = now;
			}, false);

			//iPad対応（ページスクロールを無効にする）
			$(window).on('touchmove.noScroll', function (e) {
				e.preventDefault();
			});

			//背景色変更ボタン押下時
			$("#changeBackColor").click(function () {
				var color = "#ffffff";

				if (nColor > 2) {
					nColor = 0;
				} else {
					nColor++;
				}
				color = arrBColor[nColor];

				$("#contbase").css("background-color", color);
			});

			// 親フレームからのツールバー選択状態情報の受信
			$(window).on('message', function (_evt) {
				var arParam = _evt.originalEvent.data.split("[,]");
				var msg = "";

				//受信したmessageごとの処理
				if (arParam[0] === "FFLCOM_CHANGE_TOOL") {
					//ツール変更（ペン・マーカー, 消しゴム, 図形・スタンプ, ポインター, 付箋の各ボタン押下時）
					msg += "ツール変更ボタンが押されました。" + "\r\n";
					msg += arParam[1] + "\r\n";
					var prop = {};
					if (typeof arParam[2] !== "undefined") {
						msg += arParam[2] + "\r\n";
						prop = JSON.parse(arParam[2]);
					}
					$("#txtTestText").val(msg);
					setCurrentToolInfo(arParam[1], prop);

				} else if (arParam[0] === "FFLCOM_CLEAR") {
					//全消去ボタン押下時
					$("#txtTestText").val("全消去ボタンが押されました。");
					canvasClear();
				} else if (arParam[0] === "FFLCOM_SET_MODE_FINGER") {
					//タッチボタン押下時
					$("#txtTestText").val("タッチボタンが押されました。");
					setModeFinger();
				} else if (arParam[0] === "FFLCOM_ORIGINAL") {
					//オリジナルツールボタン押下時
					msg += "オリジナルツールボタンが押されました。" + "\r\n";
					for (var p = 1; p < arParam.length; p++) {
						if (typeof arParam[p] !== "undefined") {
							msg += arParam[p] + "\r\n";
						}
					}
					$("#txtTestText").val(msg);
				} else if (arParam[0] === "FFLCOM_UNDO") {
					//アンドゥボタン押下時
					$("#txtTestText").val("アンドゥボタンが押されました。");
				} else if (arParam[0] === "FFLCOM_REDO") {
					//リドゥボタン押下時
					$("#txtTestText").val("リドゥボタンが押されました。");
				} else if (arParam[0] === "FFLCOM_MEKURI") {
					//めくりボタン押下時
					$("#txtTestText").val("めくりボタンが押されました。" + "\r\n" + arParam[1]);
				} else if (arParam[0] === "FFLCOM_READING") {
					//朗読ボタン押下時
					$("#txtTestText").val("朗読ボタンが押されました。" + "\r\n" + arParam[1]);
				} else if (arParam[0] === "FFLCOM_CLICKABLE") {
					//クリックポイント表示ボタン押下時
					$("#txtTestText").val("クリックポイント表示ボタンが押されました。" + "\r\n" + arParam[1]);
				} else if (arParam[0] === "FFLCOM_SPREAD") {
					//見開き表示ボタン押下時
					$("#txtTestText").val("見開き表示ボタンが押されました。" + "\r\n" + arParam[1]);
				} else if (arParam[0] === "FFLCOM_SCROLL") {
					//巻物表示ボタン押下時
					$("#txtTestText").val("巻物表示ボタンが押されました。" + "\r\n" + arParam[1]);
				} else if (arParam[0] === "FFLCOM_HIDDEN") {
					//全非表示ボタン押下時
					$("#txtTestText").val("全非表示ボタンが押されました。" + "\r\n" + arParam[1]);
				} else if (arParam[0] === "FFLCOM_SAVEIMAGE") {
					//画像で保存ボタン押下時
					$("#txtTestText").val("画像で保存ボタンが押されました。");
				} else if (arParam[0] === "FFLCOM_GET_LEARNINGREC") {
					//学習記録取得時
					$("#txtTestText").val("学習記録を取得しました。");
					loadLocusLog(JSON.parse(arParam[1]));
				}
			});

			//ツールID callボタン押下時
			$("#callButton").click(function () {
				var id = $("#callText").val();
				window.parent.postMessage("FFLCOM_CALL_SBUTTON" + "[,]" + id, "*");
			});

			//ツール・色選択時
			$(".callChange").change(function () {

				//ツール選択値取得
				var tool = $("#callSelectTool").val();

				//色選択値取得
				var color = $("#callSelectColor").val();

				var id = "";
				var param = {};
				if (tool == TOOL_FINGER) {
					tool = "FFLCOM_TOOL_FINGER";
					param = {
						color: color,
						size: 6,
						opacity: 1.0
					};
				} else if (tool == TOOL_PEN) {
					tool = "FFLCOM_TOOL_PEN";
					param = {
						color: color,
						size: 6,
						opacity: 1.0
					};
				} else if (tool == TOOL_MARKER) {
					tool = "FFLCOM_TOOL_MARKER";
					param = {
						color: color,
						size: 20,
						opacity: 0.5
					};
				} else if (tool == TOOL_ERASER) {
					tool = "FFLCOM_TOOL_ERASER";
					param = {
						color: color,
						size: 6,
						opacity: 1.0
					};
				}

				param = JSON.stringify(param);

				//共通基盤にFFLCOM_CALL_CHANGE_TOOLのpostMessageを送信する
				window.parent.postMessage("FFLCOM_CALL_CHANGE_TOOL" + "[,]" + tool + "[,]" + param, "*");
				window.parent.postMessage("FFLCOM_SET_LEARNING_REC" + "[,]" + JSON.stringify(locusLog), "*");

			});

			//canvasのイベント
			$("#appCanvas").on({
				'mousedown touchstart pointerdown': function (e) {
					e.preventDefault();

					//既に描画中ではない場合
					if (!bDraw) {
						if (toolInfo.tool) {
							bDraw = true;
						}

						//消しゴムの場合
						if (toolInfo.tool == TOOL_ERASER) {
							bDraw = false;
							bErase = true;
							return;
						}

						//マウス座標を取得
						var posP = {
							x: 0,
							y: 0
						};
						if (e.touches && e.touches[0]) {
							posP = {
								x: e.touches[0].clientX,
								y: e.touches[0].clientY
							};
						} else if (e.originalEvent && e.originalEvent.changedTouches && e.originalEvent.changedTouches[0]) {
							posP = {
								x: e.originalEvent.changedTouches[0].clientX,
								y: e.originalEvent.changedTouches[0].clientY
							};
						} else if (e.clientX && e.clientY) {
							posP = {
								x: e.clientX,
								y: e.clientY
							};
						}

						//マウス座標をcanvasの論理座標に変換
						var pos = cnvPosLog2Phys(posP.x, posP.y);
						old_X = pos.x;
						old_Y = pos.y;
					}

				},
				'mouseup mouseout mouseleave touchend touchcancel pointerup': function (e) {
					e.preventDefault();
					
					if (bDraw) {
						//マーカーの場合、このタイミングで記録する
						
						if (toolInfo.tool == TOOL_MARKER) {
							if (!locusLog[locusCnt]) {
								locusLog[locusCnt] = [];
							}

							if (old_X == new_X && old_Y == new_Y) {
								old_X = old_X - 1;
								new_X = new_X + 1;
							}

							locusLog[locusCnt].push({
								tool: toolInfo.tool,
								sx: old_X,
								sy: old_Y,
								ex: new_X,
								ey: new_Y,
								color: toolInfo.color,
								opacity: toolInfo.opacity,
								size: toolInfo.size
							});
							old_X = new_X;
							old_Y = new_Y;

							//まずcanvasの描画をすべて消す
							cCtx.clearRect(0, 0, cEle.width, cEle.height);

							//描画ログをはじめから順に描き直す
							locusLog.forEach(function (locus) {
								cCtx.beginPath();
								locus.forEach(function (l) {
									//描画ログの描画情報に合わせてcanvasに描画する
									cCtx.moveTo(l.sx, l.sy);
									cCtx.lineTo(l.ex, l.ey);
									cCtx.strokeStyle = l.color;
									cCtx.globalAlpha = l.opacity;
									cCtx.lineWidth = l.size;
									if (l.tool == TOOL_PEN) {
										cCtx.lineJoin = "round";
										cCtx.lineCap = "round";
									} else if (l.tool == TOOL_MARKER) {
										cCtx.lineJoin = "bevel";
										cCtx.lineCap = "square";
									}
								});

								cCtx.closePath();
								cCtx.stroke();
							});

						}
						//描画終わりのフラグ
						if (toolInfo.tool && bDraw == true) {
							bDraw = false;
							locusCnt++;
						}
						
						//描画ログがある場合に、ツールバー上の「全消去」ボタンアイコンを変更する
						if (locusCnt > 0) {
							window.parent.postMessage("FFLCOM_CALL_CHANGE_BTN_ICONS" + "[,]" + "fflcom_clear" + "[,]" + 1, "*");
						}
						
					}
					
					//消しゴムの場合（全消去ボタンと同じ動作、共通基盤側の消しゴムと動作が異なる）
					if (toolInfo.tool == TOOL_ERASER && bErase == true) {
						canvasClear();
						bErase = false;
					}
				},

				'mousemove touchmove pointermove': function (e) {
					e.preventDefault();
					if (toolInfo.tool && bDraw == true) {

						//マウス座標を取得
						var posP = {
							x: 0,
							y: 0
						};
						if (e.touches && e.touches[0]) {
							posP = {
								x: e.touches[0].clientX,
								y: e.touches[0].clientY
							};
						} else if (e.originalEvent && e.originalEvent.changedTouches && e.originalEvent.changedTouches[0]) {
							posP = {
								x: e.originalEvent.changedTouches[0].clientX,
								y: e.originalEvent.changedTouches[0].clientY
							};
						} else if (e.clientX && e.clientY) {
							posP = {
								x: e.clientX,
								y: e.clientY
							};
						}

						//マウス座標をcanvasの論理座標に変換
						var pos = cnvPosLog2Phys(posP.x, posP.y);
						new_X = pos.x;
						new_Y = pos.y;

						//マーカーの場合（垂直方向か水平方向か）
						if (toolInfo.tool == TOOL_MARKER) {
							if (Math.abs(pos.x - old_X) >= Math.abs(pos.y - old_Y)) {
								new_X = pos.x;
								new_Y = old_Y;
							} else {
								new_X = old_X;
								new_Y = pos.y;
							}
						}

						//描画ログ配列データが存在しない場合の初期化
						if (!locusLog[locusCnt]) {
							locusLog[locusCnt] = [];
						}

						//描画ログの配列に描画情報を追加
						locusLog[locusCnt].push({
							tool: toolInfo.tool,
							sx: old_X,
							sy: old_Y,
							ex: new_X,
							ey: new_Y,
							color: toolInfo.color,
							opacity: toolInfo.opacity,
							size: toolInfo.size
						});

						//まずcanvasの描画をすべて消す
						cCtx.clearRect(0, 0, cEle.width, cEle.height);

						//描画ログをはじめから順に描き直す
						locusLog.forEach(function (locus) {
							cCtx.beginPath();
							locus.forEach(function (l) {
								//描画ログの描画情報に合わせてcanvasに描画する
								cCtx.moveTo(l.sx, l.sy);
								cCtx.lineTo(l.ex, l.ey);
								cCtx.strokeStyle = l.color;
								cCtx.globalAlpha = l.opacity;
								cCtx.lineWidth = l.size;
								if (l.tool == TOOL_PEN) {
									cCtx.lineJoin = "round";
									cCtx.lineCap = "round";
								} else if (l.tool == TOOL_MARKER) {
									cCtx.lineJoin = "bevel";
									cCtx.lineCap = "square";
								}
							});

							cCtx.closePath();
							cCtx.stroke();
						});
						
						
						//マーカーの場合、手を離すまで記録はしない
						if (toolInfo.tool == TOOL_MARKER) {
							//locusLog[locusCnt].pop();
						}

						//描画情報を保存するためのpostMessageを共通基盤側に送信する
						window.parent.postMessage("FFLCOM_SET_LEARNING_REC" + "[,]" + JSON.stringify(locusLog), "*");

						if (toolInfo.tool != TOOL_MARKER) {
							old_X = new_X;
							old_Y = new_Y;
						}
						
					}
				}
			});
		}
	};

	$(function () {
		// init.ctrls();
		// init.handler();
	});
}(this, jQuery));

var reset = 0;

var camera;
var light;
var renderer;
var scene;

//グループ
var planeGroup = new THREE.Group();
var pillarGroup = new THREE.Group();


//レイキャスター
var raycaster = new THREE.Raycaster();

var mode = 0; //カメラ移動時 0,面 1,辺 2 ,三角定規 3

var mouse;

var triangle; //三角定規のメッシュ

var texture={
  //画像はすべてbase64形式に変換。
  plane1: textureLoader("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAActpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+QWRvYmUgSW1hZ2VSZWFkeTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KKS7NPQAAAiJJREFUSA3Nk2uR2zAURtMiMARBCARBcBkYgiGIQcrAEDJFYAgpA5fBlkF6jtfXo9U6mbS/+s0c6b6vnJmcTs+VSU/wBvcDZmIjdPDXOtPhAAfHoIwdMt/DBD5ARnhZA5UxPL/Q1VFTIHr0n2oga/Flq7LBF86QIXTGaIcZ84tuBzlC78pcLiigBrApXpiwQ8aukLfbOh8Ti8x9kq9aIJIDtoNsztDKuERN2IlY3uI99wcVPAtdliCafdmRbgStmcGeAvoZ1ATLalWHgcvmj9w2hL+F98u4eYlHRCz8tOV77lUm6oay+Zm7lU2xwDuD/W+wQK0bjstPXyHDb/gJtVLtYHdgk7XfQZ1hXq3T6dt2x/UDw/yqwhmFBkz4Sl/WQahgGPcWbfEremg1EDC/qnDO7+Z+TlgWLDBABocZ82uMa8+Q4EiZoDWrCqfFrQqBGGxxzbL5mfuR/Dp7Vo2cDnukM4kb2DBAB1fYB2AfqRCcI+EQG1IEDu6JmItCNtvzTNbYt2vBKrt3bCTCGQpYf4e5ImGHEob5PgLeBfzJ/ClaWWjOphbjsajunYgv8EEW2GCylUscVGCAEe5wVEt4/wsMOq0cZvPQJho/lni36gjE17W53b9guehoQBQljAIOrHXGWeAGba6uW+3C6aIrJHhFPsoveGlBDMwYvsplE/SQoFbGuUDUFex/0kDXDC47wgUuSvBQXx5mPidyE/qFL/+H/gBE1boOI1Wx2AAAAABJRU5ErkJggg=="), //あ
  plane2: textureLoader("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAX5JREFUeNq8Vr1NxDAUDkdDaTYwHaWZgIzABncjhJKKbBAxQdjgaKlyN0GyQSjpkg3Cs/RZeudznOdE4kmfcnHe/58vy/6BboR8hvBCePbOR8KZ8EX4WWvEKq4IivAJhSP7rmHY8nWEVzxFZJXWhIFwEPKXhAlPkUBLaPA7hQxk6yVGq/y4oc7OyWqOoQCD2thQBqnOQx7wDxqQeK4iDl8dNl7aBoGRJhJ970fTohW58CQwUoAvVIPKb4LJ80ZqhPP6Nch5ynKElq00YsDbB9I27diLvxbOzIEl6rARNNJ3QbuI4Mi8lNAHnvs5Bh3oJJeClMGsvUJf6R0Cc9GzhlB4LxKM2r3X3LKDR8ID4cTO7lGTO8ITWvyN8Cs08k749tvN7w7FohlCExwhDTkd6vcy0OsTkJKq49ySNDNDpRMNFDMzc1GsIaF1V8sfVqRHIT1JDrpbrodRFSlwCeWN8HoIRtUiMndrlmzFu4HNt/4lcukw7DLrsHpOS4J/AgwAeQxq50uIrxQAAAAASUVORK5CYII="), //い
  plane3: textureLoader("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAXlJREFUeNrMVsFxhDAM5GggLoFUkCuBEiiBEq4EOiAdMKmAEpwOIL/8nHzy5V73JSazmlF8smzu8ohm9gY42VppZUFR/BOrPE4e1sN5rMDkMeI/c8/mAzZccN151ECHIAt8hr3BWix2uI7a+9fFMP8FBLICELPQamQomUFma4pYqzgZpoeDFpJRiY8xDZZIBtynYzpMET9qEiMxcJnibT49yqMR7qRStH/Y+j1IX2lhFOYtmDumS5co7cq7bUAdpc0HJjjpwA+mpuEvIjbCqgq6qQoIOK2TkPlQJur64XHwePR4xj3Z2eOFnR/J3jZi5Z3ivrKsJHvYfsrwwQ3zTbOtjDMFmXNnTmBPbH0syCfdNBCw2hnEKa0v7ukS7RjaKdHCVjoWbaIdJd8lkn0THkRuE2AyAxyVuTUWicGmBaJJXUWEziH640hvxT0d12QQvJpZFmWx2EAbnOTb3/JRUbMNVtYxFozp+ahlfdhxsqX3+4zRctYWfwswAEUvg35NA+nIAAAAAElFTkSuQmCC"), //う
  plane4: textureLoader("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAaFJREFUeNq8VrtRxDAQNZ8CVII7QHTgkAzTgenAJYiMzHRgUqKDCnwXEvmowEdIdBeSmfXNE7M2klaCGXbmzdjyk/a/cpb9g5xEcHJCSbjAs5UD4Y3wTNiGDjgTDm8Ij4RPwivhibABPqD4nnBFeCfsUjysCSOUqEj+ntBG8o/EaYNODP10eA8EFRnC4CApeDbAiCJwRgc4RQseVNg8AivBo9pngYmsthb58kkBg5XLCxUZ/1wImTV65k0TsEyjTwxCNLCQtQElJcI20+qybM8OtOjYeil4My5flKfaDJKuWYmPQk6s9Nz4MbFJ20h+l6qkAq9PaNCZEqnDtSM/dYSS47mneNkGlOSwSGHyrlnTSWU+cbZWyQvh2tO9K0smXBLu8E2auCWugR+zKV8QV45EG6xJzTi4SrxZzKPGU0nG0SMaSnNWhb1vsA0soaNnbNeOBuWNqvH8nePzxXV6A+IB8d/hmctDIPEH7L+VrmRbrk3CwOS3Y5UlTNmOhU8JTWq5RfYLKViF9SgCAy87tl799ZfIxl8D1qs1cib+oXwJMABgQIs9gAFZpgAAAABJRU5ErkJggg=="), //え
  plane5: textureLoader("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAZdJREFUeNq8VtlNxDAQDRL/uASX4A5ICSkhHRAqwB1EVGA6CB2YrcDbwUIFoQNjr57RMPK1+WCkJ+06c7y5nAzDP8hdh44ImAIeAyR7dgp4DzgfDRIdvgTMcHRiziQCRwLfAc/Q65boeA8wGfY1/Q2ZdxuMN5ZeIIhrBUoBFDs3KEuPGAQq9qCUgQ/QBRudKakr6F8ZrAUCNIjIEOMkJM7kkDkUBbbx2QXwKCt97nBuaqQXphBLZglLTwKZDBmBQLQXCvq/Yhm7BU4tnJZ60pKdlsw1RvZokEhyvCepfdxgLFlTu2x9Y4E8Fs1k+pSwljLJ/mEyMWcbejYCM5k6ndmXkY7bUrgmPBlPUblSPJsmwSs0Z64CR8rgK4vK9Ys+BbtSUokW0hNbCaCg4yprcRVNHM2sRLkgCqRWMgwTsb/UUtakT571hC8avQkWEnyv3dpJYSZl25CF6liFZK97FU3vW44Q2jsG5M8gWMJKNpzbWolaXyuxsU8wPgNfAQ/IWOEj4jXgDb8PfRKlzJLTVMIU9LNl/CPAAON5lwucxqoPAAAAAElFTkSuQmCC"), //お
  plane6: textureLoader("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAZpJREFUeNq8Vm1xwzAM7XYDYAhmsDJYIARCIIRBUwTZELgMMgbpEGQMvCFwhyBT7p7vNMV2lP6Y7t6dG+vDT5JVHw7/IA9KvZpwJLyI71+ED8IV67uCNIQTwRI+4eyH7T8TKoIhXAjnUjApi9FImAkOQbYO4wkB6005QtljvUd6HKzfYrA4n7DmYpWnbBAoqzuAhcnszUpGHXRXmaiwUWcMAxhqZUJdVycdN1LQ7ghSSTZmI48D27cZli7x3fMmiFENu3wjjOcEJGPH2l1228gLNYn0jIBnDlropVinvje8WbpCPTwgWXeJ+zWDveW6j4qeXwzeEns38XsZO69I+R+WT+KySTnB2UUwiU6lnDHb3hm7W67wPJ9dptOsoo2dLIMsms/c/iBqVJIg75ZjxpyFYaduNANQ6Fo5AOOtNixAy0a4V6YqDlqXG9UhMdgmdhF7ZS1C7jAGDmWgyKxVBigN2lWgesdANGLGqQwcm1OlYBYsY9dVe18zFfuvD1j3cDqwWgXWKHc/iSwCWvYsWl4l33jBXEvGvwIMAF68lNTqv8snAAAAAElFTkSuQmCC"), //か
  plane7: textureLoader("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAZ9JREFUeNq8VstNxDAQXT4FpAQfueEOSAeECsiN65aQDgwVwJFb4MjJSwVeKkioIOnAjFfPaGT5FyEx0tNurPG8mfHkObvdP9hZpV9D6AiCcMPWPwlHwoGwpjZfFIK7oIrwCqJvwjvhA//d2gNhIFwRvnJkMXMbLUhERTLPhIXQ1xK4DRNBRoLlCFsQqRoCg1aEphEkZxI++5RDBwdRaGEfVBcjspFOnGwq9LTHZsOqsiCPJaRjAUzkDDTIbQC3NqItIjH2Lgl5yRZvCU+JCmbCG8Z2RnD3e5ep2o3yC+GeL9qKUeXD4c+mx/OQmDbD27IU3oMWrVHYGLYvNbaWM+oMSRjUsLXSO1FNIuEjg4Od0IGmhkTwhwoTOHyNfWNGWO05m551w8GvTAznjCi2UOhfGzNS0BZakptCFUrKlOnruJGgSUmUSVSjGJGsJFGpxLxUy0hWY0RWNDqwVWhPlSyJjCUy1AxdQuqLl9cAx27jOewjV0HWfMkabSz5erVut36tNMjOK+kBSuztGkFXKPjjXz6JuLQ0wRVwBJL2I8AATDeJ/aYTYT8AAAAASUVORK5CYII="), //き
  plane8: textureLoader("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAXVJREFUeNq8VQttwzAQbUNgZtBAMIM2DAJhDDYIZtANgcegY5AVgcsgG4KUgXeenifX9eccTTvpSVFyvpd7uXvZbP4htowcQRgJe0IfPbsQzoT3tSSu+DPhCdcfKOjjgSAJB8KV8Ep4wTUr3MEFUCDJRY8clzuDuBqPBEs4VYqnyAzIZK0DR6AZRTVyZeJ+lkjg4amh2yUxDAIdmdRBr6tgfC+b6SKUzuJl7rpQFQKJvLsCGTnnVPvijwh8/k23jnUqHBgbCXy4TlQXaHgufGQ/DAPhrYHkk7DrGC1rJA/Y+pZwL97XSK7BYPRrDbKLvCjV7oBrJ9mxsf4eJvoTx9zyRJZhMSBcu1lgsr/TYyuSiIDINCytjFlry9hCpFPqqIwXrSE6lHbKMKUQWDQbah49m2rWoRlEEsXGRJdVo/VEhvuXCySaOT+tkMgEPzBZKa5XjPeNb3ntvc4KezUFpmlKxrllkklovwumz23yF/zsUjr8LcAAcQV3QDrcUgwAAAAASUVORK5CYII="), //く
  plane9: textureLoader("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAZ5JREFUeNq8Vj1OxTAMLoWdrmyMbOQG5Ag9Qm5Aj9AblJGtsLHBG5kKJ0gZmdp3gr4bFAd9QXlW/ooQlj6pcmN/tuM4KYp/kJOMNRVBEgThxtGPhA/CG2GOOTiN/LskdIQnwhXhk7AjvBLeCRcgvUcQ+xQZF0VYCD3IUpm2WN/lEjQwkBtLb4LRhOfcDESmY4mg3Kw0KuAV43h1CGrCAMOQtLCpGNHEyH9kgJGVDg5kBon0ZLjwAIVHOcBB8QsSa3+UTeepY4hEAspZo/E9ON2ooD9yWDNnE/R8z0LQjKTiQa6eDV4ZiS1PizLYzortmyGWZ47i4Fk0e0i2yLfPMrFo/xcDsnQYQ+OjzhgtsSlwKJ2J6qvrObpORpzECAxGS7JjY9wdM0YeAo6uI/tpAnvhrCuLTEPXR6KdgNA/xZU9m6D2NDeJ094EJvkUuhcWh73CdxUoYyhLkboqJIxVomt04IKyBMnzpHIXelp90+0oEO2UkZXE+Fk88y/rtWIIbm2/4wHhtq+94B4Jd4FWznoS2RYX7FqeQTymjL8EGABM+HnGqyUm2AAAAABJRU5ErkJggg=="),  //け
  triangle:textureLoader("data:image/png;base64,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"),
  triangleProto:textureLoader("data:image/png;base64,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"),
  triangleProto2:textureLoader("data:image/png;base64,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"),
  triangleBase:textureLoader("data:image/png;base64,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"),
  triangleHole:textureLoader("data:image/png;base64,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")
};
texture.triangle.type = THREE.FloatType; // 追加してあげる

var buttonSrc = {
  redo: "image/redo.png",
  triangleNormal: "image/set-square_normal.png",
  triangleOn: "image/set-square_on.png",

  surfaceNormal: "image/surface_paint_normal.png",
  surfaceOn: "image/surface_paint_on.png",
  PopUpNormal: "image/btn_pop-up_normal.png",
  PopUpOn: "image/btn_pop-up_on.png",
};



function init() {
  var myCanvas = document.getElementById( 'appCanvas' );

  const width = 1280;
  const height = 960;
  function handleTouchMove(event) {
      event.preventDefault();
  }
  //スクロール禁止
  document.addEventListener('touchmove', handleTouchMove, { passive: false });
  document.addEventListener('mousemove', handleMouseMove);
  myCanvas.addEventListener('mousedown', raycasting);


   renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#appCanvas'),
    antialias:true,
    alpha:true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  // myCanvas.appendChild( renderer.domElement );


  // シーンを作成
  scene = new THREE.Scene();
  obejectInit();

  // 座標軸を表示
    // var axes = new THREE.AxesHelper(100);
    // scene.add(axes);

  // カメラを作成
  camera = new THREE.PerspectiveCamera(10, width / height, 100, 1000000);
  camera.position.set(120, 120, +312);

  trackball = new THREE.TrackballControls( camera , renderer.domElement); //回転対称はカメラ、反応範囲はキャンパス内のみ
    trackball.rotateSpeed = 5.0; //回転速度
    trackball.zoomSpeed = 0.0;//ズーム速度(無効化)
    trackball.panSpeed = 0.0;//パン速度(無効化)

  onResize();

// 初回実行
if(reset==0){
  tick();
  reset++;}

  tickUpdate();
}
//1フレーム毎に処理するものはここに
 function tick() {
   requestAnimationFrame(tick);
   brokenPillarShow();

   // レンダリング
   renderer.render(scene, camera);
   renderer.setClearColor(0xFFFFFF);
   trackball.update();
   // 平行光源
   scene.remove(light); //光源を消去（コレを忘れると無限に光が強くなるので注意）
   light = new THREE.AmbientLight(0xFFFFFF);
   light.intensity = 1; // 光の強さを倍に
   light.position.set(camera.position.x, camera.position.y, camera.position.z); //カメラと光源の位置を同期
   // シーンに追加
   scene.add(light);
   // console.log(camera.position);
 }

 function tickUpdate(){
  brokenPillarShow();

  // レンダリング
  renderer.render(scene, camera);
  renderer.setClearColor(0xFFFFFF);
  trackball.update();
  // 平行光源
  scene.remove(light); //光源を消去（コレを忘れると無限に光が強くなるので注意）
  light = new THREE.AmbientLight(0xFFFFFF);
  light.intensity = 1; // 光の強さを倍に
  light.position.set(camera.position.x, camera.position.y, camera.position.z); //カメラと光源の位置を同期
  // シーンに追加
  scene.add(light);
 }

 function onResize(){
  var canv = document.querySelector('#stage_1');

  // サイズを取得
  var width = canv.clientWidth;
  var height = canv.clientHeight;

  // レンダラーのサイズを調整する
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  // カメラのアスペクト比を正す
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  console.log("リサイズが発生しました。"+"レンダラーのサイズは"+"幅"+width +"高さ"+height+"　以下、"
			  +"キャンバスの情報");
  console.log("キャンパス幅は"+width+"、　高さは"+height);
	
  console.log("pixelDepthは"+window.screen.pixelDepth);
  console.log("devicePixelRatioは"+window.devicePixelRatio);

 }

 function clickSurface() {
  
  const buttonSurface = document.getElementById("button_surface");

  const buttonRedo = document.getElementById("button_redo");

  if (mode === 1) {
      $("#layer_btnRadioFace").css("display", "none");

      //すでに押し下げ状態なら
      mode = 0; //移動モードに
      trackball.enabled = true; //ドラッグ回転を許可
      // buttonTriangle.src = buttonSrc.triangleNormal;  //三角形ボタンをもとに戻す
      buttonSurface.src = buttonSrc.surfaceNormal; //面ボタンをもとに戻す
      // buttonSide.src = buttonSrc.sideNormal;
      scene.remove(triangle); //三角形を消す
  } else {
      $("#layer_btnRadioFace").css("display", "block");
      // $("#layer_btnRadioLine").css("display", "none");
      //押し下げでなければ
      mode = 1; //面塗りモードに
      trackball.enabled = false; //ドラッグ回転を禁止
      // buttonTriangle.src = buttonSrc.triangleNormal;
      buttonSurface.src = buttonSrc.surfaceOn; //面ボタンを押し下げ状態に
      // buttonSide.src = buttonSrc.sideNormal;
      scene.remove(triangle);
  }
}

function clickRedo(){
  trackball.enabled = true;
  // const buttonTriangle = document.getElementById("button_triangle");
  const buttonSurface = document.getElementById("button_surface");



  buttonSurface.src = buttonSrc.surfaceNormal;

  mode=0;
  scene.remove(triangle);

  obejectInit();
  camera.up.set(0, 1, 0);
  camera.position.set(120, 120, +312);
}

function handleMouseMove(e) { //マウス座標取得
    var myCanvas = document.getElementById( 'appCanvas' );

    var rect = myCanvas.getBoundingClientRect();  //キャンバスの余白やサイズを取得

    // スクリーン上のマウス位置を取得する
    var mouseX = e.clientX - rect.left; //ウィンドウ上のマウスのx座標から、キャンパスの左の余白を引く
    var mouseY = e.clientY - rect.top;

    // 取得したスクリーン座標を-1〜1に正規化する（WebGLは-1〜1で座標が表現される）
    mouseX =  (mouseX/rect.width)  * 2 - 1; //マウス座標をキャンパスの大きさで割る
    mouseY = -(mouseY/rect.height) * 2 + 1;

    // マウスの位置ベクトル
    mouse = new THREE.Vector2(mouseX, mouseY);

    // console.log(mouse);
  }

  function obejectInit(){
    while (planeGroup.children.length>0) {
      planeGroup.remove(planeGroup.children[0]);
    }
    while (pillarGroup.children.length>0) {
      pillarGroup.remove(pillarGroup.children[0]);
    }
    while (scene.children.length>0) {
      scene.remove(scene.children[0]);
    }
    
    scene.remove(planeGroup);
    scene.remove(pillarGroup);

    delete planeGroup;
    delete pillarGroup;

    makeBoxInit();
    setTriangle();
  }

function makeBoxInit() {//箱の作成
    makePlane(-15,0,0,30,30,2,0xFFFFFF,texture.plane5,1); //お
    makePlane(15,0,0,30,30,2,0xFFFFFF,texture.plane6);  //か
    makePlane(0,0,-15,30,30,0,0xFFFFFF,texture.plane4,1); //え
    makePlane(0,0,15,30,30,0,0xFFFFFF,texture.plane2);  //い
    makePlane(0,15,0,30,30,1,0xFFFFFF,texture.plane1,1);  //あ
    makePlane(0,-15,0,30,30,1,0xFFFFFF,texture.plane3); //う

    makeRealLineInit();

    scene.add(planeGroup);
    scene.add(pillarGroup);
  }

function makePlane(x,y,z,width,height,parallelAxiz,col,texture,hanten){　//面の製作〜点線の作成まではここに
   //引数(配置するx,y,zの座標,幅、高さ、平行な軸、テクスチャ,反転の有無)parallelAxizはx軸なら1,y軸なら２
   var planeMaterial = new THREE.MeshLambertMaterial({
     color: col ,
     side: THREE.DoubleSide,
     opacity:0.7,
     transparent:true
   });
   // planeMaterial.map.minFilter = THREE.LinearFilter;
   var planeGeometry = new THREE.PlaneGeometry(width,height,false);
   var plane = new THREE.Mesh(planeGeometry,planeMaterial);


   var numPlaneMaterial = new THREE.MeshLambertMaterial({
     side: THREE.DoubleSide,
     opacity:1,
     transparent:true,
     map:texture
   });
   numPlaneMaterial.map.minFilter = THREE.LinearFilter;   //テクスチャにライン処理

   var numPlaneGeometry = new THREE.PlaneGeometry(5,5,false);
   var numPlane = new THREE.Mesh(numPlaneGeometry,numPlaneMaterial);
   numPlane.position.set(0,0,0.1);

   plane.position.set(x,y,z);
   if (parallelAxiz == 1) {
     plane.rotation.x = 0.5*Math.PI;
   }
   if (parallelAxiz == 2) {
     plane.rotation.y = 0.5*Math.PI;
   }

   if (hanten){
     numPlane.rotation.y = Math.PI;
     numPlane.position.set(0,0,-0.1);
    }

   if(y===10)numPlane.rotation.z = Math.PI; //「あ」面専用の特別処理

   plane.add(numPlane);

   planeGroup.add(plane);
 }

function makeRealLineInit(){ //実線の作成（初期化）
   const points =[  //座標指定
     //横線・縦線用
     [15,15,15],
     [-15,15,15],

     [15,15,-15],
     [-15,15,-15],

     [15,15,15],
     [15,15,-15],

     [-15,15,15],
     [-15,15,-15]

   ]

   const lineWidth = 2; //線の太さ

   var realLineMaterial = [];
   var realLine = [];
   var j = 0;
     for (var i = 0; i <= 3; i+=2) { //横線1/2
       realLineMaterial[j] = new MeshLineMaterial({
         color: 0x000000,
         lineWidth: lineWidth
       });
       const realLineGeometry = new THREE.Geometry();
       realLineGeometry.vertices.push(new THREE.Vector3(points[i][0],points[i][1],points[i][2]));
       realLineGeometry.vertices.push(new THREE.Vector3(points[i+1][0],points[i+1][1],points[i+1][2]));
       var line = new MeshLine();
       line.setGeometry( realLineGeometry );
       realLine[j] = new THREE.Mesh(line.geometry,realLineMaterial[j]);
       realLine[j].scale.x = 1.01;  //線を太くした関係で、辺のつなぎ目に隙間があるので線を延長して埋める。

       /*以下、重要。
        realLineは外部ライブラリのTHREE.MeshLine.jsを使用して作成しているため、
        下部プロバティのgeometry.verticesが存在しない。
        よって下3行で配列としてverticesプロパティを追加した。
        グローバル関数として登録してあるのは更に上部のPillarGroupのみなので、
        隠線処理等、この関数外で実線の頂点座標を参照したいときは、
        pillarGroup.children[i].geometry.vertices[j]
        で呼び出すこと。
      */
       realLine[j].vertices = [];
       realLine[j].vertices.push(new THREE.Vector3(points[i][0],points[i][1],points[i][2]));
       realLine[j].vertices.push(new THREE.Vector3(points[i+1][0],points[i+1][1],points[i+1][2]));
       // pillarGroup.add(realLine[j]);
       j++;
          }
     for (var i = 0; i <= 3; i+=2) { //横線2/2
       realLineMaterial[j] = new MeshLineMaterial({color: 0x000000,
    lineWidth: lineWidth});
       const realLineGeometry = new THREE.Geometry();
       realLineGeometry.vertices.push(new THREE.Vector3(points[i][0],-points[i][1],points[i][2]));
       realLineGeometry.vertices.push(new THREE.Vector3(points[i+1][0],-points[i+1][1],points[i+1][2]));
       var line = new MeshLine();
       line.setGeometry( realLineGeometry );
       realLine[j] = new THREE.Mesh(line.geometry,realLineMaterial[j]);       // pillarGroup.add(realLine[j]);
       realLine[j].scale.x = 1.01;  //線を太くした関係で、辺のつなぎ目に隙間があるので線を延長して埋める。

        realLine[j].vertices = [];
        realLine[j].vertices.push(new THREE.Vector3(points[i][0],-points[i][1],points[i][2]));
        realLine[j].vertices.push(new THREE.Vector3(points[i+1][0],-points[i+1][1],points[i+1][2]));
       j++;
          }
     for (var i = 0; i <= 3; i++) {  //縦線
       realLineMaterial[j] = new MeshLineMaterial({color: 0x000000,
    lineWidth: lineWidth});
       const realLineGeometry = new THREE.Geometry();
       realLineGeometry.vertices.push(new THREE.Vector3(points[i][0],points[i][1],points[i][2]));
       realLineGeometry.vertices.push(new THREE.Vector3(points[i][0],-points[i][1],points[i][2]));
       var line = new MeshLine();
       line.setGeometry( realLineGeometry );
       realLine[j] = new THREE.Mesh(line.geometry,realLineMaterial[j]);       // pillarGroup.add(realLine[j]);
        realLine[j].vertices = [];
        realLine[j].vertices.push(new THREE.Vector3(points[i][0],points[i][1],points[i][2]));
        realLine[j].vertices.push(new THREE.Vector3(points[i][0],-points[i][1],points[i][2]));
       j++;
          }
     for (var i = 4; i <= 7; i+=2) { //奥行き線1/2
       realLineMaterial[j] = new MeshLineMaterial({color: 0x000000,
    lineWidth: lineWidth});
       const realLineGeometry = new THREE.Geometry();
       realLineGeometry.vertices.push(new THREE.Vector3(points[i][0],points[i][1],points[i][2]));
       realLineGeometry.vertices.push(new THREE.Vector3(points[i+1][0],points[i+1][1],points[i+1][2]));
       var line = new MeshLine();
       line.setGeometry( realLineGeometry );
       realLine[j] = new THREE.Mesh(line.geometry,realLineMaterial[j]);       // pillarGroup.add(realLine[j]);
        realLine[j].vertices = [];
        realLine[j].vertices.push(new THREE.Vector3(points[i][0],points[i][1],points[i][2]));
        realLine[j].vertices.push(new THREE.Vector3(points[i+1][0],points[i+1][1],points[i+1][2]));
       j++;
     }
     for (var i = 4; i <= 7; i+=2) { //奥行き線2/2
       realLineMaterial[j] = new MeshLineMaterial({color: 0x000000,
    lineWidth: lineWidth});
       const realLineGeometry = new THREE.Geometry();
       realLineGeometry.vertices.push(new THREE.Vector3(points[i][0],-points[i][1],points[i][2]));
       realLineGeometry.vertices.push(new THREE.Vector3(points[i+1][0],-points[i+1][1],points[i+1][2]));
       var line = new MeshLine();
       line.setGeometry( realLineGeometry );
       realLine[j] = new THREE.Mesh(line.geometry,realLineMaterial[j]);       // pillarGroup.add(realLine[j]);
        realLine[j].vertices = [];
        realLine[j].vertices.push(new THREE.Vector3(points[i][0],-points[i][1],points[i][2]));
        realLine[j].vertices.push(new THREE.Vector3(points[i+1][0],-points[i+1][1],points[i+1][2]));
       j++;
          }
          for (var i = 0; i < realLine.length; i++) {
            pillarGroup.add(realLine[i]);
          }

 }
 let color_line_1 = "#00aeef";
 let color_line_2 = "#EB6100";
 
 let color_face_1 = "#beda63";
 let color_face_2 = "#fad7d5";
 let color_face_3 = "#c8c3e0";
 
 let numberCheckLine = 1;
 let numberCheckFace = 1;
 function raycasting() {
  // レイキャスト = マウス位置からまっすぐに伸びる光線ベクトルを生成
  raycaster.params.Points.threshold = 0.1;

  raycaster.setFromCamera(mouse, camera);

  // raycaster.setFromCamera(mouse, camera);
  // raycasterTargetObjects=planeGroup;
  // その光線とぶつかったオブジェクトを得る
  var raycasterTargetObjects = []; //交差判定を行いたいオブジェクトはここに入れる

  if (mode == 1) {
      //面モードのとき
      raycasterTargetObjects = planeGroup; //レイキャストターゲットを面グループに
      const intersects = raycaster.intersectObjects(raycasterTargetObjects.children); //レイキャスト実行
      if (intersects.length > 0) {
          let setClolorObijectFace = intersects[0].object.material.color;

          console.log(intersects[0]);

          //当たり判定があれば
          if (setClolorObijectFace.b == 1 && setClolorObijectFace.r == 1) {
              //黒なら
              if (numberCheckFace == 1) {
                  setClolorObijectFace.set(color_face_1); //青に
              } else if (numberCheckFace == 2) {
                  setClolorObijectFace.set(color_face_2); //青に
              } else {
                  setClolorObijectFace.set(color_face_3); //青に
              }
          } else {
              if (setClolorObijectFace.b == 0.38823529411764707) {
                  if (numberCheckFace == 1) {
                      setClolorObijectFace.setHex(0xffffff); //黒に
                  } else if (numberCheckFace == 2) {
                      setClolorObijectFace.set(color_face_2); //青に
                  } else {
                      setClolorObijectFace.set(color_face_3); //青に
                  }
              } else if (setClolorObijectFace.b == 0.8352941176470589) {
                  if (numberCheckFace == 2) {
                      setClolorObijectFace.setHex(0xffffff); //黒に
                  } else if (numberCheckFace == 1) {
                      setClolorObijectFace.set(color_face_1); //青に
                  } else {
                      setClolorObijectFace.set(color_face_3); //青に
                  }
              } else if (setClolorObijectFace.b == 0.8784313725490196) {
                  if (numberCheckFace == 3) {
                      setClolorObijectFace.setHex(0xffffff); //黒に
                  } else if (numberCheckFace == 2) {
                      setClolorObijectFace.set(color_face_2); //青に
                  } else {
                      setClolorObijectFace.set(color_face_1); //青に
                  }
              }
              //白なら
          }
          // console.log("Now intersect!");
      }
      // if (intersects.length > 0) {
      //   //当たり判定があれば
      //   if (
      //     intersects[0].object.material.color.b == 0.12549019607843137 &&
      //     intersects[0].object.material.color.r == 0.6352941176470588
      //   ) {
      //     //緑なら
      //     intersects[0].object.material.color.set(0xffffff); //白に
      //   } else {
      //     //白なら
      //     // intersects[0].object.material.color.setHex(0xa2ca20); //緑に
      //     intersects[0].object.material.color.set("red"); //緑に

      //     // if(numberCheckFace == 1){
      //     // intersects[0].object.material.color.set(color_face_1); //緑に

      //     // }

      //   }
      //   // console.log("Now intersect!");
      // }
  } else if (mode == 2) {
      raycasterTargetObjects = dummyPillarGroup;
      const intersects = raycaster.intersectObjects(raycasterTargetObjects.children); //レイキャスト実行
      if (intersects.length > 0) {
          //当たり判定があれば

          let setClolorObijectLine = intersects[0].object.material.color;
          console.log(setClolorObijectLine.r);
          if (intersects[0].object.material.color.b == 0 && intersects[0].object.material.color.r == 0) {
              //黒なら
              if (numberCheckLine == 1) {
                  intersects[0].object.material.color.set(color_line_1); //青に
              } else {
                  intersects[0].object.material.color.set(color_line_2); //青に
              }
          } else {
              // 白なら
              if (setClolorObijectLine.b == 0.9372549019607843) {
                  if (numberCheckLine == 1) {
                      setClolorObijectLine.setHex(0x000000); //黒に
                  } else if (numberCheckLine == 2) {
                      setClolorObijectLine.set(color_line_2); //青に
                  }
              } else if (setClolorObijectLine.r == 0.9215686274509803) {
                  if (numberCheckLine == 2) {
                      setClolorObijectLine.setHex(0x000000); //黒に
                  } else if (numberCheckLine == 1) {
                      setClolorObijectLine.set(color_line_1); //青に
                  }
              }
          }
          // console.log("Now intersect!");
      }
  } else if (mode == 0) {
      raycasterTargetObjects = 0;
  }
}

function brokenPillarShow(){  //隠線処理
//This function's　problems has forced me to work servilely for 6 hours!! You wanna know　why? I made typo!!!!nnnnnnnnnnnnnnnnn!!
  for (var i = 0; i < pillarGroup.children.length; i++) {
    pillarGroup.children[i].material.dashArray = 0;
  }

  var distance = [];
  for (var i = 0; i < pillarGroup.children.length; i++) {
    //カメラと辺との距離を測定

    var distance1 = Math.sqrt(//辺の始点との距離
      Math.pow(pillarGroup.children[i].vertices[0].x - camera.position.x , 2)+
      Math.pow(pillarGroup.children[i].vertices[0].y - camera.position.y , 2)+
      Math.pow(pillarGroup.children[i].vertices[0].z - camera.position.z , 2)
    );
    var distance2 = Math.sqrt(//辺の終点との距離
      Math.pow(pillarGroup.children[i].vertices[1].x - camera.position.x , 2)+
      Math.pow(pillarGroup.children[i].vertices[1].y - camera.position.y , 2)+
      Math.pow(pillarGroup.children[i].vertices[1].z - camera.position.z , 2)
    );
    distance[i] = Math.max(distance1,distance2);  //より遠い方を代入

    // distance[i] = Math.sqrt(//辺の中点との距離
    //   Math.pow((pillarGroup.children[i].vertices[0].x+pillarGroup.children[i].vertices[1].x)/2 - camera.position.x , 2)+
    //   Math.pow((pillarGroup.children[i].vertices[0].y+pillarGroup.children[i].vertices[1].y)/2 - camera.position.y , 2)+
    //   Math.pow((pillarGroup.children[i].vertices[0].z+pillarGroup.children[i].vertices[1].z)/2 - camera.position.z , 2)
    // );
}

for (var i = 0; i < 3; i++) { //すべての辺のうち最も距離が遠い3辺を点線に変える
  var distanceMin = Math.max.apply(null,distance);
  var deleteNum = distance.indexOf(distanceMin);
  pillarGroup.children[deleteNum].material.dashArray = 0.02;

  distance[deleteNum]=0;
}

}



function setTriangle(){  //三角定規の作成
   var height = 7;
   var width = height*128/64;
   var triangleGeometry = new THREE.PlaneGeometry(width,height,1,1);
   triangleGeometry.faces.splice(0,1);

   var triangleMaterial = new THREE.MeshLambertMaterial({
     // color:0xA2CA20,
     side: THREE.DoubleSide,
     opacity:1,
     transparent:true,
     map:texture.triangleBase
     // map:textureLoader("image/redo.png")
   });

   //重なりに依るチラツキ防止
   triangleMaterial.polygonOffset = true;
   triangleMaterial.polygonOffsetFactor = -0.06;
   //テクスチャのライン処理
   triangleMaterial.map.minFilter = THREE.LinearFilter;

   triangle = new THREE.Mesh(triangleGeometry,triangleMaterial);

   var holeGeometry = new THREE.PlaneGeometry(3,3,2,2);
   var holeMaterial = new THREE.MeshLambertMaterial({
     // color:0xA2CA20,
     side: THREE.DoubleSide,
     opacity:1,
     transparent:true,
     map:texture.triangleHole
   });
   //重なりに依るチラツキ防止
   holeMaterial.polygonOffset = true;
   holeMaterial.polygonOffsetFactor = -0.1;
   //テクスチャのライン処理
   holeMaterial.map.minFilter = THREE.LinearFilter;

   var hole = new THREE.Mesh(holeGeometry,holeMaterial);
   hole.position.set(width/4,-height/4,0);
   triangle.add(hole);

   triangle.position.set(-15+width/2,-10+height/2,-15.0);
   triangle.rotation.y = Math.PI;
   // triangle.scale.set(1, 4/2, 1);
   // triangle.renderDepth = 10;

 }

function setTriangleProto(){  //三角定規の作成(試作版)
   var height = 7;
   var width = height*Math.sqrt(3);
   var triangleGeometry = new THREE.Geometry();
   //頂点座標データを追加
   triangleGeometry.vertices[0] = new THREE.Vector3(0,0,0);
   triangleGeometry.vertices[1] = new THREE.Vector3(width,0,0);
   triangleGeometry.vertices[2] = new THREE.Vector3(width,height,0);

   //面指定用頂点インデックスを追加
   triangleGeometry.faces[0] = new THREE.Face3(0,1,2);

   triangleGeometry.computeFaceNormals();
   triangleGeometry.computeVertexNormals();


   var triangleMaterial = new THREE.MeshLambertMaterial({
     // color:0x000000,
     side: THREE.DoubleSide,
     opacity:1,
     transparent:true,
     map:texture.triangleProto
   });
   // triangleMaterial.map.minFilter = THREE.LinearFilter;
   triangle = new THREE.Mesh(triangleGeometry,triangleMaterial);
   triangle.position.set(-15+width/2,-10+height/2,-15.0);
   //重なりに依るチラツキ防止
   triangleMaterial.polygonOffset = true;
   triangleMaterial.polygonOffsetFactor = -0.1;
   //テクスチャのライン処理
   triangleMaterial.map.minFilter = THREE.LinearFilter;
   triangle.rotation.y = Math.PI;
 }


function textureLoader(texturePath){  //テクスチャローダー
 const loader = new THREE.TextureLoader();
 let textureData = new Image();
 textureData.src = texturePath
 // const texture = loader.load(textureData);

 // three.jsで使えるテクスチャーに変換
var texture = new THREE.Texture(textureData);
// 【重要】更新を許可
texture.needsUpdate = true;

 console.log(texture);
 return texture;
}

function textureLoader2(texturePath){  //テクスチャローダー２ 使ってない
const loader = new THREE.TextureLoader();
loader.crossOrigin = 'anonymous';

const texture = loader.load(texturePath);

// texture.needsUpdate = true;

return texture;
}

function testPlane(){ //テスト用の黄色い平面を出す。
  var testGeometry = new THREE.PlaneGeometry(30,30,false);
  var testMaterial = new THREE.MeshLambertMaterial({
    color: 0xffff00 ,
    side: THREE.DoubleSide,
    opacity:0.7,
    transparent:true
  });
  var test = new THREE.Mesh(testGeometry,testMaterial);
  test.position.set(2,2,30);
  scene.add(test);
}

// visibility btn
$("#button_pop_up").on("click", () => {
  $("#layer_btnRadioLine").css("display", "none");
  $("#layer_btnRadioFace").css("display", "none");
});

$("#button_redo").on("click", () => {
  $("#layer_btnRadioLine").css("display", "none");
  $("#layer_btnRadioFace").css("display", "none");
});

// btnFace
$("#btn_checkFace_1").on("click", () => {
  $(".check_face_1").attr("xlink:href", "#radio-on");
  $(".check_face_2").attr("xlink:href", "#radio-off");
  $(".check_face_3").attr("xlink:href", "#radio-off");
  numberCheckFace = 1;
});

$("#btn_checkFace_2").on("click", () => {
  $(".check_face_1").attr("xlink:href", "#radio-off");
  $(".check_face_2").attr("xlink:href", "#radio-on");
  $(".check_face_3").attr("xlink:href", "#radio-off");
  numberCheckFace = 2;
});

$("#btn_checkFace_3").on("click", () => {
  $(".check_face_1").attr("xlink:href", "#radio-off");
  $(".check_face_2").attr("xlink:href", "#radio-off");
  $(".check_face_3").attr("xlink:href", "#radio-on");
  numberCheckFace = 3;
});

$(document).ready(function () {
  const buttonPopUp = document.getElementById("button_pop_up");
  const buttonSurface = document.getElementById("button_surface");

  setTimeout(() => {
      // 1. init popup
      $("#divBody").css("visibility","visible")
      $(".stagebase").css("visibility","visible")

      initPoppup(
          {
              width: 992,
              height: 232,
              min_visible_x: 0.5 * 992,
              min_visible_y: 0.5 * 232,
              init_x: 244,
              init_y: 330.16,
          },
          // open callback
          () => {
              $(".btn").css({ "z-index": 0 });
              $("#appCanvas").css({ "z-index": 0 });
              $("#svg_root_2").css({ "z-index": -1 });

              buttonPopUp.src = buttonSrc.PopUpOn;
              buttonSurface.src = buttonSrc.surfaceNormal;
  
          },
          // close callback
          () => {
              $(".btn").css({ "z-index": 3 });
              $("#appCanvas").css({ "z-index": 1 });
              $("#svg_root_2").css({ "z-index": 2 });
              buttonPopUp.src = buttonSrc.PopUpNormal;

              trackball.enabled = true; //ドラッグ回転を許可
              scene.remove(triangle);

              mode = 3;
          }
      );

      initDragEvent(_.flattenDeep(["rect-button-ignore-touch"]));

      let gEvent = "";
        $("#button_pop_up").on("mousedown", function () {
            gEvent = "button_pop_up";
            g_latestMousePress = "button_pop_up";
            g_state.show_popup = !g_state.show_popup;
        });
    
      $("#button_surface").on("mousedown", function () {
          gEvent = "button_surface";
          g_latestMousePress = gEvent;

      });

      $("#button_redo").on("mousedown", function () {
          gEvent = "button_redo";
          g_latestMousePress = gEvent;

      });

      $(document).on("mouseup", function () {
          switch (gEvent) {
              case "button_pop_up":
                openPopup(g_state.show_popup);

                  break;

              case "button_surface":
                  clickSurface();
                  break;
              case "button_redo":
                  clickRedo();
                  break;
              default:
                  break;
          }

          gEvent = "";
      });
  }, 20);
});
