(function () {
  const stageElem = document.querySelector('.stage');
  const houseElem = document.querySelector('.house');
  const barElem = document.querySelector('.progress-bar');
  const selectCharacterElem = document.querySelector('.select-character');
  const mousePos = {
    x: 0,
    y: 0
  };
  let maxScrollValue;

  // 창이 resize될 때마다 resizeHandler가 실행되고 그때마다 maxScrollValue의 값이 새로 세팅이 됨
  function resizeHandler() {
    maxScrollValue = document.body.offsetHeight - window.innerHeight; // 전체 스크롤 할 수 있는 범위 = 문서 전체(바디)높이 - 윈도우 뷰포트의 높이
  }

  window.addEventListener('scroll', function () {
    const scrollPer = pageYOffset / maxScrollValue;
    const zMove = scrollPer * 980 - 490;
    houseElem.style.transform = `translateZ(${zMove}vw)`;

    // progress bar
    barElem.style.width = `${scrollPer*100}%`
  });

  window.addEventListener('mousemove', function (e) {
    mousePos.x = -1 + (e.clientX / window.innerWidth) * 2;
    mousePos.y = 1 - (e.clientY / window.innerHeight) * 2;
    stageElem.style.transform = `rotateX(${mousePos.y * 5}deg) rotateY(${mousePos.x * 5}deg)`;
  });

  window.addEventListener('resize', resizeHandler);

  stageElem.addEventListener('click', function (e) {
    new Character({
      xPos: e.clientX / window.innerWidth * 100, // 지금 클릭한 위치를 퍼센트로 변환. 전체 너비(100%) 분의 실제 클릭한 위치의 비율 * 100 = 퍼센트
      speed: Math.random() * 0.5 + 0.2
    });
  });

  selectCharacterElem.addEventListener('click', function (e) {
    const value = e.target.getAttribute('data-char');
    document.body.setAttribute('data-char', value);
  })

  resizeHandler();
})();
