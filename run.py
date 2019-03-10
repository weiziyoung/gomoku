# -*- coding: utf-8 -*-
# @Time    : 29/12/2018 23:32
# @Author  : weiziyang
# @FileName: run.py
# @Software: PyCharm

from flask import Flask

app = Flask(__name__, static_folder='front_end')
from backend.main import *


def main():
    app.run()


if __name__ == "__main__":
    app.run(debug=True)