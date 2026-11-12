/* ========================================
   스크롤 등장 (Reveal) 애니메이션
======================================== */
(() => {
    "use strict";

    const elements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            // 같은 부모 안에서의 순서에 따라 0.12초씩 지연 (최대 4단계)
            const idx = [...el.parentElement.children].indexOf(el);
            el.style.transitionDelay = `${(idx % 4) * 0.12}s`;

            el.classList.remove("is-pending");
            el.classList.add("is-visible");
            obs.unobserve(el);

            // 등장이 끝나면 reveal 관련 클래스 제거 → hover 효과 정상 동작
            setTimeout(() => {
                el.classList.remove("reveal", "is-visible");
                el.style.transitionDelay = "";
            }, 1500);
        });
    }, { threshold: 0.08 });

    elements.forEach(el => {
        el.classList.add("is-pending");
        observer.observe(el);
    });
})();

/* ========================================
   전체 화면 라이트박스(Lightbox) 로직
======================================== */
let closeTimer = null;

// 라이트박스 열기 (html: 안에 넣을 내용, isImageOnly: 이미지 단독 여부)
function openLightbox(html, isImageOnly) {
    const lightbox = document.getElementById('lightbox');
    const container = document.getElementById('lightbox-content-container');

    // 닫히는 중에 다른 항목을 열어도 내용이 지워지지 않도록 타이머 취소
    clearTimeout(closeTimer);

    // 이미지 단독일 때는 is-image 클래스를 붙여 원본 비율로 표시
    container.innerHTML =
        `<div class="lightbox-content${isImageOnly ? ' is-image' : ''}">${html}</div>`;

    // 라이트박스 표시 (클래스 추가 시 CSS 애니메이션 발동)
    lightbox.classList.add('active');

    // 유튜브 iframe이 있다면 클릭 재생 가능하도록 pointer-events 활성화
    const iframe = container.querySelector('iframe');
    if (iframe) {
        iframe.style.pointerEvents = "auto";
    }
}

// 라이트박스 닫기 (X 버튼, 검은 배경 클릭, ESC 키)
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const container = document.getElementById('lightbox-content-container');

    lightbox.classList.remove('active');

    // 닫히는 애니메이션(0.4초)이 끝난 후 내부 콘텐츠(영상 등) 삭제 및 재생 정지
    closeTimer = setTimeout(() => {
        container.innerHTML = '';
    }, 400);
}

document.addEventListener('DOMContentLoaded', () => {
    // 1) 갤러리 카드 (.vertical-item) 클릭 시 열기
    document.querySelectorAll('.vertical-item').forEach(item => {
        item.addEventListener('click', () => {
            const media = item.querySelector('.vertical-media');
            if (!media) return;

            // 이미지만 있고 영상/iframe이 없으면 이미지 전용 모드
            const onlyImage = media.querySelector('img') && !media.querySelector('video, iframe');
            openLightbox(media.innerHTML, !!onlyImage);
        });
    });

    // 2) 단독 이미지 클릭 시 열기 (프로필 사진 / 상장 / 작업물 카드)
    document.querySelectorAll(
        '.photo-placeholder img, .award-placeholder img, .evidence-placeholder img'
    ).forEach(img => {
        img.classList.add('zoomable'); // 마우스 커서를 돋보기 모양으로
        img.addEventListener('click', () => openLightbox(img.outerHTML, true));
    });

    // 3) ESC 키로 닫기
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeLightbox();
    });
});

/* ========================================
   KPI 카운트업 애니메이션
======================================== */
(() => {
    "use strict";

    const counters = document.querySelectorAll(".kpi-number");
    if (!counters.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const DURATION = 1600; // 밀리초

    const format = (el, value) => {
        const decimals = Number(el.dataset.decimals || 0);
        const prefix = el.dataset.prefix || "";
        const suffix = el.dataset.suffix || "";
        return prefix + value.toLocaleString("ko-KR", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }) + suffix;
    };

    const animate = el => {
        const target = Number(el.dataset.countTo);
        if (reduceMotion) { el.textContent = format(el, target); return; }

        const start = performance.now();
        const tick = now => {
            const progress = Math.min((now - start) / DURATION, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // 끝으로 갈수록 느려지는 효과
            el.textContent = format(el, target * eased);
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            animate(entry.target);
            obs.unobserve(entry.target); // 한 번만 실행
        });
    }, { threshold: 0.6 });

    counters.forEach(el => {
        el.textContent = format(el, 0); // 시작값 0
        observer.observe(el);
    });
})();