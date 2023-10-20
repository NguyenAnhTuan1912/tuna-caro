# Caro game
I build a real-time caro game with React, Socket and Express.

## About
Let me talk something about this project.

### The idea
Follow [https://learnplaywin.net/caro/](https://learnplaywin.net/caro/):
*Caro (the Vietnamese name) is a a board game based on the popular Japanese strategy board game called Gomoku. It is also known in other versions as Five in a Row or Gobang. The game is played on a 15 x 15 grid or sometimes on a 19 x 19 grid, depending on the version. Caro is somewhat similar to Tic Tac Toe except that the former requires the player to be able to create an unbroken row of five symbols whereas Tic Tac Toe is played on a 3 x 3 grid and only requires the player to create an unbroken row of three symbols to win.*

So I want to make my own caro game with React, Express and SocketIO and learn from it as the same time!

### The codebase
This project is the first time I use OOP in Javascript App, especially React App.
So weird, right? But I want to try to combine the React Architecture with OOP, and
watch the difference.

State in React is an non-functional object, that mean it doesn't contains any methods. If
I want to change the state, I need to change directly on its properties.
So I want to defined methods for state for easier state updating. The result is my expected,
it work quite perfectly and there are some pros and cons:

__Pros__
- Make the state updating is clearer.
- Can collect state updatings in one method.
- Control state updateings better.

__Cons__
- That mean the state can be change outside the `setState` function. You know what does it mean!
- Redux cannot catch the state update. If I want to change a state in redux, components subscribe to this state won't re-render. I catch everything well at this time, so there aren't any problems.