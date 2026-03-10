const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let enemies = [];
let towers = [];
let bullets = [];

let money = 100;
let lives = 10;

const path = [
    {x:0,y:200},
    {x:800,y:200}
];

function spawnEnemy(){
    enemies.push({
        x:0,
        y:200,
        hp:3,
        speed:1
    });
}

setInterval(spawnEnemy,2000);

function placeTower(){

    if(money < 50) return;

    towers.push({
        x:Math.random()*700+50,
        y:Math.random()*300+50,
        range:120,
        fireRate:60,
        cooldown:0
    });

    money -= 50;
    updateUI();
}

function update(){

    // enemigos
    enemies.forEach((e,i)=>{

        e.x += e.speed;

        if(e.x > canvas.width){
            enemies.splice(i,1);
            lives--;
            updateUI();
        }

    });

    // torres
    towers.forEach(t=>{

        if(t.cooldown > 0){
            t.cooldown--;
            return;
        }

        let target = enemies.find(e=>{
            let dx = e.x - t.x;
            let dy = e.y - t.y;
            return Math.sqrt(dx*dx+dy*dy) < t.range;
        });

        if(target){
            bullets.push({
                x:t.x,
                y:t.y,
                target:target,
                speed:4
            });

            t.cooldown = t.fireRate;
        }

    });

    // balas
    bullets.forEach((b,i)=>{

        let dx = b.target.x - b.x;
        let dy = b.target.y - b.y;

        let dist = Math.sqrt(dx*dx+dy*dy);

        b.x += dx/dist * b.speed;
        b.y += dy/dist * b.speed;

        if(dist < 5){

            b.target.hp--;

            if(b.target.hp <=0){
                let index = enemies.indexOf(b.target);
                if(index>-1){
                    enemies.splice(index,1);
                    money += 10;
                    updateUI();
                }
            }

            bullets.splice(i,1);
        }

    });

}

function draw(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    // camino
    ctx.strokeStyle="yellow";
    ctx.lineWidth=40;
    ctx.beginPath();
    ctx.moveTo(0,200);
    ctx.lineTo(800,200);
    ctx.stroke();

    // enemigos
    enemies.forEach(e=>{
        ctx.fillStyle="red";
        ctx.beginPath();
        ctx.arc(e.x,e.y,10,0,Math.PI*2);
        ctx.fill();
    });

    // torres
    towers.forEach(t=>{
        ctx.fillStyle="cyan";
        ctx.beginPath();
        ctx.arc(t.x,t.y,12,0,Math.PI*2);
        ctx.fill();
    });

    // balas
    bullets.forEach(b=>{
        ctx.fillStyle="white";
        ctx.beginPath();
        ctx.arc(b.x,b.y,4,0,Math.PI*2);
        ctx.fill();
    });

}

function loop(){
    update();
    draw();
    requestAnimationFrame(loop);
}

function updateUI(){
    document.getElementById("money").innerText = money;
    document.getElementById("lives").innerText = lives;
}

loop();
