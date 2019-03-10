# -*- coding: utf-8 -*-
# @Time    : 30/12/2018 22:23
# @Author  : weiziyang
# @FileName: utils.py
# @Software: PyCharm

import GMK
from backend.gomoku.utils import time_counter

# agent
BLACK_AGENT = 1
WHITE_AGENT = 2


class MiniMax(object):
    def __init__(self, agent, board, pos, depth, heuristic=True):
        self.board = board
        self.agent = agent
        self.pos = pos
        self.enemy = WHITE_AGENT if agent == BLACK_AGENT else BLACK_AGENT
        self.depth = 2
        self.nodes_num = 0
        self.searched_nodes = 0
        self.cut_time = 0
        self.evaluate_time = 0
        self.heuristic = heuristic

    def search_possible_position(self, board):
        """
        Based on a fact that the new move you will take will only surround by the existing stone, which will save many times
        :param board: Game board state
        :return:
        """
        search_matrix = [(i, j) for i in range(-2, 3) for j in range(-2, 3) if (i, j) != (0, 0)]
        possible_position = set()
        for y in range(15):
            for x in range(15):
                if board[y][x] == WHITE_AGENT or board[y][x] == BLACK_AGENT:
                    for each in search_matrix:
                        new_pos = (y+each[0], x+each[1])
                        if 0 <= new_pos[0] < 15 and 0 <= new_pos[1] < 15:
                            obj = board[new_pos[0]][new_pos[1]]
                            if obj == 0 and new_pos not in possible_position:
                                possible_position.add(new_pos)
        self.nodes_num += len(possible_position)
        return possible_position

    class Point(object):
        def __init__(self, p, direction, board):
            self.y = p[0]
            self.x = p[1]
            self.d = direction
            self.board = board

        def __getitem__(self, offset):
            new_y = self.y + self.d[0]*offset
            new_x = self.x + self.d[1]*offset

            if 0 <= new_x < 15 and 0 <= new_y < 15:
                return self.board[new_y][new_x]

    def evaluate(self, board, pos):
        """
        Core code, evaluate the board to decide what next move to take
        :param board:
        :param agent:
        :return:
        """
        mark = GMK.evaluate(self.agent, board)
        mark -= self.distance(pos, self.pos)
        return mark

    @staticmethod
    def distance(point1, point2):
        """
        Calculate the distance between two stone,
        :param point1:
        :param point2:
        :return:
        """
        return max(abs(point1[0]-point2[0]), abs(point1[1]-point2[1]))

    @time_counter
    def solve(self):
        mark, pos = self.search_max(self.board, self.depth, None, -float('inf'), float('inf'))
        if not pos:
            pos = (7, 7)
        self.board[pos[0]][pos[1]] = self.agent
        return pos, self.board, mark

    def search_max(self, board, depth, pos, alpha, beta):
        self.searched_nodes += 1
        if depth == 0 or GMK.check_win(board):
            return self.evaluate(board, pos), None
        possible_position = self.search_possible_position(board)
        if self.heuristic:
            possible_position_dic = {}
            for each in possible_position:
                possible_position_dic[each] = GMK.heuristic_evaluate(self.agent, each[0], each[1], board)
            possible_position = sorted(possible_position, key=lambda a: possible_position_dic[a], reverse=False)
        max_mark = -float('inf')
        max_pos = None

        for position in possible_position:
            board[position[0]][position[1]] = self.agent
            mark = self.search_min(board, depth - 1, position, max_mark if max_mark > alpha else alpha, beta)[0]
            # mark = self.search_min(board, depth - 1, position, alpha, beta)[0]
            board[position[0]][position[1]] = 0
            if mark >= max_mark:
                max_mark = mark
                max_pos = position
            if mark >= beta:
                self.cut_time += 1
                break
        return max_mark, max_pos

    def search_min(self, board, depth, pos, alpha, beta):
        self.searched_nodes += 1
        if depth == 0 or GMK.check_win(board):
            return self.evaluate(board, pos), None
        possible_position = self.search_possible_position(board)
        if self.heuristic:
            possible_position_dic = {}
            for each in possible_position:
                possible_position_dic[each] = GMK.heuristic_evaluate(self.enemy, each[0], each[1], board)
            possible_position = sorted(possible_position, key=lambda a: possible_position_dic[a], reverse=True)
        min_mark = float('inf')
        min_pos = None

        for position in possible_position:
            board[position[0]][position[1]] = self.enemy
            mark = self.search_max(board, depth - 1, position, alpha, min_mark if min_mark < beta else beta)[0]
            # mark = self.search_max(board, depth - 1,position, alpha,  beta)[0]
            board[position[0]][position[1]] = 0
            if mark <= min_mark:
                min_mark = mark
                min_pos = position
            if mark <= alpha:
                self.cut_time += 1
                break
        return min_mark, min_pos










