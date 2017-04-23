
        window.onload = function()
        {
            // Canvas vars
            var canvas = document.getElementById("canvas");
            var ctx = canvas.getContext("2d");
            var W = window.innerWidth;
            var H = window.innerHeight;

            canvas.width = W;
            canvas.height = H;

            // Mouse pos
            var trackMouse = false;
            var mouseX = W/2;
            var mouseY = H/2;

            // Particle data
            var flames = {
                count: 200,
                list: []
            };

            // Ceiling
            // Make this false to make smoke go out from screen
            var ceiling = true;

            // Draw timer
            setInterval(draw, 33);

            // Create flame timer
            setInterval(create, 25);

            // Change canvas size on screen resize
            window.onresize = function(event)
            {
                W = window.innerWidth;
                H = window.innerHeight;

                canvas.width = W;
                canvas.height = H;
            }

            // When Space is pressed, toggle mouse tracking
            window.onkeydown = function(event)
            {
                if(event.which == 32)
                {
                    trackMouse = trackMouse ? false : true;
                }
            }
            //Update mouse positions
            document.addEventListener("mousemove", function(event)
            {
                mouseX = event.pageX;
                mouseY = event.pageY;
            });

            //Flame particle class
            function flame()
            {
                // Position
                // If trackMouse is true, use mouse coordinates otherwise use center of screen
                this.x = trackMouse ? mouseX : W / 2;
                this.y = trackMouse ? mouseY : H / 2;

                // Speed
                this.velX = ranInt(-2,2);
                this.velY = -1;

                // Radius
                this.size = 25;

                // Color (RGB)
                var red = ranInt(200,255);
                var green = 0;
                var blue = 0;

                // Opacity, changes opacity as life changes
                this.opacity = 1.0;

                // Life time
                this.maxLife = ranInt(25,40);
                this.life = this.maxLife;

                // is Smoke
                this.smoke = false;

                // is Alive (If false, create new flame)
                this.alive = true;

                this.draw = function()
                {
                    // Do not draw if is not alive
                    if(!this.alive)
                    {
                        return;
                    }

                    ctx.beginPath();
                    ctx.fillStyle = this.getRgb();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();

                    //Update flame
                    this.update();
                }
                this.update = function()
                {
                    // If life if 20% of overall life, then 1 in 5 chance of flame turning into smoke
                    //
                    if(this.life < this.maxLife * 20 / 100)
                    {
                        if(ranInt(0,5) == 5)
                        {
                            this.life = ranInt(25,50);

                            // Set smoke color to black/grey
                            var c = ranInt(0,30);
                            red = c;
                            blue = c;
                            green = c;

                            //Slow down speed
                            this.velY /= 2;

                            //Full opacity
                            this.opacity = 1;

                            this.smoke = true;
                            return;
                        }
                    }

                    // If life is below 1, set alive to false
                    if(this.life < 1)
                    {
                        this.alive = false;
                        return;
                    }

                    // While flame is inside screen, increase speed upwards, otherwise set alive to false
                    if(this.y > 0)
                    {
                        this.velY -= ranInt(0.1,0.9);
                    }
                    else
                    {
                        if(ceiling)
                        {
                            this.y = 0;
                        }
                        else
                        {
                            this.alive = false;
                            return;
                        }
                    }

                    //Decrease life
                    this.life--;

                    //Change color lighter if it is not smoke and update opacity
                    if(!this.smoke)
                    {
                        green++;
                        blue++;

                        this.opacity = this.maxLife * this.life / 1000;
                    }

                    //Update position
                    this.x += this.velX;
                    this.y += this.velY;
                }

                //Get RGB string
                this.getRgb = function()
                {
                    return "rgba("+red+","+green+","+blue+","+this.opacity+")";
                }
            }

            //Create new flame
            function create()
            {
                if(flames.list.length < flames.count && mouseX != null && mouseY != null)
                {
                    flames.list.push(new flame());
                }
            }

            //Draw background and flame particles
            function draw()
            {
                // Background
                ctx.globalCompositeOperation = "source-over";
                ctx.fillStyle = "white";
                ctx.fillRect(0,0,W,H);

                var flameCount = 0;
                var smokeCount = 0;

                // Loop through each flame and update it
                for(var i = 0; i < flames.list.length; i++)
                {
                    // If flame is not alive, replace current index with new flame and draw
                    if(!flames.list[i].alive)
                    {
                        flames.list[i] = new flame();
                    }

                    flames.list[i].draw();

                    if(flames.list[i].smoke)
                        smokeCount++;
                    else
                        flameCount++;
                }

                // Draw text on screen
                var texts = [
                    "Press Space to toggle mouse tracking",
                    "Tracking mouse: "+(trackMouse ? "Yes" : "No"),
                    "",
                    "Mouse Position: "+mouseX+", "+mouseY,
                    "Flame particles: "+flameCount,
                    "Smoke particles: "+smokeCount
                ];
                var textHeight = 25;

                ctx.font = "16px Arial";
                ctx.fillStyle = "black";

                for(var i = 0; i < texts.length; i++)
                {
                    ctx.fillText(texts[i], 15, (i+1) * textHeight);
                }
            }
            function ranInt(Min, Max)
            {
                return Math.floor(Math.random() * (Max-Min+1) + Min);
            }
        }
