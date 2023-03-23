/* eslint-disable no-new */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-case-declarations */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-shadow */

/* eslint-disable no-unused-expressions */
var g_buttonAnimateInterval = {};
var g_actionState;
var g_selectedButton;
var g_isPlaying = false;
var g_stepCount;
var g_isChanged = false;
var g_isDisabledBtn1 = true;
var g_isDisabledBtn2 = false;
var g_isDisabledBtn3 = true;
var g_isAnimatingButton = {};
var g_checkboxActive = true;
var g_latestMousePress = "";
var g_interval;
var g_interval2;
var g_isRunning = false;
var duration = 10000;
var nFrame = 300;
var intialP = -624;
var intialQ = 760;
var middleP;
var middleQ;
var stepP = intialP / nFrame;
var stepQ = intialQ / nFrame;
var g_currentPosition = "middle";

// ===== state =====

let g_state;

const initState = (info, openCB, closeCB) => {
    g_state = {
        version: "20230413",
        is_show_log: false,
        is_init_canvas: false,

        menu: 1, // 1,  2, 3
        menu_item_selected: 3, // null, 1, 2, 3
        show_popup: false,
        delete_mode: false,

        screen_width: 1480,
        screen_height: 1000,

        controls: [
            // "btn-show-popup"
            new Control({
                name: "btn-show-popup",
                type: "button",
                id: "btn-show-popup",
                value: "inactive",
                event_for_active_state: true,
                ignore_mouseup: true,
                // mouseup_immediately: function () {
                //     const ctrl = this;
                //     ctrl.value = "inactive";
                //     ctrl.render();
                // },
                mouseup: function () {
                    const ctrl = this;
                    g_state.show_popup = !g_state.show_popup;
                    ctrl.value = {
                        active: "inactive",
                        inactive: "active",
                    }[ctrl.value];

                    ctrl.render();

                    applyControlChange();
                },
                mousedown: function () {
                    let ctrl = this;
                    ctrl.render();
                    applyControlChange();
                },
                render: function () {
                    const ctrl = this;
                    if (g_state.show_popup) if (openCB) openCB();

                    showElement(`.${ctrl.id}`, false);
                    showElement(`#${ctrl.id}-${ctrl.value}`, true);
                    showElement(getEl("#popup"), g_state.show_popup);
                },
            }),
            // "drag-popup"
            new Control({
                name: "drag-popup",
                type: "drag",
                id: "drag-popup",
                x_scope: [0, 1],
                scope: [0, 1],
                minimum: 0.001,
                value: 0,
                info_bak: {
                    width: 992,
                    height: 232,
                    min_visible_x: 0.5 * 992,
                    min_visible_y: 0.5 * 232,
                    init_x: 150,
                    init_y: 230.16,
                },
                info,
                fn_drag: function ({ value, eventName }) {
                    let ctrl = this;
                    ctrl.eventName = eventName;

                    if (eventName == "mousedown") {
                        ctrl.offset = {
                            x: ctrl.curPos.x,
                            y: ctrl.curPos.y,
                        };
                        ctrl.translate = SVGLib.getTranslate(getEl("#popup-content"));
                    } else {
                        ctrl.render();
                    }

                    if (eventName == "mouseup") {
                        delete ctrl.offset;
                    }
                },
                render: function () {
                    let ctrl = this;
                    if (ctrl.offset) {
                        let { translate } = ctrl;

                        if (!ctrl.scopeTx) {
                            let width = _.get(ctrl, ["info", "width"], 0);
                            let height = _.get(ctrl, ["info", "height"], 0);
                            let initX = _.get(ctrl, ["info", "init_x"], 0);
                            let initY = _.get(ctrl, ["info", "init_y"], 0);

                            let minVisibleX = _.get(ctrl, ["info", "min_visible_x"], 0);
                            let minVisibleY = _.get(ctrl, ["info", "min_visible_y"], 0);

                            let scopeTx = [-width + minVisibleX - initX, g_state.screen_width - minVisibleX - initX];
                            let scopeTy = [-height + minVisibleY - initY, g_state.screen_height - initY - minVisibleY];

                            ctrl.scopeTx = scopeTx;
                            ctrl.scopeTy = scopeTy;
                        }

                        let { scopeTx, scopeTy } = ctrl;

                        let tx = ctrl.curPos.x - ctrl.offset.x + translate.left;
                        let ty = ctrl.curPos.y - ctrl.offset.y + translate.top;

                        let isMeetBounding = false;
                        if (tx > scopeTx[1]) {
                            isMeetBounding = true;
                            tx = scopeTx[1];
                            // console.log("meet bounding tx max");
                        }
                        if (tx < scopeTx[0]) {
                            isMeetBounding = true;
                            tx = scopeTx[0];
                            // console.log("meet bounding tx min");
                        }

                        if (ty > scopeTy[1]) {
                            isMeetBounding = true;
                            ty = scopeTy[1];
                            // console.log("meet bounding ty min");
                        }
                        if (ty < scopeTy[0]) {
                            isMeetBounding = true;
                            ty = scopeTy[0];
                            // console.log("meet bounding ty max");
                        }
                      
                        getEl("#popup-content").attr("transform", `translate(${tx} ${ty})`);
                    }
                },
            }),
            // "close-popup"
            new Control({
                name: "close-popup",
                type: "clickable",
                class_name: "close-popup",
                mouseup: function () {
                    let ctrl = this;
                    g_state.show_popup = false;

                    let ctrlShowPopup = getControl("btn-show-popup");
                    ctrlShowPopup.value = "inactive";
                    ctrl.render();

                    if (closeCB) closeCB();

                    // g_state.fnCheckReload();
                    applyControlChange();
                },
                render: function () {
                    getControl("btn-show-popup").render();
                },
            }),
        ],
    };
};

