// Accessible Semantic SCSS / Vanilla Number Input Knob / Potentiometer
// Created: 2020.10.11, 10:20h
// Modified: 2022.06.16, 08:01h

(function (W, D) {
    var ks = D.querySelectorAll('.knob input'),
        keys = {
            left: 37,
            right: 39,
            add: 107,
            sub: 109,
            home: 36,
            end: 35,
            space: 32,
            return: 13,
            esc: 27,
        },
        path = '<path d="M20,76 A 40 40 0 1 1 80 76"/>', // 184 svg units for full stroke
        curY = 0,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        moving = false,
        hasPE = W.PointerEvent;
    [].forEach.call(ks, function (k) {
        knob.call(k);
    });
    function knob() {
        var k = this,
            id = k.id || k.name,
            fls = k.parentElement,
            lbl = fls.querySelector('[for="' + id + '"]'),
            min = k.min ? parseFloat(k.min) : 0,
            max = k.max ? parseFloat(k.max) : 100,
            dif = Math.abs(min) + Math.abs(max),
            stp = k.step ? parseFloat(k.step) : dif / 10,
            val = k.value ? parseFloat(k.value) : dif / 2,
            ind = fls.querySelector('svg path:last-of-type'),
            frm = k.form ? k.form : fls.parentElement,
            lgd = k.form.querySelector('legend'),
            bal =
                Math.abs(min) - Math.abs(max) === 0 ||
                fls.className.match('knob-balance');
        // Fix missin properties, svg indicator & decimal
        // separator ( ',' to '.' -> ua lang dependant) ?
        frm.lang = 'en';
        k.value = val;
        k.step = stp;
        k.setAttribute('autocomplete', 'off');
        if (bal && !fls.className.match('knob-balance'))
            fls.className += ' knob-balance';
        if (lbl)
            lbl.onclick = function (e) {
                e.preventDefault();
            };
        if (!ind) ind = svg();
        if (lgd) {
            lgd.setAttribute('tabindex', 0);
            lgd.onclick = function () {
                toggleGroup(frm);
            };
            lgd.onkeydown = legendkeys;
        }
        // Event listener
        k.addEventListener('input', input, false);
        k.onkeydown = knobkeys;
        fls.ondblclick = dblclick;
        fls.addEventListener('wheel', wheel, false); // No attribute, because IE
        hasPE ? (fls.onpointerdown = start) : (fls.onmousedown = start); // Overwrite
        ind.onclick = click;
        ind.previousElementSibling.onclick = click;
        input();
        // Private methods
        function input() {
            val = k.value.trim();
            if (val > max) k.value = max;
            else if (val < min) k.value = min;
            else if (val === '') k.value = min;
            var per = (k.value / dif) * 100,
                deg = 0;
            if (bal) {
                // Balance number input
                deg = per * 1.32 * 2;
                var len = Math.abs(per) * 1.84;
                var drr =
                    per > 0
                        ? '87 10 0 ' + len + ' ' + (87 - len)
                        : 87 - len + ' ' + len + ' 0 10 87';
                ind.style.setProperty('stroke-dasharray', drr);
                fls.style.setProperty('--knob-deg', deg);
            } else {
                // Normal number input
                if (per >= 0 && per <= 100 && per != 50)
                    deg = per * 1.32 * 2 - 132;
                ind.style.setProperty('stroke-dashoffset', -per * 1.84 + '%');
                fls.style.setProperty('--knob-deg', deg);
            }
        }
        function click(e) {
            if (k.disabled || k.readonly) return;
            var b = this.parentElement.getBoundingClientRect(),
                c = { x: b.width / 2, y: b.height / 2 },
                p2 = { x: e.pageX - b.left, y: e.pageY - b.top },
                p1 = { x: 0, y: b.height }; // stroke-width 8 of path ?
            var rad = angle(p1, c, p2);
            var deg = rad * (180 / Math.PI);
            if (p2.x > b.width / 2 && deg < 180) deg = 360 - deg;
            // console.log(parseInt(deg,10) +'°', (dif/270)*deg);
            k.value = parseInt((dif / 270) * deg);
            k.dispatchEvent(new Event('input'));
        }
        function dblclick() {
            if (k.disabled || k.readonly) return;
            var cache = k.hasAttribute('data-cache');
            if (cache) {
                k.value = k.getAttribute('data-cache');
                k.removeAttribute('data-cache');
            } else {
                k.setAttribute('data-cache', k.value);
                k.value = bal ? 0 : k.defaultValue;
            }
            k.dispatchEvent(new Event('input'));
        }
        function start(e) {
            if (k.disabled || k.readonly) return;
            moving = true;
            curY = e.pageY;
            D.addEventListener(
                hasPE ? 'pointermove' : 'mousemove',
                move,
                false,
            );
            D.addEventListener(hasPE ? 'pointerup' : 'mouseup', end, false);
        }
        function move(e) {
            if (e.pageY - curY !== 0) {
                e.pageY - curY > 0 ? k.stepUp() : k.stepDown();
                k.dispatchEvent(new Event('input'));
            }
            curY = e.pageY;
        }
        function end() {
            moving = false;
            curY = 0;
            D.removeEventListener(
                hasPE ? 'pointermove' : 'mousemove',
                move,
                false,
            );
            D.removeEventListener(hasPE ? 'pointerup' : 'mouseup', end, false);
            k.select();
        }
        function wheel(e) {
            var delta = e.deltaY;
            if (delta !== 0) {
                delta < 0 ? k.stepUp() : k.stepDown();
                k.dispatchEvent(new Event('input'));
            }
        }
        function knobkeys(e) {
            if (this !== D.activeElement) return;
            var c = e.keyCode ? e.keyCode : e.which;
            if (c === keys.left) {
                k.stepDown();
            } else if (c === keys.right) {
                k.stepUp();
            } else if (c === keys.end) {
                k.value = min;
            } else if (c === keys.home) {
                k.value = max;
            } else if (c === keys.add) {
                k.stepUp();
            } else if (c === keys.sub) {
                k.stepDown();
            } else if (c === keys.esc && lgd) {
                lgd.focus();
            }
            k.dispatchEvent(new Event('input'));
        }
        function legendkeys(e) {
            if (this !== D.activeElement) return;
            var c = e.keyCode ? e.keyCode : e.which;
            if (c === keys.space) toggleGroup(frm);
            else if (c === keys.return) toggleGroup(frm);
        }
        function svg() {
            var s = D.createElementNS('http://www.w3.org/2000/svg', 'svg');
            s.setAttribute('viewBox', '0 0 100 100');
            s.setAttribute('aria-hidden', true);
            s.innerHTML = path + path;
            fls.appendChild(s);
            return s.querySelector('path:last-of-type');
        }
        function angle(p1, c, p2) {
            // Point 1, circle center point, point 2
            var p1c = Math.sqrt(
                    Math.pow(c.x - p1.x, 2) + Math.pow(c.y - p1.y, 2),
                ),
                cp2 = Math.sqrt(
                    Math.pow(c.x - p2.x, 2) + Math.pow(c.y - p2.y, 2),
                ),
                p1p2 = Math.sqrt(
                    Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2),
                );
            return Math.acos(
                (cp2 * cp2 + p1c * p1c - p1p2 * p1p2) / (2 * cp2 * p1c),
            );
        }
        function toggleGroup(f) {
            var s = f.hasAttribute('data-status')
                    ? f.getAttribute('data-status')
                    : false,
                isD = s ? s.match('disabled') : false,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                isR = s ? s.match('readonly') : false;
            isD
                ? f.removeAttribute('data-status')
                : f.setAttribute('data-status', 'disabled');
            [].forEach.call(frm.querySelectorAll('.knob input'), function (i) {
                if (isD) {
                    i.removeAttribute('disabled');
                    i.required = true;
                    i.draggable = true;
                } else {
                    i.disabled = true;
                    i.removeAttribute('required');
                    i.removeAttribute('draggable');
                }
                if (isD) {
                    i.removeAttribute('readonly');
                    i.required = true;
                } else {
                    i.setAttribute('readonly', '');
                    i.removeAttribute('required');
                }
            });
        }
    }
})(window, document);
