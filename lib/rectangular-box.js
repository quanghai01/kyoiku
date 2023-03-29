//************** Point Name Rule ***************//
// Please take a look on this point name rule.
// This will apply for all function bellow.
//
//            E_______________F
//            /|             /|
//           / |            / |
//         A/__|__________B/  |
//          | H|___________|__|G
//          |  /           |  /
//          | /            | /
//         D|/____________C|/


var camera, scene, renderer;
var outsides = [];
var insides = [];
var sides = [];
var lines = [];
var width = 8, height = 4, depth = 6;
var point = {
    A: {x: -width / 2, y: height / 2, z: depth / 2},
    B: {x: width / 2, y: height / 2, z: depth / 2},
    C: {x: width / 2, y: -height / 2, z: depth / 2},
    D: {x: -width / 2, y: -height / 2, z: depth / 2},
    E: {x: -width / 2, y: height / 2, z: -depth / 2},
    F: {x: width / 2, y: height / 2, z: -depth / 2},
    G: {x: width / 2, y: -height / 2, z: -depth / 2},
    H: {x: -width / 2, y: -height / 2, z: -depth / 2}
};
var vector = {};
var buttonRotate = $("#btnRotate");
var buttonCut = $("#btnCut");
var buttonOpen = $("#btnOpen");
var buttonFold = $("#btnFold");
var btnPressdown = $('.pressdown-animation');
var black = new THREE.Color(0x000000);
var red = new THREE.Color(0xFF2800);
var insideMaterial = new THREE.MeshLambertMaterial({
    color: "#279CD8",
    side: THREE.FrontSide,
    overdraw: true
});

var outsideMaterial = new THREE.MeshBasicMaterial({
    color: "#D4EFFC",
    side: THREE.BackSide,
    overdraw: true
});

var sideMaterial, tubeMaterial;

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var btnWrappers = $('.gm-btn-wrapper');
var body = $('body');
var canvas;
var testCanvas = document.createElement('canvas');
var start = {value: 1};

var updateTween = function () {
    var angle = start.value;

    sides.map(function (side) {
        if (side.parent !== scene) {
            if (!side.rotateSpace) {
                side.rotation[side.rotatePoint] = side.rotateSign * angle * Math.PI / 2;
            } else {
                side.rotation[side.rotatePoint] = side.rotateSign * Math.PI / 2;
            }
        } else if (side.rotateSpace) {
            //Create space
            // var outside = side.children[0];
            if (side.rotateSpace.x) {
                side.position.x = side.positionFit.x + (2 - angle * 2) * Math.sign(side.rotateSpace.x || 1);
            }
            if (side.rotateSpace.y) {
                side.position.y = side.positionFit.y + (2 - angle * 2) * Math.sign(side.rotateSpace.y || 1);
            }
            if (side.rotateSpace.z) {
                side.position.z = side.positionFit.z + (2 - angle * 2) * Math.sign(side.rotateSpace.z || 1);
            }
        }
        // else {
        // side.rotation[side.rotatePoint] = side.rotateSign * Math.PI / 2;
        // }
    });
};

var clickID = 0; //Use for show animation

var openTween = new TWEEN
    .Tween(start)
    .to({value: 0}, start.value * 2000)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(updateTween)
    .onStart(function () {
        //Change button status
        var click = clickID; //Remember click ID
        setTimeout(function () {
            if (buttonOpen.hasClass('gm-active') && click === clickID)
                buttonFold.addClass('gm-disabled');
        }, 400);
        buttonCut.addClass('gm-disabled');

        //Setting open side
        setDefaultSide(); //Reset to default
        checkRotate(); //Rotate side
    })
    .onComplete(function () {
        buttonOpen.removeClass('gm-active').addClass('gm-disabled');
        buttonFold.removeClass('gm-disabled');
    });

var foldTween = new TWEEN
    .Tween(start)
    .to({value: 1}, start.value * 2000)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(updateTween)
    .onStart(function () {
        var click = clickID; //Remember click ID
        setTimeout(function () {
            if (buttonFold.hasClass('gm-active') && click === clickID)
                buttonOpen.addClass('gm-disabled');
        }, 400);

    })
    .onComplete(function () {
        buttonFold.removeClass('gm-active').addClass('gm-disabled');
        buttonCut.removeClass('gm-disabled');
        buttonOpen.removeClass('gm-disabled');
        setDefaultSide(); //Reset to default
    });

var openRectangle = function () {
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    if (!buttonOpen.hasClass('gm-disabled') && !buttonFold.hasClass('gm-active') && (event.which === 1 || !event.which)) {
        buttonOpen.addClass('gm-active');
        openTween.to({value: 0}, start.value * 2000);
        openTween.start();
    }
};

var foldRectangle = function () {
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    if (!buttonFold.hasClass('gm-disabled') && !buttonOpen.hasClass('gm-active') && (event.which === 1 || !event.which)) {
        buttonFold.addClass('gm-active');
        foldTween.to({value: 1}, (1 - start.value) * 2000);
        foldTween.start();
    }
};

var stopRectangle = function (e) {
    if ($(e.currentTarget).hasClass('gm-active')) {
        clickID++; //When press up then change click ID

        event.preventDefault ? event.preventDefault() : (event.returnValue = false);
        foldTween.stop();
        openTween.stop();
        buttonOpen.removeClass('gm-active');
        buttonFold.removeClass('gm-active');
        if (start.value === 0) {
            buttonFold.removeClass('gm-disabled');
        } else if (start.value === 1) {
            buttonOpen.removeClass('gm-disabled');
        } else {
            buttonOpen.removeClass('gm-disabled');
            buttonFold.removeClass('gm-disabled');
        }
    }
};

