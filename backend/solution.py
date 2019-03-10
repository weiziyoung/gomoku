# -*- coding: utf-8 -*-
# @Time    : 30/12/2018 03:00
# @Author  : weiziyang
# @FileName: solution.py
# @Software: PyCharm
import GMK
from backend. MiniMax import MiniMax, BLACK_AGENT, WHITE_AGENT
import logging
import json


def MiniMaxSearch_solve(pos, agent, state, depth):
    new_agent = WHITE_AGENT if agent == BLACK_AGENT else BLACK_AGENT
    winner = GMK.check_win(state)
    if winner:
        return pos, state, agent, winner
    minimax = MiniMax(new_agent, state, pos, depth)
    solution = minimax.solve()
    logging.basicConfig(level=logging.DEBUG, format='%(asctime)s : %(message)s', filename='test')
    info = {
        'pos': pos,
        'depth': minimax.depth,
        'heuristic': minimax.heuristic,
        'nodes_num': minimax.nodes_num,
        'searched_nodes': minimax.searched_nodes,
        'cut_time': minimax.cut_time,
        'computing_time': minimax.evaluate_time,
        'mark': solution[2]
    }
    logging.info(json.dumps(info))
    new_pos = solution[0]
    new_board = solution[1]
    winner = GMK.check_win(new_board)
    return new_pos, new_board, new_agent, winner
