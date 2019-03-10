# -*- coding: utf-8 -*-
# @Time    : 29/12/2018 22:53
# @Author  : weiziyang
# @FileName: main.py
# @Software: PyCharm

import logging
import json
import traceback


from flask import request, redirect
from run import app

from backend.solution import MiniMaxSearch_solve

SUCCESS = 1
FAILURE = 0


@app.route("/")
def hello():
    return redirect('front_end/game.html')


@app.route('/react', methods=['POST'])
def response():
    status = SUCCESS
    try:
        data = request.form['data']
        data_dict = json.loads(data)
        new_pos, new_state, new_agent, winner = MiniMaxSearch_solve(data_dict['pos'], data_dict['agent'], data_dict['state'], 4)
        msg = {
            'state': new_state,
            'agent': new_agent,
            'pos': new_pos,
            'winner': winner
        }
    except Exception:
        status = FAILURE
        msg = traceback.format_exc()
    data = {
        'status': status,
        'msg': msg
    }
    return json.dumps(data)


@app.route('/logging', methods=['POST'])
def logging_board():
    status = SUCCESS
    msg = ''
    try:
        data = request.form['data']
        data_dict = json.loads(data)
        info = {
            'player': data_dict['player'],
            'ai': data_dict['ai'],
            'player_stone': data_dict['stone'],
            'winner': data_dict['winner']
        }
        logging.info(json.dumps(info))
    except Exception:
        status = FAILURE
        msg = traceback.format_exc()
    data = {
        'status': status,
        'msg': msg
    }
    return json.dumps(data)