var mouseDown, mouseMove, mouseUp;
var pick = {isPick: false, x: null, y: null}; //Detect user click to pick an object or move mouse.
var bodyWidth = Math.max(window.innerWidth, 1024), bodyHeight = Math.max(window.innerHeight, 597);
var rotateBox = false, rotateStart = {x: 0, y: 0}, pointerId;

window.onresize = function () {
    bodyWidth = Math.max(window.innerWidth, 1024);
    bodyHeight = Math.max(window.innerHeight, 597);
    body.width(bodyWidth);
    body.height(bodyHeight);
    $('canvas').css("width", bodyWidth).css("height", bodyHeight);

    //Zoom camera
    camera.zoom = detectZoom.zoom();
    camera.aspect = bodyWidth / bodyHeight;
    camera.updateProjectionMatrix();
};

window.onload = function () {
    //Setting body size
    body.width(bodyWidth);
    body.height(bodyHeight);

    //Setting name for event
    if (isTouchDevice()) {
        if (getBrowserName() === "Safari") {
            mouseDown = 'touchstart';
            mouseMove = 'touchmove';
            mouseUp = 'touchend';

            //Disable double tab to zoom
            $('button').on('touchend', function (e) {
                e.preventDefault ? e.preventDefault() : (e.returnValue = false);
                $(this).click();
            });
            $('img').on('touchend', function (e) {
                e.preventDefault ? e.preventDefault() : (e.returnValue = false);
                $(this).click();
            });
            $('.gm-btn-wrapper').on('touchend', function (e) {
                e.preventDefault ? e.preventDefault() : (e.returnValue = false);
                $(this).click();
            });
        } else {
            mouseDown = 'pointerdown';
            mouseMove = 'pointermove';
            mouseUp = 'pointerup';
        }
    } else {
        mouseDown = 'mousedown';
        mouseMove = 'mousemove';
        mouseUp = 'mouseup';
    }

    //Add event setting pick or not
    document.addEventListener(mouseDown, function (e) {
        pick.isPick = true;
        pick.x = e.pageX;
        pick.y = e.pageY;
    });
    document.addEventListener(mouseMove, function (e) {
        if (pick.x - 5 >= e.pageX || pick.x + 5 <= e.pageX || pick.y - 5 >= e.pageY || pick.y + 5 <= e.pageY)
            pick.isPick = false;
    });

    //Add button event
    buttonRotate.on('click', function () {
        buttonRotate.hasClass('gm-active') ? buttonRotate.removeClass('gm-active') : buttonRotate.addClass('gm-active');
        if (buttonRotate.hasClass('gm-active')) {
            document.addEventListener(mouseDown, startRotate);
            document.addEventListener(mouseMove, onRotate);
            document.addEventListener(mouseUp, endRotate);
        } else {
            document.removeEventListener(mouseDown, startRotate);
            document.removeEventListener(mouseMove, onRotate);
            document.removeEventListener(mouseUp, endRotate);
        }
    });

    buttonCut.on('click', function () {
        if (!buttonCut.hasClass('gm-disabled')) {
            buttonCut.hasClass('gm-active') ? buttonCut.removeClass('gm-active') : buttonCut.addClass('gm-active');
            if (buttonCut.hasClass('gm-active')) {
                checkOpen();
            }
        }
    });

    buttonOpen.on(mouseDown, openRectangle);
    buttonOpen.on(mouseUp + " mouseout", stopRectangle);
    buttonFold.on(mouseDown, foldRectangle);
    buttonFold.on(mouseUp + " mouseout", stopRectangle);

    init();
    createBorder();
    animate();

};

function webglAvailable() {
    try {
        return !!(window.WebGLRenderingContext && (
                testCanvas.getContext('webgl') ||
                testCanvas.getContext('experimental-webgl'))
        );
    } catch (e) {
        return false;
    }
}

function init() {
    scene = new THREE.Scene();
    scene.rotation.x = 0.4;
    scene.rotation.y = -0.4;
    camera = new THREE.PerspectiveCamera(45, bodyWidth / bodyHeight, 1, 1000);
    camera.position.set(0, 0, 40);
    camera.zoom = detectZoom.zoom();
    camera.updateProjectionMatrix();

    //Setting lights
    var lights = [];
    var distance = 100000;
    var intensity = 1.045;
    var positionX = 1000;
    var positionY = 1000;
    var positionZ = 1000;
    //Right
    lights[0] = new THREE.PointLight(0xD4EFFC, intensity, distance);
    lights[0].position.set(positionX, 0, 0);
    scene.add(lights[0]);
    //Top
    lights[1] = new THREE.PointLight(0xFFFFFF, intensity, distance);
    lights[1].position.set(0, positionY, 0);
    scene.add(lights[1]);
    //Front
    lights[2] = new THREE.PointLight(0xF1FAFD, intensity, distance);
    lights[2].position.set(0, 0, positionZ);
    scene.add(lights[2]);
    //Left
    lights[3] = new THREE.PointLight(0xD4EFFC, intensity, distance);
    lights[3].position.set(-positionX, 0, 0);
    scene.add(lights[3]);
    //Bottom
    lights[4] = new THREE.PointLight(0xFFFFFF, intensity, distance);
    lights[4].position.set(0, -positionY, 0);
    scene.add(lights[4]);
    //Back
    lights[5] = new THREE.PointLight(0xF1FAFD, intensity, distance);
    lights[5].position.set(0, 0, -positionZ);
    scene.add(lights[5]);

    //Check browser support web GL or not.
    if (webglAvailable()) {
        renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        sideMaterial = new THREE.MeshBasicMaterial({
            visible: false
        });

        tubeMaterial = new THREE.MeshBasicMaterial({color: black, side: THREE.DoubleSide, visible: false});
    } else {
        renderer = new THREE.CanvasRenderer({antialias: true, alpha: true});
        sideMaterial = new THREE.MeshBasicMaterial({
            opacity: 0
        });

        tubeMaterial = new THREE.MeshBasicMaterial({color: black, side: THREE.DoubleSide, opacity: 0})
    }
    renderer.setSize(bodyWidth, bodyHeight, true);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);
    canvas = document.getElementsByTagName('canvas')[0];

    //Create box's side
    setDefaultSide();

    canvas.addEventListener('click', onDocumentClick);

    //Add rotate box event
    $('canvas').css('touch-action', 'none');
    $('*').on("contextmenu", function (e) {
        //Disable right click
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        return false;
    });

    $('*').on(mouseMove, function (e) {
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    });

    //Animation for buttons
    btnPressdown.on("mousedown touchstart", function (e) {
        if (e.which === 1 || e.type === "touchstart") {
            $(e.target).addClass('gm-active');
        }
    });
    btnPressdown.on("mouseup mouseout touchend", function (e) {
        if (e.which === 1 || e.type === "touchend") {
            $(e.target).removeClass('gm-active');
        }
    });

    document.addEventListener(mouseDown, startRotate);
    document.addEventListener(mouseMove, onRotate);
    document.addEventListener(mouseUp, endRotate);
}