const loadConfigAndStaticSVG = () => {
    g_default_state = JSON.parse(JSON.stringify(g_state));
};

let g_default_state;
let g_eventId = 0;
let g_isRenderingGraph = false;
// ===== end =====

// ===== Template  =====

window.addEventListener("mousemove", function (ev) {
    ev.preventDefault ? ev.preventDefault() : (ev.returnValue = false);
});

window.addEventListener(
    "touchmove",
    function (e) {
        e.preventDefault();
    },
    {
        passive: false,
    }
);

function showElement(element, visible) {
    return $(element).css("visibility", visible ? "visible" : "hidden");
}

async function animateButtonEffect(id, isDown, cb, dy) {
    if (g_isAnimatingButton[id] && isDown) return;
    // while (g_isAnimatingButton[id]) {
    //     await delay(50);
    // }

    g_isAnimatingButton[id] = true;

    let defaultDy = 0;
    var self = $(id);
    var duration = 100;
    var nFrame = 10;
    var dy1 = isDown ? 0 : dy || defaultDy;
    var dy2 = isDown ? dy || defaultDy : 0;
    var ddy = (dy2 - dy1) / nFrame;

    let count = 0;

    if (!dy) {
        if (cb) cb();
    } else {
        var itv = setInterval(() => {
            count += 1;
            dy1 += ddy;

            self.attr("transform", SVGLib.getStrMatrix(1, 0, 0, 1, 0, dy1));

            if (count >= nFrame) {
                clearInterval(itv);
                delete g_isAnimatingButton[id];
                if (cb) cb();
            }
        }, duration / nFrame);
    }
}
let g_isMouseDown = false;

var itvKeepSVGNotMove;
function keepDraggableSvgNotMove() {
    if (g_dragablePosition.top == undefined || g_dragablePosition.top === null) {
        g_dragablePosition.top = parseInt($(".draggable-zone").css("top"), 10) || 0;
        g_dragablePosition.left = parseInt($(".draggable-zone").css("left"), 10) || 0;
    } else {
        setTimeout(function () {
            $(".draggable-zone").css("top", g_dragablePosition.top);
            $(".draggable-zone").css("left", g_dragablePosition.left);
        }, 50);
    }

    if (!itvKeepSVGNotMove)
        itvKeepSVGNotMove = setInterval(() => {
            keepDraggableSvgNotMove();
        }, 200);
}

