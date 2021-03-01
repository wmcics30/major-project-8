# Major Project Reflection

## What advice would I give myself if I was to start a project like this again?

  I personally think I had a good approach and did a pretty good job overall managing my time and solving problems. I storyboarded my ideas so I 
  could follow it easily and planned my days accordingly. But I think one small piece of advice I'd give myself is to not be afraid to be more ambitious with
  the seemingly smaller parts of the project. For example, my lobby in the game looks quite plain, and only later on did I think of adding more interactions to
  make it less plain. But at that point, finals were coming up, and I had to hold myself back on doing so.


## Did I complete everything in my "needs to have" list?

  To my relief, yes I did. In fact, in my "needs to have" list, I only said to have a part of the carrot game finished, but I completed it entirely. It is quite
  simple, but it is finished. I was a little concerned about how much time I would have to complete everything, and if I would be able to problem solve on my own
  on days I wasn't in class with the teacher, but I am happy that I was able to do so on my own.


## Problem 1: Problems with looping background music

  I called my background music looping code in my setup, but I also had parts in my code where I had to call the setup function quite frequently. This would make
  the background music loop on top of each other, and even if I called a stop function before it started, it sounded really awkward that the background music would stop and
  start over time to time. I had to make a variable that detected whether or not it was the first time the setup was called, and whether it should play the background music,
  depending on which part of the game it was at (e.g. lobby? Mini-games?).
  
## Problem 2: Timer intervals

  For my carrot game, I needed a timer to spawn carrots at a set interval. But using the window.setInterval() function made it so that spawning carrots would build up at the top
  when the game's tab wasn't open, and then all of the carrots would fall down once the tab was open. To solve this, I created the class Timer so that it would spawn carrots at
  an interval but not stack them up if the game was not on the active tab.

  
## What was the hardest part?

  I think the hardest part about my project was using the ShopObject class. I thought it wouldn't be elegant or efficient if I made another class for items in the wardrobe, so I 
  wanted to reuse the ShopObject class. That made things a little bit more complicated in my mind and I needed to do a lot of thinking and problem-solving in order to get things
  to work. I had to add separate variables for when the item was in the shop or in the wardrobe, and doing the math to solve where the item should be (which y-coordinate and page)
  forced my brain to do a bit more work as well.
  
  
## Were there any problems you couldn't solve?

  I don't think so. I used a lot of my problem-solving skills and spent a lot of time trouble-shooting and re-checking my code. For example, when I noticed something went wrong
  after waiting a few seconds, I was able to recognize it had something to do with my usage of millis(). I used a lot of console.log() to see where exactly my code wouldn't run 
  properly and I managed to solve all the problems I recognized.