function notRightClick(event) {
    if (event.nativeEvent) {
        return event.nativeEvent.which === 1 || !event.nativeEvent.which;
    } else {
        return event.which === 1 || !event.which || event.buttons === 1;
    }
}

function startRotate(e) {
    if (e.target === canvas && notRightClick(e)) {
        var x, y;
        switch (mouseMove) {
            case 'touchmove':
                x = e.targetTouches[0].clientX;
                y = e.targetTouches[0].clientY;
                break;
            case 'pointermove':
                if (e.isPrimary && pointerId === undefined) {
                    pointerId = e.pointerId;
                    x = e.pageX;
                    y = e.pageY;
                } else {
                    x = rotateStart.x;
                    y = rotateStart.y;
                }
                break;
            default:
                x = e.pageX;
                y = e.pageY;
                break;
        }
        rotateBox = true;
        rotateStart.x = x;
        rotateStart.y = y;
    }
}

function onRotate(e) {
    if (rotateBox && !(pick.isPick && buttonCut.hasClass('gm-active') && !buttonCut.hasClass('gm-disabled')) && notRightClick(e)) {
        var x, y;
        switch (mouseMove) {
            case 'touchmove':
                x = e.targetTouches[0].clientX;
                y = e.targetTouches[0].clientY;
                break;
            case 'pointermove':
                if (e.pointerId === pointerId) {
                    x = e.pageX;
                    y = e.pageY;
                } else {
                    x = rotateStart.x;
                    y = rotateStart.y;
                }
                break;
            default:
                x = e.pageX;
                y = e.pageY;
                break;
        }
        scene.rotation.x += (y - rotateStart.y) / 100;
        var degX = Math.abs(scene.rotation.x % (2 * Math.PI));
        if (degX <= Math.PI / 2 || degX >= Math.PI * 1.5)
            scene.rotation.y += (x - rotateStart.x) / 100;
        else
            scene.rotation.y -= (x - rotateStart.x) / 100;
        rotateStart.x = x;
        rotateStart.y = y;
    }
}

function endRotate(e) {
    if (!notRightClick(e)) {
        return false;
    }
    if (pointerId === undefined) {
        rotateBox = false;
    } else if (e.pointerId === pointerId) {
        pointerId = undefined;
        rotateBox = false;
    }
}

/* Get Vector
*
* Input: Point A {x,y,z} & B {x,y,z}
* Return: vector AB {x,y,z}
* */
function getVector(A, B) {
    return {x: B.x - A.x, y: B.y - A.y, z: B.z - A.z};
}

/* Get Center
* Get center of rectangular or line
*
* Input: name (type: string) such as: 'DCBA', 'AB'...
* Output: point {x,y,z}
* */

function getCenter(name) {
    try {
        var center = {x: 0, y: 0, z: 0};

        for (i = 0; i < name.length; i++) {
            center.x += point[name[i]].x;
            center.y += point[name[i]].y;
            center.z += point[name[i]].z;
        }

        return {
            x: center.x / name.length,
            y: center.y / name.length,
            z: center.z / name.length
        }
    } catch (e) {
        return e;
    }
}

function setDefaultSide() {
    //bottom side
    declareFace('HGCD', {
        width: width,
        height: depth,
        position: getCenter('HGCD'),
        rotation: {x: -Math.PI / 2, y: 0, z: 0},
        edges: ['HG', 'GC', 'CD', 'DH']
    });

    //top side
    declareFace('ABFE', {
        width: width,
        height: depth,
        position: getCenter('ABFE'),
        rotation: {x: Math.PI / 2, y: 0, z: 0},
        edges: ['AB', 'BF', 'FE', 'EA']
    });

    //left side
    declareFace('AEHD', {
        width: depth,
        height: height,
        position: getCenter('AEHD'),
        rotation: {x: 0, y: Math.PI / 2, z: 0},
        edges: ['AE', 'EH', 'HD', 'DA']
    });

    //front side
    declareFace('DCBA', {
        width: width,
        height: height,
        position: getCenter('DCBA'),
        rotation: {x: Math.PI, y: 0, z: 0},
        edges: ['DC', 'CB', 'BA', 'AD']
    });

    //right side
    declareFace('FBCG', {
        width: depth,
        height: height,
        position: getCenter('FBCG'),
        rotation: {x: 0, y: -Math.PI / 2, z: 0},
        edges: ['FB', 'BC', 'CG', 'GF']
    });

    //back side
    declareFace('EFGH', {
        width: width,
        height: height,
        position: getCenter('EFGH'),
        rotation: {x: 0, y: 0, z: 0},
        edges: ['EF', 'FG', 'GH', 'HE']
    });
}

