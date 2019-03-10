// loading the top board
let top_board = document.getElementById('topboard');
const top_board_image = new Image();
top_board_image.src = TOP_BOARD_PATH;
let tp_canvas = top_board.getContext('2d');
const back_image = new Image();
back_image.src = BACK;
const restart_image = new Image();
restart_image.src = RESTART;
const white_stone = new Image;
white_stone.src = WHITE_STONE;
const robot = new Image;
robot.src = ROBOT;

top_board_image.onload = function(){
    tp_canvas.drawImage(top_board_image, 0, 0, 615, 100);
    tp_canvas.drawImage(back_image, 50, 20, 40, 70);
    tp_canvas.drawImage(restart_image, 150, 20, 40, 70);
    tp_canvas.drawImage(white_stone, 250, 20,40, 70);
    tp_canvas.drawImage(robot, 350, 20,40,70);
    ctx.fillStyle = "#000000";
    tp_canvas.fillRect(450, 20, 40, 70);
    ctx.fillStyle = "#ffffff";
    tp_canvas.fillRect(550, 20, 40, 70);
    ctx.fillStyle = "#FF0000";
};

top_board.addEventListener("mousemove",function(e){
    if((50<=e.offsetX && e.offsetX <=90 &&e.offsetY>20 && e.offsetY<90)||
        (150<=e.offsetX && e.offsetX<190 && e.offsetY > 20 && e.offsetY < 90)||
        (250<=e.offsetX && e.offsetX <=290 && e.offsetY>20 && e.offsetY < 90)||
        (350<=e.offsetX && e.offsetX <=390 && e.offsetY>20 && e.offsetY < 90)){
            top_board.style.cursor = 'pointer';
    }
    else{
        top_board.style.cursor = 'auto'
    }
});


function restart(){
    // clean board
    for(let y=0;y<GAME_SIZE;y++){
        for(let x=0;x<GAME_SIZE;x++){
            board[y][x] = 0;
        }
    }
    // clean stack
    last_player_move_stack = [];
    last_ai_move_stack = [];
    // draw board
    draw_board(board);
}

top_board.addEventListener("mousedown", function(e){
    demo_mode = false;
    // back
    if (50<=e.offsetX && e.offsetX <=90 &&e.offsetY>20 && e.offsetY<90){
        let player_move = last_player_move_stack.pop();
        board[player_move[0]][player_move[1]] = 0;
        let ai_move = last_ai_move_stack.pop();
        board[ai_move[0]][ai_move[1]] = 0;
        draw_board(board);
    }
    // restart
    if (150<=e.offsetX && e.offsetX<190 && e.offsetY > 20 && e.offsetY <90){
        restart();
    }
    // ai start
    if (250<=e.offsetX && e.offsetX <=290 && e.offsetY>20 && e.offsetY < 90)  {
        for(let y=0;y<GAME_SIZE;y++){
            for(let x=0;x<GAME_SIZE;x++){
                board[y][x] = 0;
            }
        }
        board[7][7] = BLACK_AGENT;
        draw_board(board);
        last_player_move_stack = [];
        last_ai_move_stack = [[7,7]];
        player_agent = WHITE_AGENT;
    }
    // demonstrate mode
    if (450<=e.offsetX && e.offsetX <=500&& e.offsetY>20 && e.offsetY < 90)  {
        alert('demo black mode has been open');
        demo_mode = true;
        player_agent = BLACK_AGENT;
    }
    if (550<=e.offsetX && e.offsetX <=600&& e.offsetY>20 && e.offsetY < 90) {
        alert('demo white mode has been open');
        demo_mode = true;
        player_agent = WHITE_AGENT;
    }
    // ai vs ai
    if (350<=e.offsetX && e.offsetX <=390 && e.offsetY>20 && e.offsetY < 90) {
        restart();
        let ai_a = BLACK_AGENT;
        let ai_b = WHITE_AGENT;
        board[7][7] = ai_a;
        let pos = [7, 7];
        last_player_move_stack.push(pos);
        let index = 0;
        let move_stack;
        let agent;
        let depth;
        let quit = false;
        let flag = false;

        while (true) {
            console.log('loop'+index);
            if (!(index % 2)) {
                agent = ai_a;
                move_stack = last_player_move_stack;
                depth = 2;
            }
            else {
                agent = ai_b;
                move_stack = last_ai_move_stack;
                depth = 4;
            }
            let data = {
                'state': board,
                'agent': agent,
                'pos': [pos[0], pos[1]],
                'depth': depth
            };
            console.log('data', data);

            $.ajax({
                type: 'POST',
                url: URL,
                async:false,
                data: {'data': JSON.stringify(data)},
                success: function (raw_res) {
                    flag = true;
                    let res = JSON.parse(raw_res);
                    if (res['status']) {
                        let msg = res['msg'];
                        let winner = msg['winner'];
                        let new_state = msg['state'];
                        let new_pos = msg['pos'];
                        board[new_pos[0]][new_pos[1]] = msg['agent'];
                        draw_board(board);
                        console.log('draw_board');
                        mark_red_point(new_pos[0], new_pos[1]);
                        move_stack.push([new_pos[0], new_pos[1]]);
                        pos = new_pos;
                        if (winner) {
                            sleep(500).then(() => {
                                    if (winner === ai_a) {
                                        alert('AI 1 win')
                                    }
                                    else {
                                        alert('AI 2 win')
                                    }
                                }
                            );
                            // convey the winner message
                            let data = {
                                'player': last_player_move_stack,
                                'ai': last_ai_move_stack,
                                'winner': winner,
                                'player_stone': agent
                            };
                            $.post(LOGGING_URL, {'data': JSON.stringify(data)}, function (raw_res, status) {
                                if (status !== 'success') {
                                    let msg = JSON.parse(raw_res)['msg'];
                                    alert('upload to server failed\n' + msg)
                                }
                            });
                            quit = true;
                        }
                        if (board.toString() !== new_state.toString()) {
                            alert('The board is not same');
                        }
                    }
                    else {
                        let msg = res['msg'];
                        alert(msg);
                    }
                }
            });
            if (quit){
                return
            }
            if(flag){
                flag = false;
                index++;
            }
            else{
                setTimeout("console.log('sleeping')", 1000);
            }
        }
    }
});




