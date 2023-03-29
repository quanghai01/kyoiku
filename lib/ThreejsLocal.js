var ThreejsLocal = /** @class */ (function () {
    function ThreejsLocal() {
        this.stage = null;
        this.stageW = null;
        this.stageH = null;
        this.renderer = null;
        this.camera = null;
        this.controls = null;
        this.scene = null;
        this.checkBtnFlg = true; //初期値true
        this.sphere = [];
    }
    ThreejsLocal.prototype.init = function (position) {
        var canvas = document.getElementById("appCanvas");
        this.stageW = canvas.clientWidth * 1;
        this.stageH = canvas.clientHeight * 1;
        this.stage = document.getElementById('threeStage');
        this.stage.style.width = this.stageW + "px";
        this.stage.style.height = this.stageH + "px";
        this.stage.style.top = (this.stageH * 0.3) + "px";
        // this.stage.style.left = (this.stageW*0.3)+"px";
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.stageW, this.stageH);
        this.renderer.setClearColor(0xffffff, 1);
        this.stage.appendChild(this.renderer.domElement);
        this.renderer.shadowMap = false;
        this.renderer.autoClear = false;
        //camera
        this.camera = new THREE.OrthographicCamera(this.stageW / -2, this.stageW / 2, this.stageH / 2, this.stageH / -2, 1, 2000);
        this.camera.up.x = 0;
        this.camera.up.y = 1;
        this.camera.up.z = 0;
        this.camera.position.set(0, 200, 500); //(左右 , 上下 , 奥行き)
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableZoom = false;
        this.controls.enabled = false;
        //scene
        this.scene = new THREE.Scene();
        //ligth
        //const alight = new THREE.AmbientLight(0xFFFFFF, 1);
        //const dLight = new THREE.DirectionalLight(0xffffff,2);
        //this.scene.add(alight);
        //this.scene.add(dLight);
        //====
        // let axes = new THREE.AxesHelper(250);
        // this.scene.add(axes);
        //====
        // @ts-ignore
        var textureBase64 = new ThreeTexture();
        var spriteKey = ["a", "i", "u"];
        var spriteSize = 63;
        var spritePos = { "x": -140, "y": 150 };
        //angle 1～179 球の切断位置を角度で表記　!!蓋の開き具合ではない!!
        var angle = [60, 90, 110];
        var pos = [-360, -60, 250];
        var y = -10;
        //createPlateLine() comment out
        // let plateLineYOffset=[2.2, 4, 4];
        // let plateLineYCapOffset=[-50.3, 0.1, 34.4];
        //createPlateLineTorus() comment out
        var plateLineYOffset = [1.9, 4, 4];
        var plateLineYCapOffset = [-50.3, 0.6, 34];
        var radiusOffet = [0.98, 0.99, 1.01];
        for (var i = 0; i < 3; i++) {
            this.sphere[i] = new SphereGroup();
            this.sphere[i].create(angle[i]);
            this.sphere[i].createSprite({ "img": textureBase64.data[spriteKey[i]], "size": spriteSize, "position": spritePos });
            this.sphere[i].getContainer().position.x = pos[i];
            this.sphere[i].getContainer().position.y = y;
            this.sphere[i].setDefaultAngle(-40);
            this.sphere[i].createLine();
            //this.sphere[i].createPlateLine(plateLineYOffset[i], plateLineYCapOffset[i],0.987);//line mesh
            this.sphere[i].createPlateLineTorus(plateLineYOffset[i], plateLineYCapOffset[i], radiusOffet[i]); //tours mesh
            this.scene.add(this.sphere[i].getContainer());
        }
    };
    //アニメーションの回転方向を設定する
    ThreejsLocal.prototype.setAnimationMode = function (type, index) {
        if (type === void 0) { type = 0; }
        if (index === void 0) { index = 0; }
        this.sphere[index].setAnimationPlayMode(type);
        // //線の描画フラグ
        // if(type === 0){
        //     //this.sphere[index].setLineDrawFlg(true);
        // }
        // else{
        //     this.sphere[index].setLineDrawFlg(false);
        // }
    };
    //蓋の回転角度を渡す
    ThreejsLocal.prototype.getAngle = function (index) {
        if (index === void 0) { index = 0; }
        return this.sphere[index].getAngle();
    };
    //線の描画用フラグの設定
    ThreejsLocal.prototype.setLineDrawFlg = function (index, flg) {
        this.sphere[index].setLineDrawFlg(flg);
    };
    //切断面外周
    ThreejsLocal.prototype.setPlateLineVisible = function (index, flg) {
        this.sphere[index].setPlateLineVisible(flg);
    };
    //
    ThreejsLocal.prototype.loop = function () {
        this.controls.update();
        this.renderer.clear();
        for (var i = 0; i < this.sphere.length; i++) {
            this.sphere[i].play();
        }
        //console.log(this.sphere[1].getLineDrawFlg());
        this.renderer.render(this.scene, this.camera);
    };
    return ThreejsLocal;
}());
var SphereGroup = /** @class */ (function () {
    function SphereGroup() {
        //private baseObj = null;//非アニメーション時
        this.animateObj = { "cap": null, "body": null }; //外側
        this.animateInsideObj = { "cap": null, "body": null }; //内側
        this.rotationObj = null;
        this.step = 0.005;
        this.playMode = 0; //ひらく=1,とじる=-1,停止=0
        this.angle = 90; //閉じた状態
        this.lineObj = []; //左右
        this.lineGeometry = null;
        this.linesPosition = { "start": null, "end": null };
        this.lineDrawFlg = false;
        this.textSprite = null;
        //切断面外周線
        this.plateLine = { "cap": null, "body": null }; //上下
        this.container = new THREE.Object3D();
        this.rotationObj = new THREE.Object3D();
        this.container.add(this.rotationObj);
    }
    /*create 球体の生成
    *   一体型obj,蓋とボディで別れたobj,回転用のcontainerの生成
    *    @parm capLength :　蓋の高さ　度数で指定1～179
    * */
    SphereGroup.prototype.create = function (capLength) {
        var radius = 100;
        var segment = [128, 48];
        var color = [0x81CFEF, 0x4790AD]; //側色,身色
        var thetaLength = capLength * Math.PI / 180; //高さ default 2*Math.PI
        var bodyThetaLength = Math.PI * (180 - capLength + 3) / 180;
        //一体型
        // this.baseObj  = new THREE.Mesh(
        //     new THREE.SphereGeometry( radius/10, segment[0], segment[1]) ,
        //     new THREE.MeshBasicMaterial(
        //         {
        //             color:0x00ff00,
        //             side: THREE.FrontSide
        //         }
        //     )
        // )
        // this.container.add(this.baseObj);
        //表面
        this.animateObj["cap"] = new THREE.Mesh(new THREE.SphereGeometry(radius, segment[0], segment[1], 0, 2 * Math.PI, 0, thetaLength), new THREE.MeshBasicMaterial({
            color: color[0],
            side: THREE.Front
        }));
        this.animateObj["body"] = new THREE.Mesh(new THREE.SphereGeometry(radius, segment[0], segment[1], 0, 2 * Math.PI, Math.PI * 1.0, bodyThetaLength), new THREE.MeshBasicMaterial({
            color: color[0],
            side: THREE.BackSide
        }));
        //中身
        this.animateInsideObj["cap"] = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.99, segment[0], segment[1], 0, 2 * Math.PI, 0, thetaLength), new THREE.MeshBasicMaterial({
            color: color[1],
            side: THREE.DoubleSide
        }));
        this.animateInsideObj["body"] = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.99, segment[0], segment[1], 0, 2 * Math.PI, Math.PI, bodyThetaLength), new THREE.MeshBasicMaterial({
            color: color[1],
            side: THREE.DoubleSide
        }));
        for (var key in this.animateObj) {
            if (key == "cap") {
                this.rotationObj.add(this.animateObj[key]);
                this.rotationObj.add(this.animateInsideObj[key]);
            }
            else {
                this.container.add(this.animateObj[key]);
                this.container.add(this.animateInsideObj[key]);
            }
        }
        //蓋の位置調整
        var z = -1 * radius * Math.sin(capLength * (Math.PI / 180));
        var y = radius * Math.cos(capLength * (Math.PI / 180));
        this.rotationObj.position.z = z;
        this.rotationObj.position.y = y;
        this.animateObj["cap"].position.z = z * -1;
        this.animateObj["cap"].position.y = y * -1;
        this.animateInsideObj["cap"].position.z = z * -1;
        this.animateInsideObj["cap"].position.y = y * -1;
        //切り口の平面上　中央左側
        this.linesPosition["start"] = new THREE.Vector3();
        this.linesPosition["start"].x = this.rotationObj.position.z;
        this.linesPosition["start"].y = this.rotationObj.position.y;
        this.linesPosition["start"].z = 0;
        //
        this.linesPosition["end"] = new THREE.Vector3();
    };
    SphereGroup.prototype.createSprite = function (obj) {
        var _this = this;
        if (obj === void 0) { obj = { "img": null, "size": null, "position": { "x": null, "y": null } }; }
        var loader = new THREE.TextureLoader();
        loader.load(obj["img"], function (texture) {
            _this.textSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, color: 0xffffff }));
            _this.textSprite.scale.set(obj["size"], obj["size"], 1);
            _this.textSprite.position.set(obj["position"]["x"], obj["position"]["y"], 0);
            _this.container.add(_this.textSprite);
        });
    };
    SphereGroup.prototype.createLine = function () {
        var lineParm = {
            "base": new THREE.Vector3(this.rotationObj.position.x, this.rotationObj.position.y, this.rotationObj.position.z),
            "radius": Math.abs(this.rotationObj.position.z),
            "angle": this.angle
        };
        var newPoint = new THREE.Vector3(lineParm["base"].z, (lineParm["base"].y + lineParm["radius"] * Math.cos(lineParm["angle"] * (Math.PI / 180))), (lineParm["base"].z + lineParm["radius"] * Math.sin(lineParm["angle"] * (Math.PI / 180))));
        //line
        for (var i = 0; i < this.lineObj.length; i++) {
            if (!this.lineObj[i]) {
                continue;
            }
            this.container.remove(this.lineObj[i]);
            this.lineObj[i].geometry.dispose();
            this.lineObj[i].material.dispose();
            if (this.lineObj[i].texture)
                this.lineObj[i].texture.dispose();
            this.lineGeometry.dispose();
        }
        this.linesPosition["end"] = new THREE.Vector3(newPoint.x, newPoint.y, newPoint.z);
        this.lineGeometry = new THREE.Geometry();
        this.lineGeometry.vertices.push(this.linesPosition["start"]);
        this.lineGeometry.vertices.push(this.linesPosition["end"]);
        this.lineObj[0] = new THREE.Line(this.lineGeometry, new THREE.LineDashedMaterial({
            color: 0x000000,
            dashSize: 16,
            gapSize: 8
        }));
        this.lineObj[1] = this.lineObj[0].clone();
        this.lineObj[1].position.x = -this.linesPosition["start"].x * 2;
        for (var i = 0; i < this.lineObj.length; i++) {
            this.lineObj[i].computeLineDistances();
            this.lineObj[i].visible = this.lineDrawFlg;
            this.container.add(this.lineObj[i]);
        }
    };
    //切断面　Line mesh
    SphereGroup.prototype.createPlateLine = function (yOffset, capYOffset, radiusOffset) {
        //切断面外周半径 = this.rotationObj.position.z
        //切断面外周中心 = this.rotationObj.position.x,this.rotationObj.position.y
        var radius = Math.abs(this.rotationObj.position.z) * radiusOffset;
        var geometry = new THREE.Geometry();
        for (var i = 0; i < 360; i++) {
            //vec3.x = radius * Math.cos(i * (Math.PI / 180));
            //vec3.z = radius * Math.sin(i * (Math.PI / 180));
            geometry.vertices.push(new THREE.Vector3(radius * Math.cos(i * (Math.PI / 180)), 0, radius * Math.sin(i * (Math.PI / 180))));
        }
        this.plateLine["body"] = new THREE.Line(geometry, new THREE.LineBasicMaterial({
            color: 0x000000
        }));
        this.plateLine["body"].position.y = this.rotationObj.position.y + yOffset;
        this.container.add(this.plateLine["body"]);
        this.plateLine["cap"] = this.plateLine["body"].clone();
        this.plateLine["cap"].position.y = this.rotationObj.position.y + capYOffset;
        this.plateLine["cap"].position.z -= this.rotationObj.position.z;
        this.rotationObj.add(this.plateLine["cap"]);
    };
    //切断面　Torus mesh
    SphereGroup.prototype.createPlateLineTorus = function (yOffset, capYOffset, radiusOffset) {
        //切断面外周半径 = this.rotationObj.position.z
        //切断面外周中心 = this.rotationObj.position.x,this.rotationObj.position.y
        var radius = Math.abs(this.rotationObj.position.z) * radiusOffset;
        // let geometry = new THREE.Geometry();
        // for(let i = 0; i<360; i++){
        //     //vec3.x = radius * Math.cos(i * (Math.PI / 180));
        //     //vec3.z = radius * Math.sin(i * (Math.PI / 180));
        //     geometry.vertices.push(new THREE.Vector3(
        //         radius * Math.cos(i * (Math.PI / 180)),
        //         0,
        //         radius * Math.sin(i * (Math.PI / 180))
        //     ));
        // }
        this.plateLine["body"] = new THREE.Mesh(new THREE.TorusGeometry(radius, 1.1, 16, 100), new THREE.MeshBasicMaterial({ color: 0x000000 }));
        this.plateLine["body"].rotation.x = 90 * Math.PI / 180;
        this.plateLine["body"].position.y = this.rotationObj.position.y + yOffset;
        this.container.add(this.plateLine["body"]);
        //
        this.plateLine["cap"] = new THREE.Mesh(new THREE.TorusGeometry(radius * 0.98, 1.0, 16, 100), new THREE.MeshBasicMaterial({ color: 0x000000 }));
        this.plateLine["cap"].rotation.x = 90 * Math.PI / 180;
        this.plateLine["cap"].position.y = this.rotationObj.position.y + capYOffset;
        this.plateLine["cap"].position.z -= this.rotationObj.position.z;
        this.rotationObj.add(this.plateLine["cap"]);
    };
    //
    SphereGroup.prototype.play = function () {
        if (this.playMode === 0) {
            //this.setLineDrawFlg(true);
            return;
        }
        if (this.playMode === 1 && Math.abs(this.angle - 90) >= 180) {
            this.playMode = 0;
            return;
        }
        if (this.playMode === -1 && this.angle - 90 >= 0) {
            this.setLineDrawFlg(false);
            this.playMode = 0;
            return;
        }
        this.angle -= 180 * this.step * this.playMode;
        this.rotationObj.rotation.x = (this.angle - 90) * Math.PI / 180; // * this.playMode;//Math.PI*this.step * this.playMode;
        this.createLine();
    };
    /**
    * 蓋の開き具合初期設定用
     * @parm angle:number 角度
    * */
    SphereGroup.prototype.setDefaultAngle = function (angle) {
        this.angle = -angle;
        this.rotationObj.rotation.x = (this.angle - 90) * Math.PI / 180;
        this.lineDrawFlg = true;
    };
    SphereGroup.prototype.reset = function () {
        this.setAnimationFlg(false);
    };
    SphereGroup.prototype.setAnimationFlg = function (flg) {
        for (var key in this.animateObj) {
            this.animateObj[key].visible = flg;
        }
    };
    SphereGroup.prototype.setAnimationPlayMode = function (num) {
        if (num >= -1 && num <= 1) {
            this.playMode = num;
        }
        else {
            this.playMode = 0;
        }
    };
    SphereGroup.prototype.setLineDrawFlg = function (flg) {
        this.lineDrawFlg = flg;
        for (var i = 0; i < this.lineObj.length; i++) {
            this.lineObj[i].visible = this.lineDrawFlg;
        }
    };
    SphereGroup.prototype.setPlateLineVisible = function (flg) {
        //line
        // for(let key in this.plateLine){
        //     this.plateLine[key].visible = flg;
        // }
        this.plateLine["cap"].visible = flg;
    };
    //
    SphereGroup.prototype.getContainer = function () {
        return this.container;
    };
    SphereGroup.prototype.getPosition = function () {
    };
    SphereGroup.prototype.getAngle = function () {
        return this.angle - 90;
    };
    SphereGroup.prototype.getLineDrawFlg = function () {
        return this.lineDrawFlg;
    };
    return SphereGroup;
}());
