class Game 
{
  constructor(){}

  getState()
  {
    var gameStateRef  = database.ref('gameState');
    gameStateRef.on("value",function(data){gameState = data.val();})
  }

  update(state)
  {
    database.ref('/').update({gameState: state});
  }

  async start()
  {
    if(gameState === 0)
    {
      player = new Player();
      var playerCountRef = await database.ref('playerCount').once("value");
      if(playerCountRef.exists())
      {
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form()
      form.display();
    }

    car1 = createSprite(100,200);
    car1.addImage("car1",car1_img);
    car2 = createSprite(300,200);
    car2.addImage("car2",car2_img);
    car3 = createSprite(500,200);
    car3.addImage("car3",car3_img);
    car4 = createSprite(700,200);
    car4.addImage("car4",car4_img);
    cars = [car1, car2, car3, car4];
  }

  play()
  {
    form.hide();
    
    Player.getPlayerInfo();
    Player.getCarsAtEnd();//Change 4 P should be capital as getCarsAtEnd is static function.
    
    if(allPlayers !== undefined)
    {
      background(rgb(198,135,103));
      image(track, 0,-displayHeight*4,displayWidth, displayHeight*5);
      
      //index of the array
      var index = 0;

      //x and y position of the cars
      var x = 70 ;
      var y;

      for(var plr in allPlayers)
      {
        //add 1 to the index for every loop
        index = index + 1 ;

        //position the cars a little away from each other in x direction
        x = x + 180;
        //use data form the database to display the cars in y direction
        y = displayHeight - allPlayers[plr].distance;
        cars[index-1].x = x;
        cars[index-1].y = y;
    
        if (index === player.index)
        {
          stroke(10);
          fill("red");
          ellipse(x,y,60,60);
          cars[index - 1].shapeColor = "red";
          camera.position.x = displayWidth/2;
          camera.position.y = cars[index-1].y;
        }
      }
    }

    if(keyIsDown(UP_ARROW) && player.index !== null)
    {
      player.distance +=10;
      console.log(player.distance);
      player.update();
    }

    if(player.distance > 3860)
    {
      gameState = 2;
      //player.rank +=1;
      //change 2: here player.rank after car reaches the finish line so player.rank should carsAtEnd +1
      player.rank = carsAtEnd + 1;;
      Player.updateCarsAtEnd(player.rank);
     // change3:  HEre we are calling updateRank Function to update players rank and index number.
      player.updateRank(player.index,player.rank);
    }
   
    drawSprites();
  }

  end()
  {
    console.log("Game Ended");
    console.log(player.rank);
    //change 7:
    if(carsAtEnd === 4){
      background("pink");

      textSize(25);
      fill("black");
      
      camera.position.x = displayWidth/2;
      camera.position.y = displayHeight/2;

      var yPos = displayHeight/3+150;
      textSize(35)
      text( "LEADERBOARD", displayWidth/2, displayHeight/3)
      
      for(var plr in allPlayers){
             
              text(allPlayers[plr].name +" : "+ allPlayers[plr].rank , displayWidth/2- 50, yPos);
              yPos += 50;
      
      }
    }
  }
}
