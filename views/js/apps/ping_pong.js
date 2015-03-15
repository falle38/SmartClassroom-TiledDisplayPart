
launchPingPongGame = function (windowId, isMaster) {
    var data = {};
    var canvas = createCanvas(windowId, "PING PONG", 400, 300, "game", isMaster, true, data);
    var backing_canvas = document.getElementById("backing_canvas" + windowId);
    backing_canvas.width = canvas.width;
    backing_canvas.height = canvas.height;
    if (isMaster) {
        askTiledDisplay(windowId, "ping-pong", "PING PONG", false, data);
    }
    var game = {
        // Initialize canvas and required variables
        canvas : backing_canvas,
        //ctx = canvas.getContext("2d"), // Create canvas context
        //W = window.innerWidth, // Window's width
        //H = window.innerHeight, // Window's height
        W : backing_canvas.width, // Window's width
        H : backing_canvas.height, // Window's height
        particles : [], // Array containing particles
        ball : {}, // Ball object
        paddles : [2], // Array containing two paddles
        mouse : {}, // Mouse object to store it's current position
        points : 0, // Varialbe to store points
        fps : 60, // Max FPS (frames per second)
        particlesCount : 20, // Number of sparks when ball strikes the paddle
        flag : 0, // Flag variable which is changed on collision
        particlePos : {}, // Object to contain the position of collision 
        multiplier : 1, // Varialbe to control the direction of sparks
        startBtn : {}, // Start button object
        restartBtn : {}, // Restart button object
        over : 0, // flag varialbe, cahnged when the game is over
        init: {}, // variable to initialize animation
        paddleHit: {},
        quitBtn: { x: 0, y: 0, h: 0, w: 0 },
        areaSide : 0,
        
        
        
        // Initialise the collision sound
        collision : document.getElementById("collide"),
        
        // Set the canvas's height and width to full screen
        //canvas.width = W;
        //canvas.height = H;
        
        // Function to paint canvas
        paintCanvas : function (canvas) {
            var ctx = canvas.getContext("2d");
            //ctx.rotate(90 * Math.PI / 180);
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, this.W, this.H);
        },
        
        
        
        
        
        
        
        // Function for creating particles object
        createParticles : function (x, y, m) {
            this.x = x || 0;
            this.y = y || 0;
            
            this.radius = 1.2;
            
            this.vx = -1.5 + Math.random() * 3;
            this.vy = m * Math.random() * 1.5;
        },
        
        // Draw everything on canvas
        draw : function (canvas) {
            this.paintCanvas(canvas);
            var ctx = canvas.getContext("2d");
            
            for (var i = 0; i < this.paddles.length; i++) {
                p = this.paddles[i];
                
                ctx.fillStyle = "white";
                ctx.fillRect(p.x, p.y, p.w, p.h);
            }
            
            this.ball.draw(canvas);
            this.update(canvas);
        },
        
        // Function to increase speed after every 5 points
        increaseSpd : function () {
            if (this.points % 4 == 0) {
                if (Math.abs(this.ball.vx) < 15) {
                    this.ball.vx += (this.ball.vx < 0) ? -1 : 1;
                    this.ball.vy += (this.ball.vy < 0) ? -2 : 2;
                }
            }
        },
        
        moveBall : function () {
            this.ball.x += this.ball.vx;
            this.ball.y += this.ball.vy;
        },
        movePaddle : function (paddleId, x) {
            this.paddles[paddleId].x = x;
        },
        
        // Function to update positions, score and everything.
        // Basically, the main game logic is defined here
        update : function (canvas) {
            
            // Update scores
            this.updateScore(canvas);
            
            // Move the paddles on mouse move
            if (this.mouse.x && this.mouse.y) {
                //Move only his paddle
                this.movePaddle(1, this.mouse.x - p.w / 2);
                askRemoteGameControl(windowId, "ping-pong", "movePaddle", { "id": 2, "x": this.paddles[1].x, "W": this.W }, true);
            }
            
            if (isMaster) {
                // Move the ball
                this.moveBall();
                askRemoteGameControl(windowId, "ping-pong", "moveBall", { "x": this.ball.x, "y": this.ball.y, "W": this.W, "H": this.H }, true);
            }
            
            // Collision with paddles
            p1 = this.paddles[1];
            p2 = this.paddles[2];
            
            // If the ball strikes with paddles,
            // invert the y-velocity vector of ball,
            // increment the points, play the collision sound,
            // save collision's position so that sparks can be
            // emitted from that position, set the flag variable,
            // and change the multiplier
            if (this.collides(this.ball, p1)) {
                this.collideAction(this.ball, p1);
            }
	
	
            else if (this.collides(this.ball, p2)) {
                this.collideAction(this.ball, p2);
            } 
	
            else {
                // Collide with walls, If the ball hits the top/bottom,
                // walls, run gameOver() function
                if (this.ball.y + this.ball.r > this.H) {
                    this.ball.y = this.H - this.ball.r;
                    this.gameOver(canvas);
                } 
		
                else if (this.ball.y < 0) {
                    this.ball.y = this.ball.r;
                    this.gameOver(canvas);
                }
                
                // If ball strikes the vertical walls, invert the 
                // x-velocity vector of ball
                if (this.ball.x + this.ball.r > this.W) {
                    this.ball.vx = -this.ball.vx;
                    this.ball.x = this.W - this.ball.r;
                }
		
                else if (this.ball.x - this.ball.r < 0) {
                    this.ball.vx = -this.ball.vx;
                    this.ball.x = this.ball.r;
                }
            }
            
            
            
            // If flag is set, push the particles
            if (this.flag == 1) {
                for (var k = 0; k < this.particlesCount; k++) {
                    this.particles.push(new this.createParticles(this.particlePos.x, this.particlePos.y, this.multiplier));
                }
            }
            
            // Emit particles/sparks
            this.emitParticles(this.canvas);
            
            // reset flag
            this.flag = 0;
        },
        
        //Function to check collision between ball and one of
        //the paddles
        collides : function (b, p) {
            if (b.x + this.ball.r >= p.x && b.x - this.ball.r <= p.x + p.w) {
                if (b.y >= (p.y - p.h) && p.y > 0) {
                    this.paddleHit = 1;
                    return true;
                }
		
                else if (b.y <= p.h && p.y == 0) {
                    this.paddleHit = 2;
                    return true;
                }
		
                else return false;
            }
        },
        
        //Do this when collides == true
        collideAction : function (ball, p) {
            ball.vy = -ball.vy;
            
            if (this.paddleHit == 1) {
                ball.y = p.y - p.h;
                this.particlePos.y = ball.y + ball.r;
                this.multiplier = -1;
            }
	
            else if (this.paddleHit == 2) {
                ball.y = p.h + ball.r;
                this.particlePos.y = ball.y - ball.r;
                this.multiplier = 1;
            }
            
            this.points++;
            this.increaseSpd();
            
            if (this.collision) {
                if (this.points > 0)
                    this.collision.pause();
                
                this.collision.currentTime = 0;
                this.collision.play();
            }
            
            this.particlePos.x = ball.x;
            this.flag = 1;
        },
        
        // Function for emitting particles
        emitParticles : function (canvas) {
            var ctx = canvas.getContext("2d");
            for (var j = 0; j < this.particles.length; j++) {
                par = this.particles[j];
                
                ctx.beginPath();
                ctx.fillStyle = "white";
                if (par.radius > 0) {
                    ctx.arc(par.x, par.y, par.radius, 0, Math.PI * 2, false);
                }
                ctx.fill();
                
                par.x += par.vx;
                par.y += par.vy;
                
                // Reduce radius so that the particles die after a few seconds
                par.radius = Math.max(par.radius - 0.05, 0.0);
		
            }
        },
        
        // Function for updating score
        updateScore : function (canvas) {
            var ctx = canvas.getContext("2d");
            ctx.fillStlye = "white";
            ctx.font = "16px Arial, sans-serif";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            if (this.areaSide == 2) {
                ctx.fillText("Score: " + this.points, 20 , 20 + this.H / 2 + 10);
            }
            else {
                ctx.fillText("Score: " + this.points, 20, 20);
            }
        },
        
        // Function to run when the game overs
        gameOver : function (canvas) {
            var ctx = canvas.getContext("2d");
            ctx.fillStlye = "white";
            ctx.font = "20px Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            if (this.areaSide == 2) {
                ctx.fillText("Game Over - You scored " + this.points + " points!", this.W / 2, (this.H / 2) + 80 + 25);
            }
            else {
                ctx.fillText("Game Over - You scored " + this.points + " points!", this.W / 2, (this.H / 2) + 25);
            }
            // Stop the Animation
            cancelRequestAnimFrame(this.init);
            
            // Set the over flag
            this.over = 1;
            
            // Show the restart button
            this.restartBtn.draw(canvas);
        },
        
        
        
        // Function to execute at startup
        startScreen : function (canvas) {
            this.draw(canvas);
            this.startBtn.draw(canvas);
        },
        launchFullScreen: function () {
            fullWindowPingPong();
        },
        
        start : function () {
            animloop(this.canvas);
            // Delete the start button after clicking it
            this.startBtn = {};
        },
        restart : function () {
            this.ball.x = 20;
            this.ball.y = 20;
            this.points = 0;
            this.ball.vx = 1;
            this.ball.vy = 2;
            this.over = 0;
            animloop(this.canvas);
        }
    }
    
    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame || 
		window.oRequestAnimationFrame || 
		window.msRequestAnimationFrame ||  
		function (callback) {
            return window.setTimeout(callback, 1000 / game.fps);
        };
    })();
    
    window.cancelRequestAnimFrame = (function () {
        return window.cancelAnimationFrame ||
		window.webkitCancelRequestAnimationFrame ||
		window.mozCancelRequestAnimationFrame ||
		window.oCancelRequestAnimationFrame ||
		window.msCancelRequestAnimationFrame ||
		clearTimeout
    })();
    
    
    
    
    // Function for running the whole animation
    animloop = function () {
        game.init = requestAnimFrame(animloop);
        game.draw(game.canvas);
    }
    
    
    startPingPong = function () {
        // Function for creating paddles
        Paddle = function (pos) {
            // Height and width
            this.h = 5;
            this.w = 150;
            
            // Paddle's position
            this.x = (game.W / 2) - (this.w / 2);
            this.y = (pos == "top") ? 0 : game.H - this.h;
	
        }
        
        // Push two new paddles into the paddles[] array
        game.paddles.push(new Paddle("bottom"));
        game.paddles.push(new Paddle("top"));
        
        // Ball object
        game.ball = {
            x: 50,
            y: 50, 
            r: 5,
            c: "white",
            vx: 1,
            vy: 2,
            
            // Function for drawing ball on canvas
            draw: function (canvas) {
                var ctx = canvas.getContext("2d");
                ctx.beginPath();
                ctx.fillStyle = this.c;
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
                ctx.fill();
            }
        };
        
        
        // Start Button object
        game.startBtn = {
            w: 100,
            h: 50,
            x: game.W / 2 - 50,
            y: (game.H) / 2 - 25,
            
            draw: function (canvas) {
                var ctx = canvas.getContext("2d");
                ctx.strokeStyle = "white";
                ctx.lineWidth = "2";
                if (game.areaSide == 2) {
                    ctx.strokeRect(this.x, this.y + 40, this.w, this.h / 2);
                }
                else {
                    ctx.strokeRect(this.x, this.y, this.w, this.h);
                }
                ctx.font = "18px Arial, sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStlye = "white";
                if (game.areaSide == 2) {
                    
                    ctx.fillText("Start", this.x + 50, this.y + 50);
                }
                else {
                    ctx.fillText("Start", this.x + 50, this.y + 25);
                }
            }
        };
        
        // Restart Button object
        game.restartBtn = {
            w: 100,
            h: 50,
            x: game.W / 2 - 50,
            y: game.H / 2 - 50,
            
            draw: function (canvas) {
                var ctx = canvas.getContext("2d");
                ctx.strokeStyle = "white";
                ctx.lineWidth = "2";
                
                if (game.areaSide == 2) {
                    ctx.strokeRect(this.x, this.y + 65, this.w, this.h / 2);
                }
                else {
                    ctx.strokeRect(this.x, this.y, this.w, this.h);
                }
                
                ctx.font = "18px Arial, sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStlye = "white";
                
                if (game.areaSide == 2) {
                    ctx.fillText("Restart", this.x + 50, this.y + 65 + 15);
                }
                else {
                    ctx.fillText("Restart", this.x + 50, this.y + 25);
                }
            }
        };
        // Show the start screen
        game.startScreen(game.canvas);
    }
    cancelPingPong = function () {
        // Stop the Animation
        cancelRequestAnimFrame(game.init);
        
        // Set the over flag
        game.over = 1;
        game.paddles = [2];

    }
    
    // Track the position of mouse cursor
    trackPosition = function (e) {
        if (e.type == "touchmove") {
            var x = e.changedTouches[0].clientX;
            var y = e.changedTouches[0].clientY;
        }
        else {
            var x = e.offsetX;
            var y = e.offsetY;
        }
        //var x = (game.W * e.offsetX) / e.currentTarget.width;
        //var y = (game.H * e.offsetY) / e.currentTarget.height;
        
        game.mouse.x = x;
        game.mouse.y = y;
    };
    // On button click (Restart and start)
    btnClick = function (e) {
        //var mx = (game.W * e.offsetX) / e.currentTarget.width;
        //var my = (game.H * e.offsetY) / e.currentTarget.height;
        // Variables for storing mouse position on click
        var mx = e.offsetX;
        var my = e.offsetY;
        
        if (windowList[canvas.id].isTiled) {
            
            var startX = game.startBtn.x;
            var startY = game.startBtn.y - game.H / 2 + 50;
            console.log("MX :" + mx)
            console.log("MY :" + my)
            console.log("STARTX :" + startX)
            console.log("STARTY :" + startY)
            var startDeltaX = game.startBtn.w;
            var startDeltaY = game.startBtn.h;
            console.log("DELX :" + startDeltaX)
            console.log("DELY :" + startDeltaY)
            var restartX = game.restartBtn.x;
            var restartY = game.restartBtn.y - game.H / 2 + 50;
            var restartDeltaX = game.restartBtn.h;
            var restartDeltaY = game.restartBtn.w;
        }
        else {
            var startX = game.startBtn.x;
            var startY = game.startBtn.y;
            var startDeltaX = game.startBtn.w;
            var startDeltaY = game.startBtn.h;
            var restartX = game.restartBtn.x;
            var restartY = game.restartBtn.y;
            var restartDeltaX = game.restartBtn.w;
            var restartDeltaY = game.restartBtn.h;
        }
        
        // Click start button
        if (mx >= startX && mx <= (startX + startDeltaX) && my >= startY && my <= (startY + startDeltaY)) {
            askRemoteGameControl(windowId, "ping-pong", "start", "",true);
            game.start();
            
        }
        
        // If the game is over, and the restart button is clicked
        if (game.over == 1) {
            if (mx >= restartX && mx <= (restartX + restartDeltaX) && my >= restartY && my <= (restartY + restartDeltaY)) {
                askRemoteGameControl(windowId, "ping-pong", "restart","" ,true);
                game.restart();
                
            }
        }
        if (windowList[canvas.id].isTiled) {
            if (mx >= game.quitBtn.x && mx <= (game.quitBtn.x + game.quitBtn.w) && my >= game.quitBtn.y && my <= (game.quitBtn.y + game.quitBtn.h)) {
                askRemoteGameControl(windowId, "ping-pong", "endfullscreen", "", true);
                var eventEndFullscreen = new Event('endfullscreen');
                canvas.dispatchEvent(eventEndFullscreen);
            }
        }
    }
    
    
    function fullWindowPingPong() {
        console.log("DEDANS");
        if (!fullWindowState) {
            fullWindowState = true;
            var drawing = true;
            var windowId = canvas.id.split('canvas')[1];
            var isMaster = windowList[canvas.id].isMaster;
            
            // Canvas goes full window
            var canvasToDraw = document.getElementById('canvasFullscreen');
            launchFullScreen(document.documentElement);
            
            saveLeft = canvas.parentElement.parentElement.offsetLeft;
            saveTop = canvas.parentElement.parentElement.offsetTop;
            saveDisplay = canvas.style.display;
            canvas.style.display = "none";
            
            canvasToDraw.width = window.innerWidth;
            canvasToDraw.height = window.innerHeight;
            canvasToDraw.style.display = "block";
            saveWidth = backing_canvas.width;
            saveHeight = backing_canvas.height;
            backing_canvas.width = window.innerWidth;
            backing_canvas.height = window.innerHeight;
            game.W = backing_canvas.width;
            game.H = backing_canvas.height;
            
            var draw = canvasToDraw.getContext('2d');
            //draw.translate(canvasToDraw.width, 0);
            //draw.rotate(90 * (Math.PI / 180));
            //draw.fillStyle = "red";
            //draw.fillRect(0, backing_canvas.height - 100, 100, 100);
            
            //game.quitBtn.x = 48.5;
            //game.quitBtn.y = backing_canvas.height - 27.5;
            game.quitBtn.x = 5;
            game.quitBtn.y = backing_canvas.height - 55;
            game.quitBtn.w = 90;
            game.quitBtn.h = 50;
            draw.strokeStyle = "white";
            draw.lineWidth = "3";
            
            draw.strokeRect(game.quitBtn.x, game.quitBtn.y, game.quitBtn.w, game.quitBtn.h);
            
            draw.font = "30px Arial, sans-serif";
            draw.textAlign = "center";
            draw.textBaseline = "middle";
            draw.fillStyle = "white";
            
            draw.fillText("Quit", 48.5, backing_canvas.height - 27.5);
            
            var rows = 2;
            var cols = 1;
            var tileX = 0;
            var tileY = 0;
            var tileWidth = backing_canvas.width;
            var tileHeight = backing_canvas.height;
            
            if (windowList[canvas.id].isTiled) {
                console.log("TILED");
                game.areaSide = 2;
                tileWidth = Math.round(backing_canvas.width / cols);
                tileHeight = Math.round((backing_canvas.height) / rows);
                var tileCenterX = tileWidth / 2;
                var tileCenterY = tileHeight / 2;
                
                tileY = tileY + tileHeight;

            }
            function updateFullscreenCanvas() {
                if (!drawing) return;
                // Finally draw the image data from the temp canvas.
                draw.drawImage(backing_canvas, tileX, tileY, tileWidth, tileHeight, 0, 0, backing_canvas.width, backing_canvas.height - 55);
                
                setTimeout(updateFullscreenCanvas, 1000 / 60);
            }
            updateFullscreenCanvas();
            
            var endFullscreen = function (e) {
                cancelFullScreen(document.documentElement);
                backing_canvas.width = saveWidth;
                backing_canvas.height = saveHeight;
                game.W = backing_canvas.width;
                game.H = backing_canvas.height;
                canvas.parentElement.parentElement.style.top = saveTop + "px";
                canvas.parentElement.parentElement.style.left = saveLeft + "px";
                canvas.style.display = saveDisplay;
                reloadCanvas(canvas)
                
                canvasToDraw.style.display = "none";
                fullWindowState = false;
                drawing = false;
                windowList[canvas.id].isTiled = false;
                canvasToDraw.removeEventListener("mousemove", trackPosition, false);
                canvasToDraw.removeEventListener("touchmove", trackPosition, false);
                canvasToDraw.removeEventListener("mousedown", btnClick, false);
                canvas.removeEventListener("endfullscreen", endFullscreen, false);
                game.areaSide = 0;
                cancelPingPong();
                startPingPong();
            }
            var askEndFullscreen = function (e) {
                askRemoteGameControl(windowId, "ping-pong", "endfullscreen", "", true);
                endFullscreen();
            }
            
            canvasToDraw.addEventListener("mousemove", trackPosition, false);
            canvasToDraw.addEventListener("touchmove", trackPosition, false);
            canvasToDraw.addEventListener("mousedown", btnClick, false);
            canvas.addEventListener('endfullscreen', endFullscreen , false);
            //fullscreenButton.addEventListener('mousedown', askEndFullscreen , false);
            cancelPingPong();
            startPingPong();
        }
    }
    
    
    
    
    // Add mousemove and mousedown events to the canvas
    canvas.addEventListener("mousemove", trackPosition, true);
    canvas.addEventListener("touchmove", trackPosition, true);
    canvas.addEventListener("mousedown", btnClick, true);
    canvas.addEventListener("touchdown", btnClick, true);
    
    
    windowList[canvas.id].data = { "game": game }
    var ctx = canvas.getContext("2d");
    //ctx.translate(canvas.width, 0);
    //ctx.rotate(90 * (Math.PI / 180));
    
    function doRotate() {
        // Finally draw the image data from the temp canvas.
        ctx.drawImage(backing_canvas, 0, 0, backing_canvas.width, backing_canvas.height);
        setTimeout(doRotate, 16);
    }
    doRotate();
    
    //TEST FULLSCREEN
    //fullWindowPingPong();
    startPingPong();


    
}