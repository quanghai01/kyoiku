var CONTENT_W = 1600;
var CONTENT_H = 900;

(function(global, $) {
	"use strict";

	var init = {
        ctrls: function() {
            fsi_adjustStageSize(CONTENT_W, CONTENT_H);
        },
		handler: function() {
            $(window).resize(function() {
	           fsi_adjustStageSize(CONTENT_W, CONTENT_H);
            });
        }
	};

	$(function() {
        init.ctrls();
		init.handler();
	});
}(this, jQuery));


/** ドラッグ開始時の処理 **/
function f_dragstart(event){
  event.dataTransfer.setData("text", event.target.id);
}

function f_dragover(event){
  event.preventDefault();
}

/** ドロップ時の処理 **/
function f_drop(event){
  var id_name = event.dataTransfer.getData("text");
  var drag_elm =document.getElementById(id_name);
  event.currentTarget.appendChild(drag_elm);
  event.preventDefault();
}
