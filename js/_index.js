var nowCnt = 0;
var hImgs = [
	'img/hitsu0.PNG',
	'img/hitsu1.PNG',
	'img/hitsu2.PNG',
	'img/hitsu3.PNG',
	'img/hitsu4.PNG',
	'img/hitsu5.PNG',
	'img/hitsu6.PNG'
];


var next = function(){
    if(nowCnt < hImgs.length - 1){
       nowCnt++;
    }
	showImg(nowCnt);
};

var prev = function(){
    if(nowCnt > 0){
       nowCnt--;
    }
	showImg(nowCnt);
};


var showImg = function(index){
   $("#hImg").attr("src", hImgs[index]);

};
