document.addEventListener('DOMContentLoaded', function() {
    let currentImageIndex = 0;
    const images = [
        '../images/shell/1.png',
        '../images/shell/2.png',
        '../images/shell/3.png',
        '../images/shell/4.png',
        '../images/shell/5.png'
    ];

    // 전역 스코프에서 함수 사용 가능하도록 window 객체에 할당
    window.openGallery = function() {
        document.getElementById('imageGallery').style.display = 'block';
        showImage(0);
    }

    window.closeGallery = function() {
        document.getElementById('imageGallery').style.display = 'none';
    }

    window.changeImage = function(direction) {
        currentImageIndex = (currentImageIndex + direction + images.length) % images.length;
        showImage(currentImageIndex);
    }

    window.showImage = function(index) {
        const galleryImage = document.getElementById('galleryImage');
        galleryImage.src = images[index];
        currentImageIndex = index;
    }

    // ESC 키로 갤러리 닫기
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeGallery();
        }
    });
});