// Set face with size, position, rotation
function declareFace(name, option) {
    var sideExist = scene.getObjectByName(name);
    if (sideExist) {
        THREE.SceneUtils.detach(sideExist, sideExist.parent, scene);
        THREE.SceneUtils.attach(sideExist, scene, scene);
        sideExist.position.set(option.position.x, option.position.y, option.position.z);
        sideExist.positionFit = option.position;
        sideExist.rotation.x = option.rotation.x;
        sideExist.rotation.y = option.rotation.y;
        sideExist.rotation.z = option.rotation.z;
        sideExist.rotatePoint = undefined;
        sideExist.rotateSign = null;
        sideExist.rotateSpace = null;
        sideExist.dependence = [];

        //Reset outside
        sideExist.children[0].position.set(0, 0, 0);
        // sideExist.children[0].positionFit = {x: 0, y: 0, z: 0};
        sideExist.children[0].rotation.x = 0;
        sideExist.children[0].rotation.y = 0;
        sideExist.children[0].rotation.z = 0;
    } else {
        var sideGeom = new THREE.PlaneGeometry(option.width, option.height);
        var side = new THREE.Mesh(sideGeom, sideMaterial);
        side.position.set(option.position.x, option.position.y, option.position.z);
        side.positionFit = option.position;
        side.rotation.x = option.rotation.x;
        side.rotation.y = option.rotation.y;
        side.rotation.z = option.rotation.z;
        side.rotatePoint = undefined;
        side.rotateSign = null;
        side.rotateSpace = null;
        side.name = name;
        side.edges = option.edges;
        side.cut = []; //The edges have been cut
        side.dependence = []; //The edges don't cut but it can be depend on other side if it's open
        sides.push(side);
        scene.add(side);

        var outsideGeom = new THREE.PlaneGeometry(option.width, option.height);
        var outside = new THREE.Mesh(outsideGeom, outsideMaterial);
        // outside.positionFit = {x: 0, y: 0, z: 0};
        outsides.push(outside);
        side.add(outside);

        var insideGeom = new THREE.PlaneGeometry(option.width, option.height);
        var inside = new THREE.Mesh(insideGeom, insideMaterial);
        insides.push(inside);
        outside.add(inside);

        //Line general setting
        if (webglAvailable()) {
            var material = new MeshLineMaterial({
                color: black,
                lineWidth: 0.05
            });
            var line = new MeshLine();

            //Line top
            var lineTopGeom = new THREE.Geometry();
            lineTopGeom.vertices.push(
                new THREE.Vector3(-option.width / 2, option.height / 2, 0),
                new THREE.Vector3(option.width / 2, option.height / 2, 0)
            );
            line.setGeometry(lineTopGeom);
            var lineTopMesh = new THREE.Mesh(line.geometry.clone(), material.clone());
            lineTopMesh.name = 'line-' + option.edges[0];
            outside.add(lineTopMesh);

            //Line right
            var lineRightGeom = new THREE.Geometry();
            lineRightGeom.vertices.push(
                new THREE.Vector3(option.width / 2, option.height / 2, 0),
                new THREE.Vector3(option.width / 2, -option.height / 2, 0)
            );
            line.setGeometry(lineRightGeom);
            var lineRightMesh = new THREE.Mesh(line.geometry.clone(), material.clone());
            lineRightMesh.name = 'line-' + option.edges[1];
            outside.add(lineRightMesh);

            //Line bottom
            var lineBottomGeom = new THREE.Geometry();
            lineBottomGeom.vertices.push(
                new THREE.Vector3(option.width / 2, -option.height / 2, 0),
                new THREE.Vector3(-option.width / 2, -option.height / 2, 0)
            );

            line.setGeometry(lineBottomGeom);
            var lineBottomMesh = new THREE.Mesh(line.geometry.clone(), material.clone());
            lineBottomMesh.name = 'line-' + option.edges[2];
            outside.add(lineBottomMesh);

            //Line left
            var lineLeftGeom = new THREE.Geometry();
            lineLeftGeom.vertices.push(
                new THREE.Vector3(-option.width / 2, -option.height / 2, 0),
                new THREE.Vector3(-option.width / 2, option.height / 2, 0)
            );
            line.setGeometry(lineLeftGeom);
            var lineLeftMesh = new THREE.Mesh(line.geometry.clone(), material.clone());
            lineLeftMesh.name = 'line-' + option.edges[3];
            outside.add(lineLeftMesh);
        } else {
            var basicLine = new THREE.LineBasicMaterial({
                color: black,
                linewidth: 5
            });
            //Line top
            var lineTopGeom = new THREE.Geometry();
            lineTopGeom.vertices.push(
                new THREE.Vector3(-option.width / 2, option.height / 2, 0),
                new THREE.Vector3(option.width / 2, option.height / 2, 0)
            );
            var lineTop = new THREE.Line(lineTopGeom, basicLine.clone());
            lineTop.computeLineDistances();
            lineTop.name = 'line-' + option.edges[0];
            outside.add(lineTop);

            //Line right
            var lineRightGeom = new THREE.Geometry();
            lineRightGeom.vertices.push(
                new THREE.Vector3(option.width / 2, option.height / 2, 0),
                new THREE.Vector3(option.width / 2, -option.height / 2, 0)
            );
            var lineRight = new THREE.Line(lineRightGeom, basicLine.clone());
            lineRight.computeLineDistances();
            lineRight.name = 'line-' + option.edges[1];
            outside.add(lineRight);

            //Line bottom
            var lineBottomGeom = new THREE.Geometry();
            lineBottomGeom.vertices.push(
                new THREE.Vector3(option.width / 2, -option.height / 2, 0),
                new THREE.Vector3(-option.width / 2, -option.height / 2, 0)
            );
            var lineBottom = new THREE.Line(lineBottomGeom, basicLine.clone());
            lineBottom.computeLineDistances();
            lineBottom.name = 'line-' + option.edges[2];
            outside.add(lineBottom);

            //Line left
            var lineLeftGeom = new THREE.Geometry();
            lineLeftGeom.vertices.push(
                new THREE.Vector3(-option.width / 2, -option.height / 2, 0),
                new THREE.Vector3(-option.width / 2, option.height / 2, 0)
            );
            var lineLeft = new THREE.Line(lineLeftGeom, basicLine.clone());
            lineLeft.computeLineDistances();
            lineLeft.name = 'line-' + option.edges[3];
            outside.add(lineLeft);
        }
    }
}