// loading the board
let canvas = document.getElementById("board");
const img = new Image();
img.src = IMG_PATH;
let ctx = canvas.getContext("2d");

img.onload = function(){
    if (!last_player_move_stack.length){
        ctx.drawImage(img, 0, 0,615,615);
        ctx.fillStyle = "#FF0000";
    }
};

function draw_board(board){
    ctx.clearRect(0,0,615,615);
    ctx.drawImage(img, 0, 0,615,615);
    for(let y=0;y<15;y++){
        for(let x=0;x<15;x++){
            let stone = board[y][x];
            if(stone){
                let image = new Image();
                if(stone === WHITE_AGENT){
                    image.src = WHITE_STONE;
                }
                else{
                    image.src = BLACK_STONE;
                }
                ctx.drawImage(image, x * GAP + MARGIN - 20, y * GAP + MARGIN - 20, 40, 40);
            }

        }
    }
}

function mark_red_point(y,x){
    ctx.fillRect(x * GAP + MARGIN, y * GAP + MARGIN,3,3);
}


canvas.addEventListener("mousemove",function(e){
    let cord= cor_map[[e.offsetY,e.offsetX]];
    if(cord){
        canvas.style.cursor = 'pointer';
    }
    else{
        canvas.style.cursor = 'auto'
    }
});



canvas.addEventListener('mousedown', function(e) {
    let cord = cor_map[[e.offsetY, e.offsetX]];
    if (cord) {
        if (board[cord[0]][cord[1]] === 0) {
            board[cord[0]][cord[1]] = player_agent;
            last_player_move_stack.push([cord[0], cord[1]]);
            draw_board(board);
            let data = {
                'state': board,
                'agent': player_agent,
                'pos': [cord[0], cord[1]],
                'depth':4
            };
            let string = JSON.stringify(data);
            if(demo_mode){
                return
            }
            else {
                try {
                    $.post(URL, {'data': string}, function (raw_res, status) {
                        if (status === 'success') {
                            let res = JSON.parse(raw_res);
                            if (res['status']) {
                                let msg = res['msg'];
                                let winner = msg['winner'];
                                let new_state = msg['state'];
                                let new_pos = msg['pos'];
                                board[new_pos[0]][new_pos[1]] = msg['agent'];
                                draw_board(board);
                                mark_red_point(new_pos[0], new_pos[1]);
                                last_ai_move_stack.push([new_pos[0], new_pos[1]]);
                                if (winner) {
                                    sleep(500).then(() => {
                                            if (winner === player_agent) {
                                                alert('You win')
                                            }
                                            else {
                                                alert('AI win')
                                            }
                                        }
                                    );
                                    // convey the winner message
                                    let data = {
                                        'player': last_player_move_stack,
                                        'ai': last_ai_move_stack,
                                        'winner': winner,
                                        'player_stone': player_agent
                                    };

                                    $.post(LOGGING_URL, {'data': JSON.stringify(data)}, function (raw_res, status) {
                                        if (status !== 'success') {
                                            let msg = JSON.parse(raw_res)['msg'];
                                            alert('upload to server failed\n' + msg)
                                        }
                                    })
                                }
                                if (board.toString() !== new_state.toString()) {
                                    alert('The board is not same');
                                }
                            }
                            else {
                                let msg = res['msg'];
                                alert(msg);
                            }
                        }
                    })
                }
                catch (e) {
                    alert('Fail in connect to server')
                }
            }
        }
    }
});