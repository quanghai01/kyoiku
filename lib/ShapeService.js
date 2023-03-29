const ShapeService = function() {
    // グリット設定情報
    this.gridLineColor = 'rgb(126,206,244)'; // グリッド線の色
    this.gridLineWidth = 0.5;   // グリッド線の太さ
    this.gridTopRate = 0.28;    // canvas高さ何割分をグリッド上の高さにするか
    this.gridLeftRate = 0.12;   // canvas高さ何割分をグリッド横の高さにするか
    this.cellSizeRate = 0.05;   // canvas高さ何割分をセル1個分の大きさにするか
    this.cellsWidth = 17;       // セルの個数（横）
    this.cellsHeight = 13;      // セルの個数（縦）

    // 背景破線図形データ
    this.backShape = {
        'a': {
            'vertex': [7, 5],               // 頂点Aの座標
            'alphabetPoint': [-0.7, -0.8],  // アルファベットA画像の位置（頂点Aからセル何個分の位置にずらして表示するのか）
        },
        'b': {
            'vertex': [5, 9],
            'alphabetPoint': [-0.7, 0.1],
        },
        'c': {
            'vertex': [13, 9],
            'alphabetPoint': [0.15, 0.1],
        },
        'd': {
            'vertex': [9, 5],
            'alphabetPoint': [0.15, -0.8],
        },
    };
    // アルファベット画像サイズ（セル何個分）
    this.alphabetSize = [0.54, 0.63];

    // 図形初期座標（セルの個数指定）
    this.shapeMatrix = [
        [7, 5],
        [5, 9],
        [13, 9],
        [9, 5],
    ];

    // 図形内の色
    this.shapeNormalColor = 'rgba(252,224,185,0.5)';  // 通常
    this.shapeCopyColor = 'rgba(128,128,128,0.2)';      // コピー時

    // 図形の線の太さ
    this.shapeLineWidth = 3;

    // コピー回数制限
    this.copyLimit = 3;
    // 切る回数制限
    this.cutLimit = 10;

    // 使い方画像位置
    this.howToCutImg = {    // 切るボタン説明
        'position': [0.4, 0.23], // canvasの横、高さに対する比率
        'size': 0.4,    // canvasの横幅に対する比率
        'arrowStart': [0.7, 0.24],   // canvasの横、高さに対する比率
        'arrowRotate': 40,   // 矢印三角形の角度
    };
    this.howToCopyImg = {   // コピーボタン説明
        'position': [0.38, 0.85], // canvasの横、高さに対する比率
        'size': 0.4,    // canvasの横幅に対する比率
        'arrowStart': [0.7, 0.86],   // canvasの横、高さに対する比率
        'arrowRotate': 45,   // 矢印三角形の角度
    };
};
(function(){
    /**
     * cm画像の初期サイズと座標をグリット情報を元に算出
     * @param gridLeft  グリッド横の長さ
     * @param gridTop   グリッド上の高さ
     * @param cellSize  セル1個分の大きさ
     * @return {{verticalCm: {size: *[], matrix: *[]}, horizonCm: {size: *[], matrix: *[]}, cmFrame: {size: *[], matrix: *[]}}}
     */
    ShapeService.prototype.getCmImgInfo = function(gridLeft, gridTop, cellSize) {
        return {
            'horizonCm': {
                'size': [cellSize * 1.2, (cellSize * 1.2) / 2],
                'matrix': [gridLeft - cellSize * 0.1, gridTop - (cellSize * 1.2) / 2 - cellSize * 0.2],
            },
            'verticalCm': {
                'size': [cellSize * 1.2, (cellSize * 1.2) / 2],
                'matrix': [gridLeft - cellSize * 1.4, gridTop + cellSize * 0.1],
            },
            'cmFrame': {
                'size': [cellSize * 1.18, cellSize * 1.18],
                'matrix': [gridLeft - cellSize * 0.16, gridTop  - cellSize * 0.16],
            },
        };
    };

    /**
     * 図形の初期座標をグリット情報を元に算出
     * @param gridLeft  グリッド横の長さ
     * @param gridTop   グリッド上の高さ
     * @param cellSize  セル1個分の大きさ
     * @return {[]}     図形の初期座標
     */
    ShapeService.prototype.getInitShapeMatrix = function(gridLeft, gridTop, cellSize) {
        let initShapeMatrix = [];
        for (let s = 0; s < this.shapeMatrix.length; s++) {
            let matrix = [gridLeft + cellSize * this.shapeMatrix[s][0], gridTop + cellSize * this.shapeMatrix[s][1]];
            initShapeMatrix.push(matrix);
        }
        return initShapeMatrix;
    };

    /**
     * 背景破線図形とアルファベット画像の座標データをリット情報を元に算出
     * @param gridLeft  グリッド横の長さ
     * @param gridTop   グリッド上の高さ
     * @param cellSize  セル1個分の大きさ
     * @return {[]}     背景破線図形とアルファベット画像の座標データ
     */
    ShapeService.prototype.calcBackShape = function(gridLeft, gridTop, cellSize) {
        let backShapeInfo = {};
        for (let alphabet in this.backShape) {
            backShapeInfo[alphabet] = {};
            backShapeInfo[alphabet]['vertex'] = [gridLeft + cellSize * this.backShape[alphabet]['vertex'][0], gridTop + cellSize * this.backShape[alphabet]['vertex'][1]];
            backShapeInfo[alphabet]['alphabetPoint'] = [backShapeInfo[alphabet]['vertex'][0] + cellSize * this.backShape[alphabet]['alphabetPoint'][0], backShapeInfo[alphabet]['vertex'][1] + cellSize * this.backShape[alphabet]['alphabetPoint'][1]];
        }
        return backShapeInfo;
    };

    /**
     * グリッド線の各点の座標と範囲を取得
     * @param gridTop       グリッド線の設置位置（y座標）
     * @param gridLeft      グリッド線の設置位置（x座標）
     * @param cellsWidth    グリッドの横の個数
     * @param cellsHeight   グリッドの縦の個数
     * @param cellSize      セル1個分の大きさ
     * @return {{gridMatrix: [], yArea: {min: *, max: *}, xArea: {min: *, max: *}}}         グリッド線の情報
     */
    ShapeService.prototype.setGridInfo = function(gridTop, gridLeft, cellsWidth, cellsHeight, cellSize) {
        let gridInfo = {
            'xArea': {'min': gridLeft, 'max': gridLeft + cellSize * cellsWidth},
            'yArea': {'min': gridTop, 'max': gridTop + cellSize * cellsHeight},
            'vertex': [],
            'gridMatrix': [],
        };
        // グリッドの各頂点座標を計算
        gridInfo['vertex'].push([gridInfo['xArea']['min'], gridInfo['yArea']['min']]);
        gridInfo['vertex'].push([gridInfo['xArea']['max'], gridInfo['yArea']['min']]);
        gridInfo['vertex'].push([gridInfo['xArea']['max'], gridInfo['yArea']['max']]);
        gridInfo['vertex'].push([gridInfo['xArea']['min'], gridInfo['yArea']['max']]);

        // グリッド線の各点の座標を計算
        for (let s = 0; s < cellsHeight+1; s++) {
            gridInfo['gridMatrix'][s] = [];
            let gridY = gridTop + s * cellSize;
            for (let t = 0; t < cellsWidth+1; t++) {
                let gridX = gridLeft + t * cellSize;
                gridInfo['gridMatrix'][s].push([gridX, gridY]);
            }
        }
        return gridInfo;
    };

    /**
     * 指定地点から一番近いグリッド点の座標を取得する
     * @param targetPoint       指定地点
     * @param gridInfo          グリッド情報
     * @return {null|number[]}  指定地点から一番近いグリッド点の座標（範囲外選択の場合、nullを返す）
     */
    ShapeService.prototype.getNearestGridPoint = function(targetPoint, gridInfo) {
        if (gridInfo['xArea']['min'] > targetPoint[0] || targetPoint[0] > gridInfo['xArea']['max']
            || gridInfo['yArea']['min'] > targetPoint[1] || targetPoint[1] > gridInfo['yArea']['max']) {
            // グリッド範囲外の場合はnull
            return null;
        } else {
            // 指定ポイントがグリッド範囲内の場合
            let resultPoint = [0, 0];   // 指定ポイントに最も近い点の座標

            let beforeDistance = 0; // 指定ポイントとグリッド点の距離
            for (let s = 0; s < gridInfo['gridMatrix'].length; s++) {
                for (let t = 0; t < gridInfo['gridMatrix'][s].length; t++) {
                    let distance = Math.pow(Math.abs(gridInfo['gridMatrix'][s][t][0] - targetPoint[0]), 2) + Math.pow(Math.abs(gridInfo['gridMatrix'][s][t][1] - targetPoint[1]), 2);
                    if (beforeDistance === 0 || distance < beforeDistance) {
                        // 比較スタート時、または前回のグリッドとの距離より短い距離のグリッド点が見つかった場合
                        beforeDistance = distance;
                        resultPoint[0] = gridInfo['gridMatrix'][s][t][0];
                        resultPoint[1] = gridInfo['gridMatrix'][s][t][1];
                    }
                }
            }
            return resultPoint;
        }
    };

    /**
     * 指定地点に最も近いグリッド内座標を取得
     * （グリッド外の場合はスタート地点と指定地点を結ぶ直線とグリッド外線の交点座標、グリッド内の場合は指定地点の座標をそのまま返す）
     * @param startPoint    スタート地点
     * @param targetPoint   指定地点
     * @param gridInfo      グリッド情報
     * @return {number[]}   グリッド内座標
     */
    ShapeService.prototype.getGridPointOnLine = function(startPoint, targetPoint, gridInfo) {
        if (gridInfo['xArea']['min'] > targetPoint[0] || targetPoint[0] > gridInfo['xArea']['max']
            || gridInfo['yArea']['min'] > targetPoint[1] || targetPoint[1] > gridInfo['yArea']['max']) {
            // グリッド範囲外の場合、スタート地点と指定地点を結ぶ点とグリット外線の交点を返す
            for (let i = 0; i < gridInfo['vertex'].length; i++) {
                let nextIdx = i + 1;
                if (i === gridInfo['vertex'].length - 1) {
                    // 最終頂点は始点と結ぶ線分にする
                    nextIdx = 0;
                }
                let crossP = this.getIntersectPoint(startPoint, targetPoint, gridInfo['vertex'][i], gridInfo['vertex'][nextIdx]);
                if (null !== crossP) {
                    return crossP;
                }
            }
        }
        // グリッド範囲内の場合は指定地点をそのまま返す
        return targetPoint;
    };

    /**
     * 指定倍率でリサイズした図形の座標を再計算する
     * @param scale
     * @param gridInfo
     * @param shapes
     */
    ShapeService.prototype.recalculateMatrix = function(scale, gridInfo, shapes) {
        for (let k = 0; k < shapes.length; k++) {
            // 拡大・縮小後の座標を設定
            shapes[k]['center'] = [shapes[k]['center'][0] * scale, shapes[k]['center'][1] * scale];
            shapes[k]['crossPoint'] = [shapes[k]['crossPoint'][0] * scale, shapes[k]['crossPoint'][1] * scale];
            shapes[k]['circle'] = [shapes[k]['circle'][0] * scale, shapes[k]['circle'][1] * scale];
            for (let i = 0; i < shapes[k]['matrix'].length; i++) {
                shapes[k]['matrix'][i][0] = shapes[k]['matrix'][i][0] * scale;
                shapes[k]['matrix'][i][1] = shapes[k]['matrix'][i][1] * scale;

                // グリッド点に僅差の場合はグリッド点に合わせる
                for (let s = 0; s < gridInfo['gridMatrix'].length; s++) {
                    for (let t = 0; t < gridInfo['gridMatrix'][s].length; t++) {
                        if (Math.abs(gridInfo['gridMatrix'][s][t][0] - shapes[k]['matrix'][i][0]) < 1
                            && Math.abs(gridInfo['gridMatrix'][s][t][1] - shapes[k]['matrix'][i][1]) < 1) {
                            shapes[k]['matrix'][i][0] = gridInfo['gridMatrix'][s][t][0];
                            shapes[k]['matrix'][i][1] = gridInfo['gridMatrix'][s][t][1];
                        }
                    }
                }
            }
            // 元座標情報を設定
            this.setOriginShapeData(shapes[k]);
        }
    };

    /**
     * マウスダウン（orタッチ）座標を取得する
     * @param evt
     * @param canvasTop
     * @param canvasLeft
     * @return array    マウスダウン（orタッチ）座標 x, yの配列
     */
    ShapeService.prototype.getTouchPoint = function (evt, canvasTop, canvasLeft) {
        let touchX = 0;
        let touchY = 0;
        if (evt.type === 'touchstart' || evt.type === 'touchmove' || evt.type === 'touchend') {
            // タッチデバイスの場合
            let touchObject = evt.changedTouches[0] ;
            touchX = touchObject.pageX - canvasLeft;
            touchY = touchObject.pageY - canvasTop;
        } else {
            // マウス操作の場合
            touchX = evt.clientX - canvasLeft;
            touchY = evt.clientY - canvasTop;
        }
        return [touchX, touchY];   // マウスダウン（orタッチ）座標
    };

    /**
     * 指定図形を移動させる
     * @param shape 一つの図形データ
     * @param dx    x座標の移動量
     * @param dy    y座標の移動量
     */
    ShapeService.prototype.moveShape = function(shape, dx, dy) {
        // 移動後の重心の座標計算
        shape['center'][0] = shape['center'][0] + dx;
        shape['center'][1] = shape['center'][1] + dy;
        // 移動後の交点の座標計算
        shape['crossPoint'][0] = shape['crossPoint'][0] + dx;
        shape['crossPoint'][1] = shape['crossPoint'][1] + dy;
        // 移動後の円画像の座標計算
        shape['circle'][0] = shape['circle'][0] + dx;
        shape['circle'][1] = shape['circle'][1] + dy;
        // 移動後の各頂点の座標計算
        for (let i = 0; i < shape['matrix'].length; i++) {
            shape['matrix'][i][0] = shape['matrix'][i][0] + dx;
            shape['matrix'][i][1] = shape['matrix'][i][1] + dy;
        }
        // 元座標情報を設定
        this.setOriginShapeData(shape);
    };

    /**
     * 指定した図形をコピーしたデータを返す
     * @param shape 一つの図形データ
     */
    ShapeService.prototype.copyShape = function(shape) {
        let extra = 50;

        let newShape = {};
        newShape['origin'] = {};
        newShape['center'] = [shape['center'][0] + extra, shape['center'][1] + extra];
        newShape['crossPoint'] = [shape['crossPoint'][0] + extra, shape['crossPoint'][1] + extra];
        newShape['origin']['crossPoint'] = [shape['crossPoint'][0] + extra, shape['crossPoint'][1] + extra];
        newShape['circle'] = [shape['circle'][0] + extra, shape['circle'][1] + extra];
        newShape['origin']['circle'] = [shape['circle'][0] + extra, shape['circle'][1] + extra];
        newShape['matrix'] = [];
        newShape['origin']['matrix'] = [];
        for (let i = 0; i < shape['matrix'].length; i++) {
            newShape['matrix'][i] = [shape['matrix'][i][0] + extra, shape['matrix'][i][1] + extra];
            newShape['origin']['matrix'][i] = [shape['matrix'][i][0] + extra, shape['matrix'][i][1] + extra];
        }
        newShape['isCopy'] = true;

        return newShape;
    };

    /**
     * 指定図形に元座標データを初期セットする
     * @param shape
     */
    ShapeService.prototype.setOriginShapeData = function(shape) {
        shape['origin'] = {};
        shape['origin']['crossPoint'] = [shape['crossPoint'][0], shape['crossPoint'][1]];
        shape['origin']['circle'] = [shape['circle'][0], shape['circle'][1]];
        shape['origin']['matrix'] = [];
        for (let i = 0; i < shape['matrix'].length; i++) {
            shape['origin']['matrix'][i] = [shape['matrix'][i][0], shape['matrix'][i][1]];
        }
    };

    /**
     * 指定した図形オブジェクトに重心座標と重心からの垂線と辺の交点座標、円の中心をセットする
     * @param shape
     */
    ShapeService.prototype.calcCenterOfGravity = function(shape) {
        // N角形の重心の求め方は
        // x座標＝(x1+x2+x3+・・・+xn)/n
        // y座標＝(y1+y2+y3+・・・+xn)/n

        let newCenterXTotal = 0;
        let newCenterYTotal = 0;
        let matrixLength = shape['matrix'].length;
        for (let i = 0; i < matrixLength; i++) {
            newCenterXTotal += shape['matrix'][i][0];
            newCenterYTotal += shape['matrix'][i][1];
        }
        shape['center'][0] = newCenterXTotal / matrixLength;
        shape['center'][1] = newCenterYTotal / matrixLength;

        // 重心と重心よりy方向にwindowの高さ分上にある点と辺の交点を求める
        let centerUpperPoint = [shape['center'][0], shape['center'][1] - $(window).height()];
        for (let i = 0; i < matrixLength; i++) {
            let nextIdx = i + 1;
            if (i === matrixLength - 1) {
                // 最終頂点は始点と結ぶ線分にする
                nextIdx = 0;
            }
            let crossPoint = this.getIntersectPoint(shape['center'], centerUpperPoint, shape['matrix'][i], shape['matrix'][nextIdx]);
            if (crossPoint !== null) {
                shape['crossPoint'] = crossPoint;
                let lineLength = Math.abs(crossPoint[1] - shape['center'][1]) * 2;
                if (lineLength < 100) {
                    lineLength = 100;
                }
                shape['circle'] = [shape['center'][0], (shape['center'][1] - lineLength)];
                break;
            }
        }
    };

    /**
     * 対象の2点を結ぶ線分が図形と交わう場合カットする
     * @param pointA
     * @param pointB
     * @param shapes
     * @return {boolean}
     */
    ShapeService.prototype.cutShapes = function(pointA, pointB, shapes){
        let resultShapes = [];

        for (let k = 0; k < shapes.length; k++) {
            if (!shapes[k]['isCopy']) {
                // コピーではない図形のみ、各図形をカットできるかチェック

                let intersectCount = 0; // 辺と交わる点が2辺以上あればカット可能
                let cutPoints = {};
                let cutIdx = [];
                let cutCnt = 0;
                for (let i = 0; i < shapes[k]['matrix'].length; i++) {
                    let nextIdx = i + 1;
                    if (i === shapes[k]['matrix'].length - 1) {
                        // 最終頂点は始点と結ぶ線分にする
                        nextIdx = 0;
                    }

                    let crossP = this.getIntersectPoint(pointA, pointB, shapes[k]['matrix'][i], shapes[k]['matrix'][nextIdx]);
                    if (null !== crossP) {
                        // 重複チェック
                        let duplicate = false;
                        for (let idx in cutPoints) {
                            // 交点同士の距離を算出
                            let crossPointsDistance = Math.pow((crossP[0] - cutPoints[idx][0]), 2) + Math.pow((crossP[1] - cutPoints[idx][1]), 2);
                            // 交点同士の距離が1以下であれば同点とみなす
                            if (crossPointsDistance < 1) {
                                duplicate = true;
                                break;
                            }
                        }
                        if (!duplicate) {
                            intersectCount++;
                            cutPoints[cutCnt] = crossP;
                            cutIdx.push(cutCnt);
                        }
                    }
                    cutCnt++;
                }

                if (intersectCount > 1) {
                    // 2つに別れた図形の頂点を時計回りに求める

                    // 1個目の図形
                    let newShape1 = {'center': [], 'matrix': []};
                    for (let i = 0; i < cutIdx[0]+1; i++) {
                        // 交点と頂点の距離を算出
                        let cross2VertexDistance1 = Math.pow((cutPoints[cutIdx[0]][0] - shapes[k]['matrix'][i][0]), 2) + Math.pow((cutPoints[cutIdx[0]][1] - shapes[k]['matrix'][i][1]), 2);
                        let cross2VertexDistance2 = Math.pow((cutPoints[cutIdx[1]][0] - shapes[k]['matrix'][i][0]), 2) + Math.pow((cutPoints[cutIdx[1]][1] - shapes[k]['matrix'][i][1]), 2);

                        // 交点と頂点の距離が1以下であれば同点とみなす
                        if (cross2VertexDistance1 >= 1 && cross2VertexDistance2 >= 1) {
                            // 交点が頂点でない場合追加（交点が頂点でない＝すでに追加している点とも違う）
                            newShape1['matrix'].push(shapes[k]['matrix'][i]);
                        }
                    }
                    newShape1['matrix'].push([cutPoints[cutIdx[0]][0], cutPoints[cutIdx[0]][1]]);
                    newShape1['matrix'].push([cutPoints[cutIdx[1]][0], cutPoints[cutIdx[1]][1]]);
                    for (let i = cutIdx[1]+1; i < shapes[k]['matrix'].length; i++) {
                        // 交点と頂点の距離を算出
                        let cross2VertexDistance1 = Math.pow((cutPoints[cutIdx[0]][0] - shapes[k]['matrix'][i][0]), 2) + Math.pow((cutPoints[cutIdx[0]][1] - shapes[k]['matrix'][i][1]), 2);
                        let cross2VertexDistance2 = Math.pow((cutPoints[cutIdx[1]][0] - shapes[k]['matrix'][i][0]), 2) + Math.pow((cutPoints[cutIdx[1]][1] - shapes[k]['matrix'][i][1]), 2);

                        // 交点と頂点の距離が1以下であれば同点とみなす
                        if (cross2VertexDistance1 >= 1 && cross2VertexDistance2 >= 1) {
                            // 交点が頂点でない場合追加（交点が頂点でない＝すでに追加している点とも違う）
                            newShape1['matrix'].push(shapes[k]['matrix'][i]);
                        }
                    }

                    // 頂点が2個以上の図形の場合のみ追加
                    if (newShape1['matrix'].length > 2) {
                        this.calcCenterOfGravity(newShape1);
                        this.setOriginShapeData(newShape1);
                        newShape1['isCopy'] = false;

                        resultShapes.push(newShape1);
                    }

                    // 2個目の図形
                    let newShape2 = {'center': [], 'matrix': []};
                    newShape2['matrix'].push([cutPoints[cutIdx[0]][0], cutPoints[cutIdx[0]][1]]);
                    for (let i = cutIdx[0]+1; i < cutIdx[1]+1; i++) {
                        // 交点と頂点の距離を算出
                        let cross2VertexDistance1 = Math.pow((cutPoints[cutIdx[0]][0] - shapes[k]['matrix'][i][0]), 2) + Math.pow((cutPoints[cutIdx[0]][1] - shapes[k]['matrix'][i][1]), 2);
                        let cross2VertexDistance2 = Math.pow((cutPoints[cutIdx[1]][0] - shapes[k]['matrix'][i][0]), 2) + Math.pow((cutPoints[cutIdx[1]][1] - shapes[k]['matrix'][i][1]), 2);

                        // 交点と頂点の距離が1以下であれば同点とみなす
                        if (cross2VertexDistance1 >= 1 && cross2VertexDistance2 >= 1) {
                            // 交点が頂点でない場合追加（交点が頂点でない＝すでに追加している点とも違う）
                            newShape2['matrix'].push(shapes[k]['matrix'][i]);
                        }
                    }
                    newShape2['matrix'].push([cutPoints[cutIdx[1]][0], cutPoints[cutIdx[1]][1]]);

                    // 頂点が2個以上の図形の場合のみ追加
                    if (newShape2['matrix'].length > 2) {
                        this.calcCenterOfGravity(newShape2);
                        this.setOriginShapeData(newShape2);
                        newShape2['isCopy'] = false;

                        resultShapes.push(newShape2);
                    }
                } else {
                    resultShapes.push(shapes[k]);
                }
            } else {
                resultShapes.push(shapes[k]);
            }
        }

        return resultShapes;
    };

    /**
     * 指定ポイントが図形内に存在する点か判定する
     * @param point
     * @param shape
     * @return {boolean}
     */
    ShapeService.prototype.judgeInnerShapePoint = function(point, shape) {
        // ある２次元上の点が多角形の内部にあるかどうかを判定するには、判定点からX軸に水平な半直線を描き、
        // 多角形の各線分との交点の個数が奇数ならば、内部の点と判断すればよい
        let intersectCount = 0;
        for (let i = 0; i < shape['matrix'].length; i++) {
            let nextIdx = i + 1;
            if (i === shape['matrix'].length - 1) {
                // 最終頂点は始点と結ぶ線分にする
                nextIdx = 0;
            }

            // 対象点より+x軸方向に辺の頂点のどちらかがある場合のみ交差する
            if (point[0] < shape['matrix'][i][0] || point[0] < shape['matrix'][nextIdx][0]) {
                let targetPointEnd = [shape['matrix'][i][0], point[1]];
                if (shape['matrix'][i][0] < shape['matrix'][nextIdx][0]) {
                    targetPointEnd[0] = shape['matrix'][nextIdx][0];
                }

                // 辺と対象点（指定点と辺の最長y座標を結ぶ平行線）の交点を取得
                let crossP = this.getIntersectPoint(point, targetPointEnd, shape['matrix'][i], shape['matrix'][nextIdx]);
                if (null !== crossP) {
                    intersectCount++;
                }
            }
        }

        if (intersectCount % 2 === 1) {
            return true;
        } else {
            return false;
        }
    };

    /**
     * 指定ポイントが指定円の内側にあるかどうか
     * @param point
     * @param circleCenter
     * @param radius
     * @return {boolean}
     */
    ShapeService.prototype.judgeInnerCirclePoint = function(point, circleCenter, radius) {
        // 点 (x, y) が、半径 r の円に含まれているかどうかは、円の中心からの距離を比較すればよい
        // 円の中心からの距離が r 以下であれば、点は円内にある
        let distance = Math.sqrt(Math.pow(point[0] - circleCenter[0], 2) + Math.pow(point[1] - circleCenter[1], 2));
        if (distance < radius) {
            return true;
        } else {
            return false;
        }
    };

    /**
     * 2つの線分（線分ABと線分CD）の交点を求める（交点がない場合はnullが返る）
     * @param pointA
     * @param pointB
     * @param pointC
     * @param pointD
     * @return {null|number[]}
     */
    ShapeService.prototype.getIntersectPoint = function(pointA, pointB, pointC, pointD) {
        // 外積が0のとき平行
        let vectorAB = [pointB[0] - pointA[0], pointB[1] - pointA[1]]; // ベクトルAB
        let vectorCD = [pointD[0] - pointC[0], pointD[1] - pointC[1]]; // ベクトルCD
        // 2次元ベクトルA(ax, ay)とB(bx, by)の外積A×B : A×B = ax*by - ay*bx
        let crossProductAB2CD = vectorAB[0] * vectorCD[1] - vectorAB[1] * vectorCD[0];    // ABとCDの外積
        if (crossProductAB2CD === 0) {
            // ベクトルABとCDが平行のとき交点は存在しない
            return null;
        }

        let crossP = [0, 0];
        let s1 = ((pointD[0] - pointC[0]) * (pointA[1] - pointC[1]) - (pointD[1] - pointC[1]) * (pointA[0] - pointC[0])) / 2;
        let s2 = ((pointD[0] - pointC[0]) * (pointC[1] - pointB[1]) - (pointD[1] - pointC[1]) * (pointC[0] - pointB[0])) / 2;

        // 2直線の交点を求める
        crossP[0] = pointA[0] + (pointB[0] - pointA[0]) * s1 / (s1 + s2);
        crossP[1] = pointA[1] + (pointB[1] - pointA[1]) * s1 / (s1 + s2);

        let ACx = pointC[0] - pointA[0];
        let ACy = pointC[1] - pointA[1];
        let tmp = (pointB[0] - pointA[0]) * (pointD[1] - pointC[1]) - (pointB[1] - pointA[1]) * (pointD[0] - pointC[0]);

        let r = ((pointD[1] - pointC[1]) * ACx - (pointD[0] - pointC[0]) * ACy) / tmp;
        let s = ((pointB[1] - pointA[1]) * ACx - (pointB[0] - pointA[0]) * ACy) / tmp;

        // 2直線上にあるかどうか
        if (0 <= r && r <=1 && 0 <= s && s <= 1) {
            return crossP;
        } else {
            return null;
        }
    };

    /**
     * クリックした場所にある図形の番号を取得
     * @param point
     * @param shapes
     * @return {null|number}
     */
    ShapeService.prototype.getSelectShapeIdx = function (point, shapes) {
        let resultIdx = -1;
        for (let k = 0; k < shapes.length; k++) {
            let innerJudge = this.judgeInnerShapePoint(point, shapes[k]);
            if (innerJudge) {
                resultIdx = k;
            }
        }

        if (resultIdx === -1) {
            return null;
        } else {
            return resultIdx;
        }
    };

    /**
     * 指定インデックスの図形が図形データ配列の最後尾になるよう設定し最後尾インデックスを取得
     * @param selectIdx 指定インデックス
     * @param shapes    図形データ
     * @return {number} 最後尾インデックス
     */
    ShapeService.prototype.resortShapesForSelect = function (selectIdx, shapes) {
        // 選択図形データをコピー
        let selectShape = $.extend(true, {}, shapes[selectIdx]);
        // 選択図形データを配列から削除
        shapes.splice(selectIdx, 1);
        // 最後尾に再度追加
        shapes.push(selectShape);

        // 最後尾が選択図形なので最後尾インデックス番号を返却
        return (shapes.length - 1);
    };

    /**
     * 指定図形を重心を中心に回転させる
     * @param endPoint  タッチ座標
     * @param shape
     */
    ShapeService.prototype.rotateShape = function (endPoint, shape) {
        // ベクトルaとベクトルbの間にある角度θを求める場合
        // ベクトルの内積を求めると角度が求まる（外積からも求められる）
        // 角度の正負は外積を求めることで知ることができる（時計回りは外積が正、反時計回りは外積が負）

        let startPoint = shape['origin']['circle'];
        let centerPoint = shape['center'];

        // ベクトルA: centerPoint -> startPoint
        // ベクトルB: centerPoint -> endPoint
        let vectorA = [startPoint[0] - centerPoint[0], startPoint[1] - centerPoint[1]]; // ベクトルA
        let vectorB = [endPoint[0] - centerPoint[0], endPoint[1] - centerPoint[1]]; // ベクトルB
        let vectorALength = Math.sqrt(Math.pow(vectorA[0], 2) + Math.pow(vectorA[1], 2));   // ベクトルAの長さ
        let vectorBLength = Math.sqrt(Math.pow(vectorB[0], 2) + Math.pow(vectorB[1], 2));   // ベクトルBの長さ

        // 2次元ベクトルA(ax, ay)とB(bx, by)の外積A×B : A×B = ax*by - ay*bx
        let crossProductAB = vectorA[0] * vectorB[1] - vectorA[1] * vectorB[0];    // ABの外積
        // 2次元ベクトルA(ax, ay)とB(bx, by)の内積A・B : A・B = ax*bx + ay*by
        let dotProductAB = vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1];    // ABの外積

        // ベクトルABの外積 = ベクトルAの長さ * ベクトルBの長さ * sinθ
        let sin = crossProductAB / (vectorALength * vectorBLength);
        // ベクトルABの内積 = ベクトルAの長さ * ベクトルBの長さ * cosθ
        let cos = dotProductAB / (vectorALength * vectorBLength);

        // 円の中心の回転後座標を計算
        shape['circle'][0] = cos * (startPoint[0] - centerPoint[0]) - sin * (startPoint[1] - centerPoint[1]) + centerPoint[0];
        shape['circle'][1] = sin * (startPoint[0] - centerPoint[0]) + cos * (startPoint[1] - centerPoint[1]) + centerPoint[1];
        // 重心からの垂線と辺の交点の回転後座標を計算
        shape['crossPoint'][0] = cos * (shape['origin']['crossPoint'][0] - centerPoint[0]) - sin * (shape['origin']['crossPoint'][1] - centerPoint[1]) + centerPoint[0];
        shape['crossPoint'][1] = sin * (shape['origin']['crossPoint'][0] - centerPoint[0]) + cos * (shape['origin']['crossPoint'][1] - centerPoint[1]) + centerPoint[1];
        // 各頂点の回転後座標を計算
        for (let i = 0; i < shape['matrix'].length; i++) {
            shape['matrix'][i][0] = cos * (shape['origin']['matrix'][i][0] - centerPoint[0]) - sin * (shape['origin']['matrix'][i][1] - centerPoint[1]) + centerPoint[0];
            shape['matrix'][i][1] = sin * (shape['origin']['matrix'][i][0] - centerPoint[0]) + cos * (shape['origin']['matrix'][i][1] - centerPoint[1]) + centerPoint[1];
        }
    };

    /**
     * 指定座標を指定した点を中心に指定角度、回転させた後の座標を取得
     * @param angle
     * @param centerPoint
     * @param coordinate
     * @return {[]}
     */
    ShapeService.prototype.getRotateCoordinate = function (angle, centerPoint, coordinate) {
        let radian = angle / (180 / Math.PI);
        let sin = Math.sin(radian);
        let cos = Math.cos(radian);

        // 回転後座標を計算
        let resultCoordinate = [];
        resultCoordinate[0] = cos * (coordinate[0] - centerPoint[0]) - sin * (coordinate[1] - centerPoint[1]) + centerPoint[0];
        resultCoordinate[1] = sin * (coordinate[0] - centerPoint[0]) + cos * (coordinate[1] - centerPoint[1]) + centerPoint[1];

        return resultCoordinate;
    };
}());