function createBorder() {
    //Declare Line
    lines.push(declareLine('AB', point.A, point.B));
    lines.push(declareLine('BC', point.B, point.C));
    lines.push(declareLine('CD', point.C, point.D));
    lines.push(declareLine('AD', point.A, point.D));
    lines.push(declareLine('AE', point.A, point.E));
    lines.push(declareLine('BF', point.B, point.F));
    lines.push(declareLine('CG', point.C, point.G));
    lines.push(declareLine('DH', point.D, point.H));
    lines.push(declareLine('EF', point.E, point.F));
    lines.push(declareLine('FG', point.F, point.G));
    lines.push(declareLine('GH', point.G, point.H));
    lines.push(declareLine('EH', point.E, point.H));

    //Display line
    lines.map(function (line) {
        scene.add(line);
    });
}

function declareLine(name, start, end) {
    //Create vector
    vector[name] = getVector(start, end);

    CustomSinCurve.prototype = Object.create(THREE.Curve.prototype);
    CustomSinCurve.prototype.constructor = CustomSinCurve;
    CustomSinCurve.prototype.getPoint = function (t) {
        return new THREE.Vector3(t * vector[name].x, t * vector[name].y, t * vector[name].z)
            .multiplyScalar(this.scale);
    };

    var path = new CustomSinCurve(); //width
    var geometry = new THREE.TubeGeometry(path, 1, 0.5, 8, false);
    var line = new THREE.Mesh(geometry, tubeMaterial.clone());
    Object.assign(line.position, start);
    line.name = name;
    return line;
}

function CustomSinCurve(scale) {
    THREE.Curve.call(this);
    this.scale = (scale === undefined) ? 1 : scale;
}

