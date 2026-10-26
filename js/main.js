(function () {
    var root = document.documentElement;
    var nav = document.getElementById('nav');
    var navLinks = document.getElementById('nav-links');
    var menuBtn = document.getElementById('menu-toggle');
    var themeBtn = document.getElementById('theme-toggle');

    // Ano do rodapé
    document.getElementById('year').textContent = new Date().getFullYear();

    // Fundo da navegação ao rolar
    function onScroll() {
        nav.classList.toggle('scrolled', window.scrollY > 10);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Menu mobile
    function setMenu(open) {
        navLinks.classList.toggle('open', open);
        nav.classList.toggle('menu-open', open);
        menuBtn.setAttribute('aria-expanded', String(open));
        menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    }
    menuBtn.addEventListener('click', function () {
        setMenu(!navLinks.classList.contains('open'));
    });
    navLinks.addEventListener('click', function (e) {
        if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') setMenu(false);
    });

    // Tema claro/escuro
    function currentTheme() {
        var t = root.getAttribute('data-theme');
        if (t) return t;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    themeBtn.addEventListener('click', function () {
        var next = currentTheme() === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) {}
    });

    // Animações de entrada ao rolar
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        // Escalona elementos irmãos que aparecem juntos (cards, skills etc.)
        reveals.forEach(function (el) {
            var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
                return c.classList.contains('reveal');
            });
            var i = siblings.indexOf(el);
            if (i > 0) el.style.setProperty('--delay', Math.min(i * 0.08, 0.4) + 's');
        });

        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        reveals.forEach(function (el) { revealObserver.observe(el); });

        // Link ativo na navegação
        var links = navLinks.querySelectorAll('a[href^="#"]');
        var sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                links.forEach(function (link) {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });

        document.querySelectorAll('main section[id]').forEach(function (s) { sectionObserver.observe(s); });
    } else {
        reveals.forEach(function (el) { el.classList.add('visible'); });
    }

    // Copiar e-mail
    var copyBtn = document.getElementById('copy-email');
    copyBtn.addEventListener('click', function () {
        var label = copyBtn.querySelector('span');
        var email = copyBtn.getAttribute('data-email');
        if (!navigator.clipboard) {
            window.location.href = 'mailto:' + email;
            return;
        }
        navigator.clipboard.writeText(email).then(function () {
            label.textContent = 'E-mail copiado!';
            setTimeout(function () { label.textContent = 'Copiar e-mail'; }, 2000);
        });
    });
})();
