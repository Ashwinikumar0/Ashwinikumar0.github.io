/**
 * Tech Vlogs Interactivity & Utility Script
 * Handles tag filtering, real-time search, code copy buttons, and chapter jumps.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle Logic
    const toggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav-links');
    if (toggle && nav) {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            nav.classList.toggle('active');
            toggle.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (nav.classList.contains('active') && !nav.contains(e.target) && !toggle.contains(e.target)) {
                nav.classList.remove('active');
                toggle.classList.remove('active');
            }
        });
    }

    // 1b. Smooth Scroll for Same-Page Navigation Links
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === currentPath || (currentPath === 'vlogs.html' && href === 'vlogs.html') || (currentPath === 'projects.html' && href === 'projects.html')) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // 1c. Recruiter Fast-Track Drawer Logic
    const openDrawerBtn = document.getElementById('open-recruiter-drawer');
    const closeDrawerBtn = document.getElementById('close-recruiter-drawer');
    const drawerOverlay = document.getElementById('recruiter-drawer-overlay');

    if (openDrawerBtn && drawerOverlay) {
        openDrawerBtn.addEventListener('click', () => {
            drawerOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeDrawerBtn && drawerOverlay) {
        closeDrawerBtn.addEventListener('click', () => {
            drawerOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', (e) => {
            if (e.target === drawerOverlay) {
                drawerOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // 1d. Hero Telemetry Tabs & Latency Benchmark Slider
    const tabBtns = document.querySelectorAll('.dash-tab-btn');
    const latencySlider = document.getElementById('latency-slider');
    const latencyVal = document.getElementById('slider-latency-val');
    const quoteText = document.getElementById('impact-quote-text');

    if (tabBtns.length > 0) {
        const tabData = {
            cdc: {
                title: "CDC Pipeline Throughput",
                desc: "Debezium • Kafka • DuckDB Vector OLAP",
                quote: "“81.4x Latency Reduction over Postgres Read Replicas via Off-Thread WAL Streaming.”",
                latency: 42,
                label: "42 ms (DuckDB Vector)"
            },
            rec: {
                title: "Post-Trade Rec Engine",
                desc: "FIX 4.4 • SWIFT MT515 • 4-Way Match",
                quote: "“99.8% Straight-Through Match Rate across 5M Daily Trade Executions.”",
                latency: 450,
                label: "450 ms (Intraday Rec Stream)"
            },
            sec: {
                title: "KeyVault E2E Security",
                desc: "PBKDF2 SHA-256 • AES-256-GCM • Go API",
                quote: "“Zero-Knowledge Architecture with 15-Minute In-Memory Key Auto-Purge.”",
                latency: 18,
                label: "18 ms (Zero-Knowledge Pass)"
            }
        };

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const key = btn.getAttribute('data-tab');
                const info = tabData[key];
                if (info && quoteText) {
                    quoteText.innerText = info.quote;
                    if (latencySlider && latencyVal) {
                        latencySlider.value = info.latency;
                        latencyVal.innerText = info.label;
                    }
                }
            });
        });
    }

    if (latencySlider && latencyVal) {
        latencySlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value, 10);
            if (val < 100) {
                latencyVal.innerText = `${val} ms (DuckDB Vector OLAP)`;
                latencyVal.style.color = '#10b981';
            } else if (val < 1000) {
                latencyVal.innerText = `${val} ms (ClickHouse / Redis Hash)`;
                latencyVal.style.color = '#3b82f6';
            } else {
                latencyVal.innerText = `${val} ms (Postgres Read Replica - Degraded)`;
                latencyVal.style.color = '#ef4444';
            }
        });
    }

    // 2. Vlog Filtering & Search Logic (on vlogs.html hub page)
    const searchInput = document.getElementById('vlog-search');
    const filterBtns = document.querySelectorAll('.vlog-filter-btn');
    const vlogCards = document.querySelectorAll('.vlogs-grid .vlog-card');
    const featuredCard = document.querySelector('.featured-vlog-card');

    let currentTag = 'all';
    let currentSearch = '';

    function filterVlogs() {
        const query = currentSearch.toLowerCase().trim();

        // Filter Grid Cards
        vlogCards.forEach(card => {
            const title = card.querySelector('.vlog-card-title')?.textContent.toLowerCase() || '';
            const desc = card.querySelector('.vlog-card-desc')?.textContent.toLowerCase() || '';
            const tags = Array.from(card.querySelectorAll('.vlog-tag')).map(t => t.textContent.toLowerCase());
            const category = card.dataset.category ? card.dataset.category.toLowerCase() : '';

            const matchesTag = currentTag === 'all' || category.includes(currentTag) || tags.some(t => t.includes(currentTag));
            const matchesSearch = !query || title.includes(query) || desc.includes(query) || tags.some(t => t.includes(query));

            if (matchesTag && matchesSearch) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });

        // Filter Featured Card if present
        if (featuredCard) {
            const title = featuredCard.querySelector('h2')?.textContent.toLowerCase() || '';
            const desc = featuredCard.querySelector('p')?.textContent.toLowerCase() || '';
            const tags = Array.from(featuredCard.querySelectorAll('.vlog-tag')).map(t => t.textContent.toLowerCase());
            const category = featuredCard.dataset.category ? featuredCard.dataset.category.toLowerCase() : '';

            const matchesTag = currentTag === 'all' || category.includes(currentTag) || tags.some(t => t.includes(currentTag));
            const matchesSearch = !query || title.includes(query) || desc.includes(query) || tags.some(t => t.includes(query));

            if (matchesTag && matchesSearch) {
                featuredCard.style.display = 'grid';
            } else {
                featuredCard.style.display = 'none';
            }
        }
    }

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentTag = btn.dataset.tag || 'all';
                filterVlogs();
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value;
            filterVlogs();
        });
    }

    // 3. Code Copy to Clipboard
    const copyBtns = document.querySelectorAll('.copy-code-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const wrapper = btn.closest('.code-block-wrapper');
            const codeEl = wrapper ? wrapper.querySelector('code') : null;
            if (codeEl) {
                try {
                    await navigator.clipboard.writeText(codeEl.innerText);
                    const originalText = btn.innerHTML;
                    btn.innerHTML = `✓ Copied!`;
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy text: ', err);
                }
            }
        });
    });

    // 4. Video Chapter Jump Helper (if HTML5 video or timestamp anchor is present)
    const chapterBtns = document.querySelectorAll('.chapter-btn');
    chapterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const seconds = parseInt(btn.dataset.time, 10);
            const videoEl = document.querySelector('.vlog-video-frame video');
            if (videoEl && !isNaN(seconds)) {
                videoEl.currentTime = seconds;
                videoEl.play();
            }
        });
    });
});