//Click on Document
function onDocumentClick(event) {
    //Check cut mode is On or Off
    if (buttonCut.hasClass('gm-active') && !buttonCut.hasClass('gm-disabled') && pick.isPick) {
        event.preventDefault();
        mouse.x = (event.offsetX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.offsetY / renderer.domElement.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        //Catch event click on line, outsides & inside
        var intersects = raycaster.intersectObjects(lines.concat(outsides, insides));

        if (intersects.length > 0) {
            //If click on line in the front (index is 0)
            if (intersects[0].object.geometry.type === "TubeGeometry") {
                changeEdgeToCut(intersects[0]);
            }
        }
    }
}

function changeEdgeToCut(intersect) {
    //Add or Remove edge to cut
    intersect.object.material.color = intersect.object.material.color.equals(black) ? red : black;
    // intersect.object.material.visible = intersect.object.material.visible === false;
    sides.map(function (outside) {
        //If 2 points of line belong to 1 face then that line belong to that face
        if (outside.name.search(intersect.object.name.charAt(0)) >= 0
            && outside.name.search(intersect.object.name.charAt(1)) >= 0) {
            if (intersect.object.material.color.equals(red)) {
                //Add edge to cut
                outside.edges.map(function (edge) {
                    if (checkSameEdge(edge, intersect.object.name)) {
                        if (webglAvailable()) {
                            outside.getObjectByName("line-" + edge).material.uniforms.color.value = red;
                        }
                        else {
                            outside.getObjectByName("line-" + edge).material.color = red;
                        }
                        outside.cut.push(edge);
                    }
                });
            } else {
                //Remove edge
                outside.cut.map(function (edgeCut, index) {
                    if (checkSameEdge(edgeCut, intersect.object.name)) {
                        if (webglAvailable()) {
                            outside.getObjectByName("line-" + edgeCut).material.uniforms.color.value = black;
                        }
                        else {
                            outside.getObjectByName("line-" + edgeCut).material.color = black;
                        }
                        outside.cut.splice(index, 1);
                    }
                });
            }
        }
    });

    checkOpen();
}

/* Check Open
* This function will enable open button when have a side was cut 3 times
*
* */
function checkOpen() {
    //Check cut enough to open or not
    var enough = false;
    sides.map(function (outside) {
        if (outside.cut.length >= 3) {
            enough = true;
        }
    });

    //Detect cut 3-3 side nearly not rotate
    var cut33NotRotate = true; // Each side will cut 2 edge nearly
    var pointSame = [];
    sides.map(function (side) {
        if (side.cut.length === 2) {
            var point = getSamePointOfTwoEdges(side.cut[0], side.cut[1]);
            point && pointSame.indexOf(point) === -1 ? pointSame.push(point) : cut33NotRotate = false;
        } else {
            cut33NotRotate = false;
        }
    });


    enough || cut33NotRotate ? buttonOpen.removeClass('gm-disabled') : buttonOpen.addClass('gm-disabled');
}

/* Check Rotate
* Check what side childSide can rotate around
*
* Input: Children Side
* */
function checkRotate() {

    //Cut 3 edges
    sides.map(function (childSide) {
        if (childSide.cut.length === 3 && childSide.dependence.length === 0) {
            var uncutEdge = findUncutEdges(childSide);
            var parentSide = otherSideOfEdge(uncutEdge[0], childSide.name);
            setRotate(childSide, parentSide);
            parentSide.dependence.push(uncutEdge[0]);
        }
    });

    //Cut 2 edges and 1 edge dependence
    sides.map(function (childSide) {
        if (childSide.cut.length === 2 && childSide.dependence.length === 1) {
            var uncutEdge = findUncutEdges(childSide);
            var parentSide = otherSideOfEdge(uncutEdge[0], childSide.name);
            setRotate(childSide, parentSide);
            parentSide.dependence.push(uncutEdge[0]);
        }
    });

    //Cut 1 edge and 2 edges dependence
    sides.map(function (childSide) {
        if (childSide.cut.length === 1 && childSide.dependence.length === 2) {
            var uncutEdge = findUncutEdges(childSide);
            var parentSide = otherSideOfEdge(uncutEdge[0], childSide.name);
            setRotate(childSide, parentSide);
            parentSide.dependence.push(uncutEdge[0]);
        }
    });

    //Cut 4 edges
    sides.map(function (side) {
        if (side.parent === scene && side.cut.length + side.dependence.length === 4 && side.cut.length !== 0 && !isLastSideNotRotate(side)) {
            side.rotateSpace = side.position;
        }
    });

    //Detect just cut 2 edges nearly
    var countSideOnScene = 0;
    var countSpace = 0;
    sides.map(function (side) {
        if (side.parent === scene) {
            countSideOnScene++;
        }
        if (side.rotateSpace) {
            countSpace++;
        }
    });
    if (countSideOnScene === 5 && countSpace === 1) {
        sides.map(function (parentSide) {
            if (parentSide.rotateSpace) {
                sides.map(function (childSide) {
                    if (childSide.parent.parent === parentSide) {
                        childSide.rotateSpace = childSide.position;
                        parentSide.rotateSpace.x = parentSide.rotateSpace.x || childSide.positionFit.x;
                        parentSide.rotateSpace.y = parentSide.rotateSpace.y || childSide.positionFit.y;
                        parentSide.rotateSpace.z = parentSide.rotateSpace.z || childSide.positionFit.z;
                    }
                });
            }
        });
    }

    //Detect cut 3-3 side nearly not rotate
    if (countSideOnScene === 6) {
        var cut33NotRotate = true; // Each side will cut 2 edge nearly
        var pointSame = [];
        sides.map(function (side) {
            if (side.cut.length === 2) {
                var point = getSamePointOfTwoEdges(side.cut[0], side.cut[1]);
                point && pointSame.indexOf(point) === -1 ? pointSame.push(point) : cut33NotRotate = false;
            } else {
                cut33NotRotate = false;
            }
        });

        //Open top side
        if (cut33NotRotate) {
            var uncutEdge = findUncutEdges(sides[1]);
            var childSide1 = otherSideOfEdge(uncutEdge[0], sides[1].name);
            var childSide2 = otherSideOfEdge(uncutEdge[1], sides[1].name);
            setRotate(childSide1, sides[1]);
            setRotate(childSide2, sides[1]);
            sides[1].rotateSpace = sides[1].position;
            childSide1.rotateSpace = childSide1.position;
            sides[1].rotateSpace.x = sides[1].rotateSpace.x || childSide1.positionFit.x;
            sides[1].rotateSpace.y = sides[1].rotateSpace.y || childSide1.positionFit.y;
            sides[1].rotateSpace.z = sides[1].rotateSpace.z || childSide1.positionFit.z;

            childSide2.rotateSpace = childSide1.position;
            sides[1].rotateSpace.x = sides[1].rotateSpace.x || childSide2.positionFit.x;
            sides[1].rotateSpace.y = sides[1].rotateSpace.y || childSide2.positionFit.y;
            sides[1].rotateSpace.z = sides[1].rotateSpace.z || childSide2.positionFit.z;
        }
    }

    //2 side on scene nearly not rotate
    if (countSideOnScene === 2) {
        var parentSides = [];
        sides.map(function (side) {
            if (side.parent === scene && !side.rotateSpace && !side.rotatePoint) {
                parentSides.push(side);
            }
        });
        if (parentSides.length === 2) {
            if (findTheSameEdge(parentSides[0], parentSides[1])) {
                setRotate(parentSides[0], parentSides[1]);
            }
        }
    }
}

/* Set rotation
* Setting Children side rotation around Parent side
* Note: if childSide had rotate around another side, this function will be cancel
*
* Input: Children Side, Parent Side
* */
function setRotate(childSide, parentSide) {
    //We need at least one side not rotate to display box
    //If childSide is last side or rotate around another side then it can't rotate
    if (isLastSideNotRotate(childSide)) {
        return;
    }

    var edge = findTheSameEdge(childSide, parentSide);
    var centerParent = getCenter(parentSide.name);
    var centerEdge = getCenter(edge);
    var vectorParentEdge = getVector(centerParent, centerEdge);

    //Change parent side
    THREE.SceneUtils.detach(childSide, childSide.parent, scene);
    THREE.SceneUtils.attach(childSide, scene, parentSide.children[0]);

    //Reset rotation
    childSide.rotation.x = 0;
    childSide.rotation.y = 0;
    childSide.rotation.z = 0;

    //Custom position & rotation
    switch (parentSide.name) { //Check parent side
        case 'EFGH': //Back
            childSide.position.set(vectorParentEdge.x, vectorParentEdge.y, vectorParentEdge.z);
            if (childSide.name === 'ABFE') { //Child side on Top
                childSide.children[0].position.set(0, depth / 2, 0);
                childSide.rotatePoint = 'x';
                childSide.rotateSign = 1;
            } else if (childSide.name === 'HGCD') { //Child side at the Bottom
                childSide.children[0].position.set(0, -depth / 2, 0);
                childSide.rotatePoint = 'x';
                childSide.rotateSign = -1;
            } else if (childSide.name === 'AEHD') { //Child side on the Left
                childSide.children[0].position.set(-depth / 2, 0, 0);
                childSide.rotatePoint = 'y';
                childSide.rotateSign = 1;
            } else if (childSide.name === 'FBCG') { //Child side on the Right
                childSide.children[0].position.set(depth / 2, 0, 0);
                childSide.rotatePoint = 'y';
                childSide.rotateSign = -1;
            }
            break;
        case 'DCBA': //Front
            childSide.position.set(vectorParentEdge.x, -vectorParentEdge.y, vectorParentEdge.z);
            if (childSide.name === 'ABFE') { //Child side on Top
                childSide.children[0].position.set(0, -depth / 2, 0);
                childSide.rotatePoint = 'x';
                childSide.rotateSign = -1;
            } else if (childSide.name === 'HGCD') { //Child side at the Bottom
                childSide.children[0].position.set(0, depth / 2, 0);
                childSide.rotatePoint = 'x';
                childSide.rotateSign = 1;
            } else if (childSide.name === 'FBCG') { //Child side on the Left
                childSide.children[0].position.set(-depth / 2, 0, 0);
                childSide.rotateZ(Math.PI);
                childSide.rotatePoint = 'y';
                childSide.rotateSign = -1;
            } else if (childSide.name === 'AEHD') { //Child side on the Right
                childSide.children[0].position.set(depth / 2, 0, 0);
                childSide.rotateZ(Math.PI);
                childSide.rotatePoint = 'y';
                childSide.rotateSign = 1;
            }
            break;
        case 'AEHD': //Left
            childSide.position.set(-vectorParentEdge.z, vectorParentEdge.y, vectorParentEdge.x);
            if (childSide.name === 'ABFE') { //Child side is Top
                childSide.rotateZ(Math.PI / 2);
                childSide.children[0].position.set(height, 0, 0);
                childSide.rotatePoint = 'x';
                childSide.rotateSign = 1;
            } else if (childSide.name === 'HGCD') { //Child side at the Bottom
                childSide.rotateZ(-Math.PI / 2);
                childSide.children[0].position.set(height, 0, 0);
                childSide.rotatePoint = 'x';
                childSide.rotateSign = -1;
            } else if (childSide.name === 'DCBA') { //Child side on the Left
                childSide.children[0].position.set(-height, 0, 0);
                childSide.children[0].rotateZ(Math.PI);
                childSide.rotatePoint = 'y';
                childSide.rotateSign = 1;
            } else if (childSide.name === 'EFGH') { //Child side on the Right
                childSide.children[0].position.set(height, 0, 0);
                childSide.rotatePoint = 'y';
                childSide.rotateSign = -1;
            }
            break;
        case 'FBCG': //Right
            childSide.position.set(vectorParentEdge.z, vectorParentEdge.y, vectorParentEdge.x);
            if (childSide.name === 'ABFE') { //Child side is Top
                childSide.rotateZ(-Math.PI / 2);
                childSide.children[0].position.set(-height, 0, 0);
                childSide.rotatePoint = 'x';
                childSide.rotateSign = 1;
            } else if (childSide.name === 'HGCD') { //Child side at the Bottom
                childSide.rotateZ(Math.PI / 2);
                childSide.children[0].position.set(-height, 0, 0);
                childSide.rotatePoint = 'x';
                childSide.rotateSign = -1;
            } else if (childSide.name === 'DCBA') { //Child side on the Right
                childSide.children[0].position.set(height, 0, 0);
                childSide.children[0].rotateZ(Math.PI);
                childSide.rotatePoint = 'y';
                childSide.rotateSign = -1;
            } else if (childSide.name === 'EFGH') { //Child side on the Left
                childSide.children[0].position.set(-height, 0, 0);
                childSide.rotatePoint = 'y';
                childSide.rotateSign = 1;
            }
            break;
        case 'HGCD': //Bottom
            childSide.position.set(vectorParentEdge.x, -vectorParentEdge.z, vectorParentEdge.y);
            if (childSide.name === 'EFGH') { //Child side in the Back
                childSide.children[0].position.set(0, height / 2, 0);
                childSide.rotatePoint = 'x';
                childSide.rotateSign = 1;
            } else if (childSide.name === 'DCBA') { //Child side on the Front
                childSide.children[0].position.set(0, -height / 2, 0);
                childSide.rotatePoint = 'x';
                childSide.rotateSign = -1;
            } else if (childSide.name === 'FBCG') { //Child side on the Right
                childSide.rotateZ(-Math.PI / 2);
                childSide.children[0].position.set(0, height / 2, 0);
                childSide.rotatePoint = 'y';
                childSide.rotateSign = -1;
            } else if (childSide.name === 'AEHD') { //Child side on the Left
                childSide.rotateZ(Math.PI / 2);
                childSide.children[0].position.set(0, height / 2, 0);
                childSide.rotatePoint = 'y';
                childSide.rotateSign = 1;
            }
            break;
        case 'ABFE': //Top
            childSide.position.set(vectorParentEdge.x, vectorParentEdge.z, vectorParentEdge.y);
            if (childSide.name === 'EFGH') { //Child side in the Back
                childSide.children[0].position.set(0, -height / 2, 0);
                childSide.rotatePoint = 'x';
                childSide.rotateSign = -1;
            } else if (childSide.name === 'DCBA') { //Child side on the Front
                childSide.children[0].position.set(0, height / 2, 0);
                childSide.rotatePoint = 'x';
                childSide.rotateSign = 1;
            } else if (childSide.name === 'FBCG') { //Child side on the Right
                childSide.rotateZ(Math.PI / 2);
                childSide.children[0].position.set(0, -height / 2, 0);
                childSide.rotatePoint = 'y';
                childSide.rotateSign = -1;
            } else if (childSide.name === 'AEHD') { //Child side on the Left
                childSide.rotateZ(-Math.PI / 2);
                childSide.children[0].position.set(0, -height / 2, 0);
                childSide.rotatePoint = 'y';
                childSide.rotateSign = 1;
            }
            break;
        default:
            break;
    }

    // childSide.children[0].positionFit.x = childSide.children[0].position.x;
    // childSide.children[0].positionFit.y = childSide.children[0].position.y;
    // childSide.children[0].positionFit.z = childSide.children[0].position.z;
}

/* Find The Same Edge
* This function will find the same edge of 2 side
* Example: AB is the same edge of DCBA & ABFE
*
* Input: 2 side
* Output: Edge name (String)
* */
function findTheSameEdge(side1, side2) {
    var edgeName = '';
    for (i = 0; i < side1.name.length; i++) {
        for (j = 0; j < side2.name.length; j++) {
            if (side1.name[i] === side2.name[j]) {
                edgeName += side1.name[i];
            }
        }
    }
    return edgeName;
}


/* Find Uncut Edges
* Find list uncut edges, include the edges weren't cut and the edges weren't have side rotate (dependence)
*
* Input: Side
* Output: Uncut Edge (Array)
* */
function findUncutEdges(side) {
    var uncut = [];

    side.edges.map(function (edge) {
        var flag = false;
        //Has this edge cut yet?
        side.cut.map(function (edgeCut) {
            if (checkSameEdge(edge, edgeCut)) {
                flag = true;
            }
        });
        //Has this edge depend on beside side
        side.dependence.map(function (edgeCut) {
            if (checkSameEdge(edge, edgeCut)) {
                flag = true;
            }
        });

        //If this edge hasn't been cut or beside side isn't open then it's uncut edge
        if (!flag) {
            uncut.push(edge);
        }
    });

    return uncut;
}

/* Other Side Of Edge
* Find other side of edge to set it's parent and rotate around it
*
* Input: Edge's name, Side's name
* Output: Side
* */
function otherSideOfEdge(edgeName, sideName) {
    for (i = 0; i < sides.length; i++) {
        if (sides[i].name !== sideName) {
            for (j = 0; j < sides[i].edges.length; j++) {
                if (checkSameEdge(sides[i].edges[j], edgeName)) {
                    return sides[i];
                }
            }
        }
    }
}

/* Check Same Edge
* An edge have 2 name. This function will check 2 edge's name are same.
* Example: AB & BA are same edge.
*
* Input: Name of 2 edge
* Output: boolean
* */
function checkSameEdge(edge1, edge2) {
    return (edge1 === edge2) || ((edge1[0] === edge2[1]) && (edge1[1] === edge2[0]));
}

/* Check last side not rotate
* This function will check a side is the-last-side-not-rotate, or not
* We need at least one side not rotate to display box
* Note: This function will return 'false' if this side had rotate around another side
*
* Input: side
* Output: boolean (true/false)
* */

function isLastSideNotRotate(side) {
    var isLastSide = !side.rotatePoint;

    for (i = 0; i < sides.length; i++) {
        if (sides[i] !== side && !sides[i].rotatePoint) {
            isLastSide = false;
        }
    }

    return isLastSide;
}


// animate
function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    render();
}


