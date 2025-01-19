document.addEventListener('DOMContentLoaded', async function() {
    // 카테고리별 포스트 로드 함수
    async function loadCategoryPosts(category) {
        try {
            const response = await fetch(`/posts/${category}/index.json`);
            if (!response.ok) {
                console.error(`Error loading ${category} posts:`, response.statusText);
                return [];
            }
            const data = await response.json();
            return data.posts || [];
        } catch (error) {
            console.error(`Error loading ${category} posts:`, error);
            return [];
        }
    }

    // 마크다운 파일 로드 및 변환 함수
    async function loadMarkdownPost(category, filename) {
        try {
            const response = await fetch(`/posts/${category}/${filename}`);
            const markdown = await response.text();
            // marked.js를 사용하여 마크다운을 HTML로 변환
            const html = marked.parse(markdown);
            return html;
        } catch (error) {
            console.error('Error loading markdown:', error);
            return '<p>포스트를 불러올 수 없습니다.</p>';
        }
    }

    // 목차 생성 함수
    function generateTOC(content) {
        const tocList = document.getElementById('toc-list');
        tocList.innerHTML = '';
        
        // HTML 컨텐츠에서 헤더 추출
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const headers = tempDiv.querySelectorAll('h1, h2, h3');
        
        headers.forEach((header, index) => {
            const level = parseInt(header.tagName.charAt(1));
            const headerId = `section-${index}`;
            
            // 원본 헤더에 ID 추가
            const originalHeader = document.querySelector(`${header.tagName}:nth-of-type(${index + 1})`);
            if (originalHeader) {
                originalHeader.id = headerId;
            }
            
            // 목차 항목 생성
            const li = document.createElement('li');
            li.className = 'nav-item';
            li.style.paddingLeft = `${(level - 1) * 15}px`;
            
            // 목차 링크에 클릭 이벤트 추가
            const link = document.createElement('a');
            link.className = 'nav-link';
            link.href = `#${headerId}`;
            link.textContent = header.textContent;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.getElementById(headerId);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
            
            li.appendChild(link);
            tocList.appendChild(li);
        });
    }

    // 포스트 목록 생성 함수
    async function createPostList() {
        const categories = ['application', 'hacking', 'dashboard', 'devops', 'ids', 'malware', 'network', 'sql'];
        const postList = document.getElementById('post-list');
        
        // 기존 ALL 버튼
        const allBtn = document.createElement('button');
        allBtn.className = 'category-btn';
        allBtn.setAttribute('data-category', 'all');
        allBtn.textContent = 'ALL';
        postList.appendChild(allBtn);

        // 각 카테고리별 포스트 로드 및 표시
        for (const category of categories) {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'category-group';
            
            const categoryBtn = document.createElement('button');
            categoryBtn.className = 'category-btn';
            categoryBtn.setAttribute('data-category', category);
            categoryBtn.textContent = category.toUpperCase();
            
            const postsContainer = document.createElement('div');
            postsContainer.className = 'posts-container';
            postsContainer.setAttribute('data-category', category);
            
            // 카테고리 버튼 클릭 이벤트
            categoryBtn.addEventListener('click', async () => {
                const wasActive = categoryBtn.classList.contains('active');
                
                // 다른 모든 포스트 컨테이너 숨기기
                document.querySelectorAll('.posts-container').forEach(container => {
                    container.classList.remove('show');
                });
                
                // 다른 모든 버튼 비활성화
                document.querySelectorAll('.category-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // 현재 버튼이 활성화되어 있지 않았다면 포스트 표시
                if (!wasActive) {
                    categoryBtn.classList.add('active');
                    postsContainer.classList.add('show');
                    
                    // 포스트가 아직 로드되지 않은 경우에만 로드
                    if (postsContainer.children.length === 0) {
                        const posts = await loadCategoryPosts(category);
                        posts.forEach(post => {
                            const item = document.createElement('div');
                            item.className = 'post-item';
                            item.textContent = post.title;
                            
                            item.addEventListener('click', async () => {
                                const content = await loadMarkdownPost(category, post.filename);
                                document.getElementById('post-content').innerHTML = content;
                                generateTOC(content);
                                
                                document.querySelectorAll('.post-item').forEach(p => {
                                    p.classList.remove('active');
                                });
                                item.classList.add('active');
                            });
                            
                            postsContainer.appendChild(item);
                        });
                    }
                }
            });
            
            groupDiv.appendChild(categoryBtn);
            groupDiv.appendChild(postsContainer);
            postList.appendChild(groupDiv);
        }

        // ALL 버튼 클릭 이벤트
        allBtn.addEventListener('click', async () => {
            // 모든 카테고리 버튼 비활성화
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            allBtn.classList.add('active');

            // 모든 카테고리의 포스트 로드 및 표시
            for (const category of categories) {
                const container = document.querySelector(`.posts-container[data-category="${category}"]`);
                if (container.children.length === 0) {
                    const posts = await loadCategoryPosts(category);
                    posts.forEach(post => {
                        const item = document.createElement('div');
                        item.className = 'post-item';
                        item.textContent = post.title;
                        
                        item.addEventListener('click', async () => {
                            const content = await loadMarkdownPost(category, post.filename);
                            document.getElementById('post-content').innerHTML = content;
                            generateTOC(content);
                            
                            document.querySelectorAll('.post-item').forEach(p => {
                                p.classList.remove('active');
                            });
                            item.classList.add('active');
                        });
                        
                        container.appendChild(item);
                    });
                }
                container.classList.add('show');
            }
        });

        // 초기에 'ALL' 버튼 클릭
        allBtn.click();
    }

    // 포스트 목록 생성 실행
    await createPostList();

    // 스크롤 이벤트 추가
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        // 현재 화면에 보이는 섹션 찾기
        document.querySelectorAll('[id^="section-"]').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop - 100 && scrollPosition < sectionBottom) {
                // 해당 섹션의 목차 항목 활성화
                document.querySelectorAll('#toc-list .nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${section.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
});
