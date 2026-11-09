/* ========================================
   스크롤 등장 (Reveal) 애니메이션
======================================== */
(() => {
    "use strict";
    const elements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove("is-pending");
                entry.target.classList.add("is-visible");
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    elements.forEach(el => {
        el.classList.add("is-pending");
        observer.observe(el);
    });
})();

/* ========================================
   3D 회전 캐러셀 (부드러운 각도 전환 로직)
======================================== */
const carousels = {
    'gstar-3d': { angle: 0 },
    'ansan-3d': { angle: 0 }
};

function setupCarousels() {
    ['gstar-3d', 'ansan-3d'].forEach(id => {
        const carousel = document.getElementById(id);
        if(!carousel) return;
        const items = carousel.querySelectorAll('.carousel-item');
        const numItems = items.length;
        const theta = 360 / numItems;
        
        const containerWidth = carousel.parentElement.offsetWidth;
        // 3D 공간 왜곡 없이 자연스럽게 배치되도록 반지름 보정
        const radius = Math.round((containerWidth / 2) / Math.tan(Math.PI / numItems)) * 1.15;

        items.forEach((item, i) => {
            item.style.transform = `rotateY(${i * theta}deg) translateZ(${radius}px)`;
        });
        
        carousels[id].theta = theta;
        carousels[id].radius = radius;
        updateCarouselTransform(id);
    });
}

function rotateCarousel(id, direction) {
    // 회전 방향이 직관적이고 부드럽게 연동되도록 수정
    carousels[id].angle += direction * carousels[id].theta;
    updateCarouselTransform(id);
}

function updateCarouselTransform(id) {
    const carousel = document.getElementById(id);
    carousel.style.transform = `translateZ(${-carousels[id].radius}px) rotateY(${-carousels[id].angle}deg)`;
}

window.addEventListener('resize', setupCarousels);
document.addEventListener('DOMContentLoaded', setupCarousels);

/* ========================================
   유리 질감 모달 오픈 로직
======================================== */
document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.carousel-item');
    const modal = document.getElementById('project-modal');
    const titleEl = document.getElementById('modal-title');
    const descEl = document.getElementById('modal-desc');
    const mediaContainer = document.getElementById('modal-media-container');

    items.forEach(item => {
        item.addEventListener('click', () => {
            const title = item.getAttribute('data-title');
            const desc = item.getAttribute('data-desc');
            const yt = item.getAttribute('data-yt');

            titleEl.textContent = title;
            descEl.textContent = desc;

            if (yt) {
                mediaContainer.innerHTML = `<iframe src="${yt}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
            } else {
                mediaContainer.innerHTML = `<div class="evidence-placeholder" style="width:100%; height:100%; border:none;"><span>자료 준비 중</span></div>`;
            }

            modal.classList.add('active');
        });
    });
});

function closeModal() {
    const modal = document.getElementById('project-modal');
    const mediaContainer = document.getElementById('modal-media-container');
    modal.classList.remove('active');
    
    setTimeout(() => {
        mediaContainer.innerHTML = '';
    }, 300);
}