function render() {
    renderer.render(scene, camera);
}

//Check touch device
function isTouchDevice() {
    return 'ontouchstart' in window        // check on most browsers
        || navigator.maxTouchPoints;       // check on IE10/11 and Surface
}

//Check Browser
function getBrowserName() {
    // Opera 8.0+
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

    // Firefox 1.0+
    var isFirefox = typeof InstallTrigger !== 'undefined';

    // Safari 3.0+ "[object HTMLElementConstructor]"
    var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;

    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;

    // Chrome 1+
    var isChrome = !!window.chrome && !!window.chrome.webstore;

    // Blink engine detection
    var isBlink = (isChrome || isOpera) && !!window.CSS;

    var name = "Unknown";
    if (isEdge) {
        name = "Edge";
    } else if (isIE) {
        name = "IE"
    } else if (isFirefox) {
        name = "Firefox";
    } else if (isOpera) {
        name = "Opera";
    } else if (isChrome) {
        name = "Chrome";
    } else if (isSafari) {
        name = "Safari";
    }
    return name;
}

//Swap left/right button
function swapButton() {
    btnWrappers.map(function (index, wrapper) {
        if ($(wrapper).hasClass('gm-left-wrapper')) {
            $(wrapper).removeClass('gm-left-wrapper').addClass('gm-right-wrapper');
        } else {
            $(wrapper).removeClass('gm-right-wrapper').addClass('gm-left-wrapper');
        }
    });
}

/*Get same point of 2 edge
*
*
* Input: Edge 1 & Edge 2
* Output: point name or null
* */
function getSamePointOfTwoEdges(edge1, edge2) {
    for (i = 0; i < edge1.length; i++) {
        for (j = 0; j < edge2.length; j++) {
            if (edge1[i] === edge2[j]) return edge1[i];
        }
    }

    return null;
}