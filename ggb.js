/* ==========================================================================
   猪猪侠 GG Bond · 展示站交互脚本
   功能：导航（滚动状态/进度条/锚点高亮/移动端菜单）、英雄轮播、新春倒计时、
        商品详情弹窗、滚动出现动效、回到顶部、背景音乐开关、
        系列年表筛选、名曲馆、趣味问答。
   无任何外部依赖，纯原生实现。
   ========================================================================== */
(function () {
    'use strict';

    /* 通知内联脚本：js 已正常加载，滚动出现动效可以放心使用 */
    window.__ggbRevealReady = true;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
    var $$ = function (sel, ctx) {
        return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
    };

    /* ======================================================================
       数据区：英雄与商品
       ====================================================================== */
    var HEROES = [
        { name: '猪猪侠', desc: '勇敢无畏的超级英雄', color: '#ff2d2d', href: 'https://baike.baidu.com/item/猪猪侠/9565890' },
        { name: '小呆呆', desc: '憨厚可爱的最佳伙伴', color: '#1fef04', href: 'https://baike.baidu.com/item/小呆呆' },
        { name: '超人强', desc: '力量与速度的化身', color: '#0462ef', href: 'https://baike.baidu.com/item/超人强/9631566' },
        { name: '波比', desc: '机智冷静的战术家', color: '#25cece', href: 'https://baike.baidu.com/item/波比/17179774' },
        { name: '小菲菲', desc: '温柔而坚定的守护者', color: '#ca6060', href: 'https://baike.baidu.com/item/菲菲/8639357' }
    ];

    var PRODUCTS = [
        {
            name: '超级棒棒糖',
            desc: '拥有神奇的力量',
            price: '¥888',
            img: './images/superbangbangtang.jpg',
            tags: ['能量补给', '随身携带', '英雄同款']
        },
        {
            name: '五灵锁',
            desc: '可以变身成五种兽型战士',
            price: '¥9999',
            img: './images/wulingsuo.jpg',
            tags: ['五行之力', '五种兽型', '变身神器']
        },
        {
            name: '猪猪开天宝剑',
            desc: '猪猪侠的无敌神器',
            price: '¥9.9',
            img: './images/baojian.jpg',
            tags: ['开天辟地', '传说装备', '限量收藏']
        }
    ];

    /* 春节（正月初一）日期表：倒计时自动选取下一个春节，不会因为过期而失效 */
    var SPRING_FESTIVAL = [
        '2027-02-06T00:00:00+08:00',
        '2028-01-26T00:00:00+08:00',
        '2029-02-13T00:00:00+08:00',
        '2030-02-03T00:00:00+08:00',
        '2031-01-23T00:00:00+08:00',
        '2032-02-11T00:00:00+08:00',
        '2033-01-31T00:00:00+08:00',
        '2034-02-19T00:00:00+08:00',
        '2035-02-08T00:00:00+08:00'
    ];

    /* ======================================================================
       1. 导航：滚动状态、进度条、锚点高亮、移动端菜单
       ====================================================================== */
    (function initNav() {
        var nav = $('#nav');
        var links = $$('#navLinks a');
        var toggle = $('#navToggle');
        var progress = $('#navProgress');

        if (!nav) { return; }

        function onScroll() {
            var top = window.pageYOffset || document.documentElement.scrollTop;
            nav.classList.toggle('is-scrolled', top > 40);

            if (progress) {
                var max = document.documentElement.scrollHeight - window.innerHeight;
                progress.style.width = (max > 0 ? Math.min(top / max, 1) * 100 : 0) + '%';
            }
        }
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        /* 移动端菜单 */
        function closeMenu() {
            if (!toggle) { return; }
            toggle.setAttribute('aria-expanded', 'false');
            if (links.length) { links[0].parentNode.classList.remove('is-open'); }
        }
        if (toggle) {
            toggle.addEventListener('click', function () {
                var box = $('#navLinks');
                var open = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
                box.classList.toggle('is-open', !open);
            });
            $$('#navLinks a').forEach(function (a) { a.addEventListener('click', closeMenu); });
            document.addEventListener('click', function (e) {
                if (!nav.contains(e.target)) { closeMenu(); }
            });
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') { closeMenu(); }
            });
        }

        /* 当前区块高亮 */
        var sections = $$('main section[id]');
        if ('IntersectionObserver' in window && sections.length) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) { return; }
                    links.forEach(function (a) {
                        a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
                    });
                });
            }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
            sections.forEach(function (s) { io.observe(s); });
        }
    })();

    /* ======================================================================
       2. 英雄轮播：居中放大 + 3D 翻转 + 自动播放 + 拖拽/键盘
       ====================================================================== */
    (function initCarousel() {
        var track = $('#heroTrack');
        var viewport = $('#heroViewport');
        if (!track || !viewport) { return; }

        var cards = $$('.hero-card', track);
        var dotsBox = $('#heroDots');
        var nameEl = $('#heroName');
        var descEl = $('#heroDesc');
        var linkEl = $('#heroLink');
        var total = cards.length;
        var current = 0;
        var autoplayId = null;
        var AUTOPLAY_MS = 4200;

        /* 生成指示点 */
        var dots = cards.map(function (card, i) {
            if (!dotsBox) { return null; }
            var b = document.createElement('button');
            b.type = 'button';
            b.setAttribute('role', 'tab');
            b.setAttribute('aria-label', '切换到 ' + HEROES[i].name);
            b.addEventListener('click', function () { go(i, true); });
            dotsBox.appendChild(b);
            return b;
        });

        function baseOffset() {
            var cardW = cards[0].offsetWidth;
            var styles = window.getComputedStyle(track);
            var gap = parseFloat(styles.columnGap || styles.gap) || 24;
            return viewport.clientWidth / 2 - cardW / 2 - current * (cardW + gap);
        }

        function render() {
            track.style.transform = 'translate3d(' + baseOffset() + 'px, 0, 0)';

            cards.forEach(function (card, i) {
                card.classList.toggle('is-active', i === current);
                card.classList.toggle('is-prev', i < current);
                card.classList.toggle('is-next', i > current);
                card.setAttribute('aria-current', i === current ? 'true' : 'false');
                card.tabIndex = i === current ? 0 : -1;
            });
            dots.forEach(function (d, i) {
                if (d) { d.classList.toggle('is-active', i === current); }
            });

            var hero = HEROES[current];
            if (nameEl) { nameEl.textContent = hero.name; nameEl.style.color = hero.color; }
            if (descEl) { descEl.textContent = hero.desc; }
            if (linkEl) { linkEl.href = hero.href; }
        }

        function go(i, userAction) {
            current = (i % total + total) % total;
            render();
            if (userAction) { restart(); }
        }

        /* 自动播放 */
        function start() {
            if (reduceMotion || total < 2) { return; }
            stop();
            autoplayId = window.setInterval(function () { go(current + 1); }, AUTOPLAY_MS);
        }
        function stop() {
            if (autoplayId) { window.clearInterval(autoplayId); autoplayId = null; }
        }
        function restart() { stop(); start(); }

        /* 卡片点击：非当前卡片先切换到它，当前卡片则打开百科 */
        cards.forEach(function (card, i) {
            card.addEventListener('click', function () {
                if (i === current) {
                    window.open(HEROES[i].href, '_blank', 'noopener');
                } else {
                    go(i, true);
                }
            });
        });

        var prev = $('#heroPrev');
        var next = $('#heroNext');
        if (prev) { prev.addEventListener('click', function () { go(current - 1, true); }); }
        if (next) { next.addEventListener('click', function () { go(current + 1, true); }); }

        /* 键盘 */
        viewport.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') { e.preventDefault(); go(current - 1, true); }
            if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1, true); }
        });

        /* 拖拽 / 触摸滑动 */
        var dragging = false;
        var startX = 0;
        var deltaX = 0;
        viewport.addEventListener('pointerdown', function (e) {
            if (e.pointerType === 'mouse' && e.button !== 0) { return; }
            dragging = true;
            startX = e.clientX;
            deltaX = 0;
            viewport.classList.add('is-dragging');
            stop();
        });
        viewport.addEventListener('pointermove', function (e) {
            if (!dragging) { return; }
            deltaX = e.clientX - startX;
        });
        function endDrag() {
            if (!dragging) { return; }
            dragging = false;
            viewport.classList.remove('is-dragging');
            if (Math.abs(deltaX) > 45) { go(current + (deltaX < 0 ? 1 : -1)); }
            start();
        }
        viewport.addEventListener('pointerup', endDrag);
        viewport.addEventListener('pointercancel', endDrag);
        viewport.addEventListener('pointerleave', endDrag);
        viewport.addEventListener('dragstart', function (e) { e.preventDefault(); });

        /* 鼠标悬停 / 焦点进入时暂停自动播放 */
        var carousel = $('#carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', stop);
            carousel.addEventListener('mouseleave', start);
            carousel.addEventListener('focusin', stop);
            carousel.addEventListener('focusout', start);
        }
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) { stop(); } else { start(); }
        });

        window.addEventListener('resize', render);
        if ('ResizeObserver' in window) { new ResizeObserver(render).observe(viewport); }

        render();
        start();
    })();

    /* ======================================================================
       3. 新春倒计时：自动选取下一个春节
       ====================================================================== */
    (function initCountdown() {
        var dayEl = $('#cdDay');
        var hourEl = $('#cdHour');
        var minEl = $('#cdMin');
        var secEl = $('#cdSec');
        var targetEl = $('#cdTarget');
        var heroDays = $('#heroDays');
        if (!dayEl) { return; }

        function nextTarget(now) {
            for (var i = 0; i < SPRING_FESTIVAL.length; i++) {
                var d = new Date(SPRING_FESTIVAL[i]);
                if (d.getTime() > now) { return d; }
            }
            return null;
        }

        var target = nextTarget(Date.now());
        var finished = false;

        function pad(n) { return n < 10 ? '0' + n : String(n); }

        function tick() {
            if (!target) {
                if (targetEl) { targetEl.textContent = '春节倒计时数据已更新，敬请期待'; }
                return;
            }
            var now = Date.now();
            var left = target.getTime() - now;

            if (left <= 0) {
                dayEl.textContent = '00';
                hourEl.textContent = '00';
                minEl.textContent = '00';
                secEl.textContent = '00';
                if (heroDays) { heroDays.textContent = '0'; }
                if (targetEl) { targetEl.textContent = '新年快乐！猪猪侠给大家拜年啦 🎉'; }
                if (!finished) {
                    finished = true;
                    window.clearInterval(timer);
                    target = nextTarget(now);
                    if (target) { finished = false; timer = window.setInterval(tick, 1000); }
                }
                return;
            }

            var sec = Math.floor(left / 1000);
            var days = Math.floor(sec / 86400);
            var hours = Math.floor((sec % 86400) / 3600);
            var mins = Math.floor((sec % 3600) / 60);
            var secs = sec % 60;

            dayEl.textContent = pad(days);
            hourEl.textContent = pad(hours);
            minEl.textContent = pad(mins);
            secEl.textContent = pad(secs);
            if (heroDays) { heroDays.textContent = String(days); }
        }

        var timer = window.setInterval(tick, 1000);

        if (targetEl && target) {
            targetEl.textContent = '距离 ' + target.getFullYear() + ' 年 ' +
                (target.getMonth() + 1) + ' 月 ' + target.getDate() + ' 日 · 春节（正月初一）';
        }
        tick();
    })();

    /* ======================================================================
       4. 商品详情弹窗
       ====================================================================== */
    (function initModal() {
        var modal = $('#productModal');
        if (!modal) { return; }

        var panel = $('.modal__panel', modal);
        var img = $('#modalImg');
        var title = $('#modalTitle');
        var desc = $('#modalDesc');
        var tags = $('#modalTags');
        var price = $('#modalPrice');
        var closeBtn = $('.modal__close', modal);
        var lastFocus = null;

        function fill(i) {
            var p = PRODUCTS[i];
            if (!p) { return; }
            if (img) { img.src = p.img; img.alt = p.name; }
            if (title) { title.textContent = p.name; }
            if (desc) { desc.textContent = p.desc; }
            if (price) { price.textContent = p.price; }
            if (tags) {
                tags.innerHTML = '';
                p.tags.forEach(function (t) {
                    var li = document.createElement('li');
                    li.textContent = t;
                    tags.appendChild(li);
                });
            }
        }

        function open(i) {
            fill(i);
            lastFocus = document.activeElement;
            modal.hidden = false;
            window.requestAnimationFrame(function () { modal.classList.add('is-open'); });
            document.body.style.overflow = 'hidden';
            window.setTimeout(function () { if (closeBtn) { closeBtn.focus(); } }, 60);
        }

        function close() {
            modal.classList.remove('is-open');
            document.body.style.overflow = '';
            window.setTimeout(function () { modal.hidden = true; }, reduceMotion ? 0 : 340);
            if (lastFocus && lastFocus.focus) { lastFocus.focus(); }
        }

        $$('.js-detail').forEach(function (btn) {
            btn.addEventListener('click', function () {
                open(parseInt(btn.getAttribute('data-product'), 10) || 0);
            });
        });

        $$('[data-close]', modal).forEach(function (el) {
            el.addEventListener('click', close);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.hidden === false) { close(); }
        });

        /* 焦点循环，避免 Tab 跑到弹窗外面 */
        modal.addEventListener('keydown', function (e) {
            if (e.key !== 'Tab' || !panel) { return; }
            var focusables = $$('button, [href], input, select, textarea', panel)
                .filter(function (el) { return !el.disabled; });
            if (!focusables.length) { return; }
            var first = focusables[0];
            var last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault(); last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault(); first.focus();
            }
        });
    })();

    /* ======================================================================
       5. 滚动出现动效
       ====================================================================== */
    (function initReveal() {
        var items = $$('[data-reveal]');
        if (!items.length) { return; }

        if (!('IntersectionObserver' in window) || reduceMotion) {
            items.forEach(function (el) { el.classList.add('is-visible'); });
            return;
        }

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) { return; }
                entry.target.classList.add('is-visible');
                io.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

        items.forEach(function (el, i) {
            /* 同组内的元素做一点错开的延迟，看起来更自然 */
            if (el.parentNode && el.parentNode.classList.contains('shop-grid')) {
                el.style.transitionDelay = (i % 3) * 0.09 + 's';
            }
            io.observe(el);
        });
    })();

    /* ======================================================================
       6. 回到顶部
       ====================================================================== */
    (function initToTop() {
        var btn = $('#toTop');
        if (!btn) { return; }

        function onScroll() {
            var top = window.pageYOffset || document.documentElement.scrollTop;
            btn.classList.toggle('is-show', top > 400);
        }
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    })();

    /* ======================================================================
       7. 背景音乐开关（默认不加载音频，点击后才开始下载）
       ====================================================================== */
    (function initMusic() {
        var btn = $('#musicToggle');
        var audio = $('#bgMusic');
        if (!btn || !audio) { return; }

        /* 仓库里的音乐文件名本身带一个空格，且扩展名是 .mp4（纯音频容器），保持原样引用 */
        var MUSIC_SRC = './audioes/1401568647-1-192 .mp4';
        var ready = false;

        function sync() {
            var playing = !audio.paused && !audio.ended;
            btn.classList.toggle('is-on', playing);
            btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
            btn.setAttribute('aria-label', playing ? '暂停背景音乐' : '播放背景音乐');
        }

        btn.addEventListener('click', function () {
            if (!ready) {
                audio.src = MUSIC_SRC;
                audio.volume = 0.35;
                ready = true;
                audio.load();
            }
            if (audio.paused) {
                var p = audio.play();
                if (p && p.catch) { p.catch(function () { sync(); }); }
            } else {
                audio.pause();
            }
        });

        audio.addEventListener('play', sync);
        audio.addEventListener('pause', sync);
        audio.addEventListener('ended', sync);
        sync();
    })();

    /* ======================================================================
       8. 首屏视频：尊重「减少动态效果」偏好
       ====================================================================== */
    (function initHeroVideo() {
        var video = $('.hero__video');
        if (!video) { return; }
        if (reduceMotion) {
            video.removeAttribute('autoplay');
            video.pause();
            return;
        }
        var p = video.play();
        if (p && p.catch) { p.catch(function () { /* 浏览器拦截自动播放时保留海报图 */ }); }
    })();

    /* ======================================================================
       9. 系列年表：按类型筛选（电视动画 / 番外篇 / 大电影 / 舞台剧）
       ====================================================================== */
    (function initTimeline() {
        var tabs = $$('.tabs .tab');
        var list = $('#timelineList');
        if (!tabs.length || !list) { return; }

        var items = $$('.tl__item', list);

        function apply(kind) {
            items.forEach(function (li) {
                li.hidden = li.getAttribute('data-kind') !== kind;
            });
        }

        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                tabs.forEach(function (t) {
                    var on = t === tab;
                    t.classList.toggle('is-active', on);
                    t.setAttribute('aria-selected', on ? 'true' : 'false');
                });
                apply(tab.getAttribute('data-filter'));
            });
        });

        var initial = $('.tabs .tab.is-active');
        apply(initial ? initial.getAttribute('data-filter') : 'season');
    })();

    /* ======================================================================
       10. 名曲馆：点选片头曲 / 片尾曲
       ====================================================================== */
    (function initSongs() {
        var songs = $$('.song');
        var now = $('#songNow');
        var scope = $('#songNowScope');
        var vinyl = $('#vinyl');
        if (!songs.length || !now || !scope) { return; }

        songs.forEach(function (song) {
            song.addEventListener('click', function () {
                songs.forEach(function (s) { s.classList.remove('is-active'); });
                song.classList.add('is-active');

                var nameEl = $('.song__name', song);
                now.textContent = nameEl ? nameEl.textContent : '';

                var group = song.closest ? song.closest('.song-group') : null;
                var title = group ? $('.song-group__title', group) : null;
                /* 标题形如「OP片头曲」「ED片尾曲」，取掉前缀英文缩写 */
                var label = title ? title.textContent.replace(/^OP/, '').replace(/^ED/, '').trim() : '';
                var scopeText = song.getAttribute('data-scope') || '';
                scope.textContent = (label ? label + ' · ' : '') + scopeText;

                if (vinyl) { vinyl.classList.add('is-spinning'); }
            });
        });

        /* 「播放本站背景音乐」转发给右下角的音乐开关（已在播放时不再重复触发暂停） */
        var playBtn = $('.js-play-music');
        var toggle = $('#musicToggle');
        var audio = $('#bgMusic');
        if (playBtn && toggle) {
            playBtn.addEventListener('click', function () {
                if (audio && !audio.paused && !audio.ended) { return; }
                toggle.click();
            });
        }
    })();

    /* ======================================================================
       11. 趣味问答：随机抽题 + 打乱选项 + 即时判分
       ====================================================================== */
    (function initQuiz() {
        var box = $('#quizBox');
        var result = $('#quizResult');
        if (!box || !result) { return; }

        var elIndex = $('#quizIndex');
        var elTotal = $('#quizTotal');
        var elScore = $('#quizScore');
        var elQuestion = $('#quizQuestion');
        var elOptions = $('#quizOptions');
        var elNote = $('#quizNote');
        var btnNext = $('#quizNext');
        var btnReset = $('#quizReset');
        var btnAgain = $('#quizAgain');
        var elFinal = $('#quizFinal');
        var elRank = $('#quizRank');
        var elRankNote = $('#quizRankNote');
        var LETTERS = ['A', 'B', 'C', 'D'];
        var COUNT = 8;

        /* q=题目，options[correct]=正确项，note=答后解析 */
        var POOL = [
            { q: '「GG Bond」里的 GG 来自什么？',
              options: ['粤语「猪」的发音', '英文 good game', '主角的编号', '导演的名字'], correct: 0,
              note: 'GG 取自粤语「猪」的发音，Bond 则是「侠」的意译。' },
            { q: '猪猪侠系列目前共有几季电视动画？',
              options: ['17 季', '12 季', '25 季', '9 季'], correct: 0,
              note: '从 2006 年的《魔幻猪猡纪》起，正季共 17 季，合计 1324 集。' },
            { q: '《超级棒棒糖》是从第几季开始成为片尾曲的？',
              options: ['第 8 季', '第 1 季', '第 13 季', '第 17 季'], correct: 0,
              note: '自第 8 季起，片尾曲换成《超级棒棒糖》。' },
            { q: '小呆呆原本是一个……？',
              options: ['天才儿童', '机器人', '外星人', '老师'], correct: 0,
              note: '第二季里，他因长期食用假冒伪劣的超级棒棒糖而变得痴呆。' },
            { q: '超人强是哪个小学的校董的儿子？',
              options: ['强强科技小学', '猪猪小学', '未来之星小学', '童话小学'], correct: 0,
              note: '第三季里他自持家境富裕、骄傲自满，是猪猪侠的死对头。' },
            { q: '系列第一部大电影是哪一年推出的？',
              options: ['2005 年', '2012 年', '2015 年', '2019 年'], correct: 0,
              note: '2005 年的《猪猪侠之大闹皇宫》，最早还是 4 集番外篇。' },
            { q: '「五灵锁」能让猪猪侠变身成几种兽型战士？',
              options: ['五种', '三种', '七种', '十种'], correct: 0,
              note: '五灵锁对应五灵力量，可以变身为五种兽型战士。' },
            { q: '全国有多少间猪猪侠亲子主题房在运营？',
              options: ['超过 4500 间', '超过 450 间', '超过 150 间', '超过 4.5 万间'], correct: 0,
              note: '据咏声动漫官网，全国有超过 4500 间猪猪侠亲子主题房在运营。' },
            { q: '从第五季开始的片头曲叫什么？',
              options: ['小英雄大肚腩', '超级棒棒糖', '绿色的旋律', '猪年吉祥'], correct: 0,
              note: '《小英雄大肚腩》自第 5 季《积木世界的童话故事》起作为片头曲。' },
            { q: '波比最擅长的事是？',
              options: ['讨好超人强、拍马屁', '发明机器', '开赛车', '做棒棒糖'], correct: 0,
              note: '作为超人强的小跟班，他拍马屁常常不分场合，经常拍错马屁。' },
            { q: '迷糊老师从第十三季开始被叫作什么？',
              options: ['迷糊博士', '迷糊教授', '迷糊队长', '迷糊老师傅'], correct: 0,
              note: '第十三季起改称「迷糊博士」，在《超星萌宠》里指导猪猪侠成为星际特工。' }
        ];

        var picked = [];
        var step = 0;
        var score = 0;
        var answered = false;
        var current = null;

        function shuffle(arr) {
            for (var i = arr.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var t = arr[i];
                arr[i] = arr[j];
                arr[j] = t;
            }
            return arr;
        }

        function render() {
            answered = false;
            current = picked[step];

            elIndex.textContent = step + 1;
            elQuestion.textContent = current.q;
            elNote.hidden = true;
            elNote.textContent = '';
            btnNext.disabled = true;
            btnNext.textContent = step === picked.length - 1 ? '查看结果' : '下一题';

            var opts = current.options.map(function (text, i) {
                return { text: text, right: i === current.correct };
            });
            shuffle(opts);

            elOptions.innerHTML = '';
            opts.forEach(function (o, i) {
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'quiz__option';
                btn.setAttribute('data-right', o.right ? '1' : '0');

                var badge = document.createElement('b');
                badge.textContent = LETTERS[i] || String(i + 1);
                var label = document.createElement('span');
                label.textContent = o.text;

                btn.appendChild(badge);
                btn.appendChild(label);
                btn.addEventListener('click', function () { choose(btn, o); });
                elOptions.appendChild(btn);
            });
        }

        function choose(btn, opt) {
            if (answered) { return; }
            answered = true;

            $$('.quiz__option', elOptions).forEach(function (b) {
                b.disabled = true;
                if (b.getAttribute('data-right') === '1') { b.classList.add('is-right'); }
            });
            if (opt.right) {
                score += 1;
            } else {
                btn.classList.add('is-wrong');
            }
            elScore.textContent = score;

            if (current.note) {
                elNote.textContent = current.note;
                elNote.hidden = false;
            }
            btnNext.disabled = false;
        }

        function finish() {
            box.hidden = true;
            result.hidden = false;
            elFinal.textContent = score;

            var rank = '新入坑的小猪';
            var note = '别灰心，去「系列年表」逛一圈，回来就能拿满分。';
            if (score >= picked.length) {
                rank = '骨灰级猪猪粉';
                note = '全对！从 2005 年的大闹皇宫到超星五灵侠，你一部都没落下。';
            } else if (score >= 6) {
                rank = '资深粉丝';
                note = '很接近满分，只差一点点冷知识。';
            } else if (score >= 4) {
                rank = '合格猪猪迷';
                note = '基础挺扎实，再翻翻年表和角色档案就能上分。';
            }
            elRank.textContent = rank;
            elRankNote.textContent = note;
            if (btnAgain) { btnAgain.focus(); }
        }

        function build() {
            picked = shuffle(POOL.slice()).slice(0, Math.min(COUNT, POOL.length));
            step = 0;
            score = 0;
            elTotal.textContent = picked.length;
            elScore.textContent = '0';
            box.hidden = false;
            result.hidden = true;
            render();
        }

        btnNext.addEventListener('click', function () {
            if (!answered) { return; }
            if (step < picked.length - 1) {
                step += 1;
                render();
            } else {
                finish();
            }
        });
        if (btnReset) { btnReset.addEventListener('click', build); }
        if (btnAgain) { btnAgain.addEventListener('click', build); }

        build();
    })();

})();
