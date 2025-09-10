const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 60,
  width: 50,
  height: 40,
  color: "#30f030",
  speed: 8,
};

let bullets = [];
const bulletWidth = 3;
const bulletHeight = 15;
const bulletSpeed = 12;

let enemies = [];
const enemyWidth = 40;
const enemyHeight = 40;
const enemySpeed = 2;
let enemySpawnRate = 60;
let enemyCounter = 0;

let score = 0;

let keys = {};
let gameActive = true;

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  if (e.key === " " && gameActive) {
    bullets.push({
      x: player.x + player.width / 2 - bulletWidth / 2,
      y: player.y,
      width: bulletWidth,
      height: bulletHeight,
      color: "#fff",
    });
    e.preventDefault();
  }
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

canvas.addEventListener("click", () => {
  if (!gameActive) {
    restartGame();
  }
});

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  if (mouseX >= 0 && mouseX <= canvas.width - player.width) {
    player.x = mouseX;
  }
});

function restartGame() {
  player.x = canvas.width / 2 - player.width / 2;
  bullets = [];
  enemies = [];
  score = 0;
  gameActive = true;
}

function gameLoop() {
  if (!gameActive) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (keys["ArrowLeft"] && player.x > 0) {
    player.x -= player.speed;
  }
  if (keys["ArrowRight"] && player.x < canvas.width - player.width) {
    player.x += player.speed;
  }

  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
  // Add cockpit
  ctx.fillStyle = "#00f";
  ctx.fillRect(player.x + 20, player.y + 10, 10, 15);

  bullets = bullets.filter(bullet => {
    bullet.y -= bulletSpeed;
    ctx.fillStyle = bullet.color;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    return bullet.y > 0;
  });

  enemyCounter++;
  if (enemyCounter >= enemySpawnRate) {
    enemyCounter = 0;
    const enemyX = Math.random() * (canvas.width - enemyWidth);
    enemies.push({
      x: enemyX,
      y: -enemyHeight,
      width: enemyWidth,
      height: enemyHeight,
      color: "#f03030",
    });
  }

  enemies = enemies.filter(enemy => {
    enemy.y += enemySpeed;
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(enemy.x + 10, enemy.y + 10, 5, 5);
    ctx.fillRect(enemy.x + 25, enemy.y + 10, 5, 5);

    if (collides(enemy, player)) {
      gameOver();
    }
    return enemy.y < canvas.height;
  });

  bullets.forEach((bullet, bIndex) => {
    enemies.forEach((enemy, eIndex) => {
      if (collides(bullet, enemy)) {
        bullets.splice(bIndex, 1);
        enemies.splice(eIndex, 1);
        score += 10;
      }
    });
  });

  ctx.fillStyle = "#fff";
  ctx.font = "24px Arial";
  ctx.fillText(`Score: ${score}`, 20, 30);

  requestAnimationFrame(gameLoop);
}

function collides(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function gameOver() {
  gameActive = false;
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f00";
  ctx.font = "48px Arial";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 40);
  ctx.fillStyle = "#fff";
  ctx.font = "28px Arial";
  ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
  ctx.font = "20px Arial";
  ctx.fillText("Play Again in 5 Seconds", canvas.width / 2, canvas.height / 2 + 50);

  setTimeout(function () {
    restartGame();
    gameLoop();
  }, 5000);
}


restartGame();
gameLoop();