function keepScrollBarNotMove(el) {
    setTimeout(function () {
        $(el).css("top", 0);
        $(el).css("left", 0);
    }, 50);
}

// ---------------------------------------------------------
var Draw = {
    setting: {
        svgDom: $("#svg"),
        grid: 100,
        lineStyle: {
            stroke: "black",
            "stroke-width": "2.5px",
        },
    },

    init: function () {
        this.shapeGroup = SVGLib.createTag(CONST.SVG.TAG.GROUP, {
            id: "svg_shape",
            transform: SVGLib.getStrMatrix(1, 0, 0, 1, 512, 324),
        });
        this.setting.svgDom.append(this.shapeGroup);

        this.rotateEvent(".draggable-zone");
    },

    appendToShapeGroup: function (childElement) {
        this.shapeGroup.append(childElement);

        return childElement;
    },

    appendToFloatingShapeGroup: function (childElement) {
        this.floatingShapeGroup.append(childElement);
    },
};

const getBoundingClientRect = (el) => {
    return $(el)[0].getBoundingClientRect();
};

const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const getCenterOfCircle = (el) => {
    const bbox = getBoundingClientRect(el);

    return {
        x: bbox.x + bbox.width / 2,
        y: bbox.y + bbox.height / 2,
    };
};

const checkifEventValid = (currentEventId) => {
    return currentEventId == g_eventId;
};

let g_isPressMouse = false;
let g_svgRatio = 1;

let fnCalculateSVGRatio = () => {
    g_svgRatio = getBoundingClientRect(getEl("#rect-bg")).width / 1480;
    // console.log("g_svgRatio", g_svgRatio);
};

function getMousePosition(e) {
    let evt = e;
    var CTM = svg.getScreenCTM();
    if (evt.touches) {
        evt = evt.touches[0];
    }

    return {
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d,
    };
}

let isMobile = false;

