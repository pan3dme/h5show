/*
 (Built: Thu, Nov 24, 2016 11:30:22 PM)
 Marmoset Viewer Code and Tools
 
 Copyright (c) 2016 Marmoset LLC.
 All rights reserved.
 
 Redistribution and use of this software are permitted provided
 that the software remains whole and unmodified and this copyright
 notice remains attached. Use or inclusion of any portion of this
 code in other software programs is prohibited, excepting simple
 embedding of this file in web applications. This software, or any
 derivatives thereof, may not be resold, rented, leased, or
 distributed on any other for-charge basis.
 
 THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT ANY EXPRESS OR
 IMPLIED WARRANTIES, INCLUDING, WITHOUT LIMITATION, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
 */
marmoset = {};
(function (marmoset) {
    'use strict';

    function Archive(a) {
        this.files = [];
        for (a = new ByteStream(a); !a.empty();) {
            var b = {};
            b.name = a.readCString();
            b.type = a.readCString();
            var c = a.readUint32(),
                d = a.readUint32(),
                e = a.readUint32();
            b.data = a.readBytes(d);
            if (!(b.data.length < d)) {
                    if (c & 1 && (b.data = this.decompress(b.data, e), null === b.data)) continue;
                    this.files[b.name] = b
                }
        }
    }
    Archive.prototype.get = function (a) {
        return this.files[a]
    };
    Archive.prototype.extract = function (a) {
        var b = this.files[a];
        delete this.files[a];
        return b
    };
    Archive.prototype.checkSignature = function (a) {
        if (!a) return !1;
        var b = this.get(a.name + ".sig");
        if (!b) return !1;
        b = JSON.parse(String.fromCharCode.apply(null, b.data));
        if (!b) return !1;
        for (var c = 5381, d = 0; d < a.data.length; ++d) c = 33 * c + a.data[d] & 4294967295;
        a = new BigInt;
        a.setBytes([0, 233, 33, 170, 116, 86, 29, 195, 228, 46, 189, 3, 185, 31, 245, 19, 159, 105, 73, 190, 158, 80, 175, 38, 210, 116, 221, 229, 171, 134, 104, 144, 140, 5, 99, 255, 208, 78, 248, 215, 172, 44, 79, 83, 5, 244, 152, 19, 92, 137, 112, 10, 101, 142, 209, 100, 244, 92, 190, 125, 28, 0, 185, 54, 143, 247, 49, 37, 15, 254, 142, 180, 185, 232, 50, 219, 11, 186, 106, 116, 78, 212, 10, 105, 53, 26, 14, 181, 80, 47, 87, 213, 182, 19, 126, 151, 86, 109, 182, 224, 37, 135, 80, 59, 22, 93, 125, 68, 214, 106, 209, 152, 235, 157, 249, 245, 48, 76, 203, 0, 0, 95, 200, 246, 243, 229, 85, 79, 169], !0);
        d = new BigInt;
        d.setBytes(b[0]);
        return d.powmod(65537, a).toInt32() != c ? !1 : !0
    };
    Archive.prototype.decompress = function (a, b) {
        var c = new Uint8Array(b),
            d = 0,
            e = new Uint32Array(4096),
            f = new Uint32Array(4096),
            g = 256,
            h = a.length,
            k = 0,
            l = 1,
            m = 0,
            n = 1;
        c[d++] = a[0];
        for (var r = 1;; r++) {
                n = r + (r >> 1);
                if (n + 1 >= h) break;
                var m = a[n + 1],
                    n = a[n],
                    p = r & 1 ? m << 4 | n >> 4 : (m & 15) << 8 | n;
                if (p < g) if (256 > p) m = d,
                n = 1,
                c[d++] = p;
                else for (var m = d, n = f[p], p = e[p], q = p + n; p < q;) c[d++] = c[p++];
                else if (p == g) {
                        m = d;
                        n = l + 1;
                        p = k;
                        for (q = k + l; p < q;) c[d++] = c[p++];
                        c[d++] = c[k]
                    } else break;
                e[g] = k;
                f[g++] = l + 1;
                k = m;
                l = n;
                g = 4096 <= g ? 256 : g
            }
        return d == b ? c : null
    };

    function BigInt(a) {
        this.digits = new Uint16Array(a || 0)
    }
    BigInt.prototype.setBytes = function (a, b) {
        var c = (a.length + 1) / 2 | 0;
        this.digits = new Uint16Array(c);
        if (b) for (var d = 0, c = a.length - 1; 0 <= c; c -= 2) this.digits[d++] = a[c] + (0 < c ? 256 * a[c - 1] : 0);
        else for (d = 0; d < c; ++d) this.digits[d] = a[2 * d] + 256 * a[2 * d + 1];
        this.trim()
    };
    BigInt.prototype.toInt32 = function () {
        var a = 0;
        0 < this.digits.length && (a = this.digits[0], 1 < this.digits.length && (a |= this.digits[1] << 16));
        return a
    };
    BigInt.prototype.lessThan = function (a) {
        if (this.digits.length == a.digits.length) for (var b = this.digits.length - 1; 0 <= b; --b) {
            var c = this.digits[b],
                d = a.digits[b];
            if (c != d) return c < d
        }
        return this.digits.length < a.digits.length
    };
    BigInt.prototype.shiftRight = function () {
        for (var a = 0, b = this.digits, c = b.length - 1; 0 <= c; --c) {
            var d = b[c];
            b[c] = d >> 1 | a << 15;
            a = d
        }
        this.trim()
    };
    BigInt.prototype.shiftLeft = function (a) {
        if (0 < a) {
            var b = a / 16 | 0;
            a %= 16;
            for (var c = 16 - a, d = this.digits.length + b + 1, e = new BigInt(d), f = 0; f < d; ++f) e.digits[f] = ((f < b || f >= this.digits.length + b ? 0 : this.digits[f - b]) << a | (f < b + 1 ? 0 : this.digits[f - b - 1]) >>> c) & 65535;
            e.trim();
            return e
        }
        return new BigInt(this)
    };
    BigInt.prototype.bitCount = function () {
        var a = 0;
        if (0 < this.digits.length) for (var a = 16 * (this.digits.length - 1), b = this.digits[this.digits.length - 1]; b;) b >>>= 1,
        ++a;
        return a
    };
    BigInt.prototype.sub = function (a) {
        var b = this.digits,
            c = a.digits,
            d = this.digits.length;
        a = a.digits.length;
        for (var e = 0, f = 0; f < d; ++f) {
                var g = b[f],
                    h = f < a ? c[f] : 0,
                    h = h + e,
                    e = h > g ? 1 : 0,
                    g = g + (e << 16);
                b[f] = g - h & 65535
            }
        this.trim()
    };
    BigInt.prototype.mul = function (a) {
        for (var b = new BigInt(this.digits.length + a.digits.length), c = b.digits, d = 0; d < this.digits.length; ++d) for (var e = this.digits[d], f = 0; f < a.digits.length; ++f) for (var g = e * a.digits[f], h = d + f; g;) {
            var k = (g & 65535) + c[h];
            c[h] = k & 65535;
            g >>>= 16;
            g += k >>> 16;
            ++h
        }
        b.trim();
        return b
    };
    BigInt.prototype.mod = function (a) {
        if (0 >= this.digits.length || 0 >= a.digits.length) return new BigInt(0);
        var b = new BigInt(this.digits);
        if (!this.lessThan(a)) {
            for (var c = new BigInt(a.digits), c = c.shiftLeft(b.bitCount() - c.bitCount()); !b.lessThan(a);) c.lessThan(b) && b.sub(c),
            c.shiftRight();
            b.trim()
        }
        return b
    };
    BigInt.prototype.powmod = function (a, b) {
        for (var c = new BigInt([1]), d = this.mod(b); a;) a & 1 && (c = c.mul(d).mod(b)),
        a >>>= 1,
        d = d.mul(d).mod(b);
        return c
    };
    BigInt.prototype.trim = function () {
        for (var a = this.digits.length; 0 < a && 0 == this.digits[a - 1];)--a;
        a != this.digits.length && (this.digits = this.digits.subarray(0, a))
    };

    function Bounds(a) {
        for (var b = 0; b < a.length; ++b) {
            var c = a[b].bounds;
            if (void 0 === this.min) this.min = [c.min[0], c.min[1], c.min[2]],
            this.max = [c.max[0], c.max[1], c.max[2]];
            else for (var d = 0; 3 > d; ++d) this.min[d] = Math.min(c.min[d], this.min[d]),
            this.max[d] = Math.max(c.max[d], this.max[d])
        }
        this.min = this.min ? this.min : [0, 0, 0];
        this.max = this.max ? this.max : [0, 0, 0];
        this.center = [0.5 * (this.min[0] + this.max[0]), 0.5 * (this.min[1] + this.max[1]), 0.5 * (this.min[2] + this.max[2])];
        this.radius = [this.max[0] - this.center[0], this.max[1] - this.center[1], this.max[2] - this.center[2]]
    };

    function ByteStream(a) {
        this.bytes = new Uint8Array(a)
    }
    ByteStream.prototype.empty = function () {
        return 0 >= this.bytes.length
    };
    ByteStream.prototype.readCString = function () {
        for (var a = this.bytes, b = a.length, c = 0; c < b; ++c) if (0 == a[c]) return a = String.fromCharCode.apply(null, this.bytes.subarray(0, c)),
        this.bytes = this.bytes.subarray(c + 1),
        a;
        return null
    };
    ByteStream.prototype.asString = function () {
        for (var a = "", b = 0; b < this.bytes.length; ++b) a += String.fromCharCode(this.bytes[b]);
        return a
    };
    ByteStream.prototype.readBytes = function (a) {
        var b = this.bytes.subarray(0, a);
        this.bytes = this.bytes.subarray(a);
        return b
    };
    ByteStream.prototype.readUint32 = function () {
        var a = this.bytes,
            b = a[0] | a[1] << 8 | a[2] << 16 | a[3] << 24;
        this.bytes = a.subarray(4);
        return b
    };
    var prepareEmbedParams = function (a) {
        a = a || {};
        if (document.location.search) for (var b = document.location.search.substring(1).split("&"), c = 0; c < b.length; ++c) {
            var d = b[c].split("=");
            a[d[0]] = d[1]
        }
        b = function (a) {
            if (a | 0) return !0;
            for (var b = "true True TRUE yes Yes YES".split(" "), c = 0; c < b.length; ++c) if (a === b[c]) return !0;
            return !1
        };
        a.width = a.width || 800;
        a.height = a.height || 600;
        a.autoStart = b(a.autoStart);
        a.pagePreset = b(a.pagePreset);
        a.fullFrame = b(a.fullFrame) || b(a.bare);
        a.fullFrame = !a.pagePreset && a.fullFrame;
        return a
    },
        embed = function (a, b) {
            var c;
            b = prepareEmbedParams(b);
            var d = b.thumbnailURL;
            if (b.pagePreset) {
                c = new WebViewer(b.width, b.height, a, !! d);
                document.body.style.backgroundColor = "#d7e4da";
                var e = document.createElement("div");
                e.style.position = "relative";
                e.style.backgroundColor = "#e4e7e4";
                e.style.width = b.width + 12 + "px";
                e.style.height = b.height + 6 + 16 + "px";
                e.style.margin = "auto";
                e.style.boxShadow = "3px 5px 12px 0px grey";
                document.body.appendChild(e);
                var f = document.createElement("div");
                f.style.position = "relative";
                f.style.left = "6px";
                f.style.top = "6px";
                e.appendChild(f);
                f.appendChild(c.domRoot);
                if (!c.mobile) {
                    e.style.resize = "both";
                    e.style.overflow = "hidden";
                    var g = [e.style.width, e.style.height],
                        h = function () {
                            if (FullScreen.active()) e.style.resize = "none";
                            else if (e.style.resize = "both", g[0] != e.style.width || g[1] != e.style.height) g[0] = e.style.width,
                            g[1] = e.style.height,
                            c.resize(e.clientWidth - 12, e.clientHeight - 6 - 16);
                            window.setTimeout(h, 100)
                        };
                    h()
                }
            } else c = new WebViewer(b.fullFrame ? window.innerWidth : b.width, b.fullFrame ? window.innerHeight : b.height, a, !! d),
            document.body.appendChild(c.domRoot),
            b.fullFrame && (c.domRoot.style.position = "absolute", c.domRoot.style.left = c.domRoot.style.top = 0, window.addEventListener("resize", function () {
                FullScreen.active() || c.resize(window.innerWidth, window.innerHeight)
            }));
            c.ui.setThumbnailURL(d);
            b.autoStart && c.loadScene();
            return c
        },
        fetchThumbnail = function (a, b, c, d) {
            var e = -1 == a.indexOf("?") ? "?" : "&";
            Network.fetchBinaryIncremental(a + e + "thumb=1", function (a) {
                (a = (new Archive(a)).extract("thumbnail.jpg")) ? TextureCache.parseFile(a, b, d) : c && c();
                return 0
            }, c, 71680)
        },
        marmoset = "undefined" == typeof marmoset ? {} : marmoset;
    marmoset.embed = embed;
    marmoset.fetchThumbnail = fetchThumbnail;

    function Framebuffer(a, b) {
            this.gl = a;
            this.fbo = a.createFramebuffer();
            a.bindFramebuffer(a.FRAMEBUFFER, this.fbo);
            b && (this.width = b.width, this.height = b.height, b.color0 && (this.color0 = b.color0, a.framebufferTexture2D(a.FRAMEBUFFER, a.COLOR_ATTACHMENT0, a.TEXTURE_2D, this.color0.id, 0), this.width = b.color0.desc.width, this.height = b.color0.desc.height), b.depth ? (this.depth = b.depth, a.framebufferTexture2D(a.FRAMEBUFFER, a.DEPTH_ATTACHMENT, a.TEXTURE_2D, this.depth.id, 0)) : (this.depthBuffer = b.depthBuffer, b.createDepth && !this.depthBuffer && (this.depthBuffer = Framebuffer.createDepthBuffer(a, this.width, this.height)), this.depthBuffer && (a.bindRenderbuffer(a.RENDERBUFFER, this.depthBuffer), a.framebufferRenderbuffer(a.FRAMEBUFFER, a.DEPTH_ATTACHMENT, a.RENDERBUFFER, this.depthBuffer), a.bindRenderbuffer(a.RENDERBUFFER, null))));
            this.valid = b && b.ignoreStatus || a.checkFramebufferStatus(a.FRAMEBUFFER) == a.FRAMEBUFFER_COMPLETE;
            a.bindFramebuffer(a.FRAMEBUFFER, null)
        }
    Framebuffer.createDepthBuffer = function (a, b, c) {
            var d = a.createRenderbuffer();
            a.bindRenderbuffer(a.RENDERBUFFER, d);
            a.renderbufferStorage(a.RENDERBUFFER, a.DEPTH_COMPONENT16, b, c);
            a.bindRenderbuffer(a.RENDERBUFFER, null);
            return d
        };
    Framebuffer.prototype.bind = function () {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
            this.gl.viewport(0, 0, this.width, this.height)
        };
    Framebuffer.bindNone = function (a) {
            a.bindFramebuffer(a.FRAMEBUFFER, null)
        };
    var FullScreen = {
            support: function () {
                return !!(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled)
            },
            begin: function (a, b) {
                var c = a.requestFullscreen || a.webkitRequestFullScreen || a.mozRequestFullScreen || a.msRequestFullscreen;
                if (c) {
                    var d = function () {
                        FullScreen.active() || (document.removeEventListener("fullscreenchange", d), document.removeEventListener("webkitfullscreenchange", d), document.removeEventListener("mozfullscreenchange", d), document.removeEventListener("MSFullscreenChange", d));
                        b && b()
                    };
                    document.addEventListener("fullscreenchange", d);
                    document.addEventListener("webkitfullscreenchange", d);
                    document.addEventListener("mozfullscreenchange", d);
                    document.addEventListener("MSFullscreenChange", d);
                    c.bind(a)()
                }
            },
            end: function () {
                var a = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
                a && a.bind(document)()
            },
            active: function () {
                return !!(document.fullscreenElement || document.webkitIsFullScreen || document.mozFullScreenElement || document.msFullscreenElement)
            }
        };

    function Input(a) {
            this.onTap = [];
            this.onSingleTap = [];
            this.onDoubleTap = [];
            this.onDrag = [];
            this.onZoom = [];
            this.onPan = [];
            this.onPan2 = [];
            this.onAnything = [];
            this.macHax = 0 <= navigator.platform.toUpperCase().indexOf("MAC");
            a && this.attach(a)
        }
    Input.prototype.attach = function (a) {
            this.element = a;
            var b = function (a) {
                for (var b = 0; b < this.onAnything.length; ++b) this.onAnything[b]();
                a.preventDefault()
            }.bind(this);
            this.mouseStates = [{
                pressed: !1,
                position: [0, 0],
                downPosition: [0, 0]
            },
            {
                pressed: !1,
                position: [0, 0],
                downPosition: [0, 0]
            },
            {
                pressed: !1,
                position: [0, 0],
                downPosition: [0, 0]
            }];
            this.lastTapPos = [0, 0];
            a = function (a) {
                if (a.target === this.element) {
                    var d = this.mouseStates[a.button];
                    if (d) {
                        d.pressed = !0;
                        var e = this.element.getBoundingClientRect();
                        d.position[0] = d.downPosition[0] =
                        a.clientX - e.left;
                        d.position[1] = d.downPosition[1] = a.clientY - e.top;
                        b(a)
                    }
                }
            }.bind(this);
            this.element.addEventListener("mousedown", a);
            a = function (a) {
                var d = this.mouseStates[a.button];
                if (d) {
                    var e = this.element.getBoundingClientRect(),
                        f = a.clientX - e.left,
                        e = a.clientY - e.top;
                    d.pressed = !1;
                    d.position[0] = f;
                    d.position[1] = e;
                    if (0 == a.button && a.target == this.element && 10 > Math.abs(d.position[0] - d.downPosition[0]) + Math.abs(d.position[1] - d.downPosition[1])) {
                            for (var g = 0; g < this.onTap.length; ++g) this.onTap[g](f, e);
                            this.needSingleClick = !0;
                            window.setTimeout(function (a, b) {
                                if (this.needSingleClick) {
                                    for (var c = 0; c < this.onSingleTap.length; ++c) this.onSingleTap[c](a, b);
                                    this.needSingleClick = !1
                                }
                            }.bind(this, f, e), 301);
                            d = !1;
                            if (void 0 !== this.doubleClickTimer && (g = 8 > Math.abs(f - this.lastTapPos[0]) + Math.abs(e - this.lastTapPos[1]), 300 > Date.now() - this.doubleClickTimer && g)) for (d = !0, this.needSingleClick = !1, g = 0; g < this.onDoubleTap.length; ++g) this.onDoubleTap[g](f, e);
                            this.doubleClickTimer = Date.now();
                            d && (this.doubleClickTimer = -1E9);
                            this.lastTapPos[0] = f;
                            this.lastTapPos[1] =
                            e
                        }
                }
                b(a)
            }.bind(this);
            this.element.addEventListener("mouseup", a);
            a = function (a) {
                for (var d = !1, e = 0; 3 > e; ++e) {
                    var f = this.mouseStates[e];
                    if (f.pressed) {
                        var g = this.element.getBoundingClientRect(),
                            d = a.clientX - g.left,
                            g = a.clientY - g.top,
                            h = d - f.position[0],
                            k = g - f.position[1];
                        f.position[0] = d;
                        f.position[1] = g;
                        if (1 <= e || a.ctrlKey) for (f = 0; f < this.onPan.length; ++f) this.onPan[f](h, k);
                        else if (0 == e) if (a.shiftKey) for (f = 0; f < this.onPan2.length; ++f) this.onPan2[f](h, k);
                        else for (f = 0; f < this.onDrag.length; ++f) this.onDrag[f](d, g, h, k);
                        d = !0
                    }
                }
                d && b(a)
            }.bind(this);
            this.element.addEventListener("mousemove", a);
            a = function (a) {
                var d = 0;
                a.deltaY ? (d = -0.4 * a.deltaY, 1 == a.deltaMode ? d *= 16 : 2 == a.deltaMode && (d *= this.element.clientHeight)) : a.wheelDelta ? d = this.macHax && 120 == Math.abs(a.wheelDelta) ? 0.08 * a.wheelDelta : 0.4 * a.wheelDelta : a.detail && (d = -10 * a.detail);
                for (var e = 0; e < this.onZoom.length; ++e) this.onZoom[e](d);
                b(a)
            }.bind(this);
            this.element.addEventListener("mousewheel", a);
            this.element.addEventListener("DOMMouseScroll", a);
            this.element.addEventListener("wheel", a);
            a = function (a) {
                for (var b = 0; b < this.mouseStates.length; ++b) this.mouseStates[b].pressed = !1;
                a.preventDefault()
            }.bind(this);
            this.element.addEventListener("mouseleave", a);
            this.element.addEventListener("contextmenu", function (a) {
                a.preventDefault()
            });
            this.touches = {};
            this.tapPossible = !1;
            this.touchCountFloor = 0;
            a = function (a) {
                for (var d = this.element.getBoundingClientRect(), e = !1, f = 0; f < a.changedTouches.length; ++f) if (a.target === this.element) {
                    var g = a.changedTouches[f],
                        e = {
                            x: g.clientX - d.left,
                            y: g.clientY - d.top
                        };
                    e.startX =
                    e.x;
                    e.startY = e.y;
                    this.touches[g.identifier] = e;
                    e = !0
                }
                this.tapPossible = 1 == a.touches.length;
                for (g = d = 0; g < this.touches.length; ++g) d++;
                d > this.touchCountFloor && (this.touchCountFloor = d);
                e && b(a)
            }.bind(this);
            this.element.addEventListener("touchstart", a);
            a = function (a) {
                for (var d = !1, e = 0; e < a.changedTouches.length; ++e) {
                    var f = a.changedTouches[e],
                        g = this.touches[f.identifier];
                    if (g) {
                            if (this.tapPossible) {
                                var h = this.element.getBoundingClientRect(),
                                    d = f.clientX - h.left,
                                    h = f.clientY - h.top;
                                if (24 > Math.max(Math.abs(d - g.startX), Math.abs(h - g.startY))) {
                                        for (e = 0; e < this.onTap.length; ++e) this.onTap[e](d, h);
                                        this.needSingleTap = !0;
                                        window.setTimeout(function (a, b) {
                                            if (this.needSingleTap) {
                                                for (var c = 0; c < this.onSingleTap.length; ++c) this.onSingleTap[c](a, b);
                                                this.needSingleTap = !1
                                            }
                                        }.bind(this, d, h), 501);
                                        g = !1;
                                        if (void 0 !== this.doubleTapTimer) {
                                            var k = 24 > Math.max(Math.abs(d - this.lastTapPos[0]), Math.abs(h - this.lastTapPos[1])),
                                                l = 500 > Date.now() - this.doubleTapTimer;
                                            if (k && l) for (g = !0, e = 0; e < this.onDoubleTap.length; ++e) this.onDoubleTap[e](d, h)
                                        }
                                        this.doubleTapTimer =
                                        Date.now();
                                        g && (this.doubleTapTimer = -1E9);
                                        this.lastTapPos[0] = d;
                                        this.lastTapPos[1] = h
                                    }
                                this.tapPossible = !1
                            }
                            delete this.touches[f.identifier];
                            d = !0
                        }
                }
                for (f = e = 0; f < this.touches.length; ++f) e++;
                0 >= e && (this.touchCountFloor = 0);
                d && b(a)
            }.bind(this);
            this.element.addEventListener("touchend", a);
            this.element.addEventListener("touchcancel", a);
            this.element.addEventListener("touchleave", a);
            a = function (a) {
                for (var d = [], e = 0; e < a.touches.length; ++e) a.touches[e].target === this.element && d.push(a.touches[e]);
                var f = this.element.getBoundingClientRect();
                if (1 == d.length && 1 >= this.touchCountFloor) {
                    var g = d[0],
                        h = this.touches[g.identifier];
                    if (h) {
                            var k = g.clientX - f.left,
                                g = g.clientY - f.top,
                                f = k - h.x,
                                l = g - h.y;
                            h.x = k;
                            h.y = g;
                            for (e = 0; e < this.onDrag.length; ++e) this.onDrag[e](k, g, f, l, a.shiftKey)
                        }
                } else if (2 == d.length && 2 >= this.touchCountFloor) {
                    if (l = d[0], e = this.touches[l.identifier], g = d[1], h = this.touches[g.identifier], e && h) {
                        var k = l.clientX - f.left,
                            l = l.clientY - f.top,
                            m = g.clientX - f.left,
                            n = g.clientY - f.top,
                            r = Math.sqrt((k - m) * (k - m) + (l - n) * (l - n)),
                            p = Math.sqrt((e.x - h.x) * (e.x - h.x) + (e.y - h.y) * (e.y - h.y)),
                            q = Math.abs(r - p),
                            f = (k - e.x + m - h.x) / 2,
                            g = (l - e.y + n - h.y) / 2,
                            u = Math.sqrt(f * f + g * g);
                        e.x = k;
                        e.y = l;
                        h.x = m;
                        h.y = n;
                        if (0 < q) for (h = q / (q + u), e = 0; e < this.onZoom.length; ++e) this.onZoom[e](2 * (r - p) * h);
                        if (0 < u) for (h = u / (q + u), e = 0; e < this.onDrag.length; ++e) this.onPan[e](f * h, g * h)
                    }
                } else if (3 <= d.length) {
                    for (e = p = r = m = l = 0; e < d.length; ++e) g = d[e],
                    h = this.touches[g.identifier],
                    k = g.clientX - f.left,
                    g = g.clientY - f.top,
                    r += k,
                    p += g,
                    h && (l += h.x, m += h.y, h.x = k, h.y = g);
                    l /= d.length;
                    m /= d.length;
                    r /= d.length;
                    p /= d.length;
                    for (e = 0; e < this.onPan2.length; ++e) this.onPan2[e](r - l, p - m)
                }
                0 < d.length && b(a)
            }.bind(this);
            this.element.addEventListener("touchmove", a)
        };

    function Lights(a, b) {
            this.rotation = this.shadowCount = this.count = 0;
            this.positions = [];
            this.directions = [];
            this.matrixWeights = [];
            this.matrix = Matrix.identity();
            this.invMatrix = Matrix.identity();
            for (var c in a) this[c] = a[c];
            this.count = this.positions.length / 4;
            this.count = Math.min(6, this.count);
            this.shadowCount = Math.min(3, this.shadowCount);
            this.positions = new Float32Array(this.positions);
            this.positionBuffer = new Float32Array(this.positions);
            this.directions = new Float32Array(this.directions);
            this.directionBuffer =
            new Float32Array(this.directions);
            this.modelViewBuffer = new Float32Array(16 * this.shadowCount);
            this.projectionBuffer = new Float32Array(16 * this.shadowCount);
            this.finalTransformBuffer = new Float32Array(16 * this.shadowCount);
            this.inverseTransformBuffer = new Float32Array(16 * this.shadowCount);
            this.shadowTexelPadProjections = new Float32Array(4 * this.shadowCount);
            this.shadowsNeedUpdate = new Uint8Array(this.shadowCount);
            for (var d = 0; d < this.shadowsNeedUpdate.length; ++d) this.shadowsNeedUpdate[d] = 1;
            Matrix.rotation(this.matrix, this.rotation, 1);
            Matrix.transpose(this.invMatrix, this.matrix);
            for (d = 0; d < this.count; ++d) {
                c = this.positions.subarray(4 * d, 4 * d + 4);
                var e = this.directions.subarray(3 * d, 3 * d + 3);
                1 == this.matrixWeights[d] ? (Matrix.mul4(c, this.matrix, c[0], c[1], c[2], c[3]), Matrix.mulVec(e, this.matrix, e[0], e[1], e[2])) : 2 == this.matrixWeights[d] && (Matrix.mul4(c, b.viewMatrix, c[0], c[1], c[2], c[3]), Matrix.mulVec(e, b.viewMatrix, e[0], e[1], e[2]))
            }
        }
    Lights.prototype.getLightPos = function (a) {
            return this.positionBuffer.subarray(4 * a, 4 * a + 4)
        };
    Lights.prototype.getLightDir = function (a) {
            return this.directionBuffer.subarray(3 * a, 3 * a + 3)
        };
    Lights.prototype.update = function (a, b) {
            var c = new Matrix.type(this.matrix);
            Matrix.rotation(this.matrix, this.rotation, 1);
            Matrix.transpose(this.invMatrix, this.matrix);
            for (var d = 0; d < this.count; ++d) {
                var e = this.positions.subarray(4 * d, 4 * d + 4),
                    f = this.directions.subarray(3 * d, 3 * d + 3),
                    g = this.getLightPos(d),
                    h = this.getLightDir(d);
                1 == this.matrixWeights[d] ? (g[0] = e[0], g[1] = e[1], g[2] = e[2], g[3] = e[3], h[0] = f[0], h[1] = f[1], h[2] = f[2]) : 2 == this.matrixWeights[d] ? (Matrix.mul4(g, a.transform, e[0], e[1], e[2], e[3]), Matrix.mulVec(h, a.transform, f[0], f[1], f[2]), Matrix.mul4(g, this.matrix, g[0], g[1], g[2], g[3]), Matrix.mulVec(h, this.matrix, h[0], h[1], h[2])) : (Matrix.mul4(g, this.matrix, e[0], e[1], e[2], e[3]), Matrix.mulVec(h, this.matrix, f[0], f[1], f[2]));
                Vect.normalize(h, h)
            }
            for (var f = new Float32Array(this.finalTransformBuffer), g = Matrix.empty(), h = Matrix.empty(), k = Matrix.empty(), l = Vect.empty(), m = Vect.empty(), n = Vect.empty(), r = Vect.empty(), e = Vect.empty(), p = [], q = [], u = Matrix.create(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1), d = 0; d < this.count; ++d) {
                l =
                this.getLightPos(d);
                m = this.getLightDir(d);
                0.99 < Math.abs(m[1]) ? Vect.set(n, 1, 0, 0) : Vect.set(n, 0, 1, 0);
                Vect.cross(r, n, m);
                Vect.normalize(r, r);
                Vect.cross(n, m, r);
                Vect.normalize(n, n);
                Matrix.set(g, r[0], r[1], r[2], -Vect.dot(r, l), n[0], n[1], n[2], -Vect.dot(n, l), m[0], m[1], m[2], -Vect.dot(m, l), 0, 0, 0, 1);
                for (l = 0; 8 > l; ++l) e[0] = l & 1 ? b.max[0] : b.min[0],
                e[1] = l & 2 ? b.max[1] : b.min[1],
                e[2] = l & 4 ? b.max[2] : b.min[2],
                Matrix.mulPoint(e, this.matrix, 1.005 * e[0], 1.005 * e[1], 1.005 * e[2]),
                Matrix.mulPoint(e, g, e[0], e[1], e[2]),
                0 == l ? (p[0] = q[0] = e[0], p[1] = q[1] = e[1], p[2] = q[2] = e[2]) : (p[0] = Math.min(p[0], e[0]), p[1] = Math.min(p[1], e[1]), p[2] = Math.min(p[2], e[2]), q[0] = Math.max(q[0], e[0]), q[1] = Math.max(q[1], e[1]), q[2] = Math.max(q[2], e[2]));
                var l = -p[2],
                    m = -q[2],
                    s = this.spot[3 * d];
                0 < s ? (l = Math.min(l, 1 / this.parameters[3 * d + 2]), m = Math.max(0.005 * l, m), Matrix.perspective(h, s, 1, m, l), d < this.shadowCount && (l = 2 * -Math.tan(0.00872664625 * s), this.shadowTexelPadProjections[4 * d + 0] = this.modelViewBuffer[16 * d + 2] * l, this.shadowTexelPadProjections[4 * d + 1] = this.modelViewBuffer[16 * d + 6] * l, this.shadowTexelPadProjections[4 * d + 2] = this.modelViewBuffer[16 * d + 10] * l, this.shadowTexelPadProjections[4 * d + 3] = this.modelViewBuffer[16 * d + 14] * l)) : (Matrix.ortho(h, p[0], q[0], p[1], q[1], m, l), d < this.shadowCount && (this.shadowTexelPadProjections[4 * d + 0] = this.shadowTexelPadProjections[4 * d + 1] = this.shadowTexelPadProjections[4 * d + 2] = 0, this.shadowTexelPadProjections[4 * d + 3] = Math.max(q[0] - p[0], q[1] - p[1])));
                Matrix.mul(k, h, g);
                Matrix.mul(k, u, k);
                Matrix.copyToBuffer(this.modelViewBuffer, 16 * d, g);
                Matrix.copyToBuffer(this.projectionBuffer, 16 * d, h);
                Matrix.copyToBuffer(this.finalTransformBuffer, 16 * d, k);
                Matrix.invert(k, k);
                Matrix.copyToBuffer(this.inverseTransformBuffer, 16 * d, k)
            }
            e = !1;
            for (d = 0; d < c.length; ++d) if (c[d] != this.matrix[d]) {
                e = !0;
                break
            }
            for (d = 0; d < this.shadowCount; d++) if (e && 1 == this.matrixWeights[d]) this.shadowsNeedUpdate[d] = 1;
            else for (c = 16 * d; c < 16 * d + 16; ++c) if (f[c] != this.finalTransformBuffer[c]) {
                this.shadowsNeedUpdate[d] = 1;
                break
            }
        };

    function Material(a, b, c) {
            this.gl = a;
            this.name = c.name;
            var d = {
                mipmap: !0,
                aniso: a.hints.mobile ? 0 : 4,
                clamp: !! c.textureWrapClamp,
                mirror: !! c.textureWrapMirror
            },
                e = {
                    mipmap: d.mipmap,
                    clamp: d.clamp,
                    mirror: d.mirror,
                    nofilter: c.textureFilterNearest || !1
                };
            e.nofilter || (e.aniso = a.hints.mobile ? 2 : 4);
            this.textures = {
                    albedo: a.textureCache.fromFilesMergeAlpha(b.get(c.albedoTex), b.get(c.alphaTex), e),
                    reflectivity: a.textureCache.fromFilesMergeAlpha(b.get(c.reflectivityTex), b.get(c.glossTex), d),
                    normal: a.textureCache.fromFile(b.get(c.normalTex), d),
                    extras: a.textureCache.fromFilesMergeAlpha(b.get(c.extrasTex), b.get(c.extrasTexA), d)
                };
            this.extrasTexCoordRanges = {};
            if (c.extrasTexCoordRanges) for (var f in c.extrasTexCoordRanges) this.extrasTexCoordRanges[f] = new Float32Array(c.extrasTexCoordRanges[f].scaleBias);
            this.textures.extras || (b = new Texture(a, {
                    width: 1,
                    height: 1
                }), b.loadArray(new Uint8Array([255, 255, 255, 255])), this.textures.extras = b);
            var g = c.blendTint || [1, 1, 1];
            b = {
                    none: function () {
                        a.disable(a.BLEND)
                    },
                    alpha: function () {
                        a.enable(a.BLEND);
                        a.blendFuncSeparate(a.SRC_ALPHA, a.ONE_MINUS_SRC_ALPHA, a.ONE_MINUS_DST_ALPHA, a.ONE)
                    },
                    add: function () {
                        a.enable(a.BLEND);
                        a.blendColor(g[0], g[1], g[2], 1);
                        a.blendFunc(a.ONE, a.CONSTANT_COLOR)
                    }
                };
            this.blend = b[c.blend] || b.none;
            this.alphaTest = c.alphaTest || 0;
            this.usesBlending = this.blend !== b.none;
            this.shadowAlphaTest = this.alphaTest;
            0 >= this.shadowAlphaTest && this.blend === b.alpha && (this.shadowAlphaTest = 0.5);
            this.castShadows = this.blend !== b.add;
            this.horizonOcclude = c.horizonOcclude || 0;
            this.fresnel = new Float32Array(c.fresnel ? c.fresnel : [1, 1, 1]);
            this.emissiveIntensity =
            c.emissiveIntensity || 1;
            d = !1;
            e = [];
            0 < c.lightCount && e.push("#define LIGHT_COUNT " + c.lightCount);
            0 < c.shadowCount && e.push("#define SHADOW_COUNT " + Math.min(c.lightCount, c.shadowCount));
            0 < c.alphaTest && e.push("#define ALPHA_TEST");
            this.blend === b.alpha ? e.push("#define TRANSPARENCY_DITHER") : this.blend === b.none && e.push("#define NOBLEND");
            a.hints.mobile && e.push("#define MOBILE");
            f = function (a) {
                    return 1 / (2 / 3 * 3.1415962 * (a * a + a + 1))
                };
            c.useSkin && (e.push("#define SKIN"), this.skinParams = c.skinParams || {
                    subdermisColor: [1, 1, 1],
                    transColor: [1, 0, 0, 1],
                    fresnelColor: [0.2, 0.2, 0.2, 0.5],
                    fresnelOcc: 1,
                    fresnelGlossMask: 1,
                    transSky: 0.5,
                    shadowBlur: 0.5,
                    normalSmooth: 0.5,
                    transScatter: 0,
                    transDepth: 0,
                    millimeterScale: 1
                }, this.extrasTexCoordRanges.subdermisTex || e.push("#define SKIN_NO_SUBDERMIS_TEX"), this.extrasTexCoordRanges.translucencyTex || e.push("#define SKIN_NO_TRANSLUCENCY_TEX"), this.extrasTexCoordRanges.fuzzTex || e.push("#define SKIN_NO_FUZZ_TEX"), void 0 === this.skinParams.version && (this.skinParams.version = 1), 2 == this.skinParams.version ? (e.push("#define SKIN_VERSION_2"), this.skinParams.shadowBlur *= 4, this.skinParams.shadowBlur = Math.min(this.skinParams.shadowBlur, 40), this.skinParams.transIntegral = f(0.5 * this.skinParams.transScatter), this.skinParams.fresnelIntegral = 1 / 3.14159 * (1 - 0.5 * this.skinParams.fresnelColor[3]), this.skinParams.transSky = 0) : (e.push("#define SKIN_VERSION_1"), this.skinParams.shadowBlur = 8 * Math.min(this.skinParams.shadowBlur, 1), this.skinParams.transDepth = 0, this.skinParams.transScatter = this.skinParams.transColor[3], this.skinParams.transIntegral =
                1 / 3.14159 * (1 - 0.5 * this.skinParams.transScatter), this.skinParams.fresnelIntegral = 1 / 3.14159 * (1 - 0.5 * this.skinParams.fresnelColor[3]), this.skinParams.transSky *= 1.25, this.skinParams.transIntegral *= 1.25));
            c.aniso && (e.push("#define ANISO"), this.anisoParams = c.anisoParams || {
                    strength: 1,
                    tangent: [1, 0, 0],
                    integral: 0.5
                }, this.extrasTexCoordRanges.anisoTex || e.push("#define ANISO_NO_DIR_TEX"));
            c.microfiber && (e.push("#define MICROFIBER"), this.microfiberParams = c.microfiberParams || {
                    fresnelColor: [0.2, 0.2, 0.2, 0.5],
                    fresnelOcc: 1,
                    fresnelGlossMask: 1
                }, this.microfiberParams.fresnelIntegral = 1 / 3.14159 * (1 - 0.5 * this.microfiberParams.fresnelColor[3]), this.extrasTexCoordRanges.fuzzTex || e.push("#define MICROFIBER_NO_FUZZ_TEX"));
            c.vertexColor && (e.push("#define VERTEX_COLOR"), c.vertexColorsRGB && e.push("#define VERTEX_COLOR_SRGB"), c.vertexColorAlpha && e.push("#define VERTEX_COLOR_ALPHA"));
            this.horizonSmoothing = c.horizonSmoothing || 0;
            0 < this.horizonSmoothing && e.push("#define HORIZON_SMOOTHING");
            c.unlitDiffuse && e.push("#define DIFFUSE_UNLIT");
            this.extrasTexCoordRanges.emissiveTex && (e.push("#define EMISSIVE"), c.emissiveSecondaryUV && (e.push("#define EMISSIVE_SECONDARY_UV"), d = !0));
            this.extrasTexCoordRanges.aoTex && (e.push("#define AMBIENT_OCCLUSION"), c.aoSecondaryUV && (e.push("#define AMBIENT_OCCLUSION_SECONDARY_UV"), d = !0));
            c.tangentOrthogonalize && e.push("#define TSPACE_ORTHOGONALIZE");
            c.tangentNormalize && e.push("#define TSPACE_RENORMALIZE");
            c.tangentGenerateBitangent && e.push("#define TSPACE_COMPUTE_BITANGENT");
            d && e.push("#define TEXCOORD_SECONDARY");
            this.shader = a.shaderCache.fromURLs("matvert.glsl", "matfrag.glsl", e);
            e.push("#define STRIPVIEW");
            this.stripShader = a.shaderCache.fromURLs("matvert.glsl", "matfrag.glsl", e);
            this.wireShader = a.shaderCache.fromURLs("wirevert.glsl", "wirefrag.glsl");
            this.blend === b.alpha && (this.prepassShader = a.shaderCache.fromURLs("alphaprepassvert.glsl", "alphaprepassfrag.glsl"))
        }
    Material.prototype.bind = function (a) {
            if (!this.complete()) return !1;
            var b = a.view,
                c = a.lights,
                d = a.sky,
                e = a.shadow,
                f = a.stripData.active() ? this.stripShader : this.shader,
                g = this.skinParams,
                h = this.anisoParams,
                k = this.microfiberParams,
                l, m = this.gl,
                n = f.params,
                r = this.textures,
                p = f.samplers;
            f.bind();
            this.blend();
            var q = Matrix.mul(Matrix.empty(), b.projectionMatrix, b.viewMatrix);
            m.uniformMatrix4fv(n.uModelViewProjectionMatrix, !1, q);
            m.uniformMatrix4fv(n.uSkyMatrix, !1, c.matrix);
            q = Matrix.mulPoint(Vect.empty(), c.matrix, b.transform[12], b.transform[13], b.transform[14]);
            m.uniform3f(n.uCameraPosition, q[0], q[1], q[2]);
            m.uniform3fv(n.uFresnel, this.fresnel);
            m.uniform1f(n.uAlphaTest, this.alphaTest);
            m.uniform1f(n.uHorizonOcclude, this.horizonOcclude);
            m.uniform1f(n.uHorizonSmoothing, this.horizonSmoothing);
            m.uniform4fv(n.uDiffuseCoefficients, d.diffuseCoefficients);
            if (0 < c.count && (m.uniform4fv(n.uLightPositions, c.positionBuffer), m.uniform3fv(n.uLightDirections, c.directionBuffer), m.uniform3fv(n.uLightColors, c.colors), m.uniform3fv(n.uLightParams, c.parameters), m.uniform3fv(n.uLightSpot, c.spot), q = 0.392699 * a.postRender.sampleIndex, m.uniform2f(n.uShadowKernelRotation, 0.5 * Math.cos(q), 0.5 * Math.sin(q)), 0 < c.shadowCount)) {
                    var q = e.depthTextures[0].desc.width,
                        u = e.depthTextures[0].desc.height;
                    m.uniform4f(n.uShadowMapSize, q, u, 1 / q, 1 / u);
                    m.uniformMatrix4fv(n.uShadowMatrices, !1, c.finalTransformBuffer);
                    m.uniformMatrix4fv(n.uInvShadowMatrices, !1, c.inverseTransformBuffer);
                    m.uniform4fv(n.uShadowTexelPadProjections, c.shadowTexelPadProjections);
                    e.bindDepthTexture(p.tDepth0, 0);
                    e.bindDepthTexture(p.tDepth1, 1);
                    e.bindDepthTexture(p.tDepth2, 2)
                }
            g && (m.uniform3fv(n.uSubdermisColor, g.subdermisColor), m.uniform4fv(n.uTransColor, g.transColor), m.uniform1f(n.uTransScatter, g.transScatter), m.uniform4fv(n.uFresnelColor, g.fresnelColor), m.uniform1f(n.uFresnelOcc, g.fresnelOcc), m.uniform1f(n.uFresnelGlossMask, g.fresnelGlossMask), m.uniform1f(n.uFresnelIntegral, g.fresnelIntegral), m.uniform1f(n.uTransIntegral, g.transIntegral), m.uniform1f(n.uSkinTransDepth, g.transDepth), m.uniform1f(n.uTransSky, g.transSky), m.uniform1f(n.uSkinShadowBlur, g.shadowBlur), m.uniform1f(n.uNormalSmooth, g.normalSmooth), (l = this.extrasTexCoordRanges.subdermisTex) && m.uniform4fv(n.uTexRangeSubdermis, l), (l = this.extrasTexCoordRanges.translucencyTex) && m.uniform4fv(n.uTexRangeTranslucency, l), (l = this.extrasTexCoordRanges.fuzzTex) && m.uniform4fv(n.uTexRangeFuzz, l));
            k && (m.uniform4fv(n.uFresnelColor, k.fresnelColor), m.uniform1f(n.uFresnelOcc, k.fresnelOcc), m.uniform1f(n.uFresnelGlossMask, k.fresnelGlossMask), m.uniform1f(n.uFresnelIntegral, k.fresnelIntegral), (l = this.extrasTexCoordRanges.fuzzTex) && m.uniform4fv(n.uTexRangeFuzz, l));
            h && (m.uniform3fv(n.uAnisoTangent, h.tangent), m.uniform1f(n.uAnisoStrength, h.strength), m.uniform1f(n.uAnisoIntegral, h.integral), (l = this.extrasTexCoordRanges.anisoTex) && m.uniform4fv(n.uTexRangeAniso, l));
            if (l = this.extrasTexCoordRanges.emissiveTex) m.uniform4fv(n.uTexRangeEmissive, l),
            m.uniform1f(n.uEmissiveScale, this.emissiveIntensity);
                (l = this.extrasTexCoordRanges.aoTex) && m.uniform4fv(n.uTexRangeAO, l);
            r.albedo.bind(p.tAlbedo);
            r.reflectivity.bind(p.tReflectivity);
            r.normal.bind(p.tNormal);
            r.extras.bind(p.tExtras);
            d.specularTexture.bind(p.tSkySpecular);
            f === this.stripShader && (m.uniform1fv(n.uStrips, a.stripData.strips), m.uniform2f(n.uStripRes, 2 / b.size[0], 2 / b.size[1]));
            return !0
        };
    Material.prototype.bindAlphaPrepass = function (a) {
            if (!this.complete() || !this.prepassShader) return !1;
            var b = this.gl,
                c = this.prepassShader.params,
                d = this.prepassShader.samplers;
            this.prepassShader.bind();
            a = Matrix.mul(Matrix.empty(), a.view.projectionMatrix, a.view.viewMatrix);
            b.uniformMatrix4fv(c.uModelViewProjectionMatrix, !1, a);
            this.textures.albedo.bind(d.tAlbedo);
            return !0
        };
    Material.prototype.bindWire = function (a) {
            if (!this.complete()) return !1;
            var b = this.gl,
                c = this.wireShader.params,
                d = a.view;
            b.enable(b.BLEND);
            b.blendFunc(b.SRC_ALPHA, b.ONE_MINUS_SRC_ALPHA);
            b.depthMask(!1);
            this.wireShader.bind();
            var e = Matrix.mul(Matrix.empty(), d.projectionMatrix, d.viewMatrix);
            b.uniformMatrix4fv(c.uModelViewProjectionMatrix, !1, e);
            b.uniform4f(c.uStripParams, 2 / d.size[0], 2 / d.size[1], a.stripData.strips[3], a.stripData.strips[4]);
            return !0
        };
    Material.prototype.complete = function () {
            return this.wireShader.complete() && this.shader.complete() && this.stripShader.complete() && (!this.prepassShader || this.prepassShader.complete()) && this.textures.albedo.complete() && this.textures.reflectivity.complete() && this.textures.normal.complete()
        };
    var Matrix = {
            type: Float32Array,
            create: function (a, b, c, d, e, f, g, h, k, l, m, n, r, p, q, u) {
                var s = new Matrix.type(16);
                s[0] = a;
                s[4] = b;
                s[8] = c;
                s[12] = d;
                s[1] = e;
                s[5] = f;
                s[9] = g;
                s[13] = h;
                s[2] = k;
                s[6] = l;
                s[10] = m;
                s[14] = n;
                s[3] = r;
                s[7] = p;
                s[11] = q;
                s[15] = u;
                return s
            },
            empty: function () {
                return new Matrix.type(16)
            },
            identity: function () {
                var a = new Matrix.type(16);
                a[0] = 1;
                a[4] = 0;
                a[8] = 0;
                a[12] = 0;
                a[1] = 0;
                a[5] = 1;
                a[9] = 0;
                a[13] = 0;
                a[2] = 0;
                a[6] = 0;
                a[10] = 1;
                a[14] = 0;
                a[3] = 0;
                a[7] = 0;
                a[11] = 0;
                a[15] = 1;
                return a
            },
            set: function (a, b, c, d, e, f, g, h, k, l, m, n, r, p, q, u, s) {
                a[0] =
                b;
                a[4] = c;
                a[8] = d;
                a[12] = e;
                a[1] = f;
                a[5] = g;
                a[9] = h;
                a[13] = k;
                a[2] = l;
                a[6] = m;
                a[10] = n;
                a[14] = r;
                a[3] = p;
                a[7] = q;
                a[11] = u;
                a[15] = s
            },
            translation: function (a, b, c, d) {
                Matrix.set(a, 1, 0, 0, b, 0, 1, 0, c, 0, 0, 1, d, 0, 0, 0, 1);
                return a
            },
            rotation: function (a, b, c) {
                a[0] = 1;
                a[4] = 0;
                a[8] = 0;
                a[12] = 0;
                a[1] = 0;
                a[5] = 1;
                a[9] = 0;
                a[13] = 0;
                a[2] = 0;
                a[6] = 0;
                a[10] = 1;
                a[14] = 0;
                a[3] = 0;
                a[7] = 0;
                a[11] = 0;
                a[15] = 1;
                var d = 0.0174532925 * b;
                b = Math.sin(d);
                d = Math.cos(d);
                switch (c) {
                case 0:
                    a[5] = d;
                    a[9] = -b;
                    a[6] = b;
                    a[10] = d;
                    break;
                case 1:
                    a[0] = d;
                    a[8] = b;
                    a[2] = -b;
                    a[10] = d;
                    break;
                case 2:
                    a[0] = d,
                    a[4] = -b,
                    a[1] = b,
                    a[5] = d
                }
                return a
            },
            mul: function (a, b, c) {
                var d = b[0],
                    e = b[1],
                    f = b[2],
                    g = b[3],
                    h = b[4],
                    k = b[5],
                    l = b[6],
                    m = b[7],
                    n = b[8],
                    r = b[9],
                    p = b[10],
                    q = b[11],
                    u = b[12],
                    s = b[13],
                    z = b[14];
                b = b[15];
                var t = c[0],
                    v = c[1],
                    w = c[2],
                    x = c[3];
                a[0] = t * d + v * h + w * n + x * u;
                a[1] = t * e + v * k + w * r + x * s;
                a[2] = t * f + v * l + w * p + x * z;
                a[3] = t * g + v * m + w * q + x * b;
                t = c[4];
                v = c[5];
                w = c[6];
                x = c[7];
                a[4] = t * d + v * h + w * n + x * u;
                a[5] = t * e + v * k + w * r + x * s;
                a[6] = t * f + v * l + w * p + x * z;
                a[7] = t * g + v * m + w * q + x * b;
                t = c[8];
                v = c[9];
                w = c[10];
                x = c[11];
                a[8] = t * d + v * h + w * n + x * u;
                a[9] = t * e + v * k + w * r + x * s;
                a[10] = t * f + v * l + w * p + x * z;
                a[11] =
                t * g + v * m + w * q + x * b;
                t = c[12];
                v = c[13];
                w = c[14];
                x = c[15];
                a[12] = t * d + v * h + w * n + x * u;
                a[13] = t * e + v * k + w * r + x * s;
                a[14] = t * f + v * l + w * p + x * z;
                a[15] = t * g + v * m + w * q + x * b;
                return a
            },
            invert: function (a, b) {
                var c = b[0],
                    d = b[1],
                    e = b[2],
                    f = b[3],
                    g = b[4],
                    h = b[5],
                    k = b[6],
                    l = b[7],
                    m = b[8],
                    n = b[9],
                    r = b[10],
                    p = b[11],
                    q = b[12],
                    u = b[13],
                    s = b[14],
                    z = b[15],
                    t = c * h - d * g,
                    v = c * k - e * g,
                    w = c * l - f * g,
                    x = d * k - e * h,
                    A = d * l - f * h,
                    B = e * l - f * k,
                    C = m * u - n * q,
                    D = m * s - r * q,
                    E = m * z - p * q,
                    F = n * s - r * u,
                    G = n * z - p * u,
                    H = r * z - p * s,
                    y = t * H - v * G + w * F + x * E - A * D + B * C;
                if (!y) return null;
                y = 1 / y;
                a[0] = (h * H - k * G + l * F) * y;
                a[1] = (e * G - d * H - f * F) * y;
                a[2] = (u * B - s * A + z * x) * y;
                a[3] = (r * A - n * B - p * x) * y;
                a[4] = (k * E - g * H - l * D) * y;
                a[5] = (c * H - e * E + f * D) * y;
                a[6] = (s * w - q * B - z * v) * y;
                a[7] = (m * B - r * w + p * v) * y;
                a[8] = (g * G - h * E + l * C) * y;
                a[9] = (d * E - c * G - f * C) * y;
                a[10] = (q * A - u * w + z * t) * y;
                a[11] = (n * w - m * A - p * t) * y;
                a[12] = (h * D - g * F - k * C) * y;
                a[13] = (c * F - d * D + e * C) * y;
                a[14] = (u * v - q * x - s * t) * y;
                a[15] = (m * x - n * v + r * t) * y;
                return a
            },
            transpose: function (a, b) {
                a[0] = b[0];
                a[4] = b[1];
                a[8] = b[2];
                a[12] = b[3];
                a[1] = b[4];
                a[5] = b[5];
                a[9] = b[6];
                a[13] = b[7];
                a[2] = b[8];
                a[6] = b[9];
                a[10] = b[10];
                a[14] = b[11];
                a[3] = b[12];
                a[7] = b[13];
                a[11] = b[14];
                a[15] = b[15];
                return a
            },
            mul4: function (a, b, c, d, e, f) {
                a[0] = b[0] * c + b[4] * d + b[8] * e + b[12] * f;
                a[1] = b[1] * c + b[5] * d + b[9] * e + b[13] * f;
                a[2] = b[2] * c + b[6] * d + b[10] * e + b[14] * f;
                a[3] = b[3] * c + b[7] * d + b[11] * e + b[15] * f;
                return a
            },
            mulPoint: function (a, b, c, d, e) {
                a[0] = b[0] * c + b[4] * d + b[8] * e + b[12];
                a[1] = b[1] * c + b[5] * d + b[9] * e + b[13];
                a[2] = b[2] * c + b[6] * d + b[10] * e + b[14];
                return a
            },
            mulVec: function (a, b, c, d, e) {
                a[0] = b[0] * c + b[4] * d + b[8] * e;
                a[1] = b[1] * c + b[5] * d + b[9] * e;
                a[2] = b[2] * c + b[6] * d + b[10] * e;
                return a
            },
            perspective: function (a, b, c, d, e, f) {
                f = f || 0;
                b = 1 / Math.tan(0.00872664625 * b);
                a[0] = b / c;
                a[1] = a[2] = a[3] = 0;
                a[5] = b;
                a[4] = a[6] = a[7] = 0;
                a[8] = a[9] = 0;
                a[10] = (e + d) / (d - e) - 3.0518044E-5 * f;
                a[11] = -1;
                a[14] = 2 * e * d / (d - e);
                a[12] = a[13] = a[15] = 0;
                return a
            },
            perspectiveInfinite: function (a, b, c, d, e) {
                e = e || 0;
                b = 1 / Math.tan(0.00872664625 * b);
                a[0] = b / c;
                a[1] = a[2] = a[3] = 0;
                a[5] = b;
                a[4] = a[6] = a[7] = 0;
                a[8] = a[9] = 0;
                a[10] = a[11] = -1 - 3.0518044E-5 * e;
                a[14] = -2 * d;
                a[12] = a[13] = a[15] = 0;
                return a
            },
            ortho: function (a, b, c, d, e, f, g, h) {
                var k = 1 / (c - b),
                    l = 1 / (e - d),
                    m = 1 / (g - f);
                a[0] = k + k;
                a[1] = a[2] = a[3] = 0;
                a[5] = l + l;
                a[4] = a[6] = a[7] = 0;
                a[12] = -(c + b) * k;
                a[13] = -(e + d) * l;
                a[10] = -(m + m) - 3.0518044E-5 * (h || 0);
                a[14] = -(g + f) * m;
                a[8] = a[9] = a[11] = 0;
                a[15] = 1;
                return a
            },
            lookAt: function (a, b, c, d) {
                var e = a.subarray(0, 3),
                    f = a.subarray(4, 7),
                    g = a.subarray(8, 11);
                Vect.sub(g, b, c);
                Vect.cross(e, d, g);
                Vect.normalize(g, g);
                Vect.normalize(e, e);
                Vect.cross(f, g, e);
                Matrix.set(a, e[0], e[1], e[2], -Vect.dot(e, b), f[0], f[1], f[2], -Vect.dot(f, b), g[0], g[1], g[2], -Vect.dot(g, b), 0, 0, 0, 1)
            },
            copy: function (a, b) {
                for (var c = 0; 16 > c; ++c) a[c] = b[c]
            },
            copyToBuffer: function (a, b, c) {
                for (var d = 0; 16 > d; ++d) a[b + d] = c[d]
            }
        };

    function Mesh(a, b, c) {
	
            this.gl = a;
            this.desc = b;
            this.name = b.name;
            this.modelMatrix = Matrix.identity();
            this.origin = b.transform ? Vect.create(b.transform[12], b.transform[13], b.transform[14], 1) : Vect.create(0, 5, 0, 1);
            this.stride = 32;
            if (this.vertexColor = b.vertexColor) this.stride += 4;
            if (this.secondaryTexCoord = b.secondaryTexCoord) this.stride += 8;
            c = new ByteStream(c.data);
            this.indexCount = b.indexCount;
            this.indexTypeSize = b.indexTypeSize;
            this.indexType = 4 == this.indexTypeSize ? a.UNSIGNED_INT : a.UNSIGNED_SHORT;
            this.indexBuffer = a.createBuffer();
            a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
				
            var d = c.readBytes(this.indexCount * this.indexTypeSize);
	
	   var indexArr=new Array()
	   var outIndexStr=""
		for(var i =0;i<d.length/2;i++){
				var buf=new ArrayBuffer(2);
				var bdata=new Uint8Array(buf);
				bdata[0]=d[i*2+0];
				bdata[1]=d[i*2+1];
				var vt=	new Uint16Array(buf)
				indexArr.push(vt[0])
				outIndexStr+=vt[0]+","
			}

	
            a.bufferData(a.ELEMENT_ARRAY_BUFFER,  new Uint16Array(indexArr), a.STATIC_DRAW);
            this.wireCount = b.wireCount;
            this.wireBuffer = a.createBuffer();
            a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, this.wireBuffer);
            d = c.readBytes(this.wireCount * this.indexTypeSize);
            a.bufferData(a.ELEMENT_ARRAY_BUFFER, d, a.STATIC_DRAW);
	
            a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, null);
            this.vertexCount = b.vertexCount;
            this.vertexBuffer = a.createBuffer();
            a.bindBuffer(a.ARRAY_BUFFER, this.vertexBuffer);
			
            c = c.readBytes(this.vertexCount * this.stride);
	
		    var outIndexStr="";
	
			 for(var i =0;i<c.length;i++){
				outIndexStr+=c[i]+","
			}
	
			
	        var vertexArr=new Array();
	
			
			for(var i =0;i<c.length/4;i++){
				var buf=new ArrayBuffer(4);
				var bdata=new Uint8Array(buf);
				bdata[0]=c[i*4+0];
				bdata[1]=c[i*4+1];
				bdata[2]=c[i*4+2];
				bdata[3]=c[i*4+3];
				var vt=	new Float32Array(buf)
				vertexArr.push(vt[0]);
			}
			var outIndexStr="";
		    var uint16arr=new Array();
			for(var i =0;i<c.length/2;i++){
				var buf=new ArrayBuffer(2);
				var bdata=new Uint8Array(buf);
				bdata[0]=c[i*2+0];
				bdata[1]=c[i*2+1];
				var vt=	new Uint16Array(buf)
			
			
				uint16arr.push(vt[0]);
			}
			var outIndexStr="";

			var oldA
			var oldB
			for(var i =0;i<uint16arr.length/16;i++){
				outIndexStr+=uint16arr[i*16+14]+","
				outIndexStr+=uint16arr[i*16+15]+","
				
			
		
				uint16arr[i*16+14]
				uint16arr[i*16+15]

			}
			//console.log(uint16arr.length/16)
			//console.log(outIndexStr)
		
		
            a.bufferData(a.ARRAY_BUFFER, new Uint16Array(uint16arr), a.STATIC_DRAW);
			
            a.bindBuffer(a.ARRAY_BUFFER, null);
            this.bounds = void 0 === b.minBound || void 0 === b.maxBound ? {
                min: Vect.create(-10, -10, -10, 1),
                max: Vect.create(10, 10, -0, 1)
            } : {
                min: Vect.create(b.minBound[0], b.minBound[1], b.minBound[2], 1),
                max: Vect.create(b.maxBound[0], b.maxBound[1], b.maxBound[2], 1)
            };
            this.bounds.maxExtent = Math.max(Math.max(b.maxBound[0] - b.minBound[0], b.maxBound[1] - b.minBound[1]), b.maxBound[2] - b.minBound[2])


        };

    function MeshRenderable(a, b, c) {
            this.mesh = a;
            this.gl = this.mesh.gl;
            this.indexOffset = b.firstIndex * a.indexTypeSize;
            this.indexCount = b.indexCount;
            this.wireIndexOffset = b.firstWireIndex * a.indexTypeSize;
            this.wireIndexCount = b.wireIndexCount;
            this.material = c
        }
    MeshRenderable.prototype.draw = function (a) {
            var b = this.gl;
            if (this.material.bind(a)) {
                a = this.material.shader.attribs;
                var c = this.mesh.stride;
                this.mesh.desc.cullBackFaces ? (b.enable(b.CULL_FACE), b.cullFace(b.BACK)) : b.disable(b.CULL_FACE);
                b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
                b.bindBuffer(b.ARRAY_BUFFER, this.mesh.vertexBuffer);
                b.enableVertexAttribArray(a.vPosition);
                b.enableVertexAttribArray(a.vTexCoord);
                b.enableVertexAttribArray(a.vTangent);
                b.enableVertexAttribArray(a.vBitangent);
                b.enableVertexAttribArray(a.vNormal);
                var d = this.mesh.vertexColor && void 0 !== a.vColor;
                d && b.enableVertexAttribArray(a.vColor);
                var e = this.mesh.secondaryTexCoord && void 0 !== a.vTexCoord2;
                e && b.enableVertexAttribArray(a.vTexCoord2);
                var f = 0;
                b.vertexAttribPointer(a.vPosition, 3, b.FLOAT, !1, c, f);
                f += 12;
                b.vertexAttribPointer(a.vTexCoord, 2, b.FLOAT, !1, c, f);
                f += 8;
                this.mesh.secondaryTexCoord && (e && b.vertexAttribPointer(a.vTexCoord2, 2, b.FLOAT, !1, c, f), f += 8);
                b.vertexAttribPointer(a.vTangent, 2, b.UNSIGNED_SHORT, !0, c, f);
                f += 4;
                b.vertexAttribPointer(a.vBitangent, 2, b.UNSIGNED_SHORT, !0, c, f);
                f += 4;
                b.vertexAttribPointer(a.vNormal, 2, b.UNSIGNED_SHORT, !0, c, f);
              
	
			
                b.drawElements(b.TRIANGLES, this.indexCount, this.mesh.indexType, this.indexOffset);
                b.disableVertexAttribArray(a.vPosition);
                b.disableVertexAttribArray(a.vTexCoord);
                b.disableVertexAttribArray(a.vTangent);
                b.disableVertexAttribArray(a.vBitangent);
                b.disableVertexAttribArray(a.vNormal);
                d && b.disableVertexAttribArray(a.vColor);
                e && b.disableVertexAttribArray(a.vTexCoord2)
            }
        };
    MeshRenderable.prototype.drawShadow = function (a) {
        
        };
    MeshRenderable.prototype.drawAlphaShadow = function (a, b) {
   
        };
    MeshRenderable.prototype.drawAlphaPrepass = function (a) {
  
        };
    MeshRenderable.prototype.drawWire = function () {
      
        };
    MeshRenderable.prototype.complete = function () {
            return this.material.complete()
        };
    var Network = {
            fetchImage: function (a, b, c) {
                var d = new Image;
                d.crossOrigin = "Anonymous";
                d.onload = function () {
                    0 < d.width && 0 < d.height ? b(d) : c && c()
                };
                c && (req.onerror = function () {
                    c()
                });
                d.src = a
            },
            fetchText: function (a, b, c, d) {
                var e = new XMLHttpRequest;
                e.open("GET", a, !0);
                e.onload = function () {
                    200 == e.status ? b(e.responseText) : c && c()
                };
                c && (e.onerror = function () {
                    c()
                });
                d && (e.onprogress = function (a) {
                    d(a.loaded, a.total)
                });
                e.send()
            },
            fetchBinary: function (a, b, c, d) {
                var e = new XMLHttpRequest;
                e.open("GET", a, !0);
                e.responseType = "arraybuffer";
                e.onload = function () {
                    200 == e.status ? b(e.response) : c && c()
                };
                c && (e.onerror = function () {
                    c()
                });
                d && (e.onprogress = function (a) {
                    d(a.loaded, a.total)
                });
                e.send()
            },
            fetchBinaryIncremental: function (a, b, c, d) {
                var e = new XMLHttpRequest;
                e.open("HEAD", a, !0);
                e.onload = function () {
                    if (200 == e.status) {
                        var f = e.getResponseHeader("Accept-Ranges");
                        if (f && "none" != f) {
                            var g = e.getResponseHeader("Content-Length") | 0,
                                h = function (c, e) {
                                    var f = new XMLHttpRequest;
                                    f.open("GET", a, !0);
                                    f.setRequestHeader("Range", "bytes=" + c + "-" + e);
                                    f.responseType = "arraybuffer";
                                    f.onload = function () {
                                        (206 == f.status || 200 == f.status) && b(f.response) && e < g && (c += d, e += d, e = e < g - 1 ? e : g - 1, h(c, e))
                                    };
                                    f.send()
                                };
                            h(0, d - 1)
                        } else c && c()
                    } else c && c()
                };
                c && (req.onerror = function () {
                    c()
                });
                e.send()
            }
        };

    function PostRender(a, b, c) {
            this.gl = a;
            this.desc = b;
            b = [];
            0 != this.desc.sharpen && b.push("#define SHARPEN");
            (this.useBloom = 0 < this.desc.bloomColor[0] * this.desc.bloomColor[3] || 0 < this.desc.bloomColor[1] * this.desc.bloomColor[3] || 0 < this.desc.bloomColor[2] * this.desc.bloomColor[3]) && b.push("#define BLOOM");
            0 != this.desc.vignette[3] && b.push("#define VIGNETTE");
            1 == this.desc.saturation[0] * this.desc.saturation[3] && 1 == this.desc.saturation[1] * this.desc.saturation[3] && 1 == this.desc.saturation[2] * this.desc.saturation[3] || b.push("#define SATURATION");
            1 == this.desc.contrast[0] * this.desc.contrast[3] && 1 == this.desc.contrast[1] * this.desc.contrast[3] && 1 == this.desc.contrast[2] * this.desc.contrast[3] && 1 == this.desc.brightness[0] * this.desc.brightness[3] && 1 == this.desc.brightness[1] * this.desc.brightness[3] && 1 == this.desc.brightness[2] * this.desc.brightness[3] || b.push("#define CONTRAST");
            0 != this.desc.grain && b.push("#define GRAIN");
            1 == this.desc.toneMap ? b.push("#define REINHARD") : 2 == this.desc.toneMap && b.push("#define HEJL");
            this.desc.colorLUT && b.push("#define COLOR_LUT");
            this.sampleCount = 1;
            this.sampleIndex = 0;
            c && (c = [], this.gl.hints.mobile ? (this.sampleCount = 3, this.sampleOffsets = [
                [-0.4375, -0.5625],
                [0.625, -0.25],
                [-0.1875, 0.5]
            ]) : (c.push("#define HIGHQ"), this.sampleCount = 4, this.sampleOffsets = [
                [-0.5, -0.5],
                [0.5, -0.5],
                [-0.5, 0.5],
                [0.5, 0.5]
            ]), this.aaResolve = a.shaderCache.fromURLs("postvert.glsl", "aaresolve.glsl", c));
            this.samplesValid = new Uint8Array(4);
            this.shader = a.shaderCache.fromURLs("postvert.glsl", "postfrag.glsl", b);
            this.plainShader = a.shaderCache.fromURLs("postvert.glsl", "postfrag.glsl", []);
            this.fullscreenTriangle = a.createBuffer();
            a.bindBuffer(a.ARRAY_BUFFER, this.fullscreenTriangle);
            c = new Float32Array([0, 0, 2, 0, 0, 2]);
            a.bufferData(a.ARRAY_BUFFER, c, a.STATIC_DRAW);
            a.bindBuffer(a.ARRAY_BUFFER, null);
            if (this.useBloom) {
                this.bloomTextures = [];
                this.bloomTargets = [];
                for (c = 0; 2 > c; ++c) b = {
                    width: 256,
                    height: 256,
                    clamp: !0
                },
                this.bloomTextures[c] = new Texture(a, b),
                this.bloomTextures[c].loadArray(null, a.RGBA, a.ext.textureHalf && a.ext.textureHalfLinear ? a.ext.textureHalf.HALF_FLOAT_OES : a.UNSIGNED_BYTE),
                this.bloomTargets[c] = new Framebuffer(a, {
                    width: b.width,
                    height: b.height,
                    color0: this.bloomTextures[c]
                });
                for (this.bloomSamples = 64; this.bloomSamples + 16 >= a.limits.fragmentUniforms;) this.bloomSamples /= 2;
                this.bloomShader = a.shaderCache.fromURLs("postvert.glsl", "bloom.glsl", ["#define BLOOM_SAMPLES " + this.bloomSamples]);
                this.shrinkShader = a.shaderCache.fromURLs("postvert.glsl", "bloomshrink.glsl")
            }
            a = new Uint8Array(16384);
            for (c = 0; 16384 > c; c++) {
                b = 255 * Math.random();
                var d = 255 * Math.random();
                a[c] = 0.5 * (b + d)
            }
            this.noiseTexture =
            new Texture(this.gl, {
                width: 128,
                height: 128
            });
            this.noiseTexture.loadArray(a, this.gl.LUMINANCE);
            this.desc.colorLUT && (a = this.desc.colorLUT, this.colorLUT = new Texture(this.gl, {
                width: a.length / 3 | 0,
                height: 1,
                clamp: !0
            }), this.colorLUT.loadArray(new Uint8Array(a), this.gl.RGB));
            this.blackTexture = new Texture(this.gl, {
                width: 1,
                height: 1
            });
            this.blackTexture.loadArray(new Uint8Array([0, 0, 0, 0]));
            this.bloomResult = this.blackTexture
        }
    PostRender.prototype.prepareBloom = function (a) {
            if (this.useBloom && this.bloomShader.complete() && this.shrinkShader.complete()) {
                this.shrinkShader.bind();
                this.bloomTargets[1].bind();
                a.bind(this.shrinkShader.samplers.tInput);
                this.fillScreen(this.shrinkShader.attribs.vCoord);
                this.bloomShader.bind();
                var b = [];
                this.bloomTargets[0].bind();
                this.bloomTextures[1].bind(this.bloomShader.samplers.tInput);
                for (var c = 0, d = 0; d < this.bloomSamples; ++d) {
                    var e = -1 + 2 * d / (this.bloomSamples - 1),
                        f;
                    f = 4 * e;
                    f = Math.exp(-0.5 * f * f / 1) / 2.50662827463;
                    c += f;
                    b[4 * d + 0] = e * this.desc.bloomSize;
                    b[4 * d + 1] = 0;
                    b[4 * d + 2] = f;
                    b[4 * d + 3] = 0
                }
                for (d = 0; d < this.bloomSamples; ++d) b[4 * d + 2] /= c;
                this.gl.uniform4fv(this.bloomShader.params.uKernel, b);
                this.fillScreen(this.bloomShader.attribs.vCoord);
                this.bloomTargets[1].bind();
                this.bloomTextures[0].bind(this.bloomShader.samplers.tInput);
                for (d = 0; d < this.bloomSamples; ++d) c = b[4 * d + 0],
                c *= a.desc.width / a.desc.height,
                b[4 * d + 0] = 0,
                b[4 * d + 1] = c;
                this.gl.uniform4fv(this.bloomShader.params.uKernel, b);
                this.fillScreen(this.bloomShader.attribs.vCoord);
                this.bloomResult = this.bloomTextures[1]
            } else this.bloomResult = this.blackTexture
        };
    PostRender.prototype.computeParams = function (a, b) {
            var c = this.desc,
                d = {};
            d.scale = [c.contrast[0] * c.contrast[3], c.contrast[1] * c.contrast[3], c.contrast[2] * c.contrast[3]];
            d.bias = [c.bias[0] * c.bias[3], c.bias[1] * c.bias[3], c.bias[2] * c.bias[3]];
            d.bias = [-d.bias[0] * d.scale[0] + d.bias[0], -d.bias[1] * d.scale[1] + d.bias[1], -d.bias[2] * d.scale[2] + d.bias[2]];
            var e = [c.brightness[0] * c.brightness[3], c.brightness[1] * c.brightness[3], c.brightness[2] * c.brightness[3]];
            d.scale = [d.scale[0] * e[0], d.scale[1] * e[1], d.scale[2] * e[2]];
            d.bias = [d.bias[0] * e[0], d.bias[1] * e[1], d.bias[2] * e[2]];
            d.saturation = [c.saturation[0] * c.saturation[3], c.saturation[1] * c.saturation[3], c.saturation[2] * c.saturation[3]];
            d.bloomColor = [c.bloomColor[0] * c.bloomColor[3], c.bloomColor[1] * c.bloomColor[3], c.bloomColor[2] * c.bloomColor[3]];
            d.sharpen = [c.sharpen, 0.25 * c.sharpen, c.sharpenLimit];
            d.sharpenKernel = [1 / a, 0, 0, 1 / b];
            e = a > b ? a : b;
            d.vignetteAspect = [a / e, b / e, 0.5 * a / e, 0.5 * b / e];
            d.vignette = [2 * (1 - c.vignette[0]) * c.vignette[3], 2 * (1 - c.vignette[1]) * c.vignette[3], 2 * (1 - c.vignette[2]) * c.vignette[3], c.vignetteCurve];
            var e = 1 / this.noiseTexture.desc.width,
                f = 1 / this.noiseTexture.desc.height,
                g = 1 - c.grainSharpness;
            d.grainCoord = [e * a, f * b, 0.5 * g * e, 0.5 * g * f];
            d.grainScaleBias = [2 * c.grain, -c.grain];
            return d
        };
    PostRender.prototype.present = function (a, b, c, d) {
            1 < this.sampleCount && this.allocAABuffers(a.desc.width, a.desc.height);
            d || this.prepareBloom(a);
            var e = d ? this.plainShader : this.shader;
            if (e.bind()) {
                d = this.gl;
                var f = e.samplers,
                    g = e.params,
                    h = this.computeParams(b, c);
                a.bind(f.tInput);
                this.bloomResult.bind(f.tBloom);
                this.noiseTexture.bind(f.tGrain);
                this.colorLUT && this.colorLUT.bind(f.tLUT);
                d.uniform3fv(g.uScale, h.scale);
                d.uniform3fv(g.uBias, h.bias);
                d.uniform3fv(g.uSaturation, h.saturation);
                d.uniform4fv(g.uSharpenKernel, h.sharpenKernel);
                d.uniform3fv(g.uSharpness, h.sharpen);
                d.uniform3fv(g.uBloomColor, h.bloomColor);
                d.uniform4fv(g.uVignetteAspect, h.vignetteAspect);
                d.uniform4fv(g.uVignette, h.vignette);
                d.uniform4fv(g.uGrainCoord, h.grainCoord);
                d.uniform2fv(g.uGrainScaleBias, h.grainScaleBias);
                if (this.aaResolve) {
                        this.sampleFramebuffers[this.sampleIndex].bind();
                        this.fillScreen(e.attribs.vCoord);
                        this.samplesValid[this.sampleIndex] = 1;
                        Framebuffer.bindNone(d);
                        d.viewport(0, 0, b, c);
                        this.aaResolve.bind();
                        for (b = a = 0; b < this.sampleCount; ++b) a += this.samplesValid[b],
                        this.sampleTextures[b].bind(this.aaResolve.samplers["tInput" + b]);
                        a = 1 / a;
                        d.uniform4fv(this.aaResolve.params.uSamplesValid, [this.samplesValid[0] ? a : 0, this.samplesValid[1] ? a : 0, this.samplesValid[2] ? a : 0, this.samplesValid[3] ? a : 0]);
                        this.fillScreen(this.aaResolve.attribs.vCoord);
                        this.sampleIndex = (this.sampleIndex + 1) % this.sampleCount
                    } else Framebuffer.bindNone(d),
                d.viewport(0, 0, b, c),
                this.fillScreen(e.attribs.vCoord)
            }
        };
    PostRender.prototype.allocAABuffers = function (a, b) {
            if (void 0 === this.sampleTextures || this.sampleTextures[0].desc.width != a || this.sampleTextures[0].desc.height != b) {
                this.sampleTextures = [];
                this.sampleFramebuffers = [];
                for (var c = 0; c < this.sampleCount; ++c) {
                    var d = new Texture(this.gl, {
                        width: a,
                        height: b,
                        nofilter: !0
                    });
                    d.loadArray();
                    this.sampleTextures.push(d);
                    this.sampleFramebuffers.push(new Framebuffer(this.gl, {
                        width: a,
                        height: b,
                        color0: d,
                        ignoreStatus: !0
                    }))
                }
                this.discardAAHistory()
            }
        };
    PostRender.prototype.adjustProjectionForSupersampling = function (a) {
            if (1 < this.sampleCount) {
                var b = this.sampleOffsets[this.sampleIndex][0] / a.size[0],
                    c = this.sampleOffsets[this.sampleIndex][1] / a.size[1],
                    b = Matrix.translation(Matrix.empty(), b, c, 0);
                Matrix.mul(a.projectionMatrix, b, a.projectionMatrix)
            }
        };
    PostRender.prototype.discardAAHistory = function () {
            for (var a = this.sampleIndex = 0; a < this.samplesValid.length; ++a) this.samplesValid[a] = 0
        };
    PostRender.prototype.fillScreen = function (a) {
            var b = this.gl;
            b.bindBuffer(b.ARRAY_BUFFER, this.fullscreenTriangle);
            b.enableVertexAttribArray(a);
            b.vertexAttribPointer(a, 2, b.FLOAT, !1, 0, 0);
            b.drawArrays(b.TRIANGLES, 0, 3);
            b.disableVertexAttribArray(a);
            b.bindBuffer(b.ARRAY_BUFFER, null)
        };

    function Scene(a) {
            this.gl = a;
            this.name = "untitled";
            this.meshes = [];
            this.meshRenderables = [];
            this.materials = {};
            this.nextView = this.sky = this.view = null;
            this.viewFade = 0;
            this.shadow = this.stripData = this.lights = null
        }
    Scene.prototype.load = function (a) {
            var b = this.gl,
                c, d = a.extract("scene.json");
            if (void 0 !== d) {
                    if (!a.checkSignature(d)) return !1;
                    d = (new ByteStream(d.data)).asString();
                    if (null == d || 0 >= d.length) return !1;
                    try {
                        c = JSON.parse(d)
                    } catch (e) {
                        return console.error(e),
                        !1
                    }
                } else return !1;
            this.metaData = c.metaData;
            this.view = new View(c.mainCamera.view);
            this.sky = new Sky(this.gl, a, c.sky);
            this.lights = new Lights(c.lights, this.view);
            this.materials = {};
            for (var f in c.materials) d = c.materials[f],
            d.lightCount = this.lights.count,
            d.shadowCount =
            this.lights.shadowCount,
            this.materials[d.name] = new Material(this.gl, a, d);
            if (c.meshes) for (d = 0; d < c.meshes.length; ++d) {
                    f = c.meshes[d];
                    f = new Mesh(this.gl, f, a.extract(f.file));
                    this.meshes.push(f);
                    for (var g = 0; g < f.desc.subMeshes.length; ++g) {
                        var h = f.desc.subMeshes[g];
                        this.meshRenderables.push(new MeshRenderable(f, h, this.materials[h.material]))
                    }
					d =100
                }
            this.bounds = new Bounds(this.meshes);
            this.postRender = new PostRender(this.gl, c.mainCamera.post, !0);
            this.shadow = new ShadowCollector(b, this.lights.shadowCount);
            this.cameras =
            c.Cameras;
            return !0
        };
    Scene.prototype.update = function () {
            this.lights.update(this.view, this.bounds)
        };
    Scene.prototype.collectShadows = function (a) {
            this.shadow.collect(this, a)
        };
    Scene.prototype.draw = function () {
            var a = this.gl;
            this.sky.setClearColor();
            a.clear(a.COLOR_BUFFER_BIT | a.DEPTH_BUFFER_BIT | a.STENCIL_BUFFER_BIT);
            a.enable(a.DEPTH_TEST);
            this.sky.draw(this);
            for (var b = 0; b < this.meshRenderables.length; ++b) this.meshRenderables[b].material.usesBlending || this.meshRenderables[b].draw(this);
            a.enable(a.POLYGON_OFFSET_FILL);
            a.polygonOffset(1, 1);
            a.colorMask(!1, !1, !1, !1);
            for (b = 0; b < this.meshRenderables.length; ++b) this.meshRenderables[b].drawAlphaPrepass(this);
            a.colorMask(!0, !0, !0, !0);
            a.disable(a.POLYGON_OFFSET_FILL);
            a.depthFunc(a.LEQUAL);
            a.depthMask(!1);
            for (b = 0; b < this.meshRenderables.length; ++b) this.meshRenderables[b].material.usesBlending && this.meshRenderables[b].draw(this);
            a.depthMask(!0);
            a.depthFunc(a.LESS);
            if (this.stripData.activeWireframe() && 0 < this.meshRenderables.length) {
                this.meshRenderables[0].material.bindWire(this);
                for (b = 0; b < this.meshRenderables.length; ++b) this.meshRenderables[b].drawWire();
                a.depthMask(!0)
            }
            a.disable(a.BLEND)
        };
    Scene.prototype.complete = function () {
            if (!this.sky.complete() || !this.shadow.complete()) return !1;
            for (var a = 0; a < this.meshRenderables.length; ++a) if (!this.meshRenderables[a].complete()) return !1;
            return !0
        };

    function Shader(a) {
            this.gl = a;
            this.program = null;
            this.params = {};
            this.samplers = {};
            this.attribs = {}
        }
    Shader.prototype.build = function (a, b) {
		
	
		
		
//marmoset.js:1716 shader 202
//marmoset.js:1716 shader 150
//marmoset.js:1716 shader 154
//marmoset.js:1716 shader 16526
//marmoset.js:1716 shader 16544
//marmoset.js:1716 shader 227
//marmoset.js:1716 shader 508
//marmoset.js:1716 shader 2054
//marmoset.js:1716 shader 1996
//marmoset.js:1716 shader 332
//marmoset.js:1716 shader 277
//marmoset.js:1716 shader 387
//marmoset.js:1716 shader 408
		if(b.length==2054){ //后期效果
			
			var bb=
            "precision mediump float; \n" +
			"uniform sampler2D tInput;\n" +
			"varying vec2 d; \n" +
			"vec3 ii(vec3 c){ \n" +
				"vec3 ij = sqrt(c);\n" +
				"return (ij - ij * c) + c * (0.4672 * c + vec3(0.5328));\n" +
			"} \n" +
			"void main(void){\n" +
				"vec4 ik = texture2D(tInput, d); \n" +
	
	
				"gl_FragColor.xyz = ik.xyz; \n" +
				"gl_FragColor.w =1.0;\n" +
			"} "
			
		
			
		}else
		if(b.length==16526){    //主页效果
	console.log(b)
		b=
		"#define MOBILE\n"+
		"#define NOBLEND\n"+
		"#define SHADOW_COUNT 3\n"+
		"#define LIGHT_COUNT 3\n"+
		"#extension GL_OES_standard_derivatives : enable\n"+
		"precision mediump float;\n"+
		"varying highp vec3 D;\n"+
		"varying mediump vec2 j;\n"+
		"varying mediump vec3 E;\n"+
		"varying mediump vec3 F;\n"+
		"varying mediump vec3 G;\n"+
		"#ifdef VERTEX_COLOR\n"+
		"varying lowp vec4 H;\n"+
		"#endif\n"+
		"#ifdef TEXCOORD_SECONDARY\n"+
		"varying mediump vec2 I;\n"+
		"#endif\n"+
		"uniform sampler2D tAlbedo;\n"+
		"uniform sampler2D tReflectivity;\n"+
		"uniform sampler2D tNormal;\n"+
		"uniform sampler2D tExtras;\n"+
		"uniform sampler2D tSkySpecular;\n"+
		"uniform vec4 uDiffuseCoefficients[9];\n"+
		"uniform vec3 uCameraPosition;\n"+
		"uniform vec3 uFresnel;\n"+
		"uniform float uAlphaTest;\n"+
		"uniform float uHorizonOcclude;\n"+
		"uniform float uHorizonSmoothing;\n"+
		"#ifdef EMISSIVE\n"+
		"uniform float uEmissiveScale;\n"+
		"uniform vec4 uTexRangeEmissive;\n"+
		"#endif\n"+
		"#ifdef AMBIENT_OCCLUSION\n"+
		"uniform vec4 uTexRangeAO;\n"+
		"#endif\n"+
		"#ifdef LIGHT_COUNT\n"+
		"uniform vec4 uLightPositions[LIGHT_COUNT];\n"+
		"uniform vec3 uLightDirections[LIGHT_COUNT];\n"+
		"uniform vec3 uLightColors[LIGHT_COUNT];\n"+
		"uniform vec3 uLightParams[LIGHT_COUNT];\n"+
		"uniform vec3 uLightSpot[LIGHT_COUNT];\n"+
		"#endif\n"+
		"#ifdef ANISO\n"+
		"uniform float uAnisoStrength;\n"+
		"uniform vec3 uAnisoTangent;\n"+
		"uniform float uAnisoIntegral;\n"+
		"uniform vec4 uTexRangeAniso;\n"+
		"#endif\n"+
		"#define saturate(x) clamp( x, 0.0, 1.0 )\n"+
		"vec3 L(vec3 c){return c*c;\n"+
		"}vec3 O(vec3 n){vec3 fA=E;\n"+
		"vec3 fB=F;\n"+
		"vec3 fC=gl_FrontFacing?G:-G;\n"+
		"#ifdef TSPACE_RENORMALIZE\n"+
		"fC=normalize(fC);\n"+
		"#endif\n"+
		"#ifdef TSPACE_ORTHOGONALIZE\n"+
		"fA-=dot(fA,fC)*fC;\n"+
		"#endif\n"+
		"#ifdef TSPACE_RENORMALIZE\n"+
		"fA=normalize(fA);\n"+
		"#endif\n"+
		"#ifdef TSPACE_ORTHOGONALIZE\n"+
		"fB=(fB-dot(fB,fC)*fC)-dot(fB,fA)*fA;\n"+
		"#endif\n"+
		"#ifdef TSPACE_RENORMALIZE\n"+
		"fB=normalize(fB);\n"+
		"#endif\n"+
		"#ifdef TSPACE_COMPUTE_BITANGENT\n"+
		"vec3 fD=cross(fC,fA);\n"+
		"fB=dot(fD,fB)<0.0?-fD:fD;\n"+
		"#endif\n"+
		"n=2.0*n-vec3(1.0);\n"+
		"return normalize(fA*n.x+fB*n.y+fC*n.z);\n"+
		"}vec3 Q(vec3 t){vec3 fC=gl_FrontFacing?G:-G;\n"+
		"return normalize(E*t.x+F*t.y+fC*t.z);\n"+
		"}vec4 R(vec2 fE,vec4 fF){\n"+
		"#if GL_OES_standard_derivatives\n"+
		"vec2 fG=fract(fE);\n"+
		"vec2 fH=fwidth(fG);\n"+
		"float fI=(fH.x+fH.y)>0.5?-6.0:0.0;\n"+
		"return texture2D(tExtras,fG*fF.xy+fF.zw,fI);\n"+
		"#else\n"+
		"return texture2D(tExtras,fract(fE)*fF.xy+fF.zw);\n"+
		"#endif\n"+
		"}vec3 fJ(sampler2D fK,vec2 fL,float fM){vec3 n=texture2D(fK,fL,fM*2.5).xyz;\n"+
		"return O(n);\n"+
		"}\n"+
		"vec3 ed(vec3 ee,float ef){return exp(-0.5*ef/(ee*ee))/(ee*2.5066283);\n"+
		"}vec3 eh(vec3 ee){return vec3(1.0,1.0,1.0)/(ee*2.5066283);\n"+
		"}vec3 ei(vec3 ej){return vec3(-0.5,-0.5,-0.5)/(ej);\n"+
		"}vec3 ek(vec3 el,float ef){return exp(el*ef);\n"+
		"}\n"+
		"#define SAMPLE_COUNT 21.0\n"+
		"#define SAMPLE_HALF 10.0\n"+
		"#define GAUSS_SPREAD 0.05\n"+
		"vec3 em(float en,float eo,vec3 eu){vec3 ev=vec3(eo,eo,eo);\n"+
		"ev=0.8*ev+vec3(0.2);\n"+
		"vec3 eA=cos(ev*3.14159);\n"+
		"vec3 eB=cos(ev*3.14159*0.5);\n"+
		"eB*=eB;\n"+
		"eB*=eB;\n"+
		"eB*=eB;\n"+
		"ev=ev+0.05*eA*eB*eu;\n"+
		"eB*=eB;\n"+
		"eB*=eB;\n"+
		"eB*=eB;\n"+
		"ev=ev+0.1*eA*eB*eu;\n"+
		"ev=saturate(ev);\n"+
		"ev*=ev*1.2;\n"+
		"return ev;\n"+
		"}vec3 eC(vec3 eu){return vec3(1.0,1.0,1.0)/3.1415926;\n"+
		"}float eD(float en,float eu){return saturate(-en*eu+en+eu);\n"+
		"}vec3 eE(float en,vec3 eu){return saturate(-en*eu+vec3(en)+eu);\n"+
		"}float eF(float eu){return-0.31830988618379*eu+0.31830988618379;\n"+
		"}vec3 eG(vec3 eu){return-0.31830988618379*eu+vec3(0.31830988618379);\n"+
		"}vec3 dY(vec3 T,vec3 N,vec3 U,float eH){float eI=1.0-saturate(dot(T,N));\n"+
		"float eJ=eI*eI;\n"+
		"eI*=eJ*eJ;\n"+
		"eI*=eH;\n"+
		"return(U-eI*U)+eI*uFresnel;\n"+
		"}vec2 eK(vec2 eL,vec2 eu){eL=1.0-eL;\n"+
		"vec2 eM=eL*eL;\n"+
		"eM*=eM;\n"+
		"eL=mix(eM,eL*0.4,eu);\n"+
		"return eL;\n"+
		"}vec3 du(vec3 eN){\n"+
		"#define c(n) uDiffuseCoefficients[n].xyz\n"+
		"vec3 C=(c(0)+eN.y*((c(1)+c(4)*eN.x)+c(5)*eN.z))+eN.x*(c(3)+c(7)*eN.z)+c(2)*eN.z;\n"+
		"#undef c\n"+
		"vec3 sqr=eN*eN;\n"+
		"C+=uDiffuseCoefficients[6].xyz*(3.0*sqr.z-1.0);\n"+
		"C+=uDiffuseCoefficients[8].xyz*(sqr.x-sqr.y);\n"+
		"return C;\n"+
		"}void eO(inout vec3 eP,inout vec3 eQ,inout vec3 eR,vec3 eN){eP=uDiffuseCoefficients[0].xyz;\n"+
		"eQ=uDiffuseCoefficients[1].xyz*eN.y;\n"+
		"eQ+=uDiffuseCoefficients[2].xyz*eN.z;\n"+
		"eQ+=uDiffuseCoefficients[3].xyz*eN.x;\n"+
		"vec3 swz=eN.yyz*eN.xzx;\n"+
		"eR=uDiffuseCoefficients[4].xyz*swz.x;\n"+
		"eR+=uDiffuseCoefficients[5].xyz*swz.y;\n"+
		"eR+=uDiffuseCoefficients[7].xyz*swz.z;\n"+
		"vec3 sqr=eN*eN;\n"+
		"eR+=uDiffuseCoefficients[6].xyz*(3.0*sqr.z-1.0);\n"+
		"eR+=uDiffuseCoefficients[8].xyz*(sqr.x-sqr.y);\n"+
		"}vec3 eS(vec3 eP,vec3 eQ,vec3 eR,vec3 eT,float eu){eT=mix(vec3(1.0),eT,eu);\n"+
		"return(eP+eQ*eT.x)+eR*eT.z;\n"+
		"}vec3 eU(vec3 eP,vec3 eQ,vec3 eR,vec3 eT,vec3 eV){vec3 eW=mix(vec3(1.0),eT.yyy,eV);\n"+
		"vec3 eX=mix(vec3(1.0),eT.zzz,eV);\n"+
		"return(eP+eQ*eW)+eR*eX;\n"+
		"}vec3 dB(vec3 eN,float V){eN/=dot(vec3(1.0),abs(eN));\n"+
		"vec2 eY=abs(eN.zx)-vec2(1.0,1.0);\n"+
		"vec2 eZ=vec2(eN.x<0.0?eY.x:-eY.x,eN.z<0.0?eY.y:-eY.y);\n"+
		"vec2 fc=(eN.y<0.0)?eZ:eN.xz;\n"+
		"fc=vec2(0.5*(254.0/256.0),0.125*0.5*(254.0/256.0))*fc+vec2(0.5,0.125*0.5);\n"+
		"float fd=fract(7.0*V);\n"+
		"fc.y+=0.125*(7.0*V-fd);\n"+
		"vec2 fe=fc+vec2(0.0,0.125);\n"+
		"vec4 ff=mix(texture2D(tSkySpecular,fc),texture2D(tSkySpecular,fe),fd);\n"+
		"vec3 r=ff.xyz*(7.0*ff.w);\n"+
		"return r*r;\n"+
		"}float dC(vec3 eN,vec3 fh){float fi=dot(eN,fh);\n"+
		"fi=saturate(1.0+uHorizonOcclude*fi);\n"+
		"return fi*fi;\n"+
		"}\n"+
		"#ifdef SHADOW_COUNT\n"+
		"#ifdef MOBILE\n"+
		"#define SHADOW_KERNEL (4.0/1536.0)\n"+
		"#else\n"+
		"#define SHADOW_KERNEL (4.0/2048.0)\n"+
		"#endif\n"+
		"highp vec4 m(highp mat4 o,highp vec3 p){return o[0]*p.x+(o[1]*p.y+(o[2]*p.z+o[3]));\n"+
		"}uniform sampler2D tDepth0;\n"+
		"#if SHADOW_COUNT > 1\n"+
		"uniform sampler2D tDepth1;\n"+
		"#if SHADOW_COUNT > 2\n"+
		"uniform sampler2D tDepth2;\n"+
		"#endif\n"+
		"#endif\n"+
		"uniform highp vec2 uShadowKernelRotation;\n"+
		"uniform highp vec4 uShadowMapSize;\n"+
		"uniform highp mat4 uShadowMatrices[SHADOW_COUNT];\n"+
		"uniform highp mat4 uInvShadowMatrices[SHADOW_COUNT];\n"+
		"uniform highp vec4 uShadowTexelPadProjections[SHADOW_COUNT];\n"+
		"highp float fN(highp vec3 C){return(C.x+C.y*(1.0/255.0))+C.z*(1.0/65025.0);\n"+
		"}float fO(sampler2D fP,highp vec2 fE,highp float fQ){\n"+
		"#ifndef MOBILE\n"+
		"highp vec2 c=fE*uShadowMapSize.xy;\n"+
		"highp vec2 a=floor(c)*uShadowMapSize.zw,b=ceil(c)*uShadowMapSize.zw;\n"+
		"highp vec4 dK;\n"+
		"dK.x=fN(texture2D(fP,a).xyz);\n"+
		"dK.y=fN(texture2D(fP,vec2(b.x,a.y)).xyz);\n"+
		"dK.z=fN(texture2D(fP,vec2(a.x,b.y)).xyz);\n"+
		"dK.w=fN(texture2D(fP,b).xyz);\n"+
		"highp vec4 fR;\n"+
		"fR.x=fQ<dK.x?1.0:0.0;\n"+
		"fR.y=fQ<dK.y?1.0:0.0;\n"+
		"fR.z=fQ<dK.z?1.0:0.0;\n"+
		"fR.w=fQ<dK.w?1.0:0.0;\n"+
		"highp vec2 w=c-a*uShadowMapSize.xy;\n"+
		"vec2 s=(w.y*fR.zw+fR.xy)-w.y*fR.xy;\n"+
		"return(w.x*s.y+s.x)-w.x*s.x;\n"+
		"#else\n"+
		"highp float C=fN(texture2D(fP,fE.xy).xyz);\n"+
		"return fQ<C?1.0:0.0;\n"+
		"#endif\n"+
		"}highp float fS(sampler2D fP,highp vec3 fE,float fT){highp vec2 v=uShadowKernelRotation*fT;\n"+
		"float s;\n"+
		"s=fO(fP,fE.xy+v,fE.z);\n"+
		"s+=fO(fP,fE.xy-v,fE.z);\n"+
		"s+=fO(fP,fE.xy+vec2(-v.y,v.x),fE.z);\n"+
		"s+=fO(fP,fE.xy+vec2(v.y,-v.x),fE.z);\n"+
		"s*=0.25;\n"+
		"return s*s;\n"+
		"}struct dF{float dR[LIGHT_COUNT];\n"+
		"};\n"+
		"void dH(out dF ss,float fT){highp vec3 fU[SHADOW_COUNT];\n"+
		"vec3 fC=gl_FrontFacing?G:-G;\n"+
		"for(int u=0;\n"+
		"u<SHADOW_COUNT;\n"+
		"++u){vec4 fV=uShadowTexelPadProjections[u];\n"+
		"float fW=fV.x*D.x+(fV.y*D.y+(fV.z*D.z+fV.w));\n"+
		"#ifdef MOBILE\n"+
		"fW*=.001+fT;\n"+
		"#else\n"+
		"fW*=.0005+0.5*fT;\n"+
		"#endif\n"+
		"highp vec4 fX=m(uShadowMatrices[u],D+fW*fC);\n"+
		"fU[u]=fX.xyz/fX.w;\n"+
		"}float J;\n"+
		"#if SHADOW_COUNT > 0\n"+
		"J=fS(tDepth0,fU[0],fT);\n"+
		"ss.dR[0]=J;\n"+
		"#endif\n"+
		"#if SHADOW_COUNT > 1\n"+
		"J=fS(tDepth1,fU[1],fT);\n"+
		"ss.dR[1]=J;\n"+
		"#endif\n"+
		"#if SHADOW_COUNT > 2\n"+
		"J=fS(tDepth2,fU[2],fT);\n"+
		"ss.dR[2]=J;\n"+
		"#endif\n"+
		"for(int u=SHADOW_COUNT;\n"+
		"u<LIGHT_COUNT;\n"+
		"++u){ss.dR[u]=1.0;\n"+
		"}}struct dJ{highp float dK[LIGHT_COUNT];\n"+
		"};\n"+
		"highp vec4 fY(sampler2D fP,highp vec2 fE,highp mat4 fZ){highp vec4 hc;\n"+
		"hc.xy=fE;\n"+
		"#ifndef MOBILE\n"+
		"highp vec2 c=fE*uShadowMapSize.xy;\n"+
		"highp vec2 a=floor(c)*uShadowMapSize.zw,b=ceil(c)*uShadowMapSize.zw;\n"+
		"highp vec4 fR;\n"+
		"fR.x=fN(texture2D(fP,a).xyz);\n"+
		"fR.y=fN(texture2D(fP,vec2(b.x,a.y)).xyz);\n"+
		"fR.z=fN(texture2D(fP,vec2(a.x,b.y)).xyz);\n"+
		"fR.w=fN(texture2D(fP,b).xyz);\n"+
		"highp vec2 w=c-a*uShadowMapSize.xy;\n"+
		"vec2 s=(w.y*fR.zw+fR.xy)-w.y*fR.xy;\n"+
		"hc.z=(w.x*s.y+s.x)-w.x*s.x;\n"+
		"#else \n"+
		"hc.z=fN(texture2D(fP,fE.xy).xyz);\n"+
		"#endif\n"+
		"hc=m(fZ,hc.xyz);\n"+
		"hc.xyz/=hc.w;\n"+
		"return hc;\n"+
		"}void dM(out dJ ss,float fT){highp vec3 hd[SHADOW_COUNT];\n"+
		"vec3 fC=gl_FrontFacing?G:-G;\n"+
		"fC*=0.6;\n"+
		"for(int u=0;\n"+
		"u<SHADOW_COUNT;\n"+
		"++u){vec4 fV=uShadowTexelPadProjections[u];\n"+
		"float fW=fV.x*D.x+(fV.y*D.y+(fV.z*D.z+fV.w));\n"+
		"#ifdef MOBILE\n"+
		"fW*=.001+fT;\n"+
		"#else\n"+
		"fW*=.0005+0.5*fT;\n"+
		"#endif\n"+
		"highp vec4 fX=m(uShadowMatrices[u],D-fW*fC);\n"+
		"hd[u]=fX.xyz/fX.w;\n"+
		"}highp vec4 he;\n"+
		"#if SHADOW_COUNT > 0\n"+
		"he=fY(tDepth0,hd[0].xy,uInvShadowMatrices[0]);\n"+
		"ss.dK[0]=length(D.xyz-he.xyz);\n"+
		"#endif\n"+
		"#if SHADOW_COUNT > 1\n"+
		"he=fY(tDepth1,hd[1].xy,uInvShadowMatrices[1]);\n"+
		"ss.dK[1]=length(D.xyz-he.xyz);\n"+
		"#endif\n"+
		"#if SHADOW_COUNT > 2\n"+
		"he=fY(tDepth2,hd[2].xy,uInvShadowMatrices[2]);\n"+
		"ss.dK[2]=length(D.xyz-he.xyz);\n"+
		"#endif\n"+
		"for(int u=SHADOW_COUNT;\n"+
		"u<LIGHT_COUNT;\n"+
		"++u){ss.dK[u]=1.0;\n"+
		"}}\n"+
		"#endif\n"+
		"#ifdef SKIN\n"+
		"uniform vec4 uTexRangeSubdermis;\n"+
		"uniform vec4 uTexRangeTranslucency;\n"+
		"uniform vec4 uTexRangeFuzz;\n"+
		"uniform vec3 uSubdermisColor;\n"+
		"uniform vec4 uTransColor;\n"+
		"uniform float uTransScatter;\n"+
		"uniform vec4 uFresnelColor;\n"+
		"uniform float uFresnelOcc;\n"+
		"uniform float uFresnelGlossMask;\n"+
		"uniform float uTransSky;\n"+
		"uniform float uFresnelIntegral;\n"+
		"uniform float uTransIntegral;\n"+
		"uniform float uSkinTransDepth;\n"+
		"uniform float uSkinShadowBlur;\n"+
		"uniform float uNormalSmooth;\n"+
		"struct de{vec3 hf;\n"+
		"vec3 hh,hi,hj,fj;\n"+
		"vec3 di,dm,hk;\n"+
		"vec3 hl;\n"+
		"vec3 hm;\n"+
		"vec3 hn;\n"+
		"vec3 ho;\n"+
		"float hu;\n"+
		"float hv;\n"+
		"float hA;\n"+
		"float dI;\n"+
		"};\n"+
		"void dh(out de s){vec4 J;\n"+
		"#ifdef SKIN_NO_SUBDERMIS_TEX\n"+
		"s.hf=uSubdermisColor;\n"+
		"s.hA=1.0;\n"+
		"#else \n"+
		"J=R(j,uTexRangeSubdermis);\n"+
		"s.hf=L(J.xyz);\n"+
		"s.hA=J.w*J.w;\n"+
		"#endif\n"+
		"s.ho=uTransColor.rgb;\n"+
		"s.hu=uTransScatter;\n"+
		"#ifdef SKIN_VERSION_1\n"+
		"s.dI=uSkinShadowBlur*s.hA;\n"+
		"#else \n"+
		"s.hv=max(max(s.ho.r,s.ho.g),s.ho.b)*uTransColor.a;\n"+
		"float hB=max(s.hf.r,max(s.hf.g,s.hf.b));\n"+
		"hB=1.0-hB;\n"+
		"hB*=hB;\n"+
		"hB*=hB;\n"+
		"hB*=hB;\n"+
		"hB=1.0-(hB*hB);\n"+
		"s.hA*=hB;\n"+
		"s.dI=uSkinShadowBlur*s.hA*dot(s.hf.rgb,vec3(0.333,0.334,0.333));\n"+
		"#endif\n"+
		"#ifndef SKIN_NO_TRANSLUCENCY_TEX\n"+
		"J=R(j,uTexRangeTranslucency);\n"+
		"s.ho*=L(J.xyz);\n"+
		"#endif\n"+
		"s.hl=fJ(tNormal,j,uNormalSmooth*s.hA);\n"+
		"vec3 hC,hD,hE;\n"+
		"eO(hC,hD,hE,s.hl);\n"+
		"s.dm=s.hh=hC+hD+hE;\n"+
		"#ifdef SKIN_VERSION_1 \n"+
		"s.di=eU(hC,hD,hE,vec3(1.0,0.6667,0.25),s.hf);\n"+
		"#else\n"+
		"s.di=eU(hC,hD,hE,vec3(1.0,0.6667,0.25),s.hf*0.2+vec3(0.1));\n"+
		"#endif\n"+
		"#ifdef SKIN_VERSION_1\n"+
		"vec3 hF,hG,hH;\n"+
		"eO(hF,hG,hH,-s.hl);\n"+
		"s.hk=eS(hF,hG,hH,vec3(1.0,0.4444,0.0625),s.hu);\n"+
		"s.hk*=uTransSky;\n"+
		"#else \n"+
		"s.hk=vec3(0.0);\n"+
		"#endif\n"+
		"s.hi=s.hj=s.fj=vec3(0.0);\n"+
		"s.hf*=0.5;\n"+
		"s.hu*=0.5;\n"+
		"s.hm=uFresnelColor.rgb;\n"+
		"s.hn=uFresnelColor.aaa*vec3(1.0,0.5,0.25);\n"+
		"#ifndef SKIN_NO_FUZZ_TEX\n"+
		"J=R(j,uTexRangeFuzz);\n"+
		"s.hm*=L(J.rgb);\n"+
		"#endif\n"+
		"}void dQ(inout de s,float hI,float hJ,vec3 dN,vec3 N,vec3 dP){float en=dot(dN,N);\n"+
		"float eo=dot(dN,s.hl);\n"+
		"float dT=saturate((1.0/3.1415926)*en);\n"+
		"float fm=hI*hI;\n"+
		"fm*=fm;\n"+
		"fm=saturate(6.0*fm);\n"+
		"#ifdef SKIN_VERSION_1 \n"+
		"vec3 hK=eE(eo,s.hf);\n"+
		"#else \n"+
		"vec3 hK=em(en,eo,s.hf);\n"+
		"#endif\n"+
		"float hL=eD(-eo,s.hu);\n"+
		"vec3 hj=vec3(hL*hL);\n"+
		"#ifdef SKIN_VERSION_1\n"+
		"#ifdef SHADOW_COUNT\n"+
		"vec3 hM=vec3(hI);\n"+
		"float hN=saturate(fm-2.0*(hI*hI));\n"+
		"hM+=hN*s.hf;\n"+
		"float hO=hI;\n"+
		"#endif\n"+
		"#else\n"+
		"#ifdef SHADOW_COUNT\n"+
		"vec3 hM;\n"+
		"highp vec3 hP=(0.995*s.hf)+vec3(0.005,0.005,0.005);\n"+
		"highp vec3 hQ=vec3(1.0)-hP;\n"+
		"hP=mix(hP,hQ,hI);\n"+
		"float hR=sqrt(hI);\n"+
		"vec3 hS=2.0*vec3(1.0-hR);\n"+
		"hR=1.0-hR;\n"+
		"hR=(1.0-hR*hR);\n"+
		"hM=saturate(pow(hP*hR,hS));\n"+
		"highp float hT=0.35/(uSkinTransDepth+0.001);\n"+
		"highp float hU=saturate(hJ*hT);\n"+
		"hU=saturate(1.0-hU);\n"+
		"hU*=hU;\n"+
		"highp vec3 hV=vec3((-3.0*hU)+3.15);\n"+
		"highp vec3 hW=(0.9975*s.ho)+vec3(0.0025,0.0025,0.0025);\n"+
		"highp float hB=saturate(10.0*dot(hW,hW));\n"+
		"vec3 hO=pow(hW*hU,hV)*hB;\n"+
		"#else \n"+
		"hj=vec3(0.0);\n"+
		"#endif\n"+
		"#endif\n"+
		"float fn=eD(eo,s.hn.z);\n"+
		"#ifdef SHADOW_COUNT\n"+
		"vec3 fo=mix(vec3(1.0),hM,uFresnelOcc);\n"+
		"vec3 fj=fn*fo;\n"+
		"#else\n"+
		"vec3 fj=vec3(fn);\n"+
		"#endif\n"+
		"#ifdef SHADOW_COUNT\n"+
		"hK*=hM;\n"+
		"dT*=fm;\n"+
		"hj*=hO;\n"+
		"#endif\n"+
		"s.fj=fj*dP+s.fj;\n"+
		"s.hj=hj*dP+s.hj;\n"+
		"s.hi=hK*dP+s.hi;\n"+
		"s.hh=dT*dP+s.hh;\n"+
		"}void dW(out vec3 dn,out vec3 diff_extra,inout de s,vec3 T,vec3 N,float V){s.fj*=uFresnelIntegral;\n"+
		"float eL=dot(T,N);\n"+
		"vec2 fu=eK(vec2(eL,eL),s.hn.xy);\n"+
		"s.fj=s.dm*fu.x+(s.fj*fu.y);\n"+
		"s.fj*=s.hm;\n"+
		"float fv=saturate(1.0+-uFresnelGlossMask*V);\n"+
		"s.fj*=fv*fv;\n"+
		"s.hj=s.hj*uTransIntegral;\n"+
		"#ifdef SKIN_VERSION_1\n"+
		"s.hi=(s.hi*eG(s.hf))+s.di;\n"+
		"#else\n"+
		"s.hi=(s.hi*eC(s.hf))+s.di;\n"+
		"#endif\n"+
		"dn=mix(s.hh,s.hi,s.hA);\n"+
		"#ifdef SKIN_VERSION_1\n"+
		"s.hj=(s.hj+s.hk)*s.ho;\n"+
		"diff_extra=(s.fj+s.hj)*s.hA;\n"+
		"#else\n"+
		"dn+=s.hj*s.hv;\n"+
		"diff_extra=s.fj*s.hA;\n"+
		"#endif\n"+
		"}\n"+
		"#endif\n"+
		"#ifdef MICROFIBER\n"+
		"uniform vec4 uTexRangeFuzz;\n"+
		"uniform float uFresnelIntegral;\n"+
		"uniform vec4 uFresnelColor;\n"+
		"uniform float uFresnelOcc;\n"+
		"uniform float uFresnelGlossMask;\n"+
		"struct dj{vec3 dm;\n"+
		"vec3 dT;\n"+
		"vec3 fj;\n"+
		"vec3 fk;\n"+
		"vec3 fl;\n"+
		"};\n"+
		"void dl(out dj s,vec3 N){s.dm=s.dT=du(N);\n"+
		"s.fj=vec3(0.0);\n"+
		"s.fk=uFresnelColor.rgb;\n"+
		"s.fl=uFresnelColor.aaa*vec3(1.0,0.5,0.25);\n"+
		"#ifndef MICROFIBER_NO_FUZZ_TEX\n"+
		"vec4 J=R(j,uTexRangeFuzz);\n"+
		"s.fk*=L(J.rgb);\n"+
		"#endif\n"+
		"}void dS(inout dj s,float fm,vec3 dN,vec3 N,vec3 dP){float en=dot(dN,N);\n"+
		"float dT=saturate((1.0/3.1415926)*en);\n"+
		"float fn=eD(en,s.fl.z);\n"+
		"#ifdef SHADOW_COUNT\n"+
		"dT*=fm;\n"+
		"float fo=mix(1.0,fm,uFresnelOcc);\n"+
		"float fj=fn*fo;\n"+
		"#else \n"+
		"float fj=fn;\n"+
		"#endif\n"+
		"s.fj=fj*dP+s.fj;\n"+
		"s.dT=dT*dP+s.dT;\n"+
		"}void dX(out vec3 dn,out vec3 diff_extra,inout dj s,vec3 T,vec3 N,float V){s.fj*=uFresnelIntegral;\n"+
		"float eL=dot(T,N);\n"+
		"vec2 fu=eK(vec2(eL,eL),s.fl.xy);\n"+
		"s.fj=s.dm*fu.x+(s.fj*fu.y);\n"+
		"s.fj*=s.fk;\n"+
		"float fv=saturate(1.0+-uFresnelGlossMask*V);\n"+
		"s.fj*=fv*fv;\n"+
		"dn=s.dT;\n"+
		"diff_extra=s.fj;\n"+
		"}\n"+
		"#endif\n"+
		"#ifdef STRIPVIEW\n"+
		"uniform float uStrips[5];\n"+
		"uniform vec2 uStripRes;\n"+
		"struct Y{float hB[5];\n"+
		"float bg;\n"+
		"};\n"+
		"void dc(out Y hX,inout float V,inout vec3 U){highp vec2 fE=gl_FragCoord.xy*uStripRes-vec2(1.0,1.0);\n"+
		"fE.x+=0.25*fE.y;\n"+
		"hX.hB[0]=step(fE.x,uStrips[0]);\n"+
		"hX.hB[1]=step(fE.x,uStrips[1]);\n"+
		"hX.hB[2]=step(fE.x,uStrips[2]);\n"+
		"hX.hB[3]=step(fE.x,uStrips[3]);\n"+
		"hX.hB[4]=step(fE.x,uStrips[4]);\n"+
		"hX.bg=1.0-hX.hB[4];\n"+
		"hX.hB[4]-=hX.hB[3];\n"+
		"hX.hB[3]-=hX.hB[2];\n"+
		"hX.hB[2]-=hX.hB[1];\n"+
		"hX.hB[1]-=hX.hB[0];\n"+
		"bool hY=hX.hB[4]>0.0;\n"+
		"V=hY?0.5:V;\n"+
		"U=hY?vec3(0.1):U;\n"+
		"}vec3 ec(Y hX,vec3 N,vec3 K,vec3 U,float V,vec3 dn,vec3 dA,vec3 hZ){return hX.hB[0]*(N*0.5+vec3(0.5))+hX.hB[1]*K+hX.hB[2]*U+vec3(hX.hB[3]*V)+hX.hB[4]*(vec3(0.12)+0.3*dn+dA)+hX.bg*hZ;\n"+
		"}\n"+
		"#endif\n"+
		"#ifdef TRANSPARENCY_DITHER\n"+
		"float l(highp float B){highp float C=0.5*fract(gl_FragCoord.x*0.5)+0.5*fract(gl_FragCoord.y*0.5);\n"+
		"return 0.4+0.6*fract(C+3.141592e6*B);\n"+
		"}\n"+
		"#endif\n"+
		"void main(void){vec4 J=texture2D(tAlbedo,j);\n"+
		"vec3 K=L(J.xyz);\n"+
		"float k=J.w;\n"+
		"#ifdef VERTEX_COLOR\n"+
		"{vec3 M=H.xyz;\n"+
		"#ifdef VERTEX_COLOR_SRGB\n"+
		"M=M*(M*(M*0.305306011+vec3(0.682171111))+vec3(0.012522878));\n"+
		"#endif\n"+
		"K*=M;\n"+
		"#ifdef VERTEX_COLOR_ALPHA\n"+
		"k*=H.w;\n"+
		"#endif\n"+
		"}\n"+
		"#endif\n"+
		"#ifdef ALPHA_TEST\n"+
		"if(k<uAlphaTest){discard;\n"+
		"}\n"+
		"#endif\n"+
		"#ifdef TRANSPARENCY_DITHER\n"+
		"k=(k>l(j.x))?1.0:k;\n"+
		"#endif\n"+
		"vec3 N=O(texture2D(tNormal,j).xyz);\n"+
		"#ifdef ANISO\n"+
		"#ifdef ANISO_NO_DIR_TEX\n"+
		"vec3 P=Q(uAnisoTangent);\n"+
		"#else\n"+
		"J=R(j,uTexRangeAniso);\n"+
		"vec3 P=2.0*J.xyz-vec3(1.0);\n"+
		"P=Q(P);\n"+
		"#endif\n"+
		"P=P-N*dot(P,N);\n"+
		"P=normalize(P);\n"+
		"vec3 S=P*uAnisoStrength;\n"+
		"#endif\n"+
		"vec3 T=normalize(uCameraPosition-D);\n"+
		"J=texture2D(tReflectivity,j);\n"+
		"vec3 U=L(J.xyz);\n"+
		"float V=J.w;\n"+
		"float W=V;\n"+
		"#ifdef HORIZON_SMOOTHING\n"+
		"float X=dot(T,N);\n"+
		"X=uHorizonSmoothing-X*uHorizonSmoothing;\n"+
		"V=mix(V,1.0,X*X);\n"+
		"#endif\n"+
		"#ifdef STRIPVIEW\n"+
		"Y Z;\n"+
		"dc(Z,V,U);\n"+
		"#endif\n"+
		"float dd=1.0;\n"+
		"#ifdef AMBIENT_OCCLUSION\n"+
		"#ifdef AMBIENT_OCCLUSION_SECONDARY_UV\n"+
		"dd=R(I,uTexRangeAO).x;\n"+
		"#else\n"+
		"dd=R(j,uTexRangeAO).x;\n"+
		"#endif\n"+
		"dd*=dd;\n"+
		"#endif\n"+
		"#if defined(SKIN)\n"+
		"de df;\n"+
		"dh(df);\n"+
		"df.di*=dd;\n"+
		"#elif defined(MICROFIBER)\n"+
		"dj dk;\n"+
		"dl(dk,N);\n"+
		"dk.dm*=dd;\n"+
		"#else\n"+
		"vec3 dn=du(N);\n"+
		"dn*=dd;\n"+
		"#endif\n"+
		"vec3 dv=reflect(-T,N);\n"+
		"#ifdef ANISO\n"+
		"vec3 rt=dv-(0.5*S*dot(dv,P));\n"+
		"vec3 dA=dB(rt,mix(V,0.5*V,uAnisoStrength));\n"+
		"#else\n"+
		"vec3 dA=dB(dv,V);\n"+
		"#endif\n"+
		"dA*=dC(dv,G);\n"+
		"#ifdef LIGHT_COUNT\n"+
		"highp float dD=10.0/log2(V*0.968+0.03);\n"+
		"dD*=dD;\n"+
		"float dE=dD*(1.0/(8.0*3.1415926))+(4.0/(8.0*3.1415926));\n"+
		"dE=min(dE,1.0e3);\n"+
		"#ifdef SHADOW_COUNT\n"+
		"dF dG;\n"+
		"#ifdef SKIN\n"+
		"#ifdef SKIN_VERSION_1\n"+
		"dH(dG,SHADOW_KERNEL+SHADOW_KERNEL*df.dI);\n"+
		"#else\n"+
		"dJ dK;\n"+
		"float dL=SHADOW_KERNEL+SHADOW_KERNEL*df.dI;\n"+
		"dM(dK,dL);\n"+
		"dH(dG,dL);\n"+
		"#endif\n"+
		"#else\n"+
		"dH(dG,SHADOW_KERNEL);\n"+
		"#endif\n"+
		"#endif\n"+
		"#ifdef ANISO\n"+
		"dE*=uAnisoIntegral;\n"+
		"#endif\n"+

		"#endif\n"+
		"#if defined(SKIN)\n"+
		"vec3 dn,diff_extra;\n"+
		"dW(dn,diff_extra,df,T,N,V);\n"+
		"#elif defined(MICROFIBER)\n"+
		"vec3 dn,diff_extra;\n"+
		"dX(dn,diff_extra,dk,T,N,V);\n"+
		"#endif\n"+
		"dA*=dY(T,N,U,V*V);\n"+
		"#ifdef DIFFUSE_UNLIT\n"+
		"gl_FragColor.xyz=K+dA;\n"+
		"#else\n"+
		"gl_FragColor.xyz=dn*K+dA;\n"+
		"#endif\n"+
		"#if defined(SKIN) || defined(MICROFIBER)\n"+
		"gl_FragColor.xyz+=diff_extra;\n"+
		"#endif\n"+
		"#ifdef EMISSIVE\n"+
		"#ifdef EMISSIVE_SECONDARY_UV\n"+
		"vec2 dZ=I;\n"+
		"#else\n"+
		"vec2 dZ=j;\n"+
		"#endif\n"+
		"gl_FragColor.xyz+=uEmissiveScale*L(R(dZ,uTexRangeEmissive).xyz);\n"+
		"#endif\n"+
		"#ifdef STRIPVIEW\n"+
		"gl_FragColor.xyz=ec(Z,N,K,U,W,dn,dA,gl_FragColor.xyz);\n"+
		"#endif\n"+
		"#ifdef NOBLEND\n"+
		"gl_FragColor.w=1.0;\n"+
		"#else\n"+
		"gl_FragColor.w=k;\n"+
		"#endif\n"+
		
				
		"}\n"
	/*
			b=  
			"#define MOBILE\n"+
			"#define NOBLEND\n"+
			"#define SHADOW_COUNT 3\n"+
			"#define LIGHT_COUNT 3\n"+
			"#extension GL_OES_standard_derivatives : enable\n"+
			"precision mediump float;\n"+
			"varying highp vec3 D;\n"+
			"varying mediump vec2 j;\n"+
			"varying mediump vec3 E;\n"+
			"varying mediump vec3 F;\n"+
			"varying mediump vec3 G;\n"+
			"#ifdef VERTEX_COLOR\n"+
			"varying lowp vec4 H;\n"+
			"#endif\n"+
		
			"uniform sampler2D tAlbedo;\n"+
			"uniform sampler2D tReflectivity;\n"+
			"uniform sampler2D tNormal;\n"+
			"uniform sampler2D tExtras;\n"+
			"uniform sampler2D tSkySpecular;\n"+

				"void main(void){vec4 J=texture2D(tAlbedo,j);\n"+

				"gl_FragColor=texture2D(tAlbedo,j);\n"+

				"gl_FragColor.w=1.0;\n"+
		

			"}"
			
			*/
	}else
		if(b.length==1996){  
		
			//var bb=
		
			
			}else
		if(b.length==508){  
	
			//console.log(b)
			b=
		"precision mediump float;\n"+
"uniform sampler2D tInput0;\n"+

"varying highp vec2 d;\n"+
"void main(void){vec4 e=texture2D(tInput0,d);\n"+


"gl_FragColor=e;\n"+

"}\n"


				}else
		if(b.length==16544){  
			

			//console.log(b)
			var bb=
			"#define STRIPVIEW\n"+
			"#define MOBILE\n"+
			"#define NOBLEND\n"+
			"#define SHADOW_COUNT 3\n"+
			"#define LIGHT_COUNT 3\n"+
"#extension GL_OES_standard_derivatives : enable\n"+
			"precision mediump float;\n"+
			"varying highp vec3 D;\n"+
			"varying mediump vec2 j;\n"+
			"varying mediump vec3 E;\n"+
			"varying mediump vec3 F;\n"+
			"varying mediump vec3 G;\n"+
			"#ifdef VERTEX_COLOR\n"+
			"varying lowp vec4 H;\n"+
			"#endif\n"+
			"#ifdef TEXCOORD_SECONDARY\n"+
			"varying mediump vec2 I;\n"+
			"#endif\n"+
			"uniform sampler2D tAlbedo;\n"+
			"uniform sampler2D tReflectivity;\n"+
			"uniform sampler2D tNormal;\n"+
			"uniform sampler2D tExtras;\n"+
			"uniform sampler2D tSkySpecular;\n"+
			"uniform vec4 uDiffuseCoefficients[9];\n"+
			"uniform vec3 uCameraPosition;\n"+
			"uniform vec3 uFresnel;\n"+
			"uniform float uAlphaTest;\n"+
			"uniform float uHorizonOcclude;\n"+
			"uniform float uHorizonSmoothing;\n"+
			"#ifdef EMISSIVE\n"+
			"uniform float uEmissiveScale;\n"+
			"uniform vec4 uTexRangeEmissive;\n"+
			"#endif\n"+
			"#ifdef AMBIENT_OCCLUSION\n"+
			"uniform vec4 uTexRangeAO;\n"+
			"#endif\n"+
			"#ifdef LIGHT_COUNT\n"+
			"uniform vec4 uLightPositions[LIGHT_COUNT];\n"+
			"uniform vec3 uLightDirections[LIGHT_COUNT];\n"+
			"uniform vec3 uLightColors[LIGHT_COUNT];\n"+
			"uniform vec3 uLightParams[LIGHT_COUNT];\n"+
			"uniform vec3 uLightSpot[LIGHT_COUNT];\n"+
			"#endif\n"+
			"#ifdef ANISO\n"+
			"uniform float uAnisoStrength;\n"+
			"uniform vec3 uAnisoTangent;\n"+
			"uniform float uAnisoIntegral;\n"+
			"uniform vec4 uTexRangeAniso;\n"+
			"#endif\n"+
			"#define saturate(x) clamp( x, 0.0, 1.0 )\n"+
			"vec3 L(vec3 c){return c*c;\n"+
			"}vec3 O(vec3 n){vec3 fA=E;\n"+
			"vec3 fB=F;\n"+
			"vec3 fC=gl_FrontFacing?G:-G;\n"+
			"#ifdef TSPACE_RENORMALIZE\n"+
			"fC=normalize(fC);\n"+
			"#endif\n"+
			"#ifdef TSPACE_ORTHOGONALIZE\n"+
			"fA-=dot(fA,fC)*fC;\n"+
			"#endif\n"+
			"#ifdef TSPACE_RENORMALIZE\n"+
			"fA=normalize(fA);\n"+
			"#endif\n"+
			"#ifdef TSPACE_ORTHOGONALIZE\n"+
			"fB=(fB-dot(fB,fC)*fC)-dot(fB,fA)*fA;\n"+
			"#endif\n"+
			"#ifdef TSPACE_RENORMALIZE\n"+
			"fB=normalize(fB);\n"+
			"#endif\n"+
			"#ifdef TSPACE_COMPUTE_BITANGENT\n"+
			"vec3 fD=cross(fC,fA);\n"+
			"fB=dot(fD,fB)<0.0?-fD:fD;\n"+
			"#endif\n"+
			"n=2.0*n-vec3(1.0);\n"+
			"return normalize(fA*n.x+fB*n.y+fC*n.z);\n"+
			"}vec3 Q(vec3 t){vec3 fC=gl_FrontFacing?G:-G;\n"+
			"return normalize(E*t.x+F*t.y+fC*t.z);\n"+
			"}vec4 R(vec2 fE,vec4 fF){\n"+
			"#if GL_OES_standard_derivatives\n"+
			"vec2 fG=fract(fE);\n"+
			"vec2 fH=fwidth(fG);\n"+
			"float fI=(fH.x+fH.y)>0.5?-6.0:0.0;\n"+
			"return texture2D(tExtras,fG*fF.xy+fF.zw,fI);\n"+
			"#else\n"+
			"return texture2D(tExtras,fract(fE)*fF.xy+fF.zw);\n"+
			"#endif\n"+
			"}vec3 fJ(sampler2D fK,vec2 fL,float fM){vec3 n=texture2D(fK,fL,fM*2.5).xyz;\n"+
			"return O(n);\n"+
			"}\n"+
			"vec3 ed(vec3 ee,float ef){return exp(-0.5*ef/(ee*ee))/(ee*2.5066283);\n"+
			"}vec3 eh(vec3 ee){return vec3(1.0,1.0,1.0)/(ee*2.5066283);\n"+
			"}vec3 ei(vec3 ej){return vec3(-0.5,-0.5,-0.5)/(ej);\n"+
			"}vec3 ek(vec3 el,float ef){return exp(el*ef);\n"+
			"}\n"+
			"#define SAMPLE_COUNT 21.0\n"+
			"#define SAMPLE_HALF 10.0\n"+
			"#define GAUSS_SPREAD 0.05\n"+
			"vec3 em(float en,float eo,vec3 eu){vec3 ev=vec3(eo,eo,eo);\n"+
			"ev=0.8*ev+vec3(0.2);\n"+
			"vec3 eA=cos(ev*3.14159);\n"+
			"vec3 eB=cos(ev*3.14159*0.5);\n"+
			"eB*=eB;\n"+
			"eB*=eB;\n"+
			"eB*=eB;\n"+
			"ev=ev+0.05*eA*eB*eu;\n"+
			"eB*=eB;\n"+
			"eB*=eB;\n"+
			"eB*=eB;\n"+
			"ev=ev+0.1*eA*eB*eu;\n"+
			"ev=saturate(ev);\n"+
			"ev*=ev*1.2;\n"+
			"return ev;\n"+
			"}vec3 eC(vec3 eu){return vec3(1.0,1.0,1.0)/3.1415926;\n"+
			"}float eD(float en,float eu){return saturate(-en*eu+en+eu);\n"+
			"}vec3 eE(float en,vec3 eu){return saturate(-en*eu+vec3(en)+eu);\n"+
			"}float eF(float eu){return-0.31830988618379*eu+0.31830988618379;\n"+
			"}vec3 eG(vec3 eu){return-0.31830988618379*eu+vec3(0.31830988618379);\n"+
			"}vec3 dY(vec3 T,vec3 N,vec3 U,float eH){float eI=1.0-saturate(dot(T,N));\n"+
			"float eJ=eI*eI;\n"+
			"eI*=eJ*eJ;\n"+
			"eI*=eH;\n"+
			"return(U-eI*U)+eI*uFresnel;\n"+
			"}vec2 eK(vec2 eL,vec2 eu){eL=1.0-eL;\n"+
			"vec2 eM=eL*eL;\n"+
			"eM*=eM;\n"+
			"eL=mix(eM,eL*0.4,eu);\n"+
			"return eL;\n"+
			"}vec3 du(vec3 eN){\n"+
			"#define c(n) uDiffuseCoefficients[n].xyz\n"+
			"vec3 C=(c(0)+eN.y*((c(1)+c(4)*eN.x)+c(5)*eN.z))+eN.x*(c(3)+c(7)*eN.z)+c(2)*eN.z;\n"+
			"#undef c\n"+
			"vec3 sqr=eN*eN;\n"+
			"C+=uDiffuseCoefficients[6].xyz*(3.0*sqr.z-1.0);\n"+
			"C+=uDiffuseCoefficients[8].xyz*(sqr.x-sqr.y);\n"+
			"return C;\n"+
			"}void eO(inout vec3 eP,inout vec3 eQ,inout vec3 eR,vec3 eN){eP=uDiffuseCoefficients[0].xyz;\n"+
			"eQ=uDiffuseCoefficients[1].xyz*eN.y;\n"+
			"eQ+=uDiffuseCoefficients[2].xyz*eN.z;\n"+
			"eQ+=uDiffuseCoefficients[3].xyz*eN.x;\n"+
			"vec3 swz=eN.yyz*eN.xzx;\n"+
			"eR=uDiffuseCoefficients[4].xyz*swz.x;\n"+
			"eR+=uDiffuseCoefficients[5].xyz*swz.y;\n"+
			"eR+=uDiffuseCoefficients[7].xyz*swz.z;\n"+
			"vec3 sqr=eN*eN;\n"+
			"eR+=uDiffuseCoefficients[6].xyz*(3.0*sqr.z-1.0);\n"+
			"eR+=uDiffuseCoefficients[8].xyz*(sqr.x-sqr.y);\n"+
			"}vec3 eS(vec3 eP,vec3 eQ,vec3 eR,vec3 eT,float eu){eT=mix(vec3(1.0),eT,eu);\n"+
			"return(eP+eQ*eT.x)+eR*eT.z;\n"+
			"}vec3 eU(vec3 eP,vec3 eQ,vec3 eR,vec3 eT,vec3 eV){vec3 eW=mix(vec3(1.0),eT.yyy,eV);\n"+
			"vec3 eX=mix(vec3(1.0),eT.zzz,eV);\n"+
			"return(eP+eQ*eW)+eR*eX;\n"+
			"}vec3 dB(vec3 eN,float V){eN/=dot(vec3(1.0),abs(eN));\n"+
			"vec2 eY=abs(eN.zx)-vec2(1.0,1.0);\n"+
			"vec2 eZ=vec2(eN.x<0.0?eY.x:-eY.x,eN.z<0.0?eY.y:-eY.y);\n"+
			"vec2 fc=(eN.y<0.0)?eZ:eN.xz;\n"+
			"fc=vec2(0.5*(254.0/256.0),0.125*0.5*(254.0/256.0))*fc+vec2(0.5,0.125*0.5);\n"+
			"float fd=fract(7.0*V);\n"+
			"fc.y+=0.125*(7.0*V-fd);\n"+
			"vec2 fe=fc+vec2(0.0,0.125);\n"+
			"vec4 ff=mix(texture2D(tSkySpecular,fc),texture2D(tSkySpecular,fe),fd);\n"+
			"vec3 r=ff.xyz*(7.0*ff.w);\n"+
			"return r*r;\n"+
			"}float dC(vec3 eN,vec3 fh){float fi=dot(eN,fh);\n"+
			"fi=saturate(1.0+uHorizonOcclude*fi);\n"+
			"return fi*fi;\n"+
			"}\n"+
			"#ifdef SHADOW_COUNT\n"+
			"#ifdef MOBILE\n"+
			"#define SHADOW_KERNEL (4.0/1536.0)\n"+
			"#else\n"+
			"#define SHADOW_KERNEL (4.0/2048.0)\n"+
			"#endif\n"+
			"highp vec4 m(highp mat4 o,highp vec3 p){return o[0]*p.x+(o[1]*p.y+(o[2]*p.z+o[3]));\n"+
			"}uniform sampler2D tDepth0;\n"+
			"#if SHADOW_COUNT > 1\n"+
			"uniform sampler2D tDepth1;\n"+
			"#if SHADOW_COUNT > 2\n"+
			"uniform sampler2D tDepth2;\n"+
			"#endif\n"+
			"#endif\n"+
			"uniform highp vec2 uShadowKernelRotation;\n"+
			"uniform highp vec4 uShadowMapSize;\n"+
			"uniform highp mat4 uShadowMatrices[SHADOW_COUNT];\n"+
			"uniform highp mat4 uInvShadowMatrices[SHADOW_COUNT];\n"+
			"uniform highp vec4 uShadowTexelPadProjections[SHADOW_COUNT];\n"+
			"highp float fN(highp vec3 C){return(C.x+C.y*(1.0/255.0))+C.z*(1.0/65025.0);\n"+
			"}float fO(sampler2D fP,highp vec2 fE,highp float fQ){\n"+
			"#ifndef MOBILE\n"+
			"highp vec2 c=fE*uShadowMapSize.xy;\n"+
			"highp vec2 a=floor(c)*uShadowMapSize.zw,b=ceil(c)*uShadowMapSize.zw;\n"+
			"highp vec4 dK;\n"+
			"dK.x=fN(texture2D(fP,a).xyz);\n"+
			"dK.y=fN(texture2D(fP,vec2(b.x,a.y)).xyz);\n"+
			"dK.z=fN(texture2D(fP,vec2(a.x,b.y)).xyz);\n"+
			"dK.w=fN(texture2D(fP,b).xyz);\n"+
			"highp vec4 fR;\n"+
			"fR.x=fQ<dK.x?1.0:0.0;\n"+
			"fR.y=fQ<dK.y?1.0:0.0;\n"+
			"fR.z=fQ<dK.z?1.0:0.0;\n"+
			"fR.w=fQ<dK.w?1.0:0.0;\n"+
			"highp vec2 w=c-a*uShadowMapSize.xy;\n"+
			"vec2 s=(w.y*fR.zw+fR.xy)-w.y*fR.xy;\n"+
			"return(w.x*s.y+s.x)-w.x*s.x;\n"+
			"#else\n"+
			"highp float C=fN(texture2D(fP,fE.xy).xyz);\n"+
			"return fQ<C?1.0:0.0;\n"+
			"#endif\n"+
			"}highp float fS(sampler2D fP,highp vec3 fE,float fT){highp vec2 v=uShadowKernelRotation*fT;\n"+
			"float s;\n"+
			"s=fO(fP,fE.xy+v,fE.z);\n"+
			"s+=fO(fP,fE.xy-v,fE.z);\n"+
			"s+=fO(fP,fE.xy+vec2(-v.y,v.x),fE.z);\n"+
			"s+=fO(fP,fE.xy+vec2(v.y,-v.x),fE.z);\n"+
			"s*=0.25;\n"+
			"return s*s;\n"+
			"}struct dF{float dR[LIGHT_COUNT];\n"+
			"};\n"+
			"void dH(out dF ss,float fT){highp vec3 fU[SHADOW_COUNT];\n"+
			"vec3 fC=gl_FrontFacing?G:-G;\n"+
			"for(int u=0;\n"+
			"u<SHADOW_COUNT;\n"+
			"++u){vec4 fV=uShadowTexelPadProjections[u];\n"+
			"float fW=fV.x*D.x+(fV.y*D.y+(fV.z*D.z+fV.w));\n"+
			"#ifdef MOBILE\n"+
			"fW*=.001+fT;\n"+
			"#else\n"+
			"fW*=.0005+0.5*fT;\n"+
			"#endif\n"+
			"highp vec4 fX=m(uShadowMatrices[u],D+fW*fC);\n"+
			"fU[u]=fX.xyz/fX.w;\n"+
			"}float J;\n"+
			"#if SHADOW_COUNT > 0\n"+
			"J=fS(tDepth0,fU[0],fT);\n"+
			"ss.dR[0]=J;\n"+
			"#endif\n"+
			"#if SHADOW_COUNT > 1\n"+
			"J=fS(tDepth1,fU[1],fT);\n"+
			"ss.dR[1]=J;\n"+
			"#endif\n"+
			"#if SHADOW_COUNT > 2\n"+
			"J=fS(tDepth2,fU[2],fT);\n"+
			"ss.dR[2]=J;\n"+
			"#endif\n"+
			"for(int u=SHADOW_COUNT;\n"+
			"u<LIGHT_COUNT;\n"+
			"++u){ss.dR[u]=1.0;\n"+
			"}}struct dJ{highp float dK[LIGHT_COUNT];\n"+
			"};\n"+
			"highp vec4 fY(sampler2D fP,highp vec2 fE,highp mat4 fZ){highp vec4 hc;\n"+
			"hc.xy=fE;\n"+
			"#ifndef MOBILE\n"+
			"highp vec2 c=fE*uShadowMapSize.xy;\n"+
			"highp vec2 a=floor(c)*uShadowMapSize.zw,b=ceil(c)*uShadowMapSize.zw;\n"+
			"highp vec4 fR;\n"+
			"fR.x=fN(texture2D(fP,a).xyz);\n"+
			"fR.y=fN(texture2D(fP,vec2(b.x,a.y)).xyz);\n"+
			"fR.z=fN(texture2D(fP,vec2(a.x,b.y)).xyz);\n"+
			"fR.w=fN(texture2D(fP,b).xyz);\n"+
			"highp vec2 w=c-a*uShadowMapSize.xy;\n"+
			"vec2 s=(w.y*fR.zw+fR.xy)-w.y*fR.xy;\n"+
			"hc.z=(w.x*s.y+s.x)-w.x*s.x;\n"+
			"#else \n"+
			"hc.z=fN(texture2D(fP,fE.xy).xyz);\n"+
			"#endif\n"+
			"hc=m(fZ,hc.xyz);\n"+
			"hc.xyz/=hc.w;\n"+
			"return hc;\n"+
			"}void dM(out dJ ss,float fT){highp vec3 hd[SHADOW_COUNT];\n"+
			"vec3 fC=gl_FrontFacing?G:-G;\n"+
			"fC*=0.6;\n"+
			"for(int u=0;\n"+
			"u<SHADOW_COUNT;\n"+
			"++u){vec4 fV=uShadowTexelPadProjections[u];\n"+
			"float fW=fV.x*D.x+(fV.y*D.y+(fV.z*D.z+fV.w));\n"+
			"#ifdef MOBILE\n"+
			"fW*=.001+fT;\n"+
			"#else\n"+
			"fW*=.0005+0.5*fT;\n"+
			"#endif\n"+
			"highp vec4 fX=m(uShadowMatrices[u],D-fW*fC);\n"+
			"hd[u]=fX.xyz/fX.w;\n"+
			"}highp vec4 he;\n"+
			"#if SHADOW_COUNT > 0\n"+
			"he=fY(tDepth0,hd[0].xy,uInvShadowMatrices[0]);\n"+
			"ss.dK[0]=length(D.xyz-he.xyz);\n"+
			"#endif\n"+
			"#if SHADOW_COUNT > 1\n"+
			"he=fY(tDepth1,hd[1].xy,uInvShadowMatrices[1]);\n"+
			"ss.dK[1]=length(D.xyz-he.xyz);\n"+
			"#endif\n"+
			"#if SHADOW_COUNT > 2\n"+
			"he=fY(tDepth2,hd[2].xy,uInvShadowMatrices[2]);\n"+
			"ss.dK[2]=length(D.xyz-he.xyz);\n"+
			"#endif\n"+
			"for(int u=SHADOW_COUNT;\n"+
			"u<LIGHT_COUNT;\n"+
			"++u){ss.dK[u]=1.0;\n"+
			"}}\n"+
			"#endif\n"+
			"#ifdef SKIN\n"+
			"uniform vec4 uTexRangeSubdermis;\n"+
			"uniform vec4 uTexRangeTranslucency;\n"+
			"uniform vec4 uTexRangeFuzz;\n"+
			"uniform vec3 uSubdermisColor;\n"+
			"uniform vec4 uTransColor;\n"+
			"uniform float uTransScatter;\n"+
			"uniform vec4 uFresnelColor;\n"+
			"uniform float uFresnelOcc;\n"+
			"uniform float uFresnelGlossMask;\n"+
			"uniform float uTransSky;\n"+
			"uniform float uFresnelIntegral;\n"+
			"uniform float uTransIntegral;\n"+
			"uniform float uSkinTransDepth;\n"+
			"uniform float uSkinShadowBlur;\n"+
			"uniform float uNormalSmooth;\n"+
			"struct de{vec3 hf;\n"+
			"vec3 hh,hi,hj,fj;\n"+
			"vec3 di,dm,hk;\n"+
			"vec3 hl;\n"+
			"vec3 hm;\n"+
			"vec3 hn;\n"+
			"vec3 ho;\n"+
			"float hu;\n"+
			"float hv;\n"+
			"float hA;\n"+
			"float dI;\n"+
			"};\n"+
			"void dh(out de s){vec4 J;\n"+
			"#ifdef SKIN_NO_SUBDERMIS_TEX\n"+
			"s.hf=uSubdermisColor;\n"+
			"s.hA=1.0;\n"+
			"#else \n"+
			"J=R(j,uTexRangeSubdermis);\n"+
			"s.hf=L(J.xyz);\n"+
			"s.hA=J.w*J.w;\n"+
			"#endif\n"+
			"s.ho=uTransColor.rgb;\n"+
			"s.hu=uTransScatter;\n"+
			"#ifdef SKIN_VERSION_1\n"+
			"s.dI=uSkinShadowBlur*s.hA;\n"+
			"#else \n"+
			"s.hv=max(max(s.ho.r,s.ho.g),s.ho.b)*uTransColor.a;\n"+
			"float hB=max(s.hf.r,max(s.hf.g,s.hf.b));\n"+
			"hB=1.0-hB;\n"+
			"hB*=hB;\n"+
			"hB*=hB;\n"+
			"hB*=hB;\n"+
			"hB=1.0-(hB*hB);\n"+
			"s.hA*=hB;\n"+
			"s.dI=uSkinShadowBlur*s.hA*dot(s.hf.rgb,vec3(0.333,0.334,0.333));\n"+
			"#endif\n"+
			"#ifndef SKIN_NO_TRANSLUCENCY_TEX\n"+
			"J=R(j,uTexRangeTranslucency);\n"+
			"s.ho*=L(J.xyz);\n"+
			"#endif\n"+
			"s.hl=fJ(tNormal,j,uNormalSmooth*s.hA);\n"+
			"vec3 hC,hD,hE;\n"+
			"eO(hC,hD,hE,s.hl);\n"+
			"s.dm=s.hh=hC+hD+hE;\n"+
			"#ifdef SKIN_VERSION_1 \n"+
			"s.di=eU(hC,hD,hE,vec3(1.0,0.6667,0.25),s.hf);\n"+
			"#else\n"+
			"s.di=eU(hC,hD,hE,vec3(1.0,0.6667,0.25),s.hf*0.2+vec3(0.1));\n"+
			"#endif\n"+
			"#ifdef SKIN_VERSION_1\n"+
			"vec3 hF,hG,hH;\n"+
			"eO(hF,hG,hH,-s.hl);\n"+
			"s.hk=eS(hF,hG,hH,vec3(1.0,0.4444,0.0625),s.hu);\n"+
			"s.hk*=uTransSky;\n"+
			"#else \n"+
			"s.hk=vec3(0.0);\n"+
			"#endif\n"+
			"s.hi=s.hj=s.fj=vec3(0.0);\n"+
			"s.hf*=0.5;\n"+
			"s.hu*=0.5;\n"+
			"s.hm=uFresnelColor.rgb;\n"+
			"s.hn=uFresnelColor.aaa*vec3(1.0,0.5,0.25);\n"+
			"#ifndef SKIN_NO_FUZZ_TEX\n"+
			"J=R(j,uTexRangeFuzz);\n"+
			"s.hm*=L(J.rgb);\n"+
			"#endif\n"+
			"}void dQ(inout de s,float hI,float hJ,vec3 dN,vec3 N,vec3 dP){float en=dot(dN,N);\n"+
			"float eo=dot(dN,s.hl);\n"+
			"float dT=saturate((1.0/3.1415926)*en);\n"+
			"float fm=hI*hI;\n"+
			"fm*=fm;\n"+
			"fm=saturate(6.0*fm);\n"+
			"#ifdef SKIN_VERSION_1 \n"+
			"vec3 hK=eE(eo,s.hf);\n"+
			"#else \n"+
			"vec3 hK=em(en,eo,s.hf);\n"+
			"#endif\n"+
			"float hL=eD(-eo,s.hu);\n"+
			"vec3 hj=vec3(hL*hL);\n"+
			"#ifdef SKIN_VERSION_1\n"+
			"#ifdef SHADOW_COUNT\n"+
			"vec3 hM=vec3(hI);\n"+
			"float hN=saturate(fm-2.0*(hI*hI));\n"+
			"hM+=hN*s.hf;\n"+
			"float hO=hI;\n"+
			"#endif\n"+
			"#else\n"+
			"#ifdef SHADOW_COUNT\n"+
			"vec3 hM;\n"+
			"highp vec3 hP=(0.995*s.hf)+vec3(0.005,0.005,0.005);\n"+
			"highp vec3 hQ=vec3(1.0)-hP;\n"+
			"hP=mix(hP,hQ,hI);\n"+
			"float hR=sqrt(hI);\n"+
			"vec3 hS=2.0*vec3(1.0-hR);\n"+
			"hR=1.0-hR;\n"+
			"hR=(1.0-hR*hR);\n"+
			"hM=saturate(pow(hP*hR,hS));\n"+
			"highp float hT=0.35/(uSkinTransDepth+0.001);\n"+
			"highp float hU=saturate(hJ*hT);\n"+
			"hU=saturate(1.0-hU);\n"+
			"hU*=hU;\n"+
			"highp vec3 hV=vec3((-3.0*hU)+3.15);\n"+
			"highp vec3 hW=(0.9975*s.ho)+vec3(0.0025,0.0025,0.0025);\n"+
			"highp float hB=saturate(10.0*dot(hW,hW));\n"+
			"vec3 hO=pow(hW*hU,hV)*hB;\n"+
			"#else \n"+
			"hj=vec3(0.0);\n"+
			"#endif\n"+
			"#endif\n"+
			"float fn=eD(eo,s.hn.z);\n"+
			"#ifdef SHADOW_COUNT\n"+
			"vec3 fo=mix(vec3(1.0),hM,uFresnelOcc);\n"+
			"vec3 fj=fn*fo;\n"+
			"#else\n"+
			"vec3 fj=vec3(fn);\n"+
			"#endif\n"+
			"#ifdef SHADOW_COUNT\n"+
			"hK*=hM;\n"+
			"dT*=fm;\n"+
			"hj*=hO;\n"+
			"#endif\n"+
			"s.fj=fj*dP+s.fj;\n"+
			"s.hj=hj*dP+s.hj;\n"+
			"s.hi=hK*dP+s.hi;\n"+
			"s.hh=dT*dP+s.hh;\n"+
			"}void dW(out vec3 dn,out vec3 diff_extra,inout de s,vec3 T,vec3 N,float V){s.fj*=uFresnelIntegral;\n"+
			"float eL=dot(T,N);\n"+
			"vec2 fu=eK(vec2(eL,eL),s.hn.xy);\n"+
			"s.fj=s.dm*fu.x+(s.fj*fu.y);\n"+
			"s.fj*=s.hm;\n"+
			"float fv=saturate(1.0+-uFresnelGlossMask*V);\n"+
			"s.fj*=fv*fv;\n"+
			"s.hj=s.hj*uTransIntegral;\n"+
			"#ifdef SKIN_VERSION_1\n"+
			"s.hi=(s.hi*eG(s.hf))+s.di;\n"+
			"#else\n"+
			"s.hi=(s.hi*eC(s.hf))+s.di;\n"+
			"#endif\n"+
			"dn=mix(s.hh,s.hi,s.hA);\n"+
			"#ifdef SKIN_VERSION_1\n"+
			"s.hj=(s.hj+s.hk)*s.ho;\n"+
			"diff_extra=(s.fj+s.hj)*s.hA;\n"+
			"#else\n"+
			"dn+=s.hj*s.hv;\n"+
			"diff_extra=s.fj*s.hA;\n"+
			"#endif\n"+
			"}\n"+
			"#endif\n"+
			"#ifdef MICROFIBER\n"+
			"uniform vec4 uTexRangeFuzz;\n"+
			"uniform float uFresnelIntegral;\n"+
			"uniform vec4 uFresnelColor;\n"+
			"uniform float uFresnelOcc;\n"+
			"uniform float uFresnelGlossMask;\n"+
			"struct dj{vec3 dm;\n"+
			"vec3 dT;\n"+
			"vec3 fj;\n"+
			"vec3 fk;\n"+
			"vec3 fl;\n"+
			"};\n"+
			"void dl(out dj s,vec3 N){s.dm=s.dT=du(N);\n"+
			"s.fj=vec3(0.0);\n"+
			"s.fk=uFresnelColor.rgb;\n"+
			"s.fl=uFresnelColor.aaa*vec3(1.0,0.5,0.25);\n"+
			"#ifndef MICROFIBER_NO_FUZZ_TEX\n"+
			"vec4 J=R(j,uTexRangeFuzz);\n"+
			"s.fk*=L(J.rgb);\n"+
			"#endif\n"+
			"}void dS(inout dj s,float fm,vec3 dN,vec3 N,vec3 dP){float en=dot(dN,N);\n"+
			"float dT=saturate((1.0/3.1415926)*en);\n"+
			"float fn=eD(en,s.fl.z);\n"+
			"#ifdef SHADOW_COUNT\n"+
			"dT*=fm;\n"+
			"float fo=mix(1.0,fm,uFresnelOcc);\n"+
			"float fj=fn*fo;\n"+
			"#else \n"+
			"float fj=fn;\n"+
			"#endif\n"+
			"s.fj=fj*dP+s.fj;\n"+
			"s.dT=dT*dP+s.dT;\n"+
			"}void dX(out vec3 dn,out vec3 diff_extra,inout dj s,vec3 T,vec3 N,float V){s.fj*=uFresnelIntegral;\n"+
			"float eL=dot(T,N);\n"+
			"vec2 fu=eK(vec2(eL,eL),s.fl.xy);\n"+
			"s.fj=s.dm*fu.x+(s.fj*fu.y);\n"+
			"s.fj*=s.fk;\n"+
			"float fv=saturate(1.0+-uFresnelGlossMask*V);\n"+
			"s.fj*=fv*fv;\n"+
			"dn=s.dT;\n"+
			"diff_extra=s.fj;\n"+
			"}\n"+
			"#endif\n"+
			"#ifdef STRIPVIEW\n"+
			"uniform float uStrips[5];\n"+
			"uniform vec2 uStripRes;\n"+
			"struct Y{float hB[5];\n"+
			"float bg;\n"+
			"};\n"+
			"void dc(out Y hX,inout float V,inout vec3 U){highp vec2 fE=gl_FragCoord.xy*uStripRes-vec2(1.0,1.0);\n"+
			"fE.x+=0.25*fE.y;\n"+
			"hX.hB[0]=step(fE.x,uStrips[0]);\n"+
			"hX.hB[1]=step(fE.x,uStrips[1]);\n"+
			"hX.hB[2]=step(fE.x,uStrips[2]);\n"+
			"hX.hB[3]=step(fE.x,uStrips[3]);\n"+
			"hX.hB[4]=step(fE.x,uStrips[4]);\n"+
			"hX.bg=1.0-hX.hB[4];\n"+
			"hX.hB[4]-=hX.hB[3];\n"+
			"hX.hB[3]-=hX.hB[2];\n"+
			"hX.hB[2]-=hX.hB[1];\n"+
			"hX.hB[1]-=hX.hB[0];\n"+
			"bool hY=hX.hB[4]>0.0;\n"+
			"V=hY?0.5:V;\n"+
			"U=hY?vec3(0.1):U;\n"+
			"}\n"+
			"vec3 ec(Y hX,vec3 N,vec3 K,vec3 U,float V,vec3 dn,vec3 dA,vec3 hZ){\n"+
				//"return hX.hB[0]*(N*0.5+vec3(0.5))+hX.hB[1]*K+hX.hB[2]*U+vec3(hX.hB[3]*V)+hX.hB[4]*(vec3(0.12)+0.3*dn+dA)+hX.bg*hZ;\n"+
				"return vec3(1.0*V);\n"+
			
			"}\n"+
			"#endif\n"+
			"#ifdef TRANSPARENCY_DITHER\n"+
			"float l(highp float B){highp float C=0.5*fract(gl_FragCoord.x*0.5)+0.5*fract(gl_FragCoord.y*0.5);\n"+
			"return 0.4+0.6*fract(C+3.141592e6*B);\n"+
			"}\n"+
			"#endif\n"+
			"void main(void){vec4 J=texture2D(tAlbedo,j);\n"+
			"vec3 K=L(J.xyz);\n"+
			"float k=J.w;\n"+
			"#ifdef VERTEX_COLOR\n"+
			"{vec3 M=H.xyz;\n"+
			"#ifdef VERTEX_COLOR_SRGB\n"+
			"M=M*(M*(M*0.305306011+vec3(0.682171111))+vec3(0.012522878));\n"+
			"#endif\n"+
			"K*=M;\n"+
			"#ifdef VERTEX_COLOR_ALPHA\n"+
			"k*=H.w;\n"+
			"#endif\n"+
			"}\n"+
			"#endif\n"+
			"#ifdef ALPHA_TEST\n"+
			"if(k<uAlphaTest){discard;\n"+
			"}\n"+
			"#endif\n"+
			"#ifdef TRANSPARENCY_DITHER\n"+
			"k=(k>l(j.x))?1.0:k;\n"+
			"#endif\n"+
			"vec3 N=O(texture2D(tNormal,j).xyz);\n"+
			"#ifdef ANISO\n"+
			"#ifdef ANISO_NO_DIR_TEX\n"+
			"vec3 P=Q(uAnisoTangent);\n"+
			"#else\n"+
			"J=R(j,uTexRangeAniso);\n"+
			"vec3 P=2.0*J.xyz-vec3(1.0);\n"+
			"P=Q(P);\n"+
			"#endif\n"+
			"P=P-N*dot(P,N);\n"+
			"P=normalize(P);\n"+
			"vec3 S=P*uAnisoStrength;\n"+
			"#endif\n"+
			"vec3 T=normalize(uCameraPosition-D);\n"+
			"J=texture2D(tReflectivity,j);\n"+
			"vec3 U=L(J.xyz);\n"+
			
					
			
			"float V=J.w;\n"+
			"float W=V;\n"+
				"vec3 CCAV=vec3(J.w,J.w,J.w);\n"+
			"#ifdef HORIZON_SMOOTHING\n"+
			"float X=dot(T,N);\n"+
			"X=uHorizonSmoothing-X*uHorizonSmoothing;\n"+
			"V=mix(V,1.0,X*X);\n"+
			"#endif\n"+
			"#ifdef STRIPVIEW\n"+
			"Y Z;\n"+
			"dc(Z,V,U);\n"+
			"#endif\n"+
			"float dd=1.0;\n"+
			"#ifdef AMBIENT_OCCLUSION\n"+
			"#ifdef AMBIENT_OCCLUSION_SECONDARY_UV\n"+
			"dd=R(I,uTexRangeAO).x;\n"+
			"#else\n"+
			"dd=R(j,uTexRangeAO).x;\n"+
			"#endif\n"+
			"dd*=dd;\n"+
			"#endif\n"+
			"#if defined(SKIN)\n"+
			"de df;\n"+
			"dh(df);\n"+
			"df.di*=dd;\n"+
			"#elif defined(MICROFIBER)\n"+
			"dj dk;\n"+
			"dl(dk,N);\n"+
			"dk.dm*=dd;\n"+
			"#else\n"+
			"vec3 dn=du(N);\n"+
			"dn*=dd;\n"+
			"#endif\n"+
			"vec3 dv=reflect(-T,N);\n"+
			"#ifdef ANISO\n"+
			"vec3 rt=dv-(0.5*S*dot(dv,P));\n"+
			"vec3 dA=dB(rt,mix(V,0.5*V,uAnisoStrength));\n"+
			"#else\n"+
			"vec3 dA=dB(dv,V);\n"+
			"#endif\n"+
			"dA*=dC(dv,G);\n"+
			"#ifdef LIGHT_COUNT\n"+
			"highp float dD=10.0/log2(V*0.968+0.03);\n"+
			"dD*=dD;\n"+
			"float dE=dD*(1.0/(8.0*3.1415926))+(4.0/(8.0*3.1415926));\n"+
			"dE=min(dE,1.0e3);\n"+
			"#ifdef SHADOW_COUNT\n"+
			"dF dG;\n"+
			"#ifdef SKIN\n"+
			"#ifdef SKIN_VERSION_1\n"+
			"dH(dG,SHADOW_KERNEL+SHADOW_KERNEL*df.dI);\n"+
			"#else\n"+
			"dJ dK;\n"+
			"float dL=SHADOW_KERNEL+SHADOW_KERNEL*df.dI;\n"+
			"dM(dK,dL);\n"+
			"dH(dG,dL);\n"+
			"#endif\n"+
			"#else\n"+
			"dH(dG,SHADOW_KERNEL);\n"+
			"#endif\n"+
			"#endif\n"+
			"#ifdef ANISO\n"+
			"dE*=uAnisoIntegral;\n"+
			"#endif\n"+
			"for(int u=0;\n"+
			"u<LIGHT_COUNT;\n"+
			"++u){vec3 dN=uLightPositions[u].xyz-D*uLightPositions[u].w;\n"+
			"float dO=inversesqrt(dot(dN,dN));\n"+
			"dN*=dO;\n"+
			"float a=saturate(uLightParams[u].z/dO);\n"+
			"a=1.0+a*(uLightParams[u].x+uLightParams[u].y*a);\n"+
			"float s=saturate(dot(dN,uLightDirections[u]));\n"+
			"s=saturate(uLightSpot[u].y-uLightSpot[u].z*(1.0-s*s));\n"+
			"vec3 dP=(a*s)*uLightColors[u].xyz;\n"+
			"#if defined(SKIN)\n"+
			"#ifdef SHADOW_COUNT\n"+
			"#ifdef SKIN_VERSION_1\n"+
			"dQ(df,dG.dR[u],1.0,dN,N,dP);\n"+
			"#else\n"+
			"dQ(df,dG.dR[u],dK.dK[u],dN,N,dP);\n"+
			"#endif\n"+
			"#else\n"+
			"dQ(df,1.0,0.0,dN,N,dP);\n"+
			"#endif\n"+
			"#elif defined(MICROFIBER)\n"+
			"#ifdef SHADOW_COUNT\n"+
			"dS(dk,dG.dR[u],dN,N,dP);\n"+
			"#else\n"+
			"dS(dk,1.0,dN,N,dP);\n"+
			"#endif\n"+
			"#else\n"+
			"float dT=saturate((1.0/3.1415926)*dot(dN,N));\n"+
			"#ifdef SHADOW_COUNT\n"+
			"dT*=dG.dR[u];\n"+
			"#endif\n"+
			"dn+=dT*dP;\n"+
			"#endif\n"+
			"vec3 dU=dN+T;\n"+
			"#ifdef ANISO\n"+
			"dU=dU-(S*dot(dU,P));\n"+
			"#endif\n"+
			"dU=normalize(dU);\n"+
			"float dV=dE*pow(saturate(dot(dU,N)),dD);\n"+
			"#ifdef SHADOW_COUNT\n"+
			"dV*=dG.dR[u];\n"+
			"#endif\n"+
			"dA+=dV*dP;\n"+
			"}\n"+
			"#endif\n"+
			"#if defined(SKIN)\n"+
			"vec3 dn,diff_extra;\n"+
			"dW(dn,diff_extra,df,T,N,V);\n"+
			"#elif defined(MICROFIBER)\n"+
			"vec3 dn,diff_extra;\n"+
			"dX(dn,diff_extra,dk,T,N,V);\n"+
			"#endif\n"+
			"dA*=dY(T,N,U,V*V);\n"+
			"#ifdef DIFFUSE_UNLIT\n"+
			"gl_FragColor.xyz=K+dA;\n"+
			"#else\n"+
			"gl_FragColor.xyz=dn*K+dA;\n"+
			"#endif\n"+
			"#if defined(SKIN) || defined(MICROFIBER)\n"+
			"gl_FragColor.xyz+=diff_extra;\n"+
			"#endif\n"+
			"#ifdef EMISSIVE\n"+
			"#ifdef EMISSIVE_SECONDARY_UV\n"+
			"vec2 dZ=I;\n"+
			"#else\n"+
			"vec2 dZ=j;\n"+
			"#endif\n"+
			"gl_FragColor.xyz+=uEmissiveScale*L(R(dZ,uTexRangeEmissive).xyz);\n"+
			"#endif\n"+
			"#ifdef STRIPVIEW\n"+
			"gl_FragColor.xyz=ec(Z,N,K,U,W,dn,dA,gl_FragColor.xyz);\n"+
			
				"gl_FragColor.xyz=CCAV;\n"+
			
		
			

	
					
			"#endif\n"+
			"#ifdef NOBLEND\n"+
			"gl_FragColor.w=1.0;\n"+
			"#else\n"+
			"gl_FragColor.w=k;\n"+
			"#endif\n"+
			"}\n"


			/*
			b=

			"precision mediump float;\n"+
			"varying  vec3 D;\n"+
			"varying  vec2 j;\n"+
			"varying  vec3 E;\n"+
			"varying  vec3 F;\n"+
			"varying  vec3 G;\n"+

			"uniform sampler2D tAlbedo;\n"+
			"uniform sampler2D tReflectivity;\n"+
			"uniform sampler2D tNormal;\n"+
			"uniform sampler2D tExtras;\n"+
			"uniform sampler2D tSkySpecular;\n"+

			
			"vec3 O(vec3 n){\n"+
				"vec3 fA=E;\n"+
				"vec3 fB=F;\n"+
				"vec3 fC=G;\n"+
				"n=2.0*n-vec3(1.0);\n"+
				"return normalize(fA*n.x+fB*n.y+fC*n.z);\n"+
			"}\n"+
			
			"void main(void){vec4 J=texture2D(tAlbedo,j);\n"+
			
	
			"vec3 N=O(texture2D(tNormal,j).xyz);\n"+
			
			"gl_FragColor.xyz=N.xyz;\n"+
			
		
		
			"gl_FragColor.w=1.0;\n"+

	

			"}\n"
			
			*/


		}else{
			
			//console.log("shader",b.length)
		}
	
	
	
            var c = this.gl;
            this.program = c.createProgram();
            this.params = {};
            this.samplers = {};
            this.attribs = {};
            var d = function (a) {
                for (var b = "", c = a.indexOf("\n"), d = 0; - 1 != c;) d++,
                b += d + ": ",
                b += a.substring(0, c + 1),
                a = a.substring(c + 1, a.length),
                c = a.indexOf("\n");
                console.log(b)
            },
                e = c.createShader(c.VERTEX_SHADER);
            c.shaderSource(e, a);
            c.compileShader(e);
            c.getShaderParameter(e, c.COMPILE_STATUS) || (console.log(c.getShaderInfoLog(e)), marmoset.verboseErrors && d(a));
            c.attachShader(this.program, e);
            e =
            c.createShader(c.FRAGMENT_SHADER);
            c.shaderSource(e, b);
            c.compileShader(e);
            c.getShaderParameter(e, c.COMPILE_STATUS) || (console.log(c.getShaderInfoLog(e)), marmoset.verboseErrors && d(b));
            c.attachShader(this.program, e);
            c.linkProgram(this.program);
            c.getProgramParameter(this.program, c.LINK_STATUS) || console.log(c.getProgramInfoLog(this.program));
            for (var e = c.getProgramParameter(this.program, c.ACTIVE_UNIFORMS), f = 0, d = 0; d < e; ++d) {
                    var g = c.getActiveUniform(this.program, d),
                        h = g.name,
                        k = h.indexOf("[");
                    0 <= k && (h = h.substring(0, k));
                    k = c.getUniformLocation(this.program, g.name);
                    g.type == c.SAMPLER_2D || g.type == c.SAMPLER_CUBE ? this.samplers[h] = {
                            location: k,
                            unit: f++
                        } : this.params[h] = k
                }
            e = c.getProgramParameter(this.program, c.ACTIVE_ATTRIBUTES);
            for (d = 0; d < e; ++d) f = c.getActiveAttrib(this.program, d),
            this.attribs[f.name] = c.getAttribLocation(this.program, f.name)
        };
    Shader.prototype.bind = function () {
            return this.program ? (this.gl.useProgram(this.program), !0) : !1
        };
    Shader.prototype.complete = function () {
            return !!this.program
        };

    function ShaderCache(a) {
            this.gl = a;
            this.cache = []
        }
    ShaderCache.prototype.fromURLs = function (a, b, c) {
            var d = "";
            if (c) for (var e = 0; e < c.length; ++e) d = c[e] + "\n" + d;
            c = d + ":" + a + "|" + b;
            e = this.cache[c];
            if (void 0 !== e) return e;
            var f = new Shader(this.gl),
                g = null,
                h = null,
                k = function () {
                    null != g && null != h && f.build(g, h)
                };
            this.fetch(a, function (a) {
                    g = d + a;
                    k()
                });
            this.fetch(b, function (a) {
                    h = d + a;
                    k()
                });
            return this.cache[c] = f
        };
    ShaderCache.prototype.fetch = function (a, b) {
            "undefined" != typeof ShaderTable ? void 0 !== ShaderTable[a] ? this.resolveIncludes(new String(ShaderTable[a]), b) : b("") : Network.fetchText("src/shader/" + a, function (a) {
                this.resolveIncludes(a, b)
            }.bind(this), function () {
                b("")
            })
        };
    ShaderCache.prototype.resolveIncludes = function (a, b) {
            for (var c = [], d = !0, e = function (a, b, e, f, m) {
                d = !0;
                c.push({
                    offset: m,
                    path: b.slice(1, b.length - 1)
                });
                return ""
            }; d;) d = !1,
            a = a.replace(/#include\s((<[^>]+>)|("[^"]+"))/, e);
            if (0 < c.length) for (var f = c.length, e = 0; e < c.length; ++e) this.fetch(c[e].path, function (d) {
                this.src = d;
                if (0 >= --f) {
                    for (d = c.length - 1; 0 <= d; --d) a = a.substring(0, c[d].offset) + c[d].src + a.substring(c[d].offset);
                    b(a)
                }
            }.bind(c[e]));
            else b(a)
        };

    function ShadowCollector(a, b) {
            this.gl = a;
            this.shadowCount = b;
            this.desc = c;
            this.shaderSolid = a.shaderCache.fromURLs("shadowvert.glsl", "shadowfrag.glsl");
            this.shaderAlphaTest = a.shaderCache.fromURLs("shadowvert.glsl", "shadowfrag.glsl", ["#define ALPHA_TEST 1"]);
            this.depthTextures = [];
            this.depthTargets = [];
            if (0 < this.shadowCount) {
                var c = {
                    width: 2048,
                    height: 2048,
                    clamp: !0,
                    mipmap: !1,
                    nofilter: !0
                };
                a.hints.mobile && (c.width = c.height = 1536);
                for (var d = {
                    width: c.width,
                    height: c.height,
                    depthBuffer: Framebuffer.createDepthBuffer(a, c.width, c.height)
                }, e = a.RGB, f = a.UNSIGNED_BYTE, g = 0; g < this.shadowCount; ++g) this.depthTextures[g] = new Texture(a, c),
                this.depthTextures[g].loadArray(null, e, f),
                d.color0 = this.depthTextures[g],
                this.depthTargets[g] = new Framebuffer(a, d)
            }
        }
    ShadowCollector.prototype.bindDepthTexture = function (a, b) {
            this.shadowCount > b && this.depthTextures[b].bind(a)
        };
    ShadowCollector.prototype.collect = function (a, b) {
            var c = this.gl,
                d = a.lights,
                e = d.shadowCount,
                f = d.modelViewBuffer,
                g = d.projectionBuffer,
                h = d.matrix;
            if (!(0 >= e)) {
                    for (var k = Matrix.empty(), l = !1, m = 0; m < e; ++m) if (d.shadowsNeedUpdate[m]) {
                        d.shadowsNeedUpdate[m] = 0;
                        l = !0;
                        Matrix.mul(k, f.subarray(16 * m, 16 * (m + 1)), h);
                        Matrix.mul(k, g.subarray(16 * m, 16 * (m + 1)), k);
                        this.depthTargets[m].bind();
                        c.clearColor(1, 1, 1, 1);
                        c.clear(c.COLOR_BUFFER_BIT | c.DEPTH_BUFFER_BIT);
                        var n = this.shaderSolid;
                        n.bind();
                        c.uniformMatrix4fv(n.params.uViewProjection, !1, k);
                        for (var r = 0; r < a.meshRenderables.length; ++r) {
                            var p = a.meshRenderables[r],
                                q = p.material;
                            p.mesh.desc.castShadows && q.castShadows && (0 < q.shadowAlphaTest || p.drawShadow(n.attribs.vPosition))
                        }
                        n = this.shaderAlphaTest;
                        n.bind();
                        c.uniformMatrix4fv(n.params.uViewProjection, !1, k);
                        for (r = 0; r < a.meshRenderables.length; ++r) p = a.meshRenderables[r],
                        q = p.material,
                        p.mesh.desc.castShadows && q.castShadows && 0 < q.shadowAlphaTest && (q.textures.albedo.bind(n.samplers.tAlbedo), p.drawAlphaShadow(n.attribs.vPosition, n.attribs.vTexCoord))
                    }
                    l && (b.bind(), c.enable(c.CULL_FACE), c.cullFace(c.BACK))
                }
        };
    ShadowCollector.prototype.complete = function () {
            return this.shaderSolid.complete() && this.shaderAlphaTest.complete()
        };

    function Sky(a, b, c) {
            this.gl = a;
            var d = b.extract("sky.dat") || b.extract("sky.png");
            if (void 0 !== d) {
                this.specularTexture = new Texture(a, {
                    width: 256,
                    height: 2048,
                    clamp: !0
                });
                b = d.data;
                for (var d = d.data.length, e = d / 4, f = new Uint8Array(d), g = 0, h = 0; g < d; ++h) f[g++] = b[h + 2 * e],
                f[g++] = b[h + e],
                f[g++] = b[h],
                f[g++] = b[h + 3 * e];
                this.specularTexture.loadArray(f)
            }
            this.diffuseCoefficients = new Float32Array(c.diffuseCoefficients);
            this.backgroundMode = c.backgroundMode || 0;
            this.backgroundBrightness = c.backgroundBrightness || 1;
            this.backgroundColor =
            new Float32Array(c.backgroundColor);
            if (1 <= this.backgroundMode) if (this.backgroundShader = a.shaderCache.fromURLs("skyvert.glsl", 3 == this.backgroundMode ? "skySH.glsl" : "sky.glsl", ["#define SKYMODE " + this.backgroundMode]), this.vertexBuffer = a.createBuffer(), a.bindBuffer(a.ARRAY_BUFFER, this.vertexBuffer), c = 1 / 256, b = 0.5 / 256, d = 2.8 * b, e = 0.5 * b, c = new Float32Array([0, 1, 0, 0.49609375 + c, 0.49609375 + c, 1, 0, 0, 0.9921875 + c, 0.49609375 + c, 0, 0, 1, 0.49609375 + c, 0.9921875 + c, -1, 0, 0, 0 + c, 0.49609375 + c, 0, 0, -1, 0.49609375 + c, 0 + c, 0, -1, 0, 0.9921875 + c, 0 + c, 0, -1, 0, 0.9921875 + c, 0.9921875 + c, 0, -1, 0, 0 + c, 0.9921875 + c, 0, -1, 0, 0 + c, 0 + c, d, 1 - d, -d, 0.5 + b, 0.5 - b, d, 1 - d, d, 0.5 + b, 0.5 + b, -d, 1 - d, d, 0.5 - b, 0.5 + b, -d, 1 - d, -d, 0.5 - b, 0.5 - b, -d, 0, -1 + d, 0.5 - b, 0 + c + b, d, 0, -1 + d, 0.5 + b, 0 + c + b, 1 - d, 0, -d, 0.9921875 + c - b, 0.5 - b, 1 - d, 0, d, 0.9921875 + c - b, 0.5 + b, d, 0, 1 - d, 0.5 + b, 0.9921875 + c - b, -d, 0, 1 - d, 0.5 - b, 0.9921875 + c - b, -1 + d, 0, d, 0 + c + b, 0.5 + b, -1 + d, 0, -d, 0 + c + b, 0.5 - b, 1, 0, 0, 0.9921875 + c - e, 0.49609375 + c, 0, 0, 1, 0.49609375 + c, 0.9921875 + c - e, -1, 0, 0, 0 + c + e, 0.49609375 + c, 0, 0, -1, 0.49609375 + c, 0 + c + e, 0, 1, 0, 0.49609375 + c - e, 0.49609375 + c, 0, 1, 0, 0.49609375 + c, 0.49609375 + c - e, 0, 1, 0, 0.49609375 + c + e, 0.49609375 + c, 0, 1, 0, 0.49609375 + c, 0.49609375 + c + e]), a.bufferData(a.ARRAY_BUFFER, c, a.STATIC_DRAW), a.bindBuffer(a.ARRAY_BUFFER, null), this.indexBuffer = a.createBuffer(), a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, this.indexBuffer), c = new Uint16Array([2, 1, 6, 3, 2, 7, 8, 4, 3, 4, 5, 1, 9, 14, 15, 17, 10, 16, 18, 19, 11, 20, 13, 12, 28, 12, 13, 13, 24, 28, 28, 24, 9, 9, 24, 14, 25, 9, 15, 25, 15, 21, 10, 25, 21, 10, 21, 16, 22, 26, 10, 22, 10, 17, 18, 11, 26, 22, 18, 26, 19, 23, 27, 19, 27, 11, 23, 20, 27, 27, 20, 12]), this.skyIndexCount =
            c.length, a.bufferData(a.ELEMENT_ARRAY_BUFFER, c, a.STATIC_DRAW), a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, null), 3 == this.backgroundMode) for (this.backgroundCoefficients = new Float32Array(this.diffuseCoefficients), g = 0; g < this.backgroundCoefficients.length; ++g) this.backgroundCoefficients[g] *= this.backgroundBrightness;
            else {
                this.backgroundTexture = new Texture(a, {
                    width: 256,
                    height: 256,
                    clamp: !0
                });
                c = !1;
                var k;
                a.ext.textureHalf && a.ext.textureHalfLinear && (this.backgroundTexture.loadArray(null, a.RGB, a.ext.textureHalf.HALF_FLOAT_OES), k = new Framebuffer(a, {
                    color0: this.backgroundTexture
                }), c = k.valid);
                !c && a.ext.textureFloat && a.ext.textureFloatLinear && !a.hints.mobile && (this.backgroundTexture.loadArray(null, a.RGB, a.FLOAT), k = new Framebuffer(a, {
                    color0: this.backgroundTexture
                }), c = k.valid);
                c || (this.backgroundTexture.loadArray(), k = new Framebuffer(a, {
                    color0: this.backgroundTexture
                }));
                k.bind();
                k = new Shader(a);
                k.build("precision highp float; varying vec2 tc; attribute vec4 p; void main(){ gl_Position=p; tc=vec2(0.5,0.5/8.0)*p.xy+vec2(0.5,6.5/8.0); }", "precision highp float; varying vec2 tc; uniform sampler2D tex; uniform float b; void main(){vec4 s=texture2D(tex,tc); gl_FragColor.xyz=s.xyz*(b*s.w);}");
                k.bind();
                a.uniform1f(k.params.b, 7 * Math.sqrt(this.backgroundBrightness));
                this.specularTexture.bind(k.samplers.tex);
                c = a.createBuffer();
                a.bindBuffer(a.ARRAY_BUFFER, c);
                c = new Float32Array([-1, -1, 0.5, 1, 3, -1, 0.5, 1, -1, 3, 0.5, 1]);
                a.bufferData(a.ARRAY_BUFFER, c, a.STATIC_DRAW);
                a.enableVertexAttribArray(k.attribs.p);
                a.vertexAttribPointer(k.attribs.p, 4, a.FLOAT, !1, 0, 0);
                a.drawArrays(a.TRIANGLES, 0, 3);
                a.disableVertexAttribArray(k.attribs.p)
            }
        }
    Sky.prototype.setClearColor = function () {
            if (marmoset.transparentBackground) this.gl.clearColor(0, 0, 0, 0);
            else if (1 > this.backgroundMode) {
                var a = this.backgroundColor;
                this.gl.clearColor(a[0], a[1], a[2], 1)
            } else this.gl.clearColor(0.0582, 0.06772, 0.07805, 1)
        };
    Sky.prototype.draw = function (a) {
            if (1 > this.backgroundMode || marmoset.transparentBackground) return !1;
            if (this.complete()) {
               
            }
        };
    Sky.prototype.complete = function () {
            return this.backgroundShader && !this.backgroundShader.complete() ? !1 : this.specularTexture.complete()
        };

    function StripData() {
            this.STRIP_NONE = -2;
            this.STRIP_MENU = -1;
            this.stripCount = 5;
            this.strips = [0, 0, 0, 0, 0];
            this.labels = ["Normals", "Albedo", "Reflectivity", "Gloss", "Topology"];
            this.stripSlant = 0.25;
            this.selectedStrip = this.STRIP_NONE;
            this.animationActive = !1;
            this.timestamp = Date.now();
            this.update(!0)
        }
    StripData.expDecay = function (a, b) {
            return Math.exp(-0.69314718 / a * b)
        };
    StripData.prototype.update = function (a) {
            var b = 0.001 * (Date.now() - this.timestamp);
            this.timestamp = Date.now();
            for (var c = !1, d = 0; d < this.stripCount; ++d) {
                var e = 0,
                    e = this.selectedStrip == this.STRIP_MENU ? -0.9 + 0.3 * (d + 1) : 0 > this.selectedStrip || d < this.selectedStrip ? -2 : 2;
                if (a) this.strips[d] = e;
                else {
                        var f = e - this.strips[d],
                            f = f * StripData.expDecay(0.05, b);
                        this.animationActive && (this.strips[d] = e - f);
                        c = c || 1E-4 < Math.abs(f)
                    }
            }
            this.animationActive = c
        };
    StripData.prototype.active = function () {
            return this.selectedStrip >= this.STRIP_MENU
        };
    StripData.prototype.activeFade = function () {
            var a = (this.strips[this.stripCount - 1] - -2) / (-0.9 + 0.3 * this.stripCount - -2),
                a = 1 < a ? 1 : a;
            return 0 > a ? 0 : a
        };
    StripData.prototype.activeWireframe = function () {
            return this.active() && 0.01 < Math.abs(this.strips[4] - this.strips[3])
        };
    StripData.prototype.toggleMenu = function () {
            this.selectedStrip = this.selectedStrip == this.STRIP_MENU ? this.STRIP_NONE : this.STRIP_MENU
        };
    StripData.prototype.selectStrip = function (a, b) {
            if (this.selectedStrip == this.STRIP_MENU) {
                var c = a + b * this.stripSlant;
                this.selectedStrip = this.STRIP_NONE;
                for (var d = 0; d < this.stripCount; ++d) if (c < this.strips[d]) {
                    this.selectedStrip = d;
                    break
                }
            } else this.selectedStrip = this.STRIP_MENU
        };

    function Texture(a, b) {
            this.gl = a;
            this.type = a.TEXTURE_2D;
            this.id = null;
            b = b || {};
            this.desc = {
                width: b.width || 1,
                height: b.height || 1,
                mipmap: b.mipmap,
                clamp: b.clamp,
                mirror: b.mirror,
                aniso: b.aniso,
                nofilter: b.nofilter
            }
        }
    Texture.prototype.loadImage = function (a, b) {
            var c = this.gl;
            a && a.width && a.height && (this.desc.width = a.width, this.desc.height = a.height);
            this.id = c.createTexture();
            c.bindTexture(this.type, this.id);
            c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !0);
            c.texImage2D(this.type, 0, b || c.RGBA, b || c.RGBA, c.UNSIGNED_BYTE, a);
            this.setParams();
            c.bindTexture(this.type, null)
        };
    Texture.prototype.loadArray = function (a, b, c) {
            var d = this.gl;
            this.id = d.createTexture();
            d.bindTexture(this.type, this.id);
            d.pixelStorei(d.UNPACK_FLIP_Y_WEBGL, !0);
            d.texImage2D(this.type, 0, b || d.RGBA, this.desc.width, this.desc.height, 0, b || d.RGBA, c || d.UNSIGNED_BYTE, a || null);
            this.setParams();
            d.bindTexture(this.type, null)
        };
    Texture.prototype.setParams = function () {
            var a = this.gl,
                b = function (a) {
                    return 0 < a && 0 == (a & a - 1)
                };
            b(this.desc.width) && b(this.desc.height) || (this.desc.clamp = !0, this.desc.mipmap = !1);
            b = !this.desc.nofilter;
            this.desc.mipmap ? (a.generateMipmap(this.type), a.texParameteri(this.type, a.TEXTURE_MIN_FILTER, b ? a.LINEAR_MIPMAP_LINEAR : a.NEAREST_MIPMAP_NEAREST)) : a.texParameteri(this.type, a.TEXTURE_MIN_FILTER, b ? a.LINEAR : a.NEAREST);
            a.texParameteri(this.type, a.TEXTURE_MAG_FILTER, b ? a.LINEAR : a.NEAREST);
            if (this.desc.clamp || this.desc.mirror) b = this.desc.clamp ? a.CLAMP_TO_EDGE : a.MIRRORED_REPEAT,
            a.texParameteri(this.type, a.TEXTURE_WRAP_S, b),
            a.texParameteri(this.type, a.TEXTURE_WRAP_T, b);
            this.desc.aniso && a.ext.textureAniso && a.texParameteri(this.type, a.ext.textureAniso.TEXTURE_MAX_ANISOTROPY_EXT, this.desc.aniso)
        };
    Texture.prototype.rebuildMips = function () {
            this.desc.mipmap && (this.gl.bindTexture(this.type, this.id), this.gl.generateMipmap(this.type))
        };
    Texture.prototype.bind = function (a) {
            if (a) {
                var b = this.gl;
                b.uniform1i(a.location, a.unit);
                b.activeTexture(b.TEXTURE0 + a.unit);
                b.bindTexture(this.type, this.id)
            }
        };
    Texture.prototype.destroy = function () {
            this.gl.deleteTexture(this.id);
            this.id = null
        };
    Texture.prototype.complete = function () {
            return !!this.id
        };

    function TextureCache(a) {
            this.gl = a;
            this.cache = []
        }
    TextureCache.prototype.fromURL = function (a, b) {
            var c = this.cache[a];
            if (void 0 !== c) return c;
            var d = new Texture(this.gl, b);
            Network.fetchImage(a, function (a) {
                d.loadImage(a)
            });
            return this.cache[a] = d
        };
    TextureCache.prototype.fromFile = function (a, b) {
            if (!a) return null;
            var c = this.cache[a.name];
            if (void 0 !== c) return c;
            var d = new Texture(this.gl, b);
            this.cache[a.name] = d;
            TextureCache.parseFile(a, function (a) {
                d.loadImage(a)
            });
            return d
        };
    TextureCache.prototype.fromFilesMergeAlpha = function (a, b, c) {
            if (!b) return this.fromFile(a, c);
            var d = a.name + "|" + b.name,
                e = this.cache[d];
            if (void 0 !== e) return e;
            var f = this.gl;
            this.mergeShader || (this.mergeShader = new Shader(this.gl), this.mergeShader.build("precision highp float; varying vec2 c; attribute vec2 pos; void main(){ gl_Position.xy = 2.0*pos-vec2(1.0); gl_Position.zw = vec2(0.5,1.0); c=pos; }", "precision highp float; varying vec2 c; uniform sampler2D tRGB,tA; void main(){ gl_FragColor.xyz=texture2D(tRGB,c).xyz; gl_FragColor.w=texture2D(tA,c).x; }"), this.mergeVerts = f.createBuffer(), f.bindBuffer(f.ARRAY_BUFFER, this.mergeVerts), e = new Float32Array([0, 0, 2, 0, 0, 2]), f.bufferData(f.ARRAY_BUFFER, e, f.STATIC_DRAW), f.bindBuffer(f.ARRAY_BUFFER, null));
            var g = new Texture(this.gl, c);
            this.cache[d] = g;
            var h = 0,
                k = 0,
                l = this.mergeShader,
                m = this.mergeVerts,
                n = function () {
                    if (h && k) {
                        var a = h.width > k.width ? h.width : k.width,
                            b = h.height > k.height ? h.height : k.height;
                        g.desc.width = a;
                        g.desc.height = b;
                        if (a <= f.limits.viewportSizes[0] && b <= f.limits.viewportSizes[1]) g.loadArray(null),
                        (new Framebuffer(f, {
                                color0: g,
                                ignoreStatus: !0
                            })).bind(),
                        b = {
                                clamp: !0
                            },
                        a = new Texture(f, b),
                        a.loadImage(h, f.RGB),
                        b = new Texture(f, b),
                        b.loadImage(k, f.RGB),
                        l.bind(),
                        a.bind(l.samplers.tRGB),
                        b.bind(l.samplers.tA),
                        f.bindBuffer(f.ARRAY_BUFFER, m),
                        f.enableVertexAttribArray(l.attribs.pos),
                        f.vertexAttribPointer(l.attribs.pos, 2, f.FLOAT, !1, 0, 0),
                        f.drawArrays(f.TRIANGLES, 0, 3),
                        f.disableVertexAttribArray(l.attribs.pos),
                        f.bindBuffer(f.ARRAY_BUFFER, null),
                        a.destroy(),
                        b.destroy(),
                        Framebuffer.bindNone(f),
                        g.rebuildMips();
                 
                   
                    }
                };
            TextureCache.parseFile(a, function (a) {
                    h = a;
                    n()
                });
            TextureCache.parseFile(b, function (a) {
                    k = a;
                    n()
                });
            return g
        };
    TextureCache.parseFile = function (a, b, c) {
            var d = c || new Image;
            if ("undefined" != typeof URL && "undefined" != typeof URL.createObjectURL) {
				//  console.log("size",a.data.byteLength)
				  
				         var arr=""
						
            for (var i = 0; i < a.data.byteLength; i++) {
                arr+=a.data[i]+","
            }
		
			if(a.data.byteLength==598211){
				//console.log(a.data)
				//console.log(arr)
		
			}
			
                a = new Blob([a.data], {
                    type: a.type
                });
                var e = URL.createObjectURL(a);
                d.onload = function () {
                    URL.revokeObjectURL(e);
                    b && b(d)
                };
                d.src = e
            } else {
                a = new Blob([a.data], {
                    type: a.type
                });
                var f = new FileReader;
                f.onload = function (a) {
                    d.src = f.result
                };
                d.onload = function () {
                    b && b(d)
                };
                f.readAsDataURL(a)
            }
        };

    function UI(a) {
            this.viewer = a;
            this.stripData = a.stripData;
            a = this.container = document.createElement("div");
            a.id = "marmosetUI";
            a.style.position = "absolute";
            a.style.overflow = "hidden";
            a.style["-moz-user-select"] = "none";
            a.style["-khtml-user-select"] = "none";
            a.style["-webkit-user-select"] = "none";
            a.style["-ms-user-select"] = "none";
            this.viewer.domRoot.appendChild(a)
        }
    UI.prototype.setSize = function (a, b) {
            this.container.width = a | 0;
            this.container.height = b | 0;
            this.container.style.width = a + "px";
            this.container.style.height = b + "px"
        };
    UI.prototype.clearView = function () {
            for (; this.container.hasChildNodes();) this.container.removeChild(this.container.childNodes[0]);
            delete this.progressBar;
            delete this.thumbnail;
            delete this.fadeThumbnail;
            delete this.playButton;
            delete this.helpOverlay
        };
    UI.prototype.bindInput = function (a) {
            a.onSingleTap.push(function (b, c) {
                this.stripData.selectedStrip != this.stripData.STRIP_NONE && (b = 2 / a.element.clientWidth * b - 1, c = 1 - 2 / a.element.clientHeight * c, this.stripData.selectStrip(b, c), this.stripData.selectedStrip == this.stripData.STRIP_MENU && this.helpOverlay.active && this.helpOverlay.toggle(), this.refreshUI(), this.viewer.wake())
            }.bind(this));
            a.onDoubleTap.push(function (a, c) {
                this.viewer.scene.view.reset();
                this.viewer.wake()
            }.bind(this))
        };
    UI.sanitize = function (a) {
            return a ? a.replace(/<|>|\(|\)|$|%|=/g, "") : a
        };
    UI.sanitizeURL = function (a) {
            return a ? 0 == a.indexOf("http://") || 0 == a.indexOf("https://") || 0 == a.indexOf("ftp://") ? encodeURI(a) : "http://" + encodeURI(a) : a
        };
    UI.prototype.showFailure = function (a) {
            this.container.innerHTML = '<br><br><br><p style="text-align:center;color:#aaaaaa"><b>Marmoset Viewer could not initialize.</b><br><i>' + (a || "") + "</i>"
        };
    UI.prototype.showPreview = function (a) {
            this.clearView();
            this.thumbnail = document.createElement("canvas");
            var b = this.container.width / this.container.height;
            this.thumbnail.height = 100;
            this.thumbnail.width = this.thumbnail.height * b | 0;
            this.thumbnail.style.width = this.thumbnail.style.height = "100%";
            var b = this.thumbnail.getContext("2d"),
                c = b.fillStyle = b.createRadialGradient(this.thumbnail.width / 2, this.thumbnail.height / 2, (this.thumbnail.width + this.thumbnail.height) / 2, this.thumbnail.width / 2, 0, 0);
            c.addColorStop(0, "rgb(0,0,0)");
            c.addColorStop(1, "rgb(150,150,150)");
            b.fillStyle = c;
            b.fillRect(0, 0, this.thumbnail.width, this.thumbnail.height);
            this.container.appendChild(this.thumbnail);
            this.playButton = document.createElement("input");
            this.playButton.type = "image";
            this.playButton.src = marmoset.dataLocale + "play.png";
            this.playButton.style.position = "absolute";
            this.playButton.style.left = "50%";
            this.playButton.style.top = "50%";
            this.playButton.style["-webkit-transform"] = this.playButton.style.transform = "translate(-50%,-50%) scale(0.5,0.5)";
            this.playButton.style.opacity = 0.5;
            this.playButton.style.outline = "0px";
            this.playButton.onclick = function () {
                    this.viewer.loadScene(this.viewer.sceneURL);
                    this.container.removeChild(this.playButton);
                    delete this.playButton
                }.bind(this);
            this.container.appendChild(this.playButton);
            a || fetchThumbnail(this.viewer.sceneURL, function (a) {
                    this.loadingImageURL || this.setThumbnail(a)
                }.bind(this))
        };
    UI.prototype.setThumbnailURL = function (a) {
            (this.loadingImageURL = a) && Network.fetchImage(this.loadingImageURL, this.setThumbnail.bind(this))
        };
    UI.prototype.setThumbnail = function (a) {
            if (this.thumbnail) {
                var b = this.thumbnail.getContext("2d"),
                    c = this.thumbnail.width,
                    d = this.thumbnail.height,
                    e = d / a.height;
                b.drawImage(a, (c - a.width * e) / 2, 0, a.width * e, d);
                var f;
                try {
                        f = b.getImageData(0, 0, c, d)
                    } catch (g) {
                        return
                    }
                a = b.createImageData(c, d);
                for (e = 0; 3 > e; ++e) {
                        for (var h = f.data, k = a.data, l = 0, m = 0; m < d; ++m) for (var n = 0; n < c; ++n) {
                            for (var r = 0, p = 0, q = 0, u = -2; 2 >= u; ++u) for (var s = m + u, s = 0 > s ? 0 : s >= d ? d - 1 : s, z = -2; 2 >= z; ++z) var t = n + z,
                                t = 0 > t ? 0 : t >= c ? c - 1 : t,
                                t = 4 * (s * c + t),
                                r = r + h[t],
                                p = p + h[t + 1],
                                q =
                            q + h[t + 2];
                            k[l++] = r / 25;
                            k[l++] = p / 25;
                            k[l++] = q / 25;
                            k[l++] = 255
                        }
                        h = f;
                        f = a;
                        a = h
                    }
                b.putImageData(f, 0, 0)
            }
        };
    UI.prototype.showActiveView = function () {
            var a = this.thumbnail;
            this.clearView();
            a && (this.fadeThumbnail = a, this.fadeThumbnail.style.opacity = 1, this.container.appendChild(this.fadeThumbnail));
            if (!marmoset.noUserInterface) {
                void 0 === marmoset.largeUI && (marmoset.largeUI = this.viewer.mobile);
                450 > this.container.width && (marmoset.largeUI = !1);
                var b = FullScreen.support(),
                    b = !0,
                    a = 1;
                window.devicePixelRatio && (2 < window.devicePixelRatio ? a = 4 : 1 < window.devicePixelRatio && (a = 2));
                marmoset.largeUI && 4 > a && (a *= 2);
                var c = marmoset.largeUI ? 0.3 : 0.5;
                this.stripText = [];
                for (var d = 0; d < this.stripData.labels.length; ++d) {
                        this.stripText[d] = document.createElement("div");
                        this.stripText[d].style.position = "absolute";
                        this.stripText[d].style.cursor = "pointer";
                        this.stripText[d].style.pointerEvents = "none";
                        this.container.appendChild(this.stripText[d]);
                        var e = document.createElement("div");
                        e.style.color = "white";
                        e.style.opacity = 0.5;
                        e.style.fontFamily = "Arial";
                        e.style.textShadow = "2px 2px 3px #000000";
                        e.innerHTML = this.stripData.labels[d];
                        this.stripText[d].appendChild(e);
                        this.stripText[d].txt = e;
                        e = document.createElement("div");
                        e.style.width = "10000px";
                        e.style.height = "2px";
                        e.style.backgroundColor = "#AAAAAA";
                        e.style.opacity = 1;
                        e.style.position = "absolute";
                        e.style.left = e.style.top = "-1px";
                        this.stripText[d].appendChild(e);
                        this.stripText[d].line = e
                    }
                this.sigCluster = document.createElement("div");
                this.sigCluster.style.position = "absolute";
                this.sigCluster.style.right = marmoset.largeUI ? "12px" : "9px";
                this.sigCluster.style.left = "0px";
                this.sigCluster.style.top = "6px";
                this.sigCluster.style.height =
                marmoset.largeUI ? "64px" : "32px";
                this.logo = document.createElement("div");
                this.logo.style.position = "absolute";
                this.logo.style.right = marmoset.largeUI ? "-4px" : "1px";
                this.logo.style.top = marmoset.largeUI ? "0px" : "4px";
                this.logo.title = "Made with Marmoset Toolbag";
                var f = document.createElement("input");
                f.type = "image";
                f.src = marmoset.dataLocale + "logo" + a + "x.png";
                f.style.border = "none";
                f.style.width = f.style.height = marmoset.largeUI ? "72px" : "36px";
                f.style.border = "0px";
                f.style.outline = "0px";
                f.style.opacity = c;
                f.onmouseover =

                function () {
                        this.style.opacity = 1
                    }.bind(f);
                f.onmouseout = function () {
                        this.style.opacity = c
                    }.bind(f);
                f.onclick = function (a) {
                        window.open("http://www.marmoset.co/viewer?utm_source=inapp&utm_medium=menu&utm_campaign=viewer", "_blank");
                        this.style.opacity = c
                    }.bind(f, this);
                d = new XMLHttpRequest;
                d.open("HEAD", f.src, !0);
                d.onload = function (a) {
                        this.logo.appendChild(a)
                    }.bind(this, f);
                d.send();
                this.sigCluster.appendChild(this.logo);
                d = this.viewer.scene.metaData;
                d.title = UI.sanitize(d.title);
                d.subtitle = UI.sanitize(d.subtitle);
                d.author = UI.sanitize(d.author);
                d.link = UI.sanitizeURL(d.link);
                var g = d.title && 0 < d.title.length,
                    e = d.subtitle && 0 < d.subtitle.length,
                    f = d.author && 0 < d.author.length,
                    h = d.link && 0 < d.link.length;
                if (g || e || f) {
                        g || (d.title = "Art");
                        var k = !g && !e,
                            l = document.createElement("div");
                        l.style.position = "absolute";
                        l.style.right = marmoset.largeUI ? "74px" : "46px";
                        l.style.top = "5px";
                        l.style.width = "1px";
                        l.style.height = marmoset.largeUI ? k ? "21px" : "35px" : k ? "18px" : "31px";
                        l.style.opacity = 0.25;
                        l.style.backgroundColor = "white";
                        this.sigCluster.appendChild(l);
                        this.sigCluster.line = l;
                        k = document.createElement("a");
                        h && (k.href = d.link);
                        k.style.position = "absolute";
                        k.style.right = marmoset.largeUI ? "86px" : "58px";
                        k.style.top = "6px";
                        k.style.textAlign = "right";
                        k.style.color = "white";
                        k.style.fontFamily = "Arial";
                        k.style.fontSize = marmoset.largeUI ? "14px" : "12px";
                        k.style.textDecoration = "none";
                        k.target = "_blank";
                        l = document.createElement("font");
                        l.style.color = "#FFFFFF";
                        l.style.opacity = 0.5;
                        l.style.textDecoration = "none";
                        l.style.textShadow = "1px 1px 2px rgba(0,0,0,0.7)";
                        l.innerHTML =
                        d.title;
                        f && (l.innerHTML = g && !e ? l.innerHTML + "<br>by " : l.innerHTML + " by ");
                        k.appendChild(l);
                        g = document.createElement("font");
                        g.style.color = "#FF0044";
                        g.style.opacity = 1;
                        g.style.textShadow = "1px 1px 2px rgba(0,0,0,0.35)";
                        g.innerHTML = d.author;
                        k.appendChild(g);
                        f = document.createElement("font");
                        f.style.color = "#FFFFFF";
                        f.style.opacity = 0.5;
                        f.style.textShadow = "1px 1px 2px rgba(0,0,0,0.7)";
                        e && (f.innerHTML = "<br>", f.innerHTML += d.subtitle);
                        k.appendChild(f);
                        h && (k.onmouseover = function (a, b, c) {
                                a.style.opacity = c.style.opacity =
                                1;
                                b.style.textDecoration = "underline"
                            }.bind(k, l, g, f), k.onmouseout = function (a, b, c) {
                                a.style.opacity = c.style.opacity = 0.5;
                                b.style.textDecoration = "none"
                            }.bind(k, l, g, f));
                        this.sigCluster.appendChild(k);
                        this.sigCluster.sceneTitle = k
                    }
                this.container.appendChild(this.sigCluster);
                this.sigCluster.active = !0;
                this.sigCluster.toggle = function () {
                        this.sceneTitle && this.line && (this.active ? (this.removeChild(this.sceneTitle), this.removeChild(this.line)) : (this.appendChild(this.sceneTitle), this.appendChild(this.line)));
                        this.active = !this.active
                    }.bind(this.sigCluster);
                this.helpOverlay = document.createElement("div");
                this.helpOverlay.style.pointerEvents = "none";
                this.container.appendChild(this.helpOverlay);
                this.hideSigOnHelp = d = 450 > this.container.width;
                this.hideSigOnStrips = !0;
                g = [8, 8];
                d ? (e = 198 + 2 * g[0], f = 258 + 2 * g[1]) : (e = 354 + 2 * g[0], f = 218 + 2 * g[1]);
                h = document.createElement("div");
                h.style.position = "absolute";
                h.style.width = h.style.height = "100%";
                this.helpOverlay.contents = h;
                h = document.createElement("div");
                h.style.position = "absolute";
                h.style.right =
                marmoset.largeUI ? "92px" : "54px";
                h.style.top = d ? "16px" : "48px";
                h.style.width = e + "px";
                h.style.height = f + "px";
                this.helpOverlay.contents.appendChild(h);
                f = document.createElement("div");
                f.style.position = "absolute";
                f.style.width = "100%";
                f.style.height = "100%";
                f.style.backgroundColor = "black";
                f.style.opacity = "0.65";
                f.style.borderRadius = "16px";
                h.appendChild(f);
                f = document.createElement("input");
                f.type = "button";
                f.value = "x";
                f.style.position = "absolute";
                f.style.color = "#FFFFFF";
                f.style.fontWeight = "bolder";
                f.style.backgroundColor = "rgba(0,0,0,0.0)";
                f.style.border = "0px";
                f.style.outline = "0px";
                f.style.fontSize = marmoset.largeUI ? "16pt" : "10pt";
                f.style.right = marmoset.largeUI ? "2px" : "8px";
                f.style.top = marmoset.largeUI ? "0px" : "4px";
                f.style.width = f.style.height = marmoset.largeUI ? "32px" : "16px";
                f.style.pointerEvents = "auto";
                f.style.cursor = "pointer";
                f.onclick = function (a) {
                        this.helpOverlay.toggle();
                        this.refreshUI()
                    }.bind(this, f);
                h.appendChild(f);
                f = document.createElement("center");
                f.style.position = "absolute";
                f.style.left = g[0] - 4 + "px";
                f.style.right =
                g[0] + 4 + "px";
                f.style.top = f.style.bottom = g[1] + "px";
                f.style.paddingTop = "8px";
                d || (f.style.paddingRight = "8px");
                h.appendChild(f);
                h = f;
                g = (this.viewer.mobile ? "M" : "PC") + (2 < a ? 4 : 2) + "x.png";
                f = document.createElement("img");
                f.src = marmoset.dataLocale + "helprotate" + g;
                f.style.width = "66px";
                f.style.height = "90px";
                h.appendChild(f);
                f = document.createElement("img");
                f.src = marmoset.dataLocale + "helpzoom" + g;
                f.style.width = "66px";
                f.style.height = "90px";
                h.appendChild(f);
                f = document.createElement("img");
                f.src = marmoset.dataLocale + "helpmove" + g;
                f.style.width = "66px";
                f.style.height = "90px";
                h.appendChild(f);
                f = document.createElement("img");
                f.src = marmoset.dataLocale + "helpreset" + g;
                f.style.width = "66px";
                f.style.height = "90px";
                h.appendChild(f);
                f = document.createElement("img");
                f.src = marmoset.dataLocale + "helplights" + g;
                f.style.position = "relative";
                d || (f.style.left = "8px");
                f.style.width = "66px";
                f.style.height = "90px";
                h.appendChild(f);
                g = document.createElement("a");
                g.href = "http://www.marmoset.co/viewer?utm_source=inapp&utm_medium=menu&utm_campaign=viewer";
                g.target = "_blank";
                g.style.pointerEvents = "auto";
                h.appendChild(g);
                k = document.createElement("img");
                k.src = marmoset.dataLocale + "helpshadow.png";
                k.style.position = "absolute";
                k.style.left = 0.5 * e - (d ? 65 : 116) + "px";
                k.style.bottom = d ? "6px" : "8px";
                k.style.width = d ? "116px" : "232px";
                k.style.opacity = 0;
                g.appendChild(k);
                k.targetOpacity = 0;
                g.onmouseover = function () {
                        this.targetOpacity = 0.65
                    }.bind(k);
                g.onmouseout = function () {
                        this.targetOpacity = 0
                    }.bind(k);
                window.setInterval(function () {
                        this.style.opacity = 0.1 * this.targetOpacity + 0.9 * this.style.opacity
                    }.bind(k), 20);
                f = document.createElement("img");
                f.src = marmoset.dataLocale + "helptitle.png";
                f.style.position = "absolute";
                f.style.left = 0.5 * e - (d ? 65 : 116) + "px";
                f.style.bottom = d ? "8px" : "12px";
                f.style.width = d ? "116px" : "232px";
                g.appendChild(f);
                e = document.createElement("div");
                e.style.position = "absolute";
                e.style.left = 0;
                e.style.right = d ? "30px" : "108px";
                e.style.bottom = d ? "-4px" : "4px";
                e.style.textAlign = "right";
                e.style.fontFamilly = "Arial";
                h.appendChild(e);
                d = document.createElement("font");
                d.style.fontSize = "9pt";
                d.style.fontFamily = "Arial";
                e.appendChild(d);
                g = document.createElement("a");
                g.style.color = "#FF0044";
                g.style.textDecoration = "none";
                g.style.pointerEvents = "auto";
                g.innerHTML = "www.marmoset.co/viewer";
                g.href = "http://www.marmoset.co/viewer?utm_source=inapp&utm_medium=menu&utm_campaign=viewer";
                g.target = "_blank";
                g.onmouseover = function (a) {
                        this.style.textDecoration = "underline";
                        a.targetOpacity = 0.65
                    }.bind(g, k);
                g.onmouseout = function (a) {
                        this.style.textDecoration = "none";
                        a.targetOpacity = 0
                    }.bind(g, k);
                d.appendChild(g);
                this.helpOverlay.active = !1;
                this.helpOverlay.toggle = function (a) {
                        this.active ? this.removeChild(this.contents) : this.appendChild(this.contents);
                        this.active = !this.active
                    }.bind(this.helpOverlay, this.viewer);
                this.menuCluster = document.createElement("div");
                this.menuCluster.style.position = "absolute";
                this.menuCluster.style.right = marmoset.largeUI ? "4px" : "8px";
                this.menuCluster.style.top = marmoset.largeUI ? "70px" : "40px";
                marmoset.largeUI ? (this.menuCluster.style.width = "72px", this.menuCluster.style.height = "64px") : (this.menuCluster.style.width = "36px", this.menuCluster.style.height = "36px");
                h = document.createElement("div");
                h.style.left = h.style.top = "0px";
                h.style.width = h.style.height = "100%";
                this.menuCluster.contents = h;
                this.menuCluster.appendChild(h);
                d = 0;
                e = function (a, b, c, d, e) {
                        var f = document.createElement("input");
                        f.type = "image";
                        f.src = marmoset.dataLocale + c;
                        f.style.position = "absolute";
                        f.style.left = "0px";
                        f.style.bottom = -100 * d + "%";
                        f.style.border = "none";
                        f.style.outline = "0px";
                        f.title = b;
                        f.style.opacity = e;
                        marmoset.largeUI ? (f.style.width = "64px", f.style.height = "48px") : (f.style.width = "32px", f.style.height = "24px");
                        f.onmouseover = function (a) {
                            this.style.opacity = a
                        }.bind(f, 1);
                        f.onmouseout = function (a) {
                            this.style.opacity = a
                        }.bind(f, e);
                        f.onmouseup = function (a) {
                            this.style.opacity = a
                        }.bind(f, e);
                        b = new XMLHttpRequest;
                        b.open("HEAD", f.src, !0);
                        b.onload = function (a) {
                            a.appendChild(this)
                        }.bind(f, a);
                        b.send();
                        return f
                    };
                b && (b = e(this.menuCluster.contents, "Full Screen", "fullscreen" + a + "x.png", d++, c), b.onclick = function (a) {
                        FullScreen.active() ? FullScreen.end() : FullScreen.begin(this.viewer.domRoot, this.viewer.fullscreenChange.bind(this.viewer));
                        a.style.opacity = c;
                        this.refreshUI()
                    }.bind(this, b));
                b = e(this.menuCluster.contents, "Layer Views", "strips" + a + "x.png", d++, c);
                b.onclick = function (a) {
                        this.stripData.toggleMenu();
                        this.helpOverlay.active && this.helpOverlay.toggle();
                        this.viewer.wake();
                        this.refreshUI()
                    }.bind(this, b);
                b = e(this.menuCluster.contents, "Help", "help" + a + "x.png", d++, c);
                b.onclick = function (a) {
                        this.stripData.selectedStrip == this.stripData.STRIP_MENU && this.stripData.toggleMenu();
                        this.helpOverlay.toggle();
                        this.refreshUI()
                    }.bind(this, b);
                this.container.appendChild(this.menuCluster);
                this.menuCluster.active = !0;
                this.menuCluster.toggle = function () {
                        this.active ? this.removeChild(this.contents) : this.appendChild(this.contents);
                        this.active = !this.active
                    }.bind(this.menuCluster);
                void 0 !== marmoset.hostImage && (marmoset.hostURL && (g = document.createElement("a"), g.href = marmoset.hostURL, g.target = "_blank"), f = document.createElement("img"), f.src = marmoset.hostImage, f.style.position = "absolute", f.style.top = "4px", f.style.left = "4px", f.style.opacity = 0.65, f.style["-webkit-transform"] = f.style.transform = "translate(-50%,-50%) scale(0.5,0.5) translate(50%,50%)", marmoset.hostURL ? (f.onmouseover = function () {
                        this.style.opacity = 1
                    }.bind(f), f.onmouseout = function () {
                        this.style.opacity = 0.5
                    }.bind(f), g.appendChild(f), this.hostLogo = g) : this.hostLogo = f, d = new XMLHttpRequest, d.open("HEAD", f.src, !0), d.onload = function () {
                        this.container.appendChild(this.hostLogo)
                    }.bind(this), d.send());
                this.sceneStats = document.createElement("text");
                this.sceneStats.style.position = "absolute";
                this.sceneStats.style.left = "9px";
                this.sceneStats.style.bottom = "8px";
                this.sceneStats.style.color = "gray";
                this.sceneStats.style.fontFamily = "Arial";
                this.sceneStats.style.fontSize = "75%";
                for (d = b = a = 0; d < this.viewer.scene.meshes.length; ++d) e = this.viewer.scene.meshes[d],
                a += e.indexCount / 3,
                b += e.vertexCount;
                this.sceneStats.innerHTML = "Triangles: " + (a | 0).toLocaleString() + "<br>Vertices: " + (b | 0).toLocaleString();
                marmoset.showFrameTime && (this.frameTimer = document.createElement("text"), this.frameTimer.style.position = "absolute", this.frameTimer.style.left = this.frameTimer.style.top = "5px", this.frameTimer.style.color = "gray", this.frameTimer.style.fontSize = "75%", this.container.appendChild(this.frameTimer), this.frameTimer.innerHTML = "--", this.frameCount = 1E20);
                this.animateStrips()
            }
        };
    UI.prototype.refreshUI = function () {
            if (this.sigCluster) {
                var a = !1,
                    b = this.stripData.selectedStrip == this.stripData.STRIP_MENU;
                this.hideSigOnStrips && (a = a || b);
                this.hideSigOnHelp && (a = a || this.helpOverlay.active);
                this.sigCluster.active == a && this.sigCluster.toggle()
            }
        };
    UI.prototype.signalLoadProgress = function (a, b) {
            if (this.thumbnail) {
                if (!this.progressBar) {
                    var c = document.createElement("div");
                    c.style.backgroundColor = "rgb(30,30,30)";
                    c.style.opacity = 0.5;
                    c.style.position = "absolute";
                    c.style.left = "20%";
                    c.style.width = "60%";
                    c.style.bottom = "30%";
                    c.style.height = "2px";
                    this.progressBar = document.createElement("div");
                    this.progressBar.style.backgroundColor = "white";
                    this.progressBar.style.position = "absolute";
                    this.progressBar.style.left = this.progressBar.style.bottom = "0px";
                    this.progressBar.style.height = "100%";
                    this.progressBar.style.width = "0px";
                    c.appendChild(this.progressBar);
                    this.container.appendChild(c);
                    this.playButton && (this.container.removeChild(this.playButton), delete this.playButton)
                }
                this.progressBar.style.width = 0 >= b ? (100 * a / (2097152 + a) | 0) + "%" : (100 * a / b | 0) + "%"
            }
        };
    UI.prototype.animating = function () {
            return !!this.fadeThumbnail || !! this.frameTimer
        };
    UI.prototype.animate = function () {
            this.fadeThumbnail && (this.fadeThumbnailTimer = this.fadeThumbnailTimer || Date.now(), this.fadeThumbnail.style.opacity = 1 - 0.0015 * (Date.now() - this.fadeThumbnailTimer), 0.01 > this.fadeThumbnail.style.opacity && (this.container.removeChild(this.fadeThumbnail), delete this.fadeThumbnail, delete this.fadeThumbnailTimer));
            if (this.frameTimer && (this.frameCount++, 60 <= this.frameCount)) {
                var a = (new Date).getTime();
                if (void 0 !== this.frameTime) {
                    var b = (a - this.frameTime) / this.frameCount,
                        b = Math.floor(100 * b) / 100;
                    this.frameTimer.innerHTML = b + " ms";
                    this.frameTimer.style.color = 32 > b ? "green" : "red"
                }
                this.frameCount = 0;
                this.frameTime = a
            }
            this.sceneStats && (a = !! this.sceneStats.parentElement, b = this.stripData.active(), a && !b ? (this.container.removeChild(this.sceneStats), this.hostLogo && this.container.appendChild(this.hostLogo)) : !a && b && (this.container.appendChild(this.sceneStats), this.hostLogo && this.container.removeChild(this.hostLogo)));
            this.refreshUI();
            (this.stripData.animationActive || this.stripData.active()) && this.animateStrips()
        };
    UI.prototype.animateStrips = function () {
            if (this.stripText) for (var a = Math.atan(this.viewer.canvas.height / this.viewer.canvas.width / this.stripData.stripSlant), b = 0; b < this.stripData.labels.length; ++b) {
                var c = this.stripData.strips[b],
                    c = c - this.stripData.stripSlant,
                    c = 0.5 + 0.5 * c;
                b == this.stripData.selectedStrip ? (this.stripText[b].style["-ms-transform"] = this.stripText[b].style["-webkit-transform"] = this.stripText[b].style.transform = "none", this.stripText[b].style.top = "4px", this.stripText[b].style.left = "0px", this.stripText[b].style.width = "150px", this.stripText[b].txt.style.textAlign = "center", this.stripText[b].txt.style.background = "rgba(0, 0, 0, 0.75)", this.stripText[b].txt.style.background = "-webkit-linear-gradient(left, rgba(0,0,0,0.75), rgba(0,0,0,0))", this.stripText[b].txt.style.background = "-o-linear-gradient(left,      rgba(0,0,0,0.75), rgba(0,0,0,0))", this.stripText[b].txt.style.background = "-moz-linear-gradient(left,    rgba(0,0,0,0.75), rgba(0,0,0,0))", this.stripText[b].txt.style.background = "linear-gradient(left,         rgba(0,0,0,0.75), rgba(0,0,0,0))", this.stripText[b].txt.style.paddingLeft = "32px", this.stripText[b].txt.style.paddingTop = "6px", this.stripText[b].txt.style.paddingBottom = "4px", this.stripText[b].txt.style.textShadow = "1px 1px 2px rgba(0,0,0,0.7)", this.stripText[b].line.style.opacity = 0.5, this.stripText[b].line.style.top = "100%", this.stripText[b].line.style.width = "100%", this.stripText[b].line.style.height = "1px") : (this.stripText[b].style["-ms-transform"] = this.stripText[b].style["-webkit-transform"] = this.stripText[b].style.transform = "translate(-50%, -50%) rotate(" + a + "rad) translate(50%, 50%)", this.stripText[b].style.left = 100 * c + "%", this.stripText[b].style.top = "0px", this.stripText[b].style.width = "85px", this.stripText[b].txt.style.textAlign = "left", this.stripText[b].txt.style.background = "none", this.stripText[b].txt.style.paddingLeft = "8px", this.stripText[b].txt.style.paddingTop = "6px", this.stripText[b].txt.style.paddingBottom = "4px", this.stripText[b].txt.style.textShadow = "2px 0px 3px rgba(0,0,0,0.7)", this.stripText[b].line.style.opacity = 1, this.stripText[b].line.style.top = "-1px", this.stripText[b].line.style.width = "10000px", this.stripText[b].line.style.height = "2px")
            }
        };
    var Vect = {
            type: Float32Array,
            create: function (a, b, c, d) {
                var e = new Vect.type(4);
                e[0] = a;
                e[1] = b;
                e[2] = c;
                e[3] = d;
                return e
            },
            empty: function () {
                return new Vect.type(4)
            },
            set: function (a, b, c, d, e) {
                a[0] = b;
                a[1] = c;
                a[2] = d;
                a[3] = e
            },
            copy: function (a, b) {
                a[0] = b[0];
                a[1] = b[1];
                a[2] = b[2];
                a[3] = b[3]
            },
            add: function (a, b, c) {
                a[0] = b[0] + c[0];
                a[1] = b[1] + c[1];
                a[2] = b[2] + c[2];
                a[3] = b[3] + c[3];
                return a
            },
            sub: function (a, b, c) {
                a[0] = b[0] - c[0];
                a[1] = b[1] - c[1];
                a[2] = b[2] - c[2];
                a[3] = b[3] - c[3];
                return a
            },
            scale: function (a, b, c) {
                a[0] = c[0] * b;
                a[1] = c[1] * b;
                a[2] = c[2] * b;
                a[3] = c[3] * b;
                return a
            },
            mul: function (a, b, c) {
                a[0] = b[0] * c[0];
                a[1] = b[1] * c[1];
                a[2] = b[2] * c[2];
                a[3] = b[3] * c[3];
                return a
            },
            mad: function (a, b, c, d) {
                a[0] = b[0] * c[0] + d[0];
                a[1] = b[1] * c[1] + d[1];
                a[2] = b[2] * c[2] + d[2];
                a[3] = b[3] * c[3] + d[3];
                return a
            },
            smad: function (a, b, c, d) {
                a[0] = b * c[0] + d[0];
                a[1] = b * c[1] + d[1];
                a[2] = b * c[2] + d[2];
                a[3] = b * c[3] + d[3];
                return a
            },
            negate: function (a, b) {
                a[0] = -b[0];
                a[1] = -b[1];
                a[2] = -b[2];
                return a
            },
            negate4: function (a, b) {
                a[0] = -b[0];
                a[1] = -b[1];
                a[2] = -b[2];
                a[3] = -b[3];
                return a
            },
            length: function (a) {
                var b = a[0],
                    c = a[1];
                a = a[2];
                return Math.sqrt(b * b + c * c + a * a)
            },
            dot: function (a, b) {
                return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
            },
            dot4: function (a, b) {
                return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]
            },
            normalize: function (a, b) {
                var c = b[0],
                    d = b[1],
                    e = b[2],
                    f = Math.sqrt(c * c + d * d + e * e);
                if (0 == f) return Vect.set(a, 0, 0, 0, 0);
                f = 1 / f;
                a[0] = c * f;
                a[1] = d * f;
                a[2] = e * f;
                return a
            },
            cross: function (a, b, c) {
                a[0] = b[1] * c[2];
                a[0] += -b[2] * c[1];
                a[1] = b[2] * c[0] - b[0] * c[2];
                a[2] = b[0] * c[1] - b[1] * c[0];
                return a
            },
            lerp: function (a, b, c, d) {
                var e = 1 - d;
                a[0] = b[0] * e + c[0] * d;
                a[1] = b[1] * e + c[1] * d;
                a[2] =
                b[2] * e + c[2] * d;
                return a
            },
            lerp4: function (a, b, c, d) {
                var e = 1 - d;
                a[0] = b[0] * e + c[0] * d;
                a[1] = b[1] * e + c[1] * d;
                a[2] = b[2] * e + c[2] * d;
                a[3] = b[3] * e + c[3] * d;
                return a
            },
            min: function (a, b, c) {
                a[0] = Math.min(b[0], c[0]);
                a[1] = Math.min(b[1], c[1]);
                a[2] = Math.min(b[2], c[2]);
                a[3] = Math.min(b[3], c[3]);
                return a
            },
            max: function (a, b, c) {
                a[0] = Math.max(b[0], c[0]);
                a[1] = Math.max(b[1], c[1]);
                a[2] = Math.max(b[2], c[2]);
                a[3] = Math.max(b[3], c[3]);
                return a
            },
            projectOnPlane: function (a, b, c, d) {
                var e = Vect.empty();
                Vect.sub(e, b, c);
                c = Vect.dot(e, d);
                smad(a, -c, normal, b);
                return a
            }
        };

    function View(a) {
            this.pivot = [0, 0, 0];
            this.rotation = [0, 0];
            this.radius = 1;
            this.nearPlane = 0.3;
            this.fov = 45;
            this.size = [1, 1];
            this.transform = Matrix.empty();
            this.viewMatrix = Matrix.empty();
            this.projectionMatrix = Matrix.empty();
            this.viewProjectionMatrix = Matrix.empty();
            this.projectionOffset = [0, 0];
            a ? this.loadView(a, !0) : (this.saveResetView(), this.updateView(), this.updateProjection())
        }
    View.prototype.saveResetView = function () {
            this.resetDesc = {
                angles: [this.rotation[0], this.rotation[1]],
                pivot: [this.pivot[0], this.pivot[1], this.pivot[2]],
                limits: this.limits,
                orbitRadius: this.radius,
                fov: this.fov
            }
        };
    View.prototype.loadView = function (a, b) {
            a && (this.rotation[0] = a.angles[0], this.rotation[1] = a.angles[1], this.pivot[0] = a.pivot[0], this.pivot[1] = a.pivot[1], this.pivot[2] = a.pivot[2], this.radius = a.orbitRadius, this.fov = a.fov, this.limits = a.limits, b && this.saveResetView(), this.updateView(), this.updateProjection())
        };
    View.prototype.reset = function () {
            this.loadView(this.resetDesc)
        };
    View.prototype.updateView = function () {
            if (void 0 !== this.limits) {
                if (this.limits.angles) {
                    var a = this.limits.angles.x,
                        b = this.limits.angles.y;
                    if (void 0 !== a) {
                            var c = this.rotation[0] - a.offset,
                                a = Math.min(Math.max(c, a.min), a.max);
                            this.rotation[0] += a - c
                        }
                    void 0 !== b && (c = this.rotation[1] - b.offset, a = Math.min(Math.max(c, b.min), b.max), this.rotation[1] += a - c)
                }
                void 0 !== this.limits.orbitRadius && (b = this.limits.orbitRadius.min, c = this.limits.orbitRadius.max, void 0 !== b && (this.radius = Math.max(this.radius, b)), void 0 !== c && (this.radius =
                Math.min(this.radius, c)));
                void 0 !== this.limits.pan && (b = this.limits.pan, c = this.resetDesc.pivot, b.x && (this.pivot[0] = c[0]), b.y && (this.pivot[1] = c[1]), b.z && (this.pivot[2] = c[2]))
            }
            Matrix.translation(this.transform, 0, 0, this.radius);
            b = Matrix.rotation(Matrix.empty(), this.rotation[0], 0);
            c = Matrix.rotation(Matrix.empty(), this.rotation[1], 1);
            Matrix.mul(b, c, b);
            Matrix.mul(this.transform, b, this.transform);
            this.transform[12] += this.pivot[0];
            this.transform[13] += this.pivot[1];
            this.transform[14] += this.pivot[2];
            Matrix.invert(this.viewMatrix, this.transform);
            Matrix.mul(this.viewProjectionMatrix, this.viewMatrix, this.projectionMatrix)
        };
    View.prototype.offsetProjection = function (a, b) {
            this.projectionOffset[0] = -2 * a;
            this.projectionOffset[1] = -2 * b
        };
    View.prototype.updateProjection = function (a) {
            Matrix.perspectiveInfinite(this.projectionMatrix, this.fov, this.size[0] / this.size[1], this.nearPlane, a);
            this.projectionMatrix[8] = this.projectionOffset[0];
            this.projectionMatrix[9] = this.projectionOffset[1];
            Matrix.mul(this.viewProjectionMatrix, this.projectionMatrix, this.viewMatrix)
        };

    function WebViewer(a, b, c, d) {
            this.mobile = /Android|iPhone|iPod|iPad|Windows Phone|IEMobile|BlackBerry|webOS/.test(navigator.userAgent);
            this.domRoot = document.createElement("div");
            this.domRoot.style.width = a + "px";
            this.domRoot.style.height = b + "px";
            this.initCanvas(a, b);
            this.scene = this.input = null;
            this.sceneURL = c;
            this.sleepCounter = 8;
            this.onLoad = null;
            this.stripData = new StripData;
            this.ui = new UI(this);
            this.ui.setSize(a, b);
            this.ui.showPreview(d)
        }
    WebViewer.prototype.initCanvas = function (a, b) {
            this.canvas && this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas);
            this.canvas = document.createElement("canvas");
            this.canvas.width = 1 * a;
            this.canvas.height = 1 * b;
            this.canvas.style.width = a + "px";
            this.canvas.style.height = b + "px";
            this.canvas.style.position = "absolute";
            this.domRoot.appendChild(this.canvas)
        };
    WebViewer.prototype.initGL = function () {
            var a = {
                alpha: !! marmoset.transparentBackground,
                depth: !1,
                stencil: !1,
                antialias: !1,
                premultipliedAlpha: !! marmoset.transparentBackground,
                preserveDrawingBuffer: !1
            },
                a = this.gl = this.canvas.getContext("webgl", a) || this.canvas.getContext("experimental-webgl", a);
            if (!this.gl) return this.ui.showFailure('Please <a href="http://get.webgl.org/" target=_blank>check<a/> to ensure your browser has support for WebGL.'),
            !1;
            this.canvas.addEventListener("webglcontextlost", function (a) {
                    a.preventDefault()
                }.bind(this), !1);
            this.canvas.addEventListener("webglcontextrestored", function (a) {
                    this.loadScene(this.sceneURL)
                }.bind(this), !1);
            a.ext = {
                    textureAniso: a.getExtension("EXT_texture_filter_anisotropic") || a.getExtension("WEBKIT_EXT_texture_filter_anisotropic") || a.getExtension("MOZ_EXT_texture_filter_anisotropic"),
                    textureFloat: a.getExtension("OES_texture_float"),
                    textureFloatLinear: a.getExtension("OES_texture_float_linear"),
                    textureHalf: a.getExtension("OES_texture_half_float"),
                    textureHalfLinear: a.getExtension("OES_texture_half_float_linear"),
                    textureDepth: a.getExtension("WEBGL_depth_texture"),
                    colorBufferFloat: a.getExtension("WEBGL_color_buffer_float"),
                    colorBufferHalf: a.getExtension("EXT_color_buffer_half_float"),
                    index32bit: a.getExtension("OES_element_index_uint"),
                    loseContext: a.getExtension("WEBGL_lose_context"),
                    derivatives: a.getExtension("OES_standard_derivatives")
                };
            a.limits = {
                    textureSize: a.getParameter(a.MAX_TEXTURE_SIZE),
                    varyings: a.getParameter(a.MAX_VARYING_VECTORS),
                    vertexAttribs: a.getParameter(a.MAX_VERTEX_ATTRIBS),
                    vertexUniforms: a.getParameter(a.MAX_VERTEX_UNIFORM_VECTORS),
                    fragmentUniforms: a.getParameter(a.MAX_FRAGMENT_UNIFORM_VECTORS),
                    viewportSizes: a.getParameter(a.MAX_VIEWPORT_DIMS),
                    vendor: a.getParameter(a.VENDOR),
                    version: a.getParameter(a.VERSION)
                };
            a.hints = {
                    mobile: this.mobile
                };
            a.enable(a.DEPTH_TEST);
            a.shaderCache = new ShaderCache(a);
            a.textureCache = new TextureCache(a);
            this.allocBacking();
            return !0
        };
    WebViewer.prototype.allocBacking = function () {
            var a = this.gl,
                b = !1,
                c = {
                    width: this.canvas.width,
                    height: this.canvas.height
                };
            this.mainColor = new Texture(a, c);
            a.ext.textureHalf && a.ext.textureHalfLinear && (this.mainColor.loadArray(null, a.RGBA, a.ext.textureHalf.HALF_FLOAT_OES), this.mainBuffer = new Framebuffer(a, {
                    color0: this.mainColor,
                    createDepth: !0
                }), b = this.mainBuffer.valid);
            !b && a.ext.textureFloat && a.ext.textureFloatLinear && !a.hints.mobile && (this.mainColor.loadArray(null, a.RGBA, a.FLOAT), this.mainBuffer = new Framebuffer(a, {
                    color0: this.mainColor,
                    createDepth: !0
                }), b = this.mainBuffer.valid);
            for (; !b;) this.mainColor = new Texture(a, c),
            this.mainColor.loadArray(null, a.RGBA, a.UNSIGNED_BYTE),
            this.mainBuffer = new Framebuffer(a, {
                    color0: this.mainColor,
                    createDepth: !0
                }),
            b = this.mainBuffer.valid,
            c.width /= 2,
            c.height /= 2
        };
    WebViewer.prototype.loadScene = function (a) {
            this.sceneURL = a || this.sceneURL;
            this.scene = this.input = null;
            if (this.initGL() && this.sceneURL) {
                var b = this.ui.signalLoadProgress.bind(this.ui);
                a = function (a) {
                    b(1, 1);
                    this.scene = new Scene(this.gl);
                    this.scene.stripData = this.stripData;
                    if (this.scene.load(new Archive(a))) if (2070 >= this.scene.metaData.tbVersion) this.ui.showFailure("This .mview file is from an out-of-date beta version of Toolbag. Please re-export it with the new version. Thanks!");
                    else {
                        if (this.bindInput(), this.requestFrame(this.updateLoad.bind(this)), this.onLoad) this.onLoad()
                    } else this.ui.showFailure("Package file could not be read or is invalid.")
                }.bind(this);
                var c = function () {
                    this.ui.showFailure("Package file (" + this.sceneURL + ") could not be retrieved.")
                }.bind(this);
                Network.fetchBinary(this.sceneURL, a, c, b)
            }
        };
    WebViewer.prototype.unload = function () {
            delete this.scene;
            delete this.input;
            delete this.ui;
            delete this.mainColor;
            delete this.mainBuffer;
            delete this.gl;
            var a = this.domRoot.clientWidth,
                b = this.domRoot.clientHeight;
            this.initCanvas(a, b);
            this.ui = new UI(this);
            this.ui.setSize(a, b);
            this.ui.showPreview();
            this.cancelFrame()
        };
    WebViewer.prototype.bindInput = function () {
            this.input = new Input(this.ui.container);
            var a = function () {
                this.wake();
                this.scene.postRender.discardAAHistory()
            }.bind(this);
            this.input.onDrag.push(function (b, c, d, e) {
                b = 1 - 2.2 / (Math.sqrt(d * d + e * e) + 2.2);
                c = this.scene.view;
                c.rotation[1] -= 0.4 * d * b;
                c.rotation[0] -= 0.4 * e * b;
                c.rotation[0] = 90 < c.rotation[0] ? 90 : c.rotation[0];
                c.rotation[0] = -90 > c.rotation[0] ? -90 : c.rotation[0];
                c.updateView();
                a()
            }.bind(this));
            this.input.onPan.push(function (b, c) {
                var d = this.scene.view,
                    e = d.fov / 45 * 0.8 * (d.radius / this.domRoot.clientHeight),
                    f = -b * e,
                    e = c * e;
                d.pivot[0] += f * d.transform[0] + e * d.transform[4];
                d.pivot[1] += f * d.transform[1] + e * d.transform[5];
                d.pivot[2] += f * d.transform[2] + e * d.transform[6];
                d.updateView();
                a()
            }.bind(this));
            this.input.onPan2.push(function (b, c) {
                var d = 1 - 2.2 / (Math.sqrt(b * b + c * c) + 2.2);
                this.scene.lights.rotation -= 0.4 * b * d;
                a()
            }.bind(this));
            this.input.onZoom.push(function (b) {
                var c = this.scene.view;
                c.radius *= 1 - 0.002 * b;
                c.radius = 0.001 > c.radius ? 0.001 : c.radius;
                c.radius = 1E3 < c.radius ? 1E3 : c.radius;
                c.updateView();
                a()
            }.bind(this));
            this.ui.bindInput(this.input)
        };
    WebViewer.prototype.wake = function (a) {
            this.sleepCounter = a || 16;
            this.requestFrame(this.update.bind(this))
        };
    WebViewer.prototype.requestFrame = function (a) {
            var b = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
            if (!this.frameRequestPending) {
                var c = function () {
                    this.frameRequestPending = 0;
                    a()
                }.bind(this);
                this.frameRequestPending = b(c, this.canvas)
            }
        };
    WebViewer.prototype.cancelFrame = function () {
            this.frameRequestPending && (window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame)(this.frameRequestPending)
        };
    WebViewer.prototype.fullscreenChange = function () {
            FullScreen.active() ? (this.oldRootWidth = this.domRoot.style.width, this.oldRootHeight = this.domRoot.style.height, this.domRoot.style.width = "100%", this.domRoot.style.height = "100%") : (this.domRoot.style.width = this.oldRootWidth, this.domRoot.style.height = this.oldRootHeight);
            this.wake()
        };
    WebViewer.prototype.resize = function (a, b) {
            a && b ? (this.domRoot.style.width = a + "px", this.domRoot.style.height = b + "px") : (a = this.domRoot.clientWidth, b = this.domRoot.clientHeight);
            this.canvas.width = 1 * a;
            this.canvas.height = 1 * b;
            this.canvas.style.width = a + "px";
            this.canvas.style.height = b + "px";
            this.ui.setSize(a, b);
            this.allocBacking();
            this.wake()
        };
    WebViewer.prototype.updateLoad = function () {
            this.scene.complete() ? this.start() : this.requestFrame(this.updateLoad.bind(this));
            this.ui.animate()
        };
    WebViewer.prototype.start = function () {
            this.scene.view.updateView();
            this.ui.showActiveView();
            this.requestFrame(this.update.bind(this))
        };
    WebViewer.prototype.update = function () {
            if (0 < this.sleepCounter || this.ui.animating() || this.stripData.animationActive) this.stripData.update(),
            this.ui.animate(),
            this.scene.update(),
            this.drawScene(),
            this.requestFrame(this.update.bind(this));
            this.sleepCounter--
        };
    WebViewer.prototype.drawScene = function () {
            this.gl.isContextLost() || (this.domRoot.clientWidth == this.canvas.clientWidth && this.domRoot.clientHeight == this.canvas.clientHeight || this.resize(), this.scene.view.size = [this.mainBuffer.width, this.mainBuffer.height], this.scene.view.updateProjection(), this.scene.postRender.adjustProjectionForSupersampling(this.scene.view), this.scene.collectShadows(this.mainBuffer), this.mainBuffer.bind(), this.scene.draw(), this.scene.postRender.present(this.mainColor, this.canvas.width, this.canvas.height, this.stripData.active()))
        };
    marmoset = "undefined" == typeof marmoset ? {} : marmoset;
    marmoset.WebViewer = WebViewer;
    marmoset.dataLocale = (0 == window.location.protocol.indexOf("https") ? "https:" : "http:") + "//viewer.marmoset.co/main/data/";
    var ShaderTable = {
            "aaresolve.glsl": "precision mediump float;uniform sampler2D tInput0;uniform sampler2D tInput1;uniform sampler2D tInput2;\n#ifdef HIGHQ\nuniform sampler2D tInput3;\n#endif\nuniform vec4 uSamplesValid;varying highp vec2 d;void main(void){vec4 e=texture2D(tInput0,d);vec4 f=texture2D(tInput1,d);vec4 h=texture2D(tInput2,d);\n#ifdef HIGHQ\nvec4 i=texture2D(tInput3,d);gl_FragColor=e*uSamplesValid.x+f*uSamplesValid.y+h*uSamplesValid.z+i*uSamplesValid.w;\n#else\ngl_FragColor=e*uSamplesValid.x+f*uSamplesValid.y+h*uSamplesValid.z;\n#endif\n}",
            "alphaprepassfrag.glsl": "precision mediump float;\n#include <matdither.glsl>\nuniform sampler2D tAlbedo;varying mediump vec2 j;void main(){float k=texture2D(tAlbedo,j).a;if(k<=l(j.x)){discard;}gl_FragColor=vec4(0.0);}",
            "alphaprepassvert.glsl": "precision highp float;uniform mat4 uModelViewProjectionMatrix;attribute vec3 vPosition;attribute vec2 vTexCoord;varying mediump vec2 j;vec4 m(mat4 o,vec3 p){return o[0]*p.x+(o[1]*p.y+(o[2]*p.z+o[3]));}void main(void){gl_Position=m(uModelViewProjectionMatrix,vPosition.xyz);j=vTexCoord;}",
            "bloom.glsl": "precision mediump float;uniform sampler2D tInput;uniform vec4 uKernel[BLOOM_SAMPLES];varying highp vec2 d;void main(void){vec3 c=vec3(0.0,0.0,0.0);for(int u=0;u<BLOOM_SAMPLES;++u){vec3 v=uKernel[u].xyz;c+=texture2D(tInput,d+v.xy).xyz*v.z;}gl_FragColor.xyz=c;gl_FragColor.w=0.0;gl_FragColor = vec4(1,0,0,1);}",
			
            "bloomshrink.glsl": "precision highp float;uniform sampler2D tInput;varying highp vec2 d;void main(void){float A=0.25/256.0;gl_FragColor=0.25*(texture2D(tInput,d+vec2(A,A))+texture2D(tInput,d+vec2(A,-A))+texture2D(tInput,d+vec2(-A,A))+texture2D(tInput,d+vec2(-A,-A)));gl_FragColor = vec4(1,0,0,1);}",
			
            "matdither.glsl": "float l(highp float B){highp float C=0.5*fract(gl_FragCoord.x*0.5)+0.5*fract(gl_FragCoord.y*0.5);return 0.4+0.6*fract(C+3.141592e6*B);}",
			
            "matfrag.glsl": "\n#extension GL_OES_standard_derivatives : enable\nprecision mediump float;varying highp vec3 D;varying mediump vec2 j;varying mediump vec3 E;varying mediump vec3 F;varying mediump vec3 G;\n#ifdef VERTEX_COLOR\nvarying lowp vec4 H;\n#endif\n#ifdef TEXCOORD_SECONDARY\nvarying mediump vec2 I;\n#endif\nuniform sampler2D tAlbedo;uniform sampler2D tReflectivity;uniform sampler2D tNormal;uniform sampler2D tExtras;uniform sampler2D tSkySpecular;uniform vec4 uDiffuseCoefficients[9];uniform vec3 uCameraPosition;uniform vec3 uFresnel;uniform float uAlphaTest;uniform float uHorizonOcclude;uniform float uHorizonSmoothing;\n#ifdef EMISSIVE\nuniform float uEmissiveScale;uniform vec4 uTexRangeEmissive;\n#endif\n#ifdef AMBIENT_OCCLUSION\nuniform vec4 uTexRangeAO;\n#endif\n#ifdef LIGHT_COUNT\nuniform vec4 uLightPositions[LIGHT_COUNT];uniform vec3 uLightDirections[LIGHT_COUNT];uniform vec3 uLightColors[LIGHT_COUNT];uniform vec3 uLightParams[LIGHT_COUNT];uniform vec3 uLightSpot[LIGHT_COUNT];\n#endif\n#ifdef ANISO\nuniform float uAnisoStrength;uniform vec3 uAnisoTangent;uniform float uAnisoIntegral;uniform vec4 uTexRangeAniso;\n#endif\n#define saturate(x) clamp( x, 0.0, 1.0 )\n#include <matsampling.glsl>\n#include <matlighting.glsl>\n#include <matshadows.glsl>\n#include <matskin.glsl>\n#include <matmicrofiber.glsl>\n#include <matstrips.glsl>\n#ifdef TRANSPARENCY_DITHER\n#include <matdither.glsl>\n#endif\nvoid main(void){vec4 J=texture2D(tAlbedo,j);vec3 K=L(J.xyz);float k=J.w;\n#ifdef VERTEX_COLOR\n{vec3 M=H.xyz;\n#ifdef VERTEX_COLOR_SRGB\nM=M*(M*(M*0.305306011+vec3(0.682171111))+vec3(0.012522878));\n#endif\nK*=M;\n#ifdef VERTEX_COLOR_ALPHA\nk*=H.w;\n#endif\n}\n#endif\n#ifdef ALPHA_TEST\nif(k<uAlphaTest){discard;}\n#endif\n#ifdef TRANSPARENCY_DITHER\nk=(k>l(j.x))?1.0:k;\n#endif\nvec3 N=O(texture2D(tNormal,j).xyz);\n#ifdef ANISO\n#ifdef ANISO_NO_DIR_TEX\nvec3 P=Q(uAnisoTangent);\n#else\nJ=R(j,uTexRangeAniso);vec3 P=2.0*J.xyz-vec3(1.0);P=Q(P);\n#endif\nP=P-N*dot(P,N);P=normalize(P);vec3 S=P*uAnisoStrength;\n#endif\nvec3 T=normalize(uCameraPosition-D);J=texture2D(tReflectivity,j);vec3 U=L(J.xyz);float V=J.w;float W=V;\n#ifdef HORIZON_SMOOTHING\nfloat X=dot(T,N);X=uHorizonSmoothing-X*uHorizonSmoothing;V=mix(V,1.0,X*X);\n#endif\n#ifdef STRIPVIEW\nY Z;dc(Z,V,U);\n#endif\nfloat dd=1.0;\n#ifdef AMBIENT_OCCLUSION\n#ifdef AMBIENT_OCCLUSION_SECONDARY_UV\ndd=R(I,uTexRangeAO).x;\n#else\ndd=R(j,uTexRangeAO).x;\n#endif\ndd*=dd;\n#endif\n#if defined(SKIN)\nde df;dh(df);df.di*=dd;\n#elif defined(MICROFIBER)\ndj dk;dl(dk,N);dk.dm*=dd;\n#else\nvec3 dn=du(N);dn*=dd;\n#endif\nvec3 dv=reflect(-T,N);\n#ifdef ANISO\nvec3 rt=dv-(0.5*S*dot(dv,P));vec3 dA=dB(rt,mix(V,0.5*V,uAnisoStrength));\n#else\nvec3 dA=dB(dv,V);\n#endif\ndA*=dC(dv,G);\n#ifdef LIGHT_COUNT\nhighp float dD=10.0/log2(V*0.968+0.03);dD*=dD;float dE=dD*(1.0/(8.0*3.1415926))+(4.0/(8.0*3.1415926));dE=min(dE,1.0e3);\n#ifdef SHADOW_COUNT\ndF dG;\n#ifdef SKIN\n#ifdef SKIN_VERSION_1\ndH(dG,SHADOW_KERNEL+SHADOW_KERNEL*df.dI);\n#else\ndJ dK;float dL=SHADOW_KERNEL+SHADOW_KERNEL*df.dI;dM(dK,dL);dH(dG,dL);\n#endif\n#else\ndH(dG,SHADOW_KERNEL);\n#endif\n#endif\n#ifdef ANISO\ndE*=uAnisoIntegral;\n#endif\nfor(int u=0;u<LIGHT_COUNT;++u){vec3 dN=uLightPositions[u].xyz-D*uLightPositions[u].w;float dO=inversesqrt(dot(dN,dN));dN*=dO;float a=saturate(uLightParams[u].z/dO);a=1.0+a*(uLightParams[u].x+uLightParams[u].y*a);float s=saturate(dot(dN,uLightDirections[u]));s=saturate(uLightSpot[u].y-uLightSpot[u].z*(1.0-s*s));vec3 dP=(a*s)*uLightColors[u].xyz;\n#if defined(SKIN)\n#ifdef SHADOW_COUNT\n#ifdef SKIN_VERSION_1\ndQ(df,dG.dR[u],1.0,dN,N,dP);\n#else\ndQ(df,dG.dR[u],dK.dK[u],dN,N,dP);\n#endif\n#else\ndQ(df,1.0,0.0,dN,N,dP);\n#endif\n#elif defined(MICROFIBER)\n#ifdef SHADOW_COUNT\ndS(dk,dG.dR[u],dN,N,dP);\n#else\ndS(dk,1.0,dN,N,dP);\n#endif\n#else\nfloat dT=saturate((1.0/3.1415926)*dot(dN,N));\n#ifdef SHADOW_COUNT\ndT*=dG.dR[u];\n#endif\ndn+=dT*dP;\n#endif\nvec3 dU=dN+T;\n#ifdef ANISO\ndU=dU-(S*dot(dU,P));\n#endif\ndU=normalize(dU);float dV=dE*pow(saturate(dot(dU,N)),dD);\n#ifdef SHADOW_COUNT\ndV*=dG.dR[u];\n#endif\ndA+=dV*dP;}\n#endif\n#if defined(SKIN)\nvec3 dn,diff_extra;dW(dn,diff_extra,df,T,N,V);\n#elif defined(MICROFIBER)\nvec3 dn,diff_extra;dX(dn,diff_extra,dk,T,N,V);\n#endif\ndA*=dY(T,N,U,V*V);\n#ifdef DIFFUSE_UNLIT\ngl_FragColor.xyz=K+dA;\n#else\ngl_FragColor.xyz=dn*K+dA;\n#endif\n#if defined(SKIN) || defined(MICROFIBER)\ngl_FragColor.xyz+=diff_extra;\n#endif\n#ifdef EMISSIVE\n#ifdef EMISSIVE_SECONDARY_UV\nvec2 dZ=I;\n#else\nvec2 dZ=j;\n#endif\ngl_FragColor.xyz+=uEmissiveScale*L(R(dZ,uTexRangeEmissive).xyz);\n#endif\n#ifdef STRIPVIEW\ngl_FragColor.xyz=ec(Z,N,K,U,W,dn,dA,gl_FragColor.xyz);\n#endif\n#ifdef NOBLEND\ngl_FragColor.w=1.0;\n#else\ngl_FragColor.w=k;\n#endif\n}",
            "matlighting.glsl": "vec3 ed(vec3 ee,float ef){return exp(-0.5*ef/(ee*ee))/(ee*2.5066283);}vec3 eh(vec3 ee){return vec3(1.0,1.0,1.0)/(ee*2.5066283);}vec3 ei(vec3 ej){return vec3(-0.5,-0.5,-0.5)/(ej);}vec3 ek(vec3 el,float ef){return exp(el*ef);}\n#define SAMPLE_COUNT 21.0\n#define SAMPLE_HALF 10.0\n#define GAUSS_SPREAD 0.05\nvec3 em(float en,float eo,vec3 eu){vec3 ev=vec3(eo,eo,eo);ev=0.8*ev+vec3(0.2);vec3 eA=cos(ev*3.14159);vec3 eB=cos(ev*3.14159*0.5);eB*=eB;eB*=eB;eB*=eB;ev=ev+0.05*eA*eB*eu;eB*=eB;eB*=eB;eB*=eB;ev=ev+0.1*eA*eB*eu;ev=saturate(ev);ev*=ev*1.2;return ev;}vec3 eC(vec3 eu){return vec3(1.0,1.0,1.0)/3.1415926;}float eD(float en,float eu){return saturate(-en*eu+en+eu);}vec3 eE(float en,vec3 eu){return saturate(-en*eu+vec3(en)+eu);}float eF(float eu){return-0.31830988618379*eu+0.31830988618379;}vec3 eG(vec3 eu){return-0.31830988618379*eu+vec3(0.31830988618379);}vec3 dY(vec3 T,vec3 N,vec3 U,float eH){float eI=1.0-saturate(dot(T,N));float eJ=eI*eI;eI*=eJ*eJ;eI*=eH;return(U-eI*U)+eI*uFresnel;}vec2 eK(vec2 eL,vec2 eu){eL=1.0-eL;vec2 eM=eL*eL;eM*=eM;eL=mix(eM,eL*0.4,eu);return eL;}vec3 du(vec3 eN){\n#define c(n) uDiffuseCoefficients[n].xyz\nvec3 C=(c(0)+eN.y*((c(1)+c(4)*eN.x)+c(5)*eN.z))+eN.x*(c(3)+c(7)*eN.z)+c(2)*eN.z;\n#undef c\nvec3 sqr=eN*eN;C+=uDiffuseCoefficients[6].xyz*(3.0*sqr.z-1.0);C+=uDiffuseCoefficients[8].xyz*(sqr.x-sqr.y);return C;}void eO(inout vec3 eP,inout vec3 eQ,inout vec3 eR,vec3 eN){eP=uDiffuseCoefficients[0].xyz;eQ=uDiffuseCoefficients[1].xyz*eN.y;eQ+=uDiffuseCoefficients[2].xyz*eN.z;eQ+=uDiffuseCoefficients[3].xyz*eN.x;vec3 swz=eN.yyz*eN.xzx;eR=uDiffuseCoefficients[4].xyz*swz.x;eR+=uDiffuseCoefficients[5].xyz*swz.y;eR+=uDiffuseCoefficients[7].xyz*swz.z;vec3 sqr=eN*eN;eR+=uDiffuseCoefficients[6].xyz*(3.0*sqr.z-1.0);eR+=uDiffuseCoefficients[8].xyz*(sqr.x-sqr.y);}vec3 eS(vec3 eP,vec3 eQ,vec3 eR,vec3 eT,float eu){eT=mix(vec3(1.0),eT,eu);return(eP+eQ*eT.x)+eR*eT.z;}vec3 eU(vec3 eP,vec3 eQ,vec3 eR,vec3 eT,vec3 eV){vec3 eW=mix(vec3(1.0),eT.yyy,eV);vec3 eX=mix(vec3(1.0),eT.zzz,eV);return(eP+eQ*eW)+eR*eX;}vec3 dB(vec3 eN,float V){eN/=dot(vec3(1.0),abs(eN));vec2 eY=abs(eN.zx)-vec2(1.0,1.0);vec2 eZ=vec2(eN.x<0.0?eY.x:-eY.x,eN.z<0.0?eY.y:-eY.y);vec2 fc=(eN.y<0.0)?eZ:eN.xz;fc=vec2(0.5*(254.0/256.0),0.125*0.5*(254.0/256.0))*fc+vec2(0.5,0.125*0.5);float fd=fract(7.0*V);fc.y+=0.125*(7.0*V-fd);vec2 fe=fc+vec2(0.0,0.125);vec4 ff=mix(texture2D(tSkySpecular,fc),texture2D(tSkySpecular,fe),fd);vec3 r=ff.xyz*(7.0*ff.w);return r*r;}float dC(vec3 eN,vec3 fh){float fi=dot(eN,fh);fi=saturate(1.0+uHorizonOcclude*fi);return fi*fi;}",
            "matmicrofiber.glsl": "\n#ifdef MICROFIBER\nuniform vec4 uTexRangeFuzz;uniform float uFresnelIntegral;uniform vec4 uFresnelColor;uniform float uFresnelOcc;uniform float uFresnelGlossMask;struct dj{vec3 dm;vec3 dT;vec3 fj;vec3 fk;vec3 fl;};void dl(out dj s,vec3 N){s.dm=s.dT=du(N);s.fj=vec3(0.0);s.fk=uFresnelColor.rgb;s.fl=uFresnelColor.aaa*vec3(1.0,0.5,0.25);\n#ifndef MICROFIBER_NO_FUZZ_TEX\nvec4 J=R(j,uTexRangeFuzz);s.fk*=L(J.rgb);\n#endif\n}void dS(inout dj s,float fm,vec3 dN,vec3 N,vec3 dP){float en=dot(dN,N);float dT=saturate((1.0/3.1415926)*en);float fn=eD(en,s.fl.z);\n#ifdef SHADOW_COUNT\ndT*=fm;float fo=mix(1.0,fm,uFresnelOcc);float fj=fn*fo;\n#else \nfloat fj=fn;\n#endif\ns.fj=fj*dP+s.fj;s.dT=dT*dP+s.dT;}void dX(out vec3 dn,out vec3 diff_extra,inout dj s,vec3 T,vec3 N,float V){s.fj*=uFresnelIntegral;float eL=dot(T,N);vec2 fu=eK(vec2(eL,eL),s.fl.xy);s.fj=s.dm*fu.x+(s.fj*fu.y);s.fj*=s.fk;float fv=saturate(1.0+-uFresnelGlossMask*V);s.fj*=fv*fv;dn=s.dT;diff_extra=s.fj;}\n#endif\n",
            "matsampling.glsl": "vec3 L(vec3 c){return c*c;}vec3 O(vec3 n){vec3 fA=E;vec3 fB=F;vec3 fC=gl_FrontFacing?G:-G;\n#ifdef TSPACE_RENORMALIZE\nfC=normalize(fC);\n#endif\n#ifdef TSPACE_ORTHOGONALIZE\nfA-=dot(fA,fC)*fC;\n#endif\n#ifdef TSPACE_RENORMALIZE\nfA=normalize(fA);\n#endif\n#ifdef TSPACE_ORTHOGONALIZE\nfB=(fB-dot(fB,fC)*fC)-dot(fB,fA)*fA;\n#endif\n#ifdef TSPACE_RENORMALIZE\nfB=normalize(fB);\n#endif\n#ifdef TSPACE_COMPUTE_BITANGENT\nvec3 fD=cross(fC,fA);fB=dot(fD,fB)<0.0?-fD:fD;\n#endif\nn=2.0*n-vec3(1.0);return normalize(fA*n.x+fB*n.y+fC*n.z);}vec3 Q(vec3 t){vec3 fC=gl_FrontFacing?G:-G;return normalize(E*t.x+F*t.y+fC*t.z);}vec4 R(vec2 fE,vec4 fF){\n#if GL_OES_standard_derivatives\nvec2 fG=fract(fE);vec2 fH=fwidth(fG);float fI=(fH.x+fH.y)>0.5?-6.0:0.0;return texture2D(tExtras,fG*fF.xy+fF.zw,fI);\n#else\nreturn texture2D(tExtras,fract(fE)*fF.xy+fF.zw);\n#endif\n}vec3 fJ(sampler2D fK,vec2 fL,float fM){vec3 n=texture2D(fK,fL,fM*2.5).xyz;return O(n);}",
            "matshadows.glsl": "\n#ifdef SHADOW_COUNT\n#ifdef MOBILE\n#define SHADOW_KERNEL (4.0/1536.0)\n#else\n#define SHADOW_KERNEL (4.0/2048.0)\n#endif\nhighp vec4 m(highp mat4 o,highp vec3 p){return o[0]*p.x+(o[1]*p.y+(o[2]*p.z+o[3]));}uniform sampler2D tDepth0;\n#if SHADOW_COUNT > 1\nuniform sampler2D tDepth1;\n#if SHADOW_COUNT > 2\nuniform sampler2D tDepth2;\n#endif\n#endif\nuniform highp vec2 uShadowKernelRotation;uniform highp vec4 uShadowMapSize;uniform highp mat4 uShadowMatrices[SHADOW_COUNT];uniform highp mat4 uInvShadowMatrices[SHADOW_COUNT];uniform highp vec4 uShadowTexelPadProjections[SHADOW_COUNT];highp float fN(highp vec3 C){return(C.x+C.y*(1.0/255.0))+C.z*(1.0/65025.0);}float fO(sampler2D fP,highp vec2 fE,highp float fQ){\n#ifndef MOBILE\nhighp vec2 c=fE*uShadowMapSize.xy;highp vec2 a=floor(c)*uShadowMapSize.zw,b=ceil(c)*uShadowMapSize.zw;highp vec4 dK;dK.x=fN(texture2D(fP,a).xyz);dK.y=fN(texture2D(fP,vec2(b.x,a.y)).xyz);dK.z=fN(texture2D(fP,vec2(a.x,b.y)).xyz);dK.w=fN(texture2D(fP,b).xyz);highp vec4 fR;fR.x=fQ<dK.x?1.0:0.0;fR.y=fQ<dK.y?1.0:0.0;fR.z=fQ<dK.z?1.0:0.0;fR.w=fQ<dK.w?1.0:0.0;highp vec2 w=c-a*uShadowMapSize.xy;vec2 s=(w.y*fR.zw+fR.xy)-w.y*fR.xy;return(w.x*s.y+s.x)-w.x*s.x;\n#else\nhighp float C=fN(texture2D(fP,fE.xy).xyz);return fQ<C?1.0:0.0;\n#endif\n}highp float fS(sampler2D fP,highp vec3 fE,float fT){highp vec2 v=uShadowKernelRotation*fT;float s;s=fO(fP,fE.xy+v,fE.z);s+=fO(fP,fE.xy-v,fE.z);s+=fO(fP,fE.xy+vec2(-v.y,v.x),fE.z);s+=fO(fP,fE.xy+vec2(v.y,-v.x),fE.z);s*=0.25;return s*s;}struct dF{float dR[LIGHT_COUNT];};void dH(out dF ss,float fT){highp vec3 fU[SHADOW_COUNT];vec3 fC=gl_FrontFacing?G:-G;for(int u=0;u<SHADOW_COUNT;++u){vec4 fV=uShadowTexelPadProjections[u];float fW=fV.x*D.x+(fV.y*D.y+(fV.z*D.z+fV.w));\n#ifdef MOBILE\nfW*=.001+fT;\n#else\nfW*=.0005+0.5*fT;\n#endif\nhighp vec4 fX=m(uShadowMatrices[u],D+fW*fC);fU[u]=fX.xyz/fX.w;}float J;\n#if SHADOW_COUNT > 0\nJ=fS(tDepth0,fU[0],fT);ss.dR[0]=J;\n#endif\n#if SHADOW_COUNT > 1\nJ=fS(tDepth1,fU[1],fT);ss.dR[1]=J;\n#endif\n#if SHADOW_COUNT > 2\nJ=fS(tDepth2,fU[2],fT);ss.dR[2]=J;\n#endif\nfor(int u=SHADOW_COUNT;u<LIGHT_COUNT;++u){ss.dR[u]=1.0;}}struct dJ{highp float dK[LIGHT_COUNT];};highp vec4 fY(sampler2D fP,highp vec2 fE,highp mat4 fZ){highp vec4 hc;hc.xy=fE;\n#ifndef MOBILE\nhighp vec2 c=fE*uShadowMapSize.xy;highp vec2 a=floor(c)*uShadowMapSize.zw,b=ceil(c)*uShadowMapSize.zw;highp vec4 fR;fR.x=fN(texture2D(fP,a).xyz);fR.y=fN(texture2D(fP,vec2(b.x,a.y)).xyz);fR.z=fN(texture2D(fP,vec2(a.x,b.y)).xyz);fR.w=fN(texture2D(fP,b).xyz);highp vec2 w=c-a*uShadowMapSize.xy;vec2 s=(w.y*fR.zw+fR.xy)-w.y*fR.xy;hc.z=(w.x*s.y+s.x)-w.x*s.x;\n#else \nhc.z=fN(texture2D(fP,fE.xy).xyz);\n#endif\nhc=m(fZ,hc.xyz);hc.xyz/=hc.w;return hc;}void dM(out dJ ss,float fT){highp vec3 hd[SHADOW_COUNT];vec3 fC=gl_FrontFacing?G:-G;fC*=0.6;for(int u=0;u<SHADOW_COUNT;++u){vec4 fV=uShadowTexelPadProjections[u];float fW=fV.x*D.x+(fV.y*D.y+(fV.z*D.z+fV.w));\n#ifdef MOBILE\nfW*=.001+fT;\n#else\nfW*=.0005+0.5*fT;\n#endif\nhighp vec4 fX=m(uShadowMatrices[u],D-fW*fC);hd[u]=fX.xyz/fX.w;}highp vec4 he;\n#if SHADOW_COUNT > 0\nhe=fY(tDepth0,hd[0].xy,uInvShadowMatrices[0]);ss.dK[0]=length(D.xyz-he.xyz);\n#endif\n#if SHADOW_COUNT > 1\nhe=fY(tDepth1,hd[1].xy,uInvShadowMatrices[1]);ss.dK[1]=length(D.xyz-he.xyz);\n#endif\n#if SHADOW_COUNT > 2\nhe=fY(tDepth2,hd[2].xy,uInvShadowMatrices[2]);ss.dK[2]=length(D.xyz-he.xyz);\n#endif\nfor(int u=SHADOW_COUNT;u<LIGHT_COUNT;++u){ss.dK[u]=1.0;}}\n#endif\n",
            "matskin.glsl": "\n#ifdef SKIN\nuniform vec4 uTexRangeSubdermis;uniform vec4 uTexRangeTranslucency;uniform vec4 uTexRangeFuzz;uniform vec3 uSubdermisColor;uniform vec4 uTransColor;uniform float uTransScatter;uniform vec4 uFresnelColor;uniform float uFresnelOcc;uniform float uFresnelGlossMask;uniform float uTransSky;uniform float uFresnelIntegral;uniform float uTransIntegral;uniform float uSkinTransDepth;uniform float uSkinShadowBlur;uniform float uNormalSmooth;struct de{vec3 hf;vec3 hh,hi,hj,fj;vec3 di,dm,hk;vec3 hl;vec3 hm;vec3 hn;vec3 ho;float hu;float hv;float hA;float dI;};void dh(out de s){vec4 J;\n#ifdef SKIN_NO_SUBDERMIS_TEX\ns.hf=uSubdermisColor;s.hA=1.0;\n#else \nJ=R(j,uTexRangeSubdermis);s.hf=L(J.xyz);s.hA=J.w*J.w;\n#endif\ns.ho=uTransColor.rgb;s.hu=uTransScatter;\n#ifdef SKIN_VERSION_1\ns.dI=uSkinShadowBlur*s.hA;\n#else \ns.hv=max(max(s.ho.r,s.ho.g),s.ho.b)*uTransColor.a;float hB=max(s.hf.r,max(s.hf.g,s.hf.b));hB=1.0-hB;hB*=hB;hB*=hB;hB*=hB;hB=1.0-(hB*hB);s.hA*=hB;s.dI=uSkinShadowBlur*s.hA*dot(s.hf.rgb,vec3(0.333,0.334,0.333));\n#endif\n#ifndef SKIN_NO_TRANSLUCENCY_TEX\nJ=R(j,uTexRangeTranslucency);s.ho*=L(J.xyz);\n#endif\ns.hl=fJ(tNormal,j,uNormalSmooth*s.hA);vec3 hC,hD,hE;eO(hC,hD,hE,s.hl);s.dm=s.hh=hC+hD+hE;\n#ifdef SKIN_VERSION_1 \ns.di=eU(hC,hD,hE,vec3(1.0,0.6667,0.25),s.hf);\n#else\ns.di=eU(hC,hD,hE,vec3(1.0,0.6667,0.25),s.hf*0.2+vec3(0.1));\n#endif\n#ifdef SKIN_VERSION_1\nvec3 hF,hG,hH;eO(hF,hG,hH,-s.hl);s.hk=eS(hF,hG,hH,vec3(1.0,0.4444,0.0625),s.hu);s.hk*=uTransSky;\n#else \ns.hk=vec3(0.0);\n#endif\ns.hi=s.hj=s.fj=vec3(0.0);s.hf*=0.5;s.hu*=0.5;s.hm=uFresnelColor.rgb;s.hn=uFresnelColor.aaa*vec3(1.0,0.5,0.25);\n#ifndef SKIN_NO_FUZZ_TEX\nJ=R(j,uTexRangeFuzz);s.hm*=L(J.rgb);\n#endif\n}void dQ(inout de s,float hI,float hJ,vec3 dN,vec3 N,vec3 dP){float en=dot(dN,N);float eo=dot(dN,s.hl);float dT=saturate((1.0/3.1415926)*en);float fm=hI*hI;fm*=fm;fm=saturate(6.0*fm);\n#ifdef SKIN_VERSION_1 \nvec3 hK=eE(eo,s.hf);\n#else \nvec3 hK=em(en,eo,s.hf);\n#endif\nfloat hL=eD(-eo,s.hu);vec3 hj=vec3(hL*hL);\n#ifdef SKIN_VERSION_1\n#ifdef SHADOW_COUNT\nvec3 hM=vec3(hI);float hN=saturate(fm-2.0*(hI*hI));hM+=hN*s.hf;float hO=hI;\n#endif\n#else\n#ifdef SHADOW_COUNT\nvec3 hM;highp vec3 hP=(0.995*s.hf)+vec3(0.005,0.005,0.005);highp vec3 hQ=vec3(1.0)-hP;hP=mix(hP,hQ,hI);float hR=sqrt(hI);vec3 hS=2.0*vec3(1.0-hR);hR=1.0-hR;hR=(1.0-hR*hR);hM=saturate(pow(hP*hR,hS));highp float hT=0.35/(uSkinTransDepth+0.001);highp float hU=saturate(hJ*hT);hU=saturate(1.0-hU);hU*=hU;highp vec3 hV=vec3((-3.0*hU)+3.15);highp vec3 hW=(0.9975*s.ho)+vec3(0.0025,0.0025,0.0025);highp float hB=saturate(10.0*dot(hW,hW));vec3 hO=pow(hW*hU,hV)*hB;\n#else \nhj=vec3(0.0);\n#endif\n#endif\nfloat fn=eD(eo,s.hn.z);\n#ifdef SHADOW_COUNT\nvec3 fo=mix(vec3(1.0),hM,uFresnelOcc);vec3 fj=fn*fo;\n#else\nvec3 fj=vec3(fn);\n#endif\n#ifdef SHADOW_COUNT\nhK*=hM;dT*=fm;hj*=hO;\n#endif\ns.fj=fj*dP+s.fj;s.hj=hj*dP+s.hj;s.hi=hK*dP+s.hi;s.hh=dT*dP+s.hh;}void dW(out vec3 dn,out vec3 diff_extra,inout de s,vec3 T,vec3 N,float V){s.fj*=uFresnelIntegral;float eL=dot(T,N);vec2 fu=eK(vec2(eL,eL),s.hn.xy);s.fj=s.dm*fu.x+(s.fj*fu.y);s.fj*=s.hm;float fv=saturate(1.0+-uFresnelGlossMask*V);s.fj*=fv*fv;s.hj=s.hj*uTransIntegral;\n#ifdef SKIN_VERSION_1\ns.hi=(s.hi*eG(s.hf))+s.di;\n#else\ns.hi=(s.hi*eC(s.hf))+s.di;\n#endif\ndn=mix(s.hh,s.hi,s.hA);\n#ifdef SKIN_VERSION_1\ns.hj=(s.hj+s.hk)*s.ho;diff_extra=(s.fj+s.hj)*s.hA;\n#else\ndn+=s.hj*s.hv;diff_extra=s.fj*s.hA;\n#endif\n}\n#endif\n",
            "matstrips.glsl": "\n#ifdef STRIPVIEW\nuniform float uStrips[5];uniform vec2 uStripRes;struct Y{float hB[5];float bg;};void dc(out Y hX,inout float V,inout vec3 U){highp vec2 fE=gl_FragCoord.xy*uStripRes-vec2(1.0,1.0);fE.x+=0.25*fE.y;hX.hB[0]=step(fE.x,uStrips[0]);hX.hB[1]=step(fE.x,uStrips[1]);hX.hB[2]=step(fE.x,uStrips[2]);hX.hB[3]=step(fE.x,uStrips[3]);hX.hB[4]=step(fE.x,uStrips[4]);hX.bg=1.0-hX.hB[4];hX.hB[4]-=hX.hB[3];hX.hB[3]-=hX.hB[2];hX.hB[2]-=hX.hB[1];hX.hB[1]-=hX.hB[0];bool hY=hX.hB[4]>0.0;V=hY?0.5:V;U=hY?vec3(0.1):U;}vec3 ec(Y hX,vec3 N,vec3 K,vec3 U,float V,vec3 dn,vec3 dA,vec3 hZ){return hX.hB[0]*(N*0.5+vec3(0.5))+hX.hB[1]*K+hX.hB[2]*U+vec3(hX.hB[3]*V)+hX.hB[4]*(vec3(0.12)+0.3*dn+dA)+hX.bg*hZ;}\n#endif\n",
            "matvert.glsl": "precision highp float;uniform mat4 uModelViewProjectionMatrix;uniform mat4 uSkyMatrix;attribute vec3 vPosition;attribute vec2 vTexCoord;attribute vec2 vTangent;attribute vec2 vBitangent;attribute vec2 vNormal;\n#ifdef VERTEX_COLOR\nattribute vec4 vColor;\n#endif\n#ifdef TEXCOORD_SECONDARY\nattribute vec2 vTexCoord2;\n#endif\nvarying highp vec3 D;varying mediump vec2 j;varying mediump vec3 E;varying mediump vec3 F;varying mediump vec3 G;\n#ifdef VERTEX_COLOR\nvarying lowp vec4 H;\n#endif\n#ifdef TEXCOORD_SECONDARY\nvarying mediump vec2 I;\n#endif\nvec3 ic(vec2 id){bool ie=(id.y>(32767.1/65535.0));id.y=ie?(id.y-(32768.0/65535.0)):id.y;vec3 r;r.xy=(2.0*65535.0/32767.0)*id-vec2(1.0);r.z=sqrt(clamp(1.0-dot(r.xy,r.xy),0.0,1.0));r.z=ie?-r.z:r.z;return r;}vec4 m(mat4 o,vec3 p){return o[0]*p.x+(o[1]*p.y+(o[2]*p.z+o[3]));}vec3 ih(mat4 o,vec3 id){return o[0].xyz*id.x+o[1].xyz*id.y+o[2].xyz*id.z;}void main(void){gl_Position=m(uModelViewProjectionMatrix,vPosition.xyz);j=vTexCoord;E=ih(uSkyMatrix,ic(vTangent));F=ih(uSkyMatrix,ic(vBitangent));G=ih(uSkyMatrix,ic(vNormal));D=m(uSkyMatrix,vPosition.xyz).xyz;\n#ifdef VERTEX_COLOR\nH=vColor;\n#endif\n#ifdef TEXCOORD_SECONDARY\nI=vTexCoord2;\n#endif\n}",
            "postfrag.glsl": "precision mediump float;uniform sampler2D tInput;\n#ifdef BLOOM\nuniform sampler2D tBloom;\n#endif\n#ifdef GRAIN\nuniform sampler2D tGrain;\n#endif\n#ifdef COLOR_LUT\nuniform sampler2D tLUT;\n#endif\nuniform vec3 uScale;uniform vec3 uBias;uniform vec3 uSaturation;uniform vec4 uSharpenKernel;uniform vec3 uSharpness;uniform vec3 uBloomColor;uniform vec4 uVignetteAspect;uniform vec4 uVignette;uniform vec4 uGrainCoord;uniform vec2 uGrainScaleBias;varying vec2 d;vec3 ii(vec3 c){vec3 ij=sqrt(c);return(ij-ij*c)+c*(0.4672*c+vec3(0.5328));}void main(void){vec4 ik=texture2D(tInput,d);vec3 c=ik.xyz;\n#ifdef SHARPEN\nvec3 fR=texture2D(tInput,d+uSharpenKernel.xy).xyz;fR+=texture2D(tInput,d-uSharpenKernel.xy).xyz;fR+=texture2D(tInput,d+uSharpenKernel.zw).xyz;fR+=texture2D(tInput,d-uSharpenKernel.zw).xyz;vec3 il=uSharpness.x*c-uSharpness.y*fR;c+=clamp(il,-uSharpness.z,uSharpness.z);\n#endif\n#ifdef BLOOM\nc+=uBloomColor*texture2D(tBloom,d).xyz;\n#endif\n#ifdef VIGNETTE\nvec2 im=d*uVignetteAspect.xy-uVignetteAspect.zw;vec3 id=clamp(vec3(1.0,1.0,1.0)-uVignette.xyz*dot(im,im),0.0,1.0);vec3 io=id*id;io*=id;c*=mix(id,io,uVignette.w);\n#endif\n#ifdef SATURATION\nfloat gray=dot(c,vec3(0.3,0.59,0.11));c=mix(vec3(gray,gray,gray),c,uSaturation);\n#endif\n#ifdef CONTRAST\nc=c*uScale+uBias;\n#endif\n#ifdef GRAIN\nfloat iu=uGrainScaleBias.x*texture2D(tGrain,d*uGrainCoord.xy+uGrainCoord.zw).x+uGrainScaleBias.y;c+=c*iu;\n#endif\n#ifdef REINHARD\n{c*=1.8;float iv=dot(c,vec3(0.3333));c=clamp(c/(1.0+iv),0.0,1.0);}\n#elif defined(HEJL)\n{const highp float iA=0.22,iB=0.3,iC=.1,iD=0.2,iE=.01,iF=0.3;const highp float iG=1.25;highp vec3 dU=max(vec3(0.0),c-vec3(.004));c=(dU*((iG*iA)*dU+iG*vec3(iC*iB,iC*iB,iC*iB))+iG*vec3(iD*iE,iD*iE,iD*iE))/(dU*(iA*dU+vec3(iB,iB,iB))+vec3(iD*iF,iD*iF,iD*iF))-iG*vec3(iE/iF,iE/iF,iE/iF);}\n#endif\n#ifdef COLOR_LUT\nc=clamp(c,0.0,1.0);c=(255.0/256.0)*c+vec3(0.5/256.0);c.x=texture2D(tLUT,c.xx).x;c.y=texture2D(tLUT,c.yy).y;c.z=texture2D(tLUT,c.zz).z;c*=c;\n#endif\ngl_FragColor.xyz=ii(c);gl_FragColor.w=ik.w;}",
            "postvert.glsl": "precision highp float;attribute vec2 vCoord;varying vec2 d;void main(void){d=vCoord;gl_Position.xy=2.0*vCoord-vec2(1.0,1.0);gl_Position.zw=vec2(0.0,1.0);}",
            "shadowfrag.glsl": "precision highp float;varying vec2 iH;\n#ifdef ALPHA_TEST\nvarying mediump vec2 j;uniform sampler2D tAlbedo;\n#endif\nvec3 iI(float id){vec4 iJ=vec4(1.0,255.0,65025.0,16581375.0)*id;iJ=fract(iJ);iJ.xyz-=iJ.yzw*(1.0/255.0);return iJ.xyz;}void main(void){\n#ifdef ALPHA_TEST\nfloat k=texture2D(tAlbedo,j).a;if(k<0.5){discard;}\n#endif\ngl_FragColor.xyz=iI((iH.x/iH.y)*0.5+0.5);gl_FragColor.w=0.0;}",
            "shadowvert.glsl": "precision highp float;attribute vec3 vPosition;attribute vec2 vTexCoord;uniform mat4 uViewProjection;varying vec2 iH;\n#ifdef ALPHA_TEST\nvarying mediump vec2 j;\n#endif\nvec4 m(mat4 o,vec3 p){return o[0]*p.x+(o[1]*p.y+(o[2]*p.z+o[3]));}void main(void){gl_Position=m(uViewProjection,vPosition);iH=gl_Position.zw;\n#ifdef ALPHA_TEST\nj=vTexCoord;\n#endif\n}",
            "sky.glsl": "precision highp float;uniform sampler2D tSkyTexture;uniform float uAlpha;varying vec2 j;void main(void){vec3 r=texture2D(tSkyTexture,j).xyz;gl_FragColor.xyz=r*r;gl_FragColor.w=uAlpha;}",
            "skySH.glsl": "precision mediump float;uniform vec4 uSkyCoefficients[9];uniform float uAlpha;varying vec3 iK;void main(void){vec3 C=normalize(iK);vec3 r=uSkyCoefficients[0].xyz;r+=uSkyCoefficients[1].xyz*C.y;r+=uSkyCoefficients[2].xyz*C.z;r+=uSkyCoefficients[3].xyz*C.x;vec3 swz=C.yyz*C.xzx;r+=uSkyCoefficients[4].xyz*swz.x;r+=uSkyCoefficients[5].xyz*swz.y;r+=uSkyCoefficients[7].xyz*swz.z;vec3 sqr=C*C;r+=uSkyCoefficients[6].xyz*(3.0*sqr.z-1.0);r+=uSkyCoefficients[8].xyz*(sqr.x-sqr.y);gl_FragColor.xyz=r;gl_FragColor.w=uAlpha;}",
            "skyvert.glsl": "precision highp float;uniform mat4 uInverseSkyMatrix;uniform mat4 uViewProjection;attribute vec3 vPosition;attribute vec2 vTexCoord;\n#if SKYMODE == 3\nvarying vec3 iK;\n#else\nvarying vec2 j;\n#endif\nvec4 m(mat4 o,vec3 p){return o[0]*p.x+(o[1]*p.y+(o[2]*p.z+o[3]));}vec4 ih(mat4 o,vec3 id){return o[0]*id.x+o[1]*id.y+o[2]*id.z;}void main(void){vec3 p=m(uInverseSkyMatrix,vPosition).xyz;gl_Position=ih(uViewProjection,p);gl_Position.z-=(1.0/65535.0)*gl_Position.w;\n#if SKYMODE == 3\niK=vPosition;iK.xy+=1e-20*vTexCoord;\n#else\nj=vTexCoord;\n#endif\n}",
            "wirefrag.glsl": "precision highp float;uniform vec4 uStripParams;void main(void){vec2 c=gl_FragCoord.xy*uStripParams.xy-vec2(1.0,1.0);c.x+=0.25*c.y;float a=c.x<uStripParams.z?0.0:0.9;a=c.x<uStripParams.w?a:0.0;gl_FragColor=vec4(0.0,0.0,0.0,a);}",
            "wirevert.glsl": "precision highp float;uniform mat4 uModelViewProjectionMatrix;attribute vec3 vPosition;vec4 m(mat4 o,vec3 p){return o[0]*p.x+(o[1]*p.y+(o[2]*p.z+o[3]));}void main(void){gl_Position=m(uModelViewProjectionMatrix,vPosition);gl_Position.z+=-0.00005*gl_Position.w;}",
            nil: ""
        };
})(marmoset);