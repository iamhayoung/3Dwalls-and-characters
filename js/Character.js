function Character(info) {
  this.mainElem = document.createElement('div');
  this.mainElem.classList.add('character');
  this.mainElem.innerHTML = `
      <div class="character-face-con character-head">
        <div class="character-face character-head-face face-front"></div>
        <div class="character-face character-head-face face-back"></div>
      </div>
      <div class="character-face-con character-torso">
        <div class="character-face character-torso-face face-front"></div>
        <div class="character-face character-torso-face face-back"></div>
      </div>
      <div class="character-face-con character-arm character-arm-right">
        <div class="character-face character-arm-face face-front"></div>
        <div class="character-face character-arm-face face-back"></div>
      </div>
      <div class="character-face-con character-arm character-arm-left">
        <div class="character-face character-arm-face face-front"></div>
        <div class="character-face character-arm-face face-back"></div>
      </div>
      <div class="character-face-con character-leg character-leg-right">
        <div class="character-face character-leg-face face-front"></div>
        <div class="character-face character-leg-face face-back"></div>
      </div>
      <div class="character-face-con character-leg character-leg-left">
        <div class="character-face character-leg-face face-front"></div>
        <div class="character-face character-leg-face face-back"></div>
      </div>`
  document.querySelector('.stage').appendChild(this.mainElem);

  this.mainElem.style.left = info.xPos + '%';
  this.scrollState = false; // 현재 스크롤 상태를 나타냄. 스크롤 중인지 아닌지 체크. 기본값은 false
  this.lastScrollTop = 0; // 바로 이전(마지막) 스크롤 위치
  this.xPos = info.xPos; // 캐릭터의 x위치
  this.speed = info.speed; // 캐릭터가 옆으로 걸을 때 스피드
  this.direction;
  this.runningState = false; // 좌우 이동 중인지 아닌지 판별하는 속성
  this.rafId; // requestAnimationFrame이 리턴하는 값을 저장하는 녀석
  this.init();
}

// 인스턴스가 공통으로 사용하는 속성이나 메소드는 프로토타입에 만듦.
// 클릭으로 생성되는 모든 캐릭터가 공통으로 사용하는 것(스크롤하면 캐릭터에 러닝이라는 클래스가 붙게)이기 때문에 프로토타입을 사용
Character.prototype = {
  constructor: Character,
  init: function () {
    const self = this;

    // 현재 스크롤 상태를 나타내는 scrollState의 기본값은 false이다. 스크롤 이벤트가 실행되면 clearTimeout이 먼저 작동한다. clearTimeout은 setTimeout의 반환값을 매개변수로 하여 setTimeout을 취소시키는 함수이다. 지금은 setTimeout이 실행되지 않았으니 건너뛰고 다음 if문으로 가자. "!(self.scrollState=false)= true", 즉 if(true){} 이므로 if문이 실행된다. running 클래스가 붙어 이제 애니메이션이 작동된다. 다음으로 setTimeout 함수로 가보자. setTimeout은 항상 숫자를 리턴하기 때문에 scrollState는 값을 가지게 되어 true가 된다. setTimeout 안의 내용들은 0.5초 후에 실행되는데 실행되기도 전에 스크롤 이벤트 갱신과 함께 clearTimeout으로 인해 실행되지 못한다. 이제 if문으로 넘어가는데 scrollState가 true이므로 if(!true), 즉, if(false)가 되어 if 문이 실행되지 않는다. 그리고 setTimeout으로 넘어가면 마찬가지로 리턴값을 받아 여전히 true이고, settimeout은 실행되지 않는다. 이렇게 반복되다가 마지막 스크롤일 때 setTimeout이 드디어 실행된다. 왜냐하면 더 이상 스크롤 이벤트가 일어나지 않아 clearTimeout이 동작하지 않기 때문이다. 비로소 scrollstate는 false가 되고 running 클래스는 제거된다.
    window.addEventListener('scroll', function () {
      // clearTimeout은 스크롤하자마자, 스크롤할때마다 일어나는 이벤트
      // 아래의 setTimeout함수를 취소함. 즉, 스크롤될때마다 setTimeout함수를 취소해서 setTimeout함수가 움직이지 못하게 함
      // 아래의 setTimeout함수의 실행결과의 리턴값인 숫자를 클리어함
      clearTimeout(self.scrollState);

      // 느낌표가 붙어있기 때문에 scrollState가 false일 때 실행됨. 기본값이 false인데 앞에 느낌표가 붙었으므로 즉 첫 실행은 true가 됨.
      // 아래의 setTimeout함수로 인해 self.scrollState에는 숫자(값)가 들어오게 되어 true가 되지만, 앞에 느낌표가 붙었으므로 false가 되어 if문을 실행하지 않음
      if (!self.scrollState) {
        self.mainElem.classList.add('running');
      }

      // 맨위의 clearTimeout함수로 인해, 스크롤이 멈추고 0.5초 후에 딱 1번 실행됨
      // 0.5초 후에 함수가 1번만 실행. setTimeout은 실행결과 숫자를 리턴하는데 리턴된 숫자를 self.scrollState에 넣어줌
      self.scrollState = setTimeout(function () {
        self.scrollState = false;
        self.mainElem.classList.remove('running');
      }, 500);

      ////////////////// 스크롤할때 캐릭터 걸을때 방향변경
      // 이전 스크롤 위치와 현재 스크롤 위치를 비교
      if (self.lastScrollTop > pageYOffset) {
        // 이전 스크롤 위치가 현재 스크롤 위치보다 크다면 : 스크롤 올림
        self.mainElem.setAttribute('data-direction', 'backward');
      } else {
        // 현재 스크롤 위치가 이전 스크롤 위치보다 크다면 : 스크롤 내림
        self.mainElem.setAttribute('data-direction', 'forward');
      }
      // 마지막으로 스크롤한 위치를 lastScrollTop에 담아줌
      self.lastScrollTop = pageYOffset;
    });

    window.addEventListener('keydown', function (e) {
      if (self.runningState) return;

      console.log('keydown')

      if (e.key === 'ArrowLeft') {
        self.direction = 'left';
        self.mainElem.setAttribute('data-direction', 'left');
        self.mainElem.classList.add('running');
        self.run(self);
        self.runningState = true;
      } else if (e.key === 'ArrowRight') {
        self.direction = 'right';
        self.mainElem.setAttribute('data-direction', 'right');
        self.mainElem.classList.add('running');
        self.run(self);
        self.runningState = true;
      }
    });

    window.addEventListener('keyup', function (e) {
      self.mainElem.classList.remove('running');
      cancelAnimationFrame(self.rafId);
      self.runningState = false;
    });
  },
  run: function (self) {
    if (self.direction === 'left') {
      self.xPos -= self.speed;
    } else if (self.direction == 'right') {
      self.xPos += self.speed;
    }

    if (self.xPos < 2) {
      self.xPos = 2;
    }

    if (self.xPos > 88) {
      self.xPos = 88;
    }

    self.mainElem.style.left = self.xPos + '%';

    self.rafId = requestAnimationFrame(function () {
      self.run(self);
    });
  }
};