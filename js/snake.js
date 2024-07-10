const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20;
let snake;
let direction;
let food;
let game;
let score;
let highScore = localStorage.getItem("snake-highScore") || 0;
let foodTimeout; // 用于清除食物的计时器

document.getElementById("highScore").innerText = "High Score: " + highScore;

document.getElementById("startButton").addEventListener("click", startGame);
document.addEventListener("keydown", directionControl);
document
  .getElementById("upButton")
  .addEventListener("click", () => setDirection("UP"));
document
  .getElementById("downButton")
  .addEventListener("click", () => setDirection("DOWN"));
document
  .getElementById("leftButton")
  .addEventListener("click", () => setDirection("LEFT"));
document
  .getElementById("rightButton")
  .addEventListener("click", () => setDirection("RIGHT"));

function startGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = "";
  score = 0;
  updateScore();
  generateFood();
  document.getElementById("startImage").style.display = "none";
  document.getElementById("gameRules").style.display = "none";
  document.getElementById("gameCanvas").style.display = "block";
  document.getElementById("controlButtons").style.display = "flex";
  document.getElementById("startButton").style.display = "none";
  document.getElementById("gameOverMessage").style.display = "none";
  document.getElementById("newHighScoreMessage").style.display = "none";
  document.getElementById("score").style.display = "block"; // 显示分数
  draw(); // 立即绘制一次
  clearInterval(game);
  game = setInterval(draw, 100);
}

function directionControl(event) {
  if (event.keyCode == 37 && direction != "RIGHT") {
    direction = "LEFT";
  } else if (event.keyCode == 38 && direction != "DOWN") {
    direction = "UP";
  } else if (event.keyCode == 39 && direction != "LEFT") {
    direction = "RIGHT";
  } else if (event.keyCode == 40 && direction != "UP") {
    direction = "DOWN";
  }
}

function setDirection(newDirection) {
  if (newDirection == "LEFT" && direction != "RIGHT") {
    direction = "LEFT";
  } else if (newDirection == "UP" && direction != "DOWN") {
    direction = "UP";
  } else if (newDirection == "RIGHT" && direction != "LEFT") {
    direction = "RIGHT";
  } else if (newDirection == "DOWN" && direction != "UP") {
    direction = "DOWN";
  }
}

function generateFood() {
  let validPosition = false;
  while (!validPosition) {
    const foodType = Math.random();
    let color, shape;
    if (foodType < 0.05) {
      color = "orange"; // 橘色菱形食物
      shape = "diamond";
    } else if (foodType < 0.15) {
      color = "blue"; // 蓝色圆形食物
      shape = "circle";
    } else {
      color = "red"; // 红色圆形食物
      shape = "circle";
    }
    food = {
      x: Math.floor(Math.random() * 19 + 1) * box,
      y: Math.floor(Math.random() * 19 + 1) * box,
      color: color,
      shape: shape,
    };

    // 检查食物是否生成在蛇的身体上
    validPosition = true;
    for (let i = 0; i < snake.length; i++) {
      if (food.x == snake[i].x && food.y == snake[i].y) {
        validPosition = false;
        break;
      }
    }

    if (color === "orange") {
      clearTimeout(foodTimeout);
      foodTimeout = setTimeout(() => {
        generateFood();
      }, 5000);
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 绘制蛇头
  ctx.fillStyle = "green";
  ctx.beginPath();
  let head = snake[0];
  if (direction == "LEFT") {
    ctx.moveTo(head.x + box, head.y);
    ctx.lineTo(head.x, head.y + box / 2);
    ctx.lineTo(head.x + box, head.y + box);
  } else if (direction == "UP") {
    ctx.moveTo(head.x, head.y + box);
    ctx.lineTo(head.x + box / 2, head.y);
    ctx.lineTo(head.x + box, head.y + box);
  } else if (direction == "RIGHT") {
    ctx.moveTo(head.x, head.y);
    ctx.lineTo(head.x + box, head.y + box / 2);
    ctx.lineTo(head.x, head.y + box);
  } else if (direction == "DOWN") {
    ctx.moveTo(head.x, head.y);
    ctx.lineTo(head.x + box / 2, head.y + box);
    ctx.lineTo(head.x + box, head.y);
  } else {
    ctx.moveTo(head.x + box / 2, head.y);
    ctx.lineTo(head.x, head.y + box);
    ctx.lineTo(head.x + box, head.y + box);
  }
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "black";
  ctx.stroke();

  // 绘制蛇身体
  for (let i = 1; i < snake.length; i++) {
    ctx.fillStyle = "#d8d6ca";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = "black";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  // 绘制食物
  ctx.fillStyle = food.color;
  if (food.shape === "circle") {
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, 2 * Math.PI);
    ctx.fill();
  } else if (food.shape === "diamond") {
    ctx.beginPath();
    ctx.moveTo(food.x + box / 2, food.y);
    ctx.lineTo(food.x, food.y + box / 2);
    ctx.lineTo(food.x + box / 2, food.y + box);
    ctx.lineTo(food.x + box, food.y + box / 2);
    ctx.closePath();
    ctx.fill();
  }

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction == "LEFT") snakeX -= box;
  if (direction == "UP") snakeY -= box;
  if (direction == "RIGHT") snakeX += box;
  if (direction == "DOWN") snakeY += box;

  if (snakeX == food.x && snakeY == food.y) {
    if (food.color == "orange") {
      score += 30; // 橘色菱形食物得分为30
      clearTimeout(foodTimeout); // 吃掉橘色食物时清除计时器
    } else if (food.color == "blue") {
      score += 20; // 蓝色圆形食物得分为20
    } else {
      score += 10; // 红色圆形食物得分为10
    }
    updateScore();
    generateFood();
  } else {
    snake.pop();
  }

  let newHead = { x: snakeX, y: snakeY };

  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    document.getElementById("startButton").style.display = "block";
    document.getElementById("controlButtons").style.display = "none";
    document.getElementById("gameOverMessage").style.display = "block";

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("snake-highScore", highScore);
      document.getElementById("highScore").innerText =
        "High Score: " + highScore;
      document.getElementById("newHighScoreMessage").style.display = "block";
      setTimeout(() => {
        document.getElementById("newHighScoreMessage").style.display = "none";
      }, 3000);
    }

    return;
  }

  snake.unshift(newHead);
}

function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x == array[i].x && head.y == array[i].y) {
      return true;
    }
  }
  return false;
}

function updateScore() {
  document.getElementById("score").innerText = "Score: " + score;
}

// 根据浏览器语言设置内容
function setLanguageContent() {
  const userLang = navigator.language || navigator.userLanguage;
  const gameTitle = document.getElementById("gameTitle");
  const rulesTitle = document.getElementById("rulesTitle");
  const rulesText = document.getElementById("rulesText");
  const startButton = document.getElementById("startButton");
  const gameOverMessage = document.getElementById("gameOverMessage");
  const newHighScoreMessage = document.getElementById("newHighScoreMessage");
  const score = document.getElementById("score");
  const highScore = document.getElementById("highScore");

  if (userLang.startsWith("zh-CN")) {
    document.title = "AI 游戏生成实验室- 贪吃蛇游戏";
    gameTitle.innerText = "贪吃蛇";
    rulesTitle.innerText = "游戏规则";
    rulesText.innerHTML =
      "使用方向键或按钮控制蛇的移动。<br>红色食物得10分。<br>蓝色食物得20分。<br>橘色菱形食物得30分，5秒内未被吃掉会消失。";
    startButton.innerText = "开始游戏";
    gameOverMessage.innerText = "游戏结束";
    newHighScoreMessage.innerText = "新最高分！";
    score.innerText = "分数: 0";
    highScore.innerText = "最高分: " + highScore.innerText.split(": ")[1];
  } else if (userLang.startsWith("zh-TW") || userLangstartswith("zh-HK")) {
    document.title = "AI 遊戲生成實驗室- 貪吃蛇遊戲";
    gameTitle.innerText = "貪吃蛇";
    rulesTitle.innerText = "遊戲規則";
    rulesText.innerHTML =
      "使用方向鍵或按鈕控制蛇的移動。<br>紅色食物得10分。<br>藍色食物得20分。<br>橘色菱形食物得30分，5秒內未被吃掉會消失。";
    startButton.innerText = "開始遊戲";
    gameOverMessage.innerText = "遊戲結束";
    newHighScoreMessage.innerText = "新最高分！";
    score.innerText = "分數: 0";
    highScore.innerText = "最高分: " + highScore.innerText.split(": ")[1];
  } else {
    // 默认显示英文
    document.title = "AI Game Generation Lab - Snake Game";
    gameTitle.innerText = "Snake Game";
    rulesTitle.innerText = "Game Rules";
    rulesText.innerHTML =
      "Use arrow keys or buttons to control the snake.<br>Red food is worth 10 points.<br>Blue food is worth 20 points.<br>Orange diamond-shaped food is worth 30 points, but it disappears after 5 seconds if not eaten.";
    startButton.innerText = "Start Game";
    gameOverMessage.innerText = "Game Over";
    newHighScoreMessage.innerText = "New High Score!";
    score.innerText = "Score: 0";
    highScore.innerText = "High Score: " + highScore.innerText.split(": ")[1];
  }
}

setLanguageContent();