$(document).ready(function () {
    isMobile = checkMobile.any();

    // initState();
    // loadConfigAndStaticSVG();
    // if (g_state.is_init_canvas) initCanvas();
    // initDragEvent(_.flattenDeep(["rect-button-ignore-touch"]));

    $(window).resize(function () {
        isMobile = checkMobile.any();
        fnCalculateSVGRatio();
    });
    fnCalculateSVGRatio();

    let dZoom = 0.1;
    let isPinch = false;
    let isMouseDownZoomArea = false;

    let prevPos = {
        x: 0,
        y: 0,
    };

    var svg = document.querySelector("svg");
    // Create an SVGPoint for future math
    var pt = svg.createSVGPoint();

    function cursorPoint(evt) {
        var c = /Edge/.test(window.navigator.userAgent) ? document.getElementById("svg") : svg;
        pt.x = evt.clientX || evt.x || 0;
        pt.y = evt.clientY || evt.y || 0;
        var ctm = c.getScreenCTM();
        var inverse = ctm.inverse();
        var p = pt.matrixTransform(inverse);

        let ratio = 1;
        if (isMobile) {
            let stg1El = getEl("#stage_1")[0];
            let scale = stg1El.getBoundingClientRect().width / stg1El.offsetWidth;
            if (scale) {
                ratio = 1 / scale;
            }
        }

        return {
            x: p.x * ratio,
            y: p.y * ratio,
        };
    }

    window.cursorPoint = cursorPoint;

    const fnControlScrollbar = (ctrl) => {
        console.log("fnControlScrollbar initial", ctrl.name);
        let elSelector = ctrl.id ? `#${ctrl.id}` : `.${ctrl.class}`;
        let el = $(elSelector);
        const scrollPoint = $(ctrl.scroll_point);
        let isDrag = false;
        let prevValue = null;

        let fnDrag = (event, isSnap, eventName) => {
            g_latestMousePress = ctrl.id || ctrl.class || ctrl.name;
            // console.log("fnDrag", ctrl.name, isSnap, eventName);
            //  event.stopPropagation();

            const [x0, x1] = ctrl.x_scope || [];
            const [y0, y1] = ctrl.y_scope || [];

            var layoutLoc = SVGLib.getTranslate(el);
            // console.log("layoutLoc", layoutLoc);
            var curPos = cursorPoint(event);

            var x = curPos.x - layoutLoc.left;
            var y = -(curPos.y - layoutLoc.top);

            ctrl.curPos = curPos;

            let percent = (x - x0) / (x1 - x0);
            let percentY = 0;
            let isHavePercentY = false;
            if (ctrl.y_scope) {
                if (!_.get(ctrl, ["x_scope", "length"])) {
                    percent = (y1 - Math.abs(y)) / (y1 - y0);
                } else {
                    percentY = (y1 - Math.abs(y)) / (y1 - y0);
                    isHavePercentY = true;
                }
            }

            if (percent < 0) percent = 0;
            if (percent > 1) percent = 1;

            if (percentY < 0) percentY = 0;
            if (percentY > 1) percentY = 1;

            let roundLength = _.get(ctrl.minimum.toString().split(".")[1], "length", 0);

            ctrl.value = _.round(percent * (ctrl.scope[1] - ctrl.scope[0]) + ctrl.scope[0], roundLength);

            if (ctrl.value < ctrl.scope[0]) ctrl.value = ctrl.scope[0];
            if (ctrl.value > ctrl.scope[1]) ctrl.value = ctrl.scope[1];

            if (isHavePercentY) {
                ctrl.valueY = _.round(percentY * (ctrl.scope[1] - ctrl.scope[0]) + ctrl.scope[0], roundLength);

                if (ctrl.valueY < ctrl.scope[0]) ctrl.valueY = ctrl.scope[0];
                if (ctrl.valueY > ctrl.scope[1]) ctrl.valueY = ctrl.scope[1];
            }

            const stopPoints = ctrl.snap_point || [];
            const stopValue = stopPoints.find((x) => Math.abs(ctrl.value - x) < 1.2 * ctrl.minimum);
            if (stopValue != undefined) {
                ctrl.value = stopValue;
                // console.log("found stop value", stopValue);
            } else if (isSnap) {
                ctrl.value = _.round(_.round(ctrl.value / ctrl.minimum) * ctrl.minimum, roundLength);
            }

            if (eventName == "mousedown") {
                prevValue = ctrl.value;
            }

            ctrl.render();

            if (ctrl.fn_drag)
                ctrl.fn_drag({
                    prevValue,
                    eventName,
                });

            if (eventName == "mousemove") {
                prevValue = ctrl.value;
            }

            // console.log("prevValue", prevValue, eventName);

            keepScrollBarNotMove(el);
        };

        if (ctrl.is_dynamic) {
            $(document)
                .on("mousedown", elSelector, function (event) {
                    ctrl.el = this;
                    ctrl.is_drag = false;
                    isDrag = true;
                    prevValue = null;
                    fnDrag(event, true, "mousedown");
                })
                .css("position", "absolute");
        } else {
            $(el)
                .on("mousedown", function (event) {
                    ctrl.el = this;
                    ctrl.is_drag = false;
                    isDrag = true;
                    prevValue = null;
                    fnDrag(event, true, "mousedown");
                })
                .css("position", "absolute");
        }

        $(document).on("mousemove", function (event) {
            if (isDrag) {
                ctrl.is_drag = true;
                fnDrag(event, false, "mousemove");
                keepScrollBarNotMove(el);
            } else if (ctrl.mousemove) {
                let dx = event.clientX - prevMove.x;
                let dy = event.clientY - prevMove.y;
                if (Math.pow(dx, 2) + Math.pow(dy, 2) < 5) return;
                ctrl.mousemove(event);

                prevMove = {
                    x: event.clientX,
                    y: event.clientY,
                };
            }
        });

        $(document).on("mouseup", function (event) {
            if (isDrag) {
                fnDrag(event, true, "mouseup");
                keepScrollBarNotMove(el);
                isDrag = false;
                prevValue = null;
                ctrl.is_drag = false;
                delete ctrl.el;
            }
        });

        if (ctrl.mouseover) {
            $(el).on("mouseover", function (event) {
                ctrl.mouseover(event);
                ctrl.is_hover = true;
            });
        }
        if (ctrl.mouseout) {
            $(el).on("mouseout", function (event) {
                ctrl.mouseout(event);
                ctrl.is_hover = false;
            });
        }
    };

    const fnControlDrag = (ctrl) => {
        console.log("fnControlDrag initial", ctrl.name);
        let elSelector = ctrl.id ? `#${ctrl.id}` : `.${ctrl.class}`;
        let el = $(elSelector);
        let isDrag = false;
        let prevValue = null;

        ctrl.init_el = el;

        let prev = { x: 0, y: 0 };
        let fnDrag = (event, isSnap, eventName, isKeepCheckDist) => {
            g_latestMousePress = ctrl.id || ctrl.class;
            console.log("fnDrag", ctrl.name);
            event.stopPropagation();

            const [x0, x1] = ctrl.x_scope || [];
            const [y0, y1] = ctrl.y_scope || [];

            var layoutLoc = SVGLib.getTranslate(el);
            // console.log("layoutLoc", layoutLoc);
            var curPos = cursorPoint(event);

            var x = curPos.x - layoutLoc.left;
            var y = curPos.y - layoutLoc.top;

            ctrl.curPos = curPos;

            let dx = event.clientX - prev.x;
            let dy = event.clientY - prev.y;
            if (!isKeepCheckDist && Math.pow(dx, 2) + Math.pow(dy, 2) < 5) return;

            prev = {
                x: event.clientX,
                y: event.clientY,
            };

            if (x < x0) x = x0;
            else if (x > x1) x = x1;

            if (y < y0) y = y0;
            else if (y > y1) y = y1;

            ctrl.value = { x, y };

            if (eventName == "mousedown") {
                prevValue = ctrl.value;
            }

            // console.log(ctrl.name, ctrl.value);

            ctrl.render();

            if (ctrl.fn_drag)
                ctrl.fn_drag({
                    prevValue,
                    eventName,
                });

            if (eventName == "mousemove") {
                prevValue = ctrl.value;
            }

            // console.log("prevValue", prevValue, eventName);

            keepScrollBarNotMove(el);
        };

        if (ctrl.is_dynamic) {
            $(document).on("mousedown", elSelector, function (event) {
                ctrl.id = $(this).attr("id");
                ctrl.el = this;

                isDrag = true;
                prevValue = null;
                ctrl.is_drag = false;
                ctrl.is_drag_real = false;

                fnDrag(event, true, "mousedown", true);
                prev = { x: 0, y: 0 };
            });
        } else {
            $(el)
                .on("mousedown", function (event) {
                    ctrl.id = $(this).attr("id");
                    ctrl.el = this;

                    isDrag = true;
                    prevValue = null;
                    ctrl.is_drag = false;
                    ctrl.is_drag_real = false;

                    fnDrag(event, true, "mousedown", true);
                    prev = { x: 0, y: 0 };
                })
                .css("position", "absolute");
        }

        let prevMove = { x: 0, y: 0 };
        $(document).on("mousemove", function (event) {
            if (isDrag) {
                let dx = event.clientX - prevMove.x;
                let dy = event.clientY - prevMove.y;
                if (Math.pow(dx, 2) + Math.pow(dy, 2) < 5) return;

                ctrl.is_drag = true;
                ctrl.is_drag_real = true;

                fnDrag(event, false, "mousemove");
                keepScrollBarNotMove(el);
                prevMove = {
                    x: event.clientX,
                    y: event.clientY,
                };
            } else if (ctrl.mousemove) {
                let dx = event.clientX - prevMove.x;
                let dy = event.clientY - prevMove.y;
                if (Math.pow(dx, 2) + Math.pow(dy, 2) < 5) return;
                ctrl.mousemove(event);

                prevMove = {
                    x: event.clientX,
                    y: event.clientY,
                };
            }
        });

        $(document).on("mouseup", function (event) {
            if (isDrag) {
                fnDrag(event, true, "mouseup", true);
                keepScrollBarNotMove(el);
                isDrag = false;
                prevValue = null;
                ctrl.is_drag = false;
                delete ctrl.el;
            }
        });
        if (ctrl.mouseover) {
            $(el).on("mouseenter", function (event) {
                ctrl.mouseover(event);
                ctrl.is_hover = true;
            });
        }
        if (ctrl.mouseout) {
            $(el).on("mouseleave", function (event) {
                ctrl.mouseout(event);
                ctrl.is_hover = false;
            });
        }
    };

    const fnControlRadio = (ctrl) => {
        console.log("fnControlRatio initial", ctrl.name);
        let el = $(`#${ctrl.id}`);
        $(el).on("mousedown", function (event) {
            event.preventDefault();
            if (!ctrl.ignore_event_tracking) g_eventId += 1;
            g_latestMousePress = ctrl.id;

            if (ctrl.mousedown) ctrl.mousedown();
        });
    };

    const fnControlClickable = (ctrl) => {
        console.log("fnControlClickable initial", ctrl.name);
        let el = $(ctrl.id ? `#${ctrl.id}` : `.${ctrl.class}`);
        $(el).on("mousedown", function (event) {
            ctrl.id = $(this).attr("id");
            event.preventDefault();
            if (!ctrl.ignore_event_tracking) g_eventId += 1;
            g_latestMousePress = ctrl.id || ctrl.class;

            if (ctrl.mousedown) ctrl.mousedown();
        });
    };

    const fnControlCheckbox = (ctrl) => {
        console.log("fnControlCheckbox initial", ctrl.name);
        let el = $(`#${ctrl.id}`);
        $(el).on("mousedown", function (event) {
            event.preventDefault();
            if (!ctrl.ignore_event_tracking) g_eventId += 1;
            g_latestMousePress = ctrl.id;

            if (ctrl.mousedown) ctrl.mousedown();
        });
    };
    const fnControlButton = (ctrl) => {
        console.log(
            "fnControlButton initial",
            ctrl.is_group
                ? Object.keys(ctrl.flow_member)
                      .map((x) => `${ctrl.name}-${x}`)
                      .join(", ")
                : ctrl.name
        );

        let buttons = [];
        if (ctrl.is_group) {
            buttons = [
                ...Object.keys(ctrl.flow_member).map((x) => `#${ctrl.id}-${x}-inactive`), // inactive state
                ...(ctrl.event_for_active_state ? Object.keys(ctrl.flow_member).map((x) => `#${ctrl.id}-${x}-active`) : []), // active state
            ].filter((x) => x);
        } else {
            buttons = [`#${ctrl.id}-inactive`];
            if (ctrl.event_for_active_state) {
                buttons.push(`#${ctrl.id}-active`);
            }
        }

        let els = $(buttons.join(", "));

        els.on("mousedown", function (e) {
            if (!ctrl.ignore_event_tracking) g_eventId += 1;
            let currentEventId = g_eventId;
            g_latestMousePress = ctrl.id;
            ctrl.from_state = ctrl.value;
            // ctrl.value = "active";
            ctrl.render();

            if (ctrl.type == "button" && ctrl.from_state == "active" && ctrl.event_for_active_state) {
                // do nothing
            } else {
                animateButtonEffect(`#${ctrl.id}-group`, true, null, 0);
            }

            if (ctrl.allow_press) {
                let { mouse_press_delay } = ctrl;
                let itvPress;
                let count = 0;
                let fn = () => {
                    count += 1;
                    if (currentEventId != g_eventId) {
                        clearInterval(itvPress);

                        return;
                    }
                    ctrl.fn_mouseup({ isKeyPress: true, count });
                };

                setTimeout(() => {
                    if (currentEventId == g_eventId) {
                        g_isPressMouse = true;
                        fn();
                        itvPress = setInterval(fn, mouse_press_delay);
                    }
                }, 1000);
            }

            if (ctrl.mousedown) ctrl.mousedown();
        });
    };

    // g_state.controls.forEach((ctrl) => {
    //     switch (ctrl.type) {
    //         case "scrollbar":
    //             fnControlScrollbar(ctrl);
    //             break;

    //         case "drag":
    //             fnControlDrag(ctrl);
    //             break;

    //         case "radio":
    //             fnControlRadio(ctrl);

    //             break;

    //         case "checkbox":
    //             fnControlCheckbox(ctrl);
    //             break;

    //         case "button":
    //             fnControlButton(ctrl);
    //             break;

    //         case "clickable":
    //             fnControlClickable(ctrl);
    //             break;

    //         default:
    //             break;
    //     }

    //     if (ctrl.render) ctrl.render();
    // });

    // applyControlChange(true);

    $(document).on("mouseup", async function (e) {
        g_isMouseDown = false;
        console.log("g_latestMousePress mouseup", g_latestMousePress);

        let ctrl = g_state.controls.find((c) => c.id == g_latestMousePress || c.class == g_latestMousePress);
        if (ctrl) {
            if (!ctrl.ignore_event_tracking) g_eventId += 1;
            if (!ctrl.ignore_mouseup) {
                if (ctrl.type == "button") {
                    if (ctrl.is_group) {
                        ctrl.value = "inactive";
                        ctrl.value1 = ctrl.flow_member[ctrl.value1];
                        ctrl.render();
                    } else {
                        ctrl.value = "disabled";
                        ctrl.render();
                    }

                    if (ctrl.mouseup_immediately) ctrl.mouseup_immediately();

                    // animateButtonEffect(
                    //     `#${ctrl.id}-group`,
                    //     false,
                    //     function () {
                    //         ctrl.value = "inactive";
                    //         ctrl.render();

                    //         if (ctrl.mouseup) ctrl.mouseup(e);
                    //     },
                    //     0
                    // );
                    if (ctrl.mouseup) ctrl.mouseup(e);
                } else if (ctrl.mouseup) ctrl.mouseup(e);
            } else if (ctrl.type == "button" && ctrl.event_for_active_state) {
                ctrl.mouseup(e);
            }
        }

        g_latestMousePress = "";
        g_isPressMouse = false;
    });

    // setTimeout(() => {
    //     $("#divBody").css("opacity", 1);
    // }, 200);

    const initPoppup = (info, openCB, closeCB) => {
        /*
         info = {
            width: 992,
            height: 232,
            min_visible_x: 0.5 * 992,
            min_visible_y: 0.5 * 232,
            init_x: 244,
            init_y: 330.16,
        }
        */

        initState(info, openCB, closeCB);

        g_state.controls.forEach((ctrl) => {
            switch (ctrl.type) {
                case "scrollbar":
                    fnControlScrollbar(ctrl);
                    break;

                case "drag":
                    fnControlDrag(ctrl);
                    break;

                case "radio":
                    fnControlRadio(ctrl);

                    break;

                case "checkbox":
                    fnControlCheckbox(ctrl);
                    break;

                case "button":
                    fnControlButton(ctrl);
                    break;

                case "clickable":
                    fnControlClickable(ctrl);
                    break;

                default:
                    break;
            }

            if (ctrl.render) ctrl.render();
        });

        showElement("#divBody", true);
    };

    window.initPoppup = initPoppup;
});

let controlValuesPrev = JSON.stringify({});

const applyControlChange = (isSkipCache) => {
    let controlValues = JSON.stringify({
        // ..._.pick(g_state, ["menu", "menu_item_selected", "menu_data"]),
        controls: g_state.controls.filter((x) => !x.is_skip_check_reload).map((x) => _.pick(x, ["name", "value"])),
    });

    if (controlValues == controlValuesPrev && !isSkipCache) {
        return;
    }
    controlValuesPrev = controlValues;

    console.log("applyControlChange");
};

const openPopup = () => {
    g_state.show_popup = true;
    getControl("btn-show-popup").render();
};

// example
/*
$(document).ready(function () {
    setTimeout(() => {
        // 1. init popup
        initPoppup({
            width: 992,
            height: 232,
            min_visible_x: 0.5 * 992,
            min_visible_y: 0.5 * 232,
            init_x: 244,
            init_y: 330.16,
        },
        // open callback
        () => {
            $(".btn").css({ "z-index": -1 });
        },
        // close callback
        () => {
            $(".btn").css({ "z-index": 1 });
        });

        // 2. call openPopup
        openPopup();
    }, 20);
});
*/
