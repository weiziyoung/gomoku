
// Material path
const IMG_PATH = 'assets/image/gomoku.png';
const TOP_BOARD_PATH = 'assets/image/topboard.png';
const BLACK_STONE = 'assets/image/stone_black.png';
const WHITE_STONE = 'assets/image/stone_white.png';
const ROBOT = 'assets/image/robot.png';
const BACK = 'assets/image/back.png';
const RESTART = 'assets/image/restart.png';

// Some canvas constant
const GAP = 40;
const MARGIN = 25;
const SIZE = 590;
const OBFUSCATION_RANGE = 10;

// Game constant
const GAME_SIZE = 15;
const BLACK_AGENT = 1;
const WHITE_AGENT = 2;

// Request constant
const URL = '/react';
const LOGGING_URL = '/logging';

// map the every position to a board position
let cor_map = {};
for(let y=MARGIN;y<=SIZE;y+=GAP){
    for(let x=MARGIN;x<=SIZE;x+=GAP){
        let point_y = (y-MARGIN)/GAP;
        let point_x = (x-MARGIN)/GAP;
        for(let i=-OBFUSCATION_RANGE;i<=OBFUSCATION_RANGE;i++){
            for(let j=-OBFUSCATION_RANGE;j<=OBFUSCATION_RANGE;j++){
                cor_map[[y+i,x+j]] = [point_y, point_x]
            }
        }
    }
}
let demo_mode = false;

// board array
let board = [];
for(let y=0;y<GAME_SIZE;y++){
    board[y] = [];
    for(let x=0;x<GAME_SIZE;x++){
        board[y][x] = 0
    }
}


// The choosen agent
let player_agent = BLACK_AGENT;

// log the last move
let last_player_move_stack= [];
let last_ai_move_stack = [];

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function print_array(array){
    let s = '[';
    for(let y=0;y<15;y++){
        let temp = '[';
        for(let x=0;x<15;x++){
            s += array[y][x].toString();
            temp += s;
        }
        temp += ']';
        s += temp;
    }
    s += ']';
    console.log(s)
}