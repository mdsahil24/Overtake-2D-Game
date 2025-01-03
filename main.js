const config = {
    type: Phaser.AUTO,
    width: 1414,
    height: 629,
    physics: {
        default: 'arcade',
        arcade: { debug: false },
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
    scale: {
        mode: Phaser.Scale.FIT, // Fit the canvas to the available space
        autoCenter: Phaser.Scale.CENTER_BOTH, // Center the game on the screen
    },
};
const game = new Phaser.Game(config);


function preload() {
    // Load assets
    this.load.image('playerCar', 'assets/station.png');
    this.load.image('policeCar', 'assets/police.png');
    this.load.image('road', 'assets/image.png');
    this.load.image('heart', 'assets/heart.png');
    this.load.image('background', 'assets/city.png');

    // Load public cars
    this.load.image('ambulance', 'assets/ambulance.png');
    this.load.image('busSchool', 'assets/bus_school.png');
    this.load.image('bus', 'assets/bus.png');
    this.load.image('firetruck', 'assets/firetruck.png');
    this.load.image('riot', 'assets/riot.png');
    this.load.image('sedanBlue', 'assets/sedan_blue.png');
    this.load.image('sedan', 'assets/sedan.png');
    this.load.image('sportsGreen', 'assets/sports_green.png');
    this.load.image('sportsRed', 'assets/sports_red.png');
    this.load.image('suvClosed', 'assets/suv_closed.png');
    this.load.image('suvGreen', 'assets/suv_green.png');
    this.load.image('suvLarge', 'assets/suv_large.png');
    this.load.image('suv', 'assets/suv.png');
    this.load.image('taxi', 'assets/taxi.png');
    this.load.image('towtruck', 'assets/towtruck.png');
    this.load.image('tractor', 'assets/tractor.png');
    this.load.image('truck', 'assets/truck.png');
    this.load.image('truckCabin', 'assets/truckcabin.png');
    this.load.image('truckDelivery', 'assets/truckdelivery.png');
    this.load.image('truckTank', 'assets/trucktank.png');
}

let gameStarted = false;

function create() {
    // Add road background
    this.road = this.add.tileSprite(
        window.innerWidth / 2,
        window.innerHeight / 2,
        0,
        0,
        'road'
    );
    this.road.setDisplaySize(window.innerWidth, window.innerHeight);

    const customWidth = 1724; // Example width
    const customHeight = 372; // Example height

    this.background1 = this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.background2 = this.add.image(this.background1.width, 0, 'background').setOrigin(0, 0);
    this.background1.setDisplaySize(customWidth, customHeight);
    this.background2.setDisplaySize(customWidth, customHeight);
    // Set the scroll speed
    this.scrollSpeed = 1; // Adjust speed as needed

    // Game title
    this.gameTitle = this.add.text(window.innerWidth / 2, 50, 'Overtake', {
        fontSize: '40px',
        fill: '#ffffff',
        fontStyle: 'bold',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: { x: 8, y: 3 },
        shadow: {
            offsetX: 2, // Horizontal shadow offset
            offsetY: 2, // Vertical shadow offset
            color: '#000', // Shadow color
            blur: 4, // Blur effect
            fill: true, // Apply shadow to the fill
        },
    }).setOrigin(0.5);

    // Player car
    this.playerCar = this.physics.add.sprite(200, lanes[1], 'playerCar');
    this.playerCar.setCollideWorldBounds(true);
    this.playerCar.setScale(2.7);

    // Traffic group
    this.traffic = this.physics.add.group();

    // Hearts (lives)
    this.lives = 3;
    this.hearts = [];
    
    for (let i = 0; i < this.lives; i++) {
        // Create shadow heart (darker and offset)
        this.add.image(1300 + i * 40 + 2, 25 + 2, 'heart') // Offset shadow by 2px to the right and down
            .setScale(0.03)
            .setTint(0x000000)  // Dark color for shadow (black)
            .setAlpha(0.5);  // Semi-transparent shadow
    
        // Create actual heart
        this.hearts.push(this.add.image(1300 + i * 40, 25, 'heart').setScale(0.03));
    }

    // Input keys
    this.cursors = this.input.keyboard.createCursorKeys();

    // Collision detection
    this.physics.add.overlap(this.playerCar, this.traffic, handleCollision, null, this);

    // High score
    this.highScore = localStorage.getItem('highScore') || 0;

    // Initialize score, speed, and game state
    this.score = 0;
    this.isGameOver = false;
    this.playerSpeed = 350; // Initial speed of the player's car
    this.speedIncreaseThreshold = 100; // The next score milestone to increase speed

    // Display score
    this.scoreText = this.add.text(10, 10, 'Score: 0', {
        fontSize: '20px',
        fill: '#fff',
        fontStyle: 'bold',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: { x: 8, y: 3 },
        shadow: {
            offsetX: 2, // Horizontal shadow offset
            offsetY: 2, // Vertical shadow offset
            color: '#000', // Shadow color
            blur: 4, // Blur effect
            fill: true, // Apply shadow to the fill
        },
    });

    // Display high score
    this.highScoreText = this.add.text(10, 40, `High Score: ${this.highScore}`, {
        fontSize: '20px',
        fill: '#fff',
        fontStyle: 'bold',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: { x: 8, y: 3 },
        shadow: {
            offsetX: 2, // Horizontal shadow offset
            offsetY: 2, // Vertical shadow offset
            color: '#000', // Shadow color
            blur: 4, // Blur effect
            fill: true, // Apply shadow to the fill
        },
    });

    if (!gameStarted) {
        // Start button
        const startButton = this.add.text(window.innerWidth / 2, window.innerHeight / 2 + 100, 'Start Game', {
            fontSize: '30px',
            fill: '#fff',
            fontStyle: 'bold',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: { x: 8, y: 3 },
            shadow: {
                offsetX: 2, // Horizontal shadow offset
                offsetY: 2, // Vertical shadow offset
                color: '#000', // Shadow color
                blur: 4, // Blur effect
                fill: true, // Apply shadow to the fill
            },
        }).setOrigin(0.5).setInteractive();

        // Start the game when the button is clicked
        startButton.on('pointerdown', () => {
            gameStarted = true;
            // Set a random delay to control spawn rate and prevent rapid spawning
            const spawnDelay = 500
            this.trafficSpawnTimer = this.time.addEvent({
                delay: spawnDelay,
                callback: spawnTraffic,
                callbackScope: this,
                loop: true,
            });
            startButton.setVisible(false); // Hide the start button once clicked
        });
    }
}

// Predefined lane positions
const lanes = [390, 470, 520, 590];

function spawnTraffic() {

    if (!gameStarted) return; // Don't spawn traffic if the game hasn't started yet

    const publicCars = [
        'ambulance', 'busSchool', 'bus', 'firetruck', 'riot',
        'sedanBlue', 'sedan', 'sportsGreen', 'sportsRed',
        'suvClosed', 'suvGreen', 'suvLarge', 'suv', 'taxi', 'towtruck',
        'tractor', 'truck', 'truckCabin', 'truckDelivery', 'truckTank',
    ];

    const carType = Phaser.Math.Between(0, 5) === 0 ? 'policeCar' : publicCars[Phaser.Math.Between(0, publicCars.length - 1)];
    const lane = lanes[Phaser.Math.Between(0, lanes.length - 1)];

    // If there are cars in the lane, ensure enough gap before spawning
    const minGap = 150; // Minimum gap in pixels between cars
    let canSpawn = true;
    this.traffic.getChildren().forEach((car) => {
        if (Math.abs(car.y - lane) < 10 && car.x > window.innerWidth - minGap) {
            canSpawn = false;
        }
    });

    // Spawn a new car only if there's enough gap
    if (canSpawn) {
        const car = this.traffic.create(window.innerWidth + 100, lane, carType);
        car.setVelocityX(-this.playerSpeed + 80); // Cars move slightly slower than the player's speed
        car.body.setImmovable(true);
        car.setScale(2.4);
    }
}


function update() {
    if (!this.isGameOver) {
        // Scroll road background
        this.road.tilePositionX += this.playerSpeed / 20;

        // Player controls
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
            // Move to the previous lane if not already at the top
            const currentLaneIndex = lanes.indexOf(this.playerCar.y);
            if (currentLaneIndex > 0) {
                this.playerCar.y = lanes[currentLaneIndex - 1];
            }
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
            // Move to the next lane if not already at the bottom
            const currentLaneIndex = lanes.indexOf(this.playerCar.y);
            if (currentLaneIndex < lanes.length - 1) {
                this.playerCar.y = lanes[currentLaneIndex + 1];
            }
        }
        
        if (gameStarted) {
            // Update score
            this.score += 0.1;
            this.scoreText.setText(`Score: ${Math.floor(this.score)}`);

            // Adjust traffic spawn rate based on score
            if (Math.floor(this.score) >= this.speedIncreaseThreshold) {
                this.playerSpeed += 50; // Increase the player's speed
                this.speedIncreaseThreshold += 100; // Set the next milestone

                // Decrease spawn delay to increase traffic density
                if (this.spawnDelay > 50) { // Avoid spawn delay going too low
                    this.spawnDelay = Math.max(this.spawnDelay - 200, 50); // Ensure a minimum delay of 100ms
                    this.trafficSpawnTimer.remove(); // Remove the old timer
                    this.trafficSpawnTimer = this.time.addEvent({
                        delay: this.spawnDelay,
                        callback: spawnTraffic,
                        callbackScope: this,
                        loop: true,
                    });
                }

                // Update the speed of existing cars
                this.traffic.children.iterate((car) => {
                    if (car) {
                        car.setVelocityX(-this.playerSpeed + 50); // Update velocity to match new speed
                    }
                });
            }
        }
    }

    // Remove off-screen cars
    this.traffic.children.iterate((car) => {
        if (car && car.x < -50) {
            car.destroy();
        }
    });

    // Move the backgrounds
    this.background1.x -= this.scrollSpeed;
    this.background2.x -= this.scrollSpeed;

    // Reset position when the background goes off-screen
    if (this.background1.x + this.background1.width <= 0) {
        this.background1.x = this.background2.x + this.background2.width;
    }

    if (this.background2.x + this.background2.width <= 0) {
        this.background2.x = this.background1.x + this.background1.width;
    }
}


function handleCollision(player, car) {
    if (car.texture.key === 'policeCar') {
        gameOver.call(this, '🚨You are arrested!🚨');
    } else {
        car.destroy();
        this.lives--;

        if (this.lives > 0) {
            this.hearts[this.lives].setVisible(false);
        } else {
            gameOver.call(this, 'Game Over');
        }
    }
}

function gameOver(message) {
    this.isGameOver = true;
    this.physics.pause();

    // Stop the traffic spawn timer
    if (this.trafficSpawnTimer) {
        this.trafficSpawnTimer.paused = true;
    }

    // Hide all hearts
    this.hearts.forEach((heart) => {
        heart.setVisible(false);
    });
    
    // Update high score if the current score is higher
    if (Math.floor(this.score) > this.highScore) {
        this.highScore = Math.floor(this.score);
        localStorage.setItem('highScore', this.highScore);
    }

    this.highScoreText.setText(`High Score: ${this.highScore}`);

    // Display game over message
    this.add.text(window.innerWidth / 2, window.innerHeight / 2, message, {
        fontSize: '40px',
        fill: '#f00',
        fontStyle: 'bold',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: { x: 8, y: 3 },
        shadow: {
            offsetX: 2, // Horizontal shadow offset
            offsetY: 2, // Vertical shadow offset
            color: '#000', // Shadow color
            blur: 4, // Blur effect
            fill: true, // Apply shadow to the fill
        },
    }).setOrigin(0.5);

    // Display restart button
    const restartButton = this.add.text(window.innerWidth / 2, window.innerHeight / 2 + 50, 'Restart', {
        fontSize: '30px',
        fill: '#fff',
        fontStyle: 'bold',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: { x: 8, y: 3 },
        shadow: {
            offsetX: 2, // Horizontal shadow offset
            offsetY: 2, // Vertical shadow offset
            color: '#000', // Shadow color
            blur: 4, // Blur effect
            fill: true, // Apply shadow to the fill
        },
    }).setOrigin(0.5).setInteractive();

    // Restart the scene when the button is clicked
    restartButton.on('pointerdown', () => {
        gameStarted = false; // Reset gameStarted
        this.scene.restart();
    });
}
