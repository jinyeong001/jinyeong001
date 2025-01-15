document.addEventListener('DOMContentLoaded', function() {
    let currentImageIndex = 0;
    const images = [
        '../jinyeong001/images/shell/1.png',
        '../jinyeong001/images/shell/2.png',
        '../jinyeong001/images/shell/3.png',
        '../jinyeong001/images/shell/4.png',
        '../jinyeong001/images/shell/5.png'
    ];

    // 썸네일 생성 함수
    function createThumbnails() {
        const thumbnailsContainer = document.getElementById('galleryThumbnails');
        thumbnailsContainer.innerHTML = ''; // 기존 썸네일 제거

        images.forEach((image, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = image;
            thumbnail.className = 'gallery-thumbnail';
            thumbnail.onclick = () => showImage(index);
            thumbnailsContainer.appendChild(thumbnail);
        });
    }

    // 썸네일 활성화 상태 업데이트
    function updateThumbnails() {
        const thumbnails = document.querySelectorAll('.gallery-thumbnail');
        thumbnails.forEach((thumb, index) => {
            if (index === currentImageIndex) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }

    window.openGallery = function() {
        document.getElementById('imageGallery').style.display = 'block';
        createThumbnails(); // 갤러리 열 때 썸네일 생성
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
        updateThumbnails(); // 썸네일 활성화 상태 업데이트
    }

    // ESC 키로 갤러리 닫기
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeGallery();
        }
    });
});
