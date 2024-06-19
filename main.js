'use strict';

var obsidian = require('obsidian');
var fs = require('fs');

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var fs__namespace = /*#__PURE__*/_interopNamespace(fs);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

let nanoid = (size = 21) => {
  let id = '';
  let bytes = crypto.getRandomValues(new Uint8Array(size));
  while (size--) {
    let byte = bytes[size] & 63;
    if (byte < 36) {
      id += byte.toString(36);
    } else if (byte < 62) {
      id += (byte - 26).toString(36).toUpperCase();
    } else if (byte < 63) {
      id += '_';
    } else {
      id += '-';
    }
  }
  return id
};

var chess = {};

/*
 * Copyright (c) 2021, Jeff Hlywa (jhlywa@gmail.com)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 *----------------------------------------------------------------------------*/

(function (exports) {
var Chess = function (fen) {
  var BLACK = 'b';
  var WHITE = 'w';

  var EMPTY = -1;

  var PAWN = 'p';
  var KNIGHT = 'n';
  var BISHOP = 'b';
  var ROOK = 'r';
  var QUEEN = 'q';
  var KING = 'k';

  var SYMBOLS = 'pnbrqkPNBRQK';

  var DEFAULT_POSITION =
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  var TERMINATION_MARKERS = ['1-0', '0-1', '1/2-1/2', '*'];

  var PAWN_OFFSETS = {
    b: [16, 32, 17, 15],
    w: [-16, -32, -17, -15],
  };

  var PIECE_OFFSETS = {
    n: [-18, -33, -31, -14, 18, 33, 31, 14],
    b: [-17, -15, 17, 15],
    r: [-16, 1, 16, -1],
    q: [-17, -16, -15, 1, 17, 16, 15, -1],
    k: [-17, -16, -15, 1, 17, 16, 15, -1],
  };

  // prettier-ignore
  var ATTACKS = [
    20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20, 0,
     0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
     0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
     0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
     0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
    24,24,24,24,24,24,56,  0, 56,24,24,24,24,24,24, 0,
     0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
     0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
     0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
     0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
    20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20
  ];

  // prettier-ignore
  var RAYS = [
     17,  0,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0,  0, 15, 0,
      0, 17,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0, 15,  0, 0,
      0,  0, 17,  0,  0,  0,  0, 16,  0,  0,  0,  0, 15,  0,  0, 0,
      0,  0,  0, 17,  0,  0,  0, 16,  0,  0,  0, 15,  0,  0,  0, 0,
      0,  0,  0,  0, 17,  0,  0, 16,  0,  0, 15,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0, 17,  0, 16,  0, 15,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0,  0, 17, 16, 15,  0,  0,  0,  0,  0,  0, 0,
      1,  1,  1,  1,  1,  1,  1,  0, -1, -1,  -1,-1, -1, -1, -1, 0,
      0,  0,  0,  0,  0,  0,-15,-16,-17,  0,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0,-15,  0,-16,  0,-17,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0,-15,  0,  0,-16,  0,  0,-17,  0,  0,  0,  0, 0,
      0,  0,  0,-15,  0,  0,  0,-16,  0,  0,  0,-17,  0,  0,  0, 0,
      0,  0,-15,  0,  0,  0,  0,-16,  0,  0,  0,  0,-17,  0,  0, 0,
      0,-15,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,-17,  0, 0,
    -15,  0,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,  0,-17
  ];

  var SHIFTS = { p: 0, n: 1, b: 2, r: 3, q: 4, k: 5 };

  var FLAGS = {
    NORMAL: 'n',
    CAPTURE: 'c',
    BIG_PAWN: 'b',
    EP_CAPTURE: 'e',
    PROMOTION: 'p',
    KSIDE_CASTLE: 'k',
    QSIDE_CASTLE: 'q',
  };

  var BITS = {
    NORMAL: 1,
    CAPTURE: 2,
    BIG_PAWN: 4,
    EP_CAPTURE: 8,
    PROMOTION: 16,
    KSIDE_CASTLE: 32,
    QSIDE_CASTLE: 64,
  };

  var RANK_1 = 7;
  var RANK_2 = 6;
  var RANK_7 = 1;
  var RANK_8 = 0;

  // prettier-ignore
  var SQUARES = {
    a8:   0, b8:   1, c8:   2, d8:   3, e8:   4, f8:   5, g8:   6, h8:   7,
    a7:  16, b7:  17, c7:  18, d7:  19, e7:  20, f7:  21, g7:  22, h7:  23,
    a6:  32, b6:  33, c6:  34, d6:  35, e6:  36, f6:  37, g6:  38, h6:  39,
    a5:  48, b5:  49, c5:  50, d5:  51, e5:  52, f5:  53, g5:  54, h5:  55,
    a4:  64, b4:  65, c4:  66, d4:  67, e4:  68, f4:  69, g4:  70, h4:  71,
    a3:  80, b3:  81, c3:  82, d3:  83, e3:  84, f3:  85, g3:  86, h3:  87,
    a2:  96, b2:  97, c2:  98, d2:  99, e2: 100, f2: 101, g2: 102, h2: 103,
    a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
  };

  var ROOKS = {
    w: [
      { square: SQUARES.a1, flag: BITS.QSIDE_CASTLE },
      { square: SQUARES.h1, flag: BITS.KSIDE_CASTLE },
    ],
    b: [
      { square: SQUARES.a8, flag: BITS.QSIDE_CASTLE },
      { square: SQUARES.h8, flag: BITS.KSIDE_CASTLE },
    ],
  };

  var board = new Array(128);
  var kings = { w: EMPTY, b: EMPTY };
  var turn = WHITE;
  var castling = { w: 0, b: 0 };
  var ep_square = EMPTY;
  var half_moves = 0;
  var move_number = 1;
  var history = [];
  var header = {};
  var comments = {};

  /* if the user passes in a fen string, load it, else default to
   * starting position
   */
  if (typeof fen === 'undefined') {
    load(DEFAULT_POSITION);
  } else {
    load(fen);
  }

  function clear(keep_headers) {
    if (typeof keep_headers === 'undefined') {
      keep_headers = false;
    }

    board = new Array(128);
    kings = { w: EMPTY, b: EMPTY };
    turn = WHITE;
    castling = { w: 0, b: 0 };
    ep_square = EMPTY;
    half_moves = 0;
    move_number = 1;
    history = [];
    if (!keep_headers) header = {};
    comments = {};
    update_setup(generate_fen());
  }

  function prune_comments() {
    var reversed_history = [];
    var current_comments = {};
    var copy_comment = function (fen) {
      if (fen in comments) {
        current_comments[fen] = comments[fen];
      }
    };
    while (history.length > 0) {
      reversed_history.push(undo_move());
    }
    copy_comment(generate_fen());
    while (reversed_history.length > 0) {
      make_move(reversed_history.pop());
      copy_comment(generate_fen());
    }
    comments = current_comments;
  }

  function reset() {
    load(DEFAULT_POSITION);
  }

  function load(fen, keep_headers) {
    if (typeof keep_headers === 'undefined') {
      keep_headers = false;
    }

    var tokens = fen.split(/\s+/);
    var position = tokens[0];
    var square = 0;

    if (!validate_fen(fen).valid) {
      return false
    }

    clear(keep_headers);

    for (var i = 0; i < position.length; i++) {
      var piece = position.charAt(i);

      if (piece === '/') {
        square += 8;
      } else if (is_digit(piece)) {
        square += parseInt(piece, 10);
      } else {
        var color = piece < 'a' ? WHITE : BLACK;
        put({ type: piece.toLowerCase(), color: color }, algebraic(square));
        square++;
      }
    }

    turn = tokens[1];

    if (tokens[2].indexOf('K') > -1) {
      castling.w |= BITS.KSIDE_CASTLE;
    }
    if (tokens[2].indexOf('Q') > -1) {
      castling.w |= BITS.QSIDE_CASTLE;
    }
    if (tokens[2].indexOf('k') > -1) {
      castling.b |= BITS.KSIDE_CASTLE;
    }
    if (tokens[2].indexOf('q') > -1) {
      castling.b |= BITS.QSIDE_CASTLE;
    }

    ep_square = tokens[3] === '-' ? EMPTY : SQUARES[tokens[3]];
    half_moves = parseInt(tokens[4], 10);
    move_number = parseInt(tokens[5], 10);

    update_setup(generate_fen());

    return true
  }

  /* TODO: this function is pretty much crap - it validates structure but
   * completely ignores content (e.g. doesn't verify that each side has a king)
   * ... we should rewrite this, and ditch the silly error_number field while
   * we're at it
   */
  function validate_fen(fen) {
    var errors = {
      0: 'No errors.',
      1: 'FEN string must contain six space-delimited fields.',
      2: '6th field (move number) must be a positive integer.',
      3: '5th field (half move counter) must be a non-negative integer.',
      4: '4th field (en-passant square) is invalid.',
      5: '3rd field (castling availability) is invalid.',
      6: '2nd field (side to move) is invalid.',
      7: "1st field (piece positions) does not contain 8 '/'-delimited rows.",
      8: '1st field (piece positions) is invalid [consecutive numbers].',
      9: '1st field (piece positions) is invalid [invalid piece].',
      10: '1st field (piece positions) is invalid [row too large].',
      11: 'Illegal en-passant square',
    };

    /* 1st criterion: 6 space-seperated fields? */
    var tokens = fen.split(/\s+/);
    if (tokens.length !== 6) {
      return { valid: false, error_number: 1, error: errors[1] }
    }

    /* 2nd criterion: move number field is a integer value > 0? */
    if (isNaN(tokens[5]) || parseInt(tokens[5], 10) <= 0) {
      return { valid: false, error_number: 2, error: errors[2] }
    }

    /* 3rd criterion: half move counter is an integer >= 0? */
    if (isNaN(tokens[4]) || parseInt(tokens[4], 10) < 0) {
      return { valid: false, error_number: 3, error: errors[3] }
    }

    /* 4th criterion: 4th field is a valid e.p.-string? */
    if (!/^(-|[abcdefgh][36])$/.test(tokens[3])) {
      return { valid: false, error_number: 4, error: errors[4] }
    }

    /* 5th criterion: 3th field is a valid castle-string? */
    if (!/^(KQ?k?q?|Qk?q?|kq?|q|-)$/.test(tokens[2])) {
      return { valid: false, error_number: 5, error: errors[5] }
    }

    /* 6th criterion: 2nd field is "w" (white) or "b" (black)? */
    if (!/^(w|b)$/.test(tokens[1])) {
      return { valid: false, error_number: 6, error: errors[6] }
    }

    /* 7th criterion: 1st field contains 8 rows? */
    var rows = tokens[0].split('/');
    if (rows.length !== 8) {
      return { valid: false, error_number: 7, error: errors[7] }
    }

    /* 8th criterion: every row is valid? */
    for (var i = 0; i < rows.length; i++) {
      /* check for right sum of fields AND not two numbers in succession */
      var sum_fields = 0;
      var previous_was_number = false;

      for (var k = 0; k < rows[i].length; k++) {
        if (!isNaN(rows[i][k])) {
          if (previous_was_number) {
            return { valid: false, error_number: 8, error: errors[8] }
          }
          sum_fields += parseInt(rows[i][k], 10);
          previous_was_number = true;
        } else {
          if (!/^[prnbqkPRNBQK]$/.test(rows[i][k])) {
            return { valid: false, error_number: 9, error: errors[9] }
          }
          sum_fields += 1;
          previous_was_number = false;
        }
      }
      if (sum_fields !== 8) {
        return { valid: false, error_number: 10, error: errors[10] }
      }
    }

    if (
      (tokens[3][1] == '3' && tokens[1] == 'w') ||
      (tokens[3][1] == '6' && tokens[1] == 'b')
    ) {
      return { valid: false, error_number: 11, error: errors[11] }
    }

    /* everything's okay! */
    return { valid: true, error_number: 0, error: errors[0] }
  }

  function generate_fen() {
    var empty = 0;
    var fen = '';

    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      if (board[i] == null) {
        empty++;
      } else {
        if (empty > 0) {
          fen += empty;
          empty = 0;
        }
        var color = board[i].color;
        var piece = board[i].type;

        fen += color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
      }

      if ((i + 1) & 0x88) {
        if (empty > 0) {
          fen += empty;
        }

        if (i !== SQUARES.h1) {
          fen += '/';
        }

        empty = 0;
        i += 8;
      }
    }

    var cflags = '';
    if (castling[WHITE] & BITS.KSIDE_CASTLE) {
      cflags += 'K';
    }
    if (castling[WHITE] & BITS.QSIDE_CASTLE) {
      cflags += 'Q';
    }
    if (castling[BLACK] & BITS.KSIDE_CASTLE) {
      cflags += 'k';
    }
    if (castling[BLACK] & BITS.QSIDE_CASTLE) {
      cflags += 'q';
    }

    /* do we have an empty castling flag? */
    cflags = cflags || '-';
    var epflags = ep_square === EMPTY ? '-' : algebraic(ep_square);

    return [fen, turn, cflags, epflags, half_moves, move_number].join(' ')
  }

  function set_header(args) {
    for (var i = 0; i < args.length; i += 2) {
      if (typeof args[i] === 'string' && typeof args[i + 1] === 'string') {
        header[args[i]] = args[i + 1];
      }
    }
    return header
  }

  /* called when the initial board setup is changed with put() or remove().
   * modifies the SetUp and FEN properties of the header object.  if the FEN is
   * equal to the default position, the SetUp and FEN are deleted
   * the setup is only updated if history.length is zero, ie moves haven't been
   * made.
   */
  function update_setup(fen) {
    if (history.length > 0) return

    if (fen !== DEFAULT_POSITION) {
      header['SetUp'] = '1';
      header['FEN'] = fen;
    } else {
      delete header['SetUp'];
      delete header['FEN'];
    }
  }

  function get(square) {
    var piece = board[SQUARES[square]];
    return piece ? { type: piece.type, color: piece.color } : null
  }

  function put(piece, square) {
    /* check for valid piece object */
    if (!('type' in piece && 'color' in piece)) {
      return false
    }

    /* check for piece */
    if (SYMBOLS.indexOf(piece.type.toLowerCase()) === -1) {
      return false
    }

    /* check for valid square */
    if (!(square in SQUARES)) {
      return false
    }

    var sq = SQUARES[square];

    /* don't let the user place more than one king */
    if (
      piece.type == KING &&
      !(kings[piece.color] == EMPTY || kings[piece.color] == sq)
    ) {
      return false
    }

    board[sq] = { type: piece.type, color: piece.color };
    if (piece.type === KING) {
      kings[piece.color] = sq;
    }

    update_setup(generate_fen());

    return true
  }

  function remove(square) {
    var piece = get(square);
    board[SQUARES[square]] = null;
    if (piece && piece.type === KING) {
      kings[piece.color] = EMPTY;
    }

    update_setup(generate_fen());

    return piece
  }

  function build_move(board, from, to, flags, promotion) {
    var move = {
      color: turn,
      from: from,
      to: to,
      flags: flags,
      piece: board[from].type,
    };

    if (promotion) {
      move.flags |= BITS.PROMOTION;
      move.promotion = promotion;
    }

    if (board[to]) {
      move.captured = board[to].type;
    } else if (flags & BITS.EP_CAPTURE) {
      move.captured = PAWN;
    }
    return move
  }

  function generate_moves(options) {
    function add_move(board, moves, from, to, flags) {
      /* if pawn promotion */
      if (
        board[from].type === PAWN &&
        (rank(to) === RANK_8 || rank(to) === RANK_1)
      ) {
        var pieces = [QUEEN, ROOK, BISHOP, KNIGHT];
        for (var i = 0, len = pieces.length; i < len; i++) {
          moves.push(build_move(board, from, to, flags, pieces[i]));
        }
      } else {
        moves.push(build_move(board, from, to, flags));
      }
    }

    var moves = [];
    var us = turn;
    var them = swap_color(us);
    var second_rank = { b: RANK_7, w: RANK_2 };

    var first_sq = SQUARES.a8;
    var last_sq = SQUARES.h1;
    var single_square = false;

    /* do we want legal moves? */
    var legal =
      typeof options !== 'undefined' && 'legal' in options
        ? options.legal
        : true;

    var piece_type =
      typeof options !== 'undefined' &&
      'piece' in options &&
      typeof options.piece === 'string'
        ? options.piece.toLowerCase()
        : true;

    /* are we generating moves for a single square? */
    if (typeof options !== 'undefined' && 'square' in options) {
      if (options.square in SQUARES) {
        first_sq = last_sq = SQUARES[options.square];
        single_square = true;
      } else {
        /* invalid square */
        return []
      }
    }

    for (var i = first_sq; i <= last_sq; i++) {
      /* did we run off the end of the board */
      if (i & 0x88) {
        i += 7;
        continue
      }

      var piece = board[i];
      if (piece == null || piece.color !== us) {
        continue
      }

      if (piece.type === PAWN && (piece_type === true || piece_type === PAWN)) {
        /* single square, non-capturing */
        var square = i + PAWN_OFFSETS[us][0];
        if (board[square] == null) {
          add_move(board, moves, i, square, BITS.NORMAL);

          /* double square */
          var square = i + PAWN_OFFSETS[us][1];
          if (second_rank[us] === rank(i) && board[square] == null) {
            add_move(board, moves, i, square, BITS.BIG_PAWN);
          }
        }

        /* pawn captures */
        for (j = 2; j < 4; j++) {
          var square = i + PAWN_OFFSETS[us][j];
          if (square & 0x88) continue

          if (board[square] != null && board[square].color === them) {
            add_move(board, moves, i, square, BITS.CAPTURE);
          } else if (square === ep_square) {
            add_move(board, moves, i, ep_square, BITS.EP_CAPTURE);
          }
        }
      } else if (piece_type === true || piece_type === piece.type) {
        for (var j = 0, len = PIECE_OFFSETS[piece.type].length; j < len; j++) {
          var offset = PIECE_OFFSETS[piece.type][j];
          var square = i;

          while (true) {
            square += offset;
            if (square & 0x88) break

            if (board[square] == null) {
              add_move(board, moves, i, square, BITS.NORMAL);
            } else {
              if (board[square].color === us) break
              add_move(board, moves, i, square, BITS.CAPTURE);
              break
            }

            /* break, if knight or king */
            if (piece.type === 'n' || piece.type === 'k') break
          }
        }
      }
    }

    /* check for castling if: a) we're generating all moves, or b) we're doing
     * single square move generation on the king's square
     */
    if (piece_type === true || piece_type === KING) {
      if (!single_square || last_sq === kings[us]) {
        /* king-side castling */
        if (castling[us] & BITS.KSIDE_CASTLE) {
          var castling_from = kings[us];
          var castling_to = castling_from + 2;

          if (
            board[castling_from + 1] == null &&
            board[castling_to] == null &&
            !attacked(them, kings[us]) &&
            !attacked(them, castling_from + 1) &&
            !attacked(them, castling_to)
          ) {
            add_move(board, moves, kings[us], castling_to, BITS.KSIDE_CASTLE);
          }
        }

        /* queen-side castling */
        if (castling[us] & BITS.QSIDE_CASTLE) {
          var castling_from = kings[us];
          var castling_to = castling_from - 2;

          if (
            board[castling_from - 1] == null &&
            board[castling_from - 2] == null &&
            board[castling_from - 3] == null &&
            !attacked(them, kings[us]) &&
            !attacked(them, castling_from - 1) &&
            !attacked(them, castling_to)
          ) {
            add_move(board, moves, kings[us], castling_to, BITS.QSIDE_CASTLE);
          }
        }
      }
    }

    /* return all pseudo-legal moves (this includes moves that allow the king
     * to be captured)
     */
    if (!legal) {
      return moves
    }

    /* filter out illegal moves */
    var legal_moves = [];
    for (var i = 0, len = moves.length; i < len; i++) {
      make_move(moves[i]);
      if (!king_attacked(us)) {
        legal_moves.push(moves[i]);
      }
      undo_move();
    }

    return legal_moves
  }

  /* convert a move from 0x88 coordinates to Standard Algebraic Notation
   * (SAN)
   *
   * @param {boolean} sloppy Use the sloppy SAN generator to work around over
   * disambiguation bugs in Fritz and Chessbase.  See below:
   *
   * r1bqkbnr/ppp2ppp/2n5/1B1pP3/4P3/8/PPPP2PP/RNBQK1NR b KQkq - 2 4
   * 4. ... Nge7 is overly disambiguated because the knight on c6 is pinned
   * 4. ... Ne7 is technically the valid SAN
   */
  function move_to_san(move, moves) {
    var output = '';

    if (move.flags & BITS.KSIDE_CASTLE) {
      output = 'O-O';
    } else if (move.flags & BITS.QSIDE_CASTLE) {
      output = 'O-O-O';
    } else {
      if (move.piece !== PAWN) {
        var disambiguator = get_disambiguator(move, moves);
        output += move.piece.toUpperCase() + disambiguator;
      }

      if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
        if (move.piece === PAWN) {
          output += algebraic(move.from)[0];
        }
        output += 'x';
      }

      output += algebraic(move.to);

      if (move.flags & BITS.PROMOTION) {
        output += '=' + move.promotion.toUpperCase();
      }
    }

    make_move(move);
    if (in_check()) {
      if (in_checkmate()) {
        output += '#';
      } else {
        output += '+';
      }
    }
    undo_move();

    return output
  }
  // parses all of the decorators out of a SAN string
  function stripped_san(move) {
    return move.replace(/=/, '').replace(/[+#]?[?!]*$/, '')
  }

  function attacked(color, square) {
    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      /* did we run off the end of the board */
      if (i & 0x88) {
        i += 7;
        continue
      }

      /* if empty square or wrong color */
      if (board[i] == null || board[i].color !== color) continue

      var piece = board[i];
      var difference = i - square;
      var index = difference + 119;

      if (ATTACKS[index] & (1 << SHIFTS[piece.type])) {
        if (piece.type === PAWN) {
          if (difference > 0) {
            if (piece.color === WHITE) return true
          } else {
            if (piece.color === BLACK) return true
          }
          continue
        }

        /* if the piece is a knight or a king */
        if (piece.type === 'n' || piece.type === 'k') return true

        var offset = RAYS[index];
        var j = i + offset;

        var blocked = false;
        while (j !== square) {
          if (board[j] != null) {
            blocked = true;
            break
          }
          j += offset;
        }

        if (!blocked) return true
      }
    }

    return false
  }

  function king_attacked(color) {
    return attacked(swap_color(color), kings[color])
  }

  function in_check() {
    return king_attacked(turn)
  }

  function in_checkmate() {
    return in_check() && generate_moves().length === 0
  }

  function in_stalemate() {
    return !in_check() && generate_moves().length === 0
  }

  function insufficient_material() {
    var pieces = {};
    var bishops = [];
    var num_pieces = 0;
    var sq_color = 0;

    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      sq_color = (sq_color + 1) % 2;
      if (i & 0x88) {
        i += 7;
        continue
      }

      var piece = board[i];
      if (piece) {
        pieces[piece.type] = piece.type in pieces ? pieces[piece.type] + 1 : 1;
        if (piece.type === BISHOP) {
          bishops.push(sq_color);
        }
        num_pieces++;
      }
    }

    /* k vs. k */
    if (num_pieces === 2) {
      return true
    } else if (
      /* k vs. kn .... or .... k vs. kb */
      num_pieces === 3 &&
      (pieces[BISHOP] === 1 || pieces[KNIGHT] === 1)
    ) {
      return true
    } else if (num_pieces === pieces[BISHOP] + 2) {
      /* kb vs. kb where any number of bishops are all on the same color */
      var sum = 0;
      var len = bishops.length;
      for (var i = 0; i < len; i++) {
        sum += bishops[i];
      }
      if (sum === 0 || sum === len) {
        return true
      }
    }

    return false
  }

  function in_threefold_repetition() {
    /* TODO: while this function is fine for casual use, a better
     * implementation would use a Zobrist key (instead of FEN). the
     * Zobrist key would be maintained in the make_move/undo_move functions,
     * avoiding the costly that we do below.
     */
    var moves = [];
    var positions = {};
    var repetition = false;

    while (true) {
      var move = undo_move();
      if (!move) break
      moves.push(move);
    }

    while (true) {
      /* remove the last two fields in the FEN string, they're not needed
       * when checking for draw by rep */
      var fen = generate_fen().split(' ').slice(0, 4).join(' ');

      /* has the position occurred three or move times */
      positions[fen] = fen in positions ? positions[fen] + 1 : 1;
      if (positions[fen] >= 3) {
        repetition = true;
      }

      if (!moves.length) {
        break
      }
      make_move(moves.pop());
    }

    return repetition
  }

  function push(move) {
    history.push({
      move: move,
      kings: { b: kings.b, w: kings.w },
      turn: turn,
      castling: { b: castling.b, w: castling.w },
      ep_square: ep_square,
      half_moves: half_moves,
      move_number: move_number,
    });
  }

  function make_move(move) {
    var us = turn;
    var them = swap_color(us);
    push(move);

    board[move.to] = board[move.from];
    board[move.from] = null;

    /* if ep capture, remove the captured pawn */
    if (move.flags & BITS.EP_CAPTURE) {
      if (turn === BLACK) {
        board[move.to - 16] = null;
      } else {
        board[move.to + 16] = null;
      }
    }

    /* if pawn promotion, replace with new piece */
    if (move.flags & BITS.PROMOTION) {
      board[move.to] = { type: move.promotion, color: us };
    }

    /* if we moved the king */
    if (board[move.to].type === KING) {
      kings[board[move.to].color] = move.to;

      /* if we castled, move the rook next to the king */
      if (move.flags & BITS.KSIDE_CASTLE) {
        var castling_to = move.to - 1;
        var castling_from = move.to + 1;
        board[castling_to] = board[castling_from];
        board[castling_from] = null;
      } else if (move.flags & BITS.QSIDE_CASTLE) {
        var castling_to = move.to + 1;
        var castling_from = move.to - 2;
        board[castling_to] = board[castling_from];
        board[castling_from] = null;
      }

      /* turn off castling */
      castling[us] = '';
    }

    /* turn off castling if we move a rook */
    if (castling[us]) {
      for (var i = 0, len = ROOKS[us].length; i < len; i++) {
        if (
          move.from === ROOKS[us][i].square &&
          castling[us] & ROOKS[us][i].flag
        ) {
          castling[us] ^= ROOKS[us][i].flag;
          break
        }
      }
    }

    /* turn off castling if we capture a rook */
    if (castling[them]) {
      for (var i = 0, len = ROOKS[them].length; i < len; i++) {
        if (
          move.to === ROOKS[them][i].square &&
          castling[them] & ROOKS[them][i].flag
        ) {
          castling[them] ^= ROOKS[them][i].flag;
          break
        }
      }
    }

    /* if big pawn move, update the en passant square */
    if (move.flags & BITS.BIG_PAWN) {
      if (turn === 'b') {
        ep_square = move.to - 16;
      } else {
        ep_square = move.to + 16;
      }
    } else {
      ep_square = EMPTY;
    }

    /* reset the 50 move counter if a pawn is moved or a piece is captured */
    if (move.piece === PAWN) {
      half_moves = 0;
    } else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
      half_moves = 0;
    } else {
      half_moves++;
    }

    if (turn === BLACK) {
      move_number++;
    }
    turn = swap_color(turn);
  }

  function undo_move() {
    var old = history.pop();
    if (old == null) {
      return null
    }

    var move = old.move;
    kings = old.kings;
    turn = old.turn;
    castling = old.castling;
    ep_square = old.ep_square;
    half_moves = old.half_moves;
    move_number = old.move_number;

    var us = turn;
    var them = swap_color(turn);

    board[move.from] = board[move.to];
    board[move.from].type = move.piece; // to undo any promotions
    board[move.to] = null;

    if (move.flags & BITS.CAPTURE) {
      board[move.to] = { type: move.captured, color: them };
    } else if (move.flags & BITS.EP_CAPTURE) {
      var index;
      if (us === BLACK) {
        index = move.to - 16;
      } else {
        index = move.to + 16;
      }
      board[index] = { type: PAWN, color: them };
    }

    if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
      var castling_to, castling_from;
      if (move.flags & BITS.KSIDE_CASTLE) {
        castling_to = move.to + 1;
        castling_from = move.to - 1;
      } else if (move.flags & BITS.QSIDE_CASTLE) {
        castling_to = move.to - 2;
        castling_from = move.to + 1;
      }

      board[castling_to] = board[castling_from];
      board[castling_from] = null;
    }

    return move
  }

  /* this function is used to uniquely identify ambiguous moves */
  function get_disambiguator(move, moves) {
    var from = move.from;
    var to = move.to;
    var piece = move.piece;

    var ambiguities = 0;
    var same_rank = 0;
    var same_file = 0;

    for (var i = 0, len = moves.length; i < len; i++) {
      var ambig_from = moves[i].from;
      var ambig_to = moves[i].to;
      var ambig_piece = moves[i].piece;

      /* if a move of the same piece type ends on the same to square, we'll
       * need to add a disambiguator to the algebraic notation
       */
      if (piece === ambig_piece && from !== ambig_from && to === ambig_to) {
        ambiguities++;

        if (rank(from) === rank(ambig_from)) {
          same_rank++;
        }

        if (file(from) === file(ambig_from)) {
          same_file++;
        }
      }
    }

    if (ambiguities > 0) {
      /* if there exists a similar moving piece on the same rank and file as
       * the move in question, use the square as the disambiguator
       */
      if (same_rank > 0 && same_file > 0) {
        return algebraic(from)
      } else if (same_file > 0) {
        /* if the moving piece rests on the same file, use the rank symbol as the
         * disambiguator
         */
        return algebraic(from).charAt(1)
      } else {
        /* else use the file symbol */
        return algebraic(from).charAt(0)
      }
    }

    return ''
  }

  function infer_piece_type(san) {
    var piece_type = san.charAt(0);
    if (piece_type >= 'a' && piece_type <= 'h') {
      var matches = san.match(/[a-h]\d.*[a-h]\d/);
      if (matches) {
        return undefined
      }
      return PAWN
    }
    piece_type = piece_type.toLowerCase();
    if (piece_type === 'o') {
      return KING
    }
    return piece_type
  }
  function ascii() {
    var s = '   +------------------------+\n';
    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      /* display the rank */
      if (file(i) === 0) {
        s += ' ' + '87654321'[rank(i)] + ' |';
      }

      /* empty piece */
      if (board[i] == null) {
        s += ' . ';
      } else {
        var piece = board[i].type;
        var color = board[i].color;
        var symbol = color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
        s += ' ' + symbol + ' ';
      }

      if ((i + 1) & 0x88) {
        s += '|\n';
        i += 8;
      }
    }
    s += '   +------------------------+\n';
    s += '     a  b  c  d  e  f  g  h\n';

    return s
  }

  // convert a move from Standard Algebraic Notation (SAN) to 0x88 coordinates
  function move_from_san(move, sloppy) {
    // strip off any move decorations: e.g Nf3+?! becomes Nf3
    var clean_move = stripped_san(move);

    var overly_disambiguated = false;

    if (sloppy) {
      // The sloppy parser allows the user to parse non-standard chess
      // notations. This parser is opt-in (by specifying the
      // '{ sloppy: true }' setting) and is only run after the Standard
      // Algebraic Notation (SAN) parser has failed.
      //
      // When running the sloppy parser, we'll run a regex to grab the piece,
      // the to/from square, and an optional promotion piece. This regex will
      // parse common non-standard notation like: Pe2-e4, Rc1c4, Qf3xf7, f7f8q,
      // b1c3

      // NOTE: Some positions and moves may be ambiguous when using the sloppy
      // parser. For example, in this position: 6k1/8/8/B7/8/8/8/BN4K1 w - - 0 1,
      // the move b1c3 may be interpreted as Nc3 or B1c3 (a disambiguated
      // bishop move). In these cases, the sloppy parser will default to the
      // most most basic interpretation - b1c3 parses to Nc3.

      var matches = clean_move.match(
        /([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/
      );
      if (matches) {
        var piece = matches[1];
        var from = matches[2];
        var to = matches[3];
        var promotion = matches[4];

        if (from.length == 1) {
          overly_disambiguated = true;
        }
      } else {
        // The [a-h]?[1-8]? portion of the regex below handles moves that may
        // be overly disambiguated (e.g. Nge7 is unnecessary and non-standard
        // when there is one legal knight move to e7). In this case, the value
        // of 'from' variable will be a rank or file, not a square.
        var matches = clean_move.match(
          /([pnbrqkPNBRQK])?([a-h]?[1-8]?)x?-?([a-h][1-8])([qrbnQRBN])?/
        );

        if (matches) {
          var piece = matches[1];
          var from = matches[2];
          var to = matches[3];
          var promotion = matches[4];

          if (from.length == 1) {
            var overly_disambiguated = true;
          }
        }
      }
    }

    var piece_type = infer_piece_type(clean_move);
    var moves = generate_moves({
      legal: true,
      piece: piece ? piece : piece_type,
    });

    for (var i = 0, len = moves.length; i < len; i++) {
      // try the strict parser first, then the sloppy parser if requested
      // by the user
      if (clean_move === stripped_san(move_to_san(moves[i], moves))) {
        return moves[i]
      } else {
        if (sloppy && matches) {
          // hand-compare move properties with the results from our sloppy
          // regex
          if (
            (!piece || piece.toLowerCase() == moves[i].piece) &&
            SQUARES[from] == moves[i].from &&
            SQUARES[to] == moves[i].to &&
            (!promotion || promotion.toLowerCase() == moves[i].promotion)
          ) {
            return moves[i]
          } else if (overly_disambiguated) {
            // SPECIAL CASE: we parsed a move string that may have an unneeded
            // rank/file disambiguator (e.g. Nge7).  The 'from' variable will
            var square = algebraic(moves[i].from);
            if (
              (!piece || piece.toLowerCase() == moves[i].piece) &&
              SQUARES[to] == moves[i].to &&
              (from == square[0] || from == square[1]) &&
              (!promotion || promotion.toLowerCase() == moves[i].promotion)
            ) {
              return moves[i]
            }
          }
        }
      }
    }

    return null
  }

  /*****************************************************************************
   * UTILITY FUNCTIONS
   ****************************************************************************/
  function rank(i) {
    return i >> 4
  }

  function file(i) {
    return i & 15
  }

  function algebraic(i) {
    var f = file(i),
      r = rank(i);
    return 'abcdefgh'.substring(f, f + 1) + '87654321'.substring(r, r + 1)
  }

  function swap_color(c) {
    return c === WHITE ? BLACK : WHITE
  }

  function is_digit(c) {
    return '0123456789'.indexOf(c) !== -1
  }

  /* pretty = external move object */
  function make_pretty(ugly_move) {
    var move = clone(ugly_move);
    move.san = move_to_san(move, generate_moves({ legal: true }));
    move.to = algebraic(move.to);
    move.from = algebraic(move.from);

    var flags = '';

    for (var flag in BITS) {
      if (BITS[flag] & move.flags) {
        flags += FLAGS[flag];
      }
    }
    move.flags = flags;

    return move
  }

  function clone(obj) {
    var dupe = obj instanceof Array ? [] : {};

    for (var property in obj) {
      if (typeof property === 'object') {
        dupe[property] = clone(obj[property]);
      } else {
        dupe[property] = obj[property];
      }
    }

    return dupe
  }

  function trim(str) {
    return str.replace(/^\s+|\s+$/g, '')
  }

  /*****************************************************************************
   * DEBUGGING UTILITIES
   ****************************************************************************/
  function perft(depth) {
    var moves = generate_moves({ legal: false });
    var nodes = 0;
    var color = turn;

    for (var i = 0, len = moves.length; i < len; i++) {
      make_move(moves[i]);
      if (!king_attacked(color)) {
        if (depth - 1 > 0) {
          var child_nodes = perft(depth - 1);
          nodes += child_nodes;
        } else {
          nodes++;
        }
      }
      undo_move();
    }

    return nodes
  }

  return {
    /***************************************************************************
     * PUBLIC CONSTANTS (is there a better way to do this?)
     **************************************************************************/
    WHITE: WHITE,
    BLACK: BLACK,
    PAWN: PAWN,
    KNIGHT: KNIGHT,
    BISHOP: BISHOP,
    ROOK: ROOK,
    QUEEN: QUEEN,
    KING: KING,
    SQUARES: (function () {
      /* from the ECMA-262 spec (section 12.6.4):
       * "The mechanics of enumerating the properties ... is
       * implementation dependent"
       * so: for (var sq in SQUARES) { keys.push(sq); } might not be
       * ordered correctly
       */
      var keys = [];
      for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
        if (i & 0x88) {
          i += 7;
          continue
        }
        keys.push(algebraic(i));
      }
      return keys
    })(),
    FLAGS: FLAGS,

    /***************************************************************************
     * PUBLIC API
     **************************************************************************/
    load: function (fen) {
      return load(fen)
    },

    reset: function () {
      return reset()
    },

    moves: function (options) {
      /* The internal representation of a chess move is in 0x88 format, and
       * not meant to be human-readable.  The code below converts the 0x88
       * square coordinates to algebraic coordinates.  It also prunes an
       * unnecessary move keys resulting from a verbose call.
       */

      var ugly_moves = generate_moves(options);
      var moves = [];

      for (var i = 0, len = ugly_moves.length; i < len; i++) {
        /* does the user want a full move object (most likely not), or just
         * SAN
         */
        if (
          typeof options !== 'undefined' &&
          'verbose' in options &&
          options.verbose
        ) {
          moves.push(make_pretty(ugly_moves[i]));
        } else {
          moves.push(
            move_to_san(ugly_moves[i], generate_moves({ legal: true }))
          );
        }
      }

      return moves
    },

    in_check: function () {
      return in_check()
    },

    in_checkmate: function () {
      return in_checkmate()
    },

    in_stalemate: function () {
      return in_stalemate()
    },

    in_draw: function () {
      return (
        half_moves >= 100 ||
        in_stalemate() ||
        insufficient_material() ||
        in_threefold_repetition()
      )
    },

    insufficient_material: function () {
      return insufficient_material()
    },

    in_threefold_repetition: function () {
      return in_threefold_repetition()
    },

    game_over: function () {
      return (
        half_moves >= 100 ||
        in_checkmate() ||
        in_stalemate() ||
        insufficient_material() ||
        in_threefold_repetition()
      )
    },

    validate_fen: function (fen) {
      return validate_fen(fen)
    },

    fen: function () {
      return generate_fen()
    },

    board: function () {
      var output = [],
        row = [];

      for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
        if (board[i] == null) {
          row.push(null);
        } else {
          row.push({ type: board[i].type, color: board[i].color });
        }
        if ((i + 1) & 0x88) {
          output.push(row);
          row = [];
          i += 8;
        }
      }

      return output
    },

    pgn: function (options) {
      /* using the specification from http://www.chessclub.com/help/PGN-spec
       * example for html usage: .pgn({ max_width: 72, newline_char: "<br />" })
       */
      var newline =
        typeof options === 'object' && typeof options.newline_char === 'string'
          ? options.newline_char
          : '\n';
      var max_width =
        typeof options === 'object' && typeof options.max_width === 'number'
          ? options.max_width
          : 0;
      var result = [];
      var header_exists = false;

      /* add the PGN header headerrmation */
      for (var i in header) {
        /* TODO: order of enumerated properties in header object is not
         * guaranteed, see ECMA-262 spec (section 12.6.4)
         */
        result.push('[' + i + ' "' + header[i] + '"]' + newline);
        header_exists = true;
      }

      if (header_exists && history.length) {
        result.push(newline);
      }

      var append_comment = function (move_string) {
        var comment = comments[generate_fen()];
        if (typeof comment !== 'undefined') {
          var delimiter = move_string.length > 0 ? ' ' : '';
          move_string = `${move_string}${delimiter}{${comment}}`;
        }
        return move_string
      };

      /* pop all of history onto reversed_history */
      var reversed_history = [];
      while (history.length > 0) {
        reversed_history.push(undo_move());
      }

      var moves = [];
      var move_string = '';

      /* special case of a commented starting position with no moves */
      if (reversed_history.length === 0) {
        moves.push(append_comment(''));
      }

      /* build the list of moves.  a move_string looks like: "3. e3 e6" */
      while (reversed_history.length > 0) {
        move_string = append_comment(move_string);
        var move = reversed_history.pop();

        /* if the position started with black to move, start PGN with 1. ... */
        if (!history.length && move.color === 'b') {
          move_string = move_number + '. ...';
        } else if (move.color === 'w') {
          /* store the previous generated move_string if we have one */
          if (move_string.length) {
            moves.push(move_string);
          }
          move_string = move_number + '.';
        }

        move_string =
          move_string + ' ' + move_to_san(move, generate_moves({ legal: true }));
        make_move(move);
      }

      /* are there any other leftover moves? */
      if (move_string.length) {
        moves.push(append_comment(move_string));
      }

      /* is there a result? */
      if (typeof header.Result !== 'undefined') {
        moves.push(header.Result);
      }

      /* history should be back to what it was before we started generating PGN,
       * so join together moves
       */
      if (max_width === 0) {
        return result.join('') + moves.join(' ')
      }

      var strip = function () {
        if (result.length > 0 && result[result.length - 1] === ' ') {
          result.pop();
          return true
        }
        return false
      };

      /* NB: this does not preserve comment whitespace. */
      var wrap_comment = function (width, move) {
        for (var token of move.split(' ')) {
          if (!token) {
            continue
          }
          if (width + token.length > max_width) {
            while (strip()) {
              width--;
            }
            result.push(newline);
            width = 0;
          }
          result.push(token);
          width += token.length;
          result.push(' ');
          width++;
        }
        if (strip()) {
          width--;
        }
        return width
      };

      /* wrap the PGN output at max_width */
      var current_width = 0;
      for (var i = 0; i < moves.length; i++) {
        if (current_width + moves[i].length > max_width) {
          if (moves[i].includes('{')) {
            current_width = wrap_comment(current_width, moves[i]);
            continue
          }
        }
        /* if the current move will push past max_width */
        if (current_width + moves[i].length > max_width && i !== 0) {
          /* don't end the line with whitespace */
          if (result[result.length - 1] === ' ') {
            result.pop();
          }

          result.push(newline);
          current_width = 0;
        } else if (i !== 0) {
          result.push(' ');
          current_width++;
        }
        result.push(moves[i]);
        current_width += moves[i].length;
      }

      return result.join('')
    },

    load_pgn: function (pgn, options) {
      // allow the user to specify the sloppy move parser to work around over
      // disambiguation bugs in Fritz and Chessbase
      var sloppy =
        typeof options !== 'undefined' && 'sloppy' in options
          ? options.sloppy
          : false;

      function mask(str) {
        return str.replace(/\\/g, '\\')
      }

      function parse_pgn_header(header, options) {
        var newline_char =
          typeof options === 'object' &&
          typeof options.newline_char === 'string'
            ? options.newline_char
            : '\r?\n';
        var header_obj = {};
        var headers = header.split(new RegExp(mask(newline_char)));
        var key = '';
        var value = '';

        for (var i = 0; i < headers.length; i++) {
          key = headers[i].replace(/^\[([A-Z][A-Za-z]*)\s.*\]$/, '$1');
          value = headers[i].replace(/^\[[A-Za-z]+\s"(.*)"\ *\]$/, '$1');
          if (trim(key).length > 0) {
            header_obj[key] = value;
          }
        }

        return header_obj
      }

      var newline_char =
        typeof options === 'object' && typeof options.newline_char === 'string'
          ? options.newline_char
          : '\r?\n';

      // RegExp to split header. Takes advantage of the fact that header and movetext
      // will always have a blank line between them (ie, two newline_char's).
      // With default newline_char, will equal: /^(\[((?:\r?\n)|.)*\])(?:\r?\n){2}/
      var header_regex = new RegExp(
        '^(\\[((?:' +
          mask(newline_char) +
          ')|.)*\\])' +
          '(?:' +
          mask(newline_char) +
          '){2}'
      );

      // If no header given, begin with moves.
      var header_string = header_regex.test(pgn)
        ? header_regex.exec(pgn)[1]
        : '';

      // Put the board in the starting position
      reset();

      /* parse PGN header */
      var headers = parse_pgn_header(header_string, options);
      for (var key in headers) {
        set_header([key, headers[key]]);
      }

      /* load the starting position indicated by [Setup '1'] and
       * [FEN position] */
      if (headers['SetUp'] === '1') {
        if (!('FEN' in headers && load(headers['FEN'], true))) {
          // second argument to load: don't clear the headers
          return false
        }
      }

      /* NB: the regexes below that delete move numbers, recursive
       * annotations, and numeric annotation glyphs may also match
       * text in comments. To prevent this, we transform comments
       * by hex-encoding them in place and decoding them again after
       * the other tokens have been deleted.
       *
       * While the spec states that PGN files should be ASCII encoded,
       * we use {en,de}codeURIComponent here to support arbitrary UTF8
       * as a convenience for modern users */

      var to_hex = function (string) {
        return Array.from(string)
          .map(function (c) {
            /* encodeURI doesn't transform most ASCII characters,
             * so we handle these ourselves */
            return c.charCodeAt(0) < 128
              ? c.charCodeAt(0).toString(16)
              : encodeURIComponent(c).replace(/\%/g, '').toLowerCase()
          })
          .join('')
      };

      var from_hex = function (string) {
        return string.length == 0
          ? ''
          : decodeURIComponent('%' + string.match(/.{1,2}/g).join('%'))
      };

      var encode_comment = function (string) {
        string = string.replace(new RegExp(mask(newline_char), 'g'), ' ');
        return `{${to_hex(string.slice(1, string.length - 1))}}`
      };

      var decode_comment = function (string) {
        if (string.startsWith('{') && string.endsWith('}')) {
          return from_hex(string.slice(1, string.length - 1))
        }
      };

      /* delete header to get the moves */
      var ms = pgn
        .replace(header_string, '')
        .replace(
          /* encode comments so they don't get deleted below */
          new RegExp(`(\{[^}]*\})+?|;([^${mask(newline_char)}]*)`, 'g'),
          function (match, bracket, semicolon) {
            return bracket !== undefined
              ? encode_comment(bracket)
              : ' ' + encode_comment(`{${semicolon.slice(1)}}`)
          }
        )
        .replace(new RegExp(mask(newline_char), 'g'), ' ');

      /* delete recursive annotation variations */
      var rav_regex = /(\([^\(\)]+\))+?/g;
      while (rav_regex.test(ms)) {
        ms = ms.replace(rav_regex, '');
      }

      /* delete move numbers */
      ms = ms.replace(/\d+\.(\.\.)?/g, '');

      /* delete ... indicating black to move */
      ms = ms.replace(/\.\.\./g, '');

      /* delete numeric annotation glyphs */
      ms = ms.replace(/\$\d+/g, '');

      /* trim and get array of moves */
      var moves = trim(ms).split(new RegExp(/\s+/));

      /* delete empty entries */
      moves = moves.join(',').replace(/,,+/g, ',').split(',');
      var move = '';

      var result = '';

      for (var half_move = 0; half_move < moves.length; half_move++) {
        var comment = decode_comment(moves[half_move]);
        if (comment !== undefined) {
          comments[generate_fen()] = comment;
          continue
        }

        move = move_from_san(moves[half_move], sloppy);

        /* invalid move */
        if (move == null) {
          /* was the move an end of game marker */
          if (TERMINATION_MARKERS.indexOf(moves[half_move]) > -1) {
            result = moves[half_move];
          } else {
            return false
          }
        } else {
          /* reset the end of game marker if making a valid move */
          result = '';
          make_move(move);
        }
      }

      /* Per section 8.2.6 of the PGN spec, the Result tag pair must match
       * match the termination marker. Only do this when headers are present,
       * but the result tag is missing
       */
      if (result && Object.keys(header).length && !header['Result']) {
        set_header(['Result', result]);
      }

      return true
    },

    header: function () {
      return set_header(arguments)
    },

    ascii: function () {
      return ascii()
    },

    turn: function () {
      return turn
    },

    move: function (move, options) {
      /* The move function can be called with in the following parameters:
       *
       * .move('Nxb7')      <- where 'move' is a case-sensitive SAN string
       *
       * .move({ from: 'h7', <- where the 'move' is a move object (additional
       *         to :'h8',      fields are ignored)
       *         promotion: 'q',
       *      })
       */

      // allow the user to specify the sloppy move parser to work around over
      // disambiguation bugs in Fritz and Chessbase
      var sloppy =
        typeof options !== 'undefined' && 'sloppy' in options
          ? options.sloppy
          : false;

      var move_obj = null;

      if (typeof move === 'string') {
        move_obj = move_from_san(move, sloppy);
      } else if (typeof move === 'object') {
        var moves = generate_moves();

        /* convert the pretty move object to an ugly move object */
        for (var i = 0, len = moves.length; i < len; i++) {
          if (
            move.from === algebraic(moves[i].from) &&
            move.to === algebraic(moves[i].to) &&
            (!('promotion' in moves[i]) ||
              move.promotion === moves[i].promotion)
          ) {
            move_obj = moves[i];
            break
          }
        }
      }

      /* failed to find move */
      if (!move_obj) {
        return null
      }

      /* need to make a copy of move because we can't generate SAN after the
       * move is made
       */
      var pretty_move = make_pretty(move_obj);

      make_move(move_obj);

      return pretty_move
    },

    undo: function () {
      var move = undo_move();
      return move ? make_pretty(move) : null
    },

    clear: function () {
      return clear()
    },

    put: function (piece, square) {
      return put(piece, square)
    },

    get: function (square) {
      return get(square)
    },

    remove: function (square) {
      return remove(square)
    },

    perft: function (depth) {
      return perft(depth)
    },

    square_color: function (square) {
      if (square in SQUARES) {
        var sq_0x88 = SQUARES[square];
        return (rank(sq_0x88) + file(sq_0x88)) % 2 === 0 ? 'light' : 'dark'
      }

      return null
    },

    history: function (options) {
      var reversed_history = [];
      var move_history = [];
      var verbose =
        typeof options !== 'undefined' &&
        'verbose' in options &&
        options.verbose;

      while (history.length > 0) {
        reversed_history.push(undo_move());
      }

      while (reversed_history.length > 0) {
        var move = reversed_history.pop();
        if (verbose) {
          move_history.push(make_pretty(move));
        } else {
          move_history.push(move_to_san(move, generate_moves({ legal: true })));
        }
        make_move(move);
      }

      return move_history
    },

    get_comment: function () {
      return comments[generate_fen()]
    },

    set_comment: function (comment) {
      comments[generate_fen()] = comment.replace('{', '[').replace('}', ']');
    },

    delete_comment: function () {
      var comment = comments[generate_fen()];
      delete comments[generate_fen()];
      return comment
    },

    get_comments: function () {
      prune_comments();
      return Object.keys(comments).map(function (fen) {
        return { fen: fen, comment: comments[fen] }
      })
    },

    delete_comments: function () {
      prune_comments();
      return Object.keys(comments).map(function (fen) {
        var comment = comments[fen];
        delete comments[fen];
        return { fen: fen, comment: comment }
      })
    },
  }
};

/* export Chess object if using node or any other CommonJS compatible
 * environment */
exports.Chess = Chess;
}(chess));

const colors = ['white', 'black'];
const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

const invRanks = [...ranks].reverse();
const allKeys = Array.prototype.concat(...files.map(c => ranks.map(r => c + r)));
const pos2key = (pos) => allKeys[8 * pos[0] + pos[1]];
const key2pos = (k) => [k.charCodeAt(0) - 97, k.charCodeAt(1) - 49];
const allPos = allKeys.map(key2pos);
function memo(f) {
    let v;
    const ret = () => {
        if (v === undefined)
            v = f();
        return v;
    };
    ret.clear = () => {
        v = undefined;
    };
    return ret;
}
const timer = () => {
    let startAt;
    return {
        start() {
            startAt = performance.now();
        },
        cancel() {
            startAt = undefined;
        },
        stop() {
            if (!startAt)
                return 0;
            const time = performance.now() - startAt;
            startAt = undefined;
            return time;
        },
    };
};
const opposite = (c) => (c === 'white' ? 'black' : 'white');
const distanceSq = (pos1, pos2) => {
    const dx = pos1[0] - pos2[0], dy = pos1[1] - pos2[1];
    return dx * dx + dy * dy;
};
const samePiece = (p1, p2) => p1.role === p2.role && p1.color === p2.color;
const posToTranslate = (bounds) => (pos, asWhite) => [((asWhite ? pos[0] : 7 - pos[0]) * bounds.width) / 8, ((asWhite ? 7 - pos[1] : pos[1]) * bounds.height) / 8];
const translate = (el, pos) => {
    el.style.transform = `translate(${pos[0]}px,${pos[1]}px)`;
};
const translateAndScale = (el, pos, scale = 1) => {
    el.style.transform = `translate(${pos[0]}px,${pos[1]}px) scale(${scale})`;
};
const setVisible = (el, v) => {
    el.style.visibility = v ? 'visible' : 'hidden';
};
const eventPosition = (e) => {
    var _a;
    if (e.clientX || e.clientX === 0)
        return [e.clientX, e.clientY];
    if ((_a = e.targetTouches) === null || _a === void 0 ? void 0 : _a[0])
        return [e.targetTouches[0].clientX, e.targetTouches[0].clientY];
    return; // touchend has no position!
};
const isRightButton = (e) => e.buttons === 2 || e.button === 2;
const createEl = (tagName, className) => {
    const el = document.createElement(tagName);
    if (className)
        el.className = className;
    return el;
};
function computeSquareCenter(key, asWhite, bounds) {
    const pos = key2pos(key);
    if (!asWhite) {
        pos[0] = 7 - pos[0];
        pos[1] = 7 - pos[1];
    }
    return [
        bounds.left + (bounds.width * pos[0]) / 8 + bounds.width / 16,
        bounds.top + (bounds.height * (7 - pos[1])) / 8 + bounds.height / 16,
    ];
}

function diff(a, b) {
    return Math.abs(a - b);
}
function pawn(color) {
    return (x1, y1, x2, y2) => diff(x1, x2) < 2 &&
        (color === 'white'
            ? // allow 2 squares from first two ranks, for horde
                y2 === y1 + 1 || (y1 <= 1 && y2 === y1 + 2 && x1 === x2)
            : y2 === y1 - 1 || (y1 >= 6 && y2 === y1 - 2 && x1 === x2));
}
const knight = (x1, y1, x2, y2) => {
    const xd = diff(x1, x2);
    const yd = diff(y1, y2);
    return (xd === 1 && yd === 2) || (xd === 2 && yd === 1);
};
const bishop = (x1, y1, x2, y2) => {
    return diff(x1, x2) === diff(y1, y2);
};
const rook = (x1, y1, x2, y2) => {
    return x1 === x2 || y1 === y2;
};
const queen = (x1, y1, x2, y2) => {
    return bishop(x1, y1, x2, y2) || rook(x1, y1, x2, y2);
};
function king(color, rookFiles, canCastle) {
    return (x1, y1, x2, y2) => (diff(x1, x2) < 2 && diff(y1, y2) < 2) ||
        (canCastle &&
            y1 === y2 &&
            y1 === (color === 'white' ? 0 : 7) &&
            ((x1 === 4 && ((x2 === 2 && rookFiles.includes(0)) || (x2 === 6 && rookFiles.includes(7)))) ||
                rookFiles.includes(x2)));
}
function rookFilesOf(pieces, color) {
    const backrank = color === 'white' ? '1' : '8';
    const files = [];
    for (const [key, piece] of pieces) {
        if (key[1] === backrank && piece.color === color && piece.role === 'rook') {
            files.push(key2pos(key)[0]);
        }
    }
    return files;
}
function premove(pieces, key, canCastle) {
    const piece = pieces.get(key);
    if (!piece)
        return [];
    const pos = key2pos(key), r = piece.role, mobility = r === 'pawn'
        ? pawn(piece.color)
        : r === 'knight'
            ? knight
            : r === 'bishop'
                ? bishop
                : r === 'rook'
                    ? rook
                    : r === 'queen'
                        ? queen
                        : king(piece.color, rookFilesOf(pieces, piece.color), canCastle);
    return allPos
        .filter(pos2 => (pos[0] !== pos2[0] || pos[1] !== pos2[1]) && mobility(pos[0], pos[1], pos2[0], pos2[1]))
        .map(pos2key);
}

function callUserFunction(f, ...args) {
    if (f)
        setTimeout(() => f(...args), 1);
}
function toggleOrientation(state) {
    state.orientation = opposite(state.orientation);
    state.animation.current = state.draggable.current = state.selected = undefined;
}
function setPieces(state, pieces) {
    for (const [key, piece] of pieces) {
        if (piece)
            state.pieces.set(key, piece);
        else
            state.pieces.delete(key);
    }
}
function setCheck(state, color) {
    state.check = undefined;
    if (color === true)
        color = state.turnColor;
    if (color)
        for (const [k, p] of state.pieces) {
            if (p.role === 'king' && p.color === color) {
                state.check = k;
            }
        }
}
function setPremove(state, orig, dest, meta) {
    unsetPredrop(state);
    state.premovable.current = [orig, dest];
    callUserFunction(state.premovable.events.set, orig, dest, meta);
}
function unsetPremove(state) {
    if (state.premovable.current) {
        state.premovable.current = undefined;
        callUserFunction(state.premovable.events.unset);
    }
}
function setPredrop(state, role, key) {
    unsetPremove(state);
    state.predroppable.current = { role, key };
    callUserFunction(state.predroppable.events.set, role, key);
}
function unsetPredrop(state) {
    const pd = state.predroppable;
    if (pd.current) {
        pd.current = undefined;
        callUserFunction(pd.events.unset);
    }
}
function tryAutoCastle(state, orig, dest) {
    if (!state.autoCastle)
        return false;
    const king = state.pieces.get(orig);
    if (!king || king.role !== 'king')
        return false;
    const origPos = key2pos(orig);
    const destPos = key2pos(dest);
    if ((origPos[1] !== 0 && origPos[1] !== 7) || origPos[1] !== destPos[1])
        return false;
    if (origPos[0] === 4 && !state.pieces.has(dest)) {
        if (destPos[0] === 6)
            dest = pos2key([7, destPos[1]]);
        else if (destPos[0] === 2)
            dest = pos2key([0, destPos[1]]);
    }
    const rook = state.pieces.get(dest);
    if (!rook || rook.color !== king.color || rook.role !== 'rook')
        return false;
    state.pieces.delete(orig);
    state.pieces.delete(dest);
    if (origPos[0] < destPos[0]) {
        state.pieces.set(pos2key([6, destPos[1]]), king);
        state.pieces.set(pos2key([5, destPos[1]]), rook);
    }
    else {
        state.pieces.set(pos2key([2, destPos[1]]), king);
        state.pieces.set(pos2key([3, destPos[1]]), rook);
    }
    return true;
}
function baseMove(state, orig, dest) {
    const origPiece = state.pieces.get(orig), destPiece = state.pieces.get(dest);
    if (orig === dest || !origPiece)
        return false;
    const captured = destPiece && destPiece.color !== origPiece.color ? destPiece : undefined;
    if (dest === state.selected)
        unselect(state);
    callUserFunction(state.events.move, orig, dest, captured);
    if (!tryAutoCastle(state, orig, dest)) {
        state.pieces.set(dest, origPiece);
        state.pieces.delete(orig);
    }
    state.lastMove = [orig, dest];
    state.check = undefined;
    callUserFunction(state.events.change);
    return captured || true;
}
function baseNewPiece(state, piece, key, force) {
    if (state.pieces.has(key)) {
        if (force)
            state.pieces.delete(key);
        else
            return false;
    }
    callUserFunction(state.events.dropNewPiece, piece, key);
    state.pieces.set(key, piece);
    state.lastMove = [key];
    state.check = undefined;
    callUserFunction(state.events.change);
    state.movable.dests = undefined;
    state.turnColor = opposite(state.turnColor);
    return true;
}
function baseUserMove(state, orig, dest) {
    const result = baseMove(state, orig, dest);
    if (result) {
        state.movable.dests = undefined;
        state.turnColor = opposite(state.turnColor);
        state.animation.current = undefined;
    }
    return result;
}
function userMove(state, orig, dest) {
    if (canMove(state, orig, dest)) {
        const result = baseUserMove(state, orig, dest);
        if (result) {
            const holdTime = state.hold.stop();
            unselect(state);
            const metadata = {
                premove: false,
                ctrlKey: state.stats.ctrlKey,
                holdTime,
            };
            if (result !== true)
                metadata.captured = result;
            callUserFunction(state.movable.events.after, orig, dest, metadata);
            return true;
        }
    }
    else if (canPremove(state, orig, dest)) {
        setPremove(state, orig, dest, {
            ctrlKey: state.stats.ctrlKey,
        });
        unselect(state);
        return true;
    }
    unselect(state);
    return false;
}
function dropNewPiece(state, orig, dest, force) {
    const piece = state.pieces.get(orig);
    if (piece && (canDrop(state, orig, dest) || force)) {
        state.pieces.delete(orig);
        baseNewPiece(state, piece, dest, force);
        callUserFunction(state.movable.events.afterNewPiece, piece.role, dest, {
            premove: false,
            predrop: false,
        });
    }
    else if (piece && canPredrop(state, orig, dest)) {
        setPredrop(state, piece.role, dest);
    }
    else {
        unsetPremove(state);
        unsetPredrop(state);
    }
    state.pieces.delete(orig);
    unselect(state);
}
function selectSquare(state, key, force) {
    callUserFunction(state.events.select, key);
    if (state.selected) {
        if (state.selected === key && !state.draggable.enabled) {
            unselect(state);
            state.hold.cancel();
            return;
        }
        else if ((state.selectable.enabled || force) && state.selected !== key) {
            if (userMove(state, state.selected, key)) {
                state.stats.dragged = false;
                return;
            }
        }
    }
    if (isMovable(state, key) || isPremovable(state, key)) {
        setSelected(state, key);
        state.hold.start();
    }
}
function setSelected(state, key) {
    state.selected = key;
    if (isPremovable(state, key)) {
        state.premovable.dests = premove(state.pieces, key, state.premovable.castle);
    }
    else
        state.premovable.dests = undefined;
}
function unselect(state) {
    state.selected = undefined;
    state.premovable.dests = undefined;
    state.hold.cancel();
}
function isMovable(state, orig) {
    const piece = state.pieces.get(orig);
    return (!!piece &&
        (state.movable.color === 'both' || (state.movable.color === piece.color && state.turnColor === piece.color)));
}
function canMove(state, orig, dest) {
    var _a, _b;
    return (orig !== dest && isMovable(state, orig) && (state.movable.free || !!((_b = (_a = state.movable.dests) === null || _a === void 0 ? void 0 : _a.get(orig)) === null || _b === void 0 ? void 0 : _b.includes(dest))));
}
function canDrop(state, orig, dest) {
    const piece = state.pieces.get(orig);
    return (!!piece &&
        (orig === dest || !state.pieces.has(dest)) &&
        (state.movable.color === 'both' || (state.movable.color === piece.color && state.turnColor === piece.color)));
}
function isPremovable(state, orig) {
    const piece = state.pieces.get(orig);
    return !!piece && state.premovable.enabled && state.movable.color === piece.color && state.turnColor !== piece.color;
}
function canPremove(state, orig, dest) {
    return (orig !== dest && isPremovable(state, orig) && premove(state.pieces, orig, state.premovable.castle).includes(dest));
}
function canPredrop(state, orig, dest) {
    const piece = state.pieces.get(orig);
    const destPiece = state.pieces.get(dest);
    return (!!piece &&
        (!destPiece || destPiece.color !== state.movable.color) &&
        state.predroppable.enabled &&
        (piece.role !== 'pawn' || (dest[1] !== '1' && dest[1] !== '8')) &&
        state.movable.color === piece.color &&
        state.turnColor !== piece.color);
}
function isDraggable(state, orig) {
    const piece = state.pieces.get(orig);
    return (!!piece &&
        state.draggable.enabled &&
        (state.movable.color === 'both' ||
            (state.movable.color === piece.color && (state.turnColor === piece.color || state.premovable.enabled))));
}
function playPremove(state) {
    const move = state.premovable.current;
    if (!move)
        return false;
    const orig = move[0], dest = move[1];
    let success = false;
    if (canMove(state, orig, dest)) {
        const result = baseUserMove(state, orig, dest);
        if (result) {
            const metadata = { premove: true };
            if (result !== true)
                metadata.captured = result;
            callUserFunction(state.movable.events.after, orig, dest, metadata);
            success = true;
        }
    }
    unsetPremove(state);
    return success;
}
function playPredrop(state, validate) {
    const drop = state.predroppable.current;
    let success = false;
    if (!drop)
        return false;
    if (validate(drop)) {
        const piece = {
            role: drop.role,
            color: state.movable.color,
        };
        if (baseNewPiece(state, piece, drop.key)) {
            callUserFunction(state.movable.events.afterNewPiece, drop.role, drop.key, {
                premove: false,
                predrop: true,
            });
            success = true;
        }
    }
    unsetPredrop(state);
    return success;
}
function cancelMove(state) {
    unsetPremove(state);
    unsetPredrop(state);
    unselect(state);
}
function stop(state) {
    state.movable.color = state.movable.dests = state.animation.current = undefined;
    cancelMove(state);
}
function getKeyAtDomPos(pos, asWhite, bounds) {
    let file = Math.floor((8 * (pos[0] - bounds.left)) / bounds.width);
    if (!asWhite)
        file = 7 - file;
    let rank = 7 - Math.floor((8 * (pos[1] - bounds.top)) / bounds.height);
    if (!asWhite)
        rank = 7 - rank;
    return file >= 0 && file < 8 && rank >= 0 && rank < 8 ? pos2key([file, rank]) : undefined;
}
function getSnappedKeyAtDomPos(orig, pos, asWhite, bounds) {
    const origPos = key2pos(orig);
    const validSnapPos = allPos.filter(pos2 => {
        return queen(origPos[0], origPos[1], pos2[0], pos2[1]) || knight(origPos[0], origPos[1], pos2[0], pos2[1]);
    });
    const validSnapCenters = validSnapPos.map(pos2 => computeSquareCenter(pos2key(pos2), asWhite, bounds));
    const validSnapDistances = validSnapCenters.map(pos2 => distanceSq(pos, pos2));
    const [, closestSnapIndex] = validSnapDistances.reduce((a, b, index) => (a[0] < b ? a : [b, index]), [validSnapDistances[0], 0]);
    return pos2key(validSnapPos[closestSnapIndex]);
}
function whitePov(s) {
    return s.orientation === 'white';
}

const initial = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
const roles = {
    p: 'pawn',
    r: 'rook',
    n: 'knight',
    b: 'bishop',
    q: 'queen',
    k: 'king',
};
const letters = {
    pawn: 'p',
    rook: 'r',
    knight: 'n',
    bishop: 'b',
    queen: 'q',
    king: 'k',
};
function read(fen) {
    if (fen === 'start')
        fen = initial;
    const pieces = new Map();
    let row = 7, col = 0;
    for (const c of fen) {
        switch (c) {
            case ' ':
            case '[':
                return pieces;
            case '/':
                --row;
                if (row < 0)
                    return pieces;
                col = 0;
                break;
            case '~': {
                const piece = pieces.get(pos2key([col - 1, row]));
                if (piece)
                    piece.promoted = true;
                break;
            }
            default: {
                const nb = c.charCodeAt(0);
                if (nb < 57)
                    col += nb - 48;
                else {
                    const role = c.toLowerCase();
                    pieces.set(pos2key([col, row]), {
                        role: roles[role],
                        color: c === role ? 'black' : 'white',
                    });
                    ++col;
                }
            }
        }
    }
    return pieces;
}
function write(pieces) {
    return invRanks
        .map(y => files
        .map(x => {
        const piece = pieces.get((x + y));
        if (piece) {
            let p = letters[piece.role];
            if (piece.color === 'white')
                p = p.toUpperCase();
            if (piece.promoted)
                p += '~';
            return p;
        }
        else
            return '1';
    })
        .join(''))
        .join('/')
        .replace(/1{2,}/g, s => s.length.toString());
}

function applyAnimation(state, config) {
    if (config.animation) {
        deepMerge(state.animation, config.animation);
        // no need for such short animations
        if ((state.animation.duration || 0) < 70)
            state.animation.enabled = false;
    }
}
function configure(state, config) {
    var _a, _b;
    // don't merge destinations and autoShapes. Just override.
    if ((_a = config.movable) === null || _a === void 0 ? void 0 : _a.dests)
        state.movable.dests = undefined;
    if ((_b = config.drawable) === null || _b === void 0 ? void 0 : _b.autoShapes)
        state.drawable.autoShapes = [];
    deepMerge(state, config);
    // if a fen was provided, replace the pieces
    if (config.fen) {
        state.pieces = read(config.fen);
        state.drawable.shapes = [];
    }
    // apply config values that could be undefined yet meaningful
    if ('check' in config)
        setCheck(state, config.check || false);
    if ('lastMove' in config && !config.lastMove)
        state.lastMove = undefined;
    // in case of ZH drop last move, there's a single square.
    // if the previous last move had two squares,
    // the merge algorithm will incorrectly keep the second square.
    else if (config.lastMove)
        state.lastMove = config.lastMove;
    // fix move/premove dests
    if (state.selected)
        setSelected(state, state.selected);
    applyAnimation(state, config);
    if (!state.movable.rookCastle && state.movable.dests) {
        const rank = state.movable.color === 'white' ? '1' : '8', kingStartPos = ('e' + rank), dests = state.movable.dests.get(kingStartPos), king = state.pieces.get(kingStartPos);
        if (!dests || !king || king.role !== 'king')
            return;
        state.movable.dests.set(kingStartPos, dests.filter(d => !(d === 'a' + rank && dests.includes(('c' + rank))) &&
            !(d === 'h' + rank && dests.includes(('g' + rank)))));
    }
}
function deepMerge(base, extend) {
    for (const key in extend) {
        if (isObject(base[key]) && isObject(extend[key]))
            deepMerge(base[key], extend[key]);
        else
            base[key] = extend[key];
    }
}
function isObject(o) {
    return typeof o === 'object';
}

function anim(mutation, state) {
    return state.animation.enabled ? animate(mutation, state) : render$2(mutation, state);
}
function render$2(mutation, state) {
    const result = mutation(state);
    state.dom.redraw();
    return result;
}
function makePiece(key, piece) {
    return {
        key: key,
        pos: key2pos(key),
        piece: piece,
    };
}
function closer(piece, pieces) {
    return pieces.sort((p1, p2) => {
        return distanceSq(piece.pos, p1.pos) - distanceSq(piece.pos, p2.pos);
    })[0];
}
function computePlan(prevPieces, current) {
    const anims = new Map(), animedOrigs = [], fadings = new Map(), missings = [], news = [], prePieces = new Map();
    let curP, preP, vector;
    for (const [k, p] of prevPieces) {
        prePieces.set(k, makePiece(k, p));
    }
    for (const key of allKeys) {
        curP = current.pieces.get(key);
        preP = prePieces.get(key);
        if (curP) {
            if (preP) {
                if (!samePiece(curP, preP.piece)) {
                    missings.push(preP);
                    news.push(makePiece(key, curP));
                }
            }
            else
                news.push(makePiece(key, curP));
        }
        else if (preP)
            missings.push(preP);
    }
    for (const newP of news) {
        preP = closer(newP, missings.filter(p => samePiece(newP.piece, p.piece)));
        if (preP) {
            vector = [preP.pos[0] - newP.pos[0], preP.pos[1] - newP.pos[1]];
            anims.set(newP.key, vector.concat(vector));
            animedOrigs.push(preP.key);
        }
    }
    for (const p of missings) {
        if (!animedOrigs.includes(p.key))
            fadings.set(p.key, p.piece);
    }
    return {
        anims: anims,
        fadings: fadings,
    };
}
function step(state, now) {
    const cur = state.animation.current;
    if (cur === undefined) {
        // animation was canceled :(
        if (!state.dom.destroyed)
            state.dom.redrawNow();
        return;
    }
    const rest = 1 - (now - cur.start) * cur.frequency;
    if (rest <= 0) {
        state.animation.current = undefined;
        state.dom.redrawNow();
    }
    else {
        const ease = easing(rest);
        for (const cfg of cur.plan.anims.values()) {
            cfg[2] = cfg[0] * ease;
            cfg[3] = cfg[1] * ease;
        }
        state.dom.redrawNow(true); // optimisation: don't render SVG changes during animations
        requestAnimationFrame((now = performance.now()) => step(state, now));
    }
}
function animate(mutation, state) {
    // clone state before mutating it
    const prevPieces = new Map(state.pieces);
    const result = mutation(state);
    const plan = computePlan(prevPieces, state);
    if (plan.anims.size || plan.fadings.size) {
        const alreadyRunning = state.animation.current && state.animation.current.start;
        state.animation.current = {
            start: performance.now(),
            frequency: 1 / state.animation.duration,
            plan: plan,
        };
        if (!alreadyRunning)
            step(state, performance.now());
    }
    else {
        // don't animate, just render right away
        state.dom.redraw();
    }
    return result;
}
// https://gist.github.com/gre/1650294
function easing(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

const brushes = ['green', 'red', 'blue', 'yellow'];
function start$2(state, e) {
    // support one finger touch only
    if (e.touches && e.touches.length > 1)
        return;
    e.stopPropagation();
    e.preventDefault();
    e.ctrlKey ? unselect(state) : cancelMove(state);
    const pos = eventPosition(e), orig = getKeyAtDomPos(pos, whitePov(state), state.dom.bounds());
    if (!orig)
        return;
    state.drawable.current = {
        orig,
        pos,
        brush: eventBrush(e),
        snapToValidMove: state.drawable.defaultSnapToValidMove,
    };
    processDraw(state);
}
function processDraw(state) {
    requestAnimationFrame(() => {
        const cur = state.drawable.current;
        if (cur) {
            const keyAtDomPos = getKeyAtDomPos(cur.pos, whitePov(state), state.dom.bounds());
            if (!keyAtDomPos) {
                cur.snapToValidMove = false;
            }
            const mouseSq = cur.snapToValidMove
                ? getSnappedKeyAtDomPos(cur.orig, cur.pos, whitePov(state), state.dom.bounds())
                : keyAtDomPos;
            if (mouseSq !== cur.mouseSq) {
                cur.mouseSq = mouseSq;
                cur.dest = mouseSq !== cur.orig ? mouseSq : undefined;
                state.dom.redrawNow();
            }
            processDraw(state);
        }
    });
}
function move$1(state, e) {
    if (state.drawable.current)
        state.drawable.current.pos = eventPosition(e);
}
function end$1(state) {
    const cur = state.drawable.current;
    if (cur) {
        if (cur.mouseSq)
            addShape(state.drawable, cur);
        cancel$1(state);
    }
}
function cancel$1(state) {
    if (state.drawable.current) {
        state.drawable.current = undefined;
        state.dom.redraw();
    }
}
function clear(state) {
    if (state.drawable.shapes.length) {
        state.drawable.shapes = [];
        state.dom.redraw();
        onChange(state.drawable);
    }
}
function eventBrush(e) {
    var _a;
    const modA = (e.shiftKey || e.ctrlKey) && isRightButton(e);
    const modB = e.altKey || e.metaKey || ((_a = e.getModifierState) === null || _a === void 0 ? void 0 : _a.call(e, 'AltGraph'));
    return brushes[(modA ? 1 : 0) + (modB ? 2 : 0)];
}
function addShape(drawable, cur) {
    const sameShape = (s) => s.orig === cur.orig && s.dest === cur.dest;
    const similar = drawable.shapes.find(sameShape);
    if (similar)
        drawable.shapes = drawable.shapes.filter(s => !sameShape(s));
    if (!similar || similar.brush !== cur.brush)
        drawable.shapes.push(cur);
    onChange(drawable);
}
function onChange(drawable) {
    if (drawable.onChange)
        drawable.onChange(drawable.shapes);
}

function start$1(s, e) {
    if (!e.isTrusted || (e.button !== undefined && e.button !== 0))
        return; // only touch or left click
    if (e.touches && e.touches.length > 1)
        return; // support one finger touch only
    const bounds = s.dom.bounds(), position = eventPosition(e), orig = getKeyAtDomPos(position, whitePov(s), bounds);
    if (!orig)
        return;
    const piece = s.pieces.get(orig);
    const previouslySelected = s.selected;
    if (!previouslySelected && s.drawable.enabled && (s.drawable.eraseOnClick || !piece || piece.color !== s.turnColor))
        clear(s);
    // Prevent touch scroll and create no corresponding mouse event, if there
    // is an intent to interact with the board.
    if (e.cancelable !== false &&
        (!e.touches || s.blockTouchScroll || piece || previouslySelected || pieceCloseTo(s, position)))
        e.preventDefault();
    const hadPremove = !!s.premovable.current;
    const hadPredrop = !!s.predroppable.current;
    s.stats.ctrlKey = e.ctrlKey;
    if (s.selected && canMove(s, s.selected, orig)) {
        anim(state => selectSquare(state, orig), s);
    }
    else {
        selectSquare(s, orig);
    }
    const stillSelected = s.selected === orig;
    const element = pieceElementByKey(s, orig);
    if (piece && element && stillSelected && isDraggable(s, orig)) {
        s.draggable.current = {
            orig,
            piece,
            origPos: position,
            pos: position,
            started: s.draggable.autoDistance && s.stats.dragged,
            element,
            previouslySelected,
            originTarget: e.target,
            keyHasChanged: false,
        };
        element.cgDragging = true;
        element.classList.add('dragging');
        // place ghost
        const ghost = s.dom.elements.ghost;
        if (ghost) {
            ghost.className = `ghost ${piece.color} ${piece.role}`;
            translate(ghost, posToTranslate(bounds)(key2pos(orig), whitePov(s)));
            setVisible(ghost, true);
        }
        processDrag(s);
    }
    else {
        if (hadPremove)
            unsetPremove(s);
        if (hadPredrop)
            unsetPredrop(s);
    }
    s.dom.redraw();
}
function pieceCloseTo(s, pos) {
    const asWhite = whitePov(s), bounds = s.dom.bounds(), radiusSq = Math.pow(bounds.width / 8, 2);
    for (const key of s.pieces.keys()) {
        const center = computeSquareCenter(key, asWhite, bounds);
        if (distanceSq(center, pos) <= radiusSq)
            return true;
    }
    return false;
}
function dragNewPiece(s, piece, e, force) {
    const key = 'a0';
    s.pieces.set(key, piece);
    s.dom.redraw();
    const position = eventPosition(e);
    s.draggable.current = {
        orig: key,
        piece,
        origPos: position,
        pos: position,
        started: true,
        element: () => pieceElementByKey(s, key),
        originTarget: e.target,
        newPiece: true,
        force: !!force,
        keyHasChanged: false,
    };
    processDrag(s);
}
function processDrag(s) {
    requestAnimationFrame(() => {
        var _a;
        const cur = s.draggable.current;
        if (!cur)
            return;
        // cancel animations while dragging
        if ((_a = s.animation.current) === null || _a === void 0 ? void 0 : _a.plan.anims.has(cur.orig))
            s.animation.current = undefined;
        // if moving piece is gone, cancel
        const origPiece = s.pieces.get(cur.orig);
        if (!origPiece || !samePiece(origPiece, cur.piece))
            cancel(s);
        else {
            if (!cur.started && distanceSq(cur.pos, cur.origPos) >= Math.pow(s.draggable.distance, 2))
                cur.started = true;
            if (cur.started) {
                // support lazy elements
                if (typeof cur.element === 'function') {
                    const found = cur.element();
                    if (!found)
                        return;
                    found.cgDragging = true;
                    found.classList.add('dragging');
                    cur.element = found;
                }
                const bounds = s.dom.bounds();
                translate(cur.element, [
                    cur.pos[0] - bounds.left - bounds.width / 16,
                    cur.pos[1] - bounds.top - bounds.height / 16,
                ]);
                cur.keyHasChanged || (cur.keyHasChanged = cur.orig !== getKeyAtDomPos(cur.pos, whitePov(s), bounds));
            }
        }
        processDrag(s);
    });
}
function move(s, e) {
    // support one finger touch only
    if (s.draggable.current && (!e.touches || e.touches.length < 2)) {
        s.draggable.current.pos = eventPosition(e);
    }
}
function end(s, e) {
    const cur = s.draggable.current;
    if (!cur)
        return;
    // create no corresponding mouse event
    if (e.type === 'touchend' && e.cancelable !== false)
        e.preventDefault();
    // comparing with the origin target is an easy way to test that the end event
    // has the same touch origin
    if (e.type === 'touchend' && cur.originTarget !== e.target && !cur.newPiece) {
        s.draggable.current = undefined;
        return;
    }
    unsetPremove(s);
    unsetPredrop(s);
    // touchend has no position; so use the last touchmove position instead
    const eventPos = eventPosition(e) || cur.pos;
    const dest = getKeyAtDomPos(eventPos, whitePov(s), s.dom.bounds());
    if (dest && cur.started && cur.orig !== dest) {
        if (cur.newPiece)
            dropNewPiece(s, cur.orig, dest, cur.force);
        else {
            s.stats.ctrlKey = e.ctrlKey;
            if (userMove(s, cur.orig, dest))
                s.stats.dragged = true;
        }
    }
    else if (cur.newPiece) {
        s.pieces.delete(cur.orig);
    }
    else if (s.draggable.deleteOnDropOff && !dest) {
        s.pieces.delete(cur.orig);
        callUserFunction(s.events.change);
    }
    if ((cur.orig === cur.previouslySelected || cur.keyHasChanged) && (cur.orig === dest || !dest))
        unselect(s);
    else if (!s.selectable.enabled)
        unselect(s);
    removeDragElements(s);
    s.draggable.current = undefined;
    s.dom.redraw();
}
function cancel(s) {
    const cur = s.draggable.current;
    if (cur) {
        if (cur.newPiece)
            s.pieces.delete(cur.orig);
        s.draggable.current = undefined;
        unselect(s);
        removeDragElements(s);
        s.dom.redraw();
    }
}
function removeDragElements(s) {
    const e = s.dom.elements;
    if (e.ghost)
        setVisible(e.ghost, false);
}
function pieceElementByKey(s, key) {
    let el = s.dom.elements.board.firstChild;
    while (el) {
        if (el.cgKey === key && el.tagName === 'PIECE')
            return el;
        el = el.nextSibling;
    }
    return;
}

function explosion(state, keys) {
    state.exploding = { stage: 1, keys };
    state.dom.redraw();
    setTimeout(() => {
        setStage(state, 2);
        setTimeout(() => setStage(state, undefined), 120);
    }, 120);
}
function setStage(state, stage) {
    if (state.exploding) {
        if (stage)
            state.exploding.stage = stage;
        else
            state.exploding = undefined;
        state.dom.redraw();
    }
}

// see API types and documentations in dts/api.d.ts
function start(state, redrawAll) {
    function toggleOrientation$1() {
        toggleOrientation(state);
        redrawAll();
    }
    return {
        set(config) {
            if (config.orientation && config.orientation !== state.orientation)
                toggleOrientation$1();
            applyAnimation(state, config);
            (config.fen ? anim : render$2)(state => configure(state, config), state);
        },
        state,
        getFen: () => write(state.pieces),
        toggleOrientation: toggleOrientation$1,
        setPieces(pieces) {
            anim(state => setPieces(state, pieces), state);
        },
        selectSquare(key, force) {
            if (key)
                anim(state => selectSquare(state, key, force), state);
            else if (state.selected) {
                unselect(state);
                state.dom.redraw();
            }
        },
        move(orig, dest) {
            anim(state => baseMove(state, orig, dest), state);
        },
        newPiece(piece, key) {
            anim(state => baseNewPiece(state, piece, key), state);
        },
        playPremove() {
            if (state.premovable.current) {
                if (anim(playPremove, state))
                    return true;
                // if the premove couldn't be played, redraw to clear it up
                state.dom.redraw();
            }
            return false;
        },
        playPredrop(validate) {
            if (state.predroppable.current) {
                const result = playPredrop(state, validate);
                state.dom.redraw();
                return result;
            }
            return false;
        },
        cancelPremove() {
            render$2(unsetPremove, state);
        },
        cancelPredrop() {
            render$2(unsetPredrop, state);
        },
        cancelMove() {
            render$2(state => {
                cancelMove(state);
                cancel(state);
            }, state);
        },
        stop() {
            render$2(state => {
                stop(state);
                cancel(state);
            }, state);
        },
        explode(keys) {
            explosion(state, keys);
        },
        setAutoShapes(shapes) {
            render$2(state => (state.drawable.autoShapes = shapes), state);
        },
        setShapes(shapes) {
            render$2(state => (state.drawable.shapes = shapes), state);
        },
        getKeyAtDomPos(pos) {
            return getKeyAtDomPos(pos, whitePov(state), state.dom.bounds());
        },
        redrawAll,
        dragNewPiece(piece, event, force) {
            dragNewPiece(state, piece, event, force);
        },
        destroy() {
            stop(state);
            state.dom.unbind && state.dom.unbind();
            state.dom.destroyed = true;
        },
    };
}

function defaults() {
    return {
        pieces: read(initial),
        orientation: 'white',
        turnColor: 'white',
        coordinates: true,
        ranksPosition: 'right',
        autoCastle: true,
        viewOnly: false,
        disableContextMenu: false,
        addPieceZIndex: false,
        addDimensionsCssVars: false,
        blockTouchScroll: false,
        pieceKey: false,
        highlight: {
            lastMove: true,
            check: true,
        },
        animation: {
            enabled: true,
            duration: 200,
        },
        movable: {
            free: true,
            color: 'both',
            showDests: true,
            events: {},
            rookCastle: true,
        },
        premovable: {
            enabled: true,
            showDests: true,
            castle: true,
            events: {},
        },
        predroppable: {
            enabled: false,
            events: {},
        },
        draggable: {
            enabled: true,
            distance: 3,
            autoDistance: true,
            showGhost: true,
            deleteOnDropOff: false,
        },
        dropmode: {
            active: false,
        },
        selectable: {
            enabled: true,
        },
        stats: {
            // on touchscreen, default to "tap-tap" moves
            // instead of drag
            dragged: !('ontouchstart' in window),
        },
        events: {},
        drawable: {
            enabled: true,
            visible: true,
            defaultSnapToValidMove: true,
            eraseOnClick: true,
            shapes: [],
            autoShapes: [],
            brushes: {
                green: { key: 'g', color: '#15781B', opacity: 1, lineWidth: 10 },
                red: { key: 'r', color: '#882020', opacity: 1, lineWidth: 10 },
                blue: { key: 'b', color: '#003088', opacity: 1, lineWidth: 10 },
                yellow: { key: 'y', color: '#e68f00', opacity: 1, lineWidth: 10 },
                paleBlue: { key: 'pb', color: '#003088', opacity: 0.4, lineWidth: 15 },
                paleGreen: { key: 'pg', color: '#15781B', opacity: 0.4, lineWidth: 15 },
                paleRed: { key: 'pr', color: '#882020', opacity: 0.4, lineWidth: 15 },
                paleGrey: {
                    key: 'pgr',
                    color: '#4a4a4a',
                    opacity: 0.35,
                    lineWidth: 15,
                },
            },
            prevSvgHash: '',
        },
        hold: timer(),
    };
}

// append and remove only. No updates.
function syncShapes(shapes, root, renderShape) {
    const hashesInDom = new Map(), // by hash
    toRemove = [];
    for (const sc of shapes)
        hashesInDom.set(sc.hash, false);
    let el = root.firstChild, elHash;
    while (el) {
        elHash = el.getAttribute('cgHash');
        // found a shape element that's here to stay
        if (hashesInDom.has(elHash))
            hashesInDom.set(elHash, true);
        // or remove it
        else
            toRemove.push(el);
        el = el.nextSibling;
    }
    // remove old shapes
    for (const el of toRemove)
        root.removeChild(el);
    // insert shapes that are not yet in dom
    for (const sc of shapes) {
        if (!hashesInDom.get(sc.hash))
            root.appendChild(renderShape(sc));
    }
}

function createElement(tagName) {
    return document.createElementNS('http://www.w3.org/2000/svg', tagName);
}
function renderSvg(state, svg, customSvg) {
    const d = state.drawable, curD = d.current, cur = curD && curD.mouseSq ? curD : undefined, arrowDests = new Map(), bounds = state.dom.bounds(), nonPieceAutoShapes = d.autoShapes.filter(autoShape => !autoShape.piece);
    for (const s of d.shapes.concat(nonPieceAutoShapes).concat(cur ? [cur] : [])) {
        if (s.dest)
            arrowDests.set(s.dest, (arrowDests.get(s.dest) || 0) + 1);
    }
    const shapes = d.shapes.concat(nonPieceAutoShapes).map((s) => {
        return {
            shape: s,
            current: false,
            hash: shapeHash(s, arrowDests, false, bounds),
        };
    });
    if (cur)
        shapes.push({
            shape: cur,
            current: true,
            hash: shapeHash(cur, arrowDests, true, bounds),
        });
    const fullHash = shapes.map(sc => sc.hash).join(';');
    if (fullHash === state.drawable.prevSvgHash)
        return;
    state.drawable.prevSvgHash = fullHash;
    /*
      -- DOM hierarchy --
      <svg class="cg-shapes">      (<= svg)
        <defs>
          ...(for brushes)...
        </defs>
        <g>
          ...(for arrows and circles)...
        </g>
      </svg>
      <svg class="cg-custom-svgs"> (<= customSvg)
        <g>
          ...(for custom svgs)...
        </g>
      </svg>
    */
    const defsEl = svg.querySelector('defs');
    const shapesEl = svg.querySelector('g');
    const customSvgsEl = customSvg.querySelector('g');
    syncDefs(d, shapes, defsEl);
    syncShapes(shapes.filter(s => !s.shape.customSvg), shapesEl, shape => renderShape$1(state, shape, d.brushes, arrowDests, bounds));
    syncShapes(shapes.filter(s => s.shape.customSvg), customSvgsEl, shape => renderShape$1(state, shape, d.brushes, arrowDests, bounds));
}
// append only. Don't try to update/remove.
function syncDefs(d, shapes, defsEl) {
    const brushes = new Map();
    let brush;
    for (const s of shapes) {
        if (s.shape.dest) {
            brush = d.brushes[s.shape.brush];
            if (s.shape.modifiers)
                brush = makeCustomBrush(brush, s.shape.modifiers);
            brushes.set(brush.key, brush);
        }
    }
    const keysInDom = new Set();
    let el = defsEl.firstChild;
    while (el) {
        keysInDom.add(el.getAttribute('cgKey'));
        el = el.nextSibling;
    }
    for (const [key, brush] of brushes.entries()) {
        if (!keysInDom.has(key))
            defsEl.appendChild(renderMarker(brush));
    }
}
function shapeHash({ orig, dest, brush, piece, modifiers, customSvg }, arrowDests, current, bounds) {
    return [
        bounds.width,
        bounds.height,
        current,
        orig,
        dest,
        brush,
        dest && (arrowDests.get(dest) || 0) > 1,
        piece && pieceHash(piece),
        modifiers && modifiersHash(modifiers),
        customSvg && customSvgHash(customSvg),
    ]
        .filter(x => x)
        .join(',');
}
function pieceHash(piece) {
    return [piece.color, piece.role, piece.scale].filter(x => x).join(',');
}
function modifiersHash(m) {
    return '' + (m.lineWidth || '');
}
function customSvgHash(s) {
    // Rolling hash with base 31 (cf. https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript)
    let h = 0;
    for (let i = 0; i < s.length; i++) {
        h = ((h << 5) - h + s.charCodeAt(i)) >>> 0;
    }
    return 'custom-' + h.toString();
}
function renderShape$1(state, { shape, current, hash }, brushes, arrowDests, bounds) {
    let el;
    const orig = orient(key2pos(shape.orig), state.orientation);
    if (shape.customSvg) {
        el = renderCustomSvg(shape.customSvg, orig, bounds);
    }
    else {
        if (shape.dest) {
            let brush = brushes[shape.brush];
            if (shape.modifiers)
                brush = makeCustomBrush(brush, shape.modifiers);
            el = renderArrow(brush, orig, orient(key2pos(shape.dest), state.orientation), current, (arrowDests.get(shape.dest) || 0) > 1, bounds);
        }
        else
            el = renderCircle(brushes[shape.brush], orig, current, bounds);
    }
    el.setAttribute('cgHash', hash);
    return el;
}
function renderCustomSvg(customSvg, pos, bounds) {
    const [x, y] = pos2user(pos, bounds);
    // Translate to top-left of `orig` square
    const g = setAttributes(createElement('g'), { transform: `translate(${x},${y})` });
    // Give 100x100 coordinate system to the user for `orig` square
    const svg = setAttributes(createElement('svg'), { width: 1, height: 1, viewBox: '0 0 100 100' });
    g.appendChild(svg);
    svg.innerHTML = customSvg;
    return g;
}
function renderCircle(brush, pos, current, bounds) {
    const o = pos2user(pos, bounds), widths = circleWidth(), radius = (bounds.width + bounds.height) / (4 * Math.max(bounds.width, bounds.height));
    return setAttributes(createElement('circle'), {
        stroke: brush.color,
        'stroke-width': widths[current ? 0 : 1],
        fill: 'none',
        opacity: opacity(brush, current),
        cx: o[0],
        cy: o[1],
        r: radius - widths[1] / 2,
    });
}
function renderArrow(brush, orig, dest, current, shorten, bounds) {
    const m = arrowMargin(shorten && !current), a = pos2user(orig, bounds), b = pos2user(dest, bounds), dx = b[0] - a[0], dy = b[1] - a[1], angle = Math.atan2(dy, dx), xo = Math.cos(angle) * m, yo = Math.sin(angle) * m;
    return setAttributes(createElement('line'), {
        stroke: brush.color,
        'stroke-width': lineWidth(brush, current),
        'stroke-linecap': 'round',
        'marker-end': 'url(#arrowhead-' + brush.key + ')',
        opacity: opacity(brush, current),
        x1: a[0],
        y1: a[1],
        x2: b[0] - xo,
        y2: b[1] - yo,
    });
}
function renderMarker(brush) {
    const marker = setAttributes(createElement('marker'), {
        id: 'arrowhead-' + brush.key,
        orient: 'auto',
        markerWidth: 4,
        markerHeight: 8,
        refX: 2.05,
        refY: 2.01,
    });
    marker.appendChild(setAttributes(createElement('path'), {
        d: 'M0,0 V4 L3,2 Z',
        fill: brush.color,
    }));
    marker.setAttribute('cgKey', brush.key);
    return marker;
}
function setAttributes(el, attrs) {
    for (const key in attrs)
        el.setAttribute(key, attrs[key]);
    return el;
}
function orient(pos, color) {
    return color === 'white' ? pos : [7 - pos[0], 7 - pos[1]];
}
function makeCustomBrush(base, modifiers) {
    return {
        color: base.color,
        opacity: Math.round(base.opacity * 10) / 10,
        lineWidth: Math.round(modifiers.lineWidth || base.lineWidth),
        key: [base.key, modifiers.lineWidth].filter(x => x).join(''),
    };
}
function circleWidth() {
    return [3 / 64, 4 / 64];
}
function lineWidth(brush, current) {
    return ((brush.lineWidth || 10) * (current ? 0.85 : 1)) / 64;
}
function opacity(brush, current) {
    return (brush.opacity || 1) * (current ? 0.9 : 1);
}
function arrowMargin(shorten) {
    return (shorten ? 20 : 10) / 64;
}
function pos2user(pos, bounds) {
    const xScale = Math.min(1, bounds.width / bounds.height);
    const yScale = Math.min(1, bounds.height / bounds.width);
    return [(pos[0] - 3.5) * xScale, (3.5 - pos[1]) * yScale];
}

function renderWrap(element, s) {
    // .cg-wrap (element passed to Chessground)
    //   cg-container
    //     cg-board
    //     svg.cg-shapes
    //       defs
    //       g
    //     svg.cg-custom-svgs
    //       g
    //     cg-auto-pieces
    //     coords.ranks
    //     coords.files
    //     piece.ghost
    element.innerHTML = '';
    // ensure the cg-wrap class is set
    // so bounds calculation can use the CSS width/height values
    // add that class yourself to the element before calling chessground
    // for a slight performance improvement! (avoids recomputing style)
    element.classList.add('cg-wrap');
    for (const c of colors)
        element.classList.toggle('orientation-' + c, s.orientation === c);
    element.classList.toggle('manipulable', !s.viewOnly);
    const container = createEl('cg-container');
    element.appendChild(container);
    const board = createEl('cg-board');
    container.appendChild(board);
    let svg;
    let customSvg;
    let autoPieces;
    if (s.drawable.visible) {
        svg = setAttributes(createElement('svg'), {
            class: 'cg-shapes',
            viewBox: '-4 -4 8 8',
            preserveAspectRatio: 'xMidYMid slice',
        });
        svg.appendChild(createElement('defs'));
        svg.appendChild(createElement('g'));
        customSvg = setAttributes(createElement('svg'), {
            class: 'cg-custom-svgs',
            viewBox: '-3.5 -3.5 8 8',
            preserveAspectRatio: 'xMidYMid slice',
        });
        customSvg.appendChild(createElement('g'));
        autoPieces = createEl('cg-auto-pieces');
        container.appendChild(svg);
        container.appendChild(customSvg);
        container.appendChild(autoPieces);
    }
    if (s.coordinates) {
        const orientClass = s.orientation === 'black' ? ' black' : '';
        const ranksPositionClass = s.ranksPosition === 'left' ? ' left' : '';
        container.appendChild(renderCoords(ranks, 'ranks' + orientClass + ranksPositionClass));
        container.appendChild(renderCoords(files, 'files' + orientClass));
    }
    let ghost;
    if (s.draggable.showGhost) {
        ghost = createEl('piece', 'ghost');
        setVisible(ghost, false);
        container.appendChild(ghost);
    }
    return {
        board,
        container,
        wrap: element,
        ghost,
        svg,
        customSvg,
        autoPieces,
    };
}
function renderCoords(elems, className) {
    const el = createEl('coords', className);
    let f;
    for (const elem of elems) {
        f = createEl('coord');
        f.textContent = elem;
        el.appendChild(f);
    }
    return el;
}

function drop(s, e) {
    if (!s.dropmode.active)
        return;
    unsetPremove(s);
    unsetPredrop(s);
    const piece = s.dropmode.piece;
    if (piece) {
        s.pieces.set('a0', piece);
        const position = eventPosition(e);
        const dest = position && getKeyAtDomPos(position, whitePov(s), s.dom.bounds());
        if (dest)
            dropNewPiece(s, 'a0', dest);
    }
    s.dom.redraw();
}

function bindBoard(s, onResize) {
    const boardEl = s.dom.elements.board;
    if ('ResizeObserver' in window)
        new ResizeObserver(onResize).observe(s.dom.elements.wrap);
    if (s.viewOnly)
        return;
    // Cannot be passive, because we prevent touch scrolling and dragging of
    // selected elements.
    const onStart = startDragOrDraw(s);
    boardEl.addEventListener('touchstart', onStart, {
        passive: false,
    });
    boardEl.addEventListener('mousedown', onStart, {
        passive: false,
    });
    if (s.disableContextMenu || s.drawable.enabled) {
        boardEl.addEventListener('contextmenu', e => e.preventDefault());
    }
}
// returns the unbind function
function bindDocument(s, onResize) {
    const unbinds = [];
    // Old versions of Edge and Safari do not support ResizeObserver. Send
    // chessground.resize if a user action has changed the bounds of the board.
    if (!('ResizeObserver' in window))
        unbinds.push(unbindable(document.body, 'chessground.resize', onResize));
    if (!s.viewOnly) {
        const onmove = dragOrDraw(s, move, move$1);
        const onend = dragOrDraw(s, end, end$1);
        for (const ev of ['touchmove', 'mousemove'])
            unbinds.push(unbindable(document, ev, onmove));
        for (const ev of ['touchend', 'mouseup'])
            unbinds.push(unbindable(document, ev, onend));
        const onScroll = () => s.dom.bounds.clear();
        unbinds.push(unbindable(document, 'scroll', onScroll, { capture: true, passive: true }));
        unbinds.push(unbindable(window, 'resize', onScroll, { passive: true }));
    }
    return () => unbinds.forEach(f => f());
}
function unbindable(el, eventName, callback, options) {
    el.addEventListener(eventName, callback, options);
    return () => el.removeEventListener(eventName, callback, options);
}
function startDragOrDraw(s) {
    return e => {
        if (s.draggable.current)
            cancel(s);
        else if (s.drawable.current)
            cancel$1(s);
        else if (e.shiftKey || isRightButton(e)) {
            if (s.drawable.enabled)
                start$2(s, e);
        }
        else if (!s.viewOnly) {
            if (s.dropmode.active)
                drop(s, e);
            else
                start$1(s, e);
        }
    };
}
function dragOrDraw(s, withDrag, withDraw) {
    return e => {
        if (s.drawable.current) {
            if (s.drawable.enabled)
                withDraw(s, e);
        }
        else if (!s.viewOnly)
            withDrag(s, e);
    };
}

// ported from https://github.com/veloce/lichobile/blob/master/src/js/chessground/view.js
// in case of bugs, blame @veloce
function render$1(s) {
    const asWhite = whitePov(s), posToTranslate$1 = posToTranslate(s.dom.bounds()), boardEl = s.dom.elements.board, pieces = s.pieces, curAnim = s.animation.current, anims = curAnim ? curAnim.plan.anims : new Map(), fadings = curAnim ? curAnim.plan.fadings : new Map(), curDrag = s.draggable.current, squares = computeSquareClasses(s), samePieces = new Set(), sameSquares = new Set(), movedPieces = new Map(), movedSquares = new Map(); // by class name
    let k, el, pieceAtKey, elPieceName, anim, fading, pMvdset, pMvd, sMvdset, sMvd;
    // walk over all board dom elements, apply animations and flag moved pieces
    el = boardEl.firstChild;
    while (el) {
        k = el.cgKey;
        if (isPieceNode(el)) {
            pieceAtKey = pieces.get(k);
            anim = anims.get(k);
            fading = fadings.get(k);
            elPieceName = el.cgPiece;
            // if piece not being dragged anymore, remove dragging style
            if (el.cgDragging && (!curDrag || curDrag.orig !== k)) {
                el.classList.remove('dragging');
                translate(el, posToTranslate$1(key2pos(k), asWhite));
                el.cgDragging = false;
            }
            // remove fading class if it still remains
            if (!fading && el.cgFading) {
                el.cgFading = false;
                el.classList.remove('fading');
            }
            // there is now a piece at this dom key
            if (pieceAtKey) {
                // continue animation if already animating and same piece
                // (otherwise it could animate a captured piece)
                if (anim && el.cgAnimating && elPieceName === pieceNameOf(pieceAtKey)) {
                    const pos = key2pos(k);
                    pos[0] += anim[2];
                    pos[1] += anim[3];
                    el.classList.add('anim');
                    translate(el, posToTranslate$1(pos, asWhite));
                }
                else if (el.cgAnimating) {
                    el.cgAnimating = false;
                    el.classList.remove('anim');
                    translate(el, posToTranslate$1(key2pos(k), asWhite));
                    if (s.addPieceZIndex)
                        el.style.zIndex = posZIndex(key2pos(k), asWhite);
                }
                // same piece: flag as same
                if (elPieceName === pieceNameOf(pieceAtKey) && (!fading || !el.cgFading)) {
                    samePieces.add(k);
                }
                // different piece: flag as moved unless it is a fading piece
                else {
                    if (fading && elPieceName === pieceNameOf(fading)) {
                        el.classList.add('fading');
                        el.cgFading = true;
                    }
                    else {
                        appendValue(movedPieces, elPieceName, el);
                    }
                }
            }
            // no piece: flag as moved
            else {
                appendValue(movedPieces, elPieceName, el);
            }
        }
        else if (isSquareNode(el)) {
            const cn = el.className;
            if (squares.get(k) === cn)
                sameSquares.add(k);
            else
                appendValue(movedSquares, cn, el);
        }
        el = el.nextSibling;
    }
    // walk over all squares in current set, apply dom changes to moved squares
    // or append new squares
    for (const [sk, className] of squares) {
        if (!sameSquares.has(sk)) {
            sMvdset = movedSquares.get(className);
            sMvd = sMvdset && sMvdset.pop();
            const translation = posToTranslate$1(key2pos(sk), asWhite);
            if (sMvd) {
                sMvd.cgKey = sk;
                translate(sMvd, translation);
            }
            else {
                const squareNode = createEl('square', className);
                squareNode.cgKey = sk;
                translate(squareNode, translation);
                boardEl.insertBefore(squareNode, boardEl.firstChild);
            }
        }
    }
    // walk over all pieces in current set, apply dom changes to moved pieces
    // or append new pieces
    for (const [k, p] of pieces) {
        anim = anims.get(k);
        if (!samePieces.has(k)) {
            pMvdset = movedPieces.get(pieceNameOf(p));
            pMvd = pMvdset && pMvdset.pop();
            // a same piece was moved
            if (pMvd) {
                // apply dom changes
                pMvd.cgKey = k;
                if (pMvd.cgFading) {
                    pMvd.classList.remove('fading');
                    pMvd.cgFading = false;
                }
                const pos = key2pos(k);
                if (s.addPieceZIndex)
                    pMvd.style.zIndex = posZIndex(pos, asWhite);
                if (anim) {
                    pMvd.cgAnimating = true;
                    pMvd.classList.add('anim');
                    pos[0] += anim[2];
                    pos[1] += anim[3];
                }
                translate(pMvd, posToTranslate$1(pos, asWhite));
            }
            // no piece in moved obj: insert the new piece
            // assumes the new piece is not being dragged
            else {
                const pieceName = pieceNameOf(p), pieceNode = createEl('piece', pieceName), pos = key2pos(k);
                pieceNode.cgPiece = pieceName;
                pieceNode.cgKey = k;
                if (anim) {
                    pieceNode.cgAnimating = true;
                    pos[0] += anim[2];
                    pos[1] += anim[3];
                }
                translate(pieceNode, posToTranslate$1(pos, asWhite));
                if (s.addPieceZIndex)
                    pieceNode.style.zIndex = posZIndex(pos, asWhite);
                boardEl.appendChild(pieceNode);
            }
        }
    }
    // remove any element that remains in the moved sets
    for (const nodes of movedPieces.values())
        removeNodes(s, nodes);
    for (const nodes of movedSquares.values())
        removeNodes(s, nodes);
}
function renderResized$1(s) {
    const asWhite = whitePov(s), posToTranslate$1 = posToTranslate(s.dom.bounds());
    let el = s.dom.elements.board.firstChild;
    while (el) {
        if ((isPieceNode(el) && !el.cgAnimating) || isSquareNode(el)) {
            translate(el, posToTranslate$1(key2pos(el.cgKey), asWhite));
        }
        el = el.nextSibling;
    }
}
function updateBounds(s) {
    const bounds = s.dom.elements.wrap.getBoundingClientRect();
    const container = s.dom.elements.container;
    const ratio = bounds.height / bounds.width;
    const width = (Math.floor((bounds.width * window.devicePixelRatio) / 8) * 8) / window.devicePixelRatio;
    const height = width * ratio;
    container.style.width = width + 'px';
    container.style.height = height + 'px';
    s.dom.bounds.clear();
    if (s.addDimensionsCssVars) {
        document.documentElement.style.setProperty('--cg-width', width + 'px');
        document.documentElement.style.setProperty('--cg-height', height + 'px');
    }
}
function isPieceNode(el) {
    return el.tagName === 'PIECE';
}
function isSquareNode(el) {
    return el.tagName === 'SQUARE';
}
function removeNodes(s, nodes) {
    for (const node of nodes)
        s.dom.elements.board.removeChild(node);
}
function posZIndex(pos, asWhite) {
    const minZ = 3;
    const rank = pos[1];
    const z = asWhite ? minZ + 7 - rank : minZ + rank;
    return `${z}`;
}
function pieceNameOf(piece) {
    return `${piece.color} ${piece.role}`;
}
function computeSquareClasses(s) {
    var _a;
    const squares = new Map();
    if (s.lastMove && s.highlight.lastMove)
        for (const k of s.lastMove) {
            addSquare(squares, k, 'last-move');
        }
    if (s.check && s.highlight.check)
        addSquare(squares, s.check, 'check');
    if (s.selected) {
        addSquare(squares, s.selected, 'selected');
        if (s.movable.showDests) {
            const dests = (_a = s.movable.dests) === null || _a === void 0 ? void 0 : _a.get(s.selected);
            if (dests)
                for (const k of dests) {
                    addSquare(squares, k, 'move-dest' + (s.pieces.has(k) ? ' oc' : ''));
                }
            const pDests = s.premovable.dests;
            if (pDests)
                for (const k of pDests) {
                    addSquare(squares, k, 'premove-dest' + (s.pieces.has(k) ? ' oc' : ''));
                }
        }
    }
    const premove = s.premovable.current;
    if (premove)
        for (const k of premove)
            addSquare(squares, k, 'current-premove');
    else if (s.predroppable.current)
        addSquare(squares, s.predroppable.current.key, 'current-premove');
    const o = s.exploding;
    if (o)
        for (const k of o.keys)
            addSquare(squares, k, 'exploding' + o.stage);
    return squares;
}
function addSquare(squares, key, klass) {
    const classes = squares.get(key);
    if (classes)
        squares.set(key, `${classes} ${klass}`);
    else
        squares.set(key, klass);
}
function appendValue(map, key, value) {
    const arr = map.get(key);
    if (arr)
        arr.push(value);
    else
        map.set(key, [value]);
}

function render(state, autoPieceEl) {
    const autoPieces = state.drawable.autoShapes.filter(autoShape => autoShape.piece);
    const autoPieceShapes = autoPieces.map((s) => {
        return {
            shape: s,
            hash: hash(s),
            current: false,
        };
    });
    syncShapes(autoPieceShapes, autoPieceEl, shape => renderShape(state, shape, state.dom.bounds()));
}
function renderResized(state) {
    var _a;
    const asWhite = whitePov(state), posToTranslate$1 = posToTranslate(state.dom.bounds());
    let el = (_a = state.dom.elements.autoPieces) === null || _a === void 0 ? void 0 : _a.firstChild;
    while (el) {
        translateAndScale(el, posToTranslate$1(key2pos(el.cgKey), asWhite), el.cgScale);
        el = el.nextSibling;
    }
}
function renderShape(state, { shape, hash }, bounds) {
    var _a, _b, _c;
    const orig = shape.orig;
    const role = (_a = shape.piece) === null || _a === void 0 ? void 0 : _a.role;
    const color = (_b = shape.piece) === null || _b === void 0 ? void 0 : _b.color;
    const scale = (_c = shape.piece) === null || _c === void 0 ? void 0 : _c.scale;
    const pieceEl = createEl('piece', `${role} ${color}`);
    pieceEl.setAttribute('cgHash', hash);
    pieceEl.cgKey = orig;
    pieceEl.cgScale = scale;
    translateAndScale(pieceEl, posToTranslate(bounds)(key2pos(orig), whitePov(state)), scale);
    return pieceEl;
}
function hash(autoPiece) {
    var _a, _b, _c;
    return [autoPiece.orig, (_a = autoPiece.piece) === null || _a === void 0 ? void 0 : _a.role, (_b = autoPiece.piece) === null || _b === void 0 ? void 0 : _b.color, (_c = autoPiece.piece) === null || _c === void 0 ? void 0 : _c.scale].join(',');
}

function Chessground(element, config) {
    const maybeState = defaults();
    configure(maybeState, config || {});
    function redrawAll() {
        const prevUnbind = 'dom' in maybeState ? maybeState.dom.unbind : undefined;
        // compute bounds from existing board element if possible
        // this allows non-square boards from CSS to be handled (for 3D)
        const elements = renderWrap(element, maybeState), bounds = memo(() => elements.board.getBoundingClientRect()), redrawNow = (skipSvg) => {
            render$1(state);
            if (elements.autoPieces)
                render(state, elements.autoPieces);
            if (!skipSvg && elements.svg)
                renderSvg(state, elements.svg, elements.customSvg);
        }, onResize = () => {
            updateBounds(state);
            renderResized$1(state);
            if (elements.autoPieces)
                renderResized(state);
        };
        const state = maybeState;
        state.dom = {
            elements,
            bounds,
            redraw: debounceRedraw(redrawNow),
            redrawNow,
            unbind: prevUnbind,
        };
        state.drawable.prevSvgHash = '';
        updateBounds(state);
        redrawNow(false);
        bindBoard(state, onResize);
        if (!prevUnbind)
            state.dom.unbind = bindDocument(state, onResize);
        state.events.insert && state.events.insert(elements);
        return state;
    }
    return start(redrawAll(), redrawAll);
}
function debounceRedraw(redrawNow) {
    let redrawing = false;
    return () => {
        if (redrawing)
            return;
        redrawing = true;
        requestAnimationFrame(() => {
            redrawNow();
            redrawing = false;
        });
    };
}

const PIECE_STYLES = [
    "alpha",
    "california",
    "cardinal",
    "cburnett",
    "chess7",
    "chessnut",
    "companion",
    "dubrovny",
    "fantasy",
    "fresca",
    "gioco",
    "governor",
    "horsey",
    "icpieces",
    "kosal",
    "leipzig",
    "letter",
    "libra",
    "maestro",
    "merida",
    "pirouetti",
    "pixel",
    "reillycraig",
    "riohacha",
    "shapes",
    "spatial",
    "staunty",
    "tatiana",
];
const BOARD_STYLES = ["blue", "brown", "green", "ic", "purple"];
function parse_user_config(settings, content) {
    let userConfig = Object.assign(Object.assign({}, settings), { fen: "", currentOrientation: "" });
    try {
        return Object.assign(Object.assign({}, userConfig), obsidian.parseYaml(content));
    }
    catch (e) {
        // failed to parse
        return userConfig;
    }
}

class StartingPosition {
    constructor(eco, name, fen, wikiPath, moves) {
        this.eco = eco;
        this.name = name;
        this.fen = fen;
        this.wikiPath = wikiPath;
        this.moves = moves;
    }
}
class Category {
    constructor(id, items) {
        this.id = id;
        this.items = items;
    }
}
const categories = [
    new Category("e4", [
        new StartingPosition("B00", "King's Pawn", "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1", "King's_Pawn_Game", ["e4"]),
        new StartingPosition("B00", "Open Game", "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", "Open_Game", ["e4 e5"]),
        new StartingPosition("B02", "Alekhine's Defence", "rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 1 2", "Alekhine's_Defence", ["e4 Nf6"]),
        new StartingPosition("B04", "Alekhine's Defence: Modern Variation", "rnbqkb1r/ppp1pppp/3p4/3nP3/3P4/5N2/PPP2PPP/RNBQKB1R b KQkq - 1 4", "Alekhine's_Defence#Modern_Variation:_3.d4_d6_4.Nf3", ["e4 Nf6", "e5 Nd5", "d4 d6", "Nf3"]),
        new StartingPosition("C23", "Bishop's Opening", "rnbqkbnr/pppp1ppp/8/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR b KQkq - 1 2", "Bishop%27s_Opening", ["e4 e5", "Bc4"]),
        new StartingPosition("B10", "Caro-Kann Defence", "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", "Caro–Kann_Defence", ["e4 c6"]),
        new StartingPosition("B12", "Caro-Kann Defence: Advance Variation", "rnbqkbnr/pp2pppp/2p5/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3", "Caro–Kann_Defence#Advance_Variation:_3.e5", ["e4 c6", "d4 d5", "e5"]),
        new StartingPosition("B18", "Caro-Kann Defence: Classical Variation", "rn1qkbnr/pp2pppp/2p5/5b2/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5", "Caro–Kann_Defence#Classical_Variation:_4...Bf5", ["e4 c6", "d4 d5", "Nc3 dxe4", "Nxe4 Bf5"]),
        new StartingPosition("B13", "Caro-Kann Defence: Exchange Variation", "rnbqkbnr/pp2pppp/2p5/3P4/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3", "Caro%E2%80%93Kann_Defence#Exchange_Variation:_3.exd5_cxd5", ["e4 c6", "d4 d5", "exd5"]),
        new StartingPosition("B14", "Caro-Kann Defence: Panov-Botvinnik Attack", "rnbqkb1r/pp2pppp/5n2/3p4/2PP4/2N5/PP3PPP/R1BQKBNR b KQkq - 2 5", "Caro–Kann_Defence#Panov.E2.80.93Botvinnik_Attack:_4.c4", ["e4 c6", "d4 d5", "exd5 cxd5", "c4 Nf6", "Nc3"]),
        new StartingPosition("B17", "Caro-Kann Defence: Steinitz Variation", "r1bqkbnr/pp1npppp/2p5/8/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5", "Caro–Kann_Defence#Modern_Variation:_4...Nd7", ["e4 c6", "d4 d5", "Nc3 dxe4", "Nxe4 Nd7"]),
        new StartingPosition("C21", "Danish Gambit", "rnbqkbnr/pppp1ppp/8/8/3pP3/2P5/PP3PPP/RNBQKBNR b KQkq - 0 3", "Danish_Gambit", ["e4 e5", "d4 exd4", "c3"]),
        new StartingPosition("C46", "Four Knights Game", "r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 4 4", "Four_Knights_Game", ["e4 e5", "Nf3 Nc6", "Nc3 Nf6"]),
        new StartingPosition("C47", "Four Knights Game: Scotch Variation", "r1bqkb1r/pppp1ppp/2n2n2/4p3/3PP3/2N2N2/PPP2PPP/R1BQKB1R b KQkq - 0 4", "Four_Knights_Game#4.d4", ["e4 e5", "Nf3 Nc6", "Nc3 Nf6", "d4"]),
        new StartingPosition("C48", "Four Knights Game: Spanish Variation", "r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/2N2N2/PPPP1PPP/R1BQK2R b KQkq - 5 4", "Four_Knights_Game#4.Bb5", ["e4 e5", "Nf3 Nf6", "Nc3 Nc6", "Bb5"]),
        new StartingPosition("C00", "French Defence", "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", "French_Defence", ["e4 e6"]),
        new StartingPosition("C02", "French Defence: Advance Variation", "rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3", "French_Defence#Advance_Variation:_3.e5", ["e4 e6", "d4 d5", "e5"]),
        new StartingPosition("C11", "French Defence: Burn Variation", "rnbqkb1r/ppp2ppp/4pn2/3p2B1/3PP3/2N5/PPP2PPP/R2QKBNR b KQkq - 0 5", "French_Defence#3.Nc3", ["e4 e6", "d4 d5", "Nc3 Nf6", "Bg5 dxe4"]),
        new StartingPosition("C11", "French Defence: Classical Variation", "rnbqkb1r/ppp2ppp/4pn2/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 2 4", "French_Defence#Classical_Variation:_3...Nf6", ["e4 e6", "d4 d5", "Nc3 Nf6"]),
        new StartingPosition("C01", "French Defence: Exchange Variation", "rnbqkbnr/ppp2ppp/4p3/3P4/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3", "French_Defence#Exchange_Variation:_3.exd5_exd5", ["e4 e6", "d4 d5", "exd5"]),
        new StartingPosition("C10", "French Defence: Rubinstein Variation", "rnbqkbnr/ppp2ppp/4p3/8/3Pp3/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 4", "French_Defence#Rubinstein_Variation:_3...dxe4", ["e4 e6", "d4 d5", "Nc3 dxe4"]),
        new StartingPosition("C03", "French Defence: Tarrasch Variation", "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPPN1PPP/R1BQKBNR b KQkq - 1 3", "French_Defence#Tarrasch_Variation:_3.Nd2", ["e4 e6", "d4 d5", "Nd2"]),
        new StartingPosition("C15", "French Defence: Winawer Variation", "rnbqk1nr/ppp2ppp/4p3/3p4/1b1PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 2 4", "French_Defence#Winawer_Variation:_3...Bb4", ["e4 e6", "d4 d5", "Nc3 Bb4"]),
        new StartingPosition("C50", "Giuoco Piano", "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4", "Giuoco_Piano", ["e4 e5", "Nf3 Nc6", "Bc4 Bc5"]),
        new StartingPosition("C50", "Italian Game", "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3", "Italian_Game", ["e4 e5", "Nf3 Nc6", "Bc4"]),
        new StartingPosition("C51", "Evans Gambit", "r1bqk1nr/pppp1ppp/2n5/2b1p3/1PB1P3/5N2/P1PP1PPP/RNBQK2R b KQkq - 0 4", "Evans_Gambit", ["e4 e5", "Nf3 Nc6", "Bc4 Bc5", "b4"]),
        new StartingPosition("C50", "Italian Game: Hungarian Defence", "r1bqk1nr/ppppbppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4", "Hungarian_Defense", ["e4 e5", "Nf3 Nc6", "Bc4 Be7"]),
        new StartingPosition("C55", "Italian Game: Two Knights Defence", "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4", "Two_Knights_Defense", ["e4 e5", "Nf3 Nc6", "Bc4 Nf6"]),
        new StartingPosition("C30", "King's Gambit", "rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR b KQkq - 0 2", "King's_Gambit", ["e4 e5", "f4"]),
        new StartingPosition("C33", "King's Gambit Accepted", "rnbqkbnr/pppp1ppp/8/8/4Pp2/8/PPPP2PP/RNBQKBNR w KQkq - 0 3", "King's_Gambit#King.27s_Gambit_Accepted:_2...exf4", ["e4 e5", "f4 exf4"]),
        new StartingPosition("C33", "King's Gambit Accepted: Bishop's Gambit", "rnbqkbnr/pppp1ppp/8/8/2B1Pp2/8/PPPP2PP/RNBQK1NR b KQkq - 1 3", "King's_Gambit#King.27s_Gambit_Accepted:_2...exf4", ["e4 e5", "f4 exf4", "Bc4"]),
        new StartingPosition("C36", "King's Gambit Accepted: Modern Defence", "rnbqkbnr/ppp2ppp/8/3p4/4Pp2/5N2/PPPP2PP/RNBQKB1R w KQkq d6 0 4", "King's_Gambit#Modern_Defence:_3...d5", ["e4 e5", "f4 exf4", "Nf3 d5"]),
        new StartingPosition("C30", "King's Gambit Accepted: Classical Variation", "rnbqkbnr/pppp1p1p/8/6p1/4Pp2/5N2/PPPP2PP/RNBQKB1R w KQkq - 0 4", "King's_Gambit#Classical_Variation:_3...g5", ["e4 e5", "f4 exf4", "Nf3 g5"]),
        new StartingPosition("C30", "King's Gambit Declined: Classical Variation", "rnbqk1nr/pppp1ppp/8/2b1p3/4PP2/8/PPPP2PP/RNBQKBNR w KQkq - 1 3", "King's_Gambit#Classical_Defence:_2...Bc5", ["e4 e5", "f4 Bc5"]),
        new StartingPosition("C31", "King's Gambit: Falkbeer Countergambit", "rnbqkbnr/ppp2ppp/8/3pp3/4PP2/8/PPPP2PP/RNBQKBNR w KQkq - 0 3", "King%27s_Gambit,_Falkbeer_Countergambit", ["e4 e5", "f4 d5"]),
        new StartingPosition("B06", "Modern Defence", "rnbqkbnr/pppppp1p/6p1/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", "Modern_Defense", ["e4 g6"]),
        new StartingPosition("B06", "Modern Defence: Robatsch Defence", "rnbqk1nr/ppppppbp/6p1/8/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 2 3", "Modern_Defense", ["e4 g6", "d4 Bg7", "Nc3"]),
        new StartingPosition("C41", "Philidor Defence", "rnbqkbnr/ppp2ppp/3p4/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3", "Philidor_Defence", ["e4 e5", "Nf3 d6"]),
        new StartingPosition("C41", "Philidor Defence: Lion Variation", "r1bqkb1r/pppn1ppp/3p1n2/4p3/3PP3/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 2 5", "Philidor_Defence", ["e4 d6", "d4 Nf6", "Nc3 e5", "Nf3 Nbd7"]),
        new StartingPosition("B07", "Lion Variation: Anti-Philidor", "r1bqkb1r/pppn1ppp/3p1n2/4p3/3PPP2/2N5/PPP3PP/R1BQKBNR w KQkq - 0 5", "Philidor_Defence", ["e4 d6", "d4 Nf6", "Nc3 Nbd7", "f4 e5"]),
        new StartingPosition("B07", "Pirc Defence", "rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 2 3", "Pirc_Defence", ["e4 d6", "d4 Nf6", "Nc3"]),
        new StartingPosition("B09", "Pirc Defence: Austrian Attack", "rnbqkb1r/ppp1pp1p/3p1np1/8/3PPP2/2N5/PPP3PP/R1BQKBNR b KQkq - 0 4", "Pirc_Defence#Austrian_Attack:_4.f4", ["e4 d6", "d4 Nf6", "Nc3 g6", "f4"]),
        new StartingPosition("B07", "Pirc Defence: Classical Variation", "rnbqkb1r/ppp1pp1p/3p1np1/8/3PP3/2N2N2/PPP2PPP/R1BQKB1R b KQkq - 1 4", "Pirc_Defence#Classical_.28Two_Knights.29_System:_4.Nf3", ["e4 d6", "d4 Nf6", "Nc3 g6", "Nf3"]),
        new StartingPosition("B07", "Pirc Defence: Lion Variation", "r1bqkb1r/pppnpppp/3p1n2/8/3PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 3 4", "Pirc_Defence#Classical_.28Two_Knights.29_System", ["e4 d6", "d4 Nf6", "Nc3 Nbd7"]),
        new StartingPosition("C42", "Petrov's Defence", "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3", "Petrov's_Defence", ["e4 e5", "Nf3 Nf6"]),
        new StartingPosition("C42", "Petrov's Defence: Classical Attack", "rnbqkb1r/ppp2ppp/3p4/8/3Pn3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 5", "Petrov's_Defence#3.Nxe5", ["e4 e5", "Nf3 Nf6", "Nxe5 d6", "Nf3 Nxe4", "d4"]),
        new StartingPosition("C43", "Petrov's Defence: Steinitz Attack", "rnbqkb1r/pppp1ppp/5n2/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3", "Petrov's_Defence#3.d4", ["e4 e5", "Nf3 Nf6", "d4"]),
        new StartingPosition("C42", "Petrov's Defence: Three Knights Game", "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R b KQkq - 3 3", "Petrov's_Defence#3.Nc3", ["e4 e5", "Nf3 Nf6", "Nc3"]),
        new StartingPosition("C60", "Ruy Lopez", "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3", "Ruy_Lopez", ["e4 e5", "Nf3 Nc6", "Bb5"]),
        new StartingPosition("C65", "Ruy Lopez: Berlin Defence", "r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4", "Ruy_Lopez#Berlin_Defence:_3...Nf6", ["e4 e5", "Nf3 Nc6", "Bb5 Nf6"]),
        new StartingPosition("C64", "Ruy Lopez: Classical Variation", "r1bqk1nr/pppp1ppp/2n5/1Bb1p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4", "Ruy_Lopez#Classical_Defence:_3...Bc5", ["e4 e5", "Nf3 Nc6", "Bb5 Bc5"]),
        new StartingPosition("C84", "Ruy Lopez: Closed Variation", "r1bqk2r/2ppbppp/p1n2n2/1p2p3/4P3/1B3N2/PPPP1PPP/RNBQR1K1 b kq - 1 7", "Ruy_Lopez#Main_line:_4.Ba4_Nf6_5.0-0_Be7_6.Re1_b5_7.Bb3_d6_8.c3_0-0", ["e4 e5", "Nf3 Nc6", "Bb5 a6", "Ba4 Nf6", "O-O Be7", "Re1 b5", "Bb3"]),
        new StartingPosition("C68", "Ruy Lopez: Exchange Variation", "r1bqkbnr/1ppp1ppp/p1B5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 4", "Ruy_Lopez,_Exchange_Variation", ["e4 e5", "Nf3 Nc6", "Bb5 a6", "Bxc6"]),
        new StartingPosition("C89", "Ruy Lopez: Marshall Attack", "r1bq1rk1/2p1bppp/p1n2n2/1p1pp3/4P3/1BP2N2/PP1P1PPP/RNBQR1K1 w - - 0 9", "Ruy_Lopez#Marshall_Attack", ["e4 e5", "Nf3 Nc6", "Bb5 a6", "Ba4 Nf6", "O-O Be7", "Re1 b5", "Bb3 O-O", "c3 d5"]),
        new StartingPosition("C63", "Ruy Lopez: Schliemann Defence", "r1bqkbnr/pppp2pp/2n5/1B2pp2/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4", "Ruy_Lopez#Schliemann_Defence:_3...f5", ["e4 e5", "Nf3 Nc6", "Bb5 f5"]),
        new StartingPosition("B01", "Scandinavian Defence", "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", "Scandinavian_Defense", ["e4 d5"]),
        new StartingPosition("B01", "Scandinavian Defence: Modern Variation", "rnbqkb1r/ppp1pppp/5n2/3P4/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3", "Scandinavian_Defense#2...Nf6", ["e4 d5", "exd5 Nf6", "d4"]),
        new StartingPosition("B01", "Scandinavian Defence: Icelandic-Palme Gambit", "rnbqkb1r/ppp2ppp/4pn2/3P4/2P5/8/PP1P1PPP/RNBQKBNR w KQkq - 0 4", "Scandinavian_Defense#2...Nf6", ["e4 d5", "exd5 Nf6", "c4 e6"]),
        new StartingPosition("C44", "Scotch Game", "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3", "Scotch_Game", ["e4 e5", "Nf3 Nc6", "d4"]),
        new StartingPosition("C45", "Scotch Game: Classical Variation", "r1bqk1nr/pppp1ppp/2n5/2b5/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 1 5", "Scotch_Game,_Classical_Variation", ["e4 e5", "Nf3 Nc6", "d4 exd4", "Nxd4 Bc5"]),
        new StartingPosition("C45", "Scotch Game: Mieses Variation", "r1bqkb1r/p1pp1ppp/2p2n2/4P3/8/8/PPP2PPP/RNBQKB1R b KQkq - 0 6", "Scotch_Game#Schmidt_Variation:_4...Nf6", ["e4 e5", "Nf3 Nc6", "d4 exd4", "Nxd4 Nf6", "Nxc6 bxc6", "e5"]),
        new StartingPosition("C45", "Scotch Game: Steinitz Variation", "r1b1kbnr/pppp1ppp/2n5/8/3NP2q/8/PPP2PPP/RNBQKB1R w KQkq - 1 5", "Scotch_Game#Steinitz_Variation:_4...Qh4.21.3F", ["e4 e5", "Nf3 Nc6", "d4 exd4", "Nxd4 Qh4"]),
        new StartingPosition("B20", "Sicilian Defence", "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", "Sicilian_Defence", ["e4 c5"]),
        new StartingPosition("B36", "Sicilian Defence: Accelerated Dragon", "r1bqkbnr/pp1ppp1p/2n3p1/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 0 5", "Sicilian_Defence,_Accelerated_Dragon", ["e4 c5", "Nf3 Nc6", "d4 cxd4", "Nxd4 g6"]),
        new StartingPosition("B22", "Sicilian Defence: Alapin Variation", "rnbqkbnr/pp1ppppp/8/2p5/4P3/2P5/PP1P1PPP/RNBQKBNR b KQkq - 0 2", "Sicilian_Defence,_Alapin_Variation", ["e4 c5", "c3"]),
        new StartingPosition("B23", "Sicilian Defence: Closed Variation", "rnbqkbnr/pp1ppppp/8/2p5/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 2", "Sicilian_Defence#Closed_Sicilian", ["e4 c5", "Nc3"]),
        new StartingPosition("B70", "Sicilian Defence: Dragon Variation", "rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6", "Sicilian_Defence,_Dragon_Variation", ["e4 c5", "Nf3 d6", "d4 cxd4", "Nxd4 Nf6", "Nc3 g6"]),
        new StartingPosition("B23", "Sicilian Defence: Grand Prix Attack", "nbqkbnr/pp1ppppp/8/2p5/4PP2/8/PPPP2PP/RNBQKBNR b KQkq - 0 2", "Sicilian_Defence#Grand_Prix_Attack", ["e4 c5", "f4"]),
        new StartingPosition("B27", "Sicilian Defence: Hyper-Accelerated Dragon", "rnbqkbnr/pp1ppp1p/6p1/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3", "Sicilian_Defence#2...g6:_Hungarian_Variation", ["e4 c5", "Nf3 g6"]),
        new StartingPosition("B41", "Sicilian Defence: Kan Variation", "rnbqkbnr/1p1p1ppp/p3p3/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 0 5", "Sicilian_Defence#Kan_.28Paulsen.29_Variation:_4...a6", ["e4 c5", "Nf3 e6", "d4 cxd4", "Nxd4 a6"]),
        new StartingPosition("B90", "Sicilian Defence: Najdorf Variation", "rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6", "Sicilian_Defence,_Najdorf_Variation", ["e4 c5", "Nf3 d6", "d4 cxd4", "Nxd4 Nf6", "Nc3 a6"]),
        new StartingPosition("B60", "Sicilian Defence: Richter-Rauzer Variation", "r1bqkb1r/pp2pppp/2np1n2/6B1/3NP3/2N5/PPP2PPP/R2QKB1R b KQkq - 4 6", "Sicilian_Defence#Classical_Variation:_5...Nc6", ["e4 c5", "Nf3 d6", "d4 cxd4", "Nxd4 Nf6", "Nc3 Nc6", "Bg5"]),
        new StartingPosition("B80", "Sicilian Defence: Scheveningen Variation", "rnbqkb1r/pp3ppp/3ppn2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6", "Sicilian_Defence,_Scheveningen_Variation", ["e4 c5", "Nf3 d6", "d4 cxd4", "Nxd4 Nf6", "Nc3 e6"]),
        new StartingPosition("B21", "Sicilian Defence: Smith-Morra Gambit", "rnbqkbnr/pp1ppppp/8/8/3pP3/2P5/PP3PPP/RNBQKBNR b KQkq - 0 3", "Sicilian_Defence,_Smith–Morra_Gambit", ["e4 c5", "d4 cxd4", "c3"]),
        new StartingPosition("C25", "Vienna Game", "rnbqkbnr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 2", "Vienna_Game", ["e4 e5", " Nc3"]),
        new StartingPosition("C27", "Vienna Game: Frankenstein-Dracula Variation", "rnbqkb1r/pppp1ppp/8/4p3/2B1n3/2N5/PPPP1PPP/R1BQK1NR w KQkq - 0 4", "Frankenstein-Dracula_Variation", ["e4 e5", "Nc3 Nf6", "Bc4 Nxe4"]),
        new StartingPosition("C46", "Four Knights Game: Halloween Gambit", "r1bqkb1r/pppp1ppp/2n2n2/4N3/4P3/2N5/PPPP1PPP/R1BQKB1R b KQkq - 0 4", "Halloween_Gambit", ["e4 e5", "Nf3 Nc6", "Nc3 Nf6", "Nxe5"]),
        new StartingPosition("C20", "King's Pawn Game: Wayward Queen Attack", "rnbqkbnr/pppp1ppp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2", "Danvers_Opening", ["e4 e5", "Qh5"]),
        new StartingPosition("C20", "Bongcloud Attack", "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPPKPPP/RNBQ1BNR b kq - 1 2", "Bong", ["e4 e5", "Ke2"]),
    ]),
    new Category("d4", [
        new StartingPosition("A40", "Queen's Pawn", "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1", "Queen's_Pawn_Game", ["d4"]),
        new StartingPosition("A57", "Benko Gambit", "rnbqkb1r/p2ppppp/5n2/1ppP4/2P5/8/PP2PPPP/RNBQKBNR w KQkq - 0 4", "Benko_Gambit", ["d4 Nf6", "c4 c5", "d5 b5"]),
        new StartingPosition("A61", "Benoni Defence: Modern Benoni", "rnbqkb1r/pp1p1ppp/4pn2/2pP4/2P5/8/PP2PPPP/RNBQKBNR w KQkq - 0 4", "Modern_Benoni", ["d4 Nf6", "c4 c5", "d5 e6"]),
        new StartingPosition("A43", "Benoni Defence: Czech Benoni", "rnbqkb1r/pp1p1ppp/5n2/2pPp3/2P5/8/PP2PPPP/RNBQKBNR w KQkq e6 0 4", "Benoni_Defense#Czech_Benoni:_1.d4_Nf6_2.c4_c5_3.d5_e5", ["d4 Nf6", "c4 c5", "d5 e5"]),
        new StartingPosition("D00", "Blackmar Gambit", "rnbqkbnr/ppp1pppp/8/3p4/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2", "Blackmar–Diemer_Gambit", ["d4 d5", "e4"]),
        new StartingPosition("E11", "Bogo-Indian Defence", "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/5N2/PP2PPPP/RNBQKB1R w KQkq - 2 4", "Bogo-Indian_Defence", ["d4 Nf6", "c4 e6", "Nf3 Bb4+"]),
        new StartingPosition("E00", "Catalan Opening", "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/6P1/PP2PP1P/RNBQKBNR b KQkq - 0 3", "Catalan_Opening", ["d4 Nf6", "c4 e6", "g3"]),
        new StartingPosition("E06", "Catalan Opening: Closed Variation", "rnbqk2r/ppp1bppp/4pn2/3p4/2PP4/5NP1/PP2PPBP/RNBQK2R b KQkq - 3 5", "Catalan_Opening", ["d4 Nf6", "c4 e6", "g3 d5", "Nf3 Be7", "Bg2"]),
        new StartingPosition("A80", "Dutch Defence", "rnbqkbnr/ppppp1pp/8/5p2/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2", "Dutch_Defence", ["d4 f5"]),
        new StartingPosition("A96", "Dutch Defence: Classical Variation", "rnbq1rk1/ppp1b1pp/3ppn2/5p2/2PP4/5NP1/PP2PPBP/RNBQ1RK1 w - - 0 7", "Dutch_Defence", ["d4 f5", "c4 Nf6", "g3 e6", "Bg2 Be7", "Nf3 O-O", "O-O d6"]),
        new StartingPosition("A87", "Dutch Defence: Leningrad Variation", "rnbqk2r/ppppp1bp/5np1/5p2/2PP4/5NP1/PP2PPBP/RNBQK2R b KQkq - 3 5", "Dutch_Defence", ["d4 f5", "c4 Nf6", "g3 g6", "Bg2 Bg7", "Nf3"]),
        new StartingPosition("A83", "Dutch Defence: Staunton Gambit", "rnbqkb1r/ppppp1pp/5n2/6B1/3Pp3/2N5/PPP2PPP/R2QKBNR b KQkq - 3 4", "Dutch_Defence", ["d4 f5", "e4 fxe4", "Nc3 Nf6", "Bg5"]),
        new StartingPosition("A92", "Dutch Defence: Stonewall Variation", "rnbq1rk1/ppp1b1pp/4pn2/3p1p2/2PP4/5NP1/PP2PPBP/RNBQ1RK1 w - - 0 7", "Dutch_Defence", ["d4 f5", "c4 Nf6", "g3 e6", "Bg2 Be7", "Nf3 O-O", "O-O d5"]),
        new StartingPosition("D80", "Grünfeld Defence", "rnbqkb1r/ppp1pp1p/5np1/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 0 4", "Grünfeld_Defence", ["d4 Nf6", "c4 g6", "Nc3 d5"]),
        new StartingPosition("D82", "Grünfeld Defence: Brinckmann Attack", "rnbqkb1r/ppp1pp1p/5np1/3p4/2PP1B2/2N5/PP2PPPP/R2QKBNR b KQkq - 1 4", "Grünfeld_Defence#Lines_with_4.Bf4_and_the_Gr.C3.BCnfeld_Gambit", ["d4 Nf6", "c4 g6", "Nc3 d5", "Bf4"]),
        new StartingPosition("D85", "Grünfeld Defence: Exchange Variation", "rnbqkb1r/ppp1pp1p/6p1/3n4/3P4/2N5/PP2PPPP/R1BQKBNR w KQkq - 0 5", "Grünfeld_Defence#Exchange_Variation:_4.cxd5_Nxd5_5.e4", ["d4 Nf6", "c4 g6", "Nc3 d5", "cxd5 Nxd5"]),
        new StartingPosition("D80", "Grünfeld Defence: Russian Variation", "rnbqkb1r/ppp1pp1p/5np1/3p4/2PP4/1QN5/PP2PPPP/R1B1KBNR b KQkq - 1 4", "Grünfeld_Defence#Russian_System:_4.Nf3_Bg7_5.Qb3", ["d4 Nf6", "c4 g6", "Nc3 d5", "Qb3"]),
        new StartingPosition("D90", "Grünfeld Defence: Taimanov Variation", "rnbqk2r/ppp1ppbp/5np1/3p2B1/2PP4/2N2N2/PP2PPPP/R2QKB1R b KQkq - 3 5", "Grünfeld_Defence#Taimanov.27s_Variation_with_4.Nf3_Bg7_5.Bg5", ["d4 Nf6", "c4 g6", "Nc3 d5", "Nf3 Bg7", "Bg5"]),
        new StartingPosition("E61", "King's Indian Defence", "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3", "King's_Indian_Defence", ["d4 Nf6", "c4 g6"]),
        new StartingPosition("E77", "King's Indian Defence: 4.e4", "rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N5/PP3PPP/R1BQKBNR w KQkq - 0 5", "King's_Indian_Defence", ["d4 Nf6", "c4 g6", "Nc3 Bg7", "e4 d6"]),
        new StartingPosition("E73", "King's Indian Defence: Averbakh Variation", "rnbq1rk1/ppp1ppbp/3p1np1/6B1/2PPP3/2N5/PP2BPPP/R2QK1NR b KQ - 3 6", "King's_Indian_Defence#Averbakh_Variation:_5.Be2_0-0_6.Bg5", ["d4 Nf6", "c4 g6", "Nc3 Bg7", "e4 d6", "Be2 O-O", "Bg5"]),
        new StartingPosition("E62", "King's Indian Defence: Fianchetto Variation", "rnbqk2r/ppp1ppbp/3p1np1/8/2PP4/2N2NP1/PP2PP1P/R1BQKB1R b KQkq - 0 5", "King's_Indian_Defence#Fianchetto_Variation:_3.Nf3_Bg7_4.g3", ["d4 Nf6", "c4 g6", "Nc3 Bg7", "Nf3 d6", "g3"]),
        new StartingPosition("E76", "King's Indian Defence: Four Pawns Attack", "rnbqk2r/ppp1ppbp/3p1np1/8/2PPPP2/2N5/PP4PP/R1BQKBNR b KQkq - 0 5", "King%27s_Indian_Defence,_Four_Pawns_Attack", ["d4 Nf6", "c4 g6", "Nc3 Bg7", "e4 d6", "f4"]),
        new StartingPosition("E91", "King's Indian Defence: Classical Variation", "rnbq1rk1/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP2BPPP/R1BQK2R b KQ - 3 6", "King's_Indian_Defence#Classical_Variation:_5.Nf3_0-0_6.Be2_e5", ["d4 Nf6", "c4 g6", "Nc3 Bg7", "e4 d6", "Nf3 O-O", "Be2"]),
        new StartingPosition("E80", "King's Indian Defence: Sämisch Variation", "rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N2P2/PP4PP/R1BQKBNR b KQkq - 0 5", "King's_Indian_Defence#S.C3.A4misch_Variation:_5.f3", ["d4 Nf6", "c4 g6", "Nc3 Bg7", "e4 d6", "f3"]),
        new StartingPosition("A41", "Queens's Pawn Game: Modern Defence", "rnbqk1nr/ppp1ppbp/3p2p1/8/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4", "Queen's_Pawn_Game#1...g6", ["d4 g6", "c4 d6", "Nc3 Bg7"]),
        new StartingPosition("E20", "Nimzo-Indian Defence", "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4", "Nimzo-Indian_Defence", ["d4 Nf6", "c4 e6", "Nc3 Bb4"]),
        new StartingPosition("E32", "Nimzo-Indian Defence: Classical Variation", "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PPQ1PPPP/R1B1KBNR b KQkq - 3 4", "Nimzo-Indian_Defence#Classical_Variation:_4.Qc2", ["d4 Nf6", "c4 e6", "Nc3 Bb4", "Qc2"]),
        new StartingPosition("E43", "Nimzo-Indian Defence: Fischer Variation", "rnbqk2r/p1pp1ppp/1p2pn2/8/1bPP4/2N1P3/PP3PPP/R1BQKBNR w KQkq - 0 5", "Nimzo-Indian_Defence#4...b6", ["d4 Nf6", "c4 e6", "Nc3 Bb4", "e3 b6"]),
        new StartingPosition("E41", "Nimzo-Indian Defence: Hübner Variation", "r1bqk2r/pp3ppp/2nppn2/2p5/2PP4/2PBPN2/P4PPP/R1BQK2R w KQkq - 0 8", "Nimzo-Indian_Defence#4...c5", ["d4 Nf6", "c4 e6", "Nc3 Bb4", "e3 c5", "Bd3 Nc6", "Nf3 Bxc3+", "bxc3 d6"]),
        new StartingPosition("E21", "Nimzo-Indian Defence: Kasparov Variation", "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N2N2/PP2PPPP/R1BQKB1R b KQkq - 3 4", "Nimzo-Indian_Defence#Kasparov_Variation:_4.Nf3", ["d4 Nf6", "c4 e6", "Nc3 Bb4", "Nf3"]),
        new StartingPosition("E30", "Nimzo-Indian Defence: Leningrad Variation", "rnbqk2r/pppp1ppp/4pn2/6B1/1bPP4/2N5/PP2PPPP/R2QKBNR b KQkq - 3 4", "Nimzo-Indian_Defence#Other_variations", ["d4 Nf6", "c4 e6", "Nc3 Bb4", "Bg5"]),
        new StartingPosition("E26", "Nimzo-Indian Defence: Sämisch Variation", "rnbqk2r/pppp1ppp/4pn2/8/2PP4/P1P5/4PPPP/R1BQKBNR b KQkq - 0 5", "Nimzo-Indian_Defence#Other_variations", ["d4 Nf6", "c4 e6", "Nc3 Bb4", "a3 Bxc3+", "bxc3"]),
        new StartingPosition("A53", "Old Indian Defence", "rnbqkb1r/ppp1pppp/3p1n2/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3", "Old_Indian_Defense", ["d4 Nf6", "c4 d6"]),
        new StartingPosition("D06", "Queen's Gambit", "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2", "Queen's_Gambit", ["d4 d5", "c4"]),
        new StartingPosition("D20", "Queen's Gambit Accepted", "rnbqkbnr/ppp1pppp/8/8/2pP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3", "Queen%27s_Gambit_Accepted", ["d4 d5", "c4 dxc4"]),
        new StartingPosition("D43", "Queen's Gambit Declined: Semi-Slav Defence", "rnbqkb1r/pp3ppp/2p1pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 5", "Semi-Slav_Defense", ["d4 d5", "c4 e6", "Nc3 Nf6", "Nf3 c6"]),
        new StartingPosition("D10", "Queen's Gambit Declined: Slav Defence", "rnbqkbnr/pp2pppp/2p5/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3", "Slav_Defense", ["d4 d5", "c4 c6"]),
        new StartingPosition("D40", "Queen's Gambit Declined: Semi-Tarrasch Defence", "rnbqkb1r/pp3ppp/4pn2/2pp4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 5", "Tarrasch_Defense#Semi-Tarrasch_Defense", ["d4 d5", "c4 e6", "Nc3 Nf6", "Nf3 c5"]),
        new StartingPosition("D32", "Queen's Gambit Declined: Tarrasch Defence", "rnbqkbnr/pp3ppp/4p3/2pp4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 0 4", "Tarrasch_Defense", ["d4 d5", "c4 e6", "Nc3 c5"]),
        new StartingPosition("D08", "Queen's Gambit: Albin Countergambit", "rnbqkbnr/ppp2ppp/8/3pp3/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3", "Albin_Countergambit", ["d4 d5", "c4 e5"]),
        new StartingPosition("D07", "Queen's Gambit: Chigorin Defence", "r1bqkbnr/ppp1pppp/2n5/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 1 3", "Chigorin_Defense", ["d4 d5", "c4 Nc6"]),
        new StartingPosition("E12", "Queen's Indian Defence", "rnbqkb1r/p1pp1ppp/1p2pn2/8/2PP4/5N2/PP2PPPP/RNBQKB1R w KQkq - 0 4", "Queen's_Indian_Defense", ["d4 Nf6", "c4 e6", "Nf3 b6"]),
        new StartingPosition("D02", "London System", "rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/5N2/PPP1PPPP/RN1QKB1R b KQkq - 3 3", "London_System", ["d4 d5", "Nf3 Nf6", "Bf4"]),
        new StartingPosition("D00", "London System: Mason Attack", "rnbqkbnr/ppp1pppp/8/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR b KQkq - 1 2", "London_System", ["d4 d5", "Bf4"]),
        new StartingPosition("D01", "Rapport-Jobava System", "rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/2N5/PPP1PPPP/R2QKBNR b KQkq - 3 3", "London_System", ["d4 d5", "Nc3 Nf6", "Bf4"]),
        new StartingPosition("D03", "Torre Attack", "rnbqkb1r/ppp1pppp/5n2/3p2B1/3P4/5N2/PPP1PPPP/RN1QKB1R b KQkq - 3 3", "Torre_Attack", ["d4 d5", "Nf3 Nf6", "Bg5"]),
        new StartingPosition("D01", "Richter-Veresov Attack", "rnbqkb1r/ppp1pppp/5n2/3p2B1/3P4/2N5/PPP1PPPP/R2QKBNR b KQkq - 3 3", "Richter-Veresov_Attack", ["d4 d5", "Nc3 Nf6", "Bg5"]),
        new StartingPosition("A52", "Budapest Defence", "rnbqkb1r/pppp1ppp/5n2/4p3/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3", "Budapest_Gambit", ["d4 Nf6", "c4 e5"]),
        new StartingPosition("D00", "Closed Game", "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2", "Closed_Game", ["d4 d5"]),
        new StartingPosition("A45", "Trompowsky Attack", "rnbqkb1r/pppppppp/5n2/6B1/3P4/8/PPP1PPPP/RN1QKBNR b KQkq - 2 2", "Trompowsky_Attack", ["d4 Nf6", "Bg5"]),
    ]),
    new Category("Nf3", [
        new StartingPosition("A04", "Zukertort Opening", "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1", "Zukertort_Opening", ["Nf3"]),
        new StartingPosition("A07", "King's Indian Attack", "rnbqkbnr/ppp1pppp/8/3p4/8/5NP1/PPPPPP1P/RNBQKB1R b KQkq - 0 2", "King's_Indian_Attack", ["Nf3 d5", "g3"]),
        new StartingPosition("A09", "Réti Opening", "rnbqkbnr/ppp1pppp/8/3p4/2P5/5N2/PP1PPPPP/RNBQKB1R b KQkq - 0 2", "Réti_Opening", ["Nf3 d5", "c4"]),
    ]),
    new Category("c4", [
        new StartingPosition("A10", "English Opening", "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq - 0 1", "English_Opening", ["c4"]),
        new StartingPosition("A20", "English Opening: Reversed Sicilian", "rnbqkbnr/pppp1ppp/8/4p3/2P5/8/PP1PPPPP/RNBQKBNR w KQkq - 0 2", "English_Opening", ["c4 e5"]),
        new StartingPosition("A30", "English Opening: Symmetrical Variation", "rnbqkbnr/pp1ppppp/8/2p5/2P5/8/PP1PPPPP/RNBQKBNR w KQkq - 0 2", "English_Opening", ["c4 c5"]),
        new StartingPosition("A26", "English Opening: Closed System", "r1bqk1nr/ppp2pbp/2np2p1/4p3/2P5/2NP2P1/PP2PPBP/R1BQK1NR w KQkq - 0 6", "English_Opening", ["c4 e5", "Nc3 Nc6", "g3 g6", "Bg2 Bg7", "d3 d6"]),
    ]),
    new Category("b3", [
        new StartingPosition("A01", "Nimzo-Larsen Attack", "rnbqkbnr/pppppppp/8/8/8/1P6/P1PPPPPP/RNBQKBNR b KQkq - 0 1", "Larsen's_Opening", ["b3"]),
    ]),
    new Category("b4", [
        new StartingPosition("A00", "Sokolsky Opening", "rnbqkbnr/pppppppp/8/8/1P6/8/P1PPPPPP/RNBQKBNR b KQkq - 0 1", "Sokolsky_Opening", ["b4"]),
    ]),
    new Category("f4", [
        new StartingPosition("A02", "Bird's Opening", "rnbqkbnr/pppppppp/8/8/5P2/8/PPPPP1PP/RNBQKBNR b KQkq - 0 1", "Bird's_Opening", ["f4"]),
        new StartingPosition("A02", "Bird's Opening: Dutch Variation", "rnbqkbnr/ppp1pppp/8/3p4/5P2/8/PPPPP1PP/RNBQKBNR w KQkq - 0 2", "Bird's_Opening", ["f4 d5"]),
    ]),
    new Category("g3", [
        new StartingPosition("A00", "Hungarian Opening", "rnbqkbnr/pppppppp/8/8/8/6P1/PPPPPP1P/RNBQKBNR b KQkq - 0 1", "King's_Fianchetto_Opening", ["g3"]),
    ]),
];

class ChesserMenu {
    constructor(parentEl, chesser) {
        this.chesser = chesser;
        this.containerEl = parentEl.createDiv("chess-menu-container", (containerEl) => {
            containerEl.createDiv({ cls: "chess-menu-section" }, (sectionEl) => {
                const selectEl = sectionEl.createEl("select", {
                    cls: "dropdown chess-starting-position-dropdown",
                }, (el) => {
                    el.createEl("option", {
                        value: "starting-position",
                        text: "Starting Position",
                    });
                    el.createEl("option", {
                        value: "custom",
                        text: "Custom",
                    });
                    el.createEl("optgroup", {}, (optgroup) => {
                        optgroup.label = "Popular Openings";
                        categories.forEach((category) => {
                            category.items.forEach((item) => {
                                optgroup.createEl("option", {
                                    value: item.eco,
                                    text: item.name,
                                });
                            });
                        });
                    });
                    const startingPosition = this.getStartingPositionFromFen(chesser.getFen());
                    const startingPositionName = startingPosition
                        ? startingPosition.eco
                        : "custom";
                    el.value = startingPositionName;
                });
                selectEl.addEventListener("change", (ev) => {
                    const value = ev.target.value;
                    if (value === "starting-position") {
                        this.chesser.loadFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", []);
                        return;
                    }
                    const startingPosition = categories
                        .flatMap((cat) => cat.items)
                        .find((item) => item.eco === value);
                    this.chesser.loadFen(startingPosition.fen, startingPosition.moves);
                });
                // new Setting(sectionEl).setName("Enable Free Move?").addToggle((toggle) => {
                //   toggle.setValue(this.chesser.getBoardState().movable.free);
                //   toggle.onChange((value) => {
                //     this.chesser.setFreeMove(value);
                //   });
                // });
            });
        });
        this.movesListEl = this.containerEl.createDiv({
            cls: "chess-menu-section chess-menu-section-tall",
        });
        this.redrawMoveList();
        this.createToolbar();
    }
    getStartingPositionFromFen(fen) {
        return categories.flatMap((cat) => cat.items).find((item) => item.eco === fen);
    }
    createToolbar() {
        const btnContainer = this.containerEl.createDiv("chess-toolbar-container");
        btnContainer.createEl("a", "view-action", (btn) => {
            btn.ariaLabel = "Flip board";
            obsidian.setIcon(btn, "switch");
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                this.chesser.flipBoard();
            });
        });
        btnContainer.createEl("a", "view-action", (btn) => {
            btn.ariaLabel = "Reset";
            obsidian.setIcon(btn, "restore-file-glyph");
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                while (this.chesser.currentMoveIdx >= 0) {
                    this.chesser.undo_move();
                }
            });
        });
        btnContainer.createEl("a", "view-action", (btn) => {
            btn.ariaLabel = "Undo";
            obsidian.setIcon(btn, "left-arrow");
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                this.chesser.undo_move();
            });
        });
        btnContainer.createEl("a", "view-action", (btn) => {
            btn.ariaLabel = "Redo";
            obsidian.setIcon(btn, "right-arrow");
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                this.chesser.redo_move();
            });
        });
        btnContainer.createEl("a", "view-action", (btn) => {
            btn.ariaLabel = "Copy FEN";
            obsidian.setIcon(btn, "two-blank-pages");
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                navigator.clipboard.writeText(this.chesser.getFen());
            });
        });
    }
    redrawMoveList() {
        this.movesListEl.empty();
        this.movesListEl.createDiv({
            text: this.chesser.turn() === "b" ? "Black's turn" : "White's turn",
            cls: "chess-turn-text",
        });
        this.movesListEl.createDiv("chess-move-list", (moveListEl) => {
            this.chesser.history().forEach((move, idx) => {
                const moveEl = moveListEl.createDiv({
                    cls: `chess-move ${this.chesser.currentMoveIdx === idx ? "chess-move-active" : ""}`,
                    text: move.san,
                });
                moveEl.addEventListener("click", (ev) => {
                    ev.preventDefault();
                    this.chesser.update_turn_idx(idx);
                });
            });
        });
    }
}

function debug(debugFn) {
    if (process.env.DEBUG) {
        debugFn();
    }
}

function draw_chessboard(app, settings) {
    return (source, el, ctx) => {
        let user_config = parse_user_config(settings, source);
        ctx.addChild(new Chesser(el, ctx, user_config, app));
    };
}
function read_state(id, pth) {
    //const savedDataStr = localStorage.getItem(`chesser-${id}`);
    const filePath = `${pth}\\.obsidian\\plugins\\chesser-obsidian\\games\\chesser-${id}.json`;
    var gameDir = pth + `\\.obsidian\\plugins\\chesser-obsidian\\games`;
    try {
        const savedDataStr = fs__namespace.readFileSync(filePath, 'utf-8');
        return JSON.parse(savedDataStr);
    }
    catch (err) {
        try {
            if (!fs__namespace.existsSync(gameDir)) {
                fs__namespace.mkdirSync(gameDir, { recursive: true });
            }
            fs__namespace.writeFileSync(filePath, JSON.stringify({ "currentMoveIdx": -1, "moves": [], "pgn": "", "currentOrientation": "white" }));
        }
        catch (err2) {
            console.error('Error reading file', err2);
            return {}; // Return an empty object or handle error as needed
        }
    }
}
function write_state(id, pth, game_state) {
    //   localStorage.setItem(`chesser-${id}`, JSON.stringify(game_state));
    var fs = require('fs');
    var filePath = pth + `\\.obsidian\\plugins\\chesser-obsidian\\games\\chesser-${id}.json`;
    var gameDir = pth + `\\.obsidian\\plugins\\chesser-obsidian\\games`;
    try {
        if (!fs.existsSync(gameDir)) {
            fs.mkdirSync(gameDir, { recursive: true });
        }
        fs.writeFileSync(filePath, JSON.stringify(game_state));
        //console.log(`Data written to file successfully to ${filePath}`);
    }
    catch (err) {
        console.log('Error writing file');
        console.error(err);
    }
}
class Chesser extends obsidian.MarkdownRenderChild {
    constructor(containerEl, ctx, user_config, app) {
        var _a, _b, _c;
        super(containerEl);
        this.app = app;
        this.ctx = ctx;
        this.id = (_a = user_config.id) !== null && _a !== void 0 ? _a : nanoid(8);
        this.chess = new chess.Chess();
        let basePath = this.app.vault.adapter.basePath;
        this.basePath = basePath;
        //console.log(this.basePath);
        const saved_config = read_state(this.id, this.basePath);
        const config = Object.assign({}, user_config, saved_config);
        this.sync_board_with_gamestate = this.sync_board_with_gamestate.bind(this);
        this.save_move = this.save_move.bind(this);
        this.save_shapes = this.save_shapes.bind(this);
        // Save `id` into the codeblock yaml
        if (user_config.id === undefined) {
            this.app.workspace.onLayoutReady(() => {
                window.setImmediate(() => {
                    this.write_config({ id: this.id });
                });
            });
        }
        if (config.pgn) {
            debug(() => console.debug("loading from pgn", config.pgn));
            this.chess.load_pgn(config.pgn);
        }
        else if (config.fen) {
            debug(() => console.debug("loading from fen", config.fen));
            this.chess.load(config.fen);
        }
        this.moves = (_b = config.moves) !== null && _b !== void 0 ? _b : this.chess.history({ verbose: true });
        this.currentMoveIdx = (_c = config.currentMoveIdx) !== null && _c !== void 0 ? _c : this.moves.length - 1;
        let lastMove = undefined;
        if (this.currentMoveIdx >= 0) {
            const move = this.moves[this.currentMoveIdx];
            lastMove = [move.from, move.to];
        }
        // Setup UI
        this.set_style(containerEl, config.pieceStyle, config.boardStyle);
        try {
            if (config.currentOrientation == "") {
                config.currentOrientation = "white";
            }
            this.cg = Chessground(containerEl.createDiv(), {
                fen: this.chess.fen(),
                addDimensionsCssVars: true,
                lastMove,
                orientation: config.currentOrientation,
                viewOnly: config.viewOnly,
                drawable: {
                    enabled: config.drawable,
                    onChange: this.save_shapes,
                },
            });
        }
        catch (e) {
            new obsidian.Notice("Chesser error: Invalid config");
            console.error(e);
            return;
        }
        // Activates the chess logic
        this.setFreeMove(config.free);
        // Draw saved shapes
        if (config.shapes) {
            this.app.workspace.onLayoutReady(() => {
                window.setTimeout(() => {
                    this.sync_board_with_gamestate(false);
                    this.cg.setShapes(config.shapes);
                }, 100);
            });
        }
        if (config.viewMenu) {
            this.menu = new ChesserMenu(containerEl, this);
        }
    }
    set_style(el, pieceStyle, boardStyle) {
        el.addClasses([pieceStyle, `${boardStyle}-board`, "chesser-container"]);
    }
    get_section_range() {
        const sectionInfo = this.ctx.getSectionInfo(this.containerEl);
        return [
            {
                line: sectionInfo.lineStart + 1,
                ch: 0,
            },
            {
                line: sectionInfo.lineEnd,
                ch: 0,
            },
        ];
    }
    get_config(view) {
        const [from, to] = this.get_section_range();
        const codeblockText = view.editor.getRange(from, to);
        try {
            return obsidian.parseYaml(codeblockText);
        }
        catch (e) {
            debug(() => console.debug("failed to parse codeblock's yaml config", codeblockText));
            // failed to parse. show error...
        }
        return undefined;
    }
    write_config(config) {
        debug(() => console.debug("writing config to localStorage", config));
        const view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (!view) {
            new obsidian.Notice("Chesser: Failed to retrieve active view");
            console.error("Chesser: Failed to retrieve view when writing config");
        }
        try {
            const updated = obsidian.stringifyYaml(Object.assign(Object.assign({}, this.get_config(view)), config));
            const [from, to] = this.get_section_range();
            view.editor.replaceRange(updated, from, to);
        }
        catch (e) {
            // failed to parse. show error...
            console.error("failed to write config", e);
        }
    }
    save_move() {
        const config = read_state(this.id, this.basePath);
        write_state(this.id, this.basePath, Object.assign(Object.assign({}, config), { currentMoveIdx: this.currentMoveIdx, moves: this.moves, pgn: this.chess.pgn() }));
    }
    save_shapes(shapes) {
        const config = read_state(this.id, this.basePath);
        write_state(this.id, this.basePath, Object.assign(Object.assign({}, config), { shapes }));
    }
    update_orientation() {
        let data = "";
        const config = read_state(this.id, this.basePath);
        if (config.currentOrientation == "white") {
            data = "black";
        }
        else if (config.currentOrientation == "black") {
            data = "white";
        }
        else {
            console.log("No se pudo leer la orientacion: " + JSON.stringify(config));
            return;
        }
        //console.log("Orientación: "+data)
        write_state(this.id, this.basePath, Object.assign(Object.assign({}, config), { currentOrientation: data }));
    }
    sync_board_with_gamestate(shouldSave = true) {
        var _a;
        this.cg.set({
            check: this.check(),
            turnColor: this.color_turn(),
            movable: {
                free: false,
                color: this.color_turn(),
                dests: this.dests(),
            },
        });
        (_a = this.menu) === null || _a === void 0 ? void 0 : _a.redrawMoveList();
        if (shouldSave) {
            this.save_move();
        }
    }
    color_turn() {
        return this.chess.turn() === "w" ? "white" : "black";
    }
    dests() {
        const dests = new Map();
        this.chess.SQUARES.forEach((s) => {
            const ms = this.chess.moves({ square: s, verbose: true });
            if (ms.length)
                dests.set(s, ms.map((m) => m.to));
        });
        return dests;
    }
    check() {
        return this.chess.in_check();
    }
    undo_move() {
        this.update_turn_idx(this.currentMoveIdx - 1);
    }
    redo_move() {
        this.update_turn_idx(this.currentMoveIdx + 1);
    }
    update_turn_idx(moveIdx) {
        if (moveIdx < -1 || moveIdx >= this.moves.length) {
            return;
        }
        const isUndoing = moveIdx < this.currentMoveIdx;
        if (isUndoing) {
            while (this.currentMoveIdx > moveIdx) {
                this.currentMoveIdx--;
                this.chess.undo();
            }
        }
        else {
            while (this.currentMoveIdx < moveIdx) {
                this.currentMoveIdx++;
                const move = this.moves[this.currentMoveIdx];
                this.chess.move(move);
            }
        }
        let lastMove = undefined;
        if (this.currentMoveIdx >= 0) {
            const move = this.moves[this.currentMoveIdx];
            lastMove = [move.from, move.to];
        }
        this.cg.set({
            fen: this.chess.fen(),
            lastMove,
        });
        this.sync_board_with_gamestate();
    }
    setFreeMove(enabled) {
        if (enabled) {
            this.cg.set({
                events: {
                    move: this.save_move,
                },
                movable: {
                    free: true,
                    color: "both",
                    dests: undefined,
                },
            });
        }
        else {
            this.cg.set({
                events: {
                    move: (orig, dest) => {
                        const move = this.chess.move({ from: orig, to: dest });
                        this.currentMoveIdx++;
                        this.moves = [...this.moves.slice(0, this.currentMoveIdx), move];
                        this.sync_board_with_gamestate();
                    },
                },
            });
            this.sync_board_with_gamestate();
        }
    }
    turn() {
        return this.chess.turn();
    }
    history() {
        return this.moves;
    }
    flipBoard() {
        this.update_orientation();
        return this.cg.toggleOrientation();
    }
    getBoardState() {
        return this.cg.state;
    }
    getFen() {
        return this.chess.fen();
    }
    loadFen(fen, moves) {
        let lastMove = undefined;
        if (moves) {
            this.currentMoveIdx = -1;
            this.moves = [];
            this.chess.reset();
            moves.forEach((fullMove) => {
                fullMove.split(" ").forEach((halfMove) => {
                    const move = this.chess.move(halfMove);
                    this.moves.push(move);
                    this.currentMoveIdx++;
                });
            });
            if (this.currentMoveIdx >= 0) {
                const move = this.moves[this.currentMoveIdx];
                lastMove = [move.from, move.to];
            }
        }
        else {
            this.chess.load(fen);
        }
        this.cg.set({ fen: this.chess.fen(), lastMove });
        this.sync_board_with_gamestate();
    }
}

const DEFAULT_SETTINGS = {
    orientation: "white",
    viewOnly: false,
    drawable: true,
    free: false,
    pieceStyle: "cburnett",
    boardStyle: "brown",
    viewMenu: true,
};
class ChesserSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        let { containerEl } = this;
        containerEl.empty();
        containerEl.createEl("h2", { text: "Obsidian Chess Settings" });
        new obsidian.Setting(containerEl)
            .setName("Piece Style")
            .setDesc("Sets the piece style.")
            .addDropdown((dropdown) => {
            let styles = {};
            PIECE_STYLES.map((style) => (styles[style] = style));
            dropdown.addOptions(styles);
            dropdown.setValue(this.plugin.settings.pieceStyle).onChange((pieceStyle) => {
                this.plugin.settings.pieceStyle = pieceStyle;
                this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Board Style")
            .setDesc("Sets the board style.")
            .addDropdown((dropdown) => {
            let styles = {};
            BOARD_STYLES.map((style) => (styles[style] = style));
            dropdown.addOptions(styles);
            dropdown.setValue(this.plugin.settings.boardStyle).onChange((boardStyle) => {
                this.plugin.settings.boardStyle = boardStyle;
                this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Orientation")
            .setDesc("Sets the default board orientation.")
            .addDropdown((dropdown) => {
            dropdown.addOption("white", "White");
            dropdown.addOption("black", "Black");
            dropdown.setValue(this.plugin.settings.orientation).onChange((orientation) => {
                this.plugin.settings.orientation = orientation;
                this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Drawable")
            .setDesc("Controls the ability to draw annotations (arrows, circles) on the board.")
            .addToggle((toggle) => {
            toggle.setValue(this.plugin.settings.drawable).onChange((drawable) => {
                this.plugin.settings.drawable = drawable;
                this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("View-only")
            .setDesc("If enabled, displays a static chess board (no moves, annotations, ...).")
            .addToggle((toggle) => {
            toggle.setValue(this.plugin.settings.viewOnly).onChange((viewOnly) => {
                this.plugin.settings.viewOnly = viewOnly;
                this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Free")
            .setDesc("If enabled, disables the chess logic, all moves are valid.")
            .addToggle((toggle) => {
            toggle.setValue(this.plugin.settings.free).onChange((free) => {
                this.plugin.settings.free = free;
                this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("View Menu")
            .setDesc("If enabled, displays a menu on the left side of the board.")
            .addToggle((toggle) => {
            toggle.setValue(this.plugin.settings.viewMenu).onChange((viewMenu) => {
                this.plugin.settings.viewMenu = viewMenu;
                this.plugin.saveSettings();
            });
        });
    }
}

class ChesserPlugin extends obsidian.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSettings();
            this.addSettingTab(new ChesserSettingTab(this.app, this));
            this.registerMarkdownCodeBlockProcessor("chesser", // keep for backwards compatibility/branding
            draw_chessboard(this.app, this.settings));
            this.registerMarkdownCodeBlockProcessor("chess", draw_chessboard(this.app, this.settings));
        });
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
}

module.exports = ChesserPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIm5vZGVfbW9kdWxlcy9uYW5vaWQvaW5kZXgucHJvZC5qcyIsIm5vZGVfbW9kdWxlcy9jaGVzcy5qcy9jaGVzcy5qcyIsIm5vZGVfbW9kdWxlcy9jaGVzc2dyb3VuZC90eXBlcy5qcyIsIm5vZGVfbW9kdWxlcy9jaGVzc2dyb3VuZC91dGlsLmpzIiwibm9kZV9tb2R1bGVzL2NoZXNzZ3JvdW5kL3ByZW1vdmUuanMiLCJub2RlX21vZHVsZXMvY2hlc3Nncm91bmQvYm9hcmQuanMiLCJub2RlX21vZHVsZXMvY2hlc3Nncm91bmQvZmVuLmpzIiwibm9kZV9tb2R1bGVzL2NoZXNzZ3JvdW5kL2NvbmZpZy5qcyIsIm5vZGVfbW9kdWxlcy9jaGVzc2dyb3VuZC9hbmltLmpzIiwibm9kZV9tb2R1bGVzL2NoZXNzZ3JvdW5kL2RyYXcuanMiLCJub2RlX21vZHVsZXMvY2hlc3Nncm91bmQvZHJhZy5qcyIsIm5vZGVfbW9kdWxlcy9jaGVzc2dyb3VuZC9leHBsb3Npb24uanMiLCJub2RlX21vZHVsZXMvY2hlc3Nncm91bmQvYXBpLmpzIiwibm9kZV9tb2R1bGVzL2NoZXNzZ3JvdW5kL3N0YXRlLmpzIiwibm9kZV9tb2R1bGVzL2NoZXNzZ3JvdW5kL3N5bmMuanMiLCJub2RlX21vZHVsZXMvY2hlc3Nncm91bmQvc3ZnLmpzIiwibm9kZV9tb2R1bGVzL2NoZXNzZ3JvdW5kL3dyYXAuanMiLCJub2RlX21vZHVsZXMvY2hlc3Nncm91bmQvZHJvcC5qcyIsIm5vZGVfbW9kdWxlcy9jaGVzc2dyb3VuZC9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvY2hlc3Nncm91bmQvcmVuZGVyLmpzIiwibm9kZV9tb2R1bGVzL2NoZXNzZ3JvdW5kL2F1dG9QaWVjZXMuanMiLCJub2RlX21vZHVsZXMvY2hlc3Nncm91bmQvY2hlc3Nncm91bmQuanMiLCJzcmMvQ2hlc3NlckNvbmZpZy50cyIsInNyYy9zdGFydGluZ1Bvc2l0aW9ucy50cyIsInNyYy9tZW51LnRzIiwic3JjL2RlYnVnLnRzIiwic3JjL0NoZXNzZXIudHMiLCJzcmMvQ2hlc3NlclNldHRpbmdzLnRzIiwic3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19jcmVhdGVCaW5kaW5nID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBvKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIHApKSBfX2NyZWF0ZUJpbmRpbmcobywgbSwgcCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XHJcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcclxuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcclxuICAgICAgICAgICAgcltrXSA9IGFbal07XHJcbiAgICByZXR1cm4gcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXkodG8sIGZyb20sIHBhY2spIHtcclxuICAgIGlmIChwYWNrIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIGZvciAodmFyIGkgPSAwLCBsID0gZnJvbS5sZW5ndGgsIGFyOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGFyIHx8ICEoaSBpbiBmcm9tKSkge1xyXG4gICAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xyXG4gICAgICAgICAgICBhcltpXSA9IGZyb21baV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRvLmNvbmNhdChhciB8fCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tKSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcclxufSkgOiBmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcclxuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRHZXQocmVjZWl2ZXIsIHN0YXRlLCBraW5kLCBmKSB7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBnZXR0ZXJcIik7XHJcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCByZWFkIHByaXZhdGUgbWVtYmVyIGZyb20gYW4gb2JqZWN0IHdob3NlIGNsYXNzIGRpZCBub3QgZGVjbGFyZSBpdFwiKTtcclxuICAgIHJldHVybiBraW5kID09PSBcIm1cIiA/IGYgOiBraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlcikgOiBmID8gZi52YWx1ZSA6IHN0YXRlLmdldChyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBzdGF0ZSwgdmFsdWUsIGtpbmQsIGYpIHtcclxuICAgIGlmIChraW5kID09PSBcIm1cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgbWV0aG9kIGlzIG5vdCB3cml0YWJsZVwiKTtcclxuICAgIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIHNldHRlclwiKTtcclxuICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHdyaXRlIHByaXZhdGUgbWVtYmVyIHRvIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XHJcbiAgICByZXR1cm4gKGtpbmQgPT09IFwiYVwiID8gZi5jYWxsKHJlY2VpdmVyLCB2YWx1ZSkgOiBmID8gZi52YWx1ZSA9IHZhbHVlIDogc3RhdGUuc2V0KHJlY2VpdmVyLCB2YWx1ZSkpLCB2YWx1ZTtcclxufVxyXG4iLCJpbXBvcnQgeyB1cmxBbHBoYWJldCB9IGZyb20gJy4vdXJsLWFscGhhYmV0L2luZGV4LmpzJ1xuaWYgKGZhbHNlKSB7XG4gIGlmIChcbiAgICB0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIG5hdmlnYXRvci5wcm9kdWN0ID09PSAnUmVhY3ROYXRpdmUnICYmXG4gICAgdHlwZW9mIGNyeXB0byA9PT0gJ3VuZGVmaW5lZCdcbiAgKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ1JlYWN0IE5hdGl2ZSBkb2VzIG5vdCBoYXZlIGEgYnVpbHQtaW4gc2VjdXJlIHJhbmRvbSBnZW5lcmF0b3IuICcgK1xuICAgICAgICAnSWYgeW91IGRvbuKAmXQgbmVlZCB1bnByZWRpY3RhYmxlIElEcyB1c2UgYG5hbm9pZC9ub24tc2VjdXJlYC4gJyArXG4gICAgICAgICdGb3Igc2VjdXJlIElEcywgaW1wb3J0IGByZWFjdC1uYXRpdmUtZ2V0LXJhbmRvbS12YWx1ZXNgICcgK1xuICAgICAgICAnYmVmb3JlIE5hbm8gSUQuJ1xuICAgIClcbiAgfVxuICBpZiAodHlwZW9mIG1zQ3J5cHRvICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgY3J5cHRvID09PSAndW5kZWZpbmVkJykge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdJbXBvcnQgZmlsZSB3aXRoIGBpZiAoIXdpbmRvdy5jcnlwdG8pIHdpbmRvdy5jcnlwdG8gPSB3aW5kb3cubXNDcnlwdG9gJyArXG4gICAgICAgICcgYmVmb3JlIGltcG9ydGluZyBOYW5vIElEIHRvIGZpeCBJRSAxMSBzdXBwb3J0J1xuICAgIClcbiAgfVxuICBpZiAodHlwZW9mIGNyeXB0byA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnWW91ciBicm93c2VyIGRvZXMgbm90IGhhdmUgc2VjdXJlIHJhbmRvbSBnZW5lcmF0b3IuICcgK1xuICAgICAgICAnSWYgeW91IGRvbuKAmXQgbmVlZCB1bnByZWRpY3RhYmxlIElEcywgeW91IGNhbiB1c2UgbmFub2lkL25vbi1zZWN1cmUuJ1xuICAgIClcbiAgfVxufVxubGV0IHJhbmRvbSA9IGJ5dGVzID0+IGNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQ4QXJyYXkoYnl0ZXMpKVxubGV0IGN1c3RvbVJhbmRvbSA9IChhbHBoYWJldCwgc2l6ZSwgZ2V0UmFuZG9tKSA9PiB7XG4gIGxldCBtYXNrID0gKDIgPDwgKE1hdGgubG9nKGFscGhhYmV0Lmxlbmd0aCAtIDEpIC8gTWF0aC5MTjIpKSAtIDFcbiAgbGV0IHN0ZXAgPSAtfigoMS42ICogbWFzayAqIHNpemUpIC8gYWxwaGFiZXQubGVuZ3RoKVxuICByZXR1cm4gKCkgPT4ge1xuICAgIGxldCBpZCA9ICcnXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGxldCBieXRlcyA9IGdldFJhbmRvbShzdGVwKVxuICAgICAgbGV0IGogPSBzdGVwXG4gICAgICB3aGlsZSAoai0tKSB7XG4gICAgICAgIGlkICs9IGFscGhhYmV0W2J5dGVzW2pdICYgbWFza10gfHwgJydcbiAgICAgICAgaWYgKGlkLmxlbmd0aCA9PT0gc2l6ZSkgcmV0dXJuIGlkXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5sZXQgY3VzdG9tQWxwaGFiZXQgPSAoYWxwaGFiZXQsIHNpemUpID0+IGN1c3RvbVJhbmRvbShhbHBoYWJldCwgc2l6ZSwgcmFuZG9tKVxubGV0IG5hbm9pZCA9IChzaXplID0gMjEpID0+IHtcbiAgbGV0IGlkID0gJydcbiAgbGV0IGJ5dGVzID0gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheShzaXplKSlcbiAgd2hpbGUgKHNpemUtLSkge1xuICAgIGxldCBieXRlID0gYnl0ZXNbc2l6ZV0gJiA2M1xuICAgIGlmIChieXRlIDwgMzYpIHtcbiAgICAgIGlkICs9IGJ5dGUudG9TdHJpbmcoMzYpXG4gICAgfSBlbHNlIGlmIChieXRlIDwgNjIpIHtcbiAgICAgIGlkICs9IChieXRlIC0gMjYpLnRvU3RyaW5nKDM2KS50b1VwcGVyQ2FzZSgpXG4gICAgfSBlbHNlIGlmIChieXRlIDwgNjMpIHtcbiAgICAgIGlkICs9ICdfJ1xuICAgIH0gZWxzZSB7XG4gICAgICBpZCArPSAnLSdcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGlkXG59XG5leHBvcnQgeyBuYW5vaWQsIGN1c3RvbUFscGhhYmV0LCBjdXN0b21SYW5kb20sIHVybEFscGhhYmV0LCByYW5kb20gfVxuIiwiLypcbiAqIENvcHlyaWdodCAoYykgMjAyMSwgSmVmZiBIbHl3YSAoamhseXdhQGdtYWlsLmNvbSlcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0XG4gKiBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcbiAqXG4gKiAxLiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsXG4gKiAgICB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuICogMi4gUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLFxuICogICAgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvblxuICogICAgYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG4gKlxuICogVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SUyBcIkFTIElTXCJcbiAqIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEVcbiAqIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFXG4gKiBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIENPUFlSSUdIVCBPV05FUiBPUiBDT05UUklCVVRPUlMgQkVcbiAqIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1JcbiAqIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GXG4gKiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1NcbiAqIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOXG4gKiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKVxuICogQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVMgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEVcbiAqIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuICpcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbnZhciBDaGVzcyA9IGZ1bmN0aW9uIChmZW4pIHtcbiAgdmFyIEJMQUNLID0gJ2InXG4gIHZhciBXSElURSA9ICd3J1xuXG4gIHZhciBFTVBUWSA9IC0xXG5cbiAgdmFyIFBBV04gPSAncCdcbiAgdmFyIEtOSUdIVCA9ICduJ1xuICB2YXIgQklTSE9QID0gJ2InXG4gIHZhciBST09LID0gJ3InXG4gIHZhciBRVUVFTiA9ICdxJ1xuICB2YXIgS0lORyA9ICdrJ1xuXG4gIHZhciBTWU1CT0xTID0gJ3BuYnJxa1BOQlJRSydcblxuICB2YXIgREVGQVVMVF9QT1NJVElPTiA9XG4gICAgJ3JuYnFrYm5yL3BwcHBwcHBwLzgvOC84LzgvUFBQUFBQUFAvUk5CUUtCTlIgdyBLUWtxIC0gMCAxJ1xuXG4gIHZhciBURVJNSU5BVElPTl9NQVJLRVJTID0gWycxLTAnLCAnMC0xJywgJzEvMi0xLzInLCAnKiddXG5cbiAgdmFyIFBBV05fT0ZGU0VUUyA9IHtcbiAgICBiOiBbMTYsIDMyLCAxNywgMTVdLFxuICAgIHc6IFstMTYsIC0zMiwgLTE3LCAtMTVdLFxuICB9XG5cbiAgdmFyIFBJRUNFX09GRlNFVFMgPSB7XG4gICAgbjogWy0xOCwgLTMzLCAtMzEsIC0xNCwgMTgsIDMzLCAzMSwgMTRdLFxuICAgIGI6IFstMTcsIC0xNSwgMTcsIDE1XSxcbiAgICByOiBbLTE2LCAxLCAxNiwgLTFdLFxuICAgIHE6IFstMTcsIC0xNiwgLTE1LCAxLCAxNywgMTYsIDE1LCAtMV0sXG4gICAgazogWy0xNywgLTE2LCAtMTUsIDEsIDE3LCAxNiwgMTUsIC0xXSxcbiAgfVxuXG4gIC8vIHByZXR0aWVyLWlnbm9yZVxuICB2YXIgQVRUQUNLUyA9IFtcbiAgICAyMCwgMCwgMCwgMCwgMCwgMCwgMCwgMjQsICAwLCAwLCAwLCAwLCAwLCAwLDIwLCAwLFxuICAgICAwLDIwLCAwLCAwLCAwLCAwLCAwLCAyNCwgIDAsIDAsIDAsIDAsIDAsMjAsIDAsIDAsXG4gICAgIDAsIDAsMjAsIDAsIDAsIDAsIDAsIDI0LCAgMCwgMCwgMCwgMCwyMCwgMCwgMCwgMCxcbiAgICAgMCwgMCwgMCwyMCwgMCwgMCwgMCwgMjQsICAwLCAwLCAwLDIwLCAwLCAwLCAwLCAwLFxuICAgICAwLCAwLCAwLCAwLDIwLCAwLCAwLCAyNCwgIDAsIDAsMjAsIDAsIDAsIDAsIDAsIDAsXG4gICAgIDAsIDAsIDAsIDAsIDAsMjAsIDIsIDI0LCAgMiwyMCwgMCwgMCwgMCwgMCwgMCwgMCxcbiAgICAgMCwgMCwgMCwgMCwgMCwgMiw1MywgNTYsIDUzLCAyLCAwLCAwLCAwLCAwLCAwLCAwLFxuICAgIDI0LDI0LDI0LDI0LDI0LDI0LDU2LCAgMCwgNTYsMjQsMjQsMjQsMjQsMjQsMjQsIDAsXG4gICAgIDAsIDAsIDAsIDAsIDAsIDIsNTMsIDU2LCA1MywgMiwgMCwgMCwgMCwgMCwgMCwgMCxcbiAgICAgMCwgMCwgMCwgMCwgMCwyMCwgMiwgMjQsICAyLDIwLCAwLCAwLCAwLCAwLCAwLCAwLFxuICAgICAwLCAwLCAwLCAwLDIwLCAwLCAwLCAyNCwgIDAsIDAsMjAsIDAsIDAsIDAsIDAsIDAsXG4gICAgIDAsIDAsIDAsMjAsIDAsIDAsIDAsIDI0LCAgMCwgMCwgMCwyMCwgMCwgMCwgMCwgMCxcbiAgICAgMCwgMCwyMCwgMCwgMCwgMCwgMCwgMjQsICAwLCAwLCAwLCAwLDIwLCAwLCAwLCAwLFxuICAgICAwLDIwLCAwLCAwLCAwLCAwLCAwLCAyNCwgIDAsIDAsIDAsIDAsIDAsMjAsIDAsIDAsXG4gICAgMjAsIDAsIDAsIDAsIDAsIDAsIDAsIDI0LCAgMCwgMCwgMCwgMCwgMCwgMCwyMFxuICBdO1xuXG4gIC8vIHByZXR0aWVyLWlnbm9yZVxuICB2YXIgUkFZUyA9IFtcbiAgICAgMTcsICAwLCAgMCwgIDAsICAwLCAgMCwgIDAsIDE2LCAgMCwgIDAsICAwLCAgMCwgIDAsICAwLCAxNSwgMCxcbiAgICAgIDAsIDE3LCAgMCwgIDAsICAwLCAgMCwgIDAsIDE2LCAgMCwgIDAsICAwLCAgMCwgIDAsIDE1LCAgMCwgMCxcbiAgICAgIDAsICAwLCAxNywgIDAsICAwLCAgMCwgIDAsIDE2LCAgMCwgIDAsICAwLCAgMCwgMTUsICAwLCAgMCwgMCxcbiAgICAgIDAsICAwLCAgMCwgMTcsICAwLCAgMCwgIDAsIDE2LCAgMCwgIDAsICAwLCAxNSwgIDAsICAwLCAgMCwgMCxcbiAgICAgIDAsICAwLCAgMCwgIDAsIDE3LCAgMCwgIDAsIDE2LCAgMCwgIDAsIDE1LCAgMCwgIDAsICAwLCAgMCwgMCxcbiAgICAgIDAsICAwLCAgMCwgIDAsICAwLCAxNywgIDAsIDE2LCAgMCwgMTUsICAwLCAgMCwgIDAsICAwLCAgMCwgMCxcbiAgICAgIDAsICAwLCAgMCwgIDAsICAwLCAgMCwgMTcsIDE2LCAxNSwgIDAsICAwLCAgMCwgIDAsICAwLCAgMCwgMCxcbiAgICAgIDEsICAxLCAgMSwgIDEsICAxLCAgMSwgIDEsICAwLCAtMSwgLTEsICAtMSwtMSwgLTEsIC0xLCAtMSwgMCxcbiAgICAgIDAsICAwLCAgMCwgIDAsICAwLCAgMCwtMTUsLTE2LC0xNywgIDAsICAwLCAgMCwgIDAsICAwLCAgMCwgMCxcbiAgICAgIDAsICAwLCAgMCwgIDAsICAwLC0xNSwgIDAsLTE2LCAgMCwtMTcsICAwLCAgMCwgIDAsICAwLCAgMCwgMCxcbiAgICAgIDAsICAwLCAgMCwgIDAsLTE1LCAgMCwgIDAsLTE2LCAgMCwgIDAsLTE3LCAgMCwgIDAsICAwLCAgMCwgMCxcbiAgICAgIDAsICAwLCAgMCwtMTUsICAwLCAgMCwgIDAsLTE2LCAgMCwgIDAsICAwLC0xNywgIDAsICAwLCAgMCwgMCxcbiAgICAgIDAsICAwLC0xNSwgIDAsICAwLCAgMCwgIDAsLTE2LCAgMCwgIDAsICAwLCAgMCwtMTcsICAwLCAgMCwgMCxcbiAgICAgIDAsLTE1LCAgMCwgIDAsICAwLCAgMCwgIDAsLTE2LCAgMCwgIDAsICAwLCAgMCwgIDAsLTE3LCAgMCwgMCxcbiAgICAtMTUsICAwLCAgMCwgIDAsICAwLCAgMCwgIDAsLTE2LCAgMCwgIDAsICAwLCAgMCwgIDAsICAwLC0xN1xuICBdO1xuXG4gIHZhciBTSElGVFMgPSB7IHA6IDAsIG46IDEsIGI6IDIsIHI6IDMsIHE6IDQsIGs6IDUgfVxuXG4gIHZhciBGTEFHUyA9IHtcbiAgICBOT1JNQUw6ICduJyxcbiAgICBDQVBUVVJFOiAnYycsXG4gICAgQklHX1BBV046ICdiJyxcbiAgICBFUF9DQVBUVVJFOiAnZScsXG4gICAgUFJPTU9USU9OOiAncCcsXG4gICAgS1NJREVfQ0FTVExFOiAnaycsXG4gICAgUVNJREVfQ0FTVExFOiAncScsXG4gIH1cblxuICB2YXIgQklUUyA9IHtcbiAgICBOT1JNQUw6IDEsXG4gICAgQ0FQVFVSRTogMixcbiAgICBCSUdfUEFXTjogNCxcbiAgICBFUF9DQVBUVVJFOiA4LFxuICAgIFBST01PVElPTjogMTYsXG4gICAgS1NJREVfQ0FTVExFOiAzMixcbiAgICBRU0lERV9DQVNUTEU6IDY0LFxuICB9XG5cbiAgdmFyIFJBTktfMSA9IDdcbiAgdmFyIFJBTktfMiA9IDZcbiAgdmFyIFJBTktfMyA9IDVcbiAgdmFyIFJBTktfNCA9IDRcbiAgdmFyIFJBTktfNSA9IDNcbiAgdmFyIFJBTktfNiA9IDJcbiAgdmFyIFJBTktfNyA9IDFcbiAgdmFyIFJBTktfOCA9IDBcblxuICAvLyBwcmV0dGllci1pZ25vcmVcbiAgdmFyIFNRVUFSRVMgPSB7XG4gICAgYTg6ICAgMCwgYjg6ICAgMSwgYzg6ICAgMiwgZDg6ICAgMywgZTg6ICAgNCwgZjg6ICAgNSwgZzg6ICAgNiwgaDg6ICAgNyxcbiAgICBhNzogIDE2LCBiNzogIDE3LCBjNzogIDE4LCBkNzogIDE5LCBlNzogIDIwLCBmNzogIDIxLCBnNzogIDIyLCBoNzogIDIzLFxuICAgIGE2OiAgMzIsIGI2OiAgMzMsIGM2OiAgMzQsIGQ2OiAgMzUsIGU2OiAgMzYsIGY2OiAgMzcsIGc2OiAgMzgsIGg2OiAgMzksXG4gICAgYTU6ICA0OCwgYjU6ICA0OSwgYzU6ICA1MCwgZDU6ICA1MSwgZTU6ICA1MiwgZjU6ICA1MywgZzU6ICA1NCwgaDU6ICA1NSxcbiAgICBhNDogIDY0LCBiNDogIDY1LCBjNDogIDY2LCBkNDogIDY3LCBlNDogIDY4LCBmNDogIDY5LCBnNDogIDcwLCBoNDogIDcxLFxuICAgIGEzOiAgODAsIGIzOiAgODEsIGMzOiAgODIsIGQzOiAgODMsIGUzOiAgODQsIGYzOiAgODUsIGczOiAgODYsIGgzOiAgODcsXG4gICAgYTI6ICA5NiwgYjI6ICA5NywgYzI6ICA5OCwgZDI6ICA5OSwgZTI6IDEwMCwgZjI6IDEwMSwgZzI6IDEwMiwgaDI6IDEwMyxcbiAgICBhMTogMTEyLCBiMTogMTEzLCBjMTogMTE0LCBkMTogMTE1LCBlMTogMTE2LCBmMTogMTE3LCBnMTogMTE4LCBoMTogMTE5XG4gIH07XG5cbiAgdmFyIFJPT0tTID0ge1xuICAgIHc6IFtcbiAgICAgIHsgc3F1YXJlOiBTUVVBUkVTLmExLCBmbGFnOiBCSVRTLlFTSURFX0NBU1RMRSB9LFxuICAgICAgeyBzcXVhcmU6IFNRVUFSRVMuaDEsIGZsYWc6IEJJVFMuS1NJREVfQ0FTVExFIH0sXG4gICAgXSxcbiAgICBiOiBbXG4gICAgICB7IHNxdWFyZTogU1FVQVJFUy5hOCwgZmxhZzogQklUUy5RU0lERV9DQVNUTEUgfSxcbiAgICAgIHsgc3F1YXJlOiBTUVVBUkVTLmg4LCBmbGFnOiBCSVRTLktTSURFX0NBU1RMRSB9LFxuICAgIF0sXG4gIH1cblxuICB2YXIgYm9hcmQgPSBuZXcgQXJyYXkoMTI4KVxuICB2YXIga2luZ3MgPSB7IHc6IEVNUFRZLCBiOiBFTVBUWSB9XG4gIHZhciB0dXJuID0gV0hJVEVcbiAgdmFyIGNhc3RsaW5nID0geyB3OiAwLCBiOiAwIH1cbiAgdmFyIGVwX3NxdWFyZSA9IEVNUFRZXG4gIHZhciBoYWxmX21vdmVzID0gMFxuICB2YXIgbW92ZV9udW1iZXIgPSAxXG4gIHZhciBoaXN0b3J5ID0gW11cbiAgdmFyIGhlYWRlciA9IHt9XG4gIHZhciBjb21tZW50cyA9IHt9XG5cbiAgLyogaWYgdGhlIHVzZXIgcGFzc2VzIGluIGEgZmVuIHN0cmluZywgbG9hZCBpdCwgZWxzZSBkZWZhdWx0IHRvXG4gICAqIHN0YXJ0aW5nIHBvc2l0aW9uXG4gICAqL1xuICBpZiAodHlwZW9mIGZlbiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBsb2FkKERFRkFVTFRfUE9TSVRJT04pXG4gIH0gZWxzZSB7XG4gICAgbG9hZChmZW4pXG4gIH1cblxuICBmdW5jdGlvbiBjbGVhcihrZWVwX2hlYWRlcnMpIHtcbiAgICBpZiAodHlwZW9mIGtlZXBfaGVhZGVycyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGtlZXBfaGVhZGVycyA9IGZhbHNlXG4gICAgfVxuXG4gICAgYm9hcmQgPSBuZXcgQXJyYXkoMTI4KVxuICAgIGtpbmdzID0geyB3OiBFTVBUWSwgYjogRU1QVFkgfVxuICAgIHR1cm4gPSBXSElURVxuICAgIGNhc3RsaW5nID0geyB3OiAwLCBiOiAwIH1cbiAgICBlcF9zcXVhcmUgPSBFTVBUWVxuICAgIGhhbGZfbW92ZXMgPSAwXG4gICAgbW92ZV9udW1iZXIgPSAxXG4gICAgaGlzdG9yeSA9IFtdXG4gICAgaWYgKCFrZWVwX2hlYWRlcnMpIGhlYWRlciA9IHt9XG4gICAgY29tbWVudHMgPSB7fVxuICAgIHVwZGF0ZV9zZXR1cChnZW5lcmF0ZV9mZW4oKSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHBydW5lX2NvbW1lbnRzKCkge1xuICAgIHZhciByZXZlcnNlZF9oaXN0b3J5ID0gW11cbiAgICB2YXIgY3VycmVudF9jb21tZW50cyA9IHt9XG4gICAgdmFyIGNvcHlfY29tbWVudCA9IGZ1bmN0aW9uIChmZW4pIHtcbiAgICAgIGlmIChmZW4gaW4gY29tbWVudHMpIHtcbiAgICAgICAgY3VycmVudF9jb21tZW50c1tmZW5dID0gY29tbWVudHNbZmVuXVxuICAgICAgfVxuICAgIH1cbiAgICB3aGlsZSAoaGlzdG9yeS5sZW5ndGggPiAwKSB7XG4gICAgICByZXZlcnNlZF9oaXN0b3J5LnB1c2godW5kb19tb3ZlKCkpXG4gICAgfVxuICAgIGNvcHlfY29tbWVudChnZW5lcmF0ZV9mZW4oKSlcbiAgICB3aGlsZSAocmV2ZXJzZWRfaGlzdG9yeS5sZW5ndGggPiAwKSB7XG4gICAgICBtYWtlX21vdmUocmV2ZXJzZWRfaGlzdG9yeS5wb3AoKSlcbiAgICAgIGNvcHlfY29tbWVudChnZW5lcmF0ZV9mZW4oKSlcbiAgICB9XG4gICAgY29tbWVudHMgPSBjdXJyZW50X2NvbW1lbnRzXG4gIH1cblxuICBmdW5jdGlvbiByZXNldCgpIHtcbiAgICBsb2FkKERFRkFVTFRfUE9TSVRJT04pXG4gIH1cblxuICBmdW5jdGlvbiBsb2FkKGZlbiwga2VlcF9oZWFkZXJzKSB7XG4gICAgaWYgKHR5cGVvZiBrZWVwX2hlYWRlcnMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBrZWVwX2hlYWRlcnMgPSBmYWxzZVxuICAgIH1cblxuICAgIHZhciB0b2tlbnMgPSBmZW4uc3BsaXQoL1xccysvKVxuICAgIHZhciBwb3NpdGlvbiA9IHRva2Vuc1swXVxuICAgIHZhciBzcXVhcmUgPSAwXG5cbiAgICBpZiAoIXZhbGlkYXRlX2ZlbihmZW4pLnZhbGlkKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBjbGVhcihrZWVwX2hlYWRlcnMpXG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBvc2l0aW9uLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcGllY2UgPSBwb3NpdGlvbi5jaGFyQXQoaSlcblxuICAgICAgaWYgKHBpZWNlID09PSAnLycpIHtcbiAgICAgICAgc3F1YXJlICs9IDhcbiAgICAgIH0gZWxzZSBpZiAoaXNfZGlnaXQocGllY2UpKSB7XG4gICAgICAgIHNxdWFyZSArPSBwYXJzZUludChwaWVjZSwgMTApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgY29sb3IgPSBwaWVjZSA8ICdhJyA/IFdISVRFIDogQkxBQ0tcbiAgICAgICAgcHV0KHsgdHlwZTogcGllY2UudG9Mb3dlckNhc2UoKSwgY29sb3I6IGNvbG9yIH0sIGFsZ2VicmFpYyhzcXVhcmUpKVxuICAgICAgICBzcXVhcmUrK1xuICAgICAgfVxuICAgIH1cblxuICAgIHR1cm4gPSB0b2tlbnNbMV1cblxuICAgIGlmICh0b2tlbnNbMl0uaW5kZXhPZignSycpID4gLTEpIHtcbiAgICAgIGNhc3RsaW5nLncgfD0gQklUUy5LU0lERV9DQVNUTEVcbiAgICB9XG4gICAgaWYgKHRva2Vuc1syXS5pbmRleE9mKCdRJykgPiAtMSkge1xuICAgICAgY2FzdGxpbmcudyB8PSBCSVRTLlFTSURFX0NBU1RMRVxuICAgIH1cbiAgICBpZiAodG9rZW5zWzJdLmluZGV4T2YoJ2snKSA+IC0xKSB7XG4gICAgICBjYXN0bGluZy5iIHw9IEJJVFMuS1NJREVfQ0FTVExFXG4gICAgfVxuICAgIGlmICh0b2tlbnNbMl0uaW5kZXhPZigncScpID4gLTEpIHtcbiAgICAgIGNhc3RsaW5nLmIgfD0gQklUUy5RU0lERV9DQVNUTEVcbiAgICB9XG5cbiAgICBlcF9zcXVhcmUgPSB0b2tlbnNbM10gPT09ICctJyA/IEVNUFRZIDogU1FVQVJFU1t0b2tlbnNbM11dXG4gICAgaGFsZl9tb3ZlcyA9IHBhcnNlSW50KHRva2Vuc1s0XSwgMTApXG4gICAgbW92ZV9udW1iZXIgPSBwYXJzZUludCh0b2tlbnNbNV0sIDEwKVxuXG4gICAgdXBkYXRlX3NldHVwKGdlbmVyYXRlX2ZlbigpKVxuXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIC8qIFRPRE86IHRoaXMgZnVuY3Rpb24gaXMgcHJldHR5IG11Y2ggY3JhcCAtIGl0IHZhbGlkYXRlcyBzdHJ1Y3R1cmUgYnV0XG4gICAqIGNvbXBsZXRlbHkgaWdub3JlcyBjb250ZW50IChlLmcuIGRvZXNuJ3QgdmVyaWZ5IHRoYXQgZWFjaCBzaWRlIGhhcyBhIGtpbmcpXG4gICAqIC4uLiB3ZSBzaG91bGQgcmV3cml0ZSB0aGlzLCBhbmQgZGl0Y2ggdGhlIHNpbGx5IGVycm9yX251bWJlciBmaWVsZCB3aGlsZVxuICAgKiB3ZSdyZSBhdCBpdFxuICAgKi9cbiAgZnVuY3Rpb24gdmFsaWRhdGVfZmVuKGZlbikge1xuICAgIHZhciBlcnJvcnMgPSB7XG4gICAgICAwOiAnTm8gZXJyb3JzLicsXG4gICAgICAxOiAnRkVOIHN0cmluZyBtdXN0IGNvbnRhaW4gc2l4IHNwYWNlLWRlbGltaXRlZCBmaWVsZHMuJyxcbiAgICAgIDI6ICc2dGggZmllbGQgKG1vdmUgbnVtYmVyKSBtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlci4nLFxuICAgICAgMzogJzV0aCBmaWVsZCAoaGFsZiBtb3ZlIGNvdW50ZXIpIG11c3QgYmUgYSBub24tbmVnYXRpdmUgaW50ZWdlci4nLFxuICAgICAgNDogJzR0aCBmaWVsZCAoZW4tcGFzc2FudCBzcXVhcmUpIGlzIGludmFsaWQuJyxcbiAgICAgIDU6ICczcmQgZmllbGQgKGNhc3RsaW5nIGF2YWlsYWJpbGl0eSkgaXMgaW52YWxpZC4nLFxuICAgICAgNjogJzJuZCBmaWVsZCAoc2lkZSB0byBtb3ZlKSBpcyBpbnZhbGlkLicsXG4gICAgICA3OiBcIjFzdCBmaWVsZCAocGllY2UgcG9zaXRpb25zKSBkb2VzIG5vdCBjb250YWluIDggJy8nLWRlbGltaXRlZCByb3dzLlwiLFxuICAgICAgODogJzFzdCBmaWVsZCAocGllY2UgcG9zaXRpb25zKSBpcyBpbnZhbGlkIFtjb25zZWN1dGl2ZSBudW1iZXJzXS4nLFxuICAgICAgOTogJzFzdCBmaWVsZCAocGllY2UgcG9zaXRpb25zKSBpcyBpbnZhbGlkIFtpbnZhbGlkIHBpZWNlXS4nLFxuICAgICAgMTA6ICcxc3QgZmllbGQgKHBpZWNlIHBvc2l0aW9ucykgaXMgaW52YWxpZCBbcm93IHRvbyBsYXJnZV0uJyxcbiAgICAgIDExOiAnSWxsZWdhbCBlbi1wYXNzYW50IHNxdWFyZScsXG4gICAgfVxuXG4gICAgLyogMXN0IGNyaXRlcmlvbjogNiBzcGFjZS1zZXBlcmF0ZWQgZmllbGRzPyAqL1xuICAgIHZhciB0b2tlbnMgPSBmZW4uc3BsaXQoL1xccysvKVxuICAgIGlmICh0b2tlbnMubGVuZ3RoICE9PSA2KSB7XG4gICAgICByZXR1cm4geyB2YWxpZDogZmFsc2UsIGVycm9yX251bWJlcjogMSwgZXJyb3I6IGVycm9yc1sxXSB9XG4gICAgfVxuXG4gICAgLyogMm5kIGNyaXRlcmlvbjogbW92ZSBudW1iZXIgZmllbGQgaXMgYSBpbnRlZ2VyIHZhbHVlID4gMD8gKi9cbiAgICBpZiAoaXNOYU4odG9rZW5zWzVdKSB8fCBwYXJzZUludCh0b2tlbnNbNV0sIDEwKSA8PSAwKSB7XG4gICAgICByZXR1cm4geyB2YWxpZDogZmFsc2UsIGVycm9yX251bWJlcjogMiwgZXJyb3I6IGVycm9yc1syXSB9XG4gICAgfVxuXG4gICAgLyogM3JkIGNyaXRlcmlvbjogaGFsZiBtb3ZlIGNvdW50ZXIgaXMgYW4gaW50ZWdlciA+PSAwPyAqL1xuICAgIGlmIChpc05hTih0b2tlbnNbNF0pIHx8IHBhcnNlSW50KHRva2Vuc1s0XSwgMTApIDwgMCkge1xuICAgICAgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlLCBlcnJvcl9udW1iZXI6IDMsIGVycm9yOiBlcnJvcnNbM10gfVxuICAgIH1cblxuICAgIC8qIDR0aCBjcml0ZXJpb246IDR0aCBmaWVsZCBpcyBhIHZhbGlkIGUucC4tc3RyaW5nPyAqL1xuICAgIGlmICghL14oLXxbYWJjZGVmZ2hdWzM2XSkkLy50ZXN0KHRva2Vuc1szXSkpIHtcbiAgICAgIHJldHVybiB7IHZhbGlkOiBmYWxzZSwgZXJyb3JfbnVtYmVyOiA0LCBlcnJvcjogZXJyb3JzWzRdIH1cbiAgICB9XG5cbiAgICAvKiA1dGggY3JpdGVyaW9uOiAzdGggZmllbGQgaXMgYSB2YWxpZCBjYXN0bGUtc3RyaW5nPyAqL1xuICAgIGlmICghL14oS1E/az9xP3xRaz9xP3xrcT98cXwtKSQvLnRlc3QodG9rZW5zWzJdKSkge1xuICAgICAgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlLCBlcnJvcl9udW1iZXI6IDUsIGVycm9yOiBlcnJvcnNbNV0gfVxuICAgIH1cblxuICAgIC8qIDZ0aCBjcml0ZXJpb246IDJuZCBmaWVsZCBpcyBcIndcIiAod2hpdGUpIG9yIFwiYlwiIChibGFjayk/ICovXG4gICAgaWYgKCEvXih3fGIpJC8udGVzdCh0b2tlbnNbMV0pKSB7XG4gICAgICByZXR1cm4geyB2YWxpZDogZmFsc2UsIGVycm9yX251bWJlcjogNiwgZXJyb3I6IGVycm9yc1s2XSB9XG4gICAgfVxuXG4gICAgLyogN3RoIGNyaXRlcmlvbjogMXN0IGZpZWxkIGNvbnRhaW5zIDggcm93cz8gKi9cbiAgICB2YXIgcm93cyA9IHRva2Vuc1swXS5zcGxpdCgnLycpXG4gICAgaWYgKHJvd3MubGVuZ3RoICE9PSA4KSB7XG4gICAgICByZXR1cm4geyB2YWxpZDogZmFsc2UsIGVycm9yX251bWJlcjogNywgZXJyb3I6IGVycm9yc1s3XSB9XG4gICAgfVxuXG4gICAgLyogOHRoIGNyaXRlcmlvbjogZXZlcnkgcm93IGlzIHZhbGlkPyAqL1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm93cy5sZW5ndGg7IGkrKykge1xuICAgICAgLyogY2hlY2sgZm9yIHJpZ2h0IHN1bSBvZiBmaWVsZHMgQU5EIG5vdCB0d28gbnVtYmVycyBpbiBzdWNjZXNzaW9uICovXG4gICAgICB2YXIgc3VtX2ZpZWxkcyA9IDBcbiAgICAgIHZhciBwcmV2aW91c193YXNfbnVtYmVyID0gZmFsc2VcblxuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCByb3dzW2ldLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIGlmICghaXNOYU4ocm93c1tpXVtrXSkpIHtcbiAgICAgICAgICBpZiAocHJldmlvdXNfd2FzX251bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlLCBlcnJvcl9udW1iZXI6IDgsIGVycm9yOiBlcnJvcnNbOF0gfVxuICAgICAgICAgIH1cbiAgICAgICAgICBzdW1fZmllbGRzICs9IHBhcnNlSW50KHJvd3NbaV1ba10sIDEwKVxuICAgICAgICAgIHByZXZpb3VzX3dhc19udW1iZXIgPSB0cnVlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCEvXltwcm5icWtQUk5CUUtdJC8udGVzdChyb3dzW2ldW2tdKSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlLCBlcnJvcl9udW1iZXI6IDksIGVycm9yOiBlcnJvcnNbOV0gfVxuICAgICAgICAgIH1cbiAgICAgICAgICBzdW1fZmllbGRzICs9IDFcbiAgICAgICAgICBwcmV2aW91c193YXNfbnVtYmVyID0gZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1bV9maWVsZHMgIT09IDgpIHtcbiAgICAgICAgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlLCBlcnJvcl9udW1iZXI6IDEwLCBlcnJvcjogZXJyb3JzWzEwXSB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgKHRva2Vuc1szXVsxXSA9PSAnMycgJiYgdG9rZW5zWzFdID09ICd3JykgfHxcbiAgICAgICh0b2tlbnNbM11bMV0gPT0gJzYnICYmIHRva2Vuc1sxXSA9PSAnYicpXG4gICAgKSB7XG4gICAgICByZXR1cm4geyB2YWxpZDogZmFsc2UsIGVycm9yX251bWJlcjogMTEsIGVycm9yOiBlcnJvcnNbMTFdIH1cbiAgICB9XG5cbiAgICAvKiBldmVyeXRoaW5nJ3Mgb2theSEgKi9cbiAgICByZXR1cm4geyB2YWxpZDogdHJ1ZSwgZXJyb3JfbnVtYmVyOiAwLCBlcnJvcjogZXJyb3JzWzBdIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlX2ZlbigpIHtcbiAgICB2YXIgZW1wdHkgPSAwXG4gICAgdmFyIGZlbiA9ICcnXG5cbiAgICBmb3IgKHZhciBpID0gU1FVQVJFUy5hODsgaSA8PSBTUVVBUkVTLmgxOyBpKyspIHtcbiAgICAgIGlmIChib2FyZFtpXSA9PSBudWxsKSB7XG4gICAgICAgIGVtcHR5KytcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChlbXB0eSA+IDApIHtcbiAgICAgICAgICBmZW4gKz0gZW1wdHlcbiAgICAgICAgICBlbXB0eSA9IDBcbiAgICAgICAgfVxuICAgICAgICB2YXIgY29sb3IgPSBib2FyZFtpXS5jb2xvclxuICAgICAgICB2YXIgcGllY2UgPSBib2FyZFtpXS50eXBlXG5cbiAgICAgICAgZmVuICs9IGNvbG9yID09PSBXSElURSA/IHBpZWNlLnRvVXBwZXJDYXNlKCkgOiBwaWVjZS50b0xvd2VyQ2FzZSgpXG4gICAgICB9XG5cbiAgICAgIGlmICgoaSArIDEpICYgMHg4OCkge1xuICAgICAgICBpZiAoZW1wdHkgPiAwKSB7XG4gICAgICAgICAgZmVuICs9IGVtcHR5XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaSAhPT0gU1FVQVJFUy5oMSkge1xuICAgICAgICAgIGZlbiArPSAnLydcbiAgICAgICAgfVxuXG4gICAgICAgIGVtcHR5ID0gMFxuICAgICAgICBpICs9IDhcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgY2ZsYWdzID0gJydcbiAgICBpZiAoY2FzdGxpbmdbV0hJVEVdICYgQklUUy5LU0lERV9DQVNUTEUpIHtcbiAgICAgIGNmbGFncyArPSAnSydcbiAgICB9XG4gICAgaWYgKGNhc3RsaW5nW1dISVRFXSAmIEJJVFMuUVNJREVfQ0FTVExFKSB7XG4gICAgICBjZmxhZ3MgKz0gJ1EnXG4gICAgfVxuICAgIGlmIChjYXN0bGluZ1tCTEFDS10gJiBCSVRTLktTSURFX0NBU1RMRSkge1xuICAgICAgY2ZsYWdzICs9ICdrJ1xuICAgIH1cbiAgICBpZiAoY2FzdGxpbmdbQkxBQ0tdICYgQklUUy5RU0lERV9DQVNUTEUpIHtcbiAgICAgIGNmbGFncyArPSAncSdcbiAgICB9XG5cbiAgICAvKiBkbyB3ZSBoYXZlIGFuIGVtcHR5IGNhc3RsaW5nIGZsYWc/ICovXG4gICAgY2ZsYWdzID0gY2ZsYWdzIHx8ICctJ1xuICAgIHZhciBlcGZsYWdzID0gZXBfc3F1YXJlID09PSBFTVBUWSA/ICctJyA6IGFsZ2VicmFpYyhlcF9zcXVhcmUpXG5cbiAgICByZXR1cm4gW2ZlbiwgdHVybiwgY2ZsYWdzLCBlcGZsYWdzLCBoYWxmX21vdmVzLCBtb3ZlX251bWJlcl0uam9pbignICcpXG4gIH1cblxuICBmdW5jdGlvbiBzZXRfaGVhZGVyKGFyZ3MpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgIGlmICh0eXBlb2YgYXJnc1tpXSA9PT0gJ3N0cmluZycgJiYgdHlwZW9mIGFyZ3NbaSArIDFdID09PSAnc3RyaW5nJykge1xuICAgICAgICBoZWFkZXJbYXJnc1tpXV0gPSBhcmdzW2kgKyAxXVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaGVhZGVyXG4gIH1cblxuICAvKiBjYWxsZWQgd2hlbiB0aGUgaW5pdGlhbCBib2FyZCBzZXR1cCBpcyBjaGFuZ2VkIHdpdGggcHV0KCkgb3IgcmVtb3ZlKCkuXG4gICAqIG1vZGlmaWVzIHRoZSBTZXRVcCBhbmQgRkVOIHByb3BlcnRpZXMgb2YgdGhlIGhlYWRlciBvYmplY3QuICBpZiB0aGUgRkVOIGlzXG4gICAqIGVxdWFsIHRvIHRoZSBkZWZhdWx0IHBvc2l0aW9uLCB0aGUgU2V0VXAgYW5kIEZFTiBhcmUgZGVsZXRlZFxuICAgKiB0aGUgc2V0dXAgaXMgb25seSB1cGRhdGVkIGlmIGhpc3RvcnkubGVuZ3RoIGlzIHplcm8sIGllIG1vdmVzIGhhdmVuJ3QgYmVlblxuICAgKiBtYWRlLlxuICAgKi9cbiAgZnVuY3Rpb24gdXBkYXRlX3NldHVwKGZlbikge1xuICAgIGlmIChoaXN0b3J5Lmxlbmd0aCA+IDApIHJldHVyblxuXG4gICAgaWYgKGZlbiAhPT0gREVGQVVMVF9QT1NJVElPTikge1xuICAgICAgaGVhZGVyWydTZXRVcCddID0gJzEnXG4gICAgICBoZWFkZXJbJ0ZFTiddID0gZmVuXG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSBoZWFkZXJbJ1NldFVwJ11cbiAgICAgIGRlbGV0ZSBoZWFkZXJbJ0ZFTiddXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0KHNxdWFyZSkge1xuICAgIHZhciBwaWVjZSA9IGJvYXJkW1NRVUFSRVNbc3F1YXJlXV1cbiAgICByZXR1cm4gcGllY2UgPyB7IHR5cGU6IHBpZWNlLnR5cGUsIGNvbG9yOiBwaWVjZS5jb2xvciB9IDogbnVsbFxuICB9XG5cbiAgZnVuY3Rpb24gcHV0KHBpZWNlLCBzcXVhcmUpIHtcbiAgICAvKiBjaGVjayBmb3IgdmFsaWQgcGllY2Ugb2JqZWN0ICovXG4gICAgaWYgKCEoJ3R5cGUnIGluIHBpZWNlICYmICdjb2xvcicgaW4gcGllY2UpKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICAvKiBjaGVjayBmb3IgcGllY2UgKi9cbiAgICBpZiAoU1lNQk9MUy5pbmRleE9mKHBpZWNlLnR5cGUudG9Mb3dlckNhc2UoKSkgPT09IC0xKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICAvKiBjaGVjayBmb3IgdmFsaWQgc3F1YXJlICovXG4gICAgaWYgKCEoc3F1YXJlIGluIFNRVUFSRVMpKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICB2YXIgc3EgPSBTUVVBUkVTW3NxdWFyZV1cblxuICAgIC8qIGRvbid0IGxldCB0aGUgdXNlciBwbGFjZSBtb3JlIHRoYW4gb25lIGtpbmcgKi9cbiAgICBpZiAoXG4gICAgICBwaWVjZS50eXBlID09IEtJTkcgJiZcbiAgICAgICEoa2luZ3NbcGllY2UuY29sb3JdID09IEVNUFRZIHx8IGtpbmdzW3BpZWNlLmNvbG9yXSA9PSBzcSlcbiAgICApIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGJvYXJkW3NxXSA9IHsgdHlwZTogcGllY2UudHlwZSwgY29sb3I6IHBpZWNlLmNvbG9yIH1cbiAgICBpZiAocGllY2UudHlwZSA9PT0gS0lORykge1xuICAgICAga2luZ3NbcGllY2UuY29sb3JdID0gc3FcbiAgICB9XG5cbiAgICB1cGRhdGVfc2V0dXAoZ2VuZXJhdGVfZmVuKCkpXG5cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlKHNxdWFyZSkge1xuICAgIHZhciBwaWVjZSA9IGdldChzcXVhcmUpXG4gICAgYm9hcmRbU1FVQVJFU1tzcXVhcmVdXSA9IG51bGxcbiAgICBpZiAocGllY2UgJiYgcGllY2UudHlwZSA9PT0gS0lORykge1xuICAgICAga2luZ3NbcGllY2UuY29sb3JdID0gRU1QVFlcbiAgICB9XG5cbiAgICB1cGRhdGVfc2V0dXAoZ2VuZXJhdGVfZmVuKCkpXG5cbiAgICByZXR1cm4gcGllY2VcbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1aWxkX21vdmUoYm9hcmQsIGZyb20sIHRvLCBmbGFncywgcHJvbW90aW9uKSB7XG4gICAgdmFyIG1vdmUgPSB7XG4gICAgICBjb2xvcjogdHVybixcbiAgICAgIGZyb206IGZyb20sXG4gICAgICB0bzogdG8sXG4gICAgICBmbGFnczogZmxhZ3MsXG4gICAgICBwaWVjZTogYm9hcmRbZnJvbV0udHlwZSxcbiAgICB9XG5cbiAgICBpZiAocHJvbW90aW9uKSB7XG4gICAgICBtb3ZlLmZsYWdzIHw9IEJJVFMuUFJPTU9USU9OXG4gICAgICBtb3ZlLnByb21vdGlvbiA9IHByb21vdGlvblxuICAgIH1cblxuICAgIGlmIChib2FyZFt0b10pIHtcbiAgICAgIG1vdmUuY2FwdHVyZWQgPSBib2FyZFt0b10udHlwZVxuICAgIH0gZWxzZSBpZiAoZmxhZ3MgJiBCSVRTLkVQX0NBUFRVUkUpIHtcbiAgICAgIG1vdmUuY2FwdHVyZWQgPSBQQVdOXG4gICAgfVxuICAgIHJldHVybiBtb3ZlXG4gIH1cblxuICBmdW5jdGlvbiBnZW5lcmF0ZV9tb3ZlcyhvcHRpb25zKSB7XG4gICAgZnVuY3Rpb24gYWRkX21vdmUoYm9hcmQsIG1vdmVzLCBmcm9tLCB0bywgZmxhZ3MpIHtcbiAgICAgIC8qIGlmIHBhd24gcHJvbW90aW9uICovXG4gICAgICBpZiAoXG4gICAgICAgIGJvYXJkW2Zyb21dLnR5cGUgPT09IFBBV04gJiZcbiAgICAgICAgKHJhbmsodG8pID09PSBSQU5LXzggfHwgcmFuayh0bykgPT09IFJBTktfMSlcbiAgICAgICkge1xuICAgICAgICB2YXIgcGllY2VzID0gW1FVRUVOLCBST09LLCBCSVNIT1AsIEtOSUdIVF1cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHBpZWNlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIG1vdmVzLnB1c2goYnVpbGRfbW92ZShib2FyZCwgZnJvbSwgdG8sIGZsYWdzLCBwaWVjZXNbaV0pKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtb3Zlcy5wdXNoKGJ1aWxkX21vdmUoYm9hcmQsIGZyb20sIHRvLCBmbGFncykpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIG1vdmVzID0gW11cbiAgICB2YXIgdXMgPSB0dXJuXG4gICAgdmFyIHRoZW0gPSBzd2FwX2NvbG9yKHVzKVxuICAgIHZhciBzZWNvbmRfcmFuayA9IHsgYjogUkFOS183LCB3OiBSQU5LXzIgfVxuXG4gICAgdmFyIGZpcnN0X3NxID0gU1FVQVJFUy5hOFxuICAgIHZhciBsYXN0X3NxID0gU1FVQVJFUy5oMVxuICAgIHZhciBzaW5nbGVfc3F1YXJlID0gZmFsc2VcblxuICAgIC8qIGRvIHdlIHdhbnQgbGVnYWwgbW92ZXM/ICovXG4gICAgdmFyIGxlZ2FsID1cbiAgICAgIHR5cGVvZiBvcHRpb25zICE9PSAndW5kZWZpbmVkJyAmJiAnbGVnYWwnIGluIG9wdGlvbnNcbiAgICAgICAgPyBvcHRpb25zLmxlZ2FsXG4gICAgICAgIDogdHJ1ZVxuXG4gICAgdmFyIHBpZWNlX3R5cGUgPVxuICAgICAgdHlwZW9mIG9wdGlvbnMgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAncGllY2UnIGluIG9wdGlvbnMgJiZcbiAgICAgIHR5cGVvZiBvcHRpb25zLnBpZWNlID09PSAnc3RyaW5nJ1xuICAgICAgICA/IG9wdGlvbnMucGllY2UudG9Mb3dlckNhc2UoKVxuICAgICAgICA6IHRydWVcblxuICAgIC8qIGFyZSB3ZSBnZW5lcmF0aW5nIG1vdmVzIGZvciBhIHNpbmdsZSBzcXVhcmU/ICovXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAndW5kZWZpbmVkJyAmJiAnc3F1YXJlJyBpbiBvcHRpb25zKSB7XG4gICAgICBpZiAob3B0aW9ucy5zcXVhcmUgaW4gU1FVQVJFUykge1xuICAgICAgICBmaXJzdF9zcSA9IGxhc3Rfc3EgPSBTUVVBUkVTW29wdGlvbnMuc3F1YXJlXVxuICAgICAgICBzaW5nbGVfc3F1YXJlID0gdHJ1ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLyogaW52YWxpZCBzcXVhcmUgKi9cbiAgICAgICAgcmV0dXJuIFtdXG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IGZpcnN0X3NxOyBpIDw9IGxhc3Rfc3E7IGkrKykge1xuICAgICAgLyogZGlkIHdlIHJ1biBvZmYgdGhlIGVuZCBvZiB0aGUgYm9hcmQgKi9cbiAgICAgIGlmIChpICYgMHg4OCkge1xuICAgICAgICBpICs9IDdcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgdmFyIHBpZWNlID0gYm9hcmRbaV1cbiAgICAgIGlmIChwaWVjZSA9PSBudWxsIHx8IHBpZWNlLmNvbG9yICE9PSB1cykge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICBpZiAocGllY2UudHlwZSA9PT0gUEFXTiAmJiAocGllY2VfdHlwZSA9PT0gdHJ1ZSB8fCBwaWVjZV90eXBlID09PSBQQVdOKSkge1xuICAgICAgICAvKiBzaW5nbGUgc3F1YXJlLCBub24tY2FwdHVyaW5nICovXG4gICAgICAgIHZhciBzcXVhcmUgPSBpICsgUEFXTl9PRkZTRVRTW3VzXVswXVxuICAgICAgICBpZiAoYm9hcmRbc3F1YXJlXSA9PSBudWxsKSB7XG4gICAgICAgICAgYWRkX21vdmUoYm9hcmQsIG1vdmVzLCBpLCBzcXVhcmUsIEJJVFMuTk9STUFMKVxuXG4gICAgICAgICAgLyogZG91YmxlIHNxdWFyZSAqL1xuICAgICAgICAgIHZhciBzcXVhcmUgPSBpICsgUEFXTl9PRkZTRVRTW3VzXVsxXVxuICAgICAgICAgIGlmIChzZWNvbmRfcmFua1t1c10gPT09IHJhbmsoaSkgJiYgYm9hcmRbc3F1YXJlXSA9PSBudWxsKSB7XG4gICAgICAgICAgICBhZGRfbW92ZShib2FyZCwgbW92ZXMsIGksIHNxdWFyZSwgQklUUy5CSUdfUEFXTilcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKiBwYXduIGNhcHR1cmVzICovXG4gICAgICAgIGZvciAoaiA9IDI7IGogPCA0OyBqKyspIHtcbiAgICAgICAgICB2YXIgc3F1YXJlID0gaSArIFBBV05fT0ZGU0VUU1t1c11bal1cbiAgICAgICAgICBpZiAoc3F1YXJlICYgMHg4OCkgY29udGludWVcblxuICAgICAgICAgIGlmIChib2FyZFtzcXVhcmVdICE9IG51bGwgJiYgYm9hcmRbc3F1YXJlXS5jb2xvciA9PT0gdGhlbSkge1xuICAgICAgICAgICAgYWRkX21vdmUoYm9hcmQsIG1vdmVzLCBpLCBzcXVhcmUsIEJJVFMuQ0FQVFVSRSlcbiAgICAgICAgICB9IGVsc2UgaWYgKHNxdWFyZSA9PT0gZXBfc3F1YXJlKSB7XG4gICAgICAgICAgICBhZGRfbW92ZShib2FyZCwgbW92ZXMsIGksIGVwX3NxdWFyZSwgQklUUy5FUF9DQVBUVVJFKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChwaWVjZV90eXBlID09PSB0cnVlIHx8IHBpZWNlX3R5cGUgPT09IHBpZWNlLnR5cGUpIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDAsIGxlbiA9IFBJRUNFX09GRlNFVFNbcGllY2UudHlwZV0ubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICB2YXIgb2Zmc2V0ID0gUElFQ0VfT0ZGU0VUU1twaWVjZS50eXBlXVtqXVxuICAgICAgICAgIHZhciBzcXVhcmUgPSBpXG5cbiAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgc3F1YXJlICs9IG9mZnNldFxuICAgICAgICAgICAgaWYgKHNxdWFyZSAmIDB4ODgpIGJyZWFrXG5cbiAgICAgICAgICAgIGlmIChib2FyZFtzcXVhcmVdID09IG51bGwpIHtcbiAgICAgICAgICAgICAgYWRkX21vdmUoYm9hcmQsIG1vdmVzLCBpLCBzcXVhcmUsIEJJVFMuTk9STUFMKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKGJvYXJkW3NxdWFyZV0uY29sb3IgPT09IHVzKSBicmVha1xuICAgICAgICAgICAgICBhZGRfbW92ZShib2FyZCwgbW92ZXMsIGksIHNxdWFyZSwgQklUUy5DQVBUVVJFKVxuICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiBicmVhaywgaWYga25pZ2h0IG9yIGtpbmcgKi9cbiAgICAgICAgICAgIGlmIChwaWVjZS50eXBlID09PSAnbicgfHwgcGllY2UudHlwZSA9PT0gJ2snKSBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qIGNoZWNrIGZvciBjYXN0bGluZyBpZjogYSkgd2UncmUgZ2VuZXJhdGluZyBhbGwgbW92ZXMsIG9yIGIpIHdlJ3JlIGRvaW5nXG4gICAgICogc2luZ2xlIHNxdWFyZSBtb3ZlIGdlbmVyYXRpb24gb24gdGhlIGtpbmcncyBzcXVhcmVcbiAgICAgKi9cbiAgICBpZiAocGllY2VfdHlwZSA9PT0gdHJ1ZSB8fCBwaWVjZV90eXBlID09PSBLSU5HKSB7XG4gICAgICBpZiAoIXNpbmdsZV9zcXVhcmUgfHwgbGFzdF9zcSA9PT0ga2luZ3NbdXNdKSB7XG4gICAgICAgIC8qIGtpbmctc2lkZSBjYXN0bGluZyAqL1xuICAgICAgICBpZiAoY2FzdGxpbmdbdXNdICYgQklUUy5LU0lERV9DQVNUTEUpIHtcbiAgICAgICAgICB2YXIgY2FzdGxpbmdfZnJvbSA9IGtpbmdzW3VzXVxuICAgICAgICAgIHZhciBjYXN0bGluZ190byA9IGNhc3RsaW5nX2Zyb20gKyAyXG5cbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBib2FyZFtjYXN0bGluZ19mcm9tICsgMV0gPT0gbnVsbCAmJlxuICAgICAgICAgICAgYm9hcmRbY2FzdGxpbmdfdG9dID09IG51bGwgJiZcbiAgICAgICAgICAgICFhdHRhY2tlZCh0aGVtLCBraW5nc1t1c10pICYmXG4gICAgICAgICAgICAhYXR0YWNrZWQodGhlbSwgY2FzdGxpbmdfZnJvbSArIDEpICYmXG4gICAgICAgICAgICAhYXR0YWNrZWQodGhlbSwgY2FzdGxpbmdfdG8pXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBhZGRfbW92ZShib2FyZCwgbW92ZXMsIGtpbmdzW3VzXSwgY2FzdGxpbmdfdG8sIEJJVFMuS1NJREVfQ0FTVExFKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qIHF1ZWVuLXNpZGUgY2FzdGxpbmcgKi9cbiAgICAgICAgaWYgKGNhc3RsaW5nW3VzXSAmIEJJVFMuUVNJREVfQ0FTVExFKSB7XG4gICAgICAgICAgdmFyIGNhc3RsaW5nX2Zyb20gPSBraW5nc1t1c11cbiAgICAgICAgICB2YXIgY2FzdGxpbmdfdG8gPSBjYXN0bGluZ19mcm9tIC0gMlxuXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgYm9hcmRbY2FzdGxpbmdfZnJvbSAtIDFdID09IG51bGwgJiZcbiAgICAgICAgICAgIGJvYXJkW2Nhc3RsaW5nX2Zyb20gLSAyXSA9PSBudWxsICYmXG4gICAgICAgICAgICBib2FyZFtjYXN0bGluZ19mcm9tIC0gM10gPT0gbnVsbCAmJlxuICAgICAgICAgICAgIWF0dGFja2VkKHRoZW0sIGtpbmdzW3VzXSkgJiZcbiAgICAgICAgICAgICFhdHRhY2tlZCh0aGVtLCBjYXN0bGluZ19mcm9tIC0gMSkgJiZcbiAgICAgICAgICAgICFhdHRhY2tlZCh0aGVtLCBjYXN0bGluZ190bylcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGFkZF9tb3ZlKGJvYXJkLCBtb3Zlcywga2luZ3NbdXNdLCBjYXN0bGluZ190bywgQklUUy5RU0lERV9DQVNUTEUpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyogcmV0dXJuIGFsbCBwc2V1ZG8tbGVnYWwgbW92ZXMgKHRoaXMgaW5jbHVkZXMgbW92ZXMgdGhhdCBhbGxvdyB0aGUga2luZ1xuICAgICAqIHRvIGJlIGNhcHR1cmVkKVxuICAgICAqL1xuICAgIGlmICghbGVnYWwpIHtcbiAgICAgIHJldHVybiBtb3Zlc1xuICAgIH1cblxuICAgIC8qIGZpbHRlciBvdXQgaWxsZWdhbCBtb3ZlcyAqL1xuICAgIHZhciBsZWdhbF9tb3ZlcyA9IFtdXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IG1vdmVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBtYWtlX21vdmUobW92ZXNbaV0pXG4gICAgICBpZiAoIWtpbmdfYXR0YWNrZWQodXMpKSB7XG4gICAgICAgIGxlZ2FsX21vdmVzLnB1c2gobW92ZXNbaV0pXG4gICAgICB9XG4gICAgICB1bmRvX21vdmUoKVxuICAgIH1cblxuICAgIHJldHVybiBsZWdhbF9tb3Zlc1xuICB9XG5cbiAgLyogY29udmVydCBhIG1vdmUgZnJvbSAweDg4IGNvb3JkaW5hdGVzIHRvIFN0YW5kYXJkIEFsZ2VicmFpYyBOb3RhdGlvblxuICAgKiAoU0FOKVxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHNsb3BweSBVc2UgdGhlIHNsb3BweSBTQU4gZ2VuZXJhdG9yIHRvIHdvcmsgYXJvdW5kIG92ZXJcbiAgICogZGlzYW1iaWd1YXRpb24gYnVncyBpbiBGcml0eiBhbmQgQ2hlc3NiYXNlLiAgU2VlIGJlbG93OlxuICAgKlxuICAgKiByMWJxa2Juci9wcHAycHBwLzJuNS8xQjFwUDMvNFAzLzgvUFBQUDJQUC9STkJRSzFOUiBiIEtRa3EgLSAyIDRcbiAgICogNC4gLi4uIE5nZTcgaXMgb3Zlcmx5IGRpc2FtYmlndWF0ZWQgYmVjYXVzZSB0aGUga25pZ2h0IG9uIGM2IGlzIHBpbm5lZFxuICAgKiA0LiAuLi4gTmU3IGlzIHRlY2huaWNhbGx5IHRoZSB2YWxpZCBTQU5cbiAgICovXG4gIGZ1bmN0aW9uIG1vdmVfdG9fc2FuKG1vdmUsIG1vdmVzKSB7XG4gICAgdmFyIG91dHB1dCA9ICcnXG5cbiAgICBpZiAobW92ZS5mbGFncyAmIEJJVFMuS1NJREVfQ0FTVExFKSB7XG4gICAgICBvdXRwdXQgPSAnTy1PJ1xuICAgIH0gZWxzZSBpZiAobW92ZS5mbGFncyAmIEJJVFMuUVNJREVfQ0FTVExFKSB7XG4gICAgICBvdXRwdXQgPSAnTy1PLU8nXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChtb3ZlLnBpZWNlICE9PSBQQVdOKSB7XG4gICAgICAgIHZhciBkaXNhbWJpZ3VhdG9yID0gZ2V0X2Rpc2FtYmlndWF0b3IobW92ZSwgbW92ZXMpXG4gICAgICAgIG91dHB1dCArPSBtb3ZlLnBpZWNlLnRvVXBwZXJDYXNlKCkgKyBkaXNhbWJpZ3VhdG9yXG4gICAgICB9XG5cbiAgICAgIGlmIChtb3ZlLmZsYWdzICYgKEJJVFMuQ0FQVFVSRSB8IEJJVFMuRVBfQ0FQVFVSRSkpIHtcbiAgICAgICAgaWYgKG1vdmUucGllY2UgPT09IFBBV04pIHtcbiAgICAgICAgICBvdXRwdXQgKz0gYWxnZWJyYWljKG1vdmUuZnJvbSlbMF1cbiAgICAgICAgfVxuICAgICAgICBvdXRwdXQgKz0gJ3gnXG4gICAgICB9XG5cbiAgICAgIG91dHB1dCArPSBhbGdlYnJhaWMobW92ZS50bylcblxuICAgICAgaWYgKG1vdmUuZmxhZ3MgJiBCSVRTLlBST01PVElPTikge1xuICAgICAgICBvdXRwdXQgKz0gJz0nICsgbW92ZS5wcm9tb3Rpb24udG9VcHBlckNhc2UoKVxuICAgICAgfVxuICAgIH1cblxuICAgIG1ha2VfbW92ZShtb3ZlKVxuICAgIGlmIChpbl9jaGVjaygpKSB7XG4gICAgICBpZiAoaW5fY2hlY2ttYXRlKCkpIHtcbiAgICAgICAgb3V0cHV0ICs9ICcjJ1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0cHV0ICs9ICcrJ1xuICAgICAgfVxuICAgIH1cbiAgICB1bmRvX21vdmUoKVxuXG4gICAgcmV0dXJuIG91dHB1dFxuICB9XG4gIC8vIHBhcnNlcyBhbGwgb2YgdGhlIGRlY29yYXRvcnMgb3V0IG9mIGEgU0FOIHN0cmluZ1xuICBmdW5jdGlvbiBzdHJpcHBlZF9zYW4obW92ZSkge1xuICAgIHJldHVybiBtb3ZlLnJlcGxhY2UoLz0vLCAnJykucmVwbGFjZSgvWysjXT9bPyFdKiQvLCAnJylcbiAgfVxuXG4gIGZ1bmN0aW9uIGF0dGFja2VkKGNvbG9yLCBzcXVhcmUpIHtcbiAgICBmb3IgKHZhciBpID0gU1FVQVJFUy5hODsgaSA8PSBTUVVBUkVTLmgxOyBpKyspIHtcbiAgICAgIC8qIGRpZCB3ZSBydW4gb2ZmIHRoZSBlbmQgb2YgdGhlIGJvYXJkICovXG4gICAgICBpZiAoaSAmIDB4ODgpIHtcbiAgICAgICAgaSArPSA3XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8qIGlmIGVtcHR5IHNxdWFyZSBvciB3cm9uZyBjb2xvciAqL1xuICAgICAgaWYgKGJvYXJkW2ldID09IG51bGwgfHwgYm9hcmRbaV0uY29sb3IgIT09IGNvbG9yKSBjb250aW51ZVxuXG4gICAgICB2YXIgcGllY2UgPSBib2FyZFtpXVxuICAgICAgdmFyIGRpZmZlcmVuY2UgPSBpIC0gc3F1YXJlXG4gICAgICB2YXIgaW5kZXggPSBkaWZmZXJlbmNlICsgMTE5XG5cbiAgICAgIGlmIChBVFRBQ0tTW2luZGV4XSAmICgxIDw8IFNISUZUU1twaWVjZS50eXBlXSkpIHtcbiAgICAgICAgaWYgKHBpZWNlLnR5cGUgPT09IFBBV04pIHtcbiAgICAgICAgICBpZiAoZGlmZmVyZW5jZSA+IDApIHtcbiAgICAgICAgICAgIGlmIChwaWVjZS5jb2xvciA9PT0gV0hJVEUpIHJldHVybiB0cnVlXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChwaWVjZS5jb2xvciA9PT0gQkxBQ0spIHJldHVybiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICAvKiBpZiB0aGUgcGllY2UgaXMgYSBrbmlnaHQgb3IgYSBraW5nICovXG4gICAgICAgIGlmIChwaWVjZS50eXBlID09PSAnbicgfHwgcGllY2UudHlwZSA9PT0gJ2snKSByZXR1cm4gdHJ1ZVxuXG4gICAgICAgIHZhciBvZmZzZXQgPSBSQVlTW2luZGV4XVxuICAgICAgICB2YXIgaiA9IGkgKyBvZmZzZXRcblxuICAgICAgICB2YXIgYmxvY2tlZCA9IGZhbHNlXG4gICAgICAgIHdoaWxlIChqICE9PSBzcXVhcmUpIHtcbiAgICAgICAgICBpZiAoYm9hcmRbal0gIT0gbnVsbCkge1xuICAgICAgICAgICAgYmxvY2tlZCA9IHRydWVcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgfVxuICAgICAgICAgIGogKz0gb2Zmc2V0XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWJsb2NrZWQpIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBmdW5jdGlvbiBraW5nX2F0dGFja2VkKGNvbG9yKSB7XG4gICAgcmV0dXJuIGF0dGFja2VkKHN3YXBfY29sb3IoY29sb3IpLCBraW5nc1tjb2xvcl0pXG4gIH1cblxuICBmdW5jdGlvbiBpbl9jaGVjaygpIHtcbiAgICByZXR1cm4ga2luZ19hdHRhY2tlZCh0dXJuKVxuICB9XG5cbiAgZnVuY3Rpb24gaW5fY2hlY2ttYXRlKCkge1xuICAgIHJldHVybiBpbl9jaGVjaygpICYmIGdlbmVyYXRlX21vdmVzKCkubGVuZ3RoID09PSAwXG4gIH1cblxuICBmdW5jdGlvbiBpbl9zdGFsZW1hdGUoKSB7XG4gICAgcmV0dXJuICFpbl9jaGVjaygpICYmIGdlbmVyYXRlX21vdmVzKCkubGVuZ3RoID09PSAwXG4gIH1cblxuICBmdW5jdGlvbiBpbnN1ZmZpY2llbnRfbWF0ZXJpYWwoKSB7XG4gICAgdmFyIHBpZWNlcyA9IHt9XG4gICAgdmFyIGJpc2hvcHMgPSBbXVxuICAgIHZhciBudW1fcGllY2VzID0gMFxuICAgIHZhciBzcV9jb2xvciA9IDBcblxuICAgIGZvciAodmFyIGkgPSBTUVVBUkVTLmE4OyBpIDw9IFNRVUFSRVMuaDE7IGkrKykge1xuICAgICAgc3FfY29sb3IgPSAoc3FfY29sb3IgKyAxKSAlIDJcbiAgICAgIGlmIChpICYgMHg4OCkge1xuICAgICAgICBpICs9IDdcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgdmFyIHBpZWNlID0gYm9hcmRbaV1cbiAgICAgIGlmIChwaWVjZSkge1xuICAgICAgICBwaWVjZXNbcGllY2UudHlwZV0gPSBwaWVjZS50eXBlIGluIHBpZWNlcyA/IHBpZWNlc1twaWVjZS50eXBlXSArIDEgOiAxXG4gICAgICAgIGlmIChwaWVjZS50eXBlID09PSBCSVNIT1ApIHtcbiAgICAgICAgICBiaXNob3BzLnB1c2goc3FfY29sb3IpXG4gICAgICAgIH1cbiAgICAgICAgbnVtX3BpZWNlcysrXG4gICAgICB9XG4gICAgfVxuXG4gICAgLyogayB2cy4gayAqL1xuICAgIGlmIChudW1fcGllY2VzID09PSAyKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0gZWxzZSBpZiAoXG4gICAgICAvKiBrIHZzLiBrbiAuLi4uIG9yIC4uLi4gayB2cy4ga2IgKi9cbiAgICAgIG51bV9waWVjZXMgPT09IDMgJiZcbiAgICAgIChwaWVjZXNbQklTSE9QXSA9PT0gMSB8fCBwaWVjZXNbS05JR0hUXSA9PT0gMSlcbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfSBlbHNlIGlmIChudW1fcGllY2VzID09PSBwaWVjZXNbQklTSE9QXSArIDIpIHtcbiAgICAgIC8qIGtiIHZzLiBrYiB3aGVyZSBhbnkgbnVtYmVyIG9mIGJpc2hvcHMgYXJlIGFsbCBvbiB0aGUgc2FtZSBjb2xvciAqL1xuICAgICAgdmFyIHN1bSA9IDBcbiAgICAgIHZhciBsZW4gPSBiaXNob3BzLmxlbmd0aFxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBzdW0gKz0gYmlzaG9wc1tpXVxuICAgICAgfVxuICAgICAgaWYgKHN1bSA9PT0gMCB8fCBzdW0gPT09IGxlbikge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgZnVuY3Rpb24gaW5fdGhyZWVmb2xkX3JlcGV0aXRpb24oKSB7XG4gICAgLyogVE9ETzogd2hpbGUgdGhpcyBmdW5jdGlvbiBpcyBmaW5lIGZvciBjYXN1YWwgdXNlLCBhIGJldHRlclxuICAgICAqIGltcGxlbWVudGF0aW9uIHdvdWxkIHVzZSBhIFpvYnJpc3Qga2V5IChpbnN0ZWFkIG9mIEZFTikuIHRoZVxuICAgICAqIFpvYnJpc3Qga2V5IHdvdWxkIGJlIG1haW50YWluZWQgaW4gdGhlIG1ha2VfbW92ZS91bmRvX21vdmUgZnVuY3Rpb25zLFxuICAgICAqIGF2b2lkaW5nIHRoZSBjb3N0bHkgdGhhdCB3ZSBkbyBiZWxvdy5cbiAgICAgKi9cbiAgICB2YXIgbW92ZXMgPSBbXVxuICAgIHZhciBwb3NpdGlvbnMgPSB7fVxuICAgIHZhciByZXBldGl0aW9uID0gZmFsc2VcblxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICB2YXIgbW92ZSA9IHVuZG9fbW92ZSgpXG4gICAgICBpZiAoIW1vdmUpIGJyZWFrXG4gICAgICBtb3Zlcy5wdXNoKG1vdmUpXG4gICAgfVxuXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIC8qIHJlbW92ZSB0aGUgbGFzdCB0d28gZmllbGRzIGluIHRoZSBGRU4gc3RyaW5nLCB0aGV5J3JlIG5vdCBuZWVkZWRcbiAgICAgICAqIHdoZW4gY2hlY2tpbmcgZm9yIGRyYXcgYnkgcmVwICovXG4gICAgICB2YXIgZmVuID0gZ2VuZXJhdGVfZmVuKCkuc3BsaXQoJyAnKS5zbGljZSgwLCA0KS5qb2luKCcgJylcblxuICAgICAgLyogaGFzIHRoZSBwb3NpdGlvbiBvY2N1cnJlZCB0aHJlZSBvciBtb3ZlIHRpbWVzICovXG4gICAgICBwb3NpdGlvbnNbZmVuXSA9IGZlbiBpbiBwb3NpdGlvbnMgPyBwb3NpdGlvbnNbZmVuXSArIDEgOiAxXG4gICAgICBpZiAocG9zaXRpb25zW2Zlbl0gPj0gMykge1xuICAgICAgICByZXBldGl0aW9uID0gdHJ1ZVxuICAgICAgfVxuXG4gICAgICBpZiAoIW1vdmVzLmxlbmd0aCkge1xuICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgbWFrZV9tb3ZlKG1vdmVzLnBvcCgpKVxuICAgIH1cblxuICAgIHJldHVybiByZXBldGl0aW9uXG4gIH1cblxuICBmdW5jdGlvbiBwdXNoKG1vdmUpIHtcbiAgICBoaXN0b3J5LnB1c2goe1xuICAgICAgbW92ZTogbW92ZSxcbiAgICAgIGtpbmdzOiB7IGI6IGtpbmdzLmIsIHc6IGtpbmdzLncgfSxcbiAgICAgIHR1cm46IHR1cm4sXG4gICAgICBjYXN0bGluZzogeyBiOiBjYXN0bGluZy5iLCB3OiBjYXN0bGluZy53IH0sXG4gICAgICBlcF9zcXVhcmU6IGVwX3NxdWFyZSxcbiAgICAgIGhhbGZfbW92ZXM6IGhhbGZfbW92ZXMsXG4gICAgICBtb3ZlX251bWJlcjogbW92ZV9udW1iZXIsXG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIG1ha2VfbW92ZShtb3ZlKSB7XG4gICAgdmFyIHVzID0gdHVyblxuICAgIHZhciB0aGVtID0gc3dhcF9jb2xvcih1cylcbiAgICBwdXNoKG1vdmUpXG5cbiAgICBib2FyZFttb3ZlLnRvXSA9IGJvYXJkW21vdmUuZnJvbV1cbiAgICBib2FyZFttb3ZlLmZyb21dID0gbnVsbFxuXG4gICAgLyogaWYgZXAgY2FwdHVyZSwgcmVtb3ZlIHRoZSBjYXB0dXJlZCBwYXduICovXG4gICAgaWYgKG1vdmUuZmxhZ3MgJiBCSVRTLkVQX0NBUFRVUkUpIHtcbiAgICAgIGlmICh0dXJuID09PSBCTEFDSykge1xuICAgICAgICBib2FyZFttb3ZlLnRvIC0gMTZdID0gbnVsbFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYm9hcmRbbW92ZS50byArIDE2XSA9IG51bGxcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiBpZiBwYXduIHByb21vdGlvbiwgcmVwbGFjZSB3aXRoIG5ldyBwaWVjZSAqL1xuICAgIGlmIChtb3ZlLmZsYWdzICYgQklUUy5QUk9NT1RJT04pIHtcbiAgICAgIGJvYXJkW21vdmUudG9dID0geyB0eXBlOiBtb3ZlLnByb21vdGlvbiwgY29sb3I6IHVzIH1cbiAgICB9XG5cbiAgICAvKiBpZiB3ZSBtb3ZlZCB0aGUga2luZyAqL1xuICAgIGlmIChib2FyZFttb3ZlLnRvXS50eXBlID09PSBLSU5HKSB7XG4gICAgICBraW5nc1tib2FyZFttb3ZlLnRvXS5jb2xvcl0gPSBtb3ZlLnRvXG5cbiAgICAgIC8qIGlmIHdlIGNhc3RsZWQsIG1vdmUgdGhlIHJvb2sgbmV4dCB0byB0aGUga2luZyAqL1xuICAgICAgaWYgKG1vdmUuZmxhZ3MgJiBCSVRTLktTSURFX0NBU1RMRSkge1xuICAgICAgICB2YXIgY2FzdGxpbmdfdG8gPSBtb3ZlLnRvIC0gMVxuICAgICAgICB2YXIgY2FzdGxpbmdfZnJvbSA9IG1vdmUudG8gKyAxXG4gICAgICAgIGJvYXJkW2Nhc3RsaW5nX3RvXSA9IGJvYXJkW2Nhc3RsaW5nX2Zyb21dXG4gICAgICAgIGJvYXJkW2Nhc3RsaW5nX2Zyb21dID0gbnVsbFxuICAgICAgfSBlbHNlIGlmIChtb3ZlLmZsYWdzICYgQklUUy5RU0lERV9DQVNUTEUpIHtcbiAgICAgICAgdmFyIGNhc3RsaW5nX3RvID0gbW92ZS50byArIDFcbiAgICAgICAgdmFyIGNhc3RsaW5nX2Zyb20gPSBtb3ZlLnRvIC0gMlxuICAgICAgICBib2FyZFtjYXN0bGluZ190b10gPSBib2FyZFtjYXN0bGluZ19mcm9tXVxuICAgICAgICBib2FyZFtjYXN0bGluZ19mcm9tXSA9IG51bGxcbiAgICAgIH1cblxuICAgICAgLyogdHVybiBvZmYgY2FzdGxpbmcgKi9cbiAgICAgIGNhc3RsaW5nW3VzXSA9ICcnXG4gICAgfVxuXG4gICAgLyogdHVybiBvZmYgY2FzdGxpbmcgaWYgd2UgbW92ZSBhIHJvb2sgKi9cbiAgICBpZiAoY2FzdGxpbmdbdXNdKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gUk9PS1NbdXNdLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBtb3ZlLmZyb20gPT09IFJPT0tTW3VzXVtpXS5zcXVhcmUgJiZcbiAgICAgICAgICBjYXN0bGluZ1t1c10gJiBST09LU1t1c11baV0uZmxhZ1xuICAgICAgICApIHtcbiAgICAgICAgICBjYXN0bGluZ1t1c10gXj0gUk9PS1NbdXNdW2ldLmZsYWdcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyogdHVybiBvZmYgY2FzdGxpbmcgaWYgd2UgY2FwdHVyZSBhIHJvb2sgKi9cbiAgICBpZiAoY2FzdGxpbmdbdGhlbV0pIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBST09LU1t0aGVtXS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgbW92ZS50byA9PT0gUk9PS1NbdGhlbV1baV0uc3F1YXJlICYmXG4gICAgICAgICAgY2FzdGxpbmdbdGhlbV0gJiBST09LU1t0aGVtXVtpXS5mbGFnXG4gICAgICAgICkge1xuICAgICAgICAgIGNhc3RsaW5nW3RoZW1dIF49IFJPT0tTW3RoZW1dW2ldLmZsYWdcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyogaWYgYmlnIHBhd24gbW92ZSwgdXBkYXRlIHRoZSBlbiBwYXNzYW50IHNxdWFyZSAqL1xuICAgIGlmIChtb3ZlLmZsYWdzICYgQklUUy5CSUdfUEFXTikge1xuICAgICAgaWYgKHR1cm4gPT09ICdiJykge1xuICAgICAgICBlcF9zcXVhcmUgPSBtb3ZlLnRvIC0gMTZcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVwX3NxdWFyZSA9IG1vdmUudG8gKyAxNlxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBlcF9zcXVhcmUgPSBFTVBUWVxuICAgIH1cblxuICAgIC8qIHJlc2V0IHRoZSA1MCBtb3ZlIGNvdW50ZXIgaWYgYSBwYXduIGlzIG1vdmVkIG9yIGEgcGllY2UgaXMgY2FwdHVyZWQgKi9cbiAgICBpZiAobW92ZS5waWVjZSA9PT0gUEFXTikge1xuICAgICAgaGFsZl9tb3ZlcyA9IDBcbiAgICB9IGVsc2UgaWYgKG1vdmUuZmxhZ3MgJiAoQklUUy5DQVBUVVJFIHwgQklUUy5FUF9DQVBUVVJFKSkge1xuICAgICAgaGFsZl9tb3ZlcyA9IDBcbiAgICB9IGVsc2Uge1xuICAgICAgaGFsZl9tb3ZlcysrXG4gICAgfVxuXG4gICAgaWYgKHR1cm4gPT09IEJMQUNLKSB7XG4gICAgICBtb3ZlX251bWJlcisrXG4gICAgfVxuICAgIHR1cm4gPSBzd2FwX2NvbG9yKHR1cm4pXG4gIH1cblxuICBmdW5jdGlvbiB1bmRvX21vdmUoKSB7XG4gICAgdmFyIG9sZCA9IGhpc3RvcnkucG9wKClcbiAgICBpZiAob2xkID09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgdmFyIG1vdmUgPSBvbGQubW92ZVxuICAgIGtpbmdzID0gb2xkLmtpbmdzXG4gICAgdHVybiA9IG9sZC50dXJuXG4gICAgY2FzdGxpbmcgPSBvbGQuY2FzdGxpbmdcbiAgICBlcF9zcXVhcmUgPSBvbGQuZXBfc3F1YXJlXG4gICAgaGFsZl9tb3ZlcyA9IG9sZC5oYWxmX21vdmVzXG4gICAgbW92ZV9udW1iZXIgPSBvbGQubW92ZV9udW1iZXJcblxuICAgIHZhciB1cyA9IHR1cm5cbiAgICB2YXIgdGhlbSA9IHN3YXBfY29sb3IodHVybilcblxuICAgIGJvYXJkW21vdmUuZnJvbV0gPSBib2FyZFttb3ZlLnRvXVxuICAgIGJvYXJkW21vdmUuZnJvbV0udHlwZSA9IG1vdmUucGllY2UgLy8gdG8gdW5kbyBhbnkgcHJvbW90aW9uc1xuICAgIGJvYXJkW21vdmUudG9dID0gbnVsbFxuXG4gICAgaWYgKG1vdmUuZmxhZ3MgJiBCSVRTLkNBUFRVUkUpIHtcbiAgICAgIGJvYXJkW21vdmUudG9dID0geyB0eXBlOiBtb3ZlLmNhcHR1cmVkLCBjb2xvcjogdGhlbSB9XG4gICAgfSBlbHNlIGlmIChtb3ZlLmZsYWdzICYgQklUUy5FUF9DQVBUVVJFKSB7XG4gICAgICB2YXIgaW5kZXhcbiAgICAgIGlmICh1cyA9PT0gQkxBQ0spIHtcbiAgICAgICAgaW5kZXggPSBtb3ZlLnRvIC0gMTZcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluZGV4ID0gbW92ZS50byArIDE2XG4gICAgICB9XG4gICAgICBib2FyZFtpbmRleF0gPSB7IHR5cGU6IFBBV04sIGNvbG9yOiB0aGVtIH1cbiAgICB9XG5cbiAgICBpZiAobW92ZS5mbGFncyAmIChCSVRTLktTSURFX0NBU1RMRSB8IEJJVFMuUVNJREVfQ0FTVExFKSkge1xuICAgICAgdmFyIGNhc3RsaW5nX3RvLCBjYXN0bGluZ19mcm9tXG4gICAgICBpZiAobW92ZS5mbGFncyAmIEJJVFMuS1NJREVfQ0FTVExFKSB7XG4gICAgICAgIGNhc3RsaW5nX3RvID0gbW92ZS50byArIDFcbiAgICAgICAgY2FzdGxpbmdfZnJvbSA9IG1vdmUudG8gLSAxXG4gICAgICB9IGVsc2UgaWYgKG1vdmUuZmxhZ3MgJiBCSVRTLlFTSURFX0NBU1RMRSkge1xuICAgICAgICBjYXN0bGluZ190byA9IG1vdmUudG8gLSAyXG4gICAgICAgIGNhc3RsaW5nX2Zyb20gPSBtb3ZlLnRvICsgMVxuICAgICAgfVxuXG4gICAgICBib2FyZFtjYXN0bGluZ190b10gPSBib2FyZFtjYXN0bGluZ19mcm9tXVxuICAgICAgYm9hcmRbY2FzdGxpbmdfZnJvbV0gPSBudWxsXG4gICAgfVxuXG4gICAgcmV0dXJuIG1vdmVcbiAgfVxuXG4gIC8qIHRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byB1bmlxdWVseSBpZGVudGlmeSBhbWJpZ3VvdXMgbW92ZXMgKi9cbiAgZnVuY3Rpb24gZ2V0X2Rpc2FtYmlndWF0b3IobW92ZSwgbW92ZXMpIHtcbiAgICB2YXIgZnJvbSA9IG1vdmUuZnJvbVxuICAgIHZhciB0byA9IG1vdmUudG9cbiAgICB2YXIgcGllY2UgPSBtb3ZlLnBpZWNlXG5cbiAgICB2YXIgYW1iaWd1aXRpZXMgPSAwXG4gICAgdmFyIHNhbWVfcmFuayA9IDBcbiAgICB2YXIgc2FtZV9maWxlID0gMFxuXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IG1vdmVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB2YXIgYW1iaWdfZnJvbSA9IG1vdmVzW2ldLmZyb21cbiAgICAgIHZhciBhbWJpZ190byA9IG1vdmVzW2ldLnRvXG4gICAgICB2YXIgYW1iaWdfcGllY2UgPSBtb3Zlc1tpXS5waWVjZVxuXG4gICAgICAvKiBpZiBhIG1vdmUgb2YgdGhlIHNhbWUgcGllY2UgdHlwZSBlbmRzIG9uIHRoZSBzYW1lIHRvIHNxdWFyZSwgd2UnbGxcbiAgICAgICAqIG5lZWQgdG8gYWRkIGEgZGlzYW1iaWd1YXRvciB0byB0aGUgYWxnZWJyYWljIG5vdGF0aW9uXG4gICAgICAgKi9cbiAgICAgIGlmIChwaWVjZSA9PT0gYW1iaWdfcGllY2UgJiYgZnJvbSAhPT0gYW1iaWdfZnJvbSAmJiB0byA9PT0gYW1iaWdfdG8pIHtcbiAgICAgICAgYW1iaWd1aXRpZXMrK1xuXG4gICAgICAgIGlmIChyYW5rKGZyb20pID09PSByYW5rKGFtYmlnX2Zyb20pKSB7XG4gICAgICAgICAgc2FtZV9yYW5rKytcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmaWxlKGZyb20pID09PSBmaWxlKGFtYmlnX2Zyb20pKSB7XG4gICAgICAgICAgc2FtZV9maWxlKytcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChhbWJpZ3VpdGllcyA+IDApIHtcbiAgICAgIC8qIGlmIHRoZXJlIGV4aXN0cyBhIHNpbWlsYXIgbW92aW5nIHBpZWNlIG9uIHRoZSBzYW1lIHJhbmsgYW5kIGZpbGUgYXNcbiAgICAgICAqIHRoZSBtb3ZlIGluIHF1ZXN0aW9uLCB1c2UgdGhlIHNxdWFyZSBhcyB0aGUgZGlzYW1iaWd1YXRvclxuICAgICAgICovXG4gICAgICBpZiAoc2FtZV9yYW5rID4gMCAmJiBzYW1lX2ZpbGUgPiAwKSB7XG4gICAgICAgIHJldHVybiBhbGdlYnJhaWMoZnJvbSlcbiAgICAgIH0gZWxzZSBpZiAoc2FtZV9maWxlID4gMCkge1xuICAgICAgICAvKiBpZiB0aGUgbW92aW5nIHBpZWNlIHJlc3RzIG9uIHRoZSBzYW1lIGZpbGUsIHVzZSB0aGUgcmFuayBzeW1ib2wgYXMgdGhlXG4gICAgICAgICAqIGRpc2FtYmlndWF0b3JcbiAgICAgICAgICovXG4gICAgICAgIHJldHVybiBhbGdlYnJhaWMoZnJvbSkuY2hhckF0KDEpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvKiBlbHNlIHVzZSB0aGUgZmlsZSBzeW1ib2wgKi9cbiAgICAgICAgcmV0dXJuIGFsZ2VicmFpYyhmcm9tKS5jaGFyQXQoMClcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIGZ1bmN0aW9uIGluZmVyX3BpZWNlX3R5cGUoc2FuKSB7XG4gICAgdmFyIHBpZWNlX3R5cGUgPSBzYW4uY2hhckF0KDApXG4gICAgaWYgKHBpZWNlX3R5cGUgPj0gJ2EnICYmIHBpZWNlX3R5cGUgPD0gJ2gnKSB7XG4gICAgICB2YXIgbWF0Y2hlcyA9IHNhbi5tYXRjaCgvW2EtaF1cXGQuKlthLWhdXFxkLylcbiAgICAgIGlmIChtYXRjaGVzKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgIH1cbiAgICAgIHJldHVybiBQQVdOXG4gICAgfVxuICAgIHBpZWNlX3R5cGUgPSBwaWVjZV90eXBlLnRvTG93ZXJDYXNlKClcbiAgICBpZiAocGllY2VfdHlwZSA9PT0gJ28nKSB7XG4gICAgICByZXR1cm4gS0lOR1xuICAgIH1cbiAgICByZXR1cm4gcGllY2VfdHlwZVxuICB9XG4gIGZ1bmN0aW9uIGFzY2lpKCkge1xuICAgIHZhciBzID0gJyAgICstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXFxuJ1xuICAgIGZvciAodmFyIGkgPSBTUVVBUkVTLmE4OyBpIDw9IFNRVUFSRVMuaDE7IGkrKykge1xuICAgICAgLyogZGlzcGxheSB0aGUgcmFuayAqL1xuICAgICAgaWYgKGZpbGUoaSkgPT09IDApIHtcbiAgICAgICAgcyArPSAnICcgKyAnODc2NTQzMjEnW3JhbmsoaSldICsgJyB8J1xuICAgICAgfVxuXG4gICAgICAvKiBlbXB0eSBwaWVjZSAqL1xuICAgICAgaWYgKGJvYXJkW2ldID09IG51bGwpIHtcbiAgICAgICAgcyArPSAnIC4gJ1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHBpZWNlID0gYm9hcmRbaV0udHlwZVxuICAgICAgICB2YXIgY29sb3IgPSBib2FyZFtpXS5jb2xvclxuICAgICAgICB2YXIgc3ltYm9sID0gY29sb3IgPT09IFdISVRFID8gcGllY2UudG9VcHBlckNhc2UoKSA6IHBpZWNlLnRvTG93ZXJDYXNlKClcbiAgICAgICAgcyArPSAnICcgKyBzeW1ib2wgKyAnICdcbiAgICAgIH1cblxuICAgICAgaWYgKChpICsgMSkgJiAweDg4KSB7XG4gICAgICAgIHMgKz0gJ3xcXG4nXG4gICAgICAgIGkgKz0gOFxuICAgICAgfVxuICAgIH1cbiAgICBzICs9ICcgICArLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xcbidcbiAgICBzICs9ICcgICAgIGEgIGIgIGMgIGQgIGUgIGYgIGcgIGhcXG4nXG5cbiAgICByZXR1cm4gc1xuICB9XG5cbiAgLy8gY29udmVydCBhIG1vdmUgZnJvbSBTdGFuZGFyZCBBbGdlYnJhaWMgTm90YXRpb24gKFNBTikgdG8gMHg4OCBjb29yZGluYXRlc1xuICBmdW5jdGlvbiBtb3ZlX2Zyb21fc2FuKG1vdmUsIHNsb3BweSkge1xuICAgIC8vIHN0cmlwIG9mZiBhbnkgbW92ZSBkZWNvcmF0aW9uczogZS5nIE5mMys/ISBiZWNvbWVzIE5mM1xuICAgIHZhciBjbGVhbl9tb3ZlID0gc3RyaXBwZWRfc2FuKG1vdmUpXG5cbiAgICB2YXIgb3Zlcmx5X2Rpc2FtYmlndWF0ZWQgPSBmYWxzZVxuXG4gICAgaWYgKHNsb3BweSkge1xuICAgICAgLy8gVGhlIHNsb3BweSBwYXJzZXIgYWxsb3dzIHRoZSB1c2VyIHRvIHBhcnNlIG5vbi1zdGFuZGFyZCBjaGVzc1xuICAgICAgLy8gbm90YXRpb25zLiBUaGlzIHBhcnNlciBpcyBvcHQtaW4gKGJ5IHNwZWNpZnlpbmcgdGhlXG4gICAgICAvLyAneyBzbG9wcHk6IHRydWUgfScgc2V0dGluZykgYW5kIGlzIG9ubHkgcnVuIGFmdGVyIHRoZSBTdGFuZGFyZFxuICAgICAgLy8gQWxnZWJyYWljIE5vdGF0aW9uIChTQU4pIHBhcnNlciBoYXMgZmFpbGVkLlxuICAgICAgLy9cbiAgICAgIC8vIFdoZW4gcnVubmluZyB0aGUgc2xvcHB5IHBhcnNlciwgd2UnbGwgcnVuIGEgcmVnZXggdG8gZ3JhYiB0aGUgcGllY2UsXG4gICAgICAvLyB0aGUgdG8vZnJvbSBzcXVhcmUsIGFuZCBhbiBvcHRpb25hbCBwcm9tb3Rpb24gcGllY2UuIFRoaXMgcmVnZXggd2lsbFxuICAgICAgLy8gcGFyc2UgY29tbW9uIG5vbi1zdGFuZGFyZCBub3RhdGlvbiBsaWtlOiBQZTItZTQsIFJjMWM0LCBRZjN4ZjcsIGY3ZjhxLFxuICAgICAgLy8gYjFjM1xuXG4gICAgICAvLyBOT1RFOiBTb21lIHBvc2l0aW9ucyBhbmQgbW92ZXMgbWF5IGJlIGFtYmlndW91cyB3aGVuIHVzaW5nIHRoZSBzbG9wcHlcbiAgICAgIC8vIHBhcnNlci4gRm9yIGV4YW1wbGUsIGluIHRoaXMgcG9zaXRpb246IDZrMS84LzgvQjcvOC84LzgvQk40SzEgdyAtIC0gMCAxLFxuICAgICAgLy8gdGhlIG1vdmUgYjFjMyBtYXkgYmUgaW50ZXJwcmV0ZWQgYXMgTmMzIG9yIEIxYzMgKGEgZGlzYW1iaWd1YXRlZFxuICAgICAgLy8gYmlzaG9wIG1vdmUpLiBJbiB0aGVzZSBjYXNlcywgdGhlIHNsb3BweSBwYXJzZXIgd2lsbCBkZWZhdWx0IHRvIHRoZVxuICAgICAgLy8gbW9zdCBtb3N0IGJhc2ljIGludGVycHJldGF0aW9uIC0gYjFjMyBwYXJzZXMgdG8gTmMzLlxuXG4gICAgICB2YXIgbWF0Y2hlcyA9IGNsZWFuX21vdmUubWF0Y2goXG4gICAgICAgIC8oW3BuYnJxa1BOQlJRS10pPyhbYS1oXVsxLThdKXg/LT8oW2EtaF1bMS04XSkoW3FyYm5RUkJOXSk/L1xuICAgICAgKVxuICAgICAgaWYgKG1hdGNoZXMpIHtcbiAgICAgICAgdmFyIHBpZWNlID0gbWF0Y2hlc1sxXVxuICAgICAgICB2YXIgZnJvbSA9IG1hdGNoZXNbMl1cbiAgICAgICAgdmFyIHRvID0gbWF0Y2hlc1szXVxuICAgICAgICB2YXIgcHJvbW90aW9uID0gbWF0Y2hlc1s0XVxuXG4gICAgICAgIGlmIChmcm9tLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgb3Zlcmx5X2Rpc2FtYmlndWF0ZWQgPSB0cnVlXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRoZSBbYS1oXT9bMS04XT8gcG9ydGlvbiBvZiB0aGUgcmVnZXggYmVsb3cgaGFuZGxlcyBtb3ZlcyB0aGF0IG1heVxuICAgICAgICAvLyBiZSBvdmVybHkgZGlzYW1iaWd1YXRlZCAoZS5nLiBOZ2U3IGlzIHVubmVjZXNzYXJ5IGFuZCBub24tc3RhbmRhcmRcbiAgICAgICAgLy8gd2hlbiB0aGVyZSBpcyBvbmUgbGVnYWwga25pZ2h0IG1vdmUgdG8gZTcpLiBJbiB0aGlzIGNhc2UsIHRoZSB2YWx1ZVxuICAgICAgICAvLyBvZiAnZnJvbScgdmFyaWFibGUgd2lsbCBiZSBhIHJhbmsgb3IgZmlsZSwgbm90IGEgc3F1YXJlLlxuICAgICAgICB2YXIgbWF0Y2hlcyA9IGNsZWFuX21vdmUubWF0Y2goXG4gICAgICAgICAgLyhbcG5icnFrUE5CUlFLXSk/KFthLWhdP1sxLThdPyl4Py0/KFthLWhdWzEtOF0pKFtxcmJuUVJCTl0pPy9cbiAgICAgICAgKVxuXG4gICAgICAgIGlmIChtYXRjaGVzKSB7XG4gICAgICAgICAgdmFyIHBpZWNlID0gbWF0Y2hlc1sxXVxuICAgICAgICAgIHZhciBmcm9tID0gbWF0Y2hlc1syXVxuICAgICAgICAgIHZhciB0byA9IG1hdGNoZXNbM11cbiAgICAgICAgICB2YXIgcHJvbW90aW9uID0gbWF0Y2hlc1s0XVxuXG4gICAgICAgICAgaWYgKGZyb20ubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIHZhciBvdmVybHlfZGlzYW1iaWd1YXRlZCA9IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcGllY2VfdHlwZSA9IGluZmVyX3BpZWNlX3R5cGUoY2xlYW5fbW92ZSlcbiAgICB2YXIgbW92ZXMgPSBnZW5lcmF0ZV9tb3Zlcyh7XG4gICAgICBsZWdhbDogdHJ1ZSxcbiAgICAgIHBpZWNlOiBwaWVjZSA/IHBpZWNlIDogcGllY2VfdHlwZSxcbiAgICB9KVxuXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IG1vdmVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAvLyB0cnkgdGhlIHN0cmljdCBwYXJzZXIgZmlyc3QsIHRoZW4gdGhlIHNsb3BweSBwYXJzZXIgaWYgcmVxdWVzdGVkXG4gICAgICAvLyBieSB0aGUgdXNlclxuICAgICAgaWYgKGNsZWFuX21vdmUgPT09IHN0cmlwcGVkX3Nhbihtb3ZlX3RvX3Nhbihtb3Zlc1tpXSwgbW92ZXMpKSkge1xuICAgICAgICByZXR1cm4gbW92ZXNbaV1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChzbG9wcHkgJiYgbWF0Y2hlcykge1xuICAgICAgICAgIC8vIGhhbmQtY29tcGFyZSBtb3ZlIHByb3BlcnRpZXMgd2l0aCB0aGUgcmVzdWx0cyBmcm9tIG91ciBzbG9wcHlcbiAgICAgICAgICAvLyByZWdleFxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICghcGllY2UgfHwgcGllY2UudG9Mb3dlckNhc2UoKSA9PSBtb3Zlc1tpXS5waWVjZSkgJiZcbiAgICAgICAgICAgIFNRVUFSRVNbZnJvbV0gPT0gbW92ZXNbaV0uZnJvbSAmJlxuICAgICAgICAgICAgU1FVQVJFU1t0b10gPT0gbW92ZXNbaV0udG8gJiZcbiAgICAgICAgICAgICghcHJvbW90aW9uIHx8IHByb21vdGlvbi50b0xvd2VyQ2FzZSgpID09IG1vdmVzW2ldLnByb21vdGlvbilcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiBtb3Zlc1tpXVxuICAgICAgICAgIH0gZWxzZSBpZiAob3Zlcmx5X2Rpc2FtYmlndWF0ZWQpIHtcbiAgICAgICAgICAgIC8vIFNQRUNJQUwgQ0FTRTogd2UgcGFyc2VkIGEgbW92ZSBzdHJpbmcgdGhhdCBtYXkgaGF2ZSBhbiB1bm5lZWRlZFxuICAgICAgICAgICAgLy8gcmFuay9maWxlIGRpc2FtYmlndWF0b3IgKGUuZy4gTmdlNykuICBUaGUgJ2Zyb20nIHZhcmlhYmxlIHdpbGxcbiAgICAgICAgICAgIHZhciBzcXVhcmUgPSBhbGdlYnJhaWMobW92ZXNbaV0uZnJvbSlcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgKCFwaWVjZSB8fCBwaWVjZS50b0xvd2VyQ2FzZSgpID09IG1vdmVzW2ldLnBpZWNlKSAmJlxuICAgICAgICAgICAgICBTUVVBUkVTW3RvXSA9PSBtb3Zlc1tpXS50byAmJlxuICAgICAgICAgICAgICAoZnJvbSA9PSBzcXVhcmVbMF0gfHwgZnJvbSA9PSBzcXVhcmVbMV0pICYmXG4gICAgICAgICAgICAgICghcHJvbW90aW9uIHx8IHByb21vdGlvbi50b0xvd2VyQ2FzZSgpID09IG1vdmVzW2ldLnByb21vdGlvbilcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICByZXR1cm4gbW92ZXNbaV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqIFVUSUxJVFkgRlVOQ1RJT05TXG4gICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICBmdW5jdGlvbiByYW5rKGkpIHtcbiAgICByZXR1cm4gaSA+PiA0XG4gIH1cblxuICBmdW5jdGlvbiBmaWxlKGkpIHtcbiAgICByZXR1cm4gaSAmIDE1XG4gIH1cblxuICBmdW5jdGlvbiBhbGdlYnJhaWMoaSkge1xuICAgIHZhciBmID0gZmlsZShpKSxcbiAgICAgIHIgPSByYW5rKGkpXG4gICAgcmV0dXJuICdhYmNkZWZnaCcuc3Vic3RyaW5nKGYsIGYgKyAxKSArICc4NzY1NDMyMScuc3Vic3RyaW5nKHIsIHIgKyAxKVxuICB9XG5cbiAgZnVuY3Rpb24gc3dhcF9jb2xvcihjKSB7XG4gICAgcmV0dXJuIGMgPT09IFdISVRFID8gQkxBQ0sgOiBXSElURVxuICB9XG5cbiAgZnVuY3Rpb24gaXNfZGlnaXQoYykge1xuICAgIHJldHVybiAnMDEyMzQ1Njc4OScuaW5kZXhPZihjKSAhPT0gLTFcbiAgfVxuXG4gIC8qIHByZXR0eSA9IGV4dGVybmFsIG1vdmUgb2JqZWN0ICovXG4gIGZ1bmN0aW9uIG1ha2VfcHJldHR5KHVnbHlfbW92ZSkge1xuICAgIHZhciBtb3ZlID0gY2xvbmUodWdseV9tb3ZlKVxuICAgIG1vdmUuc2FuID0gbW92ZV90b19zYW4obW92ZSwgZ2VuZXJhdGVfbW92ZXMoeyBsZWdhbDogdHJ1ZSB9KSlcbiAgICBtb3ZlLnRvID0gYWxnZWJyYWljKG1vdmUudG8pXG4gICAgbW92ZS5mcm9tID0gYWxnZWJyYWljKG1vdmUuZnJvbSlcblxuICAgIHZhciBmbGFncyA9ICcnXG5cbiAgICBmb3IgKHZhciBmbGFnIGluIEJJVFMpIHtcbiAgICAgIGlmIChCSVRTW2ZsYWddICYgbW92ZS5mbGFncykge1xuICAgICAgICBmbGFncyArPSBGTEFHU1tmbGFnXVxuICAgICAgfVxuICAgIH1cbiAgICBtb3ZlLmZsYWdzID0gZmxhZ3NcblxuICAgIHJldHVybiBtb3ZlXG4gIH1cblxuICBmdW5jdGlvbiBjbG9uZShvYmopIHtcbiAgICB2YXIgZHVwZSA9IG9iaiBpbnN0YW5jZW9mIEFycmF5ID8gW10gOiB7fVxuXG4gICAgZm9yICh2YXIgcHJvcGVydHkgaW4gb2JqKSB7XG4gICAgICBpZiAodHlwZW9mIHByb3BlcnR5ID09PSAnb2JqZWN0Jykge1xuICAgICAgICBkdXBlW3Byb3BlcnR5XSA9IGNsb25lKG9ialtwcm9wZXJ0eV0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkdXBlW3Byb3BlcnR5XSA9IG9ialtwcm9wZXJ0eV1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZHVwZVxuICB9XG5cbiAgZnVuY3Rpb24gdHJpbShzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKVxuICB9XG5cbiAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqIERFQlVHR0lORyBVVElMSVRJRVNcbiAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gIGZ1bmN0aW9uIHBlcmZ0KGRlcHRoKSB7XG4gICAgdmFyIG1vdmVzID0gZ2VuZXJhdGVfbW92ZXMoeyBsZWdhbDogZmFsc2UgfSlcbiAgICB2YXIgbm9kZXMgPSAwXG4gICAgdmFyIGNvbG9yID0gdHVyblxuXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IG1vdmVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBtYWtlX21vdmUobW92ZXNbaV0pXG4gICAgICBpZiAoIWtpbmdfYXR0YWNrZWQoY29sb3IpKSB7XG4gICAgICAgIGlmIChkZXB0aCAtIDEgPiAwKSB7XG4gICAgICAgICAgdmFyIGNoaWxkX25vZGVzID0gcGVyZnQoZGVwdGggLSAxKVxuICAgICAgICAgIG5vZGVzICs9IGNoaWxkX25vZGVzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbm9kZXMrK1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB1bmRvX21vdmUoKVxuICAgIH1cblxuICAgIHJldHVybiBub2Rlc1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICogUFVCTElDIENPTlNUQU5UUyAoaXMgdGhlcmUgYSBiZXR0ZXIgd2F5IHRvIGRvIHRoaXM/KVxuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICBXSElURTogV0hJVEUsXG4gICAgQkxBQ0s6IEJMQUNLLFxuICAgIFBBV046IFBBV04sXG4gICAgS05JR0hUOiBLTklHSFQsXG4gICAgQklTSE9QOiBCSVNIT1AsXG4gICAgUk9PSzogUk9PSyxcbiAgICBRVUVFTjogUVVFRU4sXG4gICAgS0lORzogS0lORyxcbiAgICBTUVVBUkVTOiAoZnVuY3Rpb24gKCkge1xuICAgICAgLyogZnJvbSB0aGUgRUNNQS0yNjIgc3BlYyAoc2VjdGlvbiAxMi42LjQpOlxuICAgICAgICogXCJUaGUgbWVjaGFuaWNzIG9mIGVudW1lcmF0aW5nIHRoZSBwcm9wZXJ0aWVzIC4uLiBpc1xuICAgICAgICogaW1wbGVtZW50YXRpb24gZGVwZW5kZW50XCJcbiAgICAgICAqIHNvOiBmb3IgKHZhciBzcSBpbiBTUVVBUkVTKSB7IGtleXMucHVzaChzcSk7IH0gbWlnaHQgbm90IGJlXG4gICAgICAgKiBvcmRlcmVkIGNvcnJlY3RseVxuICAgICAgICovXG4gICAgICB2YXIga2V5cyA9IFtdXG4gICAgICBmb3IgKHZhciBpID0gU1FVQVJFUy5hODsgaSA8PSBTUVVBUkVTLmgxOyBpKyspIHtcbiAgICAgICAgaWYgKGkgJiAweDg4KSB7XG4gICAgICAgICAgaSArPSA3XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuICAgICAgICBrZXlzLnB1c2goYWxnZWJyYWljKGkpKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGtleXNcbiAgICB9KSgpLFxuICAgIEZMQUdTOiBGTEFHUyxcblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiBQVUJMSUMgQVBJXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIGxvYWQ6IGZ1bmN0aW9uIChmZW4pIHtcbiAgICAgIHJldHVybiBsb2FkKGZlbilcbiAgICB9LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiByZXNldCgpXG4gICAgfSxcblxuICAgIG1vdmVzOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgLyogVGhlIGludGVybmFsIHJlcHJlc2VudGF0aW9uIG9mIGEgY2hlc3MgbW92ZSBpcyBpbiAweDg4IGZvcm1hdCwgYW5kXG4gICAgICAgKiBub3QgbWVhbnQgdG8gYmUgaHVtYW4tcmVhZGFibGUuICBUaGUgY29kZSBiZWxvdyBjb252ZXJ0cyB0aGUgMHg4OFxuICAgICAgICogc3F1YXJlIGNvb3JkaW5hdGVzIHRvIGFsZ2VicmFpYyBjb29yZGluYXRlcy4gIEl0IGFsc28gcHJ1bmVzIGFuXG4gICAgICAgKiB1bm5lY2Vzc2FyeSBtb3ZlIGtleXMgcmVzdWx0aW5nIGZyb20gYSB2ZXJib3NlIGNhbGwuXG4gICAgICAgKi9cblxuICAgICAgdmFyIHVnbHlfbW92ZXMgPSBnZW5lcmF0ZV9tb3ZlcyhvcHRpb25zKVxuICAgICAgdmFyIG1vdmVzID0gW11cblxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHVnbHlfbW92ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgLyogZG9lcyB0aGUgdXNlciB3YW50IGEgZnVsbCBtb3ZlIG9iamVjdCAobW9zdCBsaWtlbHkgbm90KSwgb3IganVzdFxuICAgICAgICAgKiBTQU5cbiAgICAgICAgICovXG4gICAgICAgIGlmIChcbiAgICAgICAgICB0eXBlb2Ygb3B0aW9ucyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAndmVyYm9zZScgaW4gb3B0aW9ucyAmJlxuICAgICAgICAgIG9wdGlvbnMudmVyYm9zZVxuICAgICAgICApIHtcbiAgICAgICAgICBtb3Zlcy5wdXNoKG1ha2VfcHJldHR5KHVnbHlfbW92ZXNbaV0pKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1vdmVzLnB1c2goXG4gICAgICAgICAgICBtb3ZlX3RvX3Nhbih1Z2x5X21vdmVzW2ldLCBnZW5lcmF0ZV9tb3Zlcyh7IGxlZ2FsOiB0cnVlIH0pKVxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbW92ZXNcbiAgICB9LFxuXG4gICAgaW5fY2hlY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBpbl9jaGVjaygpXG4gICAgfSxcblxuICAgIGluX2NoZWNrbWF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGluX2NoZWNrbWF0ZSgpXG4gICAgfSxcblxuICAgIGluX3N0YWxlbWF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGluX3N0YWxlbWF0ZSgpXG4gICAgfSxcblxuICAgIGluX2RyYXc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIGhhbGZfbW92ZXMgPj0gMTAwIHx8XG4gICAgICAgIGluX3N0YWxlbWF0ZSgpIHx8XG4gICAgICAgIGluc3VmZmljaWVudF9tYXRlcmlhbCgpIHx8XG4gICAgICAgIGluX3RocmVlZm9sZF9yZXBldGl0aW9uKClcbiAgICAgIClcbiAgICB9LFxuXG4gICAgaW5zdWZmaWNpZW50X21hdGVyaWFsOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gaW5zdWZmaWNpZW50X21hdGVyaWFsKClcbiAgICB9LFxuXG4gICAgaW5fdGhyZWVmb2xkX3JlcGV0aXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBpbl90aHJlZWZvbGRfcmVwZXRpdGlvbigpXG4gICAgfSxcblxuICAgIGdhbWVfb3ZlcjogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgaGFsZl9tb3ZlcyA+PSAxMDAgfHxcbiAgICAgICAgaW5fY2hlY2ttYXRlKCkgfHxcbiAgICAgICAgaW5fc3RhbGVtYXRlKCkgfHxcbiAgICAgICAgaW5zdWZmaWNpZW50X21hdGVyaWFsKCkgfHxcbiAgICAgICAgaW5fdGhyZWVmb2xkX3JlcGV0aXRpb24oKVxuICAgICAgKVxuICAgIH0sXG5cbiAgICB2YWxpZGF0ZV9mZW46IGZ1bmN0aW9uIChmZW4pIHtcbiAgICAgIHJldHVybiB2YWxpZGF0ZV9mZW4oZmVuKVxuICAgIH0sXG5cbiAgICBmZW46IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBnZW5lcmF0ZV9mZW4oKVxuICAgIH0sXG5cbiAgICBib2FyZDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG91dHB1dCA9IFtdLFxuICAgICAgICByb3cgPSBbXVxuXG4gICAgICBmb3IgKHZhciBpID0gU1FVQVJFUy5hODsgaSA8PSBTUVVBUkVTLmgxOyBpKyspIHtcbiAgICAgICAgaWYgKGJvYXJkW2ldID09IG51bGwpIHtcbiAgICAgICAgICByb3cucHVzaChudWxsKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJvdy5wdXNoKHsgdHlwZTogYm9hcmRbaV0udHlwZSwgY29sb3I6IGJvYXJkW2ldLmNvbG9yIH0pXG4gICAgICAgIH1cbiAgICAgICAgaWYgKChpICsgMSkgJiAweDg4KSB7XG4gICAgICAgICAgb3V0cHV0LnB1c2gocm93KVxuICAgICAgICAgIHJvdyA9IFtdXG4gICAgICAgICAgaSArPSA4XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG91dHB1dFxuICAgIH0sXG5cbiAgICBwZ246IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAvKiB1c2luZyB0aGUgc3BlY2lmaWNhdGlvbiBmcm9tIGh0dHA6Ly93d3cuY2hlc3NjbHViLmNvbS9oZWxwL1BHTi1zcGVjXG4gICAgICAgKiBleGFtcGxlIGZvciBodG1sIHVzYWdlOiAucGduKHsgbWF4X3dpZHRoOiA3MiwgbmV3bGluZV9jaGFyOiBcIjxiciAvPlwiIH0pXG4gICAgICAgKi9cbiAgICAgIHZhciBuZXdsaW5lID1cbiAgICAgICAgdHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBvcHRpb25zLm5ld2xpbmVfY2hhciA9PT0gJ3N0cmluZydcbiAgICAgICAgICA/IG9wdGlvbnMubmV3bGluZV9jaGFyXG4gICAgICAgICAgOiAnXFxuJ1xuICAgICAgdmFyIG1heF93aWR0aCA9XG4gICAgICAgIHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JyAmJiB0eXBlb2Ygb3B0aW9ucy5tYXhfd2lkdGggPT09ICdudW1iZXInXG4gICAgICAgICAgPyBvcHRpb25zLm1heF93aWR0aFxuICAgICAgICAgIDogMFxuICAgICAgdmFyIHJlc3VsdCA9IFtdXG4gICAgICB2YXIgaGVhZGVyX2V4aXN0cyA9IGZhbHNlXG5cbiAgICAgIC8qIGFkZCB0aGUgUEdOIGhlYWRlciBoZWFkZXJybWF0aW9uICovXG4gICAgICBmb3IgKHZhciBpIGluIGhlYWRlcikge1xuICAgICAgICAvKiBUT0RPOiBvcmRlciBvZiBlbnVtZXJhdGVkIHByb3BlcnRpZXMgaW4gaGVhZGVyIG9iamVjdCBpcyBub3RcbiAgICAgICAgICogZ3VhcmFudGVlZCwgc2VlIEVDTUEtMjYyIHNwZWMgKHNlY3Rpb24gMTIuNi40KVxuICAgICAgICAgKi9cbiAgICAgICAgcmVzdWx0LnB1c2goJ1snICsgaSArICcgXCInICsgaGVhZGVyW2ldICsgJ1wiXScgKyBuZXdsaW5lKVxuICAgICAgICBoZWFkZXJfZXhpc3RzID0gdHJ1ZVxuICAgICAgfVxuXG4gICAgICBpZiAoaGVhZGVyX2V4aXN0cyAmJiBoaXN0b3J5Lmxlbmd0aCkge1xuICAgICAgICByZXN1bHQucHVzaChuZXdsaW5lKVxuICAgICAgfVxuXG4gICAgICB2YXIgYXBwZW5kX2NvbW1lbnQgPSBmdW5jdGlvbiAobW92ZV9zdHJpbmcpIHtcbiAgICAgICAgdmFyIGNvbW1lbnQgPSBjb21tZW50c1tnZW5lcmF0ZV9mZW4oKV1cbiAgICAgICAgaWYgKHR5cGVvZiBjb21tZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHZhciBkZWxpbWl0ZXIgPSBtb3ZlX3N0cmluZy5sZW5ndGggPiAwID8gJyAnIDogJydcbiAgICAgICAgICBtb3ZlX3N0cmluZyA9IGAke21vdmVfc3RyaW5nfSR7ZGVsaW1pdGVyfXske2NvbW1lbnR9fWBcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbW92ZV9zdHJpbmdcbiAgICAgIH1cblxuICAgICAgLyogcG9wIGFsbCBvZiBoaXN0b3J5IG9udG8gcmV2ZXJzZWRfaGlzdG9yeSAqL1xuICAgICAgdmFyIHJldmVyc2VkX2hpc3RvcnkgPSBbXVxuICAgICAgd2hpbGUgKGhpc3RvcnkubGVuZ3RoID4gMCkge1xuICAgICAgICByZXZlcnNlZF9oaXN0b3J5LnB1c2godW5kb19tb3ZlKCkpXG4gICAgICB9XG5cbiAgICAgIHZhciBtb3ZlcyA9IFtdXG4gICAgICB2YXIgbW92ZV9zdHJpbmcgPSAnJ1xuXG4gICAgICAvKiBzcGVjaWFsIGNhc2Ugb2YgYSBjb21tZW50ZWQgc3RhcnRpbmcgcG9zaXRpb24gd2l0aCBubyBtb3ZlcyAqL1xuICAgICAgaWYgKHJldmVyc2VkX2hpc3RvcnkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIG1vdmVzLnB1c2goYXBwZW5kX2NvbW1lbnQoJycpKVxuICAgICAgfVxuXG4gICAgICAvKiBidWlsZCB0aGUgbGlzdCBvZiBtb3Zlcy4gIGEgbW92ZV9zdHJpbmcgbG9va3MgbGlrZTogXCIzLiBlMyBlNlwiICovXG4gICAgICB3aGlsZSAocmV2ZXJzZWRfaGlzdG9yeS5sZW5ndGggPiAwKSB7XG4gICAgICAgIG1vdmVfc3RyaW5nID0gYXBwZW5kX2NvbW1lbnQobW92ZV9zdHJpbmcpXG4gICAgICAgIHZhciBtb3ZlID0gcmV2ZXJzZWRfaGlzdG9yeS5wb3AoKVxuXG4gICAgICAgIC8qIGlmIHRoZSBwb3NpdGlvbiBzdGFydGVkIHdpdGggYmxhY2sgdG8gbW92ZSwgc3RhcnQgUEdOIHdpdGggMS4gLi4uICovXG4gICAgICAgIGlmICghaGlzdG9yeS5sZW5ndGggJiYgbW92ZS5jb2xvciA9PT0gJ2InKSB7XG4gICAgICAgICAgbW92ZV9zdHJpbmcgPSBtb3ZlX251bWJlciArICcuIC4uLidcbiAgICAgICAgfSBlbHNlIGlmIChtb3ZlLmNvbG9yID09PSAndycpIHtcbiAgICAgICAgICAvKiBzdG9yZSB0aGUgcHJldmlvdXMgZ2VuZXJhdGVkIG1vdmVfc3RyaW5nIGlmIHdlIGhhdmUgb25lICovXG4gICAgICAgICAgaWYgKG1vdmVfc3RyaW5nLmxlbmd0aCkge1xuICAgICAgICAgICAgbW92ZXMucHVzaChtb3ZlX3N0cmluZylcbiAgICAgICAgICB9XG4gICAgICAgICAgbW92ZV9zdHJpbmcgPSBtb3ZlX251bWJlciArICcuJ1xuICAgICAgICB9XG5cbiAgICAgICAgbW92ZV9zdHJpbmcgPVxuICAgICAgICAgIG1vdmVfc3RyaW5nICsgJyAnICsgbW92ZV90b19zYW4obW92ZSwgZ2VuZXJhdGVfbW92ZXMoeyBsZWdhbDogdHJ1ZSB9KSlcbiAgICAgICAgbWFrZV9tb3ZlKG1vdmUpXG4gICAgICB9XG5cbiAgICAgIC8qIGFyZSB0aGVyZSBhbnkgb3RoZXIgbGVmdG92ZXIgbW92ZXM/ICovXG4gICAgICBpZiAobW92ZV9zdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgIG1vdmVzLnB1c2goYXBwZW5kX2NvbW1lbnQobW92ZV9zdHJpbmcpKVxuICAgICAgfVxuXG4gICAgICAvKiBpcyB0aGVyZSBhIHJlc3VsdD8gKi9cbiAgICAgIGlmICh0eXBlb2YgaGVhZGVyLlJlc3VsdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbW92ZXMucHVzaChoZWFkZXIuUmVzdWx0KVxuICAgICAgfVxuXG4gICAgICAvKiBoaXN0b3J5IHNob3VsZCBiZSBiYWNrIHRvIHdoYXQgaXQgd2FzIGJlZm9yZSB3ZSBzdGFydGVkIGdlbmVyYXRpbmcgUEdOLFxuICAgICAgICogc28gam9pbiB0b2dldGhlciBtb3Zlc1xuICAgICAgICovXG4gICAgICBpZiAobWF4X3dpZHRoID09PSAwKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQuam9pbignJykgKyBtb3Zlcy5qb2luKCcgJylcbiAgICAgIH1cblxuICAgICAgdmFyIHN0cmlwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA+IDAgJiYgcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXSA9PT0gJyAnKSB7XG4gICAgICAgICAgcmVzdWx0LnBvcCgpXG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgLyogTkI6IHRoaXMgZG9lcyBub3QgcHJlc2VydmUgY29tbWVudCB3aGl0ZXNwYWNlLiAqL1xuICAgICAgdmFyIHdyYXBfY29tbWVudCA9IGZ1bmN0aW9uICh3aWR0aCwgbW92ZSkge1xuICAgICAgICBmb3IgKHZhciB0b2tlbiBvZiBtb3ZlLnNwbGl0KCcgJykpIHtcbiAgICAgICAgICBpZiAoIXRva2VuKSB7XG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAod2lkdGggKyB0b2tlbi5sZW5ndGggPiBtYXhfd2lkdGgpIHtcbiAgICAgICAgICAgIHdoaWxlIChzdHJpcCgpKSB7XG4gICAgICAgICAgICAgIHdpZHRoLS1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5ld2xpbmUpXG4gICAgICAgICAgICB3aWR0aCA9IDBcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0LnB1c2godG9rZW4pXG4gICAgICAgICAgd2lkdGggKz0gdG9rZW4ubGVuZ3RoXG4gICAgICAgICAgcmVzdWx0LnB1c2goJyAnKVxuICAgICAgICAgIHdpZHRoKytcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RyaXAoKSkge1xuICAgICAgICAgIHdpZHRoLS1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gd2lkdGhcbiAgICAgIH1cblxuICAgICAgLyogd3JhcCB0aGUgUEdOIG91dHB1dCBhdCBtYXhfd2lkdGggKi9cbiAgICAgIHZhciBjdXJyZW50X3dpZHRoID0gMFxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtb3Zlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoY3VycmVudF93aWR0aCArIG1vdmVzW2ldLmxlbmd0aCA+IG1heF93aWR0aCkge1xuICAgICAgICAgIGlmIChtb3Zlc1tpXS5pbmNsdWRlcygneycpKSB7XG4gICAgICAgICAgICBjdXJyZW50X3dpZHRoID0gd3JhcF9jb21tZW50KGN1cnJlbnRfd2lkdGgsIG1vdmVzW2ldKVxuICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLyogaWYgdGhlIGN1cnJlbnQgbW92ZSB3aWxsIHB1c2ggcGFzdCBtYXhfd2lkdGggKi9cbiAgICAgICAgaWYgKGN1cnJlbnRfd2lkdGggKyBtb3Zlc1tpXS5sZW5ndGggPiBtYXhfd2lkdGggJiYgaSAhPT0gMCkge1xuICAgICAgICAgIC8qIGRvbid0IGVuZCB0aGUgbGluZSB3aXRoIHdoaXRlc3BhY2UgKi9cbiAgICAgICAgICBpZiAocmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXSA9PT0gJyAnKSB7XG4gICAgICAgICAgICByZXN1bHQucG9wKClcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXN1bHQucHVzaChuZXdsaW5lKVxuICAgICAgICAgIGN1cnJlbnRfd2lkdGggPSAwXG4gICAgICAgIH0gZWxzZSBpZiAoaSAhPT0gMCkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKCcgJylcbiAgICAgICAgICBjdXJyZW50X3dpZHRoKytcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQucHVzaChtb3Zlc1tpXSlcbiAgICAgICAgY3VycmVudF93aWR0aCArPSBtb3Zlc1tpXS5sZW5ndGhcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdC5qb2luKCcnKVxuICAgIH0sXG5cbiAgICBsb2FkX3BnbjogZnVuY3Rpb24gKHBnbiwgb3B0aW9ucykge1xuICAgICAgLy8gYWxsb3cgdGhlIHVzZXIgdG8gc3BlY2lmeSB0aGUgc2xvcHB5IG1vdmUgcGFyc2VyIHRvIHdvcmsgYXJvdW5kIG92ZXJcbiAgICAgIC8vIGRpc2FtYmlndWF0aW9uIGJ1Z3MgaW4gRnJpdHogYW5kIENoZXNzYmFzZVxuICAgICAgdmFyIHNsb3BweSA9XG4gICAgICAgIHR5cGVvZiBvcHRpb25zICE9PSAndW5kZWZpbmVkJyAmJiAnc2xvcHB5JyBpbiBvcHRpb25zXG4gICAgICAgICAgPyBvcHRpb25zLnNsb3BweVxuICAgICAgICAgIDogZmFsc2VcblxuICAgICAgZnVuY3Rpb24gbWFzayhzdHIpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXFxcL2csICdcXFxcJylcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaGFzX2tleXMob2JqZWN0KSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBwYXJzZV9wZ25faGVhZGVyKGhlYWRlciwgb3B0aW9ucykge1xuICAgICAgICB2YXIgbmV3bGluZV9jaGFyID1cbiAgICAgICAgICB0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgICB0eXBlb2Ygb3B0aW9ucy5uZXdsaW5lX2NoYXIgPT09ICdzdHJpbmcnXG4gICAgICAgICAgICA/IG9wdGlvbnMubmV3bGluZV9jaGFyXG4gICAgICAgICAgICA6ICdcXHI/XFxuJ1xuICAgICAgICB2YXIgaGVhZGVyX29iaiA9IHt9XG4gICAgICAgIHZhciBoZWFkZXJzID0gaGVhZGVyLnNwbGl0KG5ldyBSZWdFeHAobWFzayhuZXdsaW5lX2NoYXIpKSlcbiAgICAgICAgdmFyIGtleSA9ICcnXG4gICAgICAgIHZhciB2YWx1ZSA9ICcnXG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoZWFkZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAga2V5ID0gaGVhZGVyc1tpXS5yZXBsYWNlKC9eXFxbKFtBLVpdW0EtWmEtel0qKVxccy4qXFxdJC8sICckMScpXG4gICAgICAgICAgdmFsdWUgPSBoZWFkZXJzW2ldLnJlcGxhY2UoL15cXFtbQS1aYS16XStcXHNcIiguKilcIlxcICpcXF0kLywgJyQxJylcbiAgICAgICAgICBpZiAodHJpbShrZXkpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGhlYWRlcl9vYmpba2V5XSA9IHZhbHVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGhlYWRlcl9vYmpcbiAgICAgIH1cblxuICAgICAgdmFyIG5ld2xpbmVfY2hhciA9XG4gICAgICAgIHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JyAmJiB0eXBlb2Ygb3B0aW9ucy5uZXdsaW5lX2NoYXIgPT09ICdzdHJpbmcnXG4gICAgICAgICAgPyBvcHRpb25zLm5ld2xpbmVfY2hhclxuICAgICAgICAgIDogJ1xccj9cXG4nXG5cbiAgICAgIC8vIFJlZ0V4cCB0byBzcGxpdCBoZWFkZXIuIFRha2VzIGFkdmFudGFnZSBvZiB0aGUgZmFjdCB0aGF0IGhlYWRlciBhbmQgbW92ZXRleHRcbiAgICAgIC8vIHdpbGwgYWx3YXlzIGhhdmUgYSBibGFuayBsaW5lIGJldHdlZW4gdGhlbSAoaWUsIHR3byBuZXdsaW5lX2NoYXIncykuXG4gICAgICAvLyBXaXRoIGRlZmF1bHQgbmV3bGluZV9jaGFyLCB3aWxsIGVxdWFsOiAvXihcXFsoKD86XFxyP1xcbil8LikqXFxdKSg/Olxccj9cXG4pezJ9L1xuICAgICAgdmFyIGhlYWRlcl9yZWdleCA9IG5ldyBSZWdFeHAoXG4gICAgICAgICdeKFxcXFxbKCg/OicgK1xuICAgICAgICAgIG1hc2sobmV3bGluZV9jaGFyKSArXG4gICAgICAgICAgJyl8LikqXFxcXF0pJyArXG4gICAgICAgICAgJyg/OicgK1xuICAgICAgICAgIG1hc2sobmV3bGluZV9jaGFyKSArXG4gICAgICAgICAgJyl7Mn0nXG4gICAgICApXG5cbiAgICAgIC8vIElmIG5vIGhlYWRlciBnaXZlbiwgYmVnaW4gd2l0aCBtb3Zlcy5cbiAgICAgIHZhciBoZWFkZXJfc3RyaW5nID0gaGVhZGVyX3JlZ2V4LnRlc3QocGduKVxuICAgICAgICA/IGhlYWRlcl9yZWdleC5leGVjKHBnbilbMV1cbiAgICAgICAgOiAnJ1xuXG4gICAgICAvLyBQdXQgdGhlIGJvYXJkIGluIHRoZSBzdGFydGluZyBwb3NpdGlvblxuICAgICAgcmVzZXQoKVxuXG4gICAgICAvKiBwYXJzZSBQR04gaGVhZGVyICovXG4gICAgICB2YXIgaGVhZGVycyA9IHBhcnNlX3Bnbl9oZWFkZXIoaGVhZGVyX3N0cmluZywgb3B0aW9ucylcbiAgICAgIGZvciAodmFyIGtleSBpbiBoZWFkZXJzKSB7XG4gICAgICAgIHNldF9oZWFkZXIoW2tleSwgaGVhZGVyc1trZXldXSlcbiAgICAgIH1cblxuICAgICAgLyogbG9hZCB0aGUgc3RhcnRpbmcgcG9zaXRpb24gaW5kaWNhdGVkIGJ5IFtTZXR1cCAnMSddIGFuZFxuICAgICAgICogW0ZFTiBwb3NpdGlvbl0gKi9cbiAgICAgIGlmIChoZWFkZXJzWydTZXRVcCddID09PSAnMScpIHtcbiAgICAgICAgaWYgKCEoJ0ZFTicgaW4gaGVhZGVycyAmJiBsb2FkKGhlYWRlcnNbJ0ZFTiddLCB0cnVlKSkpIHtcbiAgICAgICAgICAvLyBzZWNvbmQgYXJndW1lbnQgdG8gbG9hZDogZG9uJ3QgY2xlYXIgdGhlIGhlYWRlcnNcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvKiBOQjogdGhlIHJlZ2V4ZXMgYmVsb3cgdGhhdCBkZWxldGUgbW92ZSBudW1iZXJzLCByZWN1cnNpdmVcbiAgICAgICAqIGFubm90YXRpb25zLCBhbmQgbnVtZXJpYyBhbm5vdGF0aW9uIGdseXBocyBtYXkgYWxzbyBtYXRjaFxuICAgICAgICogdGV4dCBpbiBjb21tZW50cy4gVG8gcHJldmVudCB0aGlzLCB3ZSB0cmFuc2Zvcm0gY29tbWVudHNcbiAgICAgICAqIGJ5IGhleC1lbmNvZGluZyB0aGVtIGluIHBsYWNlIGFuZCBkZWNvZGluZyB0aGVtIGFnYWluIGFmdGVyXG4gICAgICAgKiB0aGUgb3RoZXIgdG9rZW5zIGhhdmUgYmVlbiBkZWxldGVkLlxuICAgICAgICpcbiAgICAgICAqIFdoaWxlIHRoZSBzcGVjIHN0YXRlcyB0aGF0IFBHTiBmaWxlcyBzaG91bGQgYmUgQVNDSUkgZW5jb2RlZCxcbiAgICAgICAqIHdlIHVzZSB7ZW4sZGV9Y29kZVVSSUNvbXBvbmVudCBoZXJlIHRvIHN1cHBvcnQgYXJiaXRyYXJ5IFVURjhcbiAgICAgICAqIGFzIGEgY29udmVuaWVuY2UgZm9yIG1vZGVybiB1c2VycyAqL1xuXG4gICAgICB2YXIgdG9faGV4ID0gZnVuY3Rpb24gKHN0cmluZykge1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShzdHJpbmcpXG4gICAgICAgICAgLm1hcChmdW5jdGlvbiAoYykge1xuICAgICAgICAgICAgLyogZW5jb2RlVVJJIGRvZXNuJ3QgdHJhbnNmb3JtIG1vc3QgQVNDSUkgY2hhcmFjdGVycyxcbiAgICAgICAgICAgICAqIHNvIHdlIGhhbmRsZSB0aGVzZSBvdXJzZWx2ZXMgKi9cbiAgICAgICAgICAgIHJldHVybiBjLmNoYXJDb2RlQXQoMCkgPCAxMjhcbiAgICAgICAgICAgICAgPyBjLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpXG4gICAgICAgICAgICAgIDogZW5jb2RlVVJJQ29tcG9uZW50KGMpLnJlcGxhY2UoL1xcJS9nLCAnJykudG9Mb3dlckNhc2UoKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmpvaW4oJycpXG4gICAgICB9XG5cbiAgICAgIHZhciBmcm9tX2hleCA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZy5sZW5ndGggPT0gMFxuICAgICAgICAgID8gJydcbiAgICAgICAgICA6IGRlY29kZVVSSUNvbXBvbmVudCgnJScgKyBzdHJpbmcubWF0Y2goLy57MSwyfS9nKS5qb2luKCclJykpXG4gICAgICB9XG5cbiAgICAgIHZhciBlbmNvZGVfY29tbWVudCA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICAgICAgc3RyaW5nID0gc3RyaW5nLnJlcGxhY2UobmV3IFJlZ0V4cChtYXNrKG5ld2xpbmVfY2hhciksICdnJyksICcgJylcbiAgICAgICAgcmV0dXJuIGB7JHt0b19oZXgoc3RyaW5nLnNsaWNlKDEsIHN0cmluZy5sZW5ndGggLSAxKSl9fWBcbiAgICAgIH1cblxuICAgICAgdmFyIGRlY29kZV9jb21tZW50ID0gZnVuY3Rpb24gKHN0cmluZykge1xuICAgICAgICBpZiAoc3RyaW5nLnN0YXJ0c1dpdGgoJ3snKSAmJiBzdHJpbmcuZW5kc1dpdGgoJ30nKSkge1xuICAgICAgICAgIHJldHVybiBmcm9tX2hleChzdHJpbmcuc2xpY2UoMSwgc3RyaW5nLmxlbmd0aCAtIDEpKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8qIGRlbGV0ZSBoZWFkZXIgdG8gZ2V0IHRoZSBtb3ZlcyAqL1xuICAgICAgdmFyIG1zID0gcGduXG4gICAgICAgIC5yZXBsYWNlKGhlYWRlcl9zdHJpbmcsICcnKVxuICAgICAgICAucmVwbGFjZShcbiAgICAgICAgICAvKiBlbmNvZGUgY29tbWVudHMgc28gdGhleSBkb24ndCBnZXQgZGVsZXRlZCBiZWxvdyAqL1xuICAgICAgICAgIG5ldyBSZWdFeHAoYChcXHtbXn1dKlxcfSkrP3w7KFteJHttYXNrKG5ld2xpbmVfY2hhcil9XSopYCwgJ2cnKSxcbiAgICAgICAgICBmdW5jdGlvbiAobWF0Y2gsIGJyYWNrZXQsIHNlbWljb2xvbikge1xuICAgICAgICAgICAgcmV0dXJuIGJyYWNrZXQgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICA/IGVuY29kZV9jb21tZW50KGJyYWNrZXQpXG4gICAgICAgICAgICAgIDogJyAnICsgZW5jb2RlX2NvbW1lbnQoYHske3NlbWljb2xvbi5zbGljZSgxKX19YClcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgICAgLnJlcGxhY2UobmV3IFJlZ0V4cChtYXNrKG5ld2xpbmVfY2hhciksICdnJyksICcgJylcblxuICAgICAgLyogZGVsZXRlIHJlY3Vyc2l2ZSBhbm5vdGF0aW9uIHZhcmlhdGlvbnMgKi9cbiAgICAgIHZhciByYXZfcmVnZXggPSAvKFxcKFteXFwoXFwpXStcXCkpKz8vZ1xuICAgICAgd2hpbGUgKHJhdl9yZWdleC50ZXN0KG1zKSkge1xuICAgICAgICBtcyA9IG1zLnJlcGxhY2UocmF2X3JlZ2V4LCAnJylcbiAgICAgIH1cblxuICAgICAgLyogZGVsZXRlIG1vdmUgbnVtYmVycyAqL1xuICAgICAgbXMgPSBtcy5yZXBsYWNlKC9cXGQrXFwuKFxcLlxcLik/L2csICcnKVxuXG4gICAgICAvKiBkZWxldGUgLi4uIGluZGljYXRpbmcgYmxhY2sgdG8gbW92ZSAqL1xuICAgICAgbXMgPSBtcy5yZXBsYWNlKC9cXC5cXC5cXC4vZywgJycpXG5cbiAgICAgIC8qIGRlbGV0ZSBudW1lcmljIGFubm90YXRpb24gZ2x5cGhzICovXG4gICAgICBtcyA9IG1zLnJlcGxhY2UoL1xcJFxcZCsvZywgJycpXG5cbiAgICAgIC8qIHRyaW0gYW5kIGdldCBhcnJheSBvZiBtb3ZlcyAqL1xuICAgICAgdmFyIG1vdmVzID0gdHJpbShtcykuc3BsaXQobmV3IFJlZ0V4cCgvXFxzKy8pKVxuXG4gICAgICAvKiBkZWxldGUgZW1wdHkgZW50cmllcyAqL1xuICAgICAgbW92ZXMgPSBtb3Zlcy5qb2luKCcsJykucmVwbGFjZSgvLCwrL2csICcsJykuc3BsaXQoJywnKVxuICAgICAgdmFyIG1vdmUgPSAnJ1xuXG4gICAgICB2YXIgcmVzdWx0ID0gJydcblxuICAgICAgZm9yICh2YXIgaGFsZl9tb3ZlID0gMDsgaGFsZl9tb3ZlIDwgbW92ZXMubGVuZ3RoOyBoYWxmX21vdmUrKykge1xuICAgICAgICB2YXIgY29tbWVudCA9IGRlY29kZV9jb21tZW50KG1vdmVzW2hhbGZfbW92ZV0pXG4gICAgICAgIGlmIChjb21tZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjb21tZW50c1tnZW5lcmF0ZV9mZW4oKV0gPSBjb21tZW50XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIG1vdmUgPSBtb3ZlX2Zyb21fc2FuKG1vdmVzW2hhbGZfbW92ZV0sIHNsb3BweSlcblxuICAgICAgICAvKiBpbnZhbGlkIG1vdmUgKi9cbiAgICAgICAgaWYgKG1vdmUgPT0gbnVsbCkge1xuICAgICAgICAgIC8qIHdhcyB0aGUgbW92ZSBhbiBlbmQgb2YgZ2FtZSBtYXJrZXIgKi9cbiAgICAgICAgICBpZiAoVEVSTUlOQVRJT05fTUFSS0VSUy5pbmRleE9mKG1vdmVzW2hhbGZfbW92ZV0pID4gLTEpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IG1vdmVzW2hhbGZfbW92ZV1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8qIHJlc2V0IHRoZSBlbmQgb2YgZ2FtZSBtYXJrZXIgaWYgbWFraW5nIGEgdmFsaWQgbW92ZSAqL1xuICAgICAgICAgIHJlc3VsdCA9ICcnXG4gICAgICAgICAgbWFrZV9tb3ZlKG1vdmUpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLyogUGVyIHNlY3Rpb24gOC4yLjYgb2YgdGhlIFBHTiBzcGVjLCB0aGUgUmVzdWx0IHRhZyBwYWlyIG11c3QgbWF0Y2hcbiAgICAgICAqIG1hdGNoIHRoZSB0ZXJtaW5hdGlvbiBtYXJrZXIuIE9ubHkgZG8gdGhpcyB3aGVuIGhlYWRlcnMgYXJlIHByZXNlbnQsXG4gICAgICAgKiBidXQgdGhlIHJlc3VsdCB0YWcgaXMgbWlzc2luZ1xuICAgICAgICovXG4gICAgICBpZiAocmVzdWx0ICYmIE9iamVjdC5rZXlzKGhlYWRlcikubGVuZ3RoICYmICFoZWFkZXJbJ1Jlc3VsdCddKSB7XG4gICAgICAgIHNldF9oZWFkZXIoWydSZXN1bHQnLCByZXN1bHRdKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0sXG5cbiAgICBoZWFkZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBzZXRfaGVhZGVyKGFyZ3VtZW50cylcbiAgICB9LFxuXG4gICAgYXNjaWk6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBhc2NpaSgpXG4gICAgfSxcblxuICAgIHR1cm46IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0dXJuXG4gICAgfSxcblxuICAgIG1vdmU6IGZ1bmN0aW9uIChtb3ZlLCBvcHRpb25zKSB7XG4gICAgICAvKiBUaGUgbW92ZSBmdW5jdGlvbiBjYW4gYmUgY2FsbGVkIHdpdGggaW4gdGhlIGZvbGxvd2luZyBwYXJhbWV0ZXJzOlxuICAgICAgICpcbiAgICAgICAqIC5tb3ZlKCdOeGI3JykgICAgICA8LSB3aGVyZSAnbW92ZScgaXMgYSBjYXNlLXNlbnNpdGl2ZSBTQU4gc3RyaW5nXG4gICAgICAgKlxuICAgICAgICogLm1vdmUoeyBmcm9tOiAnaDcnLCA8LSB3aGVyZSB0aGUgJ21vdmUnIGlzIGEgbW92ZSBvYmplY3QgKGFkZGl0aW9uYWxcbiAgICAgICAqICAgICAgICAgdG8gOidoOCcsICAgICAgZmllbGRzIGFyZSBpZ25vcmVkKVxuICAgICAgICogICAgICAgICBwcm9tb3Rpb246ICdxJyxcbiAgICAgICAqICAgICAgfSlcbiAgICAgICAqL1xuXG4gICAgICAvLyBhbGxvdyB0aGUgdXNlciB0byBzcGVjaWZ5IHRoZSBzbG9wcHkgbW92ZSBwYXJzZXIgdG8gd29yayBhcm91bmQgb3ZlclxuICAgICAgLy8gZGlzYW1iaWd1YXRpb24gYnVncyBpbiBGcml0eiBhbmQgQ2hlc3NiYXNlXG4gICAgICB2YXIgc2xvcHB5ID1cbiAgICAgICAgdHlwZW9mIG9wdGlvbnMgIT09ICd1bmRlZmluZWQnICYmICdzbG9wcHknIGluIG9wdGlvbnNcbiAgICAgICAgICA/IG9wdGlvbnMuc2xvcHB5XG4gICAgICAgICAgOiBmYWxzZVxuXG4gICAgICB2YXIgbW92ZV9vYmogPSBudWxsXG5cbiAgICAgIGlmICh0eXBlb2YgbW92ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgbW92ZV9vYmogPSBtb3ZlX2Zyb21fc2FuKG1vdmUsIHNsb3BweSlcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG1vdmUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHZhciBtb3ZlcyA9IGdlbmVyYXRlX21vdmVzKClcblxuICAgICAgICAvKiBjb252ZXJ0IHRoZSBwcmV0dHkgbW92ZSBvYmplY3QgdG8gYW4gdWdseSBtb3ZlIG9iamVjdCAqL1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gbW92ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBtb3ZlLmZyb20gPT09IGFsZ2VicmFpYyhtb3Zlc1tpXS5mcm9tKSAmJlxuICAgICAgICAgICAgbW92ZS50byA9PT0gYWxnZWJyYWljKG1vdmVzW2ldLnRvKSAmJlxuICAgICAgICAgICAgKCEoJ3Byb21vdGlvbicgaW4gbW92ZXNbaV0pIHx8XG4gICAgICAgICAgICAgIG1vdmUucHJvbW90aW9uID09PSBtb3Zlc1tpXS5wcm9tb3Rpb24pXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBtb3ZlX29iaiA9IG1vdmVzW2ldXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvKiBmYWlsZWQgdG8gZmluZCBtb3ZlICovXG4gICAgICBpZiAoIW1vdmVfb2JqKSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9XG5cbiAgICAgIC8qIG5lZWQgdG8gbWFrZSBhIGNvcHkgb2YgbW92ZSBiZWNhdXNlIHdlIGNhbid0IGdlbmVyYXRlIFNBTiBhZnRlciB0aGVcbiAgICAgICAqIG1vdmUgaXMgbWFkZVxuICAgICAgICovXG4gICAgICB2YXIgcHJldHR5X21vdmUgPSBtYWtlX3ByZXR0eShtb3ZlX29iailcblxuICAgICAgbWFrZV9tb3ZlKG1vdmVfb2JqKVxuXG4gICAgICByZXR1cm4gcHJldHR5X21vdmVcbiAgICB9LFxuXG4gICAgdW5kbzogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG1vdmUgPSB1bmRvX21vdmUoKVxuICAgICAgcmV0dXJuIG1vdmUgPyBtYWtlX3ByZXR0eShtb3ZlKSA6IG51bGxcbiAgICB9LFxuXG4gICAgY2xlYXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBjbGVhcigpXG4gICAgfSxcblxuICAgIHB1dDogZnVuY3Rpb24gKHBpZWNlLCBzcXVhcmUpIHtcbiAgICAgIHJldHVybiBwdXQocGllY2UsIHNxdWFyZSlcbiAgICB9LFxuXG4gICAgZ2V0OiBmdW5jdGlvbiAoc3F1YXJlKSB7XG4gICAgICByZXR1cm4gZ2V0KHNxdWFyZSlcbiAgICB9LFxuXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiAoc3F1YXJlKSB7XG4gICAgICByZXR1cm4gcmVtb3ZlKHNxdWFyZSlcbiAgICB9LFxuXG4gICAgcGVyZnQ6IGZ1bmN0aW9uIChkZXB0aCkge1xuICAgICAgcmV0dXJuIHBlcmZ0KGRlcHRoKVxuICAgIH0sXG5cbiAgICBzcXVhcmVfY29sb3I6IGZ1bmN0aW9uIChzcXVhcmUpIHtcbiAgICAgIGlmIChzcXVhcmUgaW4gU1FVQVJFUykge1xuICAgICAgICB2YXIgc3FfMHg4OCA9IFNRVUFSRVNbc3F1YXJlXVxuICAgICAgICByZXR1cm4gKHJhbmsoc3FfMHg4OCkgKyBmaWxlKHNxXzB4ODgpKSAlIDIgPT09IDAgPyAnbGlnaHQnIDogJ2RhcmsnXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsXG4gICAgfSxcblxuICAgIGhpc3Rvcnk6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICB2YXIgcmV2ZXJzZWRfaGlzdG9yeSA9IFtdXG4gICAgICB2YXIgbW92ZV9oaXN0b3J5ID0gW11cbiAgICAgIHZhciB2ZXJib3NlID1cbiAgICAgICAgdHlwZW9mIG9wdGlvbnMgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICd2ZXJib3NlJyBpbiBvcHRpb25zICYmXG4gICAgICAgIG9wdGlvbnMudmVyYm9zZVxuXG4gICAgICB3aGlsZSAoaGlzdG9yeS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldmVyc2VkX2hpc3RvcnkucHVzaCh1bmRvX21vdmUoKSlcbiAgICAgIH1cblxuICAgICAgd2hpbGUgKHJldmVyc2VkX2hpc3RvcnkubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgbW92ZSA9IHJldmVyc2VkX2hpc3RvcnkucG9wKClcbiAgICAgICAgaWYgKHZlcmJvc2UpIHtcbiAgICAgICAgICBtb3ZlX2hpc3RvcnkucHVzaChtYWtlX3ByZXR0eShtb3ZlKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtb3ZlX2hpc3RvcnkucHVzaChtb3ZlX3RvX3Nhbihtb3ZlLCBnZW5lcmF0ZV9tb3Zlcyh7IGxlZ2FsOiB0cnVlIH0pKSlcbiAgICAgICAgfVxuICAgICAgICBtYWtlX21vdmUobW92ZSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG1vdmVfaGlzdG9yeVxuICAgIH0sXG5cbiAgICBnZXRfY29tbWVudDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGNvbW1lbnRzW2dlbmVyYXRlX2ZlbigpXVxuICAgIH0sXG5cbiAgICBzZXRfY29tbWVudDogZnVuY3Rpb24gKGNvbW1lbnQpIHtcbiAgICAgIGNvbW1lbnRzW2dlbmVyYXRlX2ZlbigpXSA9IGNvbW1lbnQucmVwbGFjZSgneycsICdbJykucmVwbGFjZSgnfScsICddJylcbiAgICB9LFxuXG4gICAgZGVsZXRlX2NvbW1lbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjb21tZW50ID0gY29tbWVudHNbZ2VuZXJhdGVfZmVuKCldXG4gICAgICBkZWxldGUgY29tbWVudHNbZ2VuZXJhdGVfZmVuKCldXG4gICAgICByZXR1cm4gY29tbWVudFxuICAgIH0sXG5cbiAgICBnZXRfY29tbWVudHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHBydW5lX2NvbW1lbnRzKClcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhjb21tZW50cykubWFwKGZ1bmN0aW9uIChmZW4pIHtcbiAgICAgICAgcmV0dXJuIHsgZmVuOiBmZW4sIGNvbW1lbnQ6IGNvbW1lbnRzW2Zlbl0gfVxuICAgICAgfSlcbiAgICB9LFxuXG4gICAgZGVsZXRlX2NvbW1lbnRzOiBmdW5jdGlvbiAoKSB7XG4gICAgICBwcnVuZV9jb21tZW50cygpXG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMoY29tbWVudHMpLm1hcChmdW5jdGlvbiAoZmVuKSB7XG4gICAgICAgIHZhciBjb21tZW50ID0gY29tbWVudHNbZmVuXVxuICAgICAgICBkZWxldGUgY29tbWVudHNbZmVuXVxuICAgICAgICByZXR1cm4geyBmZW46IGZlbiwgY29tbWVudDogY29tbWVudCB9XG4gICAgICB9KVxuICAgIH0sXG4gIH1cbn1cblxuLyogZXhwb3J0IENoZXNzIG9iamVjdCBpZiB1c2luZyBub2RlIG9yIGFueSBvdGhlciBDb21tb25KUyBjb21wYXRpYmxlXG4gKiBlbnZpcm9ubWVudCAqL1xuaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykgZXhwb3J0cy5DaGVzcyA9IENoZXNzXG4vKiBleHBvcnQgQ2hlc3Mgb2JqZWN0IGZvciBhbnkgUmVxdWlyZUpTIGNvbXBhdGlibGUgZW52aXJvbm1lbnQgKi9cbmlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJylcbiAgZGVmaW5lKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gQ2hlc3NcbiAgfSlcbiIsImV4cG9ydCBjb25zdCBjb2xvcnMgPSBbJ3doaXRlJywgJ2JsYWNrJ107XG5leHBvcnQgY29uc3QgZmlsZXMgPSBbJ2EnLCAnYicsICdjJywgJ2QnLCAnZScsICdmJywgJ2cnLCAnaCddO1xuZXhwb3J0IGNvbnN0IHJhbmtzID0gWycxJywgJzInLCAnMycsICc0JywgJzUnLCAnNicsICc3JywgJzgnXTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXR5cGVzLmpzLm1hcCIsImltcG9ydCAqIGFzIGNnIGZyb20gJy4vdHlwZXMuanMnO1xuZXhwb3J0IGNvbnN0IGludlJhbmtzID0gWy4uLmNnLnJhbmtzXS5yZXZlcnNlKCk7XG5leHBvcnQgY29uc3QgYWxsS2V5cyA9IEFycmF5LnByb3RvdHlwZS5jb25jYXQoLi4uY2cuZmlsZXMubWFwKGMgPT4gY2cucmFua3MubWFwKHIgPT4gYyArIHIpKSk7XG5leHBvcnQgY29uc3QgcG9zMmtleSA9IChwb3MpID0+IGFsbEtleXNbOCAqIHBvc1swXSArIHBvc1sxXV07XG5leHBvcnQgY29uc3Qga2V5MnBvcyA9IChrKSA9PiBbay5jaGFyQ29kZUF0KDApIC0gOTcsIGsuY2hhckNvZGVBdCgxKSAtIDQ5XTtcbmV4cG9ydCBjb25zdCBhbGxQb3MgPSBhbGxLZXlzLm1hcChrZXkycG9zKTtcbmV4cG9ydCBmdW5jdGlvbiBtZW1vKGYpIHtcbiAgICBsZXQgdjtcbiAgICBjb25zdCByZXQgPSAoKSA9PiB7XG4gICAgICAgIGlmICh2ID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB2ID0gZigpO1xuICAgICAgICByZXR1cm4gdjtcbiAgICB9O1xuICAgIHJldC5jbGVhciA9ICgpID0+IHtcbiAgICAgICAgdiA9IHVuZGVmaW5lZDtcbiAgICB9O1xuICAgIHJldHVybiByZXQ7XG59XG5leHBvcnQgY29uc3QgdGltZXIgPSAoKSA9PiB7XG4gICAgbGV0IHN0YXJ0QXQ7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RhcnQoKSB7XG4gICAgICAgICAgICBzdGFydEF0ID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIH0sXG4gICAgICAgIGNhbmNlbCgpIHtcbiAgICAgICAgICAgIHN0YXJ0QXQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH0sXG4gICAgICAgIHN0b3AoKSB7XG4gICAgICAgICAgICBpZiAoIXN0YXJ0QXQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICBjb25zdCB0aW1lID0gcGVyZm9ybWFuY2Uubm93KCkgLSBzdGFydEF0O1xuICAgICAgICAgICAgc3RhcnRBdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHJldHVybiB0aW1lO1xuICAgICAgICB9LFxuICAgIH07XG59O1xuZXhwb3J0IGNvbnN0IG9wcG9zaXRlID0gKGMpID0+IChjID09PSAnd2hpdGUnID8gJ2JsYWNrJyA6ICd3aGl0ZScpO1xuZXhwb3J0IGNvbnN0IGRpc3RhbmNlU3EgPSAocG9zMSwgcG9zMikgPT4ge1xuICAgIGNvbnN0IGR4ID0gcG9zMVswXSAtIHBvczJbMF0sIGR5ID0gcG9zMVsxXSAtIHBvczJbMV07XG4gICAgcmV0dXJuIGR4ICogZHggKyBkeSAqIGR5O1xufTtcbmV4cG9ydCBjb25zdCBzYW1lUGllY2UgPSAocDEsIHAyKSA9PiBwMS5yb2xlID09PSBwMi5yb2xlICYmIHAxLmNvbG9yID09PSBwMi5jb2xvcjtcbmV4cG9ydCBjb25zdCBwb3NUb1RyYW5zbGF0ZSA9IChib3VuZHMpID0+IChwb3MsIGFzV2hpdGUpID0+IFsoKGFzV2hpdGUgPyBwb3NbMF0gOiA3IC0gcG9zWzBdKSAqIGJvdW5kcy53aWR0aCkgLyA4LCAoKGFzV2hpdGUgPyA3IC0gcG9zWzFdIDogcG9zWzFdKSAqIGJvdW5kcy5oZWlnaHQpIC8gOF07XG5leHBvcnQgY29uc3QgdHJhbnNsYXRlID0gKGVsLCBwb3MpID0+IHtcbiAgICBlbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7cG9zWzBdfXB4LCR7cG9zWzFdfXB4KWA7XG59O1xuZXhwb3J0IGNvbnN0IHRyYW5zbGF0ZUFuZFNjYWxlID0gKGVsLCBwb3MsIHNjYWxlID0gMSkgPT4ge1xuICAgIGVsLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHtwb3NbMF19cHgsJHtwb3NbMV19cHgpIHNjYWxlKCR7c2NhbGV9KWA7XG59O1xuZXhwb3J0IGNvbnN0IHNldFZpc2libGUgPSAoZWwsIHYpID0+IHtcbiAgICBlbC5zdHlsZS52aXNpYmlsaXR5ID0gdiA/ICd2aXNpYmxlJyA6ICdoaWRkZW4nO1xufTtcbmV4cG9ydCBjb25zdCBldmVudFBvc2l0aW9uID0gKGUpID0+IHtcbiAgICB2YXIgX2E7XG4gICAgaWYgKGUuY2xpZW50WCB8fCBlLmNsaWVudFggPT09IDApXG4gICAgICAgIHJldHVybiBbZS5jbGllbnRYLCBlLmNsaWVudFldO1xuICAgIGlmICgoX2EgPSBlLnRhcmdldFRvdWNoZXMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYVswXSlcbiAgICAgICAgcmV0dXJuIFtlLnRhcmdldFRvdWNoZXNbMF0uY2xpZW50WCwgZS50YXJnZXRUb3VjaGVzWzBdLmNsaWVudFldO1xuICAgIHJldHVybjsgLy8gdG91Y2hlbmQgaGFzIG5vIHBvc2l0aW9uIVxufTtcbmV4cG9ydCBjb25zdCBpc1JpZ2h0QnV0dG9uID0gKGUpID0+IGUuYnV0dG9ucyA9PT0gMiB8fCBlLmJ1dHRvbiA9PT0gMjtcbmV4cG9ydCBjb25zdCBjcmVhdGVFbCA9ICh0YWdOYW1lLCBjbGFzc05hbWUpID0+IHtcbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSk7XG4gICAgaWYgKGNsYXNzTmFtZSlcbiAgICAgICAgZWwuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICAgIHJldHVybiBlbDtcbn07XG5leHBvcnQgZnVuY3Rpb24gY29tcHV0ZVNxdWFyZUNlbnRlcihrZXksIGFzV2hpdGUsIGJvdW5kcykge1xuICAgIGNvbnN0IHBvcyA9IGtleTJwb3Moa2V5KTtcbiAgICBpZiAoIWFzV2hpdGUpIHtcbiAgICAgICAgcG9zWzBdID0gNyAtIHBvc1swXTtcbiAgICAgICAgcG9zWzFdID0gNyAtIHBvc1sxXTtcbiAgICB9XG4gICAgcmV0dXJuIFtcbiAgICAgICAgYm91bmRzLmxlZnQgKyAoYm91bmRzLndpZHRoICogcG9zWzBdKSAvIDggKyBib3VuZHMud2lkdGggLyAxNixcbiAgICAgICAgYm91bmRzLnRvcCArIChib3VuZHMuaGVpZ2h0ICogKDcgLSBwb3NbMV0pKSAvIDggKyBib3VuZHMuaGVpZ2h0IC8gMTYsXG4gICAgXTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXV0aWwuanMubWFwIiwiaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuL3V0aWwuanMnO1xuZnVuY3Rpb24gZGlmZihhLCBiKSB7XG4gICAgcmV0dXJuIE1hdGguYWJzKGEgLSBiKTtcbn1cbmZ1bmN0aW9uIHBhd24oY29sb3IpIHtcbiAgICByZXR1cm4gKHgxLCB5MSwgeDIsIHkyKSA9PiBkaWZmKHgxLCB4MikgPCAyICYmXG4gICAgICAgIChjb2xvciA9PT0gJ3doaXRlJ1xuICAgICAgICAgICAgPyAvLyBhbGxvdyAyIHNxdWFyZXMgZnJvbSBmaXJzdCB0d28gcmFua3MsIGZvciBob3JkZVxuICAgICAgICAgICAgICAgIHkyID09PSB5MSArIDEgfHwgKHkxIDw9IDEgJiYgeTIgPT09IHkxICsgMiAmJiB4MSA9PT0geDIpXG4gICAgICAgICAgICA6IHkyID09PSB5MSAtIDEgfHwgKHkxID49IDYgJiYgeTIgPT09IHkxIC0gMiAmJiB4MSA9PT0geDIpKTtcbn1cbmV4cG9ydCBjb25zdCBrbmlnaHQgPSAoeDEsIHkxLCB4MiwgeTIpID0+IHtcbiAgICBjb25zdCB4ZCA9IGRpZmYoeDEsIHgyKTtcbiAgICBjb25zdCB5ZCA9IGRpZmYoeTEsIHkyKTtcbiAgICByZXR1cm4gKHhkID09PSAxICYmIHlkID09PSAyKSB8fCAoeGQgPT09IDIgJiYgeWQgPT09IDEpO1xufTtcbmNvbnN0IGJpc2hvcCA9ICh4MSwgeTEsIHgyLCB5MikgPT4ge1xuICAgIHJldHVybiBkaWZmKHgxLCB4MikgPT09IGRpZmYoeTEsIHkyKTtcbn07XG5jb25zdCByb29rID0gKHgxLCB5MSwgeDIsIHkyKSA9PiB7XG4gICAgcmV0dXJuIHgxID09PSB4MiB8fCB5MSA9PT0geTI7XG59O1xuZXhwb3J0IGNvbnN0IHF1ZWVuID0gKHgxLCB5MSwgeDIsIHkyKSA9PiB7XG4gICAgcmV0dXJuIGJpc2hvcCh4MSwgeTEsIHgyLCB5MikgfHwgcm9vayh4MSwgeTEsIHgyLCB5Mik7XG59O1xuZnVuY3Rpb24ga2luZyhjb2xvciwgcm9va0ZpbGVzLCBjYW5DYXN0bGUpIHtcbiAgICByZXR1cm4gKHgxLCB5MSwgeDIsIHkyKSA9PiAoZGlmZih4MSwgeDIpIDwgMiAmJiBkaWZmKHkxLCB5MikgPCAyKSB8fFxuICAgICAgICAoY2FuQ2FzdGxlICYmXG4gICAgICAgICAgICB5MSA9PT0geTIgJiZcbiAgICAgICAgICAgIHkxID09PSAoY29sb3IgPT09ICd3aGl0ZScgPyAwIDogNykgJiZcbiAgICAgICAgICAgICgoeDEgPT09IDQgJiYgKCh4MiA9PT0gMiAmJiByb29rRmlsZXMuaW5jbHVkZXMoMCkpIHx8ICh4MiA9PT0gNiAmJiByb29rRmlsZXMuaW5jbHVkZXMoNykpKSkgfHxcbiAgICAgICAgICAgICAgICByb29rRmlsZXMuaW5jbHVkZXMoeDIpKSk7XG59XG5mdW5jdGlvbiByb29rRmlsZXNPZihwaWVjZXMsIGNvbG9yKSB7XG4gICAgY29uc3QgYmFja3JhbmsgPSBjb2xvciA9PT0gJ3doaXRlJyA/ICcxJyA6ICc4JztcbiAgICBjb25zdCBmaWxlcyA9IFtdO1xuICAgIGZvciAoY29uc3QgW2tleSwgcGllY2VdIG9mIHBpZWNlcykge1xuICAgICAgICBpZiAoa2V5WzFdID09PSBiYWNrcmFuayAmJiBwaWVjZS5jb2xvciA9PT0gY29sb3IgJiYgcGllY2Uucm9sZSA9PT0gJ3Jvb2snKSB7XG4gICAgICAgICAgICBmaWxlcy5wdXNoKHV0aWwua2V5MnBvcyhrZXkpWzBdKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmlsZXM7XG59XG5leHBvcnQgZnVuY3Rpb24gcHJlbW92ZShwaWVjZXMsIGtleSwgY2FuQ2FzdGxlKSB7XG4gICAgY29uc3QgcGllY2UgPSBwaWVjZXMuZ2V0KGtleSk7XG4gICAgaWYgKCFwaWVjZSlcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIGNvbnN0IHBvcyA9IHV0aWwua2V5MnBvcyhrZXkpLCByID0gcGllY2Uucm9sZSwgbW9iaWxpdHkgPSByID09PSAncGF3bidcbiAgICAgICAgPyBwYXduKHBpZWNlLmNvbG9yKVxuICAgICAgICA6IHIgPT09ICdrbmlnaHQnXG4gICAgICAgICAgICA/IGtuaWdodFxuICAgICAgICAgICAgOiByID09PSAnYmlzaG9wJ1xuICAgICAgICAgICAgICAgID8gYmlzaG9wXG4gICAgICAgICAgICAgICAgOiByID09PSAncm9vaydcbiAgICAgICAgICAgICAgICAgICAgPyByb29rXG4gICAgICAgICAgICAgICAgICAgIDogciA9PT0gJ3F1ZWVuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgPyBxdWVlblxuICAgICAgICAgICAgICAgICAgICAgICAgOiBraW5nKHBpZWNlLmNvbG9yLCByb29rRmlsZXNPZihwaWVjZXMsIHBpZWNlLmNvbG9yKSwgY2FuQ2FzdGxlKTtcbiAgICByZXR1cm4gdXRpbC5hbGxQb3NcbiAgICAgICAgLmZpbHRlcihwb3MyID0+IChwb3NbMF0gIT09IHBvczJbMF0gfHwgcG9zWzFdICE9PSBwb3MyWzFdKSAmJiBtb2JpbGl0eShwb3NbMF0sIHBvc1sxXSwgcG9zMlswXSwgcG9zMlsxXSkpXG4gICAgICAgIC5tYXAodXRpbC5wb3Mya2V5KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXByZW1vdmUuanMubWFwIiwiaW1wb3J0IHsgcG9zMmtleSwga2V5MnBvcywgb3Bwb3NpdGUsIGRpc3RhbmNlU3EsIGFsbFBvcywgY29tcHV0ZVNxdWFyZUNlbnRlciB9IGZyb20gJy4vdXRpbC5qcyc7XG5pbXBvcnQgeyBwcmVtb3ZlLCBxdWVlbiwga25pZ2h0IH0gZnJvbSAnLi9wcmVtb3ZlLmpzJztcbmV4cG9ydCBmdW5jdGlvbiBjYWxsVXNlckZ1bmN0aW9uKGYsIC4uLmFyZ3MpIHtcbiAgICBpZiAoZilcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiBmKC4uLmFyZ3MpLCAxKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB0b2dnbGVPcmllbnRhdGlvbihzdGF0ZSkge1xuICAgIHN0YXRlLm9yaWVudGF0aW9uID0gb3Bwb3NpdGUoc3RhdGUub3JpZW50YXRpb24pO1xuICAgIHN0YXRlLmFuaW1hdGlvbi5jdXJyZW50ID0gc3RhdGUuZHJhZ2dhYmxlLmN1cnJlbnQgPSBzdGF0ZS5zZWxlY3RlZCA9IHVuZGVmaW5lZDtcbn1cbmV4cG9ydCBmdW5jdGlvbiByZXNldChzdGF0ZSkge1xuICAgIHN0YXRlLmxhc3RNb3ZlID0gdW5kZWZpbmVkO1xuICAgIHVuc2VsZWN0KHN0YXRlKTtcbiAgICB1bnNldFByZW1vdmUoc3RhdGUpO1xuICAgIHVuc2V0UHJlZHJvcChzdGF0ZSk7XG59XG5leHBvcnQgZnVuY3Rpb24gc2V0UGllY2VzKHN0YXRlLCBwaWVjZXMpIHtcbiAgICBmb3IgKGNvbnN0IFtrZXksIHBpZWNlXSBvZiBwaWVjZXMpIHtcbiAgICAgICAgaWYgKHBpZWNlKVxuICAgICAgICAgICAgc3RhdGUucGllY2VzLnNldChrZXksIHBpZWNlKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgc3RhdGUucGllY2VzLmRlbGV0ZShrZXkpO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBzZXRDaGVjayhzdGF0ZSwgY29sb3IpIHtcbiAgICBzdGF0ZS5jaGVjayA9IHVuZGVmaW5lZDtcbiAgICBpZiAoY29sb3IgPT09IHRydWUpXG4gICAgICAgIGNvbG9yID0gc3RhdGUudHVybkNvbG9yO1xuICAgIGlmIChjb2xvcilcbiAgICAgICAgZm9yIChjb25zdCBbaywgcF0gb2Ygc3RhdGUucGllY2VzKSB7XG4gICAgICAgICAgICBpZiAocC5yb2xlID09PSAna2luZycgJiYgcC5jb2xvciA9PT0gY29sb3IpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5jaGVjayA9IGs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbn1cbmZ1bmN0aW9uIHNldFByZW1vdmUoc3RhdGUsIG9yaWcsIGRlc3QsIG1ldGEpIHtcbiAgICB1bnNldFByZWRyb3Aoc3RhdGUpO1xuICAgIHN0YXRlLnByZW1vdmFibGUuY3VycmVudCA9IFtvcmlnLCBkZXN0XTtcbiAgICBjYWxsVXNlckZ1bmN0aW9uKHN0YXRlLnByZW1vdmFibGUuZXZlbnRzLnNldCwgb3JpZywgZGVzdCwgbWV0YSk7XG59XG5leHBvcnQgZnVuY3Rpb24gdW5zZXRQcmVtb3ZlKHN0YXRlKSB7XG4gICAgaWYgKHN0YXRlLnByZW1vdmFibGUuY3VycmVudCkge1xuICAgICAgICBzdGF0ZS5wcmVtb3ZhYmxlLmN1cnJlbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgIGNhbGxVc2VyRnVuY3Rpb24oc3RhdGUucHJlbW92YWJsZS5ldmVudHMudW5zZXQpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHNldFByZWRyb3Aoc3RhdGUsIHJvbGUsIGtleSkge1xuICAgIHVuc2V0UHJlbW92ZShzdGF0ZSk7XG4gICAgc3RhdGUucHJlZHJvcHBhYmxlLmN1cnJlbnQgPSB7IHJvbGUsIGtleSB9O1xuICAgIGNhbGxVc2VyRnVuY3Rpb24oc3RhdGUucHJlZHJvcHBhYmxlLmV2ZW50cy5zZXQsIHJvbGUsIGtleSk7XG59XG5leHBvcnQgZnVuY3Rpb24gdW5zZXRQcmVkcm9wKHN0YXRlKSB7XG4gICAgY29uc3QgcGQgPSBzdGF0ZS5wcmVkcm9wcGFibGU7XG4gICAgaWYgKHBkLmN1cnJlbnQpIHtcbiAgICAgICAgcGQuY3VycmVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgY2FsbFVzZXJGdW5jdGlvbihwZC5ldmVudHMudW5zZXQpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHRyeUF1dG9DYXN0bGUoc3RhdGUsIG9yaWcsIGRlc3QpIHtcbiAgICBpZiAoIXN0YXRlLmF1dG9DYXN0bGUpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBraW5nID0gc3RhdGUucGllY2VzLmdldChvcmlnKTtcbiAgICBpZiAoIWtpbmcgfHwga2luZy5yb2xlICE9PSAna2luZycpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBvcmlnUG9zID0ga2V5MnBvcyhvcmlnKTtcbiAgICBjb25zdCBkZXN0UG9zID0ga2V5MnBvcyhkZXN0KTtcbiAgICBpZiAoKG9yaWdQb3NbMV0gIT09IDAgJiYgb3JpZ1Bvc1sxXSAhPT0gNykgfHwgb3JpZ1Bvc1sxXSAhPT0gZGVzdFBvc1sxXSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChvcmlnUG9zWzBdID09PSA0ICYmICFzdGF0ZS5waWVjZXMuaGFzKGRlc3QpKSB7XG4gICAgICAgIGlmIChkZXN0UG9zWzBdID09PSA2KVxuICAgICAgICAgICAgZGVzdCA9IHBvczJrZXkoWzcsIGRlc3RQb3NbMV1dKTtcbiAgICAgICAgZWxzZSBpZiAoZGVzdFBvc1swXSA9PT0gMilcbiAgICAgICAgICAgIGRlc3QgPSBwb3Mya2V5KFswLCBkZXN0UG9zWzFdXSk7XG4gICAgfVxuICAgIGNvbnN0IHJvb2sgPSBzdGF0ZS5waWVjZXMuZ2V0KGRlc3QpO1xuICAgIGlmICghcm9vayB8fCByb29rLmNvbG9yICE9PSBraW5nLmNvbG9yIHx8IHJvb2sucm9sZSAhPT0gJ3Jvb2snKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgc3RhdGUucGllY2VzLmRlbGV0ZShvcmlnKTtcbiAgICBzdGF0ZS5waWVjZXMuZGVsZXRlKGRlc3QpO1xuICAgIGlmIChvcmlnUG9zWzBdIDwgZGVzdFBvc1swXSkge1xuICAgICAgICBzdGF0ZS5waWVjZXMuc2V0KHBvczJrZXkoWzYsIGRlc3RQb3NbMV1dKSwga2luZyk7XG4gICAgICAgIHN0YXRlLnBpZWNlcy5zZXQocG9zMmtleShbNSwgZGVzdFBvc1sxXV0pLCByb29rKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHN0YXRlLnBpZWNlcy5zZXQocG9zMmtleShbMiwgZGVzdFBvc1sxXV0pLCBraW5nKTtcbiAgICAgICAgc3RhdGUucGllY2VzLnNldChwb3Mya2V5KFszLCBkZXN0UG9zWzFdXSksIHJvb2spO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBiYXNlTW92ZShzdGF0ZSwgb3JpZywgZGVzdCkge1xuICAgIGNvbnN0IG9yaWdQaWVjZSA9IHN0YXRlLnBpZWNlcy5nZXQob3JpZyksIGRlc3RQaWVjZSA9IHN0YXRlLnBpZWNlcy5nZXQoZGVzdCk7XG4gICAgaWYgKG9yaWcgPT09IGRlc3QgfHwgIW9yaWdQaWVjZSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGNhcHR1cmVkID0gZGVzdFBpZWNlICYmIGRlc3RQaWVjZS5jb2xvciAhPT0gb3JpZ1BpZWNlLmNvbG9yID8gZGVzdFBpZWNlIDogdW5kZWZpbmVkO1xuICAgIGlmIChkZXN0ID09PSBzdGF0ZS5zZWxlY3RlZClcbiAgICAgICAgdW5zZWxlY3Qoc3RhdGUpO1xuICAgIGNhbGxVc2VyRnVuY3Rpb24oc3RhdGUuZXZlbnRzLm1vdmUsIG9yaWcsIGRlc3QsIGNhcHR1cmVkKTtcbiAgICBpZiAoIXRyeUF1dG9DYXN0bGUoc3RhdGUsIG9yaWcsIGRlc3QpKSB7XG4gICAgICAgIHN0YXRlLnBpZWNlcy5zZXQoZGVzdCwgb3JpZ1BpZWNlKTtcbiAgICAgICAgc3RhdGUucGllY2VzLmRlbGV0ZShvcmlnKTtcbiAgICB9XG4gICAgc3RhdGUubGFzdE1vdmUgPSBbb3JpZywgZGVzdF07XG4gICAgc3RhdGUuY2hlY2sgPSB1bmRlZmluZWQ7XG4gICAgY2FsbFVzZXJGdW5jdGlvbihzdGF0ZS5ldmVudHMuY2hhbmdlKTtcbiAgICByZXR1cm4gY2FwdHVyZWQgfHwgdHJ1ZTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBiYXNlTmV3UGllY2Uoc3RhdGUsIHBpZWNlLCBrZXksIGZvcmNlKSB7XG4gICAgaWYgKHN0YXRlLnBpZWNlcy5oYXMoa2V5KSkge1xuICAgICAgICBpZiAoZm9yY2UpXG4gICAgICAgICAgICBzdGF0ZS5waWVjZXMuZGVsZXRlKGtleSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY2FsbFVzZXJGdW5jdGlvbihzdGF0ZS5ldmVudHMuZHJvcE5ld1BpZWNlLCBwaWVjZSwga2V5KTtcbiAgICBzdGF0ZS5waWVjZXMuc2V0KGtleSwgcGllY2UpO1xuICAgIHN0YXRlLmxhc3RNb3ZlID0gW2tleV07XG4gICAgc3RhdGUuY2hlY2sgPSB1bmRlZmluZWQ7XG4gICAgY2FsbFVzZXJGdW5jdGlvbihzdGF0ZS5ldmVudHMuY2hhbmdlKTtcbiAgICBzdGF0ZS5tb3ZhYmxlLmRlc3RzID0gdW5kZWZpbmVkO1xuICAgIHN0YXRlLnR1cm5Db2xvciA9IG9wcG9zaXRlKHN0YXRlLnR1cm5Db2xvcik7XG4gICAgcmV0dXJuIHRydWU7XG59XG5mdW5jdGlvbiBiYXNlVXNlck1vdmUoc3RhdGUsIG9yaWcsIGRlc3QpIHtcbiAgICBjb25zdCByZXN1bHQgPSBiYXNlTW92ZShzdGF0ZSwgb3JpZywgZGVzdCk7XG4gICAgaWYgKHJlc3VsdCkge1xuICAgICAgICBzdGF0ZS5tb3ZhYmxlLmRlc3RzID0gdW5kZWZpbmVkO1xuICAgICAgICBzdGF0ZS50dXJuQ29sb3IgPSBvcHBvc2l0ZShzdGF0ZS50dXJuQ29sb3IpO1xuICAgICAgICBzdGF0ZS5hbmltYXRpb24uY3VycmVudCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmV4cG9ydCBmdW5jdGlvbiB1c2VyTW92ZShzdGF0ZSwgb3JpZywgZGVzdCkge1xuICAgIGlmIChjYW5Nb3ZlKHN0YXRlLCBvcmlnLCBkZXN0KSkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBiYXNlVXNlck1vdmUoc3RhdGUsIG9yaWcsIGRlc3QpO1xuICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICBjb25zdCBob2xkVGltZSA9IHN0YXRlLmhvbGQuc3RvcCgpO1xuICAgICAgICAgICAgdW5zZWxlY3Qoc3RhdGUpO1xuICAgICAgICAgICAgY29uc3QgbWV0YWRhdGEgPSB7XG4gICAgICAgICAgICAgICAgcHJlbW92ZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgY3RybEtleTogc3RhdGUuc3RhdHMuY3RybEtleSxcbiAgICAgICAgICAgICAgICBob2xkVGltZSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAocmVzdWx0ICE9PSB0cnVlKVxuICAgICAgICAgICAgICAgIG1ldGFkYXRhLmNhcHR1cmVkID0gcmVzdWx0O1xuICAgICAgICAgICAgY2FsbFVzZXJGdW5jdGlvbihzdGF0ZS5tb3ZhYmxlLmV2ZW50cy5hZnRlciwgb3JpZywgZGVzdCwgbWV0YWRhdGEpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoY2FuUHJlbW92ZShzdGF0ZSwgb3JpZywgZGVzdCkpIHtcbiAgICAgICAgc2V0UHJlbW92ZShzdGF0ZSwgb3JpZywgZGVzdCwge1xuICAgICAgICAgICAgY3RybEtleTogc3RhdGUuc3RhdHMuY3RybEtleSxcbiAgICAgICAgfSk7XG4gICAgICAgIHVuc2VsZWN0KHN0YXRlKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHVuc2VsZWN0KHN0YXRlKTtcbiAgICByZXR1cm4gZmFsc2U7XG59XG5leHBvcnQgZnVuY3Rpb24gZHJvcE5ld1BpZWNlKHN0YXRlLCBvcmlnLCBkZXN0LCBmb3JjZSkge1xuICAgIGNvbnN0IHBpZWNlID0gc3RhdGUucGllY2VzLmdldChvcmlnKTtcbiAgICBpZiAocGllY2UgJiYgKGNhbkRyb3Aoc3RhdGUsIG9yaWcsIGRlc3QpIHx8IGZvcmNlKSkge1xuICAgICAgICBzdGF0ZS5waWVjZXMuZGVsZXRlKG9yaWcpO1xuICAgICAgICBiYXNlTmV3UGllY2Uoc3RhdGUsIHBpZWNlLCBkZXN0LCBmb3JjZSk7XG4gICAgICAgIGNhbGxVc2VyRnVuY3Rpb24oc3RhdGUubW92YWJsZS5ldmVudHMuYWZ0ZXJOZXdQaWVjZSwgcGllY2Uucm9sZSwgZGVzdCwge1xuICAgICAgICAgICAgcHJlbW92ZTogZmFsc2UsXG4gICAgICAgICAgICBwcmVkcm9wOiBmYWxzZSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHBpZWNlICYmIGNhblByZWRyb3Aoc3RhdGUsIG9yaWcsIGRlc3QpKSB7XG4gICAgICAgIHNldFByZWRyb3Aoc3RhdGUsIHBpZWNlLnJvbGUsIGRlc3QpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdW5zZXRQcmVtb3ZlKHN0YXRlKTtcbiAgICAgICAgdW5zZXRQcmVkcm9wKHN0YXRlKTtcbiAgICB9XG4gICAgc3RhdGUucGllY2VzLmRlbGV0ZShvcmlnKTtcbiAgICB1bnNlbGVjdChzdGF0ZSk7XG59XG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0U3F1YXJlKHN0YXRlLCBrZXksIGZvcmNlKSB7XG4gICAgY2FsbFVzZXJGdW5jdGlvbihzdGF0ZS5ldmVudHMuc2VsZWN0LCBrZXkpO1xuICAgIGlmIChzdGF0ZS5zZWxlY3RlZCkge1xuICAgICAgICBpZiAoc3RhdGUuc2VsZWN0ZWQgPT09IGtleSAmJiAhc3RhdGUuZHJhZ2dhYmxlLmVuYWJsZWQpIHtcbiAgICAgICAgICAgIHVuc2VsZWN0KHN0YXRlKTtcbiAgICAgICAgICAgIHN0YXRlLmhvbGQuY2FuY2VsKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoKHN0YXRlLnNlbGVjdGFibGUuZW5hYmxlZCB8fCBmb3JjZSkgJiYgc3RhdGUuc2VsZWN0ZWQgIT09IGtleSkge1xuICAgICAgICAgICAgaWYgKHVzZXJNb3ZlKHN0YXRlLCBzdGF0ZS5zZWxlY3RlZCwga2V5KSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLnN0YXRzLmRyYWdnZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzTW92YWJsZShzdGF0ZSwga2V5KSB8fCBpc1ByZW1vdmFibGUoc3RhdGUsIGtleSkpIHtcbiAgICAgICAgc2V0U2VsZWN0ZWQoc3RhdGUsIGtleSk7XG4gICAgICAgIHN0YXRlLmhvbGQuc3RhcnQoKTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gc2V0U2VsZWN0ZWQoc3RhdGUsIGtleSkge1xuICAgIHN0YXRlLnNlbGVjdGVkID0ga2V5O1xuICAgIGlmIChpc1ByZW1vdmFibGUoc3RhdGUsIGtleSkpIHtcbiAgICAgICAgc3RhdGUucHJlbW92YWJsZS5kZXN0cyA9IHByZW1vdmUoc3RhdGUucGllY2VzLCBrZXksIHN0YXRlLnByZW1vdmFibGUuY2FzdGxlKTtcbiAgICB9XG4gICAgZWxzZVxuICAgICAgICBzdGF0ZS5wcmVtb3ZhYmxlLmRlc3RzID0gdW5kZWZpbmVkO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHVuc2VsZWN0KHN0YXRlKSB7XG4gICAgc3RhdGUuc2VsZWN0ZWQgPSB1bmRlZmluZWQ7XG4gICAgc3RhdGUucHJlbW92YWJsZS5kZXN0cyA9IHVuZGVmaW5lZDtcbiAgICBzdGF0ZS5ob2xkLmNhbmNlbCgpO1xufVxuZnVuY3Rpb24gaXNNb3ZhYmxlKHN0YXRlLCBvcmlnKSB7XG4gICAgY29uc3QgcGllY2UgPSBzdGF0ZS5waWVjZXMuZ2V0KG9yaWcpO1xuICAgIHJldHVybiAoISFwaWVjZSAmJlxuICAgICAgICAoc3RhdGUubW92YWJsZS5jb2xvciA9PT0gJ2JvdGgnIHx8IChzdGF0ZS5tb3ZhYmxlLmNvbG9yID09PSBwaWVjZS5jb2xvciAmJiBzdGF0ZS50dXJuQ29sb3IgPT09IHBpZWNlLmNvbG9yKSkpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNhbk1vdmUoc3RhdGUsIG9yaWcsIGRlc3QpIHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIHJldHVybiAob3JpZyAhPT0gZGVzdCAmJiBpc01vdmFibGUoc3RhdGUsIG9yaWcpICYmIChzdGF0ZS5tb3ZhYmxlLmZyZWUgfHwgISEoKF9iID0gKF9hID0gc3RhdGUubW92YWJsZS5kZXN0cykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdldChvcmlnKSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmluY2x1ZGVzKGRlc3QpKSkpO1xufVxuZnVuY3Rpb24gY2FuRHJvcChzdGF0ZSwgb3JpZywgZGVzdCkge1xuICAgIGNvbnN0IHBpZWNlID0gc3RhdGUucGllY2VzLmdldChvcmlnKTtcbiAgICByZXR1cm4gKCEhcGllY2UgJiZcbiAgICAgICAgKG9yaWcgPT09IGRlc3QgfHwgIXN0YXRlLnBpZWNlcy5oYXMoZGVzdCkpICYmXG4gICAgICAgIChzdGF0ZS5tb3ZhYmxlLmNvbG9yID09PSAnYm90aCcgfHwgKHN0YXRlLm1vdmFibGUuY29sb3IgPT09IHBpZWNlLmNvbG9yICYmIHN0YXRlLnR1cm5Db2xvciA9PT0gcGllY2UuY29sb3IpKSk7XG59XG5mdW5jdGlvbiBpc1ByZW1vdmFibGUoc3RhdGUsIG9yaWcpIHtcbiAgICBjb25zdCBwaWVjZSA9IHN0YXRlLnBpZWNlcy5nZXQob3JpZyk7XG4gICAgcmV0dXJuICEhcGllY2UgJiYgc3RhdGUucHJlbW92YWJsZS5lbmFibGVkICYmIHN0YXRlLm1vdmFibGUuY29sb3IgPT09IHBpZWNlLmNvbG9yICYmIHN0YXRlLnR1cm5Db2xvciAhPT0gcGllY2UuY29sb3I7XG59XG5mdW5jdGlvbiBjYW5QcmVtb3ZlKHN0YXRlLCBvcmlnLCBkZXN0KSB7XG4gICAgcmV0dXJuIChvcmlnICE9PSBkZXN0ICYmIGlzUHJlbW92YWJsZShzdGF0ZSwgb3JpZykgJiYgcHJlbW92ZShzdGF0ZS5waWVjZXMsIG9yaWcsIHN0YXRlLnByZW1vdmFibGUuY2FzdGxlKS5pbmNsdWRlcyhkZXN0KSk7XG59XG5mdW5jdGlvbiBjYW5QcmVkcm9wKHN0YXRlLCBvcmlnLCBkZXN0KSB7XG4gICAgY29uc3QgcGllY2UgPSBzdGF0ZS5waWVjZXMuZ2V0KG9yaWcpO1xuICAgIGNvbnN0IGRlc3RQaWVjZSA9IHN0YXRlLnBpZWNlcy5nZXQoZGVzdCk7XG4gICAgcmV0dXJuICghIXBpZWNlICYmXG4gICAgICAgICghZGVzdFBpZWNlIHx8IGRlc3RQaWVjZS5jb2xvciAhPT0gc3RhdGUubW92YWJsZS5jb2xvcikgJiZcbiAgICAgICAgc3RhdGUucHJlZHJvcHBhYmxlLmVuYWJsZWQgJiZcbiAgICAgICAgKHBpZWNlLnJvbGUgIT09ICdwYXduJyB8fCAoZGVzdFsxXSAhPT0gJzEnICYmIGRlc3RbMV0gIT09ICc4JykpICYmXG4gICAgICAgIHN0YXRlLm1vdmFibGUuY29sb3IgPT09IHBpZWNlLmNvbG9yICYmXG4gICAgICAgIHN0YXRlLnR1cm5Db2xvciAhPT0gcGllY2UuY29sb3IpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzRHJhZ2dhYmxlKHN0YXRlLCBvcmlnKSB7XG4gICAgY29uc3QgcGllY2UgPSBzdGF0ZS5waWVjZXMuZ2V0KG9yaWcpO1xuICAgIHJldHVybiAoISFwaWVjZSAmJlxuICAgICAgICBzdGF0ZS5kcmFnZ2FibGUuZW5hYmxlZCAmJlxuICAgICAgICAoc3RhdGUubW92YWJsZS5jb2xvciA9PT0gJ2JvdGgnIHx8XG4gICAgICAgICAgICAoc3RhdGUubW92YWJsZS5jb2xvciA9PT0gcGllY2UuY29sb3IgJiYgKHN0YXRlLnR1cm5Db2xvciA9PT0gcGllY2UuY29sb3IgfHwgc3RhdGUucHJlbW92YWJsZS5lbmFibGVkKSkpKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBwbGF5UHJlbW92ZShzdGF0ZSkge1xuICAgIGNvbnN0IG1vdmUgPSBzdGF0ZS5wcmVtb3ZhYmxlLmN1cnJlbnQ7XG4gICAgaWYgKCFtb3ZlKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgY29uc3Qgb3JpZyA9IG1vdmVbMF0sIGRlc3QgPSBtb3ZlWzFdO1xuICAgIGxldCBzdWNjZXNzID0gZmFsc2U7XG4gICAgaWYgKGNhbk1vdmUoc3RhdGUsIG9yaWcsIGRlc3QpKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGJhc2VVc2VyTW92ZShzdGF0ZSwgb3JpZywgZGVzdCk7XG4gICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0geyBwcmVtb3ZlOiB0cnVlIH07XG4gICAgICAgICAgICBpZiAocmVzdWx0ICE9PSB0cnVlKVxuICAgICAgICAgICAgICAgIG1ldGFkYXRhLmNhcHR1cmVkID0gcmVzdWx0O1xuICAgICAgICAgICAgY2FsbFVzZXJGdW5jdGlvbihzdGF0ZS5tb3ZhYmxlLmV2ZW50cy5hZnRlciwgb3JpZywgZGVzdCwgbWV0YWRhdGEpO1xuICAgICAgICAgICAgc3VjY2VzcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdW5zZXRQcmVtb3ZlKHN0YXRlKTtcbiAgICByZXR1cm4gc3VjY2Vzcztcbn1cbmV4cG9ydCBmdW5jdGlvbiBwbGF5UHJlZHJvcChzdGF0ZSwgdmFsaWRhdGUpIHtcbiAgICBjb25zdCBkcm9wID0gc3RhdGUucHJlZHJvcHBhYmxlLmN1cnJlbnQ7XG4gICAgbGV0IHN1Y2Nlc3MgPSBmYWxzZTtcbiAgICBpZiAoIWRyb3ApXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBpZiAodmFsaWRhdGUoZHJvcCkpIHtcbiAgICAgICAgY29uc3QgcGllY2UgPSB7XG4gICAgICAgICAgICByb2xlOiBkcm9wLnJvbGUsXG4gICAgICAgICAgICBjb2xvcjogc3RhdGUubW92YWJsZS5jb2xvcixcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGJhc2VOZXdQaWVjZShzdGF0ZSwgcGllY2UsIGRyb3Aua2V5KSkge1xuICAgICAgICAgICAgY2FsbFVzZXJGdW5jdGlvbihzdGF0ZS5tb3ZhYmxlLmV2ZW50cy5hZnRlck5ld1BpZWNlLCBkcm9wLnJvbGUsIGRyb3Aua2V5LCB7XG4gICAgICAgICAgICAgICAgcHJlbW92ZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgcHJlZHJvcDogdHJ1ZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc3VjY2VzcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdW5zZXRQcmVkcm9wKHN0YXRlKTtcbiAgICByZXR1cm4gc3VjY2Vzcztcbn1cbmV4cG9ydCBmdW5jdGlvbiBjYW5jZWxNb3ZlKHN0YXRlKSB7XG4gICAgdW5zZXRQcmVtb3ZlKHN0YXRlKTtcbiAgICB1bnNldFByZWRyb3Aoc3RhdGUpO1xuICAgIHVuc2VsZWN0KHN0YXRlKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzdG9wKHN0YXRlKSB7XG4gICAgc3RhdGUubW92YWJsZS5jb2xvciA9IHN0YXRlLm1vdmFibGUuZGVzdHMgPSBzdGF0ZS5hbmltYXRpb24uY3VycmVudCA9IHVuZGVmaW5lZDtcbiAgICBjYW5jZWxNb3ZlKHN0YXRlKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRLZXlBdERvbVBvcyhwb3MsIGFzV2hpdGUsIGJvdW5kcykge1xuICAgIGxldCBmaWxlID0gTWF0aC5mbG9vcigoOCAqIChwb3NbMF0gLSBib3VuZHMubGVmdCkpIC8gYm91bmRzLndpZHRoKTtcbiAgICBpZiAoIWFzV2hpdGUpXG4gICAgICAgIGZpbGUgPSA3IC0gZmlsZTtcbiAgICBsZXQgcmFuayA9IDcgLSBNYXRoLmZsb29yKCg4ICogKHBvc1sxXSAtIGJvdW5kcy50b3ApKSAvIGJvdW5kcy5oZWlnaHQpO1xuICAgIGlmICghYXNXaGl0ZSlcbiAgICAgICAgcmFuayA9IDcgLSByYW5rO1xuICAgIHJldHVybiBmaWxlID49IDAgJiYgZmlsZSA8IDggJiYgcmFuayA+PSAwICYmIHJhbmsgPCA4ID8gcG9zMmtleShbZmlsZSwgcmFua10pIDogdW5kZWZpbmVkO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFNuYXBwZWRLZXlBdERvbVBvcyhvcmlnLCBwb3MsIGFzV2hpdGUsIGJvdW5kcykge1xuICAgIGNvbnN0IG9yaWdQb3MgPSBrZXkycG9zKG9yaWcpO1xuICAgIGNvbnN0IHZhbGlkU25hcFBvcyA9IGFsbFBvcy5maWx0ZXIocG9zMiA9PiB7XG4gICAgICAgIHJldHVybiBxdWVlbihvcmlnUG9zWzBdLCBvcmlnUG9zWzFdLCBwb3MyWzBdLCBwb3MyWzFdKSB8fCBrbmlnaHQob3JpZ1Bvc1swXSwgb3JpZ1Bvc1sxXSwgcG9zMlswXSwgcG9zMlsxXSk7XG4gICAgfSk7XG4gICAgY29uc3QgdmFsaWRTbmFwQ2VudGVycyA9IHZhbGlkU25hcFBvcy5tYXAocG9zMiA9PiBjb21wdXRlU3F1YXJlQ2VudGVyKHBvczJrZXkocG9zMiksIGFzV2hpdGUsIGJvdW5kcykpO1xuICAgIGNvbnN0IHZhbGlkU25hcERpc3RhbmNlcyA9IHZhbGlkU25hcENlbnRlcnMubWFwKHBvczIgPT4gZGlzdGFuY2VTcShwb3MsIHBvczIpKTtcbiAgICBjb25zdCBbLCBjbG9zZXN0U25hcEluZGV4XSA9IHZhbGlkU25hcERpc3RhbmNlcy5yZWR1Y2UoKGEsIGIsIGluZGV4KSA9PiAoYVswXSA8IGIgPyBhIDogW2IsIGluZGV4XSksIFt2YWxpZFNuYXBEaXN0YW5jZXNbMF0sIDBdKTtcbiAgICByZXR1cm4gcG9zMmtleSh2YWxpZFNuYXBQb3NbY2xvc2VzdFNuYXBJbmRleF0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHdoaXRlUG92KHMpIHtcbiAgICByZXR1cm4gcy5vcmllbnRhdGlvbiA9PT0gJ3doaXRlJztcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJvYXJkLmpzLm1hcCIsImltcG9ydCB7IHBvczJrZXksIGludlJhbmtzIH0gZnJvbSAnLi91dGlsLmpzJztcbmltcG9ydCAqIGFzIGNnIGZyb20gJy4vdHlwZXMuanMnO1xuZXhwb3J0IGNvbnN0IGluaXRpYWwgPSAncm5icWtibnIvcHBwcHBwcHAvOC84LzgvOC9QUFBQUFBQUC9STkJRS0JOUic7XG5jb25zdCByb2xlcyA9IHtcbiAgICBwOiAncGF3bicsXG4gICAgcjogJ3Jvb2snLFxuICAgIG46ICdrbmlnaHQnLFxuICAgIGI6ICdiaXNob3AnLFxuICAgIHE6ICdxdWVlbicsXG4gICAgazogJ2tpbmcnLFxufTtcbmNvbnN0IGxldHRlcnMgPSB7XG4gICAgcGF3bjogJ3AnLFxuICAgIHJvb2s6ICdyJyxcbiAgICBrbmlnaHQ6ICduJyxcbiAgICBiaXNob3A6ICdiJyxcbiAgICBxdWVlbjogJ3EnLFxuICAgIGtpbmc6ICdrJyxcbn07XG5leHBvcnQgZnVuY3Rpb24gcmVhZChmZW4pIHtcbiAgICBpZiAoZmVuID09PSAnc3RhcnQnKVxuICAgICAgICBmZW4gPSBpbml0aWFsO1xuICAgIGNvbnN0IHBpZWNlcyA9IG5ldyBNYXAoKTtcbiAgICBsZXQgcm93ID0gNywgY29sID0gMDtcbiAgICBmb3IgKGNvbnN0IGMgb2YgZmVuKSB7XG4gICAgICAgIHN3aXRjaCAoYykge1xuICAgICAgICAgICAgY2FzZSAnICc6XG4gICAgICAgICAgICBjYXNlICdbJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gcGllY2VzO1xuICAgICAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgICAgICAgLS1yb3c7XG4gICAgICAgICAgICAgICAgaWYgKHJvdyA8IDApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwaWVjZXM7XG4gICAgICAgICAgICAgICAgY29sID0gMDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ34nOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGllY2UgPSBwaWVjZXMuZ2V0KHBvczJrZXkoW2NvbCAtIDEsIHJvd10pKTtcbiAgICAgICAgICAgICAgICBpZiAocGllY2UpXG4gICAgICAgICAgICAgICAgICAgIHBpZWNlLnByb21vdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBuYiA9IGMuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgICAgICAgICBpZiAobmIgPCA1NylcbiAgICAgICAgICAgICAgICAgICAgY29sICs9IG5iIC0gNDg7XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvbGUgPSBjLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgIHBpZWNlcy5zZXQocG9zMmtleShbY29sLCByb3ddKSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9sZTogcm9sZXNbcm9sZV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogYyA9PT0gcm9sZSA/ICdibGFjaycgOiAnd2hpdGUnLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgKytjb2w7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwaWVjZXM7XG59XG5leHBvcnQgZnVuY3Rpb24gd3JpdGUocGllY2VzKSB7XG4gICAgcmV0dXJuIGludlJhbmtzXG4gICAgICAgIC5tYXAoeSA9PiBjZy5maWxlc1xuICAgICAgICAubWFwKHggPT4ge1xuICAgICAgICBjb25zdCBwaWVjZSA9IHBpZWNlcy5nZXQoKHggKyB5KSk7XG4gICAgICAgIGlmIChwaWVjZSkge1xuICAgICAgICAgICAgbGV0IHAgPSBsZXR0ZXJzW3BpZWNlLnJvbGVdO1xuICAgICAgICAgICAgaWYgKHBpZWNlLmNvbG9yID09PSAnd2hpdGUnKVxuICAgICAgICAgICAgICAgIHAgPSBwLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICBpZiAocGllY2UucHJvbW90ZWQpXG4gICAgICAgICAgICAgICAgcCArPSAnfic7XG4gICAgICAgICAgICByZXR1cm4gcDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gJzEnO1xuICAgIH0pXG4gICAgICAgIC5qb2luKCcnKSlcbiAgICAgICAgLmpvaW4oJy8nKVxuICAgICAgICAucmVwbGFjZSgvMXsyLH0vZywgcyA9PiBzLmxlbmd0aC50b1N0cmluZygpKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZlbi5qcy5tYXAiLCJpbXBvcnQgeyBzZXRDaGVjaywgc2V0U2VsZWN0ZWQgfSBmcm9tICcuL2JvYXJkLmpzJztcbmltcG9ydCB7IHJlYWQgYXMgZmVuUmVhZCB9IGZyb20gJy4vZmVuLmpzJztcbmV4cG9ydCBmdW5jdGlvbiBhcHBseUFuaW1hdGlvbihzdGF0ZSwgY29uZmlnKSB7XG4gICAgaWYgKGNvbmZpZy5hbmltYXRpb24pIHtcbiAgICAgICAgZGVlcE1lcmdlKHN0YXRlLmFuaW1hdGlvbiwgY29uZmlnLmFuaW1hdGlvbik7XG4gICAgICAgIC8vIG5vIG5lZWQgZm9yIHN1Y2ggc2hvcnQgYW5pbWF0aW9uc1xuICAgICAgICBpZiAoKHN0YXRlLmFuaW1hdGlvbi5kdXJhdGlvbiB8fCAwKSA8IDcwKVxuICAgICAgICAgICAgc3RhdGUuYW5pbWF0aW9uLmVuYWJsZWQgPSBmYWxzZTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gY29uZmlndXJlKHN0YXRlLCBjb25maWcpIHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIC8vIGRvbid0IG1lcmdlIGRlc3RpbmF0aW9ucyBhbmQgYXV0b1NoYXBlcy4gSnVzdCBvdmVycmlkZS5cbiAgICBpZiAoKF9hID0gY29uZmlnLm1vdmFibGUpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5kZXN0cylcbiAgICAgICAgc3RhdGUubW92YWJsZS5kZXN0cyA9IHVuZGVmaW5lZDtcbiAgICBpZiAoKF9iID0gY29uZmlnLmRyYXdhYmxlKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuYXV0b1NoYXBlcylcbiAgICAgICAgc3RhdGUuZHJhd2FibGUuYXV0b1NoYXBlcyA9IFtdO1xuICAgIGRlZXBNZXJnZShzdGF0ZSwgY29uZmlnKTtcbiAgICAvLyBpZiBhIGZlbiB3YXMgcHJvdmlkZWQsIHJlcGxhY2UgdGhlIHBpZWNlc1xuICAgIGlmIChjb25maWcuZmVuKSB7XG4gICAgICAgIHN0YXRlLnBpZWNlcyA9IGZlblJlYWQoY29uZmlnLmZlbik7XG4gICAgICAgIHN0YXRlLmRyYXdhYmxlLnNoYXBlcyA9IFtdO1xuICAgIH1cbiAgICAvLyBhcHBseSBjb25maWcgdmFsdWVzIHRoYXQgY291bGQgYmUgdW5kZWZpbmVkIHlldCBtZWFuaW5nZnVsXG4gICAgaWYgKCdjaGVjaycgaW4gY29uZmlnKVxuICAgICAgICBzZXRDaGVjayhzdGF0ZSwgY29uZmlnLmNoZWNrIHx8IGZhbHNlKTtcbiAgICBpZiAoJ2xhc3RNb3ZlJyBpbiBjb25maWcgJiYgIWNvbmZpZy5sYXN0TW92ZSlcbiAgICAgICAgc3RhdGUubGFzdE1vdmUgPSB1bmRlZmluZWQ7XG4gICAgLy8gaW4gY2FzZSBvZiBaSCBkcm9wIGxhc3QgbW92ZSwgdGhlcmUncyBhIHNpbmdsZSBzcXVhcmUuXG4gICAgLy8gaWYgdGhlIHByZXZpb3VzIGxhc3QgbW92ZSBoYWQgdHdvIHNxdWFyZXMsXG4gICAgLy8gdGhlIG1lcmdlIGFsZ29yaXRobSB3aWxsIGluY29ycmVjdGx5IGtlZXAgdGhlIHNlY29uZCBzcXVhcmUuXG4gICAgZWxzZSBpZiAoY29uZmlnLmxhc3RNb3ZlKVxuICAgICAgICBzdGF0ZS5sYXN0TW92ZSA9IGNvbmZpZy5sYXN0TW92ZTtcbiAgICAvLyBmaXggbW92ZS9wcmVtb3ZlIGRlc3RzXG4gICAgaWYgKHN0YXRlLnNlbGVjdGVkKVxuICAgICAgICBzZXRTZWxlY3RlZChzdGF0ZSwgc3RhdGUuc2VsZWN0ZWQpO1xuICAgIGFwcGx5QW5pbWF0aW9uKHN0YXRlLCBjb25maWcpO1xuICAgIGlmICghc3RhdGUubW92YWJsZS5yb29rQ2FzdGxlICYmIHN0YXRlLm1vdmFibGUuZGVzdHMpIHtcbiAgICAgICAgY29uc3QgcmFuayA9IHN0YXRlLm1vdmFibGUuY29sb3IgPT09ICd3aGl0ZScgPyAnMScgOiAnOCcsIGtpbmdTdGFydFBvcyA9ICgnZScgKyByYW5rKSwgZGVzdHMgPSBzdGF0ZS5tb3ZhYmxlLmRlc3RzLmdldChraW5nU3RhcnRQb3MpLCBraW5nID0gc3RhdGUucGllY2VzLmdldChraW5nU3RhcnRQb3MpO1xuICAgICAgICBpZiAoIWRlc3RzIHx8ICFraW5nIHx8IGtpbmcucm9sZSAhPT0gJ2tpbmcnKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBzdGF0ZS5tb3ZhYmxlLmRlc3RzLnNldChraW5nU3RhcnRQb3MsIGRlc3RzLmZpbHRlcihkID0+ICEoZCA9PT0gJ2EnICsgcmFuayAmJiBkZXN0cy5pbmNsdWRlcygoJ2MnICsgcmFuaykpKSAmJlxuICAgICAgICAgICAgIShkID09PSAnaCcgKyByYW5rICYmIGRlc3RzLmluY2x1ZGVzKCgnZycgKyByYW5rKSkpKSk7XG4gICAgfVxufVxuZnVuY3Rpb24gZGVlcE1lcmdlKGJhc2UsIGV4dGVuZCkge1xuICAgIGZvciAoY29uc3Qga2V5IGluIGV4dGVuZCkge1xuICAgICAgICBpZiAoaXNPYmplY3QoYmFzZVtrZXldKSAmJiBpc09iamVjdChleHRlbmRba2V5XSkpXG4gICAgICAgICAgICBkZWVwTWVyZ2UoYmFzZVtrZXldLCBleHRlbmRba2V5XSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGJhc2Vba2V5XSA9IGV4dGVuZFtrZXldO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGlzT2JqZWN0KG8pIHtcbiAgICByZXR1cm4gdHlwZW9mIG8gPT09ICdvYmplY3QnO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29uZmlnLmpzLm1hcCIsImltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi91dGlsLmpzJztcbmV4cG9ydCBmdW5jdGlvbiBhbmltKG11dGF0aW9uLCBzdGF0ZSkge1xuICAgIHJldHVybiBzdGF0ZS5hbmltYXRpb24uZW5hYmxlZCA/IGFuaW1hdGUobXV0YXRpb24sIHN0YXRlKSA6IHJlbmRlcihtdXRhdGlvbiwgc3RhdGUpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlcihtdXRhdGlvbiwgc3RhdGUpIHtcbiAgICBjb25zdCByZXN1bHQgPSBtdXRhdGlvbihzdGF0ZSk7XG4gICAgc3RhdGUuZG9tLnJlZHJhdygpO1xuICAgIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtYWtlUGllY2Uoa2V5LCBwaWVjZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGtleToga2V5LFxuICAgICAgICBwb3M6IHV0aWwua2V5MnBvcyhrZXkpLFxuICAgICAgICBwaWVjZTogcGllY2UsXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGNsb3NlcihwaWVjZSwgcGllY2VzKSB7XG4gICAgcmV0dXJuIHBpZWNlcy5zb3J0KChwMSwgcDIpID0+IHtcbiAgICAgICAgcmV0dXJuIHV0aWwuZGlzdGFuY2VTcShwaWVjZS5wb3MsIHAxLnBvcykgLSB1dGlsLmRpc3RhbmNlU3EocGllY2UucG9zLCBwMi5wb3MpO1xuICAgIH0pWzBdO1xufVxuZnVuY3Rpb24gY29tcHV0ZVBsYW4ocHJldlBpZWNlcywgY3VycmVudCkge1xuICAgIGNvbnN0IGFuaW1zID0gbmV3IE1hcCgpLCBhbmltZWRPcmlncyA9IFtdLCBmYWRpbmdzID0gbmV3IE1hcCgpLCBtaXNzaW5ncyA9IFtdLCBuZXdzID0gW10sIHByZVBpZWNlcyA9IG5ldyBNYXAoKTtcbiAgICBsZXQgY3VyUCwgcHJlUCwgdmVjdG9yO1xuICAgIGZvciAoY29uc3QgW2ssIHBdIG9mIHByZXZQaWVjZXMpIHtcbiAgICAgICAgcHJlUGllY2VzLnNldChrLCBtYWtlUGllY2UoaywgcCkpO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGtleSBvZiB1dGlsLmFsbEtleXMpIHtcbiAgICAgICAgY3VyUCA9IGN1cnJlbnQucGllY2VzLmdldChrZXkpO1xuICAgICAgICBwcmVQID0gcHJlUGllY2VzLmdldChrZXkpO1xuICAgICAgICBpZiAoY3VyUCkge1xuICAgICAgICAgICAgaWYgKHByZVApIHtcbiAgICAgICAgICAgICAgICBpZiAoIXV0aWwuc2FtZVBpZWNlKGN1clAsIHByZVAucGllY2UpKSB7XG4gICAgICAgICAgICAgICAgICAgIG1pc3NpbmdzLnB1c2gocHJlUCk7XG4gICAgICAgICAgICAgICAgICAgIG5ld3MucHVzaChtYWtlUGllY2Uoa2V5LCBjdXJQKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIG5ld3MucHVzaChtYWtlUGllY2Uoa2V5LCBjdXJQKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocHJlUClcbiAgICAgICAgICAgIG1pc3NpbmdzLnB1c2gocHJlUCk7XG4gICAgfVxuICAgIGZvciAoY29uc3QgbmV3UCBvZiBuZXdzKSB7XG4gICAgICAgIHByZVAgPSBjbG9zZXIobmV3UCwgbWlzc2luZ3MuZmlsdGVyKHAgPT4gdXRpbC5zYW1lUGllY2UobmV3UC5waWVjZSwgcC5waWVjZSkpKTtcbiAgICAgICAgaWYgKHByZVApIHtcbiAgICAgICAgICAgIHZlY3RvciA9IFtwcmVQLnBvc1swXSAtIG5ld1AucG9zWzBdLCBwcmVQLnBvc1sxXSAtIG5ld1AucG9zWzFdXTtcbiAgICAgICAgICAgIGFuaW1zLnNldChuZXdQLmtleSwgdmVjdG9yLmNvbmNhdCh2ZWN0b3IpKTtcbiAgICAgICAgICAgIGFuaW1lZE9yaWdzLnB1c2gocHJlUC5rZXkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZvciAoY29uc3QgcCBvZiBtaXNzaW5ncykge1xuICAgICAgICBpZiAoIWFuaW1lZE9yaWdzLmluY2x1ZGVzKHAua2V5KSlcbiAgICAgICAgICAgIGZhZGluZ3Muc2V0KHAua2V5LCBwLnBpZWNlKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgYW5pbXM6IGFuaW1zLFxuICAgICAgICBmYWRpbmdzOiBmYWRpbmdzLFxuICAgIH07XG59XG5mdW5jdGlvbiBzdGVwKHN0YXRlLCBub3cpIHtcbiAgICBjb25zdCBjdXIgPSBzdGF0ZS5hbmltYXRpb24uY3VycmVudDtcbiAgICBpZiAoY3VyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gYW5pbWF0aW9uIHdhcyBjYW5jZWxlZCA6KFxuICAgICAgICBpZiAoIXN0YXRlLmRvbS5kZXN0cm95ZWQpXG4gICAgICAgICAgICBzdGF0ZS5kb20ucmVkcmF3Tm93KCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgcmVzdCA9IDEgLSAobm93IC0gY3VyLnN0YXJ0KSAqIGN1ci5mcmVxdWVuY3k7XG4gICAgaWYgKHJlc3QgPD0gMCkge1xuICAgICAgICBzdGF0ZS5hbmltYXRpb24uY3VycmVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgc3RhdGUuZG9tLnJlZHJhd05vdygpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY29uc3QgZWFzZSA9IGVhc2luZyhyZXN0KTtcbiAgICAgICAgZm9yIChjb25zdCBjZmcgb2YgY3VyLnBsYW4uYW5pbXMudmFsdWVzKCkpIHtcbiAgICAgICAgICAgIGNmZ1syXSA9IGNmZ1swXSAqIGVhc2U7XG4gICAgICAgICAgICBjZmdbM10gPSBjZmdbMV0gKiBlYXNlO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRlLmRvbS5yZWRyYXdOb3codHJ1ZSk7IC8vIG9wdGltaXNhdGlvbjogZG9uJ3QgcmVuZGVyIFNWRyBjaGFuZ2VzIGR1cmluZyBhbmltYXRpb25zXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgobm93ID0gcGVyZm9ybWFuY2Uubm93KCkpID0+IHN0ZXAoc3RhdGUsIG5vdykpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGFuaW1hdGUobXV0YXRpb24sIHN0YXRlKSB7XG4gICAgLy8gY2xvbmUgc3RhdGUgYmVmb3JlIG11dGF0aW5nIGl0XG4gICAgY29uc3QgcHJldlBpZWNlcyA9IG5ldyBNYXAoc3RhdGUucGllY2VzKTtcbiAgICBjb25zdCByZXN1bHQgPSBtdXRhdGlvbihzdGF0ZSk7XG4gICAgY29uc3QgcGxhbiA9IGNvbXB1dGVQbGFuKHByZXZQaWVjZXMsIHN0YXRlKTtcbiAgICBpZiAocGxhbi5hbmltcy5zaXplIHx8IHBsYW4uZmFkaW5ncy5zaXplKSB7XG4gICAgICAgIGNvbnN0IGFscmVhZHlSdW5uaW5nID0gc3RhdGUuYW5pbWF0aW9uLmN1cnJlbnQgJiYgc3RhdGUuYW5pbWF0aW9uLmN1cnJlbnQuc3RhcnQ7XG4gICAgICAgIHN0YXRlLmFuaW1hdGlvbi5jdXJyZW50ID0ge1xuICAgICAgICAgICAgc3RhcnQ6IHBlcmZvcm1hbmNlLm5vdygpLFxuICAgICAgICAgICAgZnJlcXVlbmN5OiAxIC8gc3RhdGUuYW5pbWF0aW9uLmR1cmF0aW9uLFxuICAgICAgICAgICAgcGxhbjogcGxhbixcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCFhbHJlYWR5UnVubmluZylcbiAgICAgICAgICAgIHN0ZXAoc3RhdGUsIHBlcmZvcm1hbmNlLm5vdygpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIGRvbid0IGFuaW1hdGUsIGp1c3QgcmVuZGVyIHJpZ2h0IGF3YXlcbiAgICAgICAgc3RhdGUuZG9tLnJlZHJhdygpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vZ3JlLzE2NTAyOTRcbmZ1bmN0aW9uIGVhc2luZyh0KSB7XG4gICAgcmV0dXJuIHQgPCAwLjUgPyA0ICogdCAqIHQgKiB0IDogKHQgLSAxKSAqICgyICogdCAtIDIpICogKDIgKiB0IC0gMikgKyAxO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YW5pbS5qcy5tYXAiLCJpbXBvcnQgeyB1bnNlbGVjdCwgY2FuY2VsTW92ZSwgZ2V0S2V5QXREb21Qb3MsIGdldFNuYXBwZWRLZXlBdERvbVBvcywgd2hpdGVQb3YgfSBmcm9tICcuL2JvYXJkLmpzJztcbmltcG9ydCB7IGV2ZW50UG9zaXRpb24sIGlzUmlnaHRCdXR0b24gfSBmcm9tICcuL3V0aWwuanMnO1xuY29uc3QgYnJ1c2hlcyA9IFsnZ3JlZW4nLCAncmVkJywgJ2JsdWUnLCAneWVsbG93J107XG5leHBvcnQgZnVuY3Rpb24gc3RhcnQoc3RhdGUsIGUpIHtcbiAgICAvLyBzdXBwb3J0IG9uZSBmaW5nZXIgdG91Y2ggb25seVxuICAgIGlmIChlLnRvdWNoZXMgJiYgZS50b3VjaGVzLmxlbmd0aCA+IDEpXG4gICAgICAgIHJldHVybjtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLmN0cmxLZXkgPyB1bnNlbGVjdChzdGF0ZSkgOiBjYW5jZWxNb3ZlKHN0YXRlKTtcbiAgICBjb25zdCBwb3MgPSBldmVudFBvc2l0aW9uKGUpLCBvcmlnID0gZ2V0S2V5QXREb21Qb3MocG9zLCB3aGl0ZVBvdihzdGF0ZSksIHN0YXRlLmRvbS5ib3VuZHMoKSk7XG4gICAgaWYgKCFvcmlnKVxuICAgICAgICByZXR1cm47XG4gICAgc3RhdGUuZHJhd2FibGUuY3VycmVudCA9IHtcbiAgICAgICAgb3JpZyxcbiAgICAgICAgcG9zLFxuICAgICAgICBicnVzaDogZXZlbnRCcnVzaChlKSxcbiAgICAgICAgc25hcFRvVmFsaWRNb3ZlOiBzdGF0ZS5kcmF3YWJsZS5kZWZhdWx0U25hcFRvVmFsaWRNb3ZlLFxuICAgIH07XG4gICAgcHJvY2Vzc0RyYXcoc3RhdGUpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NEcmF3KHN0YXRlKSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgY29uc3QgY3VyID0gc3RhdGUuZHJhd2FibGUuY3VycmVudDtcbiAgICAgICAgaWYgKGN1cikge1xuICAgICAgICAgICAgY29uc3Qga2V5QXREb21Qb3MgPSBnZXRLZXlBdERvbVBvcyhjdXIucG9zLCB3aGl0ZVBvdihzdGF0ZSksIHN0YXRlLmRvbS5ib3VuZHMoKSk7XG4gICAgICAgICAgICBpZiAoIWtleUF0RG9tUG9zKSB7XG4gICAgICAgICAgICAgICAgY3VyLnNuYXBUb1ZhbGlkTW92ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbW91c2VTcSA9IGN1ci5zbmFwVG9WYWxpZE1vdmVcbiAgICAgICAgICAgICAgICA/IGdldFNuYXBwZWRLZXlBdERvbVBvcyhjdXIub3JpZywgY3VyLnBvcywgd2hpdGVQb3Yoc3RhdGUpLCBzdGF0ZS5kb20uYm91bmRzKCkpXG4gICAgICAgICAgICAgICAgOiBrZXlBdERvbVBvcztcbiAgICAgICAgICAgIGlmIChtb3VzZVNxICE9PSBjdXIubW91c2VTcSkge1xuICAgICAgICAgICAgICAgIGN1ci5tb3VzZVNxID0gbW91c2VTcTtcbiAgICAgICAgICAgICAgICBjdXIuZGVzdCA9IG1vdXNlU3EgIT09IGN1ci5vcmlnID8gbW91c2VTcSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBzdGF0ZS5kb20ucmVkcmF3Tm93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9jZXNzRHJhdyhzdGF0ZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBtb3ZlKHN0YXRlLCBlKSB7XG4gICAgaWYgKHN0YXRlLmRyYXdhYmxlLmN1cnJlbnQpXG4gICAgICAgIHN0YXRlLmRyYXdhYmxlLmN1cnJlbnQucG9zID0gZXZlbnRQb3NpdGlvbihlKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBlbmQoc3RhdGUpIHtcbiAgICBjb25zdCBjdXIgPSBzdGF0ZS5kcmF3YWJsZS5jdXJyZW50O1xuICAgIGlmIChjdXIpIHtcbiAgICAgICAgaWYgKGN1ci5tb3VzZVNxKVxuICAgICAgICAgICAgYWRkU2hhcGUoc3RhdGUuZHJhd2FibGUsIGN1cik7XG4gICAgICAgIGNhbmNlbChzdGF0ZSk7XG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIGNhbmNlbChzdGF0ZSkge1xuICAgIGlmIChzdGF0ZS5kcmF3YWJsZS5jdXJyZW50KSB7XG4gICAgICAgIHN0YXRlLmRyYXdhYmxlLmN1cnJlbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgIHN0YXRlLmRvbS5yZWRyYXcoKTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gY2xlYXIoc3RhdGUpIHtcbiAgICBpZiAoc3RhdGUuZHJhd2FibGUuc2hhcGVzLmxlbmd0aCkge1xuICAgICAgICBzdGF0ZS5kcmF3YWJsZS5zaGFwZXMgPSBbXTtcbiAgICAgICAgc3RhdGUuZG9tLnJlZHJhdygpO1xuICAgICAgICBvbkNoYW5nZShzdGF0ZS5kcmF3YWJsZSk7XG4gICAgfVxufVxuZnVuY3Rpb24gZXZlbnRCcnVzaChlKSB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IG1vZEEgPSAoZS5zaGlmdEtleSB8fCBlLmN0cmxLZXkpICYmIGlzUmlnaHRCdXR0b24oZSk7XG4gICAgY29uc3QgbW9kQiA9IGUuYWx0S2V5IHx8IGUubWV0YUtleSB8fCAoKF9hID0gZS5nZXRNb2RpZmllclN0YXRlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbChlLCAnQWx0R3JhcGgnKSk7XG4gICAgcmV0dXJuIGJydXNoZXNbKG1vZEEgPyAxIDogMCkgKyAobW9kQiA/IDIgOiAwKV07XG59XG5mdW5jdGlvbiBhZGRTaGFwZShkcmF3YWJsZSwgY3VyKSB7XG4gICAgY29uc3Qgc2FtZVNoYXBlID0gKHMpID0+IHMub3JpZyA9PT0gY3VyLm9yaWcgJiYgcy5kZXN0ID09PSBjdXIuZGVzdDtcbiAgICBjb25zdCBzaW1pbGFyID0gZHJhd2FibGUuc2hhcGVzLmZpbmQoc2FtZVNoYXBlKTtcbiAgICBpZiAoc2ltaWxhcilcbiAgICAgICAgZHJhd2FibGUuc2hhcGVzID0gZHJhd2FibGUuc2hhcGVzLmZpbHRlcihzID0+ICFzYW1lU2hhcGUocykpO1xuICAgIGlmICghc2ltaWxhciB8fCBzaW1pbGFyLmJydXNoICE9PSBjdXIuYnJ1c2gpXG4gICAgICAgIGRyYXdhYmxlLnNoYXBlcy5wdXNoKGN1cik7XG4gICAgb25DaGFuZ2UoZHJhd2FibGUpO1xufVxuZnVuY3Rpb24gb25DaGFuZ2UoZHJhd2FibGUpIHtcbiAgICBpZiAoZHJhd2FibGUub25DaGFuZ2UpXG4gICAgICAgIGRyYXdhYmxlLm9uQ2hhbmdlKGRyYXdhYmxlLnNoYXBlcyk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kcmF3LmpzLm1hcCIsImltcG9ydCAqIGFzIGJvYXJkIGZyb20gJy4vYm9hcmQuanMnO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuL3V0aWwuanMnO1xuaW1wb3J0IHsgY2xlYXIgYXMgZHJhd0NsZWFyIH0gZnJvbSAnLi9kcmF3LmpzJztcbmltcG9ydCB7IGFuaW0gfSBmcm9tICcuL2FuaW0uanMnO1xuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0KHMsIGUpIHtcbiAgICBpZiAoIWUuaXNUcnVzdGVkIHx8IChlLmJ1dHRvbiAhPT0gdW5kZWZpbmVkICYmIGUuYnV0dG9uICE9PSAwKSlcbiAgICAgICAgcmV0dXJuOyAvLyBvbmx5IHRvdWNoIG9yIGxlZnQgY2xpY2tcbiAgICBpZiAoZS50b3VjaGVzICYmIGUudG91Y2hlcy5sZW5ndGggPiAxKVxuICAgICAgICByZXR1cm47IC8vIHN1cHBvcnQgb25lIGZpbmdlciB0b3VjaCBvbmx5XG4gICAgY29uc3QgYm91bmRzID0gcy5kb20uYm91bmRzKCksIHBvc2l0aW9uID0gdXRpbC5ldmVudFBvc2l0aW9uKGUpLCBvcmlnID0gYm9hcmQuZ2V0S2V5QXREb21Qb3MocG9zaXRpb24sIGJvYXJkLndoaXRlUG92KHMpLCBib3VuZHMpO1xuICAgIGlmICghb3JpZylcbiAgICAgICAgcmV0dXJuO1xuICAgIGNvbnN0IHBpZWNlID0gcy5waWVjZXMuZ2V0KG9yaWcpO1xuICAgIGNvbnN0IHByZXZpb3VzbHlTZWxlY3RlZCA9IHMuc2VsZWN0ZWQ7XG4gICAgaWYgKCFwcmV2aW91c2x5U2VsZWN0ZWQgJiYgcy5kcmF3YWJsZS5lbmFibGVkICYmIChzLmRyYXdhYmxlLmVyYXNlT25DbGljayB8fCAhcGllY2UgfHwgcGllY2UuY29sb3IgIT09IHMudHVybkNvbG9yKSlcbiAgICAgICAgZHJhd0NsZWFyKHMpO1xuICAgIC8vIFByZXZlbnQgdG91Y2ggc2Nyb2xsIGFuZCBjcmVhdGUgbm8gY29ycmVzcG9uZGluZyBtb3VzZSBldmVudCwgaWYgdGhlcmVcbiAgICAvLyBpcyBhbiBpbnRlbnQgdG8gaW50ZXJhY3Qgd2l0aCB0aGUgYm9hcmQuXG4gICAgaWYgKGUuY2FuY2VsYWJsZSAhPT0gZmFsc2UgJiZcbiAgICAgICAgKCFlLnRvdWNoZXMgfHwgcy5ibG9ja1RvdWNoU2Nyb2xsIHx8IHBpZWNlIHx8IHByZXZpb3VzbHlTZWxlY3RlZCB8fCBwaWVjZUNsb3NlVG8ocywgcG9zaXRpb24pKSlcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IGhhZFByZW1vdmUgPSAhIXMucHJlbW92YWJsZS5jdXJyZW50O1xuICAgIGNvbnN0IGhhZFByZWRyb3AgPSAhIXMucHJlZHJvcHBhYmxlLmN1cnJlbnQ7XG4gICAgcy5zdGF0cy5jdHJsS2V5ID0gZS5jdHJsS2V5O1xuICAgIGlmIChzLnNlbGVjdGVkICYmIGJvYXJkLmNhbk1vdmUocywgcy5zZWxlY3RlZCwgb3JpZykpIHtcbiAgICAgICAgYW5pbShzdGF0ZSA9PiBib2FyZC5zZWxlY3RTcXVhcmUoc3RhdGUsIG9yaWcpLCBzKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGJvYXJkLnNlbGVjdFNxdWFyZShzLCBvcmlnKTtcbiAgICB9XG4gICAgY29uc3Qgc3RpbGxTZWxlY3RlZCA9IHMuc2VsZWN0ZWQgPT09IG9yaWc7XG4gICAgY29uc3QgZWxlbWVudCA9IHBpZWNlRWxlbWVudEJ5S2V5KHMsIG9yaWcpO1xuICAgIGlmIChwaWVjZSAmJiBlbGVtZW50ICYmIHN0aWxsU2VsZWN0ZWQgJiYgYm9hcmQuaXNEcmFnZ2FibGUocywgb3JpZykpIHtcbiAgICAgICAgcy5kcmFnZ2FibGUuY3VycmVudCA9IHtcbiAgICAgICAgICAgIG9yaWcsXG4gICAgICAgICAgICBwaWVjZSxcbiAgICAgICAgICAgIG9yaWdQb3M6IHBvc2l0aW9uLFxuICAgICAgICAgICAgcG9zOiBwb3NpdGlvbixcbiAgICAgICAgICAgIHN0YXJ0ZWQ6IHMuZHJhZ2dhYmxlLmF1dG9EaXN0YW5jZSAmJiBzLnN0YXRzLmRyYWdnZWQsXG4gICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgcHJldmlvdXNseVNlbGVjdGVkLFxuICAgICAgICAgICAgb3JpZ2luVGFyZ2V0OiBlLnRhcmdldCxcbiAgICAgICAgICAgIGtleUhhc0NoYW5nZWQ6IGZhbHNlLFxuICAgICAgICB9O1xuICAgICAgICBlbGVtZW50LmNnRHJhZ2dpbmcgPSB0cnVlO1xuICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2RyYWdnaW5nJyk7XG4gICAgICAgIC8vIHBsYWNlIGdob3N0XG4gICAgICAgIGNvbnN0IGdob3N0ID0gcy5kb20uZWxlbWVudHMuZ2hvc3Q7XG4gICAgICAgIGlmIChnaG9zdCkge1xuICAgICAgICAgICAgZ2hvc3QuY2xhc3NOYW1lID0gYGdob3N0ICR7cGllY2UuY29sb3J9ICR7cGllY2Uucm9sZX1gO1xuICAgICAgICAgICAgdXRpbC50cmFuc2xhdGUoZ2hvc3QsIHV0aWwucG9zVG9UcmFuc2xhdGUoYm91bmRzKSh1dGlsLmtleTJwb3Mob3JpZyksIGJvYXJkLndoaXRlUG92KHMpKSk7XG4gICAgICAgICAgICB1dGlsLnNldFZpc2libGUoZ2hvc3QsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHByb2Nlc3NEcmFnKHMpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKGhhZFByZW1vdmUpXG4gICAgICAgICAgICBib2FyZC51bnNldFByZW1vdmUocyk7XG4gICAgICAgIGlmIChoYWRQcmVkcm9wKVxuICAgICAgICAgICAgYm9hcmQudW5zZXRQcmVkcm9wKHMpO1xuICAgIH1cbiAgICBzLmRvbS5yZWRyYXcoKTtcbn1cbmZ1bmN0aW9uIHBpZWNlQ2xvc2VUbyhzLCBwb3MpIHtcbiAgICBjb25zdCBhc1doaXRlID0gYm9hcmQud2hpdGVQb3YocyksIGJvdW5kcyA9IHMuZG9tLmJvdW5kcygpLCByYWRpdXNTcSA9IE1hdGgucG93KGJvdW5kcy53aWR0aCAvIDgsIDIpO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIHMucGllY2VzLmtleXMoKSkge1xuICAgICAgICBjb25zdCBjZW50ZXIgPSB1dGlsLmNvbXB1dGVTcXVhcmVDZW50ZXIoa2V5LCBhc1doaXRlLCBib3VuZHMpO1xuICAgICAgICBpZiAodXRpbC5kaXN0YW5jZVNxKGNlbnRlciwgcG9zKSA8PSByYWRpdXNTcSlcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5leHBvcnQgZnVuY3Rpb24gZHJhZ05ld1BpZWNlKHMsIHBpZWNlLCBlLCBmb3JjZSkge1xuICAgIGNvbnN0IGtleSA9ICdhMCc7XG4gICAgcy5waWVjZXMuc2V0KGtleSwgcGllY2UpO1xuICAgIHMuZG9tLnJlZHJhdygpO1xuICAgIGNvbnN0IHBvc2l0aW9uID0gdXRpbC5ldmVudFBvc2l0aW9uKGUpO1xuICAgIHMuZHJhZ2dhYmxlLmN1cnJlbnQgPSB7XG4gICAgICAgIG9yaWc6IGtleSxcbiAgICAgICAgcGllY2UsXG4gICAgICAgIG9yaWdQb3M6IHBvc2l0aW9uLFxuICAgICAgICBwb3M6IHBvc2l0aW9uLFxuICAgICAgICBzdGFydGVkOiB0cnVlLFxuICAgICAgICBlbGVtZW50OiAoKSA9PiBwaWVjZUVsZW1lbnRCeUtleShzLCBrZXkpLFxuICAgICAgICBvcmlnaW5UYXJnZXQ6IGUudGFyZ2V0LFxuICAgICAgICBuZXdQaWVjZTogdHJ1ZSxcbiAgICAgICAgZm9yY2U6ICEhZm9yY2UsXG4gICAgICAgIGtleUhhc0NoYW5nZWQ6IGZhbHNlLFxuICAgIH07XG4gICAgcHJvY2Vzc0RyYWcocyk7XG59XG5mdW5jdGlvbiBwcm9jZXNzRHJhZyhzKSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBjb25zdCBjdXIgPSBzLmRyYWdnYWJsZS5jdXJyZW50O1xuICAgICAgICBpZiAoIWN1cilcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgLy8gY2FuY2VsIGFuaW1hdGlvbnMgd2hpbGUgZHJhZ2dpbmdcbiAgICAgICAgaWYgKChfYSA9IHMuYW5pbWF0aW9uLmN1cnJlbnQpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5wbGFuLmFuaW1zLmhhcyhjdXIub3JpZykpXG4gICAgICAgICAgICBzLmFuaW1hdGlvbi5jdXJyZW50ID0gdW5kZWZpbmVkO1xuICAgICAgICAvLyBpZiBtb3ZpbmcgcGllY2UgaXMgZ29uZSwgY2FuY2VsXG4gICAgICAgIGNvbnN0IG9yaWdQaWVjZSA9IHMucGllY2VzLmdldChjdXIub3JpZyk7XG4gICAgICAgIGlmICghb3JpZ1BpZWNlIHx8ICF1dGlsLnNhbWVQaWVjZShvcmlnUGllY2UsIGN1ci5waWVjZSkpXG4gICAgICAgICAgICBjYW5jZWwocyk7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFjdXIuc3RhcnRlZCAmJiB1dGlsLmRpc3RhbmNlU3EoY3VyLnBvcywgY3VyLm9yaWdQb3MpID49IE1hdGgucG93KHMuZHJhZ2dhYmxlLmRpc3RhbmNlLCAyKSlcbiAgICAgICAgICAgICAgICBjdXIuc3RhcnRlZCA9IHRydWU7XG4gICAgICAgICAgICBpZiAoY3VyLnN0YXJ0ZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBzdXBwb3J0IGxhenkgZWxlbWVudHNcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGN1ci5lbGVtZW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvdW5kID0gY3VyLmVsZW1lbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmb3VuZClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgZm91bmQuY2dEcmFnZ2luZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGZvdW5kLmNsYXNzTGlzdC5hZGQoJ2RyYWdnaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgIGN1ci5lbGVtZW50ID0gZm91bmQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGJvdW5kcyA9IHMuZG9tLmJvdW5kcygpO1xuICAgICAgICAgICAgICAgIHV0aWwudHJhbnNsYXRlKGN1ci5lbGVtZW50LCBbXG4gICAgICAgICAgICAgICAgICAgIGN1ci5wb3NbMF0gLSBib3VuZHMubGVmdCAtIGJvdW5kcy53aWR0aCAvIDE2LFxuICAgICAgICAgICAgICAgICAgICBjdXIucG9zWzFdIC0gYm91bmRzLnRvcCAtIGJvdW5kcy5oZWlnaHQgLyAxNixcbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICBjdXIua2V5SGFzQ2hhbmdlZCB8fCAoY3VyLmtleUhhc0NoYW5nZWQgPSBjdXIub3JpZyAhPT0gYm9hcmQuZ2V0S2V5QXREb21Qb3MoY3VyLnBvcywgYm9hcmQud2hpdGVQb3YocyksIGJvdW5kcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHByb2Nlc3NEcmFnKHMpO1xuICAgIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIG1vdmUocywgZSkge1xuICAgIC8vIHN1cHBvcnQgb25lIGZpbmdlciB0b3VjaCBvbmx5XG4gICAgaWYgKHMuZHJhZ2dhYmxlLmN1cnJlbnQgJiYgKCFlLnRvdWNoZXMgfHwgZS50b3VjaGVzLmxlbmd0aCA8IDIpKSB7XG4gICAgICAgIHMuZHJhZ2dhYmxlLmN1cnJlbnQucG9zID0gdXRpbC5ldmVudFBvc2l0aW9uKGUpO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBlbmQocywgZSkge1xuICAgIGNvbnN0IGN1ciA9IHMuZHJhZ2dhYmxlLmN1cnJlbnQ7XG4gICAgaWYgKCFjdXIpXG4gICAgICAgIHJldHVybjtcbiAgICAvLyBjcmVhdGUgbm8gY29ycmVzcG9uZGluZyBtb3VzZSBldmVudFxuICAgIGlmIChlLnR5cGUgPT09ICd0b3VjaGVuZCcgJiYgZS5jYW5jZWxhYmxlICE9PSBmYWxzZSlcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIC8vIGNvbXBhcmluZyB3aXRoIHRoZSBvcmlnaW4gdGFyZ2V0IGlzIGFuIGVhc3kgd2F5IHRvIHRlc3QgdGhhdCB0aGUgZW5kIGV2ZW50XG4gICAgLy8gaGFzIHRoZSBzYW1lIHRvdWNoIG9yaWdpblxuICAgIGlmIChlLnR5cGUgPT09ICd0b3VjaGVuZCcgJiYgY3VyLm9yaWdpblRhcmdldCAhPT0gZS50YXJnZXQgJiYgIWN1ci5uZXdQaWVjZSkge1xuICAgICAgICBzLmRyYWdnYWJsZS5jdXJyZW50ID0gdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGJvYXJkLnVuc2V0UHJlbW92ZShzKTtcbiAgICBib2FyZC51bnNldFByZWRyb3Aocyk7XG4gICAgLy8gdG91Y2hlbmQgaGFzIG5vIHBvc2l0aW9uOyBzbyB1c2UgdGhlIGxhc3QgdG91Y2htb3ZlIHBvc2l0aW9uIGluc3RlYWRcbiAgICBjb25zdCBldmVudFBvcyA9IHV0aWwuZXZlbnRQb3NpdGlvbihlKSB8fCBjdXIucG9zO1xuICAgIGNvbnN0IGRlc3QgPSBib2FyZC5nZXRLZXlBdERvbVBvcyhldmVudFBvcywgYm9hcmQud2hpdGVQb3YocyksIHMuZG9tLmJvdW5kcygpKTtcbiAgICBpZiAoZGVzdCAmJiBjdXIuc3RhcnRlZCAmJiBjdXIub3JpZyAhPT0gZGVzdCkge1xuICAgICAgICBpZiAoY3VyLm5ld1BpZWNlKVxuICAgICAgICAgICAgYm9hcmQuZHJvcE5ld1BpZWNlKHMsIGN1ci5vcmlnLCBkZXN0LCBjdXIuZm9yY2UpO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHMuc3RhdHMuY3RybEtleSA9IGUuY3RybEtleTtcbiAgICAgICAgICAgIGlmIChib2FyZC51c2VyTW92ZShzLCBjdXIub3JpZywgZGVzdCkpXG4gICAgICAgICAgICAgICAgcy5zdGF0cy5kcmFnZ2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChjdXIubmV3UGllY2UpIHtcbiAgICAgICAgcy5waWVjZXMuZGVsZXRlKGN1ci5vcmlnKTtcbiAgICB9XG4gICAgZWxzZSBpZiAocy5kcmFnZ2FibGUuZGVsZXRlT25Ecm9wT2ZmICYmICFkZXN0KSB7XG4gICAgICAgIHMucGllY2VzLmRlbGV0ZShjdXIub3JpZyk7XG4gICAgICAgIGJvYXJkLmNhbGxVc2VyRnVuY3Rpb24ocy5ldmVudHMuY2hhbmdlKTtcbiAgICB9XG4gICAgaWYgKChjdXIub3JpZyA9PT0gY3VyLnByZXZpb3VzbHlTZWxlY3RlZCB8fCBjdXIua2V5SGFzQ2hhbmdlZCkgJiYgKGN1ci5vcmlnID09PSBkZXN0IHx8ICFkZXN0KSlcbiAgICAgICAgYm9hcmQudW5zZWxlY3Qocyk7XG4gICAgZWxzZSBpZiAoIXMuc2VsZWN0YWJsZS5lbmFibGVkKVxuICAgICAgICBib2FyZC51bnNlbGVjdChzKTtcbiAgICByZW1vdmVEcmFnRWxlbWVudHMocyk7XG4gICAgcy5kcmFnZ2FibGUuY3VycmVudCA9IHVuZGVmaW5lZDtcbiAgICBzLmRvbS5yZWRyYXcoKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjYW5jZWwocykge1xuICAgIGNvbnN0IGN1ciA9IHMuZHJhZ2dhYmxlLmN1cnJlbnQ7XG4gICAgaWYgKGN1cikge1xuICAgICAgICBpZiAoY3VyLm5ld1BpZWNlKVxuICAgICAgICAgICAgcy5waWVjZXMuZGVsZXRlKGN1ci5vcmlnKTtcbiAgICAgICAgcy5kcmFnZ2FibGUuY3VycmVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgYm9hcmQudW5zZWxlY3Qocyk7XG4gICAgICAgIHJlbW92ZURyYWdFbGVtZW50cyhzKTtcbiAgICAgICAgcy5kb20ucmVkcmF3KCk7XG4gICAgfVxufVxuZnVuY3Rpb24gcmVtb3ZlRHJhZ0VsZW1lbnRzKHMpIHtcbiAgICBjb25zdCBlID0gcy5kb20uZWxlbWVudHM7XG4gICAgaWYgKGUuZ2hvc3QpXG4gICAgICAgIHV0aWwuc2V0VmlzaWJsZShlLmdob3N0LCBmYWxzZSk7XG59XG5mdW5jdGlvbiBwaWVjZUVsZW1lbnRCeUtleShzLCBrZXkpIHtcbiAgICBsZXQgZWwgPSBzLmRvbS5lbGVtZW50cy5ib2FyZC5maXJzdENoaWxkO1xuICAgIHdoaWxlIChlbCkge1xuICAgICAgICBpZiAoZWwuY2dLZXkgPT09IGtleSAmJiBlbC50YWdOYW1lID09PSAnUElFQ0UnKVxuICAgICAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgICBlbCA9IGVsLm5leHRTaWJsaW5nO1xuICAgIH1cbiAgICByZXR1cm47XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kcmFnLmpzLm1hcCIsImV4cG9ydCBmdW5jdGlvbiBleHBsb3Npb24oc3RhdGUsIGtleXMpIHtcbiAgICBzdGF0ZS5leHBsb2RpbmcgPSB7IHN0YWdlOiAxLCBrZXlzIH07XG4gICAgc3RhdGUuZG9tLnJlZHJhdygpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBzZXRTdGFnZShzdGF0ZSwgMik7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gc2V0U3RhZ2Uoc3RhdGUsIHVuZGVmaW5lZCksIDEyMCk7XG4gICAgfSwgMTIwKTtcbn1cbmZ1bmN0aW9uIHNldFN0YWdlKHN0YXRlLCBzdGFnZSkge1xuICAgIGlmIChzdGF0ZS5leHBsb2RpbmcpIHtcbiAgICAgICAgaWYgKHN0YWdlKVxuICAgICAgICAgICAgc3RhdGUuZXhwbG9kaW5nLnN0YWdlID0gc3RhZ2U7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YXRlLmV4cGxvZGluZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgc3RhdGUuZG9tLnJlZHJhdygpO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWV4cGxvc2lvbi5qcy5tYXAiLCJpbXBvcnQgKiBhcyBib2FyZCBmcm9tICcuL2JvYXJkLmpzJztcbmltcG9ydCB7IHdyaXRlIGFzIGZlbldyaXRlIH0gZnJvbSAnLi9mZW4uanMnO1xuaW1wb3J0IHsgY29uZmlndXJlLCBhcHBseUFuaW1hdGlvbiB9IGZyb20gJy4vY29uZmlnLmpzJztcbmltcG9ydCB7IGFuaW0sIHJlbmRlciB9IGZyb20gJy4vYW5pbS5qcyc7XG5pbXBvcnQgeyBjYW5jZWwgYXMgZHJhZ0NhbmNlbCwgZHJhZ05ld1BpZWNlIH0gZnJvbSAnLi9kcmFnLmpzJztcbmltcG9ydCB7IGV4cGxvc2lvbiB9IGZyb20gJy4vZXhwbG9zaW9uLmpzJztcbi8vIHNlZSBBUEkgdHlwZXMgYW5kIGRvY3VtZW50YXRpb25zIGluIGR0cy9hcGkuZC50c1xuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0KHN0YXRlLCByZWRyYXdBbGwpIHtcbiAgICBmdW5jdGlvbiB0b2dnbGVPcmllbnRhdGlvbigpIHtcbiAgICAgICAgYm9hcmQudG9nZ2xlT3JpZW50YXRpb24oc3RhdGUpO1xuICAgICAgICByZWRyYXdBbGwoKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2V0KGNvbmZpZykge1xuICAgICAgICAgICAgaWYgKGNvbmZpZy5vcmllbnRhdGlvbiAmJiBjb25maWcub3JpZW50YXRpb24gIT09IHN0YXRlLm9yaWVudGF0aW9uKVxuICAgICAgICAgICAgICAgIHRvZ2dsZU9yaWVudGF0aW9uKCk7XG4gICAgICAgICAgICBhcHBseUFuaW1hdGlvbihzdGF0ZSwgY29uZmlnKTtcbiAgICAgICAgICAgIChjb25maWcuZmVuID8gYW5pbSA6IHJlbmRlcikoc3RhdGUgPT4gY29uZmlndXJlKHN0YXRlLCBjb25maWcpLCBzdGF0ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHN0YXRlLFxuICAgICAgICBnZXRGZW46ICgpID0+IGZlbldyaXRlKHN0YXRlLnBpZWNlcyksXG4gICAgICAgIHRvZ2dsZU9yaWVudGF0aW9uLFxuICAgICAgICBzZXRQaWVjZXMocGllY2VzKSB7XG4gICAgICAgICAgICBhbmltKHN0YXRlID0+IGJvYXJkLnNldFBpZWNlcyhzdGF0ZSwgcGllY2VzKSwgc3RhdGUpO1xuICAgICAgICB9LFxuICAgICAgICBzZWxlY3RTcXVhcmUoa2V5LCBmb3JjZSkge1xuICAgICAgICAgICAgaWYgKGtleSlcbiAgICAgICAgICAgICAgICBhbmltKHN0YXRlID0+IGJvYXJkLnNlbGVjdFNxdWFyZShzdGF0ZSwga2V5LCBmb3JjZSksIHN0YXRlKTtcbiAgICAgICAgICAgIGVsc2UgaWYgKHN0YXRlLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgYm9hcmQudW5zZWxlY3Qoc3RhdGUpO1xuICAgICAgICAgICAgICAgIHN0YXRlLmRvbS5yZWRyYXcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbW92ZShvcmlnLCBkZXN0KSB7XG4gICAgICAgICAgICBhbmltKHN0YXRlID0+IGJvYXJkLmJhc2VNb3ZlKHN0YXRlLCBvcmlnLCBkZXN0KSwgc3RhdGUpO1xuICAgICAgICB9LFxuICAgICAgICBuZXdQaWVjZShwaWVjZSwga2V5KSB7XG4gICAgICAgICAgICBhbmltKHN0YXRlID0+IGJvYXJkLmJhc2VOZXdQaWVjZShzdGF0ZSwgcGllY2UsIGtleSksIHN0YXRlKTtcbiAgICAgICAgfSxcbiAgICAgICAgcGxheVByZW1vdmUoKSB7XG4gICAgICAgICAgICBpZiAoc3RhdGUucHJlbW92YWJsZS5jdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKGFuaW0oYm9hcmQucGxheVByZW1vdmUsIHN0YXRlKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIHByZW1vdmUgY291bGRuJ3QgYmUgcGxheWVkLCByZWRyYXcgdG8gY2xlYXIgaXQgdXBcbiAgICAgICAgICAgICAgICBzdGF0ZS5kb20ucmVkcmF3KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIHBsYXlQcmVkcm9wKHZhbGlkYXRlKSB7XG4gICAgICAgICAgICBpZiAoc3RhdGUucHJlZHJvcHBhYmxlLmN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBib2FyZC5wbGF5UHJlZHJvcChzdGF0ZSwgdmFsaWRhdGUpO1xuICAgICAgICAgICAgICAgIHN0YXRlLmRvbS5yZWRyYXcoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBjYW5jZWxQcmVtb3ZlKCkge1xuICAgICAgICAgICAgcmVuZGVyKGJvYXJkLnVuc2V0UHJlbW92ZSwgc3RhdGUpO1xuICAgICAgICB9LFxuICAgICAgICBjYW5jZWxQcmVkcm9wKCkge1xuICAgICAgICAgICAgcmVuZGVyKGJvYXJkLnVuc2V0UHJlZHJvcCwgc3RhdGUpO1xuICAgICAgICB9LFxuICAgICAgICBjYW5jZWxNb3ZlKCkge1xuICAgICAgICAgICAgcmVuZGVyKHN0YXRlID0+IHtcbiAgICAgICAgICAgICAgICBib2FyZC5jYW5jZWxNb3ZlKHN0YXRlKTtcbiAgICAgICAgICAgICAgICBkcmFnQ2FuY2VsKHN0YXRlKTtcbiAgICAgICAgICAgIH0sIHN0YXRlKTtcbiAgICAgICAgfSxcbiAgICAgICAgc3RvcCgpIHtcbiAgICAgICAgICAgIHJlbmRlcihzdGF0ZSA9PiB7XG4gICAgICAgICAgICAgICAgYm9hcmQuc3RvcChzdGF0ZSk7XG4gICAgICAgICAgICAgICAgZHJhZ0NhbmNlbChzdGF0ZSk7XG4gICAgICAgICAgICB9LCBzdGF0ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGV4cGxvZGUoa2V5cykge1xuICAgICAgICAgICAgZXhwbG9zaW9uKHN0YXRlLCBrZXlzKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0QXV0b1NoYXBlcyhzaGFwZXMpIHtcbiAgICAgICAgICAgIHJlbmRlcihzdGF0ZSA9PiAoc3RhdGUuZHJhd2FibGUuYXV0b1NoYXBlcyA9IHNoYXBlcyksIHN0YXRlKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0U2hhcGVzKHNoYXBlcykge1xuICAgICAgICAgICAgcmVuZGVyKHN0YXRlID0+IChzdGF0ZS5kcmF3YWJsZS5zaGFwZXMgPSBzaGFwZXMpLCBzdGF0ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldEtleUF0RG9tUG9zKHBvcykge1xuICAgICAgICAgICAgcmV0dXJuIGJvYXJkLmdldEtleUF0RG9tUG9zKHBvcywgYm9hcmQud2hpdGVQb3Yoc3RhdGUpLCBzdGF0ZS5kb20uYm91bmRzKCkpO1xuICAgICAgICB9LFxuICAgICAgICByZWRyYXdBbGwsXG4gICAgICAgIGRyYWdOZXdQaWVjZShwaWVjZSwgZXZlbnQsIGZvcmNlKSB7XG4gICAgICAgICAgICBkcmFnTmV3UGllY2Uoc3RhdGUsIHBpZWNlLCBldmVudCwgZm9yY2UpO1xuICAgICAgICB9LFxuICAgICAgICBkZXN0cm95KCkge1xuICAgICAgICAgICAgYm9hcmQuc3RvcChzdGF0ZSk7XG4gICAgICAgICAgICBzdGF0ZS5kb20udW5iaW5kICYmIHN0YXRlLmRvbS51bmJpbmQoKTtcbiAgICAgICAgICAgIHN0YXRlLmRvbS5kZXN0cm95ZWQgPSB0cnVlO1xuICAgICAgICB9LFxuICAgIH07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcGkuanMubWFwIiwiaW1wb3J0ICogYXMgZmVuIGZyb20gJy4vZmVuLmpzJztcbmltcG9ydCB7IHRpbWVyIH0gZnJvbSAnLi91dGlsLmpzJztcbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBwaWVjZXM6IGZlbi5yZWFkKGZlbi5pbml0aWFsKSxcbiAgICAgICAgb3JpZW50YXRpb246ICd3aGl0ZScsXG4gICAgICAgIHR1cm5Db2xvcjogJ3doaXRlJyxcbiAgICAgICAgY29vcmRpbmF0ZXM6IHRydWUsXG4gICAgICAgIHJhbmtzUG9zaXRpb246ICdyaWdodCcsXG4gICAgICAgIGF1dG9DYXN0bGU6IHRydWUsXG4gICAgICAgIHZpZXdPbmx5OiBmYWxzZSxcbiAgICAgICAgZGlzYWJsZUNvbnRleHRNZW51OiBmYWxzZSxcbiAgICAgICAgYWRkUGllY2VaSW5kZXg6IGZhbHNlLFxuICAgICAgICBhZGREaW1lbnNpb25zQ3NzVmFyczogZmFsc2UsXG4gICAgICAgIGJsb2NrVG91Y2hTY3JvbGw6IGZhbHNlLFxuICAgICAgICBwaWVjZUtleTogZmFsc2UsXG4gICAgICAgIGhpZ2hsaWdodDoge1xuICAgICAgICAgICAgbGFzdE1vdmU6IHRydWUsXG4gICAgICAgICAgICBjaGVjazogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgYW5pbWF0aW9uOiB7XG4gICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgZHVyYXRpb246IDIwMCxcbiAgICAgICAgfSxcbiAgICAgICAgbW92YWJsZToge1xuICAgICAgICAgICAgZnJlZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbG9yOiAnYm90aCcsXG4gICAgICAgICAgICBzaG93RGVzdHM6IHRydWUsXG4gICAgICAgICAgICBldmVudHM6IHt9LFxuICAgICAgICAgICAgcm9va0Nhc3RsZTogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgcHJlbW92YWJsZToge1xuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIHNob3dEZXN0czogdHJ1ZSxcbiAgICAgICAgICAgIGNhc3RsZTogdHJ1ZSxcbiAgICAgICAgICAgIGV2ZW50czoge30sXG4gICAgICAgIH0sXG4gICAgICAgIHByZWRyb3BwYWJsZToge1xuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICBldmVudHM6IHt9LFxuICAgICAgICB9LFxuICAgICAgICBkcmFnZ2FibGU6IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICBkaXN0YW5jZTogMyxcbiAgICAgICAgICAgIGF1dG9EaXN0YW5jZTogdHJ1ZSxcbiAgICAgICAgICAgIHNob3dHaG9zdDogdHJ1ZSxcbiAgICAgICAgICAgIGRlbGV0ZU9uRHJvcE9mZjogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIGRyb3Btb2RlOiB7XG4gICAgICAgICAgICBhY3RpdmU6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICBzZWxlY3RhYmxlOiB7XG4gICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICBzdGF0czoge1xuICAgICAgICAgICAgLy8gb24gdG91Y2hzY3JlZW4sIGRlZmF1bHQgdG8gXCJ0YXAtdGFwXCIgbW92ZXNcbiAgICAgICAgICAgIC8vIGluc3RlYWQgb2YgZHJhZ1xuICAgICAgICAgICAgZHJhZ2dlZDogISgnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cpLFxuICAgICAgICB9LFxuICAgICAgICBldmVudHM6IHt9LFxuICAgICAgICBkcmF3YWJsZToge1xuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgICAgICBkZWZhdWx0U25hcFRvVmFsaWRNb3ZlOiB0cnVlLFxuICAgICAgICAgICAgZXJhc2VPbkNsaWNrOiB0cnVlLFxuICAgICAgICAgICAgc2hhcGVzOiBbXSxcbiAgICAgICAgICAgIGF1dG9TaGFwZXM6IFtdLFxuICAgICAgICAgICAgYnJ1c2hlczoge1xuICAgICAgICAgICAgICAgIGdyZWVuOiB7IGtleTogJ2cnLCBjb2xvcjogJyMxNTc4MUInLCBvcGFjaXR5OiAxLCBsaW5lV2lkdGg6IDEwIH0sXG4gICAgICAgICAgICAgICAgcmVkOiB7IGtleTogJ3InLCBjb2xvcjogJyM4ODIwMjAnLCBvcGFjaXR5OiAxLCBsaW5lV2lkdGg6IDEwIH0sXG4gICAgICAgICAgICAgICAgYmx1ZTogeyBrZXk6ICdiJywgY29sb3I6ICcjMDAzMDg4Jywgb3BhY2l0eTogMSwgbGluZVdpZHRoOiAxMCB9LFxuICAgICAgICAgICAgICAgIHllbGxvdzogeyBrZXk6ICd5JywgY29sb3I6ICcjZTY4ZjAwJywgb3BhY2l0eTogMSwgbGluZVdpZHRoOiAxMCB9LFxuICAgICAgICAgICAgICAgIHBhbGVCbHVlOiB7IGtleTogJ3BiJywgY29sb3I6ICcjMDAzMDg4Jywgb3BhY2l0eTogMC40LCBsaW5lV2lkdGg6IDE1IH0sXG4gICAgICAgICAgICAgICAgcGFsZUdyZWVuOiB7IGtleTogJ3BnJywgY29sb3I6ICcjMTU3ODFCJywgb3BhY2l0eTogMC40LCBsaW5lV2lkdGg6IDE1IH0sXG4gICAgICAgICAgICAgICAgcGFsZVJlZDogeyBrZXk6ICdwcicsIGNvbG9yOiAnIzg4MjAyMCcsIG9wYWNpdHk6IDAuNCwgbGluZVdpZHRoOiAxNSB9LFxuICAgICAgICAgICAgICAgIHBhbGVHcmV5OiB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3BncicsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzRhNGE0YScsXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAuMzUsXG4gICAgICAgICAgICAgICAgICAgIGxpbmVXaWR0aDogMTUsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwcmV2U3ZnSGFzaDogJycsXG4gICAgICAgIH0sXG4gICAgICAgIGhvbGQ6IHRpbWVyKCksXG4gICAgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN0YXRlLmpzLm1hcCIsIi8vIGFwcGVuZCBhbmQgcmVtb3ZlIG9ubHkuIE5vIHVwZGF0ZXMuXG5leHBvcnQgZnVuY3Rpb24gc3luY1NoYXBlcyhzaGFwZXMsIHJvb3QsIHJlbmRlclNoYXBlKSB7XG4gICAgY29uc3QgaGFzaGVzSW5Eb20gPSBuZXcgTWFwKCksIC8vIGJ5IGhhc2hcbiAgICB0b1JlbW92ZSA9IFtdO1xuICAgIGZvciAoY29uc3Qgc2Mgb2Ygc2hhcGVzKVxuICAgICAgICBoYXNoZXNJbkRvbS5zZXQoc2MuaGFzaCwgZmFsc2UpO1xuICAgIGxldCBlbCA9IHJvb3QuZmlyc3RDaGlsZCwgZWxIYXNoO1xuICAgIHdoaWxlIChlbCkge1xuICAgICAgICBlbEhhc2ggPSBlbC5nZXRBdHRyaWJ1dGUoJ2NnSGFzaCcpO1xuICAgICAgICAvLyBmb3VuZCBhIHNoYXBlIGVsZW1lbnQgdGhhdCdzIGhlcmUgdG8gc3RheVxuICAgICAgICBpZiAoaGFzaGVzSW5Eb20uaGFzKGVsSGFzaCkpXG4gICAgICAgICAgICBoYXNoZXNJbkRvbS5zZXQoZWxIYXNoLCB0cnVlKTtcbiAgICAgICAgLy8gb3IgcmVtb3ZlIGl0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRvUmVtb3ZlLnB1c2goZWwpO1xuICAgICAgICBlbCA9IGVsLm5leHRTaWJsaW5nO1xuICAgIH1cbiAgICAvLyByZW1vdmUgb2xkIHNoYXBlc1xuICAgIGZvciAoY29uc3QgZWwgb2YgdG9SZW1vdmUpXG4gICAgICAgIHJvb3QucmVtb3ZlQ2hpbGQoZWwpO1xuICAgIC8vIGluc2VydCBzaGFwZXMgdGhhdCBhcmUgbm90IHlldCBpbiBkb21cbiAgICBmb3IgKGNvbnN0IHNjIG9mIHNoYXBlcykge1xuICAgICAgICBpZiAoIWhhc2hlc0luRG9tLmdldChzYy5oYXNoKSlcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQocmVuZGVyU2hhcGUoc2MpKTtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zeW5jLmpzLm1hcCIsImltcG9ydCB7IGtleTJwb3MgfSBmcm9tICcuL3V0aWwuanMnO1xuaW1wb3J0IHsgc3luY1NoYXBlcyB9IGZyb20gJy4vc3luYy5qcyc7XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRWxlbWVudCh0YWdOYW1lKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCB0YWdOYW1lKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJTdmcoc3RhdGUsIHN2ZywgY3VzdG9tU3ZnKSB7XG4gICAgY29uc3QgZCA9IHN0YXRlLmRyYXdhYmxlLCBjdXJEID0gZC5jdXJyZW50LCBjdXIgPSBjdXJEICYmIGN1ckQubW91c2VTcSA/IGN1ckQgOiB1bmRlZmluZWQsIGFycm93RGVzdHMgPSBuZXcgTWFwKCksIGJvdW5kcyA9IHN0YXRlLmRvbS5ib3VuZHMoKSwgbm9uUGllY2VBdXRvU2hhcGVzID0gZC5hdXRvU2hhcGVzLmZpbHRlcihhdXRvU2hhcGUgPT4gIWF1dG9TaGFwZS5waWVjZSk7XG4gICAgZm9yIChjb25zdCBzIG9mIGQuc2hhcGVzLmNvbmNhdChub25QaWVjZUF1dG9TaGFwZXMpLmNvbmNhdChjdXIgPyBbY3VyXSA6IFtdKSkge1xuICAgICAgICBpZiAocy5kZXN0KVxuICAgICAgICAgICAgYXJyb3dEZXN0cy5zZXQocy5kZXN0LCAoYXJyb3dEZXN0cy5nZXQocy5kZXN0KSB8fCAwKSArIDEpO1xuICAgIH1cbiAgICBjb25zdCBzaGFwZXMgPSBkLnNoYXBlcy5jb25jYXQobm9uUGllY2VBdXRvU2hhcGVzKS5tYXAoKHMpID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNoYXBlOiBzLFxuICAgICAgICAgICAgY3VycmVudDogZmFsc2UsXG4gICAgICAgICAgICBoYXNoOiBzaGFwZUhhc2gocywgYXJyb3dEZXN0cywgZmFsc2UsIGJvdW5kcyksXG4gICAgICAgIH07XG4gICAgfSk7XG4gICAgaWYgKGN1cilcbiAgICAgICAgc2hhcGVzLnB1c2goe1xuICAgICAgICAgICAgc2hhcGU6IGN1cixcbiAgICAgICAgICAgIGN1cnJlbnQ6IHRydWUsXG4gICAgICAgICAgICBoYXNoOiBzaGFwZUhhc2goY3VyLCBhcnJvd0Rlc3RzLCB0cnVlLCBib3VuZHMpLFxuICAgICAgICB9KTtcbiAgICBjb25zdCBmdWxsSGFzaCA9IHNoYXBlcy5tYXAoc2MgPT4gc2MuaGFzaCkuam9pbignOycpO1xuICAgIGlmIChmdWxsSGFzaCA9PT0gc3RhdGUuZHJhd2FibGUucHJldlN2Z0hhc2gpXG4gICAgICAgIHJldHVybjtcbiAgICBzdGF0ZS5kcmF3YWJsZS5wcmV2U3ZnSGFzaCA9IGZ1bGxIYXNoO1xuICAgIC8qXG4gICAgICAtLSBET00gaGllcmFyY2h5IC0tXG4gICAgICA8c3ZnIGNsYXNzPVwiY2ctc2hhcGVzXCI+ICAgICAgKDw9IHN2ZylcbiAgICAgICAgPGRlZnM+XG4gICAgICAgICAgLi4uKGZvciBicnVzaGVzKS4uLlxuICAgICAgICA8L2RlZnM+XG4gICAgICAgIDxnPlxuICAgICAgICAgIC4uLihmb3IgYXJyb3dzIGFuZCBjaXJjbGVzKS4uLlxuICAgICAgICA8L2c+XG4gICAgICA8L3N2Zz5cbiAgICAgIDxzdmcgY2xhc3M9XCJjZy1jdXN0b20tc3Znc1wiPiAoPD0gY3VzdG9tU3ZnKVxuICAgICAgICA8Zz5cbiAgICAgICAgICAuLi4oZm9yIGN1c3RvbSBzdmdzKS4uLlxuICAgICAgICA8L2c+XG4gICAgICA8L3N2Zz5cbiAgICAqL1xuICAgIGNvbnN0IGRlZnNFbCA9IHN2Zy5xdWVyeVNlbGVjdG9yKCdkZWZzJyk7XG4gICAgY29uc3Qgc2hhcGVzRWwgPSBzdmcucXVlcnlTZWxlY3RvcignZycpO1xuICAgIGNvbnN0IGN1c3RvbVN2Z3NFbCA9IGN1c3RvbVN2Zy5xdWVyeVNlbGVjdG9yKCdnJyk7XG4gICAgc3luY0RlZnMoZCwgc2hhcGVzLCBkZWZzRWwpO1xuICAgIHN5bmNTaGFwZXMoc2hhcGVzLmZpbHRlcihzID0+ICFzLnNoYXBlLmN1c3RvbVN2ZyksIHNoYXBlc0VsLCBzaGFwZSA9PiByZW5kZXJTaGFwZShzdGF0ZSwgc2hhcGUsIGQuYnJ1c2hlcywgYXJyb3dEZXN0cywgYm91bmRzKSk7XG4gICAgc3luY1NoYXBlcyhzaGFwZXMuZmlsdGVyKHMgPT4gcy5zaGFwZS5jdXN0b21TdmcpLCBjdXN0b21TdmdzRWwsIHNoYXBlID0+IHJlbmRlclNoYXBlKHN0YXRlLCBzaGFwZSwgZC5icnVzaGVzLCBhcnJvd0Rlc3RzLCBib3VuZHMpKTtcbn1cbi8vIGFwcGVuZCBvbmx5LiBEb24ndCB0cnkgdG8gdXBkYXRlL3JlbW92ZS5cbmZ1bmN0aW9uIHN5bmNEZWZzKGQsIHNoYXBlcywgZGVmc0VsKSB7XG4gICAgY29uc3QgYnJ1c2hlcyA9IG5ldyBNYXAoKTtcbiAgICBsZXQgYnJ1c2g7XG4gICAgZm9yIChjb25zdCBzIG9mIHNoYXBlcykge1xuICAgICAgICBpZiAocy5zaGFwZS5kZXN0KSB7XG4gICAgICAgICAgICBicnVzaCA9IGQuYnJ1c2hlc1tzLnNoYXBlLmJydXNoXTtcbiAgICAgICAgICAgIGlmIChzLnNoYXBlLm1vZGlmaWVycylcbiAgICAgICAgICAgICAgICBicnVzaCA9IG1ha2VDdXN0b21CcnVzaChicnVzaCwgcy5zaGFwZS5tb2RpZmllcnMpO1xuICAgICAgICAgICAgYnJ1c2hlcy5zZXQoYnJ1c2gua2V5LCBicnVzaCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3Qga2V5c0luRG9tID0gbmV3IFNldCgpO1xuICAgIGxldCBlbCA9IGRlZnNFbC5maXJzdENoaWxkO1xuICAgIHdoaWxlIChlbCkge1xuICAgICAgICBrZXlzSW5Eb20uYWRkKGVsLmdldEF0dHJpYnV0ZSgnY2dLZXknKSk7XG4gICAgICAgIGVsID0gZWwubmV4dFNpYmxpbmc7XG4gICAgfVxuICAgIGZvciAoY29uc3QgW2tleSwgYnJ1c2hdIG9mIGJydXNoZXMuZW50cmllcygpKSB7XG4gICAgICAgIGlmICgha2V5c0luRG9tLmhhcyhrZXkpKVxuICAgICAgICAgICAgZGVmc0VsLmFwcGVuZENoaWxkKHJlbmRlck1hcmtlcihicnVzaCkpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHNoYXBlSGFzaCh7IG9yaWcsIGRlc3QsIGJydXNoLCBwaWVjZSwgbW9kaWZpZXJzLCBjdXN0b21TdmcgfSwgYXJyb3dEZXN0cywgY3VycmVudCwgYm91bmRzKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgYm91bmRzLndpZHRoLFxuICAgICAgICBib3VuZHMuaGVpZ2h0LFxuICAgICAgICBjdXJyZW50LFxuICAgICAgICBvcmlnLFxuICAgICAgICBkZXN0LFxuICAgICAgICBicnVzaCxcbiAgICAgICAgZGVzdCAmJiAoYXJyb3dEZXN0cy5nZXQoZGVzdCkgfHwgMCkgPiAxLFxuICAgICAgICBwaWVjZSAmJiBwaWVjZUhhc2gocGllY2UpLFxuICAgICAgICBtb2RpZmllcnMgJiYgbW9kaWZpZXJzSGFzaChtb2RpZmllcnMpLFxuICAgICAgICBjdXN0b21TdmcgJiYgY3VzdG9tU3ZnSGFzaChjdXN0b21TdmcpLFxuICAgIF1cbiAgICAgICAgLmZpbHRlcih4ID0+IHgpXG4gICAgICAgIC5qb2luKCcsJyk7XG59XG5mdW5jdGlvbiBwaWVjZUhhc2gocGllY2UpIHtcbiAgICByZXR1cm4gW3BpZWNlLmNvbG9yLCBwaWVjZS5yb2xlLCBwaWVjZS5zY2FsZV0uZmlsdGVyKHggPT4geCkuam9pbignLCcpO1xufVxuZnVuY3Rpb24gbW9kaWZpZXJzSGFzaChtKSB7XG4gICAgcmV0dXJuICcnICsgKG0ubGluZVdpZHRoIHx8ICcnKTtcbn1cbmZ1bmN0aW9uIGN1c3RvbVN2Z0hhc2gocykge1xuICAgIC8vIFJvbGxpbmcgaGFzaCB3aXRoIGJhc2UgMzEgKGNmLiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy83NjE2NDYxL2dlbmVyYXRlLWEtaGFzaC1mcm9tLXN0cmluZy1pbi1qYXZhc2NyaXB0KVxuICAgIGxldCBoID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaCA9ICgoaCA8PCA1KSAtIGggKyBzLmNoYXJDb2RlQXQoaSkpID4+PiAwO1xuICAgIH1cbiAgICByZXR1cm4gJ2N1c3RvbS0nICsgaC50b1N0cmluZygpO1xufVxuZnVuY3Rpb24gcmVuZGVyU2hhcGUoc3RhdGUsIHsgc2hhcGUsIGN1cnJlbnQsIGhhc2ggfSwgYnJ1c2hlcywgYXJyb3dEZXN0cywgYm91bmRzKSB7XG4gICAgbGV0IGVsO1xuICAgIGNvbnN0IG9yaWcgPSBvcmllbnQoa2V5MnBvcyhzaGFwZS5vcmlnKSwgc3RhdGUub3JpZW50YXRpb24pO1xuICAgIGlmIChzaGFwZS5jdXN0b21TdmcpIHtcbiAgICAgICAgZWwgPSByZW5kZXJDdXN0b21Tdmcoc2hhcGUuY3VzdG9tU3ZnLCBvcmlnLCBib3VuZHMpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKHNoYXBlLmRlc3QpIHtcbiAgICAgICAgICAgIGxldCBicnVzaCA9IGJydXNoZXNbc2hhcGUuYnJ1c2hdO1xuICAgICAgICAgICAgaWYgKHNoYXBlLm1vZGlmaWVycylcbiAgICAgICAgICAgICAgICBicnVzaCA9IG1ha2VDdXN0b21CcnVzaChicnVzaCwgc2hhcGUubW9kaWZpZXJzKTtcbiAgICAgICAgICAgIGVsID0gcmVuZGVyQXJyb3coYnJ1c2gsIG9yaWcsIG9yaWVudChrZXkycG9zKHNoYXBlLmRlc3QpLCBzdGF0ZS5vcmllbnRhdGlvbiksIGN1cnJlbnQsIChhcnJvd0Rlc3RzLmdldChzaGFwZS5kZXN0KSB8fCAwKSA+IDEsIGJvdW5kcyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZWwgPSByZW5kZXJDaXJjbGUoYnJ1c2hlc1tzaGFwZS5icnVzaF0sIG9yaWcsIGN1cnJlbnQsIGJvdW5kcyk7XG4gICAgfVxuICAgIGVsLnNldEF0dHJpYnV0ZSgnY2dIYXNoJywgaGFzaCk7XG4gICAgcmV0dXJuIGVsO1xufVxuZnVuY3Rpb24gcmVuZGVyQ3VzdG9tU3ZnKGN1c3RvbVN2ZywgcG9zLCBib3VuZHMpIHtcbiAgICBjb25zdCBbeCwgeV0gPSBwb3MydXNlcihwb3MsIGJvdW5kcyk7XG4gICAgLy8gVHJhbnNsYXRlIHRvIHRvcC1sZWZ0IG9mIGBvcmlnYCBzcXVhcmVcbiAgICBjb25zdCBnID0gc2V0QXR0cmlidXRlcyhjcmVhdGVFbGVtZW50KCdnJyksIHsgdHJhbnNmb3JtOiBgdHJhbnNsYXRlKCR7eH0sJHt5fSlgIH0pO1xuICAgIC8vIEdpdmUgMTAweDEwMCBjb29yZGluYXRlIHN5c3RlbSB0byB0aGUgdXNlciBmb3IgYG9yaWdgIHNxdWFyZVxuICAgIGNvbnN0IHN2ZyA9IHNldEF0dHJpYnV0ZXMoY3JlYXRlRWxlbWVudCgnc3ZnJyksIHsgd2lkdGg6IDEsIGhlaWdodDogMSwgdmlld0JveDogJzAgMCAxMDAgMTAwJyB9KTtcbiAgICBnLmFwcGVuZENoaWxkKHN2Zyk7XG4gICAgc3ZnLmlubmVySFRNTCA9IGN1c3RvbVN2ZztcbiAgICByZXR1cm4gZztcbn1cbmZ1bmN0aW9uIHJlbmRlckNpcmNsZShicnVzaCwgcG9zLCBjdXJyZW50LCBib3VuZHMpIHtcbiAgICBjb25zdCBvID0gcG9zMnVzZXIocG9zLCBib3VuZHMpLCB3aWR0aHMgPSBjaXJjbGVXaWR0aCgpLCByYWRpdXMgPSAoYm91bmRzLndpZHRoICsgYm91bmRzLmhlaWdodCkgLyAoNCAqIE1hdGgubWF4KGJvdW5kcy53aWR0aCwgYm91bmRzLmhlaWdodCkpO1xuICAgIHJldHVybiBzZXRBdHRyaWJ1dGVzKGNyZWF0ZUVsZW1lbnQoJ2NpcmNsZScpLCB7XG4gICAgICAgIHN0cm9rZTogYnJ1c2guY29sb3IsXG4gICAgICAgICdzdHJva2Utd2lkdGgnOiB3aWR0aHNbY3VycmVudCA/IDAgOiAxXSxcbiAgICAgICAgZmlsbDogJ25vbmUnLFxuICAgICAgICBvcGFjaXR5OiBvcGFjaXR5KGJydXNoLCBjdXJyZW50KSxcbiAgICAgICAgY3g6IG9bMF0sXG4gICAgICAgIGN5OiBvWzFdLFxuICAgICAgICByOiByYWRpdXMgLSB3aWR0aHNbMV0gLyAyLFxuICAgIH0pO1xufVxuZnVuY3Rpb24gcmVuZGVyQXJyb3coYnJ1c2gsIG9yaWcsIGRlc3QsIGN1cnJlbnQsIHNob3J0ZW4sIGJvdW5kcykge1xuICAgIGNvbnN0IG0gPSBhcnJvd01hcmdpbihzaG9ydGVuICYmICFjdXJyZW50KSwgYSA9IHBvczJ1c2VyKG9yaWcsIGJvdW5kcyksIGIgPSBwb3MydXNlcihkZXN0LCBib3VuZHMpLCBkeCA9IGJbMF0gLSBhWzBdLCBkeSA9IGJbMV0gLSBhWzFdLCBhbmdsZSA9IE1hdGguYXRhbjIoZHksIGR4KSwgeG8gPSBNYXRoLmNvcyhhbmdsZSkgKiBtLCB5byA9IE1hdGguc2luKGFuZ2xlKSAqIG07XG4gICAgcmV0dXJuIHNldEF0dHJpYnV0ZXMoY3JlYXRlRWxlbWVudCgnbGluZScpLCB7XG4gICAgICAgIHN0cm9rZTogYnJ1c2guY29sb3IsXG4gICAgICAgICdzdHJva2Utd2lkdGgnOiBsaW5lV2lkdGgoYnJ1c2gsIGN1cnJlbnQpLFxuICAgICAgICAnc3Ryb2tlLWxpbmVjYXAnOiAncm91bmQnLFxuICAgICAgICAnbWFya2VyLWVuZCc6ICd1cmwoI2Fycm93aGVhZC0nICsgYnJ1c2gua2V5ICsgJyknLFxuICAgICAgICBvcGFjaXR5OiBvcGFjaXR5KGJydXNoLCBjdXJyZW50KSxcbiAgICAgICAgeDE6IGFbMF0sXG4gICAgICAgIHkxOiBhWzFdLFxuICAgICAgICB4MjogYlswXSAtIHhvLFxuICAgICAgICB5MjogYlsxXSAtIHlvLFxuICAgIH0pO1xufVxuZnVuY3Rpb24gcmVuZGVyTWFya2VyKGJydXNoKSB7XG4gICAgY29uc3QgbWFya2VyID0gc2V0QXR0cmlidXRlcyhjcmVhdGVFbGVtZW50KCdtYXJrZXInKSwge1xuICAgICAgICBpZDogJ2Fycm93aGVhZC0nICsgYnJ1c2gua2V5LFxuICAgICAgICBvcmllbnQ6ICdhdXRvJyxcbiAgICAgICAgbWFya2VyV2lkdGg6IDQsXG4gICAgICAgIG1hcmtlckhlaWdodDogOCxcbiAgICAgICAgcmVmWDogMi4wNSxcbiAgICAgICAgcmVmWTogMi4wMSxcbiAgICB9KTtcbiAgICBtYXJrZXIuYXBwZW5kQ2hpbGQoc2V0QXR0cmlidXRlcyhjcmVhdGVFbGVtZW50KCdwYXRoJyksIHtcbiAgICAgICAgZDogJ00wLDAgVjQgTDMsMiBaJyxcbiAgICAgICAgZmlsbDogYnJ1c2guY29sb3IsXG4gICAgfSkpO1xuICAgIG1hcmtlci5zZXRBdHRyaWJ1dGUoJ2NnS2V5JywgYnJ1c2gua2V5KTtcbiAgICByZXR1cm4gbWFya2VyO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNldEF0dHJpYnV0ZXMoZWwsIGF0dHJzKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXR0cnMpXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShrZXksIGF0dHJzW2tleV0pO1xuICAgIHJldHVybiBlbDtcbn1cbmZ1bmN0aW9uIG9yaWVudChwb3MsIGNvbG9yKSB7XG4gICAgcmV0dXJuIGNvbG9yID09PSAnd2hpdGUnID8gcG9zIDogWzcgLSBwb3NbMF0sIDcgLSBwb3NbMV1dO1xufVxuZnVuY3Rpb24gbWFrZUN1c3RvbUJydXNoKGJhc2UsIG1vZGlmaWVycykge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbG9yOiBiYXNlLmNvbG9yLFxuICAgICAgICBvcGFjaXR5OiBNYXRoLnJvdW5kKGJhc2Uub3BhY2l0eSAqIDEwKSAvIDEwLFxuICAgICAgICBsaW5lV2lkdGg6IE1hdGgucm91bmQobW9kaWZpZXJzLmxpbmVXaWR0aCB8fCBiYXNlLmxpbmVXaWR0aCksXG4gICAgICAgIGtleTogW2Jhc2Uua2V5LCBtb2RpZmllcnMubGluZVdpZHRoXS5maWx0ZXIoeCA9PiB4KS5qb2luKCcnKSxcbiAgICB9O1xufVxuZnVuY3Rpb24gY2lyY2xlV2lkdGgoKSB7XG4gICAgcmV0dXJuIFszIC8gNjQsIDQgLyA2NF07XG59XG5mdW5jdGlvbiBsaW5lV2lkdGgoYnJ1c2gsIGN1cnJlbnQpIHtcbiAgICByZXR1cm4gKChicnVzaC5saW5lV2lkdGggfHwgMTApICogKGN1cnJlbnQgPyAwLjg1IDogMSkpIC8gNjQ7XG59XG5mdW5jdGlvbiBvcGFjaXR5KGJydXNoLCBjdXJyZW50KSB7XG4gICAgcmV0dXJuIChicnVzaC5vcGFjaXR5IHx8IDEpICogKGN1cnJlbnQgPyAwLjkgOiAxKTtcbn1cbmZ1bmN0aW9uIGFycm93TWFyZ2luKHNob3J0ZW4pIHtcbiAgICByZXR1cm4gKHNob3J0ZW4gPyAyMCA6IDEwKSAvIDY0O1xufVxuZnVuY3Rpb24gcG9zMnVzZXIocG9zLCBib3VuZHMpIHtcbiAgICBjb25zdCB4U2NhbGUgPSBNYXRoLm1pbigxLCBib3VuZHMud2lkdGggLyBib3VuZHMuaGVpZ2h0KTtcbiAgICBjb25zdCB5U2NhbGUgPSBNYXRoLm1pbigxLCBib3VuZHMuaGVpZ2h0IC8gYm91bmRzLndpZHRoKTtcbiAgICByZXR1cm4gWyhwb3NbMF0gLSAzLjUpICogeFNjYWxlLCAoMy41IC0gcG9zWzFdKSAqIHlTY2FsZV07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zdmcuanMubWFwIiwiaW1wb3J0IHsgc2V0VmlzaWJsZSwgY3JlYXRlRWwgfSBmcm9tICcuL3V0aWwuanMnO1xuaW1wb3J0IHsgY29sb3JzLCBmaWxlcywgcmFua3MgfSBmcm9tICcuL3R5cGVzLmpzJztcbmltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgYXMgY3JlYXRlU1ZHLCBzZXRBdHRyaWJ1dGVzIH0gZnJvbSAnLi9zdmcuanMnO1xuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlcldyYXAoZWxlbWVudCwgcykge1xuICAgIC8vIC5jZy13cmFwIChlbGVtZW50IHBhc3NlZCB0byBDaGVzc2dyb3VuZClcbiAgICAvLyAgIGNnLWNvbnRhaW5lclxuICAgIC8vICAgICBjZy1ib2FyZFxuICAgIC8vICAgICBzdmcuY2ctc2hhcGVzXG4gICAgLy8gICAgICAgZGVmc1xuICAgIC8vICAgICAgIGdcbiAgICAvLyAgICAgc3ZnLmNnLWN1c3RvbS1zdmdzXG4gICAgLy8gICAgICAgZ1xuICAgIC8vICAgICBjZy1hdXRvLXBpZWNlc1xuICAgIC8vICAgICBjb29yZHMucmFua3NcbiAgICAvLyAgICAgY29vcmRzLmZpbGVzXG4gICAgLy8gICAgIHBpZWNlLmdob3N0XG4gICAgZWxlbWVudC5pbm5lckhUTUwgPSAnJztcbiAgICAvLyBlbnN1cmUgdGhlIGNnLXdyYXAgY2xhc3MgaXMgc2V0XG4gICAgLy8gc28gYm91bmRzIGNhbGN1bGF0aW9uIGNhbiB1c2UgdGhlIENTUyB3aWR0aC9oZWlnaHQgdmFsdWVzXG4gICAgLy8gYWRkIHRoYXQgY2xhc3MgeW91cnNlbGYgdG8gdGhlIGVsZW1lbnQgYmVmb3JlIGNhbGxpbmcgY2hlc3Nncm91bmRcbiAgICAvLyBmb3IgYSBzbGlnaHQgcGVyZm9ybWFuY2UgaW1wcm92ZW1lbnQhIChhdm9pZHMgcmVjb21wdXRpbmcgc3R5bGUpXG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdjZy13cmFwJyk7XG4gICAgZm9yIChjb25zdCBjIG9mIGNvbG9ycylcbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKCdvcmllbnRhdGlvbi0nICsgYywgcy5vcmllbnRhdGlvbiA9PT0gYyk7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKCdtYW5pcHVsYWJsZScsICFzLnZpZXdPbmx5KTtcbiAgICBjb25zdCBjb250YWluZXIgPSBjcmVhdGVFbCgnY2ctY29udGFpbmVyJyk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICAgIGNvbnN0IGJvYXJkID0gY3JlYXRlRWwoJ2NnLWJvYXJkJyk7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGJvYXJkKTtcbiAgICBsZXQgc3ZnO1xuICAgIGxldCBjdXN0b21Tdmc7XG4gICAgbGV0IGF1dG9QaWVjZXM7XG4gICAgaWYgKHMuZHJhd2FibGUudmlzaWJsZSkge1xuICAgICAgICBzdmcgPSBzZXRBdHRyaWJ1dGVzKGNyZWF0ZVNWRygnc3ZnJyksIHtcbiAgICAgICAgICAgIGNsYXNzOiAnY2ctc2hhcGVzJyxcbiAgICAgICAgICAgIHZpZXdCb3g6ICctNCAtNCA4IDgnLFxuICAgICAgICAgICAgcHJlc2VydmVBc3BlY3RSYXRpbzogJ3hNaWRZTWlkIHNsaWNlJyxcbiAgICAgICAgfSk7XG4gICAgICAgIHN2Zy5hcHBlbmRDaGlsZChjcmVhdGVTVkcoJ2RlZnMnKSk7XG4gICAgICAgIHN2Zy5hcHBlbmRDaGlsZChjcmVhdGVTVkcoJ2cnKSk7XG4gICAgICAgIGN1c3RvbVN2ZyA9IHNldEF0dHJpYnV0ZXMoY3JlYXRlU1ZHKCdzdmcnKSwge1xuICAgICAgICAgICAgY2xhc3M6ICdjZy1jdXN0b20tc3ZncycsXG4gICAgICAgICAgICB2aWV3Qm94OiAnLTMuNSAtMy41IDggOCcsXG4gICAgICAgICAgICBwcmVzZXJ2ZUFzcGVjdFJhdGlvOiAneE1pZFlNaWQgc2xpY2UnLFxuICAgICAgICB9KTtcbiAgICAgICAgY3VzdG9tU3ZnLmFwcGVuZENoaWxkKGNyZWF0ZVNWRygnZycpKTtcbiAgICAgICAgYXV0b1BpZWNlcyA9IGNyZWF0ZUVsKCdjZy1hdXRvLXBpZWNlcycpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoc3ZnKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGN1c3RvbVN2Zyk7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChhdXRvUGllY2VzKTtcbiAgICB9XG4gICAgaWYgKHMuY29vcmRpbmF0ZXMpIHtcbiAgICAgICAgY29uc3Qgb3JpZW50Q2xhc3MgPSBzLm9yaWVudGF0aW9uID09PSAnYmxhY2snID8gJyBibGFjaycgOiAnJztcbiAgICAgICAgY29uc3QgcmFua3NQb3NpdGlvbkNsYXNzID0gcy5yYW5rc1Bvc2l0aW9uID09PSAnbGVmdCcgPyAnIGxlZnQnIDogJyc7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChyZW5kZXJDb29yZHMocmFua3MsICdyYW5rcycgKyBvcmllbnRDbGFzcyArIHJhbmtzUG9zaXRpb25DbGFzcykpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQocmVuZGVyQ29vcmRzKGZpbGVzLCAnZmlsZXMnICsgb3JpZW50Q2xhc3MpKTtcbiAgICB9XG4gICAgbGV0IGdob3N0O1xuICAgIGlmIChzLmRyYWdnYWJsZS5zaG93R2hvc3QpIHtcbiAgICAgICAgZ2hvc3QgPSBjcmVhdGVFbCgncGllY2UnLCAnZ2hvc3QnKTtcbiAgICAgICAgc2V0VmlzaWJsZShnaG9zdCwgZmFsc2UpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZ2hvc3QpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBib2FyZCxcbiAgICAgICAgY29udGFpbmVyLFxuICAgICAgICB3cmFwOiBlbGVtZW50LFxuICAgICAgICBnaG9zdCxcbiAgICAgICAgc3ZnLFxuICAgICAgICBjdXN0b21TdmcsXG4gICAgICAgIGF1dG9QaWVjZXMsXG4gICAgfTtcbn1cbmZ1bmN0aW9uIHJlbmRlckNvb3JkcyhlbGVtcywgY2xhc3NOYW1lKSB7XG4gICAgY29uc3QgZWwgPSBjcmVhdGVFbCgnY29vcmRzJywgY2xhc3NOYW1lKTtcbiAgICBsZXQgZjtcbiAgICBmb3IgKGNvbnN0IGVsZW0gb2YgZWxlbXMpIHtcbiAgICAgICAgZiA9IGNyZWF0ZUVsKCdjb29yZCcpO1xuICAgICAgICBmLnRleHRDb250ZW50ID0gZWxlbTtcbiAgICAgICAgZWwuYXBwZW5kQ2hpbGQoZik7XG4gICAgfVxuICAgIHJldHVybiBlbDtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXdyYXAuanMubWFwIiwiaW1wb3J0ICogYXMgYm9hcmQgZnJvbSAnLi9ib2FyZC5qcyc7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4vdXRpbC5qcyc7XG5pbXBvcnQgeyBjYW5jZWwgYXMgZHJhZ0NhbmNlbCB9IGZyb20gJy4vZHJhZy5qcyc7XG5leHBvcnQgZnVuY3Rpb24gc2V0RHJvcE1vZGUocywgcGllY2UpIHtcbiAgICBzLmRyb3Btb2RlID0ge1xuICAgICAgICBhY3RpdmU6IHRydWUsXG4gICAgICAgIHBpZWNlLFxuICAgIH07XG4gICAgZHJhZ0NhbmNlbChzKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjYW5jZWxEcm9wTW9kZShzKSB7XG4gICAgcy5kcm9wbW9kZSA9IHtcbiAgICAgICAgYWN0aXZlOiBmYWxzZSxcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGRyb3AocywgZSkge1xuICAgIGlmICghcy5kcm9wbW9kZS5hY3RpdmUpXG4gICAgICAgIHJldHVybjtcbiAgICBib2FyZC51bnNldFByZW1vdmUocyk7XG4gICAgYm9hcmQudW5zZXRQcmVkcm9wKHMpO1xuICAgIGNvbnN0IHBpZWNlID0gcy5kcm9wbW9kZS5waWVjZTtcbiAgICBpZiAocGllY2UpIHtcbiAgICAgICAgcy5waWVjZXMuc2V0KCdhMCcsIHBpZWNlKTtcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSB1dGlsLmV2ZW50UG9zaXRpb24oZSk7XG4gICAgICAgIGNvbnN0IGRlc3QgPSBwb3NpdGlvbiAmJiBib2FyZC5nZXRLZXlBdERvbVBvcyhwb3NpdGlvbiwgYm9hcmQud2hpdGVQb3YocyksIHMuZG9tLmJvdW5kcygpKTtcbiAgICAgICAgaWYgKGRlc3QpXG4gICAgICAgICAgICBib2FyZC5kcm9wTmV3UGllY2UocywgJ2EwJywgZGVzdCk7XG4gICAgfVxuICAgIHMuZG9tLnJlZHJhdygpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZHJvcC5qcy5tYXAiLCJpbXBvcnQgKiBhcyBkcmFnIGZyb20gJy4vZHJhZy5qcyc7XG5pbXBvcnQgKiBhcyBkcmF3IGZyb20gJy4vZHJhdy5qcyc7XG5pbXBvcnQgeyBkcm9wIH0gZnJvbSAnLi9kcm9wLmpzJztcbmltcG9ydCB7IGlzUmlnaHRCdXR0b24gfSBmcm9tICcuL3V0aWwuanMnO1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRCb2FyZChzLCBvblJlc2l6ZSkge1xuICAgIGNvbnN0IGJvYXJkRWwgPSBzLmRvbS5lbGVtZW50cy5ib2FyZDtcbiAgICBpZiAoJ1Jlc2l6ZU9ic2VydmVyJyBpbiB3aW5kb3cpXG4gICAgICAgIG5ldyBSZXNpemVPYnNlcnZlcihvblJlc2l6ZSkub2JzZXJ2ZShzLmRvbS5lbGVtZW50cy53cmFwKTtcbiAgICBpZiAocy52aWV3T25seSlcbiAgICAgICAgcmV0dXJuO1xuICAgIC8vIENhbm5vdCBiZSBwYXNzaXZlLCBiZWNhdXNlIHdlIHByZXZlbnQgdG91Y2ggc2Nyb2xsaW5nIGFuZCBkcmFnZ2luZyBvZlxuICAgIC8vIHNlbGVjdGVkIGVsZW1lbnRzLlxuICAgIGNvbnN0IG9uU3RhcnQgPSBzdGFydERyYWdPckRyYXcocyk7XG4gICAgYm9hcmRFbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0Jywgb25TdGFydCwge1xuICAgICAgICBwYXNzaXZlOiBmYWxzZSxcbiAgICB9KTtcbiAgICBib2FyZEVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uU3RhcnQsIHtcbiAgICAgICAgcGFzc2l2ZTogZmFsc2UsXG4gICAgfSk7XG4gICAgaWYgKHMuZGlzYWJsZUNvbnRleHRNZW51IHx8IHMuZHJhd2FibGUuZW5hYmxlZCkge1xuICAgICAgICBib2FyZEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgZSA9PiBlLnByZXZlbnREZWZhdWx0KCkpO1xuICAgIH1cbn1cbi8vIHJldHVybnMgdGhlIHVuYmluZCBmdW5jdGlvblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmREb2N1bWVudChzLCBvblJlc2l6ZSkge1xuICAgIGNvbnN0IHVuYmluZHMgPSBbXTtcbiAgICAvLyBPbGQgdmVyc2lvbnMgb2YgRWRnZSBhbmQgU2FmYXJpIGRvIG5vdCBzdXBwb3J0IFJlc2l6ZU9ic2VydmVyLiBTZW5kXG4gICAgLy8gY2hlc3Nncm91bmQucmVzaXplIGlmIGEgdXNlciBhY3Rpb24gaGFzIGNoYW5nZWQgdGhlIGJvdW5kcyBvZiB0aGUgYm9hcmQuXG4gICAgaWYgKCEoJ1Jlc2l6ZU9ic2VydmVyJyBpbiB3aW5kb3cpKVxuICAgICAgICB1bmJpbmRzLnB1c2godW5iaW5kYWJsZShkb2N1bWVudC5ib2R5LCAnY2hlc3Nncm91bmQucmVzaXplJywgb25SZXNpemUpKTtcbiAgICBpZiAoIXMudmlld09ubHkpIHtcbiAgICAgICAgY29uc3Qgb25tb3ZlID0gZHJhZ09yRHJhdyhzLCBkcmFnLm1vdmUsIGRyYXcubW92ZSk7XG4gICAgICAgIGNvbnN0IG9uZW5kID0gZHJhZ09yRHJhdyhzLCBkcmFnLmVuZCwgZHJhdy5lbmQpO1xuICAgICAgICBmb3IgKGNvbnN0IGV2IG9mIFsndG91Y2htb3ZlJywgJ21vdXNlbW92ZSddKVxuICAgICAgICAgICAgdW5iaW5kcy5wdXNoKHVuYmluZGFibGUoZG9jdW1lbnQsIGV2LCBvbm1vdmUpKTtcbiAgICAgICAgZm9yIChjb25zdCBldiBvZiBbJ3RvdWNoZW5kJywgJ21vdXNldXAnXSlcbiAgICAgICAgICAgIHVuYmluZHMucHVzaCh1bmJpbmRhYmxlKGRvY3VtZW50LCBldiwgb25lbmQpKTtcbiAgICAgICAgY29uc3Qgb25TY3JvbGwgPSAoKSA9PiBzLmRvbS5ib3VuZHMuY2xlYXIoKTtcbiAgICAgICAgdW5iaW5kcy5wdXNoKHVuYmluZGFibGUoZG9jdW1lbnQsICdzY3JvbGwnLCBvblNjcm9sbCwgeyBjYXB0dXJlOiB0cnVlLCBwYXNzaXZlOiB0cnVlIH0pKTtcbiAgICAgICAgdW5iaW5kcy5wdXNoKHVuYmluZGFibGUod2luZG93LCAncmVzaXplJywgb25TY3JvbGwsIHsgcGFzc2l2ZTogdHJ1ZSB9KSk7XG4gICAgfVxuICAgIHJldHVybiAoKSA9PiB1bmJpbmRzLmZvckVhY2goZiA9PiBmKCkpO1xufVxuZnVuY3Rpb24gdW5iaW5kYWJsZShlbCwgZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucykge1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucyk7XG4gICAgcmV0dXJuICgpID0+IGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucyk7XG59XG5mdW5jdGlvbiBzdGFydERyYWdPckRyYXcocykge1xuICAgIHJldHVybiBlID0+IHtcbiAgICAgICAgaWYgKHMuZHJhZ2dhYmxlLmN1cnJlbnQpXG4gICAgICAgICAgICBkcmFnLmNhbmNlbChzKTtcbiAgICAgICAgZWxzZSBpZiAocy5kcmF3YWJsZS5jdXJyZW50KVxuICAgICAgICAgICAgZHJhdy5jYW5jZWwocyk7XG4gICAgICAgIGVsc2UgaWYgKGUuc2hpZnRLZXkgfHwgaXNSaWdodEJ1dHRvbihlKSkge1xuICAgICAgICAgICAgaWYgKHMuZHJhd2FibGUuZW5hYmxlZClcbiAgICAgICAgICAgICAgICBkcmF3LnN0YXJ0KHMsIGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCFzLnZpZXdPbmx5KSB7XG4gICAgICAgICAgICBpZiAocy5kcm9wbW9kZS5hY3RpdmUpXG4gICAgICAgICAgICAgICAgZHJvcChzLCBlKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBkcmFnLnN0YXJ0KHMsIGUpO1xuICAgICAgICB9XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGRyYWdPckRyYXcocywgd2l0aERyYWcsIHdpdGhEcmF3KSB7XG4gICAgcmV0dXJuIGUgPT4ge1xuICAgICAgICBpZiAocy5kcmF3YWJsZS5jdXJyZW50KSB7XG4gICAgICAgICAgICBpZiAocy5kcmF3YWJsZS5lbmFibGVkKVxuICAgICAgICAgICAgICAgIHdpdGhEcmF3KHMsIGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCFzLnZpZXdPbmx5KVxuICAgICAgICAgICAgd2l0aERyYWcocywgZSk7XG4gICAgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWV2ZW50cy5qcy5tYXAiLCJpbXBvcnQgeyBrZXkycG9zLCBjcmVhdGVFbCwgcG9zVG9UcmFuc2xhdGUgYXMgcG9zVG9UcmFuc2xhdGVGcm9tQm91bmRzLCB0cmFuc2xhdGUgfSBmcm9tICcuL3V0aWwuanMnO1xuaW1wb3J0IHsgd2hpdGVQb3YgfSBmcm9tICcuL2JvYXJkLmpzJztcbi8vIHBvcnRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS92ZWxvY2UvbGljaG9iaWxlL2Jsb2IvbWFzdGVyL3NyYy9qcy9jaGVzc2dyb3VuZC92aWV3LmpzXG4vLyBpbiBjYXNlIG9mIGJ1Z3MsIGJsYW1lIEB2ZWxvY2VcbmV4cG9ydCBmdW5jdGlvbiByZW5kZXIocykge1xuICAgIGNvbnN0IGFzV2hpdGUgPSB3aGl0ZVBvdihzKSwgcG9zVG9UcmFuc2xhdGUgPSBwb3NUb1RyYW5zbGF0ZUZyb21Cb3VuZHMocy5kb20uYm91bmRzKCkpLCBib2FyZEVsID0gcy5kb20uZWxlbWVudHMuYm9hcmQsIHBpZWNlcyA9IHMucGllY2VzLCBjdXJBbmltID0gcy5hbmltYXRpb24uY3VycmVudCwgYW5pbXMgPSBjdXJBbmltID8gY3VyQW5pbS5wbGFuLmFuaW1zIDogbmV3IE1hcCgpLCBmYWRpbmdzID0gY3VyQW5pbSA/IGN1ckFuaW0ucGxhbi5mYWRpbmdzIDogbmV3IE1hcCgpLCBjdXJEcmFnID0gcy5kcmFnZ2FibGUuY3VycmVudCwgc3F1YXJlcyA9IGNvbXB1dGVTcXVhcmVDbGFzc2VzKHMpLCBzYW1lUGllY2VzID0gbmV3IFNldCgpLCBzYW1lU3F1YXJlcyA9IG5ldyBTZXQoKSwgbW92ZWRQaWVjZXMgPSBuZXcgTWFwKCksIG1vdmVkU3F1YXJlcyA9IG5ldyBNYXAoKTsgLy8gYnkgY2xhc3MgbmFtZVxuICAgIGxldCBrLCBlbCwgcGllY2VBdEtleSwgZWxQaWVjZU5hbWUsIGFuaW0sIGZhZGluZywgcE12ZHNldCwgcE12ZCwgc012ZHNldCwgc012ZDtcbiAgICAvLyB3YWxrIG92ZXIgYWxsIGJvYXJkIGRvbSBlbGVtZW50cywgYXBwbHkgYW5pbWF0aW9ucyBhbmQgZmxhZyBtb3ZlZCBwaWVjZXNcbiAgICBlbCA9IGJvYXJkRWwuZmlyc3RDaGlsZDtcbiAgICB3aGlsZSAoZWwpIHtcbiAgICAgICAgayA9IGVsLmNnS2V5O1xuICAgICAgICBpZiAoaXNQaWVjZU5vZGUoZWwpKSB7XG4gICAgICAgICAgICBwaWVjZUF0S2V5ID0gcGllY2VzLmdldChrKTtcbiAgICAgICAgICAgIGFuaW0gPSBhbmltcy5nZXQoayk7XG4gICAgICAgICAgICBmYWRpbmcgPSBmYWRpbmdzLmdldChrKTtcbiAgICAgICAgICAgIGVsUGllY2VOYW1lID0gZWwuY2dQaWVjZTtcbiAgICAgICAgICAgIC8vIGlmIHBpZWNlIG5vdCBiZWluZyBkcmFnZ2VkIGFueW1vcmUsIHJlbW92ZSBkcmFnZ2luZyBzdHlsZVxuICAgICAgICAgICAgaWYgKGVsLmNnRHJhZ2dpbmcgJiYgKCFjdXJEcmFnIHx8IGN1ckRyYWcub3JpZyAhPT0gaykpIHtcbiAgICAgICAgICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnZ2luZycpO1xuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZShlbCwgcG9zVG9UcmFuc2xhdGUoa2V5MnBvcyhrKSwgYXNXaGl0ZSkpO1xuICAgICAgICAgICAgICAgIGVsLmNnRHJhZ2dpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHJlbW92ZSBmYWRpbmcgY2xhc3MgaWYgaXQgc3RpbGwgcmVtYWluc1xuICAgICAgICAgICAgaWYgKCFmYWRpbmcgJiYgZWwuY2dGYWRpbmcpIHtcbiAgICAgICAgICAgICAgICBlbC5jZ0ZhZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZhZGluZycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdGhlcmUgaXMgbm93IGEgcGllY2UgYXQgdGhpcyBkb20ga2V5XG4gICAgICAgICAgICBpZiAocGllY2VBdEtleSkge1xuICAgICAgICAgICAgICAgIC8vIGNvbnRpbnVlIGFuaW1hdGlvbiBpZiBhbHJlYWR5IGFuaW1hdGluZyBhbmQgc2FtZSBwaWVjZVxuICAgICAgICAgICAgICAgIC8vIChvdGhlcndpc2UgaXQgY291bGQgYW5pbWF0ZSBhIGNhcHR1cmVkIHBpZWNlKVxuICAgICAgICAgICAgICAgIGlmIChhbmltICYmIGVsLmNnQW5pbWF0aW5nICYmIGVsUGllY2VOYW1lID09PSBwaWVjZU5hbWVPZihwaWVjZUF0S2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb3MgPSBrZXkycG9zKGspO1xuICAgICAgICAgICAgICAgICAgICBwb3NbMF0gKz0gYW5pbVsyXTtcbiAgICAgICAgICAgICAgICAgICAgcG9zWzFdICs9IGFuaW1bM107XG4gICAgICAgICAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2FuaW0nKTtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNsYXRlKGVsLCBwb3NUb1RyYW5zbGF0ZShwb3MsIGFzV2hpdGUpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZWwuY2dBbmltYXRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgZWwuY2dBbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnYW5pbScpO1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2xhdGUoZWwsIHBvc1RvVHJhbnNsYXRlKGtleTJwb3MoayksIGFzV2hpdGUpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHMuYWRkUGllY2VaSW5kZXgpXG4gICAgICAgICAgICAgICAgICAgICAgICBlbC5zdHlsZS56SW5kZXggPSBwb3NaSW5kZXgoa2V5MnBvcyhrKSwgYXNXaGl0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIHNhbWUgcGllY2U6IGZsYWcgYXMgc2FtZVxuICAgICAgICAgICAgICAgIGlmIChlbFBpZWNlTmFtZSA9PT0gcGllY2VOYW1lT2YocGllY2VBdEtleSkgJiYgKCFmYWRpbmcgfHwgIWVsLmNnRmFkaW5nKSkge1xuICAgICAgICAgICAgICAgICAgICBzYW1lUGllY2VzLmFkZChrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gZGlmZmVyZW50IHBpZWNlOiBmbGFnIGFzIG1vdmVkIHVubGVzcyBpdCBpcyBhIGZhZGluZyBwaWVjZVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmFkaW5nICYmIGVsUGllY2VOYW1lID09PSBwaWVjZU5hbWVPZihmYWRpbmcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdmYWRpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLmNnRmFkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcGVuZFZhbHVlKG1vdmVkUGllY2VzLCBlbFBpZWNlTmFtZSwgZWwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gbm8gcGllY2U6IGZsYWcgYXMgbW92ZWRcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGFwcGVuZFZhbHVlKG1vdmVkUGllY2VzLCBlbFBpZWNlTmFtZSwgZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlzU3F1YXJlTm9kZShlbCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGNuID0gZWwuY2xhc3NOYW1lO1xuICAgICAgICAgICAgaWYgKHNxdWFyZXMuZ2V0KGspID09PSBjbilcbiAgICAgICAgICAgICAgICBzYW1lU3F1YXJlcy5hZGQoayk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgYXBwZW5kVmFsdWUobW92ZWRTcXVhcmVzLCBjbiwgZWwpO1xuICAgICAgICB9XG4gICAgICAgIGVsID0gZWwubmV4dFNpYmxpbmc7XG4gICAgfVxuICAgIC8vIHdhbGsgb3ZlciBhbGwgc3F1YXJlcyBpbiBjdXJyZW50IHNldCwgYXBwbHkgZG9tIGNoYW5nZXMgdG8gbW92ZWQgc3F1YXJlc1xuICAgIC8vIG9yIGFwcGVuZCBuZXcgc3F1YXJlc1xuICAgIGZvciAoY29uc3QgW3NrLCBjbGFzc05hbWVdIG9mIHNxdWFyZXMpIHtcbiAgICAgICAgaWYgKCFzYW1lU3F1YXJlcy5oYXMoc2spKSB7XG4gICAgICAgICAgICBzTXZkc2V0ID0gbW92ZWRTcXVhcmVzLmdldChjbGFzc05hbWUpO1xuICAgICAgICAgICAgc012ZCA9IHNNdmRzZXQgJiYgc012ZHNldC5wb3AoKTtcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zbGF0aW9uID0gcG9zVG9UcmFuc2xhdGUoa2V5MnBvcyhzayksIGFzV2hpdGUpO1xuICAgICAgICAgICAgaWYgKHNNdmQpIHtcbiAgICAgICAgICAgICAgICBzTXZkLmNnS2V5ID0gc2s7XG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlKHNNdmQsIHRyYW5zbGF0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNxdWFyZU5vZGUgPSBjcmVhdGVFbCgnc3F1YXJlJywgY2xhc3NOYW1lKTtcbiAgICAgICAgICAgICAgICBzcXVhcmVOb2RlLmNnS2V5ID0gc2s7XG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlKHNxdWFyZU5vZGUsIHRyYW5zbGF0aW9uKTtcbiAgICAgICAgICAgICAgICBib2FyZEVsLmluc2VydEJlZm9yZShzcXVhcmVOb2RlLCBib2FyZEVsLmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIHdhbGsgb3ZlciBhbGwgcGllY2VzIGluIGN1cnJlbnQgc2V0LCBhcHBseSBkb20gY2hhbmdlcyB0byBtb3ZlZCBwaWVjZXNcbiAgICAvLyBvciBhcHBlbmQgbmV3IHBpZWNlc1xuICAgIGZvciAoY29uc3QgW2ssIHBdIG9mIHBpZWNlcykge1xuICAgICAgICBhbmltID0gYW5pbXMuZ2V0KGspO1xuICAgICAgICBpZiAoIXNhbWVQaWVjZXMuaGFzKGspKSB7XG4gICAgICAgICAgICBwTXZkc2V0ID0gbW92ZWRQaWVjZXMuZ2V0KHBpZWNlTmFtZU9mKHApKTtcbiAgICAgICAgICAgIHBNdmQgPSBwTXZkc2V0ICYmIHBNdmRzZXQucG9wKCk7XG4gICAgICAgICAgICAvLyBhIHNhbWUgcGllY2Ugd2FzIG1vdmVkXG4gICAgICAgICAgICBpZiAocE12ZCkge1xuICAgICAgICAgICAgICAgIC8vIGFwcGx5IGRvbSBjaGFuZ2VzXG4gICAgICAgICAgICAgICAgcE12ZC5jZ0tleSA9IGs7XG4gICAgICAgICAgICAgICAgaWYgKHBNdmQuY2dGYWRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgcE12ZC5jbGFzc0xpc3QucmVtb3ZlKCdmYWRpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgcE12ZC5jZ0ZhZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBwb3MgPSBrZXkycG9zKGspO1xuICAgICAgICAgICAgICAgIGlmIChzLmFkZFBpZWNlWkluZGV4KVxuICAgICAgICAgICAgICAgICAgICBwTXZkLnN0eWxlLnpJbmRleCA9IHBvc1pJbmRleChwb3MsIGFzV2hpdGUpO1xuICAgICAgICAgICAgICAgIGlmIChhbmltKSB7XG4gICAgICAgICAgICAgICAgICAgIHBNdmQuY2dBbmltYXRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBwTXZkLmNsYXNzTGlzdC5hZGQoJ2FuaW0nKTtcbiAgICAgICAgICAgICAgICAgICAgcG9zWzBdICs9IGFuaW1bMl07XG4gICAgICAgICAgICAgICAgICAgIHBvc1sxXSArPSBhbmltWzNdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0cmFuc2xhdGUocE12ZCwgcG9zVG9UcmFuc2xhdGUocG9zLCBhc1doaXRlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBubyBwaWVjZSBpbiBtb3ZlZCBvYmo6IGluc2VydCB0aGUgbmV3IHBpZWNlXG4gICAgICAgICAgICAvLyBhc3N1bWVzIHRoZSBuZXcgcGllY2UgaXMgbm90IGJlaW5nIGRyYWdnZWRcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBpZWNlTmFtZSA9IHBpZWNlTmFtZU9mKHApLCBwaWVjZU5vZGUgPSBjcmVhdGVFbCgncGllY2UnLCBwaWVjZU5hbWUpLCBwb3MgPSBrZXkycG9zKGspO1xuICAgICAgICAgICAgICAgIHBpZWNlTm9kZS5jZ1BpZWNlID0gcGllY2VOYW1lO1xuICAgICAgICAgICAgICAgIHBpZWNlTm9kZS5jZ0tleSA9IGs7XG4gICAgICAgICAgICAgICAgaWYgKGFuaW0pIHtcbiAgICAgICAgICAgICAgICAgICAgcGllY2VOb2RlLmNnQW5pbWF0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcG9zWzBdICs9IGFuaW1bMl07XG4gICAgICAgICAgICAgICAgICAgIHBvc1sxXSArPSBhbmltWzNdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0cmFuc2xhdGUocGllY2VOb2RlLCBwb3NUb1RyYW5zbGF0ZShwb3MsIGFzV2hpdGUpKTtcbiAgICAgICAgICAgICAgICBpZiAocy5hZGRQaWVjZVpJbmRleClcbiAgICAgICAgICAgICAgICAgICAgcGllY2VOb2RlLnN0eWxlLnpJbmRleCA9IHBvc1pJbmRleChwb3MsIGFzV2hpdGUpO1xuICAgICAgICAgICAgICAgIGJvYXJkRWwuYXBwZW5kQ2hpbGQocGllY2VOb2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyByZW1vdmUgYW55IGVsZW1lbnQgdGhhdCByZW1haW5zIGluIHRoZSBtb3ZlZCBzZXRzXG4gICAgZm9yIChjb25zdCBub2RlcyBvZiBtb3ZlZFBpZWNlcy52YWx1ZXMoKSlcbiAgICAgICAgcmVtb3ZlTm9kZXMocywgbm9kZXMpO1xuICAgIGZvciAoY29uc3Qgbm9kZXMgb2YgbW92ZWRTcXVhcmVzLnZhbHVlcygpKVxuICAgICAgICByZW1vdmVOb2RlcyhzLCBub2Rlcyk7XG59XG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyUmVzaXplZChzKSB7XG4gICAgY29uc3QgYXNXaGl0ZSA9IHdoaXRlUG92KHMpLCBwb3NUb1RyYW5zbGF0ZSA9IHBvc1RvVHJhbnNsYXRlRnJvbUJvdW5kcyhzLmRvbS5ib3VuZHMoKSk7XG4gICAgbGV0IGVsID0gcy5kb20uZWxlbWVudHMuYm9hcmQuZmlyc3RDaGlsZDtcbiAgICB3aGlsZSAoZWwpIHtcbiAgICAgICAgaWYgKChpc1BpZWNlTm9kZShlbCkgJiYgIWVsLmNnQW5pbWF0aW5nKSB8fCBpc1NxdWFyZU5vZGUoZWwpKSB7XG4gICAgICAgICAgICB0cmFuc2xhdGUoZWwsIHBvc1RvVHJhbnNsYXRlKGtleTJwb3MoZWwuY2dLZXkpLCBhc1doaXRlKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWwgPSBlbC5uZXh0U2libGluZztcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlQm91bmRzKHMpIHtcbiAgICBjb25zdCBib3VuZHMgPSBzLmRvbS5lbGVtZW50cy53cmFwLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IHMuZG9tLmVsZW1lbnRzLmNvbnRhaW5lcjtcbiAgICBjb25zdCByYXRpbyA9IGJvdW5kcy5oZWlnaHQgLyBib3VuZHMud2lkdGg7XG4gICAgY29uc3Qgd2lkdGggPSAoTWF0aC5mbG9vcigoYm91bmRzLndpZHRoICogd2luZG93LmRldmljZVBpeGVsUmF0aW8pIC8gOCkgKiA4KSAvIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgIGNvbnN0IGhlaWdodCA9IHdpZHRoICogcmF0aW87XG4gICAgY29udGFpbmVyLnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xuICAgIGNvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xuICAgIHMuZG9tLmJvdW5kcy5jbGVhcigpO1xuICAgIGlmIChzLmFkZERpbWVuc2lvbnNDc3NWYXJzKSB7XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1jZy13aWR0aCcsIHdpZHRoICsgJ3B4Jyk7XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1jZy1oZWlnaHQnLCBoZWlnaHQgKyAncHgnKTtcbiAgICB9XG59XG5mdW5jdGlvbiBpc1BpZWNlTm9kZShlbCkge1xuICAgIHJldHVybiBlbC50YWdOYW1lID09PSAnUElFQ0UnO1xufVxuZnVuY3Rpb24gaXNTcXVhcmVOb2RlKGVsKSB7XG4gICAgcmV0dXJuIGVsLnRhZ05hbWUgPT09ICdTUVVBUkUnO1xufVxuZnVuY3Rpb24gcmVtb3ZlTm9kZXMocywgbm9kZXMpIHtcbiAgICBmb3IgKGNvbnN0IG5vZGUgb2Ygbm9kZXMpXG4gICAgICAgIHMuZG9tLmVsZW1lbnRzLmJvYXJkLnJlbW92ZUNoaWxkKG5vZGUpO1xufVxuZnVuY3Rpb24gcG9zWkluZGV4KHBvcywgYXNXaGl0ZSkge1xuICAgIGNvbnN0IG1pblogPSAzO1xuICAgIGNvbnN0IHJhbmsgPSBwb3NbMV07XG4gICAgY29uc3QgeiA9IGFzV2hpdGUgPyBtaW5aICsgNyAtIHJhbmsgOiBtaW5aICsgcmFuaztcbiAgICByZXR1cm4gYCR7en1gO1xufVxuZnVuY3Rpb24gcGllY2VOYW1lT2YocGllY2UpIHtcbiAgICByZXR1cm4gYCR7cGllY2UuY29sb3J9ICR7cGllY2Uucm9sZX1gO1xufVxuZnVuY3Rpb24gY29tcHV0ZVNxdWFyZUNsYXNzZXMocykge1xuICAgIHZhciBfYTtcbiAgICBjb25zdCBzcXVhcmVzID0gbmV3IE1hcCgpO1xuICAgIGlmIChzLmxhc3RNb3ZlICYmIHMuaGlnaGxpZ2h0Lmxhc3RNb3ZlKVxuICAgICAgICBmb3IgKGNvbnN0IGsgb2Ygcy5sYXN0TW92ZSkge1xuICAgICAgICAgICAgYWRkU3F1YXJlKHNxdWFyZXMsIGssICdsYXN0LW1vdmUnKTtcbiAgICAgICAgfVxuICAgIGlmIChzLmNoZWNrICYmIHMuaGlnaGxpZ2h0LmNoZWNrKVxuICAgICAgICBhZGRTcXVhcmUoc3F1YXJlcywgcy5jaGVjaywgJ2NoZWNrJyk7XG4gICAgaWYgKHMuc2VsZWN0ZWQpIHtcbiAgICAgICAgYWRkU3F1YXJlKHNxdWFyZXMsIHMuc2VsZWN0ZWQsICdzZWxlY3RlZCcpO1xuICAgICAgICBpZiAocy5tb3ZhYmxlLnNob3dEZXN0cykge1xuICAgICAgICAgICAgY29uc3QgZGVzdHMgPSAoX2EgPSBzLm1vdmFibGUuZGVzdHMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5nZXQocy5zZWxlY3RlZCk7XG4gICAgICAgICAgICBpZiAoZGVzdHMpXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBrIG9mIGRlc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZFNxdWFyZShzcXVhcmVzLCBrLCAnbW92ZS1kZXN0JyArIChzLnBpZWNlcy5oYXMoaykgPyAnIG9jJyA6ICcnKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcERlc3RzID0gcy5wcmVtb3ZhYmxlLmRlc3RzO1xuICAgICAgICAgICAgaWYgKHBEZXN0cylcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGsgb2YgcERlc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZFNxdWFyZShzcXVhcmVzLCBrLCAncHJlbW92ZS1kZXN0JyArIChzLnBpZWNlcy5oYXMoaykgPyAnIG9jJyA6ICcnKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHByZW1vdmUgPSBzLnByZW1vdmFibGUuY3VycmVudDtcbiAgICBpZiAocHJlbW92ZSlcbiAgICAgICAgZm9yIChjb25zdCBrIG9mIHByZW1vdmUpXG4gICAgICAgICAgICBhZGRTcXVhcmUoc3F1YXJlcywgaywgJ2N1cnJlbnQtcHJlbW92ZScpO1xuICAgIGVsc2UgaWYgKHMucHJlZHJvcHBhYmxlLmN1cnJlbnQpXG4gICAgICAgIGFkZFNxdWFyZShzcXVhcmVzLCBzLnByZWRyb3BwYWJsZS5jdXJyZW50LmtleSwgJ2N1cnJlbnQtcHJlbW92ZScpO1xuICAgIGNvbnN0IG8gPSBzLmV4cGxvZGluZztcbiAgICBpZiAobylcbiAgICAgICAgZm9yIChjb25zdCBrIG9mIG8ua2V5cylcbiAgICAgICAgICAgIGFkZFNxdWFyZShzcXVhcmVzLCBrLCAnZXhwbG9kaW5nJyArIG8uc3RhZ2UpO1xuICAgIHJldHVybiBzcXVhcmVzO1xufVxuZnVuY3Rpb24gYWRkU3F1YXJlKHNxdWFyZXMsIGtleSwga2xhc3MpIHtcbiAgICBjb25zdCBjbGFzc2VzID0gc3F1YXJlcy5nZXQoa2V5KTtcbiAgICBpZiAoY2xhc3NlcylcbiAgICAgICAgc3F1YXJlcy5zZXQoa2V5LCBgJHtjbGFzc2VzfSAke2tsYXNzfWApO1xuICAgIGVsc2VcbiAgICAgICAgc3F1YXJlcy5zZXQoa2V5LCBrbGFzcyk7XG59XG5mdW5jdGlvbiBhcHBlbmRWYWx1ZShtYXAsIGtleSwgdmFsdWUpIHtcbiAgICBjb25zdCBhcnIgPSBtYXAuZ2V0KGtleSk7XG4gICAgaWYgKGFycilcbiAgICAgICAgYXJyLnB1c2godmFsdWUpO1xuICAgIGVsc2VcbiAgICAgICAgbWFwLnNldChrZXksIFt2YWx1ZV0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmVuZGVyLmpzLm1hcCIsImltcG9ydCB7IGtleTJwb3MsIGNyZWF0ZUVsLCBwb3NUb1RyYW5zbGF0ZSBhcyBwb3NUb1RyYW5zbGF0ZUZyb21Cb3VuZHMsIHRyYW5zbGF0ZUFuZFNjYWxlIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7IHdoaXRlUG92IH0gZnJvbSAnLi9ib2FyZCc7XG5pbXBvcnQgeyBzeW5jU2hhcGVzIH0gZnJvbSAnLi9zeW5jJztcbmV4cG9ydCBmdW5jdGlvbiByZW5kZXIoc3RhdGUsIGF1dG9QaWVjZUVsKSB7XG4gICAgY29uc3QgYXV0b1BpZWNlcyA9IHN0YXRlLmRyYXdhYmxlLmF1dG9TaGFwZXMuZmlsdGVyKGF1dG9TaGFwZSA9PiBhdXRvU2hhcGUucGllY2UpO1xuICAgIGNvbnN0IGF1dG9QaWVjZVNoYXBlcyA9IGF1dG9QaWVjZXMubWFwKChzKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzaGFwZTogcyxcbiAgICAgICAgICAgIGhhc2g6IGhhc2gocyksXG4gICAgICAgICAgICBjdXJyZW50OiBmYWxzZSxcbiAgICAgICAgfTtcbiAgICB9KTtcbiAgICBzeW5jU2hhcGVzKGF1dG9QaWVjZVNoYXBlcywgYXV0b1BpZWNlRWwsIHNoYXBlID0+IHJlbmRlclNoYXBlKHN0YXRlLCBzaGFwZSwgc3RhdGUuZG9tLmJvdW5kcygpKSk7XG59XG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyUmVzaXplZChzdGF0ZSkge1xuICAgIHZhciBfYTtcbiAgICBjb25zdCBhc1doaXRlID0gd2hpdGVQb3Yoc3RhdGUpLCBwb3NUb1RyYW5zbGF0ZSA9IHBvc1RvVHJhbnNsYXRlRnJvbUJvdW5kcyhzdGF0ZS5kb20uYm91bmRzKCkpO1xuICAgIGxldCBlbCA9IChfYSA9IHN0YXRlLmRvbS5lbGVtZW50cy5hdXRvUGllY2VzKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZmlyc3RDaGlsZDtcbiAgICB3aGlsZSAoZWwpIHtcbiAgICAgICAgdHJhbnNsYXRlQW5kU2NhbGUoZWwsIHBvc1RvVHJhbnNsYXRlKGtleTJwb3MoZWwuY2dLZXkpLCBhc1doaXRlKSwgZWwuY2dTY2FsZSk7XG4gICAgICAgIGVsID0gZWwubmV4dFNpYmxpbmc7XG4gICAgfVxufVxuZnVuY3Rpb24gcmVuZGVyU2hhcGUoc3RhdGUsIHsgc2hhcGUsIGhhc2ggfSwgYm91bmRzKSB7XG4gICAgdmFyIF9hLCBfYiwgX2M7XG4gICAgY29uc3Qgb3JpZyA9IHNoYXBlLm9yaWc7XG4gICAgY29uc3Qgcm9sZSA9IChfYSA9IHNoYXBlLnBpZWNlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Eucm9sZTtcbiAgICBjb25zdCBjb2xvciA9IChfYiA9IHNoYXBlLnBpZWNlKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuY29sb3I7XG4gICAgY29uc3Qgc2NhbGUgPSAoX2MgPSBzaGFwZS5waWVjZSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLnNjYWxlO1xuICAgIGNvbnN0IHBpZWNlRWwgPSBjcmVhdGVFbCgncGllY2UnLCBgJHtyb2xlfSAke2NvbG9yfWApO1xuICAgIHBpZWNlRWwuc2V0QXR0cmlidXRlKCdjZ0hhc2gnLCBoYXNoKTtcbiAgICBwaWVjZUVsLmNnS2V5ID0gb3JpZztcbiAgICBwaWVjZUVsLmNnU2NhbGUgPSBzY2FsZTtcbiAgICB0cmFuc2xhdGVBbmRTY2FsZShwaWVjZUVsLCBwb3NUb1RyYW5zbGF0ZUZyb21Cb3VuZHMoYm91bmRzKShrZXkycG9zKG9yaWcpLCB3aGl0ZVBvdihzdGF0ZSkpLCBzY2FsZSk7XG4gICAgcmV0dXJuIHBpZWNlRWw7XG59XG5mdW5jdGlvbiBoYXNoKGF1dG9QaWVjZSkge1xuICAgIHZhciBfYSwgX2IsIF9jO1xuICAgIHJldHVybiBbYXV0b1BpZWNlLm9yaWcsIChfYSA9IGF1dG9QaWVjZS5waWVjZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnJvbGUsIChfYiA9IGF1dG9QaWVjZS5waWVjZSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNvbG9yLCAoX2MgPSBhdXRvUGllY2UucGllY2UpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5zY2FsZV0uam9pbignLCcpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXV0b1BpZWNlcy5qcy5tYXAiLCJpbXBvcnQgeyBzdGFydCB9IGZyb20gJy4vYXBpLmpzJztcbmltcG9ydCB7IGNvbmZpZ3VyZSB9IGZyb20gJy4vY29uZmlnLmpzJztcbmltcG9ydCB7IGRlZmF1bHRzIH0gZnJvbSAnLi9zdGF0ZS5qcyc7XG5pbXBvcnQgeyByZW5kZXJXcmFwIH0gZnJvbSAnLi93cmFwLmpzJztcbmltcG9ydCAqIGFzIGV2ZW50cyBmcm9tICcuL2V2ZW50cy5qcyc7XG5pbXBvcnQgeyByZW5kZXIsIHJlbmRlclJlc2l6ZWQsIHVwZGF0ZUJvdW5kcyB9IGZyb20gJy4vcmVuZGVyLmpzJztcbmltcG9ydCAqIGFzIGF1dG9QaWVjZXMgZnJvbSAnLi9hdXRvUGllY2VzLmpzJztcbmltcG9ydCAqIGFzIHN2ZyBmcm9tICcuL3N2Zy5qcyc7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4vdXRpbC5qcyc7XG5leHBvcnQgZnVuY3Rpb24gQ2hlc3Nncm91bmQoZWxlbWVudCwgY29uZmlnKSB7XG4gICAgY29uc3QgbWF5YmVTdGF0ZSA9IGRlZmF1bHRzKCk7XG4gICAgY29uZmlndXJlKG1heWJlU3RhdGUsIGNvbmZpZyB8fCB7fSk7XG4gICAgZnVuY3Rpb24gcmVkcmF3QWxsKCkge1xuICAgICAgICBjb25zdCBwcmV2VW5iaW5kID0gJ2RvbScgaW4gbWF5YmVTdGF0ZSA/IG1heWJlU3RhdGUuZG9tLnVuYmluZCA6IHVuZGVmaW5lZDtcbiAgICAgICAgLy8gY29tcHV0ZSBib3VuZHMgZnJvbSBleGlzdGluZyBib2FyZCBlbGVtZW50IGlmIHBvc3NpYmxlXG4gICAgICAgIC8vIHRoaXMgYWxsb3dzIG5vbi1zcXVhcmUgYm9hcmRzIGZyb20gQ1NTIHRvIGJlIGhhbmRsZWQgKGZvciAzRClcbiAgICAgICAgY29uc3QgZWxlbWVudHMgPSByZW5kZXJXcmFwKGVsZW1lbnQsIG1heWJlU3RhdGUpLCBib3VuZHMgPSB1dGlsLm1lbW8oKCkgPT4gZWxlbWVudHMuYm9hcmQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpLCByZWRyYXdOb3cgPSAoc2tpcFN2ZykgPT4ge1xuICAgICAgICAgICAgcmVuZGVyKHN0YXRlKTtcbiAgICAgICAgICAgIGlmIChlbGVtZW50cy5hdXRvUGllY2VzKVxuICAgICAgICAgICAgICAgIGF1dG9QaWVjZXMucmVuZGVyKHN0YXRlLCBlbGVtZW50cy5hdXRvUGllY2VzKTtcbiAgICAgICAgICAgIGlmICghc2tpcFN2ZyAmJiBlbGVtZW50cy5zdmcpXG4gICAgICAgICAgICAgICAgc3ZnLnJlbmRlclN2ZyhzdGF0ZSwgZWxlbWVudHMuc3ZnLCBlbGVtZW50cy5jdXN0b21TdmcpO1xuICAgICAgICB9LCBvblJlc2l6ZSA9ICgpID0+IHtcbiAgICAgICAgICAgIHVwZGF0ZUJvdW5kcyhzdGF0ZSk7XG4gICAgICAgICAgICByZW5kZXJSZXNpemVkKHN0YXRlKTtcbiAgICAgICAgICAgIGlmIChlbGVtZW50cy5hdXRvUGllY2VzKVxuICAgICAgICAgICAgICAgIGF1dG9QaWVjZXMucmVuZGVyUmVzaXplZChzdGF0ZSk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHN0YXRlID0gbWF5YmVTdGF0ZTtcbiAgICAgICAgc3RhdGUuZG9tID0ge1xuICAgICAgICAgICAgZWxlbWVudHMsXG4gICAgICAgICAgICBib3VuZHMsXG4gICAgICAgICAgICByZWRyYXc6IGRlYm91bmNlUmVkcmF3KHJlZHJhd05vdyksXG4gICAgICAgICAgICByZWRyYXdOb3csXG4gICAgICAgICAgICB1bmJpbmQ6IHByZXZVbmJpbmQsXG4gICAgICAgIH07XG4gICAgICAgIHN0YXRlLmRyYXdhYmxlLnByZXZTdmdIYXNoID0gJyc7XG4gICAgICAgIHVwZGF0ZUJvdW5kcyhzdGF0ZSk7XG4gICAgICAgIHJlZHJhd05vdyhmYWxzZSk7XG4gICAgICAgIGV2ZW50cy5iaW5kQm9hcmQoc3RhdGUsIG9uUmVzaXplKTtcbiAgICAgICAgaWYgKCFwcmV2VW5iaW5kKVxuICAgICAgICAgICAgc3RhdGUuZG9tLnVuYmluZCA9IGV2ZW50cy5iaW5kRG9jdW1lbnQoc3RhdGUsIG9uUmVzaXplKTtcbiAgICAgICAgc3RhdGUuZXZlbnRzLmluc2VydCAmJiBzdGF0ZS5ldmVudHMuaW5zZXJ0KGVsZW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbiAgICByZXR1cm4gc3RhcnQocmVkcmF3QWxsKCksIHJlZHJhd0FsbCk7XG59XG5mdW5jdGlvbiBkZWJvdW5jZVJlZHJhdyhyZWRyYXdOb3cpIHtcbiAgICBsZXQgcmVkcmF3aW5nID0gZmFsc2U7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgaWYgKHJlZHJhd2luZylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgcmVkcmF3aW5nID0gdHJ1ZTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgIHJlZHJhd05vdygpO1xuICAgICAgICAgICAgcmVkcmF3aW5nID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jaGVzc2dyb3VuZC5qcy5tYXAiLCJpbXBvcnQgeyBwYXJzZVlhbWwgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW1wb3J0IHsgQ2hlc3NlclNldHRpbmdzIH0gZnJvbSBcIi4vQ2hlc3NlclNldHRpbmdzXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2hlc3NlckNvbmZpZyBleHRlbmRzIENoZXNzZXJTZXR0aW5ncyB7XG4gIGlkPzogc3RyaW5nO1xuICBmZW46IHN0cmluZztcbiAgcGduPzogc3RyaW5nO1xuICBzaGFwZXM/OiBhbnk7XG4gIGN1cnJlbnRNb3ZlSWR4PzogbnVtYmVyO1xuICBtb3Zlcz86IHN0cmluZ1tdO1xuICBjdXJyZW50T3JpZW50YXRpb246IHN0cmluZztcbn1cblxuY29uc3QgT1JJRU5UQVRJT05TID0gW1wid2hpdGVcIiwgXCJibGFja1wiXTtcbmV4cG9ydCBjb25zdCBQSUVDRV9TVFlMRVMgPSBbXG4gIFwiYWxwaGFcIixcbiAgXCJjYWxpZm9ybmlhXCIsXG4gIFwiY2FyZGluYWxcIixcbiAgXCJjYnVybmV0dFwiLFxuICBcImNoZXNzN1wiLFxuICBcImNoZXNzbnV0XCIsXG4gIFwiY29tcGFuaW9uXCIsXG4gIFwiZHVicm92bnlcIixcbiAgXCJmYW50YXN5XCIsXG4gIFwiZnJlc2NhXCIsXG4gIFwiZ2lvY29cIixcbiAgXCJnb3Zlcm5vclwiLFxuICBcImhvcnNleVwiLFxuICBcImljcGllY2VzXCIsXG4gIFwia29zYWxcIixcbiAgXCJsZWlwemlnXCIsXG4gIFwibGV0dGVyXCIsXG4gIFwibGlicmFcIixcbiAgXCJtYWVzdHJvXCIsXG4gIFwibWVyaWRhXCIsXG4gIFwicGlyb3VldHRpXCIsXG4gIFwicGl4ZWxcIixcbiAgXCJyZWlsbHljcmFpZ1wiLFxuICBcInJpb2hhY2hhXCIsXG4gIFwic2hhcGVzXCIsXG4gIFwic3BhdGlhbFwiLFxuICBcInN0YXVudHlcIixcbiAgXCJ0YXRpYW5hXCIsXG5dO1xuZXhwb3J0IGNvbnN0IEJPQVJEX1NUWUxFUyA9IFtcImJsdWVcIiwgXCJicm93blwiLCBcImdyZWVuXCIsIFwiaWNcIiwgXCJwdXJwbGVcIl07XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZV91c2VyX2NvbmZpZyhcbiAgc2V0dGluZ3M6IENoZXNzZXJTZXR0aW5ncyxcbiAgY29udGVudDogc3RyaW5nXG4pOiBDaGVzc2VyQ29uZmlnIHtcbiAgbGV0IHVzZXJDb25maWc6IENoZXNzZXJDb25maWcgPSB7XG4gICAgLi4uc2V0dGluZ3MsXG4gICAgZmVuOiBcIlwiLFxuICAgIGN1cnJlbnRPcmllbnRhdGlvbjpcIlwiLFxuICB9O1xuXG4gIHRyeSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnVzZXJDb25maWcsXG4gICAgICAuLi5wYXJzZVlhbWwoY29udGVudCksXG4gICAgfTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIGZhaWxlZCB0byBwYXJzZVxuICAgIHJldHVybiB1c2VyQ29uZmlnO1xuICB9XG59XG4iLCJjbGFzcyBTdGFydGluZ1Bvc2l0aW9uIHtcbiAgZWNvOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgZmVuOiBzdHJpbmc7XG4gIHdpa2lQYXRoOiBzdHJpbmc7XG4gIG1vdmVzOiBzdHJpbmdbXTtcblxuICBjb25zdHJ1Y3RvcihlY286IHN0cmluZywgbmFtZTogc3RyaW5nLCBmZW46IHN0cmluZywgd2lraVBhdGg6IHN0cmluZywgbW92ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5lY28gPSBlY287XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmZlbiA9IGZlbjtcbiAgICB0aGlzLndpa2lQYXRoID0gd2lraVBhdGg7XG4gICAgdGhpcy5tb3ZlcyA9IG1vdmVzO1xuICB9XG59XG5cbmNsYXNzIENhdGVnb3J5IHtcbiAgaWQ6IHN0cmluZztcbiAgaXRlbXM6IFN0YXJ0aW5nUG9zaXRpb25bXTtcblxuICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBpdGVtczogU3RhcnRpbmdQb3NpdGlvbltdKSB7XG4gICAgdGhpcy5pZCA9IGlkO1xuICAgIHRoaXMuaXRlbXMgPSBpdGVtcztcbiAgfVxufVxuXG5jb25zdCBjYXRlZ29yaWVzID0gW1xuICBuZXcgQ2F0ZWdvcnkoXCJlNFwiLCBbXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkIwMFwiLFxuICAgICAgXCJLaW5nJ3MgUGF3blwiLFxuICAgICAgXCJybmJxa2Juci9wcHBwcHBwcC84LzgvNFAzLzgvUFBQUDFQUFAvUk5CUUtCTlIgYiBLUWtxIC0gMCAxXCIsXG4gICAgICBcIktpbmcnc19QYXduX0dhbWVcIixcbiAgICAgIFtcImU0XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQjAwXCIsXG4gICAgICBcIk9wZW4gR2FtZVwiLFxuICAgICAgXCJybmJxa2Juci9wcHBwMXBwcC84LzRwMy80UDMvOC9QUFBQMVBQUC9STkJRS0JOUiB3IEtRa3EgLSAwIDJcIixcbiAgICAgIFwiT3Blbl9HYW1lXCIsXG4gICAgICBbXCJlNCBlNVwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkIwMlwiLFxuICAgICAgXCJBbGVraGluZSdzIERlZmVuY2VcIixcbiAgICAgIFwicm5icWtiMXIvcHBwcHBwcHAvNW4yLzgvNFAzLzgvUFBQUDFQUFAvUk5CUUtCTlIgdyBLUWtxIC0gMSAyXCIsXG4gICAgICBcIkFsZWtoaW5lJ3NfRGVmZW5jZVwiLFxuICAgICAgW1wiZTQgTmY2XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQjA0XCIsXG4gICAgICBcIkFsZWtoaW5lJ3MgRGVmZW5jZTogTW9kZXJuIFZhcmlhdGlvblwiLFxuICAgICAgXCJybmJxa2Ixci9wcHAxcHBwcC8zcDQvM25QMy8zUDQvNU4yL1BQUDJQUFAvUk5CUUtCMVIgYiBLUWtxIC0gMSA0XCIsXG4gICAgICBcIkFsZWtoaW5lJ3NfRGVmZW5jZSNNb2Rlcm5fVmFyaWF0aW9uOl8zLmQ0X2Q2XzQuTmYzXCIsXG4gICAgICBbXCJlNCBOZjZcIiwgXCJlNSBOZDVcIiwgXCJkNCBkNlwiLCBcIk5mM1wiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkMyM1wiLFxuICAgICAgXCJCaXNob3AncyBPcGVuaW5nXCIsXG4gICAgICBcInJuYnFrYm5yL3BwcHAxcHBwLzgvNHAzLzJCMVAzLzgvUFBQUDFQUFAvUk5CUUsxTlIgYiBLUWtxIC0gMSAyXCIsXG4gICAgICBcIkJpc2hvcCUyN3NfT3BlbmluZ1wiLFxuICAgICAgW1wiZTQgZTVcIiwgXCJCYzRcIl1cbiAgICApLFxuICAgIG5ldyBTdGFydGluZ1Bvc2l0aW9uKFxuICAgICAgXCJCMTBcIixcbiAgICAgIFwiQ2Fyby1LYW5uIERlZmVuY2VcIixcbiAgICAgIFwicm5icWtibnIvcHAxcHBwcHAvMnA1LzgvNFAzLzgvUFBQUDFQUFAvUk5CUUtCTlIgdyBLUWtxIC0gMCAyXCIsXG4gICAgICBcIkNhcm/igJNLYW5uX0RlZmVuY2VcIixcbiAgICAgIFtcImU0IGM2XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQjEyXCIsXG4gICAgICBcIkNhcm8tS2FubiBEZWZlbmNlOiBBZHZhbmNlIFZhcmlhdGlvblwiLFxuICAgICAgXCJybmJxa2Juci9wcDJwcHBwLzJwNS8zcFAzLzNQNC84L1BQUDJQUFAvUk5CUUtCTlIgYiBLUWtxIC0gMCAzXCIsXG4gICAgICBcIkNhcm/igJNLYW5uX0RlZmVuY2UjQWR2YW5jZV9WYXJpYXRpb246XzMuZTVcIixcbiAgICAgIFtcImU0IGM2XCIsIFwiZDQgZDVcIiwgXCJlNVwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkIxOFwiLFxuICAgICAgXCJDYXJvLUthbm4gRGVmZW5jZTogQ2xhc3NpY2FsIFZhcmlhdGlvblwiLFxuICAgICAgXCJybjFxa2Juci9wcDJwcHBwLzJwNS81YjIvM1BOMy84L1BQUDJQUFAvUjFCUUtCTlIgdyBLUWtxIC0gMSA1XCIsXG4gICAgICBcIkNhcm/igJNLYW5uX0RlZmVuY2UjQ2xhc3NpY2FsX1ZhcmlhdGlvbjpfNC4uLkJmNVwiLFxuICAgICAgW1wiZTQgYzZcIiwgXCJkNCBkNVwiLCBcIk5jMyBkeGU0XCIsIFwiTnhlNCBCZjVcIl1cbiAgICApLFxuICAgIG5ldyBTdGFydGluZ1Bvc2l0aW9uKFxuICAgICAgXCJCMTNcIixcbiAgICAgIFwiQ2Fyby1LYW5uIERlZmVuY2U6IEV4Y2hhbmdlIFZhcmlhdGlvblwiLFxuICAgICAgXCJybmJxa2Juci9wcDJwcHBwLzJwNS8zUDQvM1A0LzgvUFBQMlBQUC9STkJRS0JOUiBiIEtRa3EgLSAwIDNcIixcbiAgICAgIFwiQ2FybyVFMiU4MCU5M0thbm5fRGVmZW5jZSNFeGNoYW5nZV9WYXJpYXRpb246XzMuZXhkNV9jeGQ1XCIsXG4gICAgICBbXCJlNCBjNlwiLCBcImQ0IGQ1XCIsIFwiZXhkNVwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkIxNFwiLFxuICAgICAgXCJDYXJvLUthbm4gRGVmZW5jZTogUGFub3YtQm90dmlubmlrIEF0dGFja1wiLFxuICAgICAgXCJybmJxa2Ixci9wcDJwcHBwLzVuMi8zcDQvMlBQNC8yTjUvUFAzUFBQL1IxQlFLQk5SIGIgS1FrcSAtIDIgNVwiLFxuICAgICAgXCJDYXJv4oCTS2Fubl9EZWZlbmNlI1Bhbm92LkUyLjgwLjkzQm90dmlubmlrX0F0dGFjazpfNC5jNFwiLFxuICAgICAgW1wiZTQgYzZcIiwgXCJkNCBkNVwiLCBcImV4ZDUgY3hkNVwiLCBcImM0IE5mNlwiLCBcIk5jM1wiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkIxN1wiLFxuICAgICAgXCJDYXJvLUthbm4gRGVmZW5jZTogU3RlaW5pdHogVmFyaWF0aW9uXCIsXG4gICAgICBcInIxYnFrYm5yL3BwMW5wcHBwLzJwNS84LzNQTjMvOC9QUFAyUFBQL1IxQlFLQk5SIHcgS1FrcSAtIDEgNVwiLFxuICAgICAgXCJDYXJv4oCTS2Fubl9EZWZlbmNlI01vZGVybl9WYXJpYXRpb246XzQuLi5OZDdcIixcbiAgICAgIFtcImU0IGM2XCIsIFwiZDQgZDVcIiwgXCJOYzMgZHhlNFwiLCBcIk54ZTQgTmQ3XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQzIxXCIsXG4gICAgICBcIkRhbmlzaCBHYW1iaXRcIixcbiAgICAgIFwicm5icWtibnIvcHBwcDFwcHAvOC84LzNwUDMvMlA1L1BQM1BQUC9STkJRS0JOUiBiIEtRa3EgLSAwIDNcIixcbiAgICAgIFwiRGFuaXNoX0dhbWJpdFwiLFxuICAgICAgW1wiZTQgZTVcIiwgXCJkNCBleGQ0XCIsIFwiYzNcIl1cbiAgICApLFxuICAgIG5ldyBTdGFydGluZ1Bvc2l0aW9uKFxuICAgICAgXCJDNDZcIixcbiAgICAgIFwiRm91ciBLbmlnaHRzIEdhbWVcIixcbiAgICAgIFwicjFicWtiMXIvcHBwcDFwcHAvMm4ybjIvNHAzLzRQMy8yTjJOMi9QUFBQMVBQUC9SMUJRS0IxUiB3IEtRa3EgLSA0IDRcIixcbiAgICAgIFwiRm91cl9LbmlnaHRzX0dhbWVcIixcbiAgICAgIFtcImU0IGU1XCIsIFwiTmYzIE5jNlwiLCBcIk5jMyBOZjZcIl1cbiAgICApLFxuICAgIG5ldyBTdGFydGluZ1Bvc2l0aW9uKFxuICAgICAgXCJDNDdcIixcbiAgICAgIFwiRm91ciBLbmlnaHRzIEdhbWU6IFNjb3RjaCBWYXJpYXRpb25cIixcbiAgICAgIFwicjFicWtiMXIvcHBwcDFwcHAvMm4ybjIvNHAzLzNQUDMvMk4yTjIvUFBQMlBQUC9SMUJRS0IxUiBiIEtRa3EgLSAwIDRcIixcbiAgICAgIFwiRm91cl9LbmlnaHRzX0dhbWUjNC5kNFwiLFxuICAgICAgW1wiZTQgZTVcIiwgXCJOZjMgTmM2XCIsIFwiTmMzIE5mNlwiLCBcImQ0XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQzQ4XCIsXG4gICAgICBcIkZvdXIgS25pZ2h0cyBHYW1lOiBTcGFuaXNoIFZhcmlhdGlvblwiLFxuICAgICAgXCJyMWJxa2Ixci9wcHBwMXBwcC8ybjJuMi8xQjJwMy80UDMvMk4yTjIvUFBQUDFQUFAvUjFCUUsyUiBiIEtRa3EgLSA1IDRcIixcbiAgICAgIFwiRm91cl9LbmlnaHRzX0dhbWUjNC5CYjVcIixcbiAgICAgIFtcImU0IGU1XCIsIFwiTmYzIE5mNlwiLCBcIk5jMyBOYzZcIiwgXCJCYjVcIl1cbiAgICApLFxuICAgIG5ldyBTdGFydGluZ1Bvc2l0aW9uKFxuICAgICAgXCJDMDBcIixcbiAgICAgIFwiRnJlbmNoIERlZmVuY2VcIixcbiAgICAgIFwicm5icWtibnIvcHBwcDFwcHAvNHAzLzgvNFAzLzgvUFBQUDFQUFAvUk5CUUtCTlIgdyBLUWtxIC0gMCAyXCIsXG4gICAgICBcIkZyZW5jaF9EZWZlbmNlXCIsXG4gICAgICBbXCJlNCBlNlwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkMwMlwiLFxuICAgICAgXCJGcmVuY2ggRGVmZW5jZTogQWR2YW5jZSBWYXJpYXRpb25cIixcbiAgICAgIFwicm5icWtibnIvcHBwMnBwcC80cDMvM3BQMy8zUDQvOC9QUFAyUFBQL1JOQlFLQk5SIGIgS1FrcSAtIDAgM1wiLFxuICAgICAgXCJGcmVuY2hfRGVmZW5jZSNBZHZhbmNlX1ZhcmlhdGlvbjpfMy5lNVwiLFxuICAgICAgW1wiZTQgZTZcIiwgXCJkNCBkNVwiLCBcImU1XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQzExXCIsXG4gICAgICBcIkZyZW5jaCBEZWZlbmNlOiBCdXJuIFZhcmlhdGlvblwiLFxuICAgICAgXCJybmJxa2Ixci9wcHAycHBwLzRwbjIvM3AyQjEvM1BQMy8yTjUvUFBQMlBQUC9SMlFLQk5SIGIgS1FrcSAtIDAgNVwiLFxuICAgICAgXCJGcmVuY2hfRGVmZW5jZSMzLk5jM1wiLFxuICAgICAgW1wiZTQgZTZcIiwgXCJkNCBkNVwiLCBcIk5jMyBOZjZcIiwgXCJCZzUgZHhlNFwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkMxMVwiLFxuICAgICAgXCJGcmVuY2ggRGVmZW5jZTogQ2xhc3NpY2FsIFZhcmlhdGlvblwiLFxuICAgICAgXCJybmJxa2Ixci9wcHAycHBwLzRwbjIvM3A0LzNQUDMvMk41L1BQUDJQUFAvUjFCUUtCTlIgdyBLUWtxIC0gMiA0XCIsXG4gICAgICBcIkZyZW5jaF9EZWZlbmNlI0NsYXNzaWNhbF9WYXJpYXRpb246XzMuLi5OZjZcIixcbiAgICAgIFtcImU0IGU2XCIsIFwiZDQgZDVcIiwgXCJOYzMgTmY2XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQzAxXCIsXG4gICAgICBcIkZyZW5jaCBEZWZlbmNlOiBFeGNoYW5nZSBWYXJpYXRpb25cIixcbiAgICAgIFwicm5icWtibnIvcHBwMnBwcC80cDMvM1A0LzNQNC84L1BQUDJQUFAvUk5CUUtCTlIgYiBLUWtxIC0gMCAzXCIsXG4gICAgICBcIkZyZW5jaF9EZWZlbmNlI0V4Y2hhbmdlX1ZhcmlhdGlvbjpfMy5leGQ1X2V4ZDVcIixcbiAgICAgIFtcImU0IGU2XCIsIFwiZDQgZDVcIiwgXCJleGQ1XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQzEwXCIsXG4gICAgICBcIkZyZW5jaCBEZWZlbmNlOiBSdWJpbnN0ZWluIFZhcmlhdGlvblwiLFxuICAgICAgXCJybmJxa2Juci9wcHAycHBwLzRwMy84LzNQcDMvMk41L1BQUDJQUFAvUjFCUUtCTlIgdyBLUWtxIC0gMCA0XCIsXG4gICAgICBcIkZyZW5jaF9EZWZlbmNlI1J1Ymluc3RlaW5fVmFyaWF0aW9uOl8zLi4uZHhlNFwiLFxuICAgICAgW1wiZTQgZTZcIiwgXCJkNCBkNVwiLCBcIk5jMyBkeGU0XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQzAzXCIsXG4gICAgICBcIkZyZW5jaCBEZWZlbmNlOiBUYXJyYXNjaCBWYXJpYXRpb25cIixcbiAgICAgIFwicm5icWtibnIvcHBwMnBwcC80cDMvM3A0LzNQUDMvOC9QUFBOMVBQUC9SMUJRS0JOUiBiIEtRa3EgLSAxIDNcIixcbiAgICAgIFwiRnJlbmNoX0RlZmVuY2UjVGFycmFzY2hfVmFyaWF0aW9uOl8zLk5kMlwiLFxuICAgICAgW1wiZTQgZTZcIiwgXCJkNCBkNVwiLCBcIk5kMlwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkMxNVwiLFxuICAgICAgXCJGcmVuY2ggRGVmZW5jZTogV2luYXdlciBWYXJpYXRpb25cIixcbiAgICAgIFwicm5icWsxbnIvcHBwMnBwcC80cDMvM3A0LzFiMVBQMy8yTjUvUFBQMlBQUC9SMUJRS0JOUiB3IEtRa3EgLSAyIDRcIixcbiAgICAgIFwiRnJlbmNoX0RlZmVuY2UjV2luYXdlcl9WYXJpYXRpb246XzMuLi5CYjRcIixcbiAgICAgIFtcImU0IGU2XCIsIFwiZDQgZDVcIiwgXCJOYzMgQmI0XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQzUwXCIsXG4gICAgICBcIkdpdW9jbyBQaWFub1wiLFxuICAgICAgXCJyMWJxazFuci9wcHBwMXBwcC8ybjUvMmIxcDMvMkIxUDMvNU4yL1BQUFAxUFBQL1JOQlFLMlIgdyBLUWtxIC0gNCA0XCIsXG4gICAgICBcIkdpdW9jb19QaWFub1wiLFxuICAgICAgW1wiZTQgZTVcIiwgXCJOZjMgTmM2XCIsIFwiQmM0IEJjNVwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkM1MFwiLFxuICAgICAgXCJJdGFsaWFuIEdhbWVcIixcbiAgICAgIFwicjFicWtibnIvcHBwcDFwcHAvMm41LzRwMy8yQjFQMy81TjIvUFBQUDFQUFAvUk5CUUsyUiBiIEtRa3EgLSAzIDNcIixcbiAgICAgIFwiSXRhbGlhbl9HYW1lXCIsXG4gICAgICBbXCJlNCBlNVwiLCBcIk5mMyBOYzZcIiwgXCJCYzRcIl1cbiAgICApLFxuICAgIG5ldyBTdGFydGluZ1Bvc2l0aW9uKFxuICAgICAgXCJDNTFcIixcbiAgICAgIFwiRXZhbnMgR2FtYml0XCIsXG4gICAgICBcInIxYnFrMW5yL3BwcHAxcHBwLzJuNS8yYjFwMy8xUEIxUDMvNU4yL1AxUFAxUFBQL1JOQlFLMlIgYiBLUWtxIC0gMCA0XCIsXG4gICAgICBcIkV2YW5zX0dhbWJpdFwiLFxuICAgICAgW1wiZTQgZTVcIiwgXCJOZjMgTmM2XCIsIFwiQmM0IEJjNVwiLCBcImI0XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQzUwXCIsXG4gICAgICBcIkl0YWxpYW4gR2FtZTogSHVuZ2FyaWFuIERlZmVuY2VcIixcbiAgICAgIFwicjFicWsxbnIvcHBwcGJwcHAvMm41LzRwMy8yQjFQMy81TjIvUFBQUDFQUFAvUk5CUUsyUiB3IEtRa3EgLSA0IDRcIixcbiAgICAgIFwiSHVuZ2FyaWFuX0RlZmVuc2VcIixcbiAgICAgIFtcImU0IGU1XCIsIFwiTmYzIE5jNlwiLCBcIkJjNCBCZTdcIl1cbiAgICApLFxuICAgIG5ldyBTdGFydGluZ1Bvc2l0aW9uKFxuICAgICAgXCJDNTVcIixcbiAgICAgIFwiSXRhbGlhbiBHYW1lOiBUd28gS25pZ2h0cyBEZWZlbmNlXCIsXG4gICAgICBcInIxYnFrYjFyL3BwcHAxcHBwLzJuMm4yLzRwMy8yQjFQMy81TjIvUFBQUDFQUFAvUk5CUUsyUiB3IEtRa3EgLSA0IDRcIixcbiAgICAgIFwiVHdvX0tuaWdodHNfRGVmZW5zZVwiLFxuICAgICAgW1wiZTQgZTVcIiwgXCJOZjMgTmM2XCIsIFwiQmM0IE5mNlwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkMzMFwiLFxuICAgICAgXCJLaW5nJ3MgR2FtYml0XCIsXG4gICAgICBcInJuYnFrYm5yL3BwcHAxcHBwLzgvNHAzLzRQUDIvOC9QUFBQMlBQL1JOQlFLQk5SIGIgS1FrcSAtIDAgMlwiLFxuICAgICAgXCJLaW5nJ3NfR2FtYml0XCIsXG4gICAgICBbXCJlNCBlNVwiLCBcImY0XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQzMzXCIsXG4gICAgICBcIktpbmcncyBHYW1iaXQgQWNjZXB0ZWRcIixcbiAgICAgIFwicm5icWtibnIvcHBwcDFwcHAvOC84LzRQcDIvOC9QUFBQMlBQL1JOQlFLQk5SIHcgS1FrcSAtIDAgM1wiLFxuICAgICAgXCJLaW5nJ3NfR2FtYml0I0tpbmcuMjdzX0dhbWJpdF9BY2NlcHRlZDpfMi4uLmV4ZjRcIixcbiAgICAgIFtcImU0IGU1XCIsIFwiZjQgZXhmNFwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkMzM1wiLFxuICAgICAgXCJLaW5nJ3MgR2FtYml0IEFjY2VwdGVkOiBCaXNob3AncyBHYW1iaXRcIixcbiAgICAgIFwicm5icWtibnIvcHBwcDFwcHAvOC84LzJCMVBwMi84L1BQUFAyUFAvUk5CUUsxTlIgYiBLUWtxIC0gMSAzXCIsXG4gICAgICBcIktpbmcnc19HYW1iaXQjS2luZy4yN3NfR2FtYml0X0FjY2VwdGVkOl8yLi4uZXhmNFwiLFxuICAgICAgW1wiZTQgZTVcIiwgXCJmNCBleGY0XCIsIFwiQmM0XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQzM2XCIsXG4gICAgICBcIktpbmcncyBHYW1iaXQgQWNjZXB0ZWQ6IE1vZGVybiBEZWZlbmNlXCIsXG4gICAgICBcInJuYnFrYm5yL3BwcDJwcHAvOC8zcDQvNFBwMi81TjIvUFBQUDJQUC9STkJRS0IxUiB3IEtRa3EgZDYgMCA0XCIsXG4gICAgICBcIktpbmcnc19HYW1iaXQjTW9kZXJuX0RlZmVuY2U6XzMuLi5kNVwiLFxuICAgICAgW1wiZTQgZTVcIiwgXCJmNCBleGY0XCIsIFwiTmYzIGQ1XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQzMwXCIsXG4gICAgICBcIktpbmcncyBHYW1iaXQgQWNjZXB0ZWQ6IENsYXNzaWNhbCBWYXJpYXRpb25cIixcbiAgICAgIFwicm5icWtibnIvcHBwcDFwMXAvOC82cDEvNFBwMi81TjIvUFBQUDJQUC9STkJRS0IxUiB3IEtRa3EgLSAwIDRcIixcbiAgICAgIFwiS2luZydzX0dhbWJpdCNDbGFzc2ljYWxfVmFyaWF0aW9uOl8zLi4uZzVcIixcbiAgICAgIFtcImU0IGU1XCIsIFwiZjQgZXhmNFwiLCBcIk5mMyBnNVwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkMzMFwiLFxuICAgICAgXCJLaW5nJ3MgR2FtYml0IERlY2xpbmVkOiBDbGFzc2ljYWwgVmFyaWF0aW9uXCIsXG4gICAgICBcInJuYnFrMW5yL3BwcHAxcHBwLzgvMmIxcDMvNFBQMi84L1BQUFAyUFAvUk5CUUtCTlIgdyBLUWtxIC0gMSAzXCIsXG4gICAgICBcIktpbmcnc19HYW1iaXQjQ2xhc3NpY2FsX0RlZmVuY2U6XzIuLi5CYzVcIixcbiAgICAgIFtcImU0IGU1XCIsIFwiZjQgQmM1XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQzMxXCIsXG4gICAgICBcIktpbmcncyBHYW1iaXQ6IEZhbGtiZWVyIENvdW50ZXJnYW1iaXRcIixcbiAgICAgIFwicm5icWtibnIvcHBwMnBwcC84LzNwcDMvNFBQMi84L1BQUFAyUFAvUk5CUUtCTlIgdyBLUWtxIC0gMCAzXCIsXG4gICAgICBcIktpbmclMjdzX0dhbWJpdCxfRmFsa2JlZXJfQ291bnRlcmdhbWJpdFwiLFxuICAgICAgW1wiZTQgZTVcIiwgXCJmNCBkNVwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkIwNlwiLFxuICAgICAgXCJNb2Rlcm4gRGVmZW5jZVwiLFxuICAgICAgXCJybmJxa2Juci9wcHBwcHAxcC82cDEvOC80UDMvOC9QUFBQMVBQUC9STkJRS0JOUiB3IEtRa3EgLSAwIDJcIixcbiAgICAgIFwiTW9kZXJuX0RlZmVuc2VcIixcbiAgICAgIFtcImU0IGc2XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQjA2XCIsXG4gICAgICBcIk1vZGVybiBEZWZlbmNlOiBSb2JhdHNjaCBEZWZlbmNlXCIsXG4gICAgICBcInJuYnFrMW5yL3BwcHBwcGJwLzZwMS84LzNQUDMvMk41L1BQUDJQUFAvUjFCUUtCTlIgYiBLUWtxIC0gMiAzXCIsXG4gICAgICBcIk1vZGVybl9EZWZlbnNlXCIsXG4gICAgICBbXCJlNCBnNlwiLCBcImQ0IEJnN1wiLCBcIk5jM1wiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkM0MVwiLFxuICAgICAgXCJQaGlsaWRvciBEZWZlbmNlXCIsXG4gICAgICBcInJuYnFrYm5yL3BwcDJwcHAvM3A0LzRwMy80UDMvNU4yL1BQUFAxUFBQL1JOQlFLQjFSIHcgS1FrcSAtIDAgM1wiLFxuICAgICAgXCJQaGlsaWRvcl9EZWZlbmNlXCIsXG4gICAgICBbXCJlNCBlNVwiLCBcIk5mMyBkNlwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkM0MVwiLFxuICAgICAgXCJQaGlsaWRvciBEZWZlbmNlOiBMaW9uIFZhcmlhdGlvblwiLFxuICAgICAgXCJyMWJxa2Ixci9wcHBuMXBwcC8zcDFuMi80cDMvM1BQMy8yTjJOMi9QUFAyUFBQL1IxQlFLQjFSIHcgS1FrcSAtIDIgNVwiLFxuICAgICAgXCJQaGlsaWRvcl9EZWZlbmNlXCIsXG4gICAgICBbXCJlNCBkNlwiLCBcImQ0IE5mNlwiLCBcIk5jMyBlNVwiLCBcIk5mMyBOYmQ3XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQjA3XCIsXG4gICAgICBcIkxpb24gVmFyaWF0aW9uOiBBbnRpLVBoaWxpZG9yXCIsXG4gICAgICBcInIxYnFrYjFyL3BwcG4xcHBwLzNwMW4yLzRwMy8zUFBQMi8yTjUvUFBQM1BQL1IxQlFLQk5SIHcgS1FrcSAtIDAgNVwiLFxuICAgICAgXCJQaGlsaWRvcl9EZWZlbmNlXCIsXG4gICAgICBbXCJlNCBkNlwiLCBcImQ0IE5mNlwiLCBcIk5jMyBOYmQ3XCIsIFwiZjQgZTVcIl1cbiAgICApLFxuICAgIG5ldyBTdGFydGluZ1Bvc2l0aW9uKFxuICAgICAgXCJCMDdcIixcbiAgICAgIFwiUGlyYyBEZWZlbmNlXCIsXG4gICAgICBcInJuYnFrYjFyL3BwcDFwcHBwLzNwMW4yLzgvM1BQMy84L1BQUDJQUFAvUk5CUUtCTlIgdyBLUWtxIC0gMiAzXCIsXG4gICAgICBcIlBpcmNfRGVmZW5jZVwiLFxuICAgICAgW1wiZTQgZDZcIiwgXCJkNCBOZjZcIiwgXCJOYzNcIl1cbiAgICApLFxuICAgIG5ldyBTdGFydGluZ1Bvc2l0aW9uKFxuICAgICAgXCJCMDlcIixcbiAgICAgIFwiUGlyYyBEZWZlbmNlOiBBdXN0cmlhbiBBdHRhY2tcIixcbiAgICAgIFwicm5icWtiMXIvcHBwMXBwMXAvM3AxbnAxLzgvM1BQUDIvMk41L1BQUDNQUC9SMUJRS0JOUiBiIEtRa3EgLSAwIDRcIixcbiAgICAgIFwiUGlyY19EZWZlbmNlI0F1c3RyaWFuX0F0dGFjazpfNC5mNFwiLFxuICAgICAgW1wiZTQgZDZcIiwgXCJkNCBOZjZcIiwgXCJOYzMgZzZcIiwgXCJmNFwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkIwN1wiLFxuICAgICAgXCJQaXJjIERlZmVuY2U6IENsYXNzaWNhbCBWYXJpYXRpb25cIixcbiAgICAgIFwicm5icWtiMXIvcHBwMXBwMXAvM3AxbnAxLzgvM1BQMy8yTjJOMi9QUFAyUFBQL1IxQlFLQjFSIGIgS1FrcSAtIDEgNFwiLFxuICAgICAgXCJQaXJjX0RlZmVuY2UjQ2xhc3NpY2FsXy4yOFR3b19LbmlnaHRzLjI5X1N5c3RlbTpfNC5OZjNcIixcbiAgICAgIFtcImU0IGQ2XCIsIFwiZDQgTmY2XCIsIFwiTmMzIGc2XCIsIFwiTmYzXCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQjA3XCIsXG4gICAgICBcIlBpcmMgRGVmZW5jZTogTGlvbiBWYXJpYXRpb25cIixcbiAgICAgIFwicjFicWtiMXIvcHBwbnBwcHAvM3AxbjIvOC8zUFAzLzJONS9QUFAyUFBQL1IxQlFLQk5SIHcgS1FrcSAtIDMgNFwiLFxuICAgICAgXCJQaXJjX0RlZmVuY2UjQ2xhc3NpY2FsXy4yOFR3b19LbmlnaHRzLjI5X1N5c3RlbVwiLFxuICAgICAgW1wiZTQgZDZcIiwgXCJkNCBOZjZcIiwgXCJOYzMgTmJkN1wiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkM0MlwiLFxuICAgICAgXCJQZXRyb3YncyBEZWZlbmNlXCIsXG4gICAgICBcInJuYnFrYjFyL3BwcHAxcHBwLzVuMi80cDMvNFAzLzVOMi9QUFBQMVBQUC9STkJRS0IxUiB3IEtRa3EgLSAyIDNcIixcbiAgICAgIFwiUGV0cm92J3NfRGVmZW5jZVwiLFxuICAgICAgW1wiZTQgZTVcIiwgXCJOZjMgTmY2XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQzQyXCIsXG4gICAgICBcIlBldHJvdidzIERlZmVuY2U6IENsYXNzaWNhbCBBdHRhY2tcIixcbiAgICAgIFwicm5icWtiMXIvcHBwMnBwcC8zcDQvOC8zUG4zLzVOMi9QUFAyUFBQL1JOQlFLQjFSIGIgS1FrcSAtIDAgNVwiLFxuICAgICAgXCJQZXRyb3Ync19EZWZlbmNlIzMuTnhlNVwiLFxuICAgICAgW1wiZTQgZTVcIiwgXCJOZjMgTmY2XCIsIFwiTnhlNSBkNlwiLCBcIk5mMyBOeGU0XCIsIFwiZDRcIl1cbiAgICApLFxuICAgIG5ldyBTdGFydGluZ1Bvc2l0aW9uKFxuICAgICAgXCJDNDNcIixcbiAgICAgIFwiUGV0cm92J3MgRGVmZW5jZTogU3RlaW5pdHogQXR0YWNrXCIsXG4gICAgICBcInJuYnFrYjFyL3BwcHAxcHBwLzVuMi80cDMvM1BQMy81TjIvUFBQMlBQUC9STkJRS0IxUiBiIEtRa3EgLSAwIDNcIixcbiAgICAgIFwiUGV0cm92J3NfRGVmZW5jZSMzLmQ0XCIsXG4gICAgICBbXCJlNCBlNVwiLCBcIk5mMyBOZjZcIiwgXCJkNFwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkM0MlwiLFxuICAgICAgXCJQZXRyb3YncyBEZWZlbmNlOiBUaHJlZSBLbmlnaHRzIEdhbWVcIixcbiAgICAgIFwicm5icWtiMXIvcHBwcDFwcHAvNW4yLzRwMy80UDMvMk4yTjIvUFBQUDFQUFAvUjFCUUtCMVIgYiBLUWtxIC0gMyAzXCIsXG4gICAgICBcIlBldHJvdidzX0RlZmVuY2UjMy5OYzNcIixcbiAgICAgIFtcImU0IGU1XCIsIFwiTmYzIE5mNlwiLCBcIk5jM1wiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkM2MFwiLFxuICAgICAgXCJSdXkgTG9wZXpcIixcbiAgICAgIFwicjFicWtibnIvcHBwcDFwcHAvMm41LzFCMnAzLzRQMy81TjIvUFBQUDFQUFAvUk5CUUsyUiBiIEtRa3EgLSAzIDNcIixcbiAgICAgIFwiUnV5X0xvcGV6XCIsXG4gICAgICBbXCJlNCBlNVwiLCBcIk5mMyBOYzZcIiwgXCJCYjVcIl1cbiAgICApLFxuICAgIG5ldyBTdGFydGluZ1Bvc2l0aW9uKFxuICAgICAgXCJDNjVcIixcbiAgICAgIFwiUnV5IExvcGV6OiBCZXJsaW4gRGVmZW5jZVwiLFxuICAgICAgXCJyMWJxa2Ixci9wcHBwMXBwcC8ybjJuMi8xQjJwMy80UDMvNU4yL1BQUFAxUFBQL1JOQlFLMlIgdyBLUWtxIC0gNCA0XCIsXG4gICAgICBcIlJ1eV9Mb3BleiNCZXJsaW5fRGVmZW5jZTpfMy4uLk5mNlwiLFxuICAgICAgW1wiZTQgZTVcIiwgXCJOZjMgTmM2XCIsIFwiQmI1IE5mNlwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkM2NFwiLFxuICAgICAgXCJSdXkgTG9wZXo6IENsYXNzaWNhbCBWYXJpYXRpb25cIixcbiAgICAgIFwicjFicWsxbnIvcHBwcDFwcHAvMm41LzFCYjFwMy80UDMvNU4yL1BQUFAxUFBQL1JOQlFLMlIgdyBLUWtxIC0gNCA0XCIsXG4gICAgICBcIlJ1eV9Mb3BleiNDbGFzc2ljYWxfRGVmZW5jZTpfMy4uLkJjNVwiLFxuICAgICAgW1wiZTQgZTVcIiwgXCJOZjMgTmM2XCIsIFwiQmI1IEJjNVwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkM4NFwiLFxuICAgICAgXCJSdXkgTG9wZXo6IENsb3NlZCBWYXJpYXRpb25cIixcbiAgICAgIFwicjFicWsyci8ycHBicHBwL3AxbjJuMi8xcDJwMy80UDMvMUIzTjIvUFBQUDFQUFAvUk5CUVIxSzEgYiBrcSAtIDEgN1wiLFxuICAgICAgXCJSdXlfTG9wZXojTWFpbl9saW5lOl80LkJhNF9OZjZfNS4wLTBfQmU3XzYuUmUxX2I1XzcuQmIzX2Q2XzguYzNfMC0wXCIsXG4gICAgICBbXCJlNCBlNVwiLCBcIk5mMyBOYzZcIiwgXCJCYjUgYTZcIiwgXCJCYTQgTmY2XCIsIFwiTy1PIEJlN1wiLCBcIlJlMSBiNVwiLCBcIkJiM1wiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkM2OFwiLFxuICAgICAgXCJSdXkgTG9wZXo6IEV4Y2hhbmdlIFZhcmlhdGlvblwiLFxuICAgICAgXCJyMWJxa2Juci8xcHBwMXBwcC9wMUI1LzRwMy80UDMvNU4yL1BQUFAxUFBQL1JOQlFLMlIgYiBLUWtxIC0gMCA0XCIsXG4gICAgICBcIlJ1eV9Mb3BleixfRXhjaGFuZ2VfVmFyaWF0aW9uXCIsXG4gICAgICBbXCJlNCBlNVwiLCBcIk5mMyBOYzZcIiwgXCJCYjUgYTZcIiwgXCJCeGM2XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQzg5XCIsXG4gICAgICBcIlJ1eSBMb3BlejogTWFyc2hhbGwgQXR0YWNrXCIsXG4gICAgICBcInIxYnExcmsxLzJwMWJwcHAvcDFuMm4yLzFwMXBwMy80UDMvMUJQMk4yL1BQMVAxUFBQL1JOQlFSMUsxIHcgLSAtIDAgOVwiLFxuICAgICAgXCJSdXlfTG9wZXojTWFyc2hhbGxfQXR0YWNrXCIsXG4gICAgICBbXCJlNCBlNVwiLCBcIk5mMyBOYzZcIiwgXCJCYjUgYTZcIiwgXCJCYTQgTmY2XCIsIFwiTy1PIEJlN1wiLCBcIlJlMSBiNVwiLCBcIkJiMyBPLU9cIiwgXCJjMyBkNVwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkM2M1wiLFxuICAgICAgXCJSdXkgTG9wZXo6IFNjaGxpZW1hbm4gRGVmZW5jZVwiLFxuICAgICAgXCJyMWJxa2Juci9wcHBwMnBwLzJuNS8xQjJwcDIvNFAzLzVOMi9QUFBQMVBQUC9STkJRSzJSIHcgS1FrcSAtIDAgNFwiLFxuICAgICAgXCJSdXlfTG9wZXojU2NobGllbWFubl9EZWZlbmNlOl8zLi4uZjVcIixcbiAgICAgIFtcImU0IGU1XCIsIFwiTmYzIE5jNlwiLCBcIkJiNSBmNVwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkIwMVwiLFxuICAgICAgXCJTY2FuZGluYXZpYW4gRGVmZW5jZVwiLFxuICAgICAgXCJybmJxa2Juci9wcHAxcHBwcC84LzNwNC80UDMvOC9QUFBQMVBQUC9STkJRS0JOUiB3IEtRa3EgLSAwIDJcIixcbiAgICAgIFwiU2NhbmRpbmF2aWFuX0RlZmVuc2VcIixcbiAgICAgIFtcImU0IGQ1XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQjAxXCIsXG4gICAgICBcIlNjYW5kaW5hdmlhbiBEZWZlbmNlOiBNb2Rlcm4gVmFyaWF0aW9uXCIsXG4gICAgICBcInJuYnFrYjFyL3BwcDFwcHBwLzVuMi8zUDQvM1A0LzgvUFBQMlBQUC9STkJRS0JOUiBiIEtRa3EgLSAwIDNcIixcbiAgICAgIFwiU2NhbmRpbmF2aWFuX0RlZmVuc2UjMi4uLk5mNlwiLFxuICAgICAgW1wiZTQgZDVcIiwgXCJleGQ1IE5mNlwiLCBcImQ0XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQjAxXCIsXG4gICAgICBcIlNjYW5kaW5hdmlhbiBEZWZlbmNlOiBJY2VsYW5kaWMtUGFsbWUgR2FtYml0XCIsXG4gICAgICBcInJuYnFrYjFyL3BwcDJwcHAvNHBuMi8zUDQvMlA1LzgvUFAxUDFQUFAvUk5CUUtCTlIgdyBLUWtxIC0gMCA0XCIsXG4gICAgICBcIlNjYW5kaW5hdmlhbl9EZWZlbnNlIzIuLi5OZjZcIixcbiAgICAgIFtcImU0IGQ1XCIsIFwiZXhkNSBOZjZcIiwgXCJjNCBlNlwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkM0NFwiLFxuICAgICAgXCJTY290Y2ggR2FtZVwiLFxuICAgICAgXCJyMWJxa2Juci9wcHBwMXBwcC8ybjUvNHAzLzNQUDMvNU4yL1BQUDJQUFAvUk5CUUtCMVIgYiBLUWtxIC0gMCAzXCIsXG4gICAgICBcIlNjb3RjaF9HYW1lXCIsXG4gICAgICBbXCJlNCBlNVwiLCBcIk5mMyBOYzZcIiwgXCJkNFwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkM0NVwiLFxuICAgICAgXCJTY290Y2ggR2FtZTogQ2xhc3NpY2FsIFZhcmlhdGlvblwiLFxuICAgICAgXCJyMWJxazFuci9wcHBwMXBwcC8ybjUvMmI1LzNOUDMvOC9QUFAyUFBQL1JOQlFLQjFSIHcgS1FrcSAtIDEgNVwiLFxuICAgICAgXCJTY290Y2hfR2FtZSxfQ2xhc3NpY2FsX1ZhcmlhdGlvblwiLFxuICAgICAgW1wiZTQgZTVcIiwgXCJOZjMgTmM2XCIsIFwiZDQgZXhkNFwiLCBcIk54ZDQgQmM1XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQzQ1XCIsXG4gICAgICBcIlNjb3RjaCBHYW1lOiBNaWVzZXMgVmFyaWF0aW9uXCIsXG4gICAgICBcInIxYnFrYjFyL3AxcHAxcHBwLzJwMm4yLzRQMy84LzgvUFBQMlBQUC9STkJRS0IxUiBiIEtRa3EgLSAwIDZcIixcbiAgICAgIFwiU2NvdGNoX0dhbWUjU2NobWlkdF9WYXJpYXRpb246XzQuLi5OZjZcIixcbiAgICAgIFtcImU0IGU1XCIsIFwiTmYzIE5jNlwiLCBcImQ0IGV4ZDRcIiwgXCJOeGQ0IE5mNlwiLCBcIk54YzYgYnhjNlwiLCBcImU1XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQzQ1XCIsXG4gICAgICBcIlNjb3RjaCBHYW1lOiBTdGVpbml0eiBWYXJpYXRpb25cIixcbiAgICAgIFwicjFiMWtibnIvcHBwcDFwcHAvMm41LzgvM05QMnEvOC9QUFAyUFBQL1JOQlFLQjFSIHcgS1FrcSAtIDEgNVwiLFxuICAgICAgXCJTY290Y2hfR2FtZSNTdGVpbml0el9WYXJpYXRpb246XzQuLi5RaDQuMjEuM0ZcIixcbiAgICAgIFtcImU0IGU1XCIsIFwiTmYzIE5jNlwiLCBcImQ0IGV4ZDRcIiwgXCJOeGQ0IFFoNFwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkIyMFwiLFxuICAgICAgXCJTaWNpbGlhbiBEZWZlbmNlXCIsXG4gICAgICBcInJuYnFrYm5yL3BwMXBwcHBwLzgvMnA1LzRQMy84L1BQUFAxUFBQL1JOQlFLQk5SIHcgS1FrcSAtIDAgMlwiLFxuICAgICAgXCJTaWNpbGlhbl9EZWZlbmNlXCIsXG4gICAgICBbXCJlNCBjNVwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkIzNlwiLFxuICAgICAgXCJTaWNpbGlhbiBEZWZlbmNlOiBBY2NlbGVyYXRlZCBEcmFnb25cIixcbiAgICAgIFwicjFicWtibnIvcHAxcHBwMXAvMm4zcDEvOC8zTlAzLzgvUFBQMlBQUC9STkJRS0IxUiB3IEtRa3EgLSAwIDVcIixcbiAgICAgIFwiU2ljaWxpYW5fRGVmZW5jZSxfQWNjZWxlcmF0ZWRfRHJhZ29uXCIsXG4gICAgICBbXCJlNCBjNVwiLCBcIk5mMyBOYzZcIiwgXCJkNCBjeGQ0XCIsIFwiTnhkNCBnNlwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkIyMlwiLFxuICAgICAgXCJTaWNpbGlhbiBEZWZlbmNlOiBBbGFwaW4gVmFyaWF0aW9uXCIsXG4gICAgICBcInJuYnFrYm5yL3BwMXBwcHBwLzgvMnA1LzRQMy8yUDUvUFAxUDFQUFAvUk5CUUtCTlIgYiBLUWtxIC0gMCAyXCIsXG4gICAgICBcIlNpY2lsaWFuX0RlZmVuY2UsX0FsYXBpbl9WYXJpYXRpb25cIixcbiAgICAgIFtcImU0IGM1XCIsIFwiYzNcIl1cbiAgICApLFxuICAgIG5ldyBTdGFydGluZ1Bvc2l0aW9uKFxuICAgICAgXCJCMjNcIixcbiAgICAgIFwiU2ljaWxpYW4gRGVmZW5jZTogQ2xvc2VkIFZhcmlhdGlvblwiLFxuICAgICAgXCJybmJxa2Juci9wcDFwcHBwcC84LzJwNS80UDMvMk41L1BQUFAxUFBQL1IxQlFLQk5SIGIgS1FrcSAtIDEgMlwiLFxuICAgICAgXCJTaWNpbGlhbl9EZWZlbmNlI0Nsb3NlZF9TaWNpbGlhblwiLFxuICAgICAgW1wiZTQgYzVcIiwgXCJOYzNcIl1cbiAgICApLFxuICAgIG5ldyBTdGFydGluZ1Bvc2l0aW9uKFxuICAgICAgXCJCNzBcIixcbiAgICAgIFwiU2ljaWxpYW4gRGVmZW5jZTogRHJhZ29uIFZhcmlhdGlvblwiLFxuICAgICAgXCJybmJxa2Ixci9wcDJwcDFwLzNwMW5wMS84LzNOUDMvMk41L1BQUDJQUFAvUjFCUUtCMVIgdyBLUWtxIC0gMCA2XCIsXG4gICAgICBcIlNpY2lsaWFuX0RlZmVuY2UsX0RyYWdvbl9WYXJpYXRpb25cIixcbiAgICAgIFtcImU0IGM1XCIsIFwiTmYzIGQ2XCIsIFwiZDQgY3hkNFwiLCBcIk54ZDQgTmY2XCIsIFwiTmMzIGc2XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQjIzXCIsXG4gICAgICBcIlNpY2lsaWFuIERlZmVuY2U6IEdyYW5kIFByaXggQXR0YWNrXCIsXG4gICAgICBcIm5icWtibnIvcHAxcHBwcHAvOC8ycDUvNFBQMi84L1BQUFAyUFAvUk5CUUtCTlIgYiBLUWtxIC0gMCAyXCIsXG4gICAgICBcIlNpY2lsaWFuX0RlZmVuY2UjR3JhbmRfUHJpeF9BdHRhY2tcIixcbiAgICAgIFtcImU0IGM1XCIsIFwiZjRcIl1cbiAgICApLFxuICAgIG5ldyBTdGFydGluZ1Bvc2l0aW9uKFxuICAgICAgXCJCMjdcIixcbiAgICAgIFwiU2ljaWxpYW4gRGVmZW5jZTogSHlwZXItQWNjZWxlcmF0ZWQgRHJhZ29uXCIsXG4gICAgICBcInJuYnFrYm5yL3BwMXBwcDFwLzZwMS8ycDUvNFAzLzVOMi9QUFBQMVBQUC9STkJRS0IxUiB3IEtRa3EgLSAwIDNcIixcbiAgICAgIFwiU2ljaWxpYW5fRGVmZW5jZSMyLi4uZzY6X0h1bmdhcmlhbl9WYXJpYXRpb25cIixcbiAgICAgIFtcImU0IGM1XCIsIFwiTmYzIGc2XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQjQxXCIsXG4gICAgICBcIlNpY2lsaWFuIERlZmVuY2U6IEthbiBWYXJpYXRpb25cIixcbiAgICAgIFwicm5icWtibnIvMXAxcDFwcHAvcDNwMy84LzNOUDMvOC9QUFAyUFBQL1JOQlFLQjFSIHcgS1FrcSAtIDAgNVwiLFxuICAgICAgXCJTaWNpbGlhbl9EZWZlbmNlI0thbl8uMjhQYXVsc2VuLjI5X1ZhcmlhdGlvbjpfNC4uLmE2XCIsXG4gICAgICBbXCJlNCBjNVwiLCBcIk5mMyBlNlwiLCBcImQ0IGN4ZDRcIiwgXCJOeGQ0IGE2XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQjkwXCIsXG4gICAgICBcIlNpY2lsaWFuIERlZmVuY2U6IE5hamRvcmYgVmFyaWF0aW9uXCIsXG4gICAgICBcInJuYnFrYjFyLzFwMnBwcHAvcDJwMW4yLzgvM05QMy8yTjUvUFBQMlBQUC9SMUJRS0IxUiB3IEtRa3EgLSAwIDZcIixcbiAgICAgIFwiU2ljaWxpYW5fRGVmZW5jZSxfTmFqZG9yZl9WYXJpYXRpb25cIixcbiAgICAgIFtcImU0IGM1XCIsIFwiTmYzIGQ2XCIsIFwiZDQgY3hkNFwiLCBcIk54ZDQgTmY2XCIsIFwiTmMzIGE2XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQjYwXCIsXG4gICAgICBcIlNpY2lsaWFuIERlZmVuY2U6IFJpY2h0ZXItUmF1emVyIFZhcmlhdGlvblwiLFxuICAgICAgXCJyMWJxa2Ixci9wcDJwcHBwLzJucDFuMi82QjEvM05QMy8yTjUvUFBQMlBQUC9SMlFLQjFSIGIgS1FrcSAtIDQgNlwiLFxuICAgICAgXCJTaWNpbGlhbl9EZWZlbmNlI0NsYXNzaWNhbF9WYXJpYXRpb246XzUuLi5OYzZcIixcbiAgICAgIFtcImU0IGM1XCIsIFwiTmYzIGQ2XCIsIFwiZDQgY3hkNFwiLCBcIk54ZDQgTmY2XCIsIFwiTmMzIE5jNlwiLCBcIkJnNVwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkI4MFwiLFxuICAgICAgXCJTaWNpbGlhbiBEZWZlbmNlOiBTY2hldmVuaW5nZW4gVmFyaWF0aW9uXCIsXG4gICAgICBcInJuYnFrYjFyL3BwM3BwcC8zcHBuMi84LzNOUDMvMk41L1BQUDJQUFAvUjFCUUtCMVIgdyBLUWtxIC0gMCA2XCIsXG4gICAgICBcIlNpY2lsaWFuX0RlZmVuY2UsX1NjaGV2ZW5pbmdlbl9WYXJpYXRpb25cIixcbiAgICAgIFtcImU0IGM1XCIsIFwiTmYzIGQ2XCIsIFwiZDQgY3hkNFwiLCBcIk54ZDQgTmY2XCIsIFwiTmMzIGU2XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQjIxXCIsXG4gICAgICBcIlNpY2lsaWFuIERlZmVuY2U6IFNtaXRoLU1vcnJhIEdhbWJpdFwiLFxuICAgICAgXCJybmJxa2Juci9wcDFwcHBwcC84LzgvM3BQMy8yUDUvUFAzUFBQL1JOQlFLQk5SIGIgS1FrcSAtIDAgM1wiLFxuICAgICAgXCJTaWNpbGlhbl9EZWZlbmNlLF9TbWl0aOKAk01vcnJhX0dhbWJpdFwiLFxuICAgICAgW1wiZTQgYzVcIiwgXCJkNCBjeGQ0XCIsIFwiYzNcIl1cbiAgICApLFxuICAgIG5ldyBTdGFydGluZ1Bvc2l0aW9uKFxuICAgICAgXCJDMjVcIixcbiAgICAgIFwiVmllbm5hIEdhbWVcIixcbiAgICAgIFwicm5icWtibnIvcHBwcDFwcHAvOC80cDMvNFAzLzJONS9QUFBQMVBQUC9SMUJRS0JOUiBiIEtRa3EgLSAxIDJcIixcbiAgICAgIFwiVmllbm5hX0dhbWVcIixcbiAgICAgIFtcImU0IGU1XCIsIFwiIE5jM1wiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkMyN1wiLFxuICAgICAgXCJWaWVubmEgR2FtZTogRnJhbmtlbnN0ZWluLURyYWN1bGEgVmFyaWF0aW9uXCIsXG4gICAgICBcInJuYnFrYjFyL3BwcHAxcHBwLzgvNHAzLzJCMW4zLzJONS9QUFBQMVBQUC9SMUJRSzFOUiB3IEtRa3EgLSAwIDRcIixcbiAgICAgIFwiRnJhbmtlbnN0ZWluLURyYWN1bGFfVmFyaWF0aW9uXCIsXG4gICAgICBbXCJlNCBlNVwiLCBcIk5jMyBOZjZcIiwgXCJCYzQgTnhlNFwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkM0NlwiLFxuICAgICAgXCJGb3VyIEtuaWdodHMgR2FtZTogSGFsbG93ZWVuIEdhbWJpdFwiLFxuICAgICAgXCJyMWJxa2Ixci9wcHBwMXBwcC8ybjJuMi80TjMvNFAzLzJONS9QUFBQMVBQUC9SMUJRS0IxUiBiIEtRa3EgLSAwIDRcIixcbiAgICAgIFwiSGFsbG93ZWVuX0dhbWJpdFwiLFxuICAgICAgW1wiZTQgZTVcIiwgXCJOZjMgTmM2XCIsIFwiTmMzIE5mNlwiLCBcIk54ZTVcIl1cbiAgICApLFxuICAgIG5ldyBTdGFydGluZ1Bvc2l0aW9uKFxuICAgICAgXCJDMjBcIixcbiAgICAgIFwiS2luZydzIFBhd24gR2FtZTogV2F5d2FyZCBRdWVlbiBBdHRhY2tcIixcbiAgICAgIFwicm5icWtibnIvcHBwcDFwcHAvOC80cDJRLzRQMy84L1BQUFAxUFBQL1JOQjFLQk5SIGIgS1FrcSAtIDEgMlwiLFxuICAgICAgXCJEYW52ZXJzX09wZW5pbmdcIixcbiAgICAgIFtcImU0IGU1XCIsIFwiUWg1XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQzIwXCIsXG4gICAgICBcIkJvbmdjbG91ZCBBdHRhY2tcIixcbiAgICAgIFwicm5icWtibnIvcHBwcDFwcHAvOC80cDMvNFAzLzgvUFBQUEtQUFAvUk5CUTFCTlIgYiBrcSAtIDEgMlwiLFxuICAgICAgXCJCb25nXCIsXG4gICAgICBbXCJlNCBlNVwiLCBcIktlMlwiXVxuICAgICksXG4gIF0pLFxuICBuZXcgQ2F0ZWdvcnkoXCJkNFwiLCBbXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkE0MFwiLFxuICAgICAgXCJRdWVlbidzIFBhd25cIixcbiAgICAgIFwicm5icWtibnIvcHBwcHBwcHAvOC84LzNQNC84L1BQUDFQUFBQL1JOQlFLQk5SIGIgS1FrcSAtIDAgMVwiLFxuICAgICAgXCJRdWVlbidzX1Bhd25fR2FtZVwiLFxuICAgICAgW1wiZDRcIl1cbiAgICApLFxuICAgIG5ldyBTdGFydGluZ1Bvc2l0aW9uKFxuICAgICAgXCJBNTdcIixcbiAgICAgIFwiQmVua28gR2FtYml0XCIsXG4gICAgICBcInJuYnFrYjFyL3AycHBwcHAvNW4yLzFwcFA0LzJQNS84L1BQMlBQUFAvUk5CUUtCTlIgdyBLUWtxIC0gMCA0XCIsXG4gICAgICBcIkJlbmtvX0dhbWJpdFwiLFxuICAgICAgW1wiZDQgTmY2XCIsIFwiYzQgYzVcIiwgXCJkNSBiNVwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkE2MVwiLFxuICAgICAgXCJCZW5vbmkgRGVmZW5jZTogTW9kZXJuIEJlbm9uaVwiLFxuICAgICAgXCJybmJxa2Ixci9wcDFwMXBwcC80cG4yLzJwUDQvMlA1LzgvUFAyUFBQUC9STkJRS0JOUiB3IEtRa3EgLSAwIDRcIixcbiAgICAgIFwiTW9kZXJuX0Jlbm9uaVwiLFxuICAgICAgW1wiZDQgTmY2XCIsIFwiYzQgYzVcIiwgXCJkNSBlNlwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkE0M1wiLFxuICAgICAgXCJCZW5vbmkgRGVmZW5jZTogQ3plY2ggQmVub25pXCIsXG4gICAgICBcInJuYnFrYjFyL3BwMXAxcHBwLzVuMi8ycFBwMy8yUDUvOC9QUDJQUFBQL1JOQlFLQk5SIHcgS1FrcSBlNiAwIDRcIixcbiAgICAgIFwiQmVub25pX0RlZmVuc2UjQ3plY2hfQmVub25pOl8xLmQ0X05mNl8yLmM0X2M1XzMuZDVfZTVcIixcbiAgICAgIFtcImQ0IE5mNlwiLCBcImM0IGM1XCIsIFwiZDUgZTVcIl1cbiAgICApLFxuICAgIG5ldyBTdGFydGluZ1Bvc2l0aW9uKFxuICAgICAgXCJEMDBcIixcbiAgICAgIFwiQmxhY2ttYXIgR2FtYml0XCIsXG4gICAgICBcInJuYnFrYm5yL3BwcDFwcHBwLzgvM3A0LzNQUDMvOC9QUFAyUFBQL1JOQlFLQk5SIGIgS1FrcSAtIDAgMlwiLFxuICAgICAgXCJCbGFja21hcuKAk0RpZW1lcl9HYW1iaXRcIixcbiAgICAgIFtcImQ0IGQ1XCIsIFwiZTRcIl1cbiAgICApLFxuICAgIG5ldyBTdGFydGluZ1Bvc2l0aW9uKFxuICAgICAgXCJFMTFcIixcbiAgICAgIFwiQm9nby1JbmRpYW4gRGVmZW5jZVwiLFxuICAgICAgXCJybmJxazJyL3BwcHAxcHBwLzRwbjIvOC8xYlBQNC81TjIvUFAyUFBQUC9STkJRS0IxUiB3IEtRa3EgLSAyIDRcIixcbiAgICAgIFwiQm9nby1JbmRpYW5fRGVmZW5jZVwiLFxuICAgICAgW1wiZDQgTmY2XCIsIFwiYzQgZTZcIiwgXCJOZjMgQmI0K1wiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkUwMFwiLFxuICAgICAgXCJDYXRhbGFuIE9wZW5pbmdcIixcbiAgICAgIFwicm5icWtiMXIvcHBwcDFwcHAvNHBuMi84LzJQUDQvNlAxL1BQMlBQMVAvUk5CUUtCTlIgYiBLUWtxIC0gMCAzXCIsXG4gICAgICBcIkNhdGFsYW5fT3BlbmluZ1wiLFxuICAgICAgW1wiZDQgTmY2XCIsIFwiYzQgZTZcIiwgXCJnM1wiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkUwNlwiLFxuICAgICAgXCJDYXRhbGFuIE9wZW5pbmc6IENsb3NlZCBWYXJpYXRpb25cIixcbiAgICAgIFwicm5icWsyci9wcHAxYnBwcC80cG4yLzNwNC8yUFA0LzVOUDEvUFAyUFBCUC9STkJRSzJSIGIgS1FrcSAtIDMgNVwiLFxuICAgICAgXCJDYXRhbGFuX09wZW5pbmdcIixcbiAgICAgIFtcImQ0IE5mNlwiLCBcImM0IGU2XCIsIFwiZzMgZDVcIiwgXCJOZjMgQmU3XCIsIFwiQmcyXCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQTgwXCIsXG4gICAgICBcIkR1dGNoIERlZmVuY2VcIixcbiAgICAgIFwicm5icWtibnIvcHBwcHAxcHAvOC81cDIvM1A0LzgvUFBQMVBQUFAvUk5CUUtCTlIgdyBLUWtxIC0gMCAyXCIsXG4gICAgICBcIkR1dGNoX0RlZmVuY2VcIixcbiAgICAgIFtcImQ0IGY1XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQTk2XCIsXG4gICAgICBcIkR1dGNoIERlZmVuY2U6IENsYXNzaWNhbCBWYXJpYXRpb25cIixcbiAgICAgIFwicm5icTFyazEvcHBwMWIxcHAvM3BwbjIvNXAyLzJQUDQvNU5QMS9QUDJQUEJQL1JOQlExUksxIHcgLSAtIDAgN1wiLFxuICAgICAgXCJEdXRjaF9EZWZlbmNlXCIsXG4gICAgICBbXCJkNCBmNVwiLCBcImM0IE5mNlwiLCBcImczIGU2XCIsIFwiQmcyIEJlN1wiLCBcIk5mMyBPLU9cIiwgXCJPLU8gZDZcIl1cbiAgICApLFxuICAgIG5ldyBTdGFydGluZ1Bvc2l0aW9uKFxuICAgICAgXCJBODdcIixcbiAgICAgIFwiRHV0Y2ggRGVmZW5jZTogTGVuaW5ncmFkIFZhcmlhdGlvblwiLFxuICAgICAgXCJybmJxazJyL3BwcHBwMWJwLzVucDEvNXAyLzJQUDQvNU5QMS9QUDJQUEJQL1JOQlFLMlIgYiBLUWtxIC0gMyA1XCIsXG4gICAgICBcIkR1dGNoX0RlZmVuY2VcIixcbiAgICAgIFtcImQ0IGY1XCIsIFwiYzQgTmY2XCIsIFwiZzMgZzZcIiwgXCJCZzIgQmc3XCIsIFwiTmYzXCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQTgzXCIsXG4gICAgICBcIkR1dGNoIERlZmVuY2U6IFN0YXVudG9uIEdhbWJpdFwiLFxuICAgICAgXCJybmJxa2Ixci9wcHBwcDFwcC81bjIvNkIxLzNQcDMvMk41L1BQUDJQUFAvUjJRS0JOUiBiIEtRa3EgLSAzIDRcIixcbiAgICAgIFwiRHV0Y2hfRGVmZW5jZVwiLFxuICAgICAgW1wiZDQgZjVcIiwgXCJlNCBmeGU0XCIsIFwiTmMzIE5mNlwiLCBcIkJnNVwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkE5MlwiLFxuICAgICAgXCJEdXRjaCBEZWZlbmNlOiBTdG9uZXdhbGwgVmFyaWF0aW9uXCIsXG4gICAgICBcInJuYnExcmsxL3BwcDFiMXBwLzRwbjIvM3AxcDIvMlBQNC81TlAxL1BQMlBQQlAvUk5CUTFSSzEgdyAtIC0gMCA3XCIsXG4gICAgICBcIkR1dGNoX0RlZmVuY2VcIixcbiAgICAgIFtcImQ0IGY1XCIsIFwiYzQgTmY2XCIsIFwiZzMgZTZcIiwgXCJCZzIgQmU3XCIsIFwiTmYzIE8tT1wiLCBcIk8tTyBkNVwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkQ4MFwiLFxuICAgICAgXCJHcsO8bmZlbGQgRGVmZW5jZVwiLFxuICAgICAgXCJybmJxa2Ixci9wcHAxcHAxcC81bnAxLzNwNC8yUFA0LzJONS9QUDJQUFBQL1IxQlFLQk5SIHcgS1FrcSAtIDAgNFwiLFxuICAgICAgXCJHcsO8bmZlbGRfRGVmZW5jZVwiLFxuICAgICAgW1wiZDQgTmY2XCIsIFwiYzQgZzZcIiwgXCJOYzMgZDVcIl1cbiAgICApLFxuICAgIG5ldyBTdGFydGluZ1Bvc2l0aW9uKFxuICAgICAgXCJEODJcIixcbiAgICAgIFwiR3LDvG5mZWxkIERlZmVuY2U6IEJyaW5ja21hbm4gQXR0YWNrXCIsXG4gICAgICBcInJuYnFrYjFyL3BwcDFwcDFwLzVucDEvM3A0LzJQUDFCMi8yTjUvUFAyUFBQUC9SMlFLQk5SIGIgS1FrcSAtIDEgNFwiLFxuICAgICAgXCJHcsO8bmZlbGRfRGVmZW5jZSNMaW5lc193aXRoXzQuQmY0X2FuZF90aGVfR3IuQzMuQkNuZmVsZF9HYW1iaXRcIixcbiAgICAgIFtcImQ0IE5mNlwiLCBcImM0IGc2XCIsIFwiTmMzIGQ1XCIsIFwiQmY0XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiRDg1XCIsXG4gICAgICBcIkdyw7xuZmVsZCBEZWZlbmNlOiBFeGNoYW5nZSBWYXJpYXRpb25cIixcbiAgICAgIFwicm5icWtiMXIvcHBwMXBwMXAvNnAxLzNuNC8zUDQvMk41L1BQMlBQUFAvUjFCUUtCTlIgdyBLUWtxIC0gMCA1XCIsXG4gICAgICBcIkdyw7xuZmVsZF9EZWZlbmNlI0V4Y2hhbmdlX1ZhcmlhdGlvbjpfNC5jeGQ1X054ZDVfNS5lNFwiLFxuICAgICAgW1wiZDQgTmY2XCIsIFwiYzQgZzZcIiwgXCJOYzMgZDVcIiwgXCJjeGQ1IE54ZDVcIl1cbiAgICApLFxuICAgIG5ldyBTdGFydGluZ1Bvc2l0aW9uKFxuICAgICAgXCJEODBcIixcbiAgICAgIFwiR3LDvG5mZWxkIERlZmVuY2U6IFJ1c3NpYW4gVmFyaWF0aW9uXCIsXG4gICAgICBcInJuYnFrYjFyL3BwcDFwcDFwLzVucDEvM3A0LzJQUDQvMVFONS9QUDJQUFBQL1IxQjFLQk5SIGIgS1FrcSAtIDEgNFwiLFxuICAgICAgXCJHcsO8bmZlbGRfRGVmZW5jZSNSdXNzaWFuX1N5c3RlbTpfNC5OZjNfQmc3XzUuUWIzXCIsXG4gICAgICBbXCJkNCBOZjZcIiwgXCJjNCBnNlwiLCBcIk5jMyBkNVwiLCBcIlFiM1wiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkQ5MFwiLFxuICAgICAgXCJHcsO8bmZlbGQgRGVmZW5jZTogVGFpbWFub3YgVmFyaWF0aW9uXCIsXG4gICAgICBcInJuYnFrMnIvcHBwMXBwYnAvNW5wMS8zcDJCMS8yUFA0LzJOMk4yL1BQMlBQUFAvUjJRS0IxUiBiIEtRa3EgLSAzIDVcIixcbiAgICAgIFwiR3LDvG5mZWxkX0RlZmVuY2UjVGFpbWFub3YuMjdzX1ZhcmlhdGlvbl93aXRoXzQuTmYzX0JnN181LkJnNVwiLFxuICAgICAgW1wiZDQgTmY2XCIsIFwiYzQgZzZcIiwgXCJOYzMgZDVcIiwgXCJOZjMgQmc3XCIsIFwiQmc1XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiRTYxXCIsXG4gICAgICBcIktpbmcncyBJbmRpYW4gRGVmZW5jZVwiLFxuICAgICAgXCJybmJxa2Ixci9wcHBwcHAxcC81bnAxLzgvMlBQNC84L1BQMlBQUFAvUk5CUUtCTlIgdyBLUWtxIC0gMCAzXCIsXG4gICAgICBcIktpbmcnc19JbmRpYW5fRGVmZW5jZVwiLFxuICAgICAgW1wiZDQgTmY2XCIsIFwiYzQgZzZcIl1cbiAgICApLFxuICAgIG5ldyBTdGFydGluZ1Bvc2l0aW9uKFxuICAgICAgXCJFNzdcIixcbiAgICAgIFwiS2luZydzIEluZGlhbiBEZWZlbmNlOiA0LmU0XCIsXG4gICAgICBcInJuYnFrMnIvcHBwMXBwYnAvM3AxbnAxLzgvMlBQUDMvMk41L1BQM1BQUC9SMUJRS0JOUiB3IEtRa3EgLSAwIDVcIixcbiAgICAgIFwiS2luZydzX0luZGlhbl9EZWZlbmNlXCIsXG4gICAgICBbXCJkNCBOZjZcIiwgXCJjNCBnNlwiLCBcIk5jMyBCZzdcIiwgXCJlNCBkNlwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkU3M1wiLFxuICAgICAgXCJLaW5nJ3MgSW5kaWFuIERlZmVuY2U6IEF2ZXJiYWtoIFZhcmlhdGlvblwiLFxuICAgICAgXCJybmJxMXJrMS9wcHAxcHBicC8zcDFucDEvNkIxLzJQUFAzLzJONS9QUDJCUFBQL1IyUUsxTlIgYiBLUSAtIDMgNlwiLFxuICAgICAgXCJLaW5nJ3NfSW5kaWFuX0RlZmVuY2UjQXZlcmJha2hfVmFyaWF0aW9uOl81LkJlMl8wLTBfNi5CZzVcIixcbiAgICAgIFtcImQ0IE5mNlwiLCBcImM0IGc2XCIsIFwiTmMzIEJnN1wiLCBcImU0IGQ2XCIsIFwiQmUyIE8tT1wiLCBcIkJnNVwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkU2MlwiLFxuICAgICAgXCJLaW5nJ3MgSW5kaWFuIERlZmVuY2U6IEZpYW5jaGV0dG8gVmFyaWF0aW9uXCIsXG4gICAgICBcInJuYnFrMnIvcHBwMXBwYnAvM3AxbnAxLzgvMlBQNC8yTjJOUDEvUFAyUFAxUC9SMUJRS0IxUiBiIEtRa3EgLSAwIDVcIixcbiAgICAgIFwiS2luZydzX0luZGlhbl9EZWZlbmNlI0ZpYW5jaGV0dG9fVmFyaWF0aW9uOl8zLk5mM19CZzdfNC5nM1wiLFxuICAgICAgW1wiZDQgTmY2XCIsIFwiYzQgZzZcIiwgXCJOYzMgQmc3XCIsIFwiTmYzIGQ2XCIsIFwiZzNcIl1cbiAgICApLFxuICAgIG5ldyBTdGFydGluZ1Bvc2l0aW9uKFxuICAgICAgXCJFNzZcIixcbiAgICAgIFwiS2luZydzIEluZGlhbiBEZWZlbmNlOiBGb3VyIFBhd25zIEF0dGFja1wiLFxuICAgICAgXCJybmJxazJyL3BwcDFwcGJwLzNwMW5wMS84LzJQUFBQMi8yTjUvUFA0UFAvUjFCUUtCTlIgYiBLUWtxIC0gMCA1XCIsXG4gICAgICBcIktpbmclMjdzX0luZGlhbl9EZWZlbmNlLF9Gb3VyX1Bhd25zX0F0dGFja1wiLFxuICAgICAgW1wiZDQgTmY2XCIsIFwiYzQgZzZcIiwgXCJOYzMgQmc3XCIsIFwiZTQgZDZcIiwgXCJmNFwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkU5MVwiLFxuICAgICAgXCJLaW5nJ3MgSW5kaWFuIERlZmVuY2U6IENsYXNzaWNhbCBWYXJpYXRpb25cIixcbiAgICAgIFwicm5icTFyazEvcHBwMXBwYnAvM3AxbnAxLzgvMlBQUDMvMk4yTjIvUFAyQlBQUC9SMUJRSzJSIGIgS1EgLSAzIDZcIixcbiAgICAgIFwiS2luZydzX0luZGlhbl9EZWZlbmNlI0NsYXNzaWNhbF9WYXJpYXRpb246XzUuTmYzXzAtMF82LkJlMl9lNVwiLFxuICAgICAgW1wiZDQgTmY2XCIsIFwiYzQgZzZcIiwgXCJOYzMgQmc3XCIsIFwiZTQgZDZcIiwgXCJOZjMgTy1PXCIsIFwiQmUyXCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiRTgwXCIsXG4gICAgICBcIktpbmcncyBJbmRpYW4gRGVmZW5jZTogU8OkbWlzY2ggVmFyaWF0aW9uXCIsXG4gICAgICBcInJuYnFrMnIvcHBwMXBwYnAvM3AxbnAxLzgvMlBQUDMvMk4yUDIvUFA0UFAvUjFCUUtCTlIgYiBLUWtxIC0gMCA1XCIsXG4gICAgICBcIktpbmcnc19JbmRpYW5fRGVmZW5jZSNTLkMzLkE0bWlzY2hfVmFyaWF0aW9uOl81LmYzXCIsXG4gICAgICBbXCJkNCBOZjZcIiwgXCJjNCBnNlwiLCBcIk5jMyBCZzdcIiwgXCJlNCBkNlwiLCBcImYzXCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQTQxXCIsXG4gICAgICBcIlF1ZWVucydzIFBhd24gR2FtZTogTW9kZXJuIERlZmVuY2VcIixcbiAgICAgIFwicm5icWsxbnIvcHBwMXBwYnAvM3AycDEvOC8yUFA0LzJONS9QUDJQUFBQL1IxQlFLQk5SIHcgS1FrcSAtIDIgNFwiLFxuICAgICAgXCJRdWVlbidzX1Bhd25fR2FtZSMxLi4uZzZcIixcbiAgICAgIFtcImQ0IGc2XCIsIFwiYzQgZDZcIiwgXCJOYzMgQmc3XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiRTIwXCIsXG4gICAgICBcIk5pbXpvLUluZGlhbiBEZWZlbmNlXCIsXG4gICAgICBcInJuYnFrMnIvcHBwcDFwcHAvNHBuMi84LzFiUFA0LzJONS9QUDJQUFBQL1IxQlFLQk5SIHcgS1FrcSAtIDIgNFwiLFxuICAgICAgXCJOaW16by1JbmRpYW5fRGVmZW5jZVwiLFxuICAgICAgW1wiZDQgTmY2XCIsIFwiYzQgZTZcIiwgXCJOYzMgQmI0XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiRTMyXCIsXG4gICAgICBcIk5pbXpvLUluZGlhbiBEZWZlbmNlOiBDbGFzc2ljYWwgVmFyaWF0aW9uXCIsXG4gICAgICBcInJuYnFrMnIvcHBwcDFwcHAvNHBuMi84LzFiUFA0LzJONS9QUFExUFBQUC9SMUIxS0JOUiBiIEtRa3EgLSAzIDRcIixcbiAgICAgIFwiTmltem8tSW5kaWFuX0RlZmVuY2UjQ2xhc3NpY2FsX1ZhcmlhdGlvbjpfNC5RYzJcIixcbiAgICAgIFtcImQ0IE5mNlwiLCBcImM0IGU2XCIsIFwiTmMzIEJiNFwiLCBcIlFjMlwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkU0M1wiLFxuICAgICAgXCJOaW16by1JbmRpYW4gRGVmZW5jZTogRmlzY2hlciBWYXJpYXRpb25cIixcbiAgICAgIFwicm5icWsyci9wMXBwMXBwcC8xcDJwbjIvOC8xYlBQNC8yTjFQMy9QUDNQUFAvUjFCUUtCTlIgdyBLUWtxIC0gMCA1XCIsXG4gICAgICBcIk5pbXpvLUluZGlhbl9EZWZlbmNlIzQuLi5iNlwiLFxuICAgICAgW1wiZDQgTmY2XCIsIFwiYzQgZTZcIiwgXCJOYzMgQmI0XCIsIFwiZTMgYjZcIl1cbiAgICApLFxuICAgIG5ldyBTdGFydGluZ1Bvc2l0aW9uKFxuICAgICAgXCJFNDFcIixcbiAgICAgIFwiTmltem8tSW5kaWFuIERlZmVuY2U6IEjDvGJuZXIgVmFyaWF0aW9uXCIsXG4gICAgICBcInIxYnFrMnIvcHAzcHBwLzJucHBuMi8ycDUvMlBQNC8yUEJQTjIvUDRQUFAvUjFCUUsyUiB3IEtRa3EgLSAwIDhcIixcbiAgICAgIFwiTmltem8tSW5kaWFuX0RlZmVuY2UjNC4uLmM1XCIsXG4gICAgICBbXCJkNCBOZjZcIiwgXCJjNCBlNlwiLCBcIk5jMyBCYjRcIiwgXCJlMyBjNVwiLCBcIkJkMyBOYzZcIiwgXCJOZjMgQnhjMytcIiwgXCJieGMzIGQ2XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiRTIxXCIsXG4gICAgICBcIk5pbXpvLUluZGlhbiBEZWZlbmNlOiBLYXNwYXJvdiBWYXJpYXRpb25cIixcbiAgICAgIFwicm5icWsyci9wcHBwMXBwcC80cG4yLzgvMWJQUDQvMk4yTjIvUFAyUFBQUC9SMUJRS0IxUiBiIEtRa3EgLSAzIDRcIixcbiAgICAgIFwiTmltem8tSW5kaWFuX0RlZmVuY2UjS2FzcGFyb3ZfVmFyaWF0aW9uOl80Lk5mM1wiLFxuICAgICAgW1wiZDQgTmY2XCIsIFwiYzQgZTZcIiwgXCJOYzMgQmI0XCIsIFwiTmYzXCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiRTMwXCIsXG4gICAgICBcIk5pbXpvLUluZGlhbiBEZWZlbmNlOiBMZW5pbmdyYWQgVmFyaWF0aW9uXCIsXG4gICAgICBcInJuYnFrMnIvcHBwcDFwcHAvNHBuMi82QjEvMWJQUDQvMk41L1BQMlBQUFAvUjJRS0JOUiBiIEtRa3EgLSAzIDRcIixcbiAgICAgIFwiTmltem8tSW5kaWFuX0RlZmVuY2UjT3RoZXJfdmFyaWF0aW9uc1wiLFxuICAgICAgW1wiZDQgTmY2XCIsIFwiYzQgZTZcIiwgXCJOYzMgQmI0XCIsIFwiQmc1XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiRTI2XCIsXG4gICAgICBcIk5pbXpvLUluZGlhbiBEZWZlbmNlOiBTw6RtaXNjaCBWYXJpYXRpb25cIixcbiAgICAgIFwicm5icWsyci9wcHBwMXBwcC80cG4yLzgvMlBQNC9QMVA1LzRQUFBQL1IxQlFLQk5SIGIgS1FrcSAtIDAgNVwiLFxuICAgICAgXCJOaW16by1JbmRpYW5fRGVmZW5jZSNPdGhlcl92YXJpYXRpb25zXCIsXG4gICAgICBbXCJkNCBOZjZcIiwgXCJjNCBlNlwiLCBcIk5jMyBCYjRcIiwgXCJhMyBCeGMzK1wiLCBcImJ4YzNcIl1cbiAgICApLFxuICAgIG5ldyBTdGFydGluZ1Bvc2l0aW9uKFxuICAgICAgXCJBNTNcIixcbiAgICAgIFwiT2xkIEluZGlhbiBEZWZlbmNlXCIsXG4gICAgICBcInJuYnFrYjFyL3BwcDFwcHBwLzNwMW4yLzgvMlBQNC84L1BQMlBQUFAvUk5CUUtCTlIgdyBLUWtxIC0gMCAzXCIsXG4gICAgICBcIk9sZF9JbmRpYW5fRGVmZW5zZVwiLFxuICAgICAgW1wiZDQgTmY2XCIsIFwiYzQgZDZcIl1cbiAgICApLFxuICAgIG5ldyBTdGFydGluZ1Bvc2l0aW9uKFxuICAgICAgXCJEMDZcIixcbiAgICAgIFwiUXVlZW4ncyBHYW1iaXRcIixcbiAgICAgIFwicm5icWtibnIvcHBwMXBwcHAvOC8zcDQvMlBQNC84L1BQMlBQUFAvUk5CUUtCTlIgYiBLUWtxIC0gMCAyXCIsXG4gICAgICBcIlF1ZWVuJ3NfR2FtYml0XCIsXG4gICAgICBbXCJkNCBkNVwiLCBcImM0XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiRDIwXCIsXG4gICAgICBcIlF1ZWVuJ3MgR2FtYml0IEFjY2VwdGVkXCIsXG4gICAgICBcInJuYnFrYm5yL3BwcDFwcHBwLzgvOC8ycFA0LzgvUFAyUFBQUC9STkJRS0JOUiB3IEtRa3EgLSAwIDNcIixcbiAgICAgIFwiUXVlZW4lMjdzX0dhbWJpdF9BY2NlcHRlZFwiLFxuICAgICAgW1wiZDQgZDVcIiwgXCJjNCBkeGM0XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiRDQzXCIsXG4gICAgICBcIlF1ZWVuJ3MgR2FtYml0IERlY2xpbmVkOiBTZW1pLVNsYXYgRGVmZW5jZVwiLFxuICAgICAgXCJybmJxa2Ixci9wcDNwcHAvMnAxcG4yLzNwNC8yUFA0LzJOMk4yL1BQMlBQUFAvUjFCUUtCMVIgdyBLUWtxIC0gMCA1XCIsXG4gICAgICBcIlNlbWktU2xhdl9EZWZlbnNlXCIsXG4gICAgICBbXCJkNCBkNVwiLCBcImM0IGU2XCIsIFwiTmMzIE5mNlwiLCBcIk5mMyBjNlwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkQxMFwiLFxuICAgICAgXCJRdWVlbidzIEdhbWJpdCBEZWNsaW5lZDogU2xhdiBEZWZlbmNlXCIsXG4gICAgICBcInJuYnFrYm5yL3BwMnBwcHAvMnA1LzNwNC8yUFA0LzgvUFAyUFBQUC9STkJRS0JOUiB3IEtRa3EgLSAwIDNcIixcbiAgICAgIFwiU2xhdl9EZWZlbnNlXCIsXG4gICAgICBbXCJkNCBkNVwiLCBcImM0IGM2XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiRDQwXCIsXG4gICAgICBcIlF1ZWVuJ3MgR2FtYml0IERlY2xpbmVkOiBTZW1pLVRhcnJhc2NoIERlZmVuY2VcIixcbiAgICAgIFwicm5icWtiMXIvcHAzcHBwLzRwbjIvMnBwNC8yUFA0LzJOMk4yL1BQMlBQUFAvUjFCUUtCMVIgdyBLUWtxIC0gMCA1XCIsXG4gICAgICBcIlRhcnJhc2NoX0RlZmVuc2UjU2VtaS1UYXJyYXNjaF9EZWZlbnNlXCIsXG4gICAgICBbXCJkNCBkNVwiLCBcImM0IGU2XCIsIFwiTmMzIE5mNlwiLCBcIk5mMyBjNVwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkQzMlwiLFxuICAgICAgXCJRdWVlbidzIEdhbWJpdCBEZWNsaW5lZDogVGFycmFzY2ggRGVmZW5jZVwiLFxuICAgICAgXCJybmJxa2Juci9wcDNwcHAvNHAzLzJwcDQvMlBQNC8yTjUvUFAyUFBQUC9SMUJRS0JOUiB3IEtRa3EgLSAwIDRcIixcbiAgICAgIFwiVGFycmFzY2hfRGVmZW5zZVwiLFxuICAgICAgW1wiZDQgZDVcIiwgXCJjNCBlNlwiLCBcIk5jMyBjNVwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkQwOFwiLFxuICAgICAgXCJRdWVlbidzIEdhbWJpdDogQWxiaW4gQ291bnRlcmdhbWJpdFwiLFxuICAgICAgXCJybmJxa2Juci9wcHAycHBwLzgvM3BwMy8yUFA0LzgvUFAyUFBQUC9STkJRS0JOUiB3IEtRa3EgLSAwIDNcIixcbiAgICAgIFwiQWxiaW5fQ291bnRlcmdhbWJpdFwiLFxuICAgICAgW1wiZDQgZDVcIiwgXCJjNCBlNVwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkQwN1wiLFxuICAgICAgXCJRdWVlbidzIEdhbWJpdDogQ2hpZ29yaW4gRGVmZW5jZVwiLFxuICAgICAgXCJyMWJxa2Juci9wcHAxcHBwcC8ybjUvM3A0LzJQUDQvOC9QUDJQUFBQL1JOQlFLQk5SIHcgS1FrcSAtIDEgM1wiLFxuICAgICAgXCJDaGlnb3Jpbl9EZWZlbnNlXCIsXG4gICAgICBbXCJkNCBkNVwiLCBcImM0IE5jNlwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkUxMlwiLFxuICAgICAgXCJRdWVlbidzIEluZGlhbiBEZWZlbmNlXCIsXG4gICAgICBcInJuYnFrYjFyL3AxcHAxcHBwLzFwMnBuMi84LzJQUDQvNU4yL1BQMlBQUFAvUk5CUUtCMVIgdyBLUWtxIC0gMCA0XCIsXG4gICAgICBcIlF1ZWVuJ3NfSW5kaWFuX0RlZmVuc2VcIixcbiAgICAgIFtcImQ0IE5mNlwiLCBcImM0IGU2XCIsIFwiTmYzIGI2XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiRDAyXCIsXG4gICAgICBcIkxvbmRvbiBTeXN0ZW1cIixcbiAgICAgIFwicm5icWtiMXIvcHBwMXBwcHAvNW4yLzNwNC8zUDFCMi81TjIvUFBQMVBQUFAvUk4xUUtCMVIgYiBLUWtxIC0gMyAzXCIsXG4gICAgICBcIkxvbmRvbl9TeXN0ZW1cIixcbiAgICAgIFtcImQ0IGQ1XCIsIFwiTmYzIE5mNlwiLCBcIkJmNFwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkQwMFwiLFxuICAgICAgXCJMb25kb24gU3lzdGVtOiBNYXNvbiBBdHRhY2tcIixcbiAgICAgIFwicm5icWtibnIvcHBwMXBwcHAvOC8zcDQvM1AxQjIvOC9QUFAxUFBQUC9STjFRS0JOUiBiIEtRa3EgLSAxIDJcIixcbiAgICAgIFwiTG9uZG9uX1N5c3RlbVwiLFxuICAgICAgW1wiZDQgZDVcIiwgXCJCZjRcIl1cbiAgICApLFxuICAgIG5ldyBTdGFydGluZ1Bvc2l0aW9uKFxuICAgICAgXCJEMDFcIixcbiAgICAgIFwiUmFwcG9ydC1Kb2JhdmEgU3lzdGVtXCIsXG4gICAgICBcInJuYnFrYjFyL3BwcDFwcHBwLzVuMi8zcDQvM1AxQjIvMk41L1BQUDFQUFBQL1IyUUtCTlIgYiBLUWtxIC0gMyAzXCIsXG4gICAgICBcIkxvbmRvbl9TeXN0ZW1cIixcbiAgICAgIFtcImQ0IGQ1XCIsIFwiTmMzIE5mNlwiLCBcIkJmNFwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkQwM1wiLFxuICAgICAgXCJUb3JyZSBBdHRhY2tcIixcbiAgICAgIFwicm5icWtiMXIvcHBwMXBwcHAvNW4yLzNwMkIxLzNQNC81TjIvUFBQMVBQUFAvUk4xUUtCMVIgYiBLUWtxIC0gMyAzXCIsXG4gICAgICBcIlRvcnJlX0F0dGFja1wiLFxuICAgICAgW1wiZDQgZDVcIiwgXCJOZjMgTmY2XCIsIFwiQmc1XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiRDAxXCIsXG4gICAgICBcIlJpY2h0ZXItVmVyZXNvdiBBdHRhY2tcIixcbiAgICAgIFwicm5icWtiMXIvcHBwMXBwcHAvNW4yLzNwMkIxLzNQNC8yTjUvUFBQMVBQUFAvUjJRS0JOUiBiIEtRa3EgLSAzIDNcIixcbiAgICAgIFwiUmljaHRlci1WZXJlc292X0F0dGFja1wiLFxuICAgICAgW1wiZDQgZDVcIiwgXCJOYzMgTmY2XCIsIFwiQmc1XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQTUyXCIsXG4gICAgICBcIkJ1ZGFwZXN0IERlZmVuY2VcIixcbiAgICAgIFwicm5icWtiMXIvcHBwcDFwcHAvNW4yLzRwMy8yUFA0LzgvUFAyUFBQUC9STkJRS0JOUiB3IEtRa3EgLSAwIDNcIixcbiAgICAgIFwiQnVkYXBlc3RfR2FtYml0XCIsXG4gICAgICBbXCJkNCBOZjZcIiwgXCJjNCBlNVwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkQwMFwiLFxuICAgICAgXCJDbG9zZWQgR2FtZVwiLFxuICAgICAgXCJybmJxa2Juci9wcHAxcHBwcC84LzNwNC8zUDQvOC9QUFAxUFBQUC9STkJRS0JOUiB3IEtRa3EgLSAwIDJcIixcbiAgICAgIFwiQ2xvc2VkX0dhbWVcIixcbiAgICAgIFtcImQ0IGQ1XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQTQ1XCIsXG4gICAgICBcIlRyb21wb3dza3kgQXR0YWNrXCIsXG4gICAgICBcInJuYnFrYjFyL3BwcHBwcHBwLzVuMi82QjEvM1A0LzgvUFBQMVBQUFAvUk4xUUtCTlIgYiBLUWtxIC0gMiAyXCIsXG4gICAgICBcIlRyb21wb3dza3lfQXR0YWNrXCIsXG4gICAgICBbXCJkNCBOZjZcIiwgXCJCZzVcIl1cbiAgICApLFxuICBdKSxcbiAgbmV3IENhdGVnb3J5KFwiTmYzXCIsIFtcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQTA0XCIsXG4gICAgICBcIlp1a2VydG9ydCBPcGVuaW5nXCIsXG4gICAgICBcInJuYnFrYm5yL3BwcHBwcHBwLzgvOC84LzVOMi9QUFBQUFBQUC9STkJRS0IxUiBiIEtRa3EgLSAxIDFcIixcbiAgICAgIFwiWnVrZXJ0b3J0X09wZW5pbmdcIixcbiAgICAgIFtcIk5mM1wiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkEwN1wiLFxuICAgICAgXCJLaW5nJ3MgSW5kaWFuIEF0dGFja1wiLFxuICAgICAgXCJybmJxa2Juci9wcHAxcHBwcC84LzNwNC84LzVOUDEvUFBQUFBQMVAvUk5CUUtCMVIgYiBLUWtxIC0gMCAyXCIsXG4gICAgICBcIktpbmcnc19JbmRpYW5fQXR0YWNrXCIsXG4gICAgICBbXCJOZjMgZDVcIiwgXCJnM1wiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkEwOVwiLFxuICAgICAgXCJSw6l0aSBPcGVuaW5nXCIsXG4gICAgICBcInJuYnFrYm5yL3BwcDFwcHBwLzgvM3A0LzJQNS81TjIvUFAxUFBQUFAvUk5CUUtCMVIgYiBLUWtxIC0gMCAyXCIsXG4gICAgICBcIlLDqXRpX09wZW5pbmdcIixcbiAgICAgIFtcIk5mMyBkNVwiLCBcImM0XCJdXG4gICAgKSxcbiAgXSksXG4gIG5ldyBDYXRlZ29yeShcImM0XCIsIFtcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQTEwXCIsXG4gICAgICBcIkVuZ2xpc2ggT3BlbmluZ1wiLFxuICAgICAgXCJybmJxa2Juci9wcHBwcHBwcC84LzgvMlA1LzgvUFAxUFBQUFAvUk5CUUtCTlIgYiBLUWtxIC0gMCAxXCIsXG4gICAgICBcIkVuZ2xpc2hfT3BlbmluZ1wiLFxuICAgICAgW1wiYzRcIl1cbiAgICApLFxuICAgIG5ldyBTdGFydGluZ1Bvc2l0aW9uKFxuICAgICAgXCJBMjBcIixcbiAgICAgIFwiRW5nbGlzaCBPcGVuaW5nOiBSZXZlcnNlZCBTaWNpbGlhblwiLFxuICAgICAgXCJybmJxa2Juci9wcHBwMXBwcC84LzRwMy8yUDUvOC9QUDFQUFBQUC9STkJRS0JOUiB3IEtRa3EgLSAwIDJcIixcbiAgICAgIFwiRW5nbGlzaF9PcGVuaW5nXCIsXG4gICAgICBbXCJjNCBlNVwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkEzMFwiLFxuICAgICAgXCJFbmdsaXNoIE9wZW5pbmc6IFN5bW1ldHJpY2FsIFZhcmlhdGlvblwiLFxuICAgICAgXCJybmJxa2Juci9wcDFwcHBwcC84LzJwNS8yUDUvOC9QUDFQUFBQUC9STkJRS0JOUiB3IEtRa3EgLSAwIDJcIixcbiAgICAgIFwiRW5nbGlzaF9PcGVuaW5nXCIsXG4gICAgICBbXCJjNCBjNVwiXVxuICAgICksXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkEyNlwiLFxuICAgICAgXCJFbmdsaXNoIE9wZW5pbmc6IENsb3NlZCBTeXN0ZW1cIixcbiAgICAgIFwicjFicWsxbnIvcHBwMnBicC8ybnAycDEvNHAzLzJQNS8yTlAyUDEvUFAyUFBCUC9SMUJRSzFOUiB3IEtRa3EgLSAwIDZcIixcbiAgICAgIFwiRW5nbGlzaF9PcGVuaW5nXCIsXG4gICAgICBbXCJjNCBlNVwiLCBcIk5jMyBOYzZcIiwgXCJnMyBnNlwiLCBcIkJnMiBCZzdcIiwgXCJkMyBkNlwiXVxuICAgICksXG4gIF0pLFxuICBuZXcgQ2F0ZWdvcnkoXCJiM1wiLCBbXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkEwMVwiLFxuICAgICAgXCJOaW16by1MYXJzZW4gQXR0YWNrXCIsXG4gICAgICBcInJuYnFrYm5yL3BwcHBwcHBwLzgvOC84LzFQNi9QMVBQUFBQUC9STkJRS0JOUiBiIEtRa3EgLSAwIDFcIixcbiAgICAgIFwiTGFyc2VuJ3NfT3BlbmluZ1wiLFxuICAgICAgW1wiYjNcIl1cbiAgICApLFxuICBdKSxcbiAgbmV3IENhdGVnb3J5KFwiYjRcIiwgW1xuICAgIG5ldyBTdGFydGluZ1Bvc2l0aW9uKFxuICAgICAgXCJBMDBcIixcbiAgICAgIFwiU29rb2xza3kgT3BlbmluZ1wiLFxuICAgICAgXCJybmJxa2Juci9wcHBwcHBwcC84LzgvMVA2LzgvUDFQUFBQUFAvUk5CUUtCTlIgYiBLUWtxIC0gMCAxXCIsXG4gICAgICBcIlNva29sc2t5X09wZW5pbmdcIixcbiAgICAgIFtcImI0XCJdXG4gICAgKSxcbiAgXSksXG4gIG5ldyBDYXRlZ29yeShcImY0XCIsIFtcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQTAyXCIsXG4gICAgICBcIkJpcmQncyBPcGVuaW5nXCIsXG4gICAgICBcInJuYnFrYm5yL3BwcHBwcHBwLzgvOC81UDIvOC9QUFBQUDFQUC9STkJRS0JOUiBiIEtRa3EgLSAwIDFcIixcbiAgICAgIFwiQmlyZCdzX09wZW5pbmdcIixcbiAgICAgIFtcImY0XCJdXG4gICAgKSxcbiAgICBuZXcgU3RhcnRpbmdQb3NpdGlvbihcbiAgICAgIFwiQTAyXCIsXG4gICAgICBcIkJpcmQncyBPcGVuaW5nOiBEdXRjaCBWYXJpYXRpb25cIixcbiAgICAgIFwicm5icWtibnIvcHBwMXBwcHAvOC8zcDQvNVAyLzgvUFBQUFAxUFAvUk5CUUtCTlIgdyBLUWtxIC0gMCAyXCIsXG4gICAgICBcIkJpcmQnc19PcGVuaW5nXCIsXG4gICAgICBbXCJmNCBkNVwiXVxuICAgICksXG4gIF0pLFxuICBuZXcgQ2F0ZWdvcnkoXCJnM1wiLCBbXG4gICAgbmV3IFN0YXJ0aW5nUG9zaXRpb24oXG4gICAgICBcIkEwMFwiLFxuICAgICAgXCJIdW5nYXJpYW4gT3BlbmluZ1wiLFxuICAgICAgXCJybmJxa2Juci9wcHBwcHBwcC84LzgvOC82UDEvUFBQUFBQMVAvUk5CUUtCTlIgYiBLUWtxIC0gMCAxXCIsXG4gICAgICBcIktpbmcnc19GaWFuY2hldHRvX09wZW5pbmdcIixcbiAgICAgIFtcImczXCJdXG4gICAgKSxcbiAgXSksXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBjYXRlZ29yaWVzO1xuIiwiaW1wb3J0IHsgc2V0SWNvbiwgU2V0dGluZyB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgQ2hlc3NlciB9IGZyb20gXCIuL0NoZXNzZXJcIjtcbmltcG9ydCBzdGFydGluZ1Bvc2l0b25zIGZyb20gXCIuL3N0YXJ0aW5nUG9zaXRpb25zXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoZXNzZXJNZW51IHtcbiAgcHJpdmF0ZSBjaGVzc2VyOiBDaGVzc2VyO1xuICBwcml2YXRlIGNvbnRhaW5lckVsOiBIVE1MRWxlbWVudDtcblxuICBwcml2YXRlIG1vdmVzTGlzdEVsOiBIVE1MRWxlbWVudDtcblxuICBjb25zdHJ1Y3RvcihwYXJlbnRFbDogSFRNTEVsZW1lbnQsIGNoZXNzZXI6IENoZXNzZXIpIHtcbiAgICB0aGlzLmNoZXNzZXIgPSBjaGVzc2VyO1xuXG4gICAgdGhpcy5jb250YWluZXJFbCA9IHBhcmVudEVsLmNyZWF0ZURpdihcImNoZXNzLW1lbnUtY29udGFpbmVyXCIsIChjb250YWluZXJFbCkgPT4ge1xuICAgICAgY29udGFpbmVyRWwuY3JlYXRlRGl2KHsgY2xzOiBcImNoZXNzLW1lbnUtc2VjdGlvblwiIH0sIChzZWN0aW9uRWwpID0+IHtcbiAgICAgICAgY29uc3Qgc2VsZWN0RWwgPSBzZWN0aW9uRWwuY3JlYXRlRWwoXG4gICAgICAgICAgXCJzZWxlY3RcIixcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbHM6IFwiZHJvcGRvd24gY2hlc3Mtc3RhcnRpbmctcG9zaXRpb24tZHJvcGRvd25cIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIChlbCkgPT4ge1xuICAgICAgICAgICAgZWwuY3JlYXRlRWwoXCJvcHRpb25cIiwge1xuICAgICAgICAgICAgICB2YWx1ZTogXCJzdGFydGluZy1wb3NpdGlvblwiLFxuICAgICAgICAgICAgICB0ZXh0OiBcIlN0YXJ0aW5nIFBvc2l0aW9uXCIsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGVsLmNyZWF0ZUVsKFwib3B0aW9uXCIsIHtcbiAgICAgICAgICAgICAgdmFsdWU6IFwiY3VzdG9tXCIsXG4gICAgICAgICAgICAgIHRleHQ6IFwiQ3VzdG9tXCIsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGVsLmNyZWF0ZUVsKFwib3B0Z3JvdXBcIiwge30sIChvcHRncm91cCkgPT4ge1xuICAgICAgICAgICAgICBvcHRncm91cC5sYWJlbCA9IFwiUG9wdWxhciBPcGVuaW5nc1wiO1xuICAgICAgICAgICAgICBzdGFydGluZ1Bvc2l0b25zLmZvckVhY2goKGNhdGVnb3J5KSA9PiB7XG4gICAgICAgICAgICAgICAgY2F0ZWdvcnkuaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgb3B0Z3JvdXAuY3JlYXRlRWwoXCJvcHRpb25cIiwge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogaXRlbS5lY28sXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGl0ZW0ubmFtZSxcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBzdGFydGluZ1Bvc2l0aW9uID0gdGhpcy5nZXRTdGFydGluZ1Bvc2l0aW9uRnJvbUZlbihjaGVzc2VyLmdldEZlbigpKTtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0aW5nUG9zaXRpb25OYW1lID0gc3RhcnRpbmdQb3NpdGlvblxuICAgICAgICAgICAgICA/IHN0YXJ0aW5nUG9zaXRpb24uZWNvXG4gICAgICAgICAgICAgIDogXCJjdXN0b21cIjtcbiAgICAgICAgICAgIGVsLnZhbHVlID0gc3RhcnRpbmdQb3NpdGlvbk5hbWU7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIHNlbGVjdEVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGV2KSA9PiB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSAoZXYudGFyZ2V0IGFzIGFueSkudmFsdWU7XG5cbiAgICAgICAgICBpZiAodmFsdWUgPT09IFwic3RhcnRpbmctcG9zaXRpb25cIikge1xuICAgICAgICAgICAgdGhpcy5jaGVzc2VyLmxvYWRGZW4oXG4gICAgICAgICAgICAgIFwicm5icWtibnIvcHBwcHBwcHAvOC84LzgvOC9QUFBQUFBQUC9STkJRS0JOUiB3IEtRa3EgLSAwIDFcIixcbiAgICAgICAgICAgICAgW11cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3Qgc3RhcnRpbmdQb3NpdGlvbiA9IHN0YXJ0aW5nUG9zaXRvbnNcbiAgICAgICAgICAgIC5mbGF0TWFwKChjYXQpID0+IGNhdC5pdGVtcylcbiAgICAgICAgICAgIC5maW5kKChpdGVtKSA9PiBpdGVtLmVjbyA9PT0gdmFsdWUpO1xuXG4gICAgICAgICAgdGhpcy5jaGVzc2VyLmxvYWRGZW4oc3RhcnRpbmdQb3NpdGlvbi5mZW4sIHN0YXJ0aW5nUG9zaXRpb24ubW92ZXMpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBuZXcgU2V0dGluZyhzZWN0aW9uRWwpLnNldE5hbWUoXCJFbmFibGUgRnJlZSBNb3ZlP1wiKS5hZGRUb2dnbGUoKHRvZ2dsZSkgPT4ge1xuICAgICAgICAvLyAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLmNoZXNzZXIuZ2V0Qm9hcmRTdGF0ZSgpLm1vdmFibGUuZnJlZSk7XG4gICAgICAgIC8vICAgdG9nZ2xlLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAvLyAgICAgdGhpcy5jaGVzc2VyLnNldEZyZWVNb3ZlKHZhbHVlKTtcbiAgICAgICAgLy8gICB9KTtcbiAgICAgICAgLy8gfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMubW92ZXNMaXN0RWwgPSB0aGlzLmNvbnRhaW5lckVsLmNyZWF0ZURpdih7XG4gICAgICBjbHM6IFwiY2hlc3MtbWVudS1zZWN0aW9uIGNoZXNzLW1lbnUtc2VjdGlvbi10YWxsXCIsXG4gICAgfSk7XG5cbiAgICB0aGlzLnJlZHJhd01vdmVMaXN0KCk7XG4gICAgdGhpcy5jcmVhdGVUb29sYmFyKCk7XG4gIH1cblxuICBnZXRTdGFydGluZ1Bvc2l0aW9uRnJvbUZlbihmZW46IHN0cmluZykge1xuICAgIHJldHVybiBzdGFydGluZ1Bvc2l0b25zLmZsYXRNYXAoKGNhdCkgPT4gY2F0Lml0ZW1zKS5maW5kKChpdGVtKSA9PiBpdGVtLmVjbyA9PT0gZmVuKTtcbiAgfVxuXG4gIGNyZWF0ZVRvb2xiYXIoKSB7XG4gICAgY29uc3QgYnRuQ29udGFpbmVyID0gdGhpcy5jb250YWluZXJFbC5jcmVhdGVEaXYoXCJjaGVzcy10b29sYmFyLWNvbnRhaW5lclwiKTtcbiAgICBidG5Db250YWluZXIuY3JlYXRlRWwoXCJhXCIsIFwidmlldy1hY3Rpb25cIiwgKGJ0bjogSFRNTEFuY2hvckVsZW1lbnQpID0+IHtcbiAgICAgIGJ0bi5hcmlhTGFiZWwgPSBcIkZsaXAgYm9hcmRcIjtcbiAgICAgIHNldEljb24oYnRuLCBcInN3aXRjaFwiKTtcbiAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLmNoZXNzZXIuZmxpcEJvYXJkKCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGJ0bkNvbnRhaW5lci5jcmVhdGVFbChcImFcIiwgXCJ2aWV3LWFjdGlvblwiLCAoYnRuOiBIVE1MQW5jaG9yRWxlbWVudCkgPT4ge1xuICAgICAgYnRuLmFyaWFMYWJlbCA9IFwiUmVzZXRcIjtcbiAgICAgIHNldEljb24oYnRuLCBcInJlc3RvcmUtZmlsZS1nbHlwaFwiKTtcbiAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB3aGlsZSAodGhpcy5jaGVzc2VyLmN1cnJlbnRNb3ZlSWR4ID49IDApIHtcbiAgICAgICAgICB0aGlzLmNoZXNzZXIudW5kb19tb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgYnRuQ29udGFpbmVyLmNyZWF0ZUVsKFwiYVwiLCBcInZpZXctYWN0aW9uXCIsIChidG46IEhUTUxBbmNob3JFbGVtZW50KSA9PiB7XG4gICAgICBidG4uYXJpYUxhYmVsID0gXCJVbmRvXCI7XG4gICAgICBzZXRJY29uKGJ0biwgXCJsZWZ0LWFycm93XCIpO1xuICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuY2hlc3Nlci51bmRvX21vdmUoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgYnRuQ29udGFpbmVyLmNyZWF0ZUVsKFwiYVwiLCBcInZpZXctYWN0aW9uXCIsIChidG46IEhUTUxBbmNob3JFbGVtZW50KSA9PiB7XG4gICAgICBidG4uYXJpYUxhYmVsID0gXCJSZWRvXCI7XG4gICAgICBzZXRJY29uKGJ0biwgXCJyaWdodC1hcnJvd1wiKTtcbiAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLmNoZXNzZXIucmVkb19tb3ZlKCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGJ0bkNvbnRhaW5lci5jcmVhdGVFbChcImFcIiwgXCJ2aWV3LWFjdGlvblwiLCAoYnRuOiBIVE1MQW5jaG9yRWxlbWVudCkgPT4ge1xuICAgICAgYnRuLmFyaWFMYWJlbCA9IFwiQ29weSBGRU5cIjtcbiAgICAgIHNldEljb24oYnRuLCBcInR3by1ibGFuay1wYWdlc1wiKTtcbiAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dCh0aGlzLmNoZXNzZXIuZ2V0RmVuKCkpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICByZWRyYXdNb3ZlTGlzdCgpIHtcbiAgICB0aGlzLm1vdmVzTGlzdEVsLmVtcHR5KCk7XG4gICAgdGhpcy5tb3Zlc0xpc3RFbC5jcmVhdGVEaXYoe1xuICAgICAgdGV4dDogdGhpcy5jaGVzc2VyLnR1cm4oKSA9PT0gXCJiXCIgPyBcIkJsYWNrJ3MgdHVyblwiIDogXCJXaGl0ZSdzIHR1cm5cIixcbiAgICAgIGNsczogXCJjaGVzcy10dXJuLXRleHRcIixcbiAgICB9KTtcbiAgICB0aGlzLm1vdmVzTGlzdEVsLmNyZWF0ZURpdihcImNoZXNzLW1vdmUtbGlzdFwiLCAobW92ZUxpc3RFbCkgPT4ge1xuICAgICAgdGhpcy5jaGVzc2VyLmhpc3RvcnkoKS5mb3JFYWNoKChtb3ZlLCBpZHgpID0+IHtcbiAgICAgICAgY29uc3QgbW92ZUVsID0gbW92ZUxpc3RFbC5jcmVhdGVEaXYoe1xuICAgICAgICAgIGNsczogYGNoZXNzLW1vdmUgJHtcbiAgICAgICAgICAgIHRoaXMuY2hlc3Nlci5jdXJyZW50TW92ZUlkeCA9PT0gaWR4ID8gXCJjaGVzcy1tb3ZlLWFjdGl2ZVwiIDogXCJcIlxuICAgICAgICAgIH1gLFxuICAgICAgICAgIHRleHQ6IG1vdmUuc2FuLFxuICAgICAgICB9KTtcbiAgICAgICAgbW92ZUVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXYpID0+IHtcbiAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMuY2hlc3Nlci51cGRhdGVfdHVybl9pZHgoaWR4KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGVidWcoZGVidWdGbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICBpZiAocHJvY2Vzcy5lbnYuREVCVUcpIHtcbiAgICBkZWJ1Z0ZuKCk7XG4gIH1cbn1cbiIsImltcG9ydCB7RmlsZVN5c3RlbUFkYXB0ZXJ9IGZyb20gXCJvYnNpZGlhblwiXG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgeyBuYW5vaWQgfSBmcm9tIFwibmFub2lkXCI7XG5pbXBvcnQge1xuICBBcHAsXG4gIEVkaXRvclBvc2l0aW9uLFxuICBNYXJrZG93blBvc3RQcm9jZXNzb3JDb250ZXh0LFxuICBNYXJrZG93blJlbmRlckNoaWxkLFxuICBNYXJrZG93blZpZXcsXG4gIE5vdGljZSxcbiAgcGFyc2VZYW1sLFxuICBzdHJpbmdpZnlZYW1sLFxufSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IENoZXNzLCBDaGVzc0luc3RhbmNlLCBNb3ZlLCBTcXVhcmUgfSBmcm9tIFwiY2hlc3MuanNcIjtcbmltcG9ydCB7IENoZXNzZ3JvdW5kIH0gZnJvbSBcImNoZXNzZ3JvdW5kXCI7XG5pbXBvcnQgeyBBcGkgfSBmcm9tIFwiY2hlc3Nncm91bmQvYXBpXCI7XG5pbXBvcnQgeyBDb2xvciwgS2V5IH0gZnJvbSBcImNoZXNzZ3JvdW5kL3R5cGVzXCI7XG5pbXBvcnQgeyBEcmF3U2hhcGUgfSBmcm9tIFwiY2hlc3Nncm91bmQvZHJhd1wiO1xuXG5pbXBvcnQgeyBDaGVzc2VyQ29uZmlnLCBwYXJzZV91c2VyX2NvbmZpZyB9IGZyb20gXCIuL0NoZXNzZXJDb25maWdcIjtcbmltcG9ydCB7IENoZXNzZXJTZXR0aW5ncyB9IGZyb20gXCIuL0NoZXNzZXJTZXR0aW5nc1wiO1xuaW1wb3J0IENoZXNzZXJNZW51IGZyb20gXCIuL21lbnVcIjtcblxuLy8gVG8gYnVuZGxlIGFsbCBjc3MgZmlsZXMgaW4gc3R5bGVzLmNzcyB3aXRoIHJvbGx1cFxuaW1wb3J0IFwiLi4vYXNzZXRzL2N1c3RvbS5jc3NcIjtcbmltcG9ydCBcImNoZXNzZ3JvdW5kL2Fzc2V0cy9jaGVzc2dyb3VuZC5iYXNlLmNzc1wiO1xuaW1wb3J0IFwiY2hlc3Nncm91bmQvYXNzZXRzL2NoZXNzZ3JvdW5kLmJyb3duLmNzc1wiO1xuLy8gUGllY2Ugc3R5bGVzXG5pbXBvcnQgXCIuLi9hc3NldHMvcGllY2UtY3NzL2FscGhhLmNzc1wiO1xuaW1wb3J0IFwiLi4vYXNzZXRzL3BpZWNlLWNzcy9jYWxpZm9ybmlhLmNzc1wiO1xuaW1wb3J0IFwiLi4vYXNzZXRzL3BpZWNlLWNzcy9jYXJkaW5hbC5jc3NcIjtcbmltcG9ydCBcIi4uL2Fzc2V0cy9waWVjZS1jc3MvY2J1cm5ldHQuY3NzXCI7XG5pbXBvcnQgXCIuLi9hc3NldHMvcGllY2UtY3NzL2NoZXNzNy5jc3NcIjtcbmltcG9ydCBcIi4uL2Fzc2V0cy9waWVjZS1jc3MvY2hlc3NudXQuY3NzXCI7XG5pbXBvcnQgXCIuLi9hc3NldHMvcGllY2UtY3NzL2NvbXBhbmlvbi5jc3NcIjtcbmltcG9ydCBcIi4uL2Fzc2V0cy9waWVjZS1jc3MvZHVicm92bnkuY3NzXCI7XG5pbXBvcnQgXCIuLi9hc3NldHMvcGllY2UtY3NzL2ZhbnRhc3kuY3NzXCI7XG5pbXBvcnQgXCIuLi9hc3NldHMvcGllY2UtY3NzL2ZyZXNjYS5jc3NcIjtcbmltcG9ydCBcIi4uL2Fzc2V0cy9waWVjZS1jc3MvZ2lvY28uY3NzXCI7XG5pbXBvcnQgXCIuLi9hc3NldHMvcGllY2UtY3NzL2dvdmVybm9yLmNzc1wiO1xuaW1wb3J0IFwiLi4vYXNzZXRzL3BpZWNlLWNzcy9ob3JzZXkuY3NzXCI7XG5pbXBvcnQgXCIuLi9hc3NldHMvcGllY2UtY3NzL2ljcGllY2VzLmNzc1wiO1xuaW1wb3J0IFwiLi4vYXNzZXRzL3BpZWNlLWNzcy9rb3NhbC5jc3NcIjtcbmltcG9ydCBcIi4uL2Fzc2V0cy9waWVjZS1jc3MvbGVpcHppZy5jc3NcIjtcbmltcG9ydCBcIi4uL2Fzc2V0cy9waWVjZS1jc3MvbGV0dGVyLmNzc1wiO1xuaW1wb3J0IFwiLi4vYXNzZXRzL3BpZWNlLWNzcy9saWJyYS5jc3NcIjtcbmltcG9ydCBcIi4uL2Fzc2V0cy9waWVjZS1jc3MvbWFlc3Ryby5jc3NcIjtcbmltcG9ydCBcIi4uL2Fzc2V0cy9waWVjZS1jc3MvbWVyaWRhLmNzc1wiO1xuaW1wb3J0IFwiLi4vYXNzZXRzL3BpZWNlLWNzcy9waXJvdWV0dGkuY3NzXCI7XG5pbXBvcnQgXCIuLi9hc3NldHMvcGllY2UtY3NzL3BpeGVsLmNzc1wiO1xuaW1wb3J0IFwiLi4vYXNzZXRzL3BpZWNlLWNzcy9yZWlsbHljcmFpZy5jc3NcIjtcbmltcG9ydCBcIi4uL2Fzc2V0cy9waWVjZS1jc3MvcmlvaGFjaGEuY3NzXCI7XG5pbXBvcnQgXCIuLi9hc3NldHMvcGllY2UtY3NzL3NoYXBlcy5jc3NcIjtcbmltcG9ydCBcIi4uL2Fzc2V0cy9waWVjZS1jc3Mvc3BhdGlhbC5jc3NcIjtcbmltcG9ydCBcIi4uL2Fzc2V0cy9waWVjZS1jc3Mvc3RhdW50eS5jc3NcIjtcbmltcG9ydCBcIi4uL2Fzc2V0cy9waWVjZS1jc3MvdGF0aWFuYS5jc3NcIjtcbi8vIEJvYXJkIHN0eWxlc1xuaW1wb3J0IFwiLi4vYXNzZXRzL2JvYXJkLWNzcy9icm93bi5jc3NcIjtcbmltcG9ydCBcIi4uL2Fzc2V0cy9ib2FyZC1jc3MvYmx1ZS5jc3NcIjtcbmltcG9ydCBcIi4uL2Fzc2V0cy9ib2FyZC1jc3MvZ3JlZW4uY3NzXCI7XG5pbXBvcnQgXCIuLi9hc3NldHMvYm9hcmQtY3NzL3B1cnBsZS5jc3NcIjtcbmltcG9ydCBcIi4uL2Fzc2V0cy9ib2FyZC1jc3MvaWMuY3NzXCI7XG5pbXBvcnQgZGVidWcgZnJvbSBcIi4vZGVidWdcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdfY2hlc3Nib2FyZChhcHA6IEFwcCwgc2V0dGluZ3M6IENoZXNzZXJTZXR0aW5ncykge1xuICByZXR1cm4gKHNvdXJjZTogc3RyaW5nLCBlbDogSFRNTEVsZW1lbnQsIGN0eDogTWFya2Rvd25Qb3N0UHJvY2Vzc29yQ29udGV4dCkgPT4ge1xuICAgIGxldCB1c2VyX2NvbmZpZyA9IHBhcnNlX3VzZXJfY29uZmlnKHNldHRpbmdzLCBzb3VyY2UpO1xuICAgIGN0eC5hZGRDaGlsZChuZXcgQ2hlc3NlcihlbCwgY3R4LCB1c2VyX2NvbmZpZywgYXBwKSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHJlYWRfc3RhdGUoaWQ6IHN0cmluZywgcHRoOiBzdHJpbmcpIHtcbiAgLy9jb25zdCBzYXZlZERhdGFTdHIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShgY2hlc3Nlci0ke2lkfWApO1xuICBjb25zdCBmaWxlUGF0aCA9IGAke3B0aH1cXFxcLm9ic2lkaWFuXFxcXHBsdWdpbnNcXFxcY2hlc3Nlci1vYnNpZGlhblxcXFxnYW1lc1xcXFxjaGVzc2VyLSR7aWR9Lmpzb25gO1xuICB2YXIgZ2FtZURpciA9IHB0aCtgXFxcXC5vYnNpZGlhblxcXFxwbHVnaW5zXFxcXGNoZXNzZXItb2JzaWRpYW5cXFxcZ2FtZXNgO1xuICB0cnkge1xuICAgIGNvbnN0IHNhdmVkRGF0YVN0ciA9IGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCwgJ3V0Zi04Jyk7XG4gICAgcmV0dXJuIEpTT04ucGFyc2Uoc2F2ZWREYXRhU3RyKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG5cbiAgICB0cnl7XG5cbiAgICAgIGlmICghZnMuZXhpc3RzU3luYyhnYW1lRGlyKSl7XG4gICAgICAgIGZzLm1rZGlyU3luYyhnYW1lRGlyLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcbiAgICAgIH1cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoZmlsZVBhdGgsIEpTT04uc3RyaW5naWZ5KHtcImN1cnJlbnRNb3ZlSWR4XCI6LTEsXCJtb3Zlc1wiOltdLFwicGduXCI6XCJcIixcImN1cnJlbnRPcmllbnRhdGlvblwiOlwid2hpdGVcIn0pKTtcblxuICAgIH0gY2F0Y2goZXJyMil7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciByZWFkaW5nIGZpbGUnLCBlcnIyKTtcbiAgICAgIHJldHVybiB7fTsgLy8gUmV0dXJuIGFuIGVtcHR5IG9iamVjdCBvciBoYW5kbGUgZXJyb3IgYXMgbmVlZGVkXG4gICAgfVxuICB9XG5cbn1cblxuZnVuY3Rpb24gd3JpdGVfc3RhdGUoaWQ6IHN0cmluZywgcHRoOiBzdHJpbmcsZ2FtZV9zdGF0ZTogQ2hlc3NlckNvbmZpZykge1xuLy8gICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShgY2hlc3Nlci0ke2lkfWAsIEpTT04uc3RyaW5naWZ5KGdhbWVfc3RhdGUpKTtcbiAgdmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcbiAgdmFyIGZpbGVQYXRoID0gcHRoK2BcXFxcLm9ic2lkaWFuXFxcXHBsdWdpbnNcXFxcY2hlc3Nlci1vYnNpZGlhblxcXFxnYW1lc1xcXFxjaGVzc2VyLSR7aWR9Lmpzb25gO1xuICB2YXIgZ2FtZURpciA9IHB0aCtgXFxcXC5vYnNpZGlhblxcXFxwbHVnaW5zXFxcXGNoZXNzZXItb2JzaWRpYW5cXFxcZ2FtZXNgO1xuXG4gIHRyeSB7XG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKGdhbWVEaXIpKSB7XG4gICAgICBmcy5ta2RpclN5bmMoZ2FtZURpciwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG4gICAgfVxuICAgIGZzLndyaXRlRmlsZVN5bmMoZmlsZVBhdGgsIEpTT04uc3RyaW5naWZ5KGdhbWVfc3RhdGUpKTtcbiAgICAvL2NvbnNvbGUubG9nKGBEYXRhIHdyaXR0ZW4gdG8gZmlsZSBzdWNjZXNzZnVsbHkgdG8gJHtmaWxlUGF0aH1gKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5sb2coJ0Vycm9yIHdyaXRpbmcgZmlsZScpO1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ2hlc3NlciBleHRlbmRzIE1hcmtkb3duUmVuZGVyQ2hpbGQge1xuICBwcml2YXRlIGN0eDogTWFya2Rvd25Qb3N0UHJvY2Vzc29yQ29udGV4dDtcbiAgcHJpdmF0ZSBhcHA6IEFwcDtcblxuICBwcml2YXRlIGlkOiBzdHJpbmc7XG4gIHByaXZhdGUgY2c6IEFwaTtcbiAgcHJpdmF0ZSBjaGVzczogQ2hlc3NJbnN0YW5jZTtcblxuICBwcml2YXRlIG1lbnU6IENoZXNzZXJNZW51O1xuICBwcml2YXRlIG1vdmVzOiBNb3ZlW107XG4gIHByaXZhdGUgYmFzZVBhdGg6IHN0cmluZztcblxuICBwdWJsaWMgY3VycmVudE1vdmVJZHg6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBjb250YWluZXJFbDogSFRNTEVsZW1lbnQsXG4gICAgY3R4OiBNYXJrZG93blBvc3RQcm9jZXNzb3JDb250ZXh0LFxuICAgIHVzZXJfY29uZmlnOiBDaGVzc2VyQ29uZmlnLFxuICAgIGFwcDogQXBwLFxuICApIHtcbiAgICBzdXBlcihjb250YWluZXJFbCk7XG5cbiAgICB0aGlzLmFwcCA9IGFwcDtcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICB0aGlzLmlkID0gdXNlcl9jb25maWcuaWQgPz8gbmFub2lkKDgpO1xuICAgIHRoaXMuY2hlc3MgPSBuZXcgQ2hlc3MoKTtcblxuICAgIGxldCBiYXNlUGF0aCA9ICh0aGlzLmFwcC52YXVsdC5hZGFwdGVyIGFzIGFueSkuYmFzZVBhdGhcbiAgICB0aGlzLmJhc2VQYXRoID0gYmFzZVBhdGg7XG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLmJhc2VQYXRoKTtcblxuICAgIGNvbnN0IHNhdmVkX2NvbmZpZyA9IHJlYWRfc3RhdGUodGhpcy5pZCwgdGhpcy5iYXNlUGF0aCk7XG4gICAgY29uc3QgY29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgdXNlcl9jb25maWcsIHNhdmVkX2NvbmZpZyk7XG5cbiAgICB0aGlzLnN5bmNfYm9hcmRfd2l0aF9nYW1lc3RhdGUgPSB0aGlzLnN5bmNfYm9hcmRfd2l0aF9nYW1lc3RhdGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnNhdmVfbW92ZSA9IHRoaXMuc2F2ZV9tb3ZlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zYXZlX3NoYXBlcyA9IHRoaXMuc2F2ZV9zaGFwZXMuYmluZCh0aGlzKTtcblxuICAgIC8vIFNhdmUgYGlkYCBpbnRvIHRoZSBjb2RlYmxvY2sgeWFtbFxuICAgIGlmICh1c2VyX2NvbmZpZy5pZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmFwcC53b3Jrc3BhY2Uub25MYXlvdXRSZWFkeSgoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5zZXRJbW1lZGlhdGUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMud3JpdGVfY29uZmlnKHsgaWQ6IHRoaXMuaWQgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5wZ24pIHtcbiAgICAgIGRlYnVnKCgpID0+IGNvbnNvbGUuZGVidWcoXCJsb2FkaW5nIGZyb20gcGduXCIsIGNvbmZpZy5wZ24pKTtcbiAgICAgIHRoaXMuY2hlc3MubG9hZF9wZ24oY29uZmlnLnBnbik7XG4gICAgfSBlbHNlIGlmIChjb25maWcuZmVuKSB7XG4gICAgICBkZWJ1ZygoKSA9PiBjb25zb2xlLmRlYnVnKFwibG9hZGluZyBmcm9tIGZlblwiLCBjb25maWcuZmVuKSk7XG4gICAgICB0aGlzLmNoZXNzLmxvYWQoY29uZmlnLmZlbik7XG4gICAgfVxuXG4gICAgdGhpcy5tb3ZlcyA9IGNvbmZpZy5tb3ZlcyA/PyB0aGlzLmNoZXNzLmhpc3RvcnkoeyB2ZXJib3NlOiB0cnVlIH0pO1xuICAgIHRoaXMuY3VycmVudE1vdmVJZHggPSBjb25maWcuY3VycmVudE1vdmVJZHggPz8gdGhpcy5tb3Zlcy5sZW5ndGggLSAxO1xuXG4gICAgbGV0IGxhc3RNb3ZlOiBbS2V5LCBLZXldID0gdW5kZWZpbmVkO1xuICAgIGlmICh0aGlzLmN1cnJlbnRNb3ZlSWR4ID49IDApIHtcbiAgICAgIGNvbnN0IG1vdmUgPSB0aGlzLm1vdmVzW3RoaXMuY3VycmVudE1vdmVJZHhdO1xuICAgICAgbGFzdE1vdmUgPSBbbW92ZS5mcm9tLCBtb3ZlLnRvXTtcbiAgICB9XG5cbiAgICAvLyBTZXR1cCBVSVxuICAgIHRoaXMuc2V0X3N0eWxlKGNvbnRhaW5lckVsLCBjb25maWcucGllY2VTdHlsZSwgY29uZmlnLmJvYXJkU3R5bGUpO1xuICAgIHRyeSB7XG4gICAgICBpZihjb25maWcuY3VycmVudE9yaWVudGF0aW9uID09IFwiXCIpe1xuICAgICAgICBjb25maWcuY3VycmVudE9yaWVudGF0aW9uID0gXCJ3aGl0ZVwiO1xuICAgICAgfVxuICAgICAgdGhpcy5jZyA9IENoZXNzZ3JvdW5kKGNvbnRhaW5lckVsLmNyZWF0ZURpdigpLCB7XG4gICAgICAgIGZlbjogdGhpcy5jaGVzcy5mZW4oKSxcbiAgICAgICAgYWRkRGltZW5zaW9uc0Nzc1ZhcnM6IHRydWUsXG4gICAgICAgIGxhc3RNb3ZlLFxuICAgICAgICBvcmllbnRhdGlvbjogY29uZmlnLmN1cnJlbnRPcmllbnRhdGlvbiBhcyBDb2xvcixcbiAgICAgICAgdmlld09ubHk6IGNvbmZpZy52aWV3T25seSxcbiAgICAgICAgZHJhd2FibGU6IHtcbiAgICAgICAgICBlbmFibGVkOiBjb25maWcuZHJhd2FibGUsXG4gICAgICAgICAgb25DaGFuZ2U6IHRoaXMuc2F2ZV9zaGFwZXMsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBuZXcgTm90aWNlKFwiQ2hlc3NlciBlcnJvcjogSW52YWxpZCBjb25maWdcIik7XG4gICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEFjdGl2YXRlcyB0aGUgY2hlc3MgbG9naWNcbiAgICB0aGlzLnNldEZyZWVNb3ZlKGNvbmZpZy5mcmVlKTtcblxuICAgIC8vIERyYXcgc2F2ZWQgc2hhcGVzXG4gICAgaWYgKGNvbmZpZy5zaGFwZXMpIHtcbiAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5vbkxheW91dFJlYWR5KCgpID0+IHtcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc3luY19ib2FyZF93aXRoX2dhbWVzdGF0ZShmYWxzZSk7XG4gICAgICAgICAgdGhpcy5jZy5zZXRTaGFwZXMoY29uZmlnLnNoYXBlcyk7XG4gICAgICAgIH0sIDEwMCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGNvbmZpZy52aWV3TWVudSl7XG4gICAgICB0aGlzLm1lbnUgPSBuZXcgQ2hlc3Nlck1lbnUoY29udGFpbmVyRWwsIHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2V0X3N0eWxlKGVsOiBIVE1MRWxlbWVudCwgcGllY2VTdHlsZTogc3RyaW5nLCBib2FyZFN0eWxlOiBzdHJpbmcpIHtcbiAgICBlbC5hZGRDbGFzc2VzKFtwaWVjZVN0eWxlLCBgJHtib2FyZFN0eWxlfS1ib2FyZGAsIFwiY2hlc3Nlci1jb250YWluZXJcIl0pO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRfc2VjdGlvbl9yYW5nZSgpOiBbRWRpdG9yUG9zaXRpb24sIEVkaXRvclBvc2l0aW9uXSB7XG4gICAgY29uc3Qgc2VjdGlvbkluZm8gPSB0aGlzLmN0eC5nZXRTZWN0aW9uSW5mbyh0aGlzLmNvbnRhaW5lckVsKTtcblxuICAgIHJldHVybiBbXG4gICAgICB7XG4gICAgICAgIGxpbmU6IHNlY3Rpb25JbmZvLmxpbmVTdGFydCArIDEsXG4gICAgICAgIGNoOiAwLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbGluZTogc2VjdGlvbkluZm8ubGluZUVuZCxcbiAgICAgICAgY2g6IDAsXG4gICAgICB9LFxuICAgIF07XG4gIH1cblxuICBwcml2YXRlIGdldF9jb25maWcodmlldzogTWFya2Rvd25WaWV3KTogQ2hlc3NlckNvbmZpZyB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgW2Zyb20sIHRvXSA9IHRoaXMuZ2V0X3NlY3Rpb25fcmFuZ2UoKTtcbiAgICBjb25zdCBjb2RlYmxvY2tUZXh0ID0gdmlldy5lZGl0b3IuZ2V0UmFuZ2UoZnJvbSwgdG8pO1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gcGFyc2VZYW1sKGNvZGVibG9ja1RleHQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGRlYnVnKCgpID0+XG4gICAgICAgIGNvbnNvbGUuZGVidWcoXCJmYWlsZWQgdG8gcGFyc2UgY29kZWJsb2NrJ3MgeWFtbCBjb25maWdcIiwgY29kZWJsb2NrVGV4dClcbiAgICAgICk7XG4gICAgICAvLyBmYWlsZWQgdG8gcGFyc2UuIHNob3cgZXJyb3IuLi5cbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHJpdmF0ZSB3cml0ZV9jb25maWcoY29uZmlnOiBQYXJ0aWFsPENoZXNzZXJDb25maWc+KSB7XG4gICAgZGVidWcoKCkgPT4gY29uc29sZS5kZWJ1ZyhcIndyaXRpbmcgY29uZmlnIHRvIGxvY2FsU3RvcmFnZVwiLCBjb25maWcpKTtcbiAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICBpZiAoIXZpZXcpIHtcbiAgICAgIG5ldyBOb3RpY2UoXCJDaGVzc2VyOiBGYWlsZWQgdG8gcmV0cmlldmUgYWN0aXZlIHZpZXdcIik7XG4gICAgICBjb25zb2xlLmVycm9yKFwiQ2hlc3NlcjogRmFpbGVkIHRvIHJldHJpZXZlIHZpZXcgd2hlbiB3cml0aW5nIGNvbmZpZ1wiKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHVwZGF0ZWQgPSBzdHJpbmdpZnlZYW1sKHtcbiAgICAgICAgLi4udGhpcy5nZXRfY29uZmlnKHZpZXcpLFxuICAgICAgICAuLi5jb25maWcsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgW2Zyb20sIHRvXSA9IHRoaXMuZ2V0X3NlY3Rpb25fcmFuZ2UoKTtcbiAgICAgIHZpZXcuZWRpdG9yLnJlcGxhY2VSYW5nZSh1cGRhdGVkLCBmcm9tLCB0byk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gZmFpbGVkIHRvIHBhcnNlLiBzaG93IGVycm9yLi4uXG4gICAgICBjb25zb2xlLmVycm9yKFwiZmFpbGVkIHRvIHdyaXRlIGNvbmZpZ1wiLCBlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNhdmVfbW92ZSgpIHtcbiAgICBjb25zdCBjb25maWcgPSByZWFkX3N0YXRlKHRoaXMuaWQsIHRoaXMuYmFzZVBhdGgpO1xuICAgIHdyaXRlX3N0YXRlKHRoaXMuaWQsIHRoaXMuYmFzZVBhdGgsIHtcbiAgICAgIC4uLmNvbmZpZyxcbiAgICAgIGN1cnJlbnRNb3ZlSWR4OiB0aGlzLmN1cnJlbnRNb3ZlSWR4LFxuICAgICAgbW92ZXM6IHRoaXMubW92ZXMsXG4gICAgICBwZ246IHRoaXMuY2hlc3MucGduKCksXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHNhdmVfc2hhcGVzKHNoYXBlczogRHJhd1NoYXBlW10pIHtcbiAgICBjb25zdCBjb25maWcgPSByZWFkX3N0YXRlKHRoaXMuaWQsIHRoaXMuYmFzZVBhdGgpO1xuICAgIHdyaXRlX3N0YXRlKHRoaXMuaWQsIHRoaXMuYmFzZVBhdGgse1xuICAgICAgLi4uY29uZmlnLFxuICAgICAgc2hhcGVzLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVfb3JpZW50YXRpb24oKSB7XG4gICAgbGV0IGRhdGEgPSBcIlwiO1xuICAgIGNvbnN0IGNvbmZpZyA9IHJlYWRfc3RhdGUodGhpcy5pZCwgdGhpcy5iYXNlUGF0aCk7XG4gICAgaWYoY29uZmlnLmN1cnJlbnRPcmllbnRhdGlvbiA9PSBcIndoaXRlXCIpe1xuICAgICAgICBkYXRhID0gXCJibGFja1wiO1xuICAgIH1lbHNlIGlmKGNvbmZpZy5jdXJyZW50T3JpZW50YXRpb24gPT0gXCJibGFja1wiKXtcbiAgICAgICAgZGF0YSA9IFwid2hpdGVcIjtcbiAgICB9ZWxzZXtcbiAgICAgIGNvbnNvbGUubG9nKFwiTm8gc2UgcHVkbyBsZWVyIGxhIG9yaWVudGFjaW9uOiBcIitKU09OLnN0cmluZ2lmeShjb25maWcpKVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvL2NvbnNvbGUubG9nKFwiT3JpZW50YWNpw7NuOiBcIitkYXRhKVxuICAgIHdyaXRlX3N0YXRlKHRoaXMuaWQsIHRoaXMuYmFzZVBhdGgse1xuICAgICAgLi4uY29uZmlnLFxuICAgICAgY3VycmVudE9yaWVudGF0aW9uOiBkYXRhLFxuICAgIH0pO1xuXG4gIH1cblxuICBwcml2YXRlIHN5bmNfYm9hcmRfd2l0aF9nYW1lc3RhdGUoc2hvdWxkU2F2ZTogYm9vbGVhbiA9IHRydWUpIHtcbiAgICB0aGlzLmNnLnNldCh7XG4gICAgICBjaGVjazogdGhpcy5jaGVjaygpLFxuICAgICAgdHVybkNvbG9yOiB0aGlzLmNvbG9yX3R1cm4oKSxcbiAgICAgIG1vdmFibGU6IHtcbiAgICAgICAgZnJlZTogZmFsc2UsXG4gICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yX3R1cm4oKSxcbiAgICAgICAgZGVzdHM6IHRoaXMuZGVzdHMoKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLm1lbnU/LnJlZHJhd01vdmVMaXN0KCk7XG4gICAgaWYgKHNob3VsZFNhdmUpIHtcbiAgICAgIHRoaXMuc2F2ZV9tb3ZlKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGNvbG9yX3R1cm4oKTogQ29sb3Ige1xuICAgIHJldHVybiB0aGlzLmNoZXNzLnR1cm4oKSA9PT0gXCJ3XCIgPyBcIndoaXRlXCIgOiBcImJsYWNrXCI7XG4gIH1cblxuICBwdWJsaWMgZGVzdHMoKTogTWFwPEtleSwgS2V5W10+IHtcbiAgICBjb25zdCBkZXN0cyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmNoZXNzLlNRVUFSRVMuZm9yRWFjaCgocykgPT4ge1xuICAgICAgY29uc3QgbXMgPSB0aGlzLmNoZXNzLm1vdmVzKHsgc3F1YXJlOiBzLCB2ZXJib3NlOiB0cnVlIH0pO1xuICAgICAgaWYgKG1zLmxlbmd0aClcbiAgICAgICAgZGVzdHMuc2V0KFxuICAgICAgICAgIHMsXG4gICAgICAgICAgbXMubWFwKChtKSA9PiBtLnRvKVxuICAgICAgICApO1xuICAgIH0pO1xuICAgIHJldHVybiBkZXN0cztcbiAgfVxuXG4gIHB1YmxpYyBjaGVjaygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jaGVzcy5pbl9jaGVjaygpO1xuICB9XG5cbiAgcHVibGljIHVuZG9fbW92ZSgpIHtcbiAgICB0aGlzLnVwZGF0ZV90dXJuX2lkeCh0aGlzLmN1cnJlbnRNb3ZlSWR4IC0gMSk7XG4gIH1cblxuICBwdWJsaWMgcmVkb19tb3ZlKCkge1xuICAgIHRoaXMudXBkYXRlX3R1cm5faWR4KHRoaXMuY3VycmVudE1vdmVJZHggKyAxKTtcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVfdHVybl9pZHgobW92ZUlkeDogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKG1vdmVJZHggPCAtMSB8fCBtb3ZlSWR4ID49IHRoaXMubW92ZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaXNVbmRvaW5nID0gbW92ZUlkeCA8IHRoaXMuY3VycmVudE1vdmVJZHg7XG4gICAgaWYgKGlzVW5kb2luZykge1xuICAgICAgd2hpbGUgKHRoaXMuY3VycmVudE1vdmVJZHggPiBtb3ZlSWR4KSB7XG4gICAgICAgIHRoaXMuY3VycmVudE1vdmVJZHgtLTtcbiAgICAgICAgdGhpcy5jaGVzcy51bmRvKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHdoaWxlICh0aGlzLmN1cnJlbnRNb3ZlSWR4IDwgbW92ZUlkeCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRNb3ZlSWR4Kys7XG4gICAgICAgIGNvbnN0IG1vdmUgPSB0aGlzLm1vdmVzW3RoaXMuY3VycmVudE1vdmVJZHhdO1xuICAgICAgICB0aGlzLmNoZXNzLm1vdmUobW92ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IGxhc3RNb3ZlOiBbS2V5LCBLZXldID0gdW5kZWZpbmVkO1xuICAgIGlmICh0aGlzLmN1cnJlbnRNb3ZlSWR4ID49IDApIHtcbiAgICAgIGNvbnN0IG1vdmUgPSB0aGlzLm1vdmVzW3RoaXMuY3VycmVudE1vdmVJZHhdO1xuICAgICAgbGFzdE1vdmUgPSBbbW92ZS5mcm9tLCBtb3ZlLnRvXTtcbiAgICB9XG5cbiAgICB0aGlzLmNnLnNldCh7XG4gICAgICBmZW46IHRoaXMuY2hlc3MuZmVuKCksXG4gICAgICBsYXN0TW92ZSxcbiAgICB9KTtcbiAgICB0aGlzLnN5bmNfYm9hcmRfd2l0aF9nYW1lc3RhdGUoKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRGcmVlTW92ZShlbmFibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKGVuYWJsZWQpIHtcbiAgICAgIHRoaXMuY2cuc2V0KHtcbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgbW92ZTogdGhpcy5zYXZlX21vdmUsXG4gICAgICAgIH0sXG4gICAgICAgIG1vdmFibGU6IHtcbiAgICAgICAgICBmcmVlOiB0cnVlLFxuICAgICAgICAgIGNvbG9yOiBcImJvdGhcIixcbiAgICAgICAgICBkZXN0czogdW5kZWZpbmVkLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2cuc2V0KHtcbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgbW92ZTogKG9yaWc6IGFueSwgZGVzdDogYW55KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBtb3ZlID0gdGhpcy5jaGVzcy5tb3ZlKHsgZnJvbTogb3JpZywgdG86IGRlc3QgfSk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRNb3ZlSWR4Kys7XG4gICAgICAgICAgICB0aGlzLm1vdmVzID0gWy4uLnRoaXMubW92ZXMuc2xpY2UoMCwgdGhpcy5jdXJyZW50TW92ZUlkeCksIG1vdmVdO1xuICAgICAgICAgICAgdGhpcy5zeW5jX2JvYXJkX3dpdGhfZ2FtZXN0YXRlKCk7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgdGhpcy5zeW5jX2JvYXJkX3dpdGhfZ2FtZXN0YXRlKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHR1cm4oKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hlc3MudHVybigpO1xuICB9XG5cbiAgcHVibGljIGhpc3RvcnkoKSB7XG4gICAgcmV0dXJuIHRoaXMubW92ZXM7XG4gIH1cblxuICBwdWJsaWMgZmxpcEJvYXJkKCkge1xuICAgIHRoaXMudXBkYXRlX29yaWVudGF0aW9uKClcbiAgICByZXR1cm4gdGhpcy5jZy50b2dnbGVPcmllbnRhdGlvbigpO1xuICB9XG5cbiAgcHVibGljIGdldEJvYXJkU3RhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2cuc3RhdGU7XG4gIH1cblxuICBwdWJsaWMgZ2V0RmVuKCkge1xuICAgIHJldHVybiB0aGlzLmNoZXNzLmZlbigpO1xuICB9XG5cbiAgcHVibGljIGxvYWRGZW4oZmVuOiBzdHJpbmcsIG1vdmVzPzogc3RyaW5nW10pOiB2b2lkIHtcbiAgICBsZXQgbGFzdE1vdmU6IFtLZXksIEtleV0gPSB1bmRlZmluZWQ7XG4gICAgaWYgKG1vdmVzKSB7XG4gICAgICB0aGlzLmN1cnJlbnRNb3ZlSWR4ID0gLTE7XG4gICAgICB0aGlzLm1vdmVzID0gW107XG4gICAgICB0aGlzLmNoZXNzLnJlc2V0KCk7XG5cbiAgICAgIG1vdmVzLmZvckVhY2goKGZ1bGxNb3ZlKSA9PiB7XG4gICAgICAgIGZ1bGxNb3ZlLnNwbGl0KFwiIFwiKS5mb3JFYWNoKChoYWxmTW92ZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IG1vdmUgPSB0aGlzLmNoZXNzLm1vdmUoaGFsZk1vdmUpO1xuICAgICAgICAgIHRoaXMubW92ZXMucHVzaChtb3ZlKTtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRNb3ZlSWR4Kys7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGlmICh0aGlzLmN1cnJlbnRNb3ZlSWR4ID49IDApIHtcbiAgICAgICAgY29uc3QgbW92ZSA9IHRoaXMubW92ZXNbdGhpcy5jdXJyZW50TW92ZUlkeF07XG4gICAgICAgIGxhc3RNb3ZlID0gW21vdmUuZnJvbSwgbW92ZS50b107XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2hlc3MubG9hZChmZW4pO1xuICAgIH1cblxuICAgIHRoaXMuY2cuc2V0KHsgZmVuOiB0aGlzLmNoZXNzLmZlbigpLCBsYXN0TW92ZSB9KTtcbiAgICB0aGlzLnN5bmNfYm9hcmRfd2l0aF9nYW1lc3RhdGUoKTtcbiAgfVxuXG59XG4iLCJpbXBvcnQgeyBCT0FSRF9TVFlMRVMsIFBJRUNFX1NUWUxFUyB9IGZyb20gXCIuL0NoZXNzZXJDb25maWdcIjtcbmltcG9ydCBDaGVzc2VyUGx1Z2luIGZyb20gXCIuL21haW5cIjtcblxuaW1wb3J0IHsgQXBwLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2hlc3NlclNldHRpbmdzIHtcbiAgb3JpZW50YXRpb246IHN0cmluZztcbiAgdmlld09ubHk6IGJvb2xlYW47XG4gIGRyYXdhYmxlOiBib29sZWFuO1xuICBmcmVlOiBib29sZWFuO1xuICBwaWVjZVN0eWxlOiBzdHJpbmc7XG4gIGJvYXJkU3R5bGU6IHN0cmluZztcblxuICB2aWV3TWVudTogYm9vbGVhbjtcblxufVxuXG5leHBvcnQgY29uc3QgREVGQVVMVF9TRVRUSU5HUzogQ2hlc3NlclNldHRpbmdzID0ge1xuICBvcmllbnRhdGlvbjogXCJ3aGl0ZVwiLFxuICB2aWV3T25seTogZmFsc2UsXG4gIGRyYXdhYmxlOiB0cnVlLFxuICBmcmVlOiBmYWxzZSxcbiAgcGllY2VTdHlsZTogXCJjYnVybmV0dFwiLFxuICBib2FyZFN0eWxlOiBcImJyb3duXCIsXG5cbiAgdmlld01lbnU6IHRydWUsXG5cbn07XG5cbmV4cG9ydCBjbGFzcyBDaGVzc2VyU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICBwbHVnaW46IENoZXNzZXJQbHVnaW47XG5cbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogQ2hlc3NlclBsdWdpbikge1xuICAgIHN1cGVyKGFwcCwgcGx1Z2luKTtcbiAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgfVxuXG4gIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgbGV0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XG5cbiAgICBjb250YWluZXJFbC5lbXB0eSgpO1xuXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoMlwiLCB7IHRleHQ6IFwiT2JzaWRpYW4gQ2hlc3MgU2V0dGluZ3NcIiB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJQaWVjZSBTdHlsZVwiKVxuICAgICAgLnNldERlc2MoXCJTZXRzIHRoZSBwaWVjZSBzdHlsZS5cIilcbiAgICAgIC5hZGREcm9wZG93bigoZHJvcGRvd24pID0+IHtcbiAgICAgICAgbGV0IHN0eWxlczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICAgICAgICBQSUVDRV9TVFlMRVMubWFwKChzdHlsZSkgPT4gKHN0eWxlc1tzdHlsZV0gPSBzdHlsZSkpO1xuICAgICAgICBkcm9wZG93bi5hZGRPcHRpb25zKHN0eWxlcyk7XG5cbiAgICAgICAgZHJvcGRvd24uc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucGllY2VTdHlsZSkub25DaGFuZ2UoKHBpZWNlU3R5bGUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5waWVjZVN0eWxlID0gcGllY2VTdHlsZTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJCb2FyZCBTdHlsZVwiKVxuICAgICAgLnNldERlc2MoXCJTZXRzIHRoZSBib2FyZCBzdHlsZS5cIilcbiAgICAgIC5hZGREcm9wZG93bigoZHJvcGRvd24pID0+IHtcbiAgICAgICAgbGV0IHN0eWxlczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICAgICAgICBCT0FSRF9TVFlMRVMubWFwKChzdHlsZSkgPT4gKHN0eWxlc1tzdHlsZV0gPSBzdHlsZSkpO1xuICAgICAgICBkcm9wZG93bi5hZGRPcHRpb25zKHN0eWxlcyk7XG5cbiAgICAgICAgZHJvcGRvd24uc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuYm9hcmRTdHlsZSkub25DaGFuZ2UoKGJvYXJkU3R5bGUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5ib2FyZFN0eWxlID0gYm9hcmRTdHlsZTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJPcmllbnRhdGlvblwiKVxuICAgICAgLnNldERlc2MoXCJTZXRzIHRoZSBkZWZhdWx0IGJvYXJkIG9yaWVudGF0aW9uLlwiKVxuICAgICAgLmFkZERyb3Bkb3duKChkcm9wZG93bikgPT4ge1xuICAgICAgICBkcm9wZG93bi5hZGRPcHRpb24oXCJ3aGl0ZVwiLCBcIldoaXRlXCIpO1xuICAgICAgICBkcm9wZG93bi5hZGRPcHRpb24oXCJibGFja1wiLCBcIkJsYWNrXCIpO1xuXG4gICAgICAgIGRyb3Bkb3duLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLm9yaWVudGF0aW9uKS5vbkNoYW5nZSgob3JpZW50YXRpb24pID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5vcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkRyYXdhYmxlXCIpXG4gICAgICAuc2V0RGVzYyhcIkNvbnRyb2xzIHRoZSBhYmlsaXR5IHRvIGRyYXcgYW5ub3RhdGlvbnMgKGFycm93cywgY2lyY2xlcykgb24gdGhlIGJvYXJkLlwiKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PiB7XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5kcmF3YWJsZSkub25DaGFuZ2UoKGRyYXdhYmxlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZHJhd2FibGUgPSBkcmF3YWJsZTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJWaWV3LW9ubHlcIilcbiAgICAgIC5zZXREZXNjKFwiSWYgZW5hYmxlZCwgZGlzcGxheXMgYSBzdGF0aWMgY2hlc3MgYm9hcmQgKG5vIG1vdmVzLCBhbm5vdGF0aW9ucywgLi4uKS5cIilcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT4ge1xuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Mudmlld09ubHkpLm9uQ2hhbmdlKCh2aWV3T25seSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnZpZXdPbmx5ID0gdmlld09ubHk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiRnJlZVwiKVxuICAgICAgLnNldERlc2MoXCJJZiBlbmFibGVkLCBkaXNhYmxlcyB0aGUgY2hlc3MgbG9naWMsIGFsbCBtb3ZlcyBhcmUgdmFsaWQuXCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmZyZWUpLm9uQ2hhbmdlKChmcmVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZnJlZSA9IGZyZWU7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiVmlldyBNZW51XCIpXG4gICAgICAuc2V0RGVzYyhcIklmIGVuYWJsZWQsIGRpc3BsYXlzIGEgbWVudSBvbiB0aGUgbGVmdCBzaWRlIG9mIHRoZSBib2FyZC5cIilcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT4ge1xuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Mudmlld01lbnUpLm9uQ2hhbmdlKCh2aWV3TWVudSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnZpZXdNZW51ID0gdmlld01lbnU7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IE1hcmtkb3duVmlldywgUGx1Z2luIH0gZnJvbSBcIm9ic2lkaWFuXCI7XHJcbmltcG9ydCB7IGRyYXdfY2hlc3Nib2FyZCB9IGZyb20gXCIuL0NoZXNzZXJcIjtcclxuaW1wb3J0IHsgQ2hlc3NlclNldHRpbmdzLCBDaGVzc2VyU2V0dGluZ1RhYiwgREVGQVVMVF9TRVRUSU5HUyB9IGZyb20gXCIuL0NoZXNzZXJTZXR0aW5nc1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hlc3NlclBsdWdpbiBleHRlbmRzIFBsdWdpbiB7XHJcbiAgc2V0dGluZ3M6IENoZXNzZXJTZXR0aW5ncztcclxuXHJcbiAgYXN5bmMgb25sb2FkKCkge1xyXG4gICAgYXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcclxuICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgQ2hlc3NlclNldHRpbmdUYWIodGhpcy5hcHAsIHRoaXMpKTtcclxuICAgIHRoaXMucmVnaXN0ZXJNYXJrZG93bkNvZGVCbG9ja1Byb2Nlc3NvcihcclxuICAgICAgXCJjaGVzc2VyXCIsIC8vIGtlZXAgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5L2JyYW5kaW5nXHJcbiAgICAgIGRyYXdfY2hlc3Nib2FyZCh0aGlzLmFwcCwgdGhpcy5zZXR0aW5ncylcclxuICAgICk7XHJcbiAgICB0aGlzLnJlZ2lzdGVyTWFya2Rvd25Db2RlQmxvY2tQcm9jZXNzb3IoXHJcbiAgICAgIFwiY2hlc3NcIixcclxuICAgICAgZHJhd19jaGVzc2JvYXJkKHRoaXMuYXBwLCB0aGlzLnNldHRpbmdzKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGxvYWRTZXR0aW5ncygpIHtcclxuICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX1NFVFRJTkdTLCBhd2FpdCB0aGlzLmxvYWREYXRhKCkpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgc2F2ZVNldHRpbmdzKCkge1xyXG4gICAgYXdhaXQgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcclxuICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbImNnLnJhbmtzIiwiY2cuZmlsZXMiLCJ1dGlsLmtleTJwb3MiLCJ1dGlsLmFsbFBvcyIsInV0aWwucG9zMmtleSIsImZlblJlYWQiLCJyZW5kZXIiLCJ1dGlsLmRpc3RhbmNlU3EiLCJ1dGlsLmFsbEtleXMiLCJ1dGlsLnNhbWVQaWVjZSIsInN0YXJ0IiwibW92ZSIsImVuZCIsImNhbmNlbCIsInV0aWwuZXZlbnRQb3NpdGlvbiIsImJvYXJkLmdldEtleUF0RG9tUG9zIiwiYm9hcmQud2hpdGVQb3YiLCJkcmF3Q2xlYXIiLCJib2FyZC5jYW5Nb3ZlIiwiYm9hcmQuc2VsZWN0U3F1YXJlIiwiYm9hcmQuaXNEcmFnZ2FibGUiLCJ1dGlsLnRyYW5zbGF0ZSIsInV0aWwucG9zVG9UcmFuc2xhdGUiLCJ1dGlsLnNldFZpc2libGUiLCJib2FyZC51bnNldFByZW1vdmUiLCJib2FyZC51bnNldFByZWRyb3AiLCJ1dGlsLmNvbXB1dGVTcXVhcmVDZW50ZXIiLCJib2FyZC5kcm9wTmV3UGllY2UiLCJib2FyZC51c2VyTW92ZSIsImJvYXJkLmNhbGxVc2VyRnVuY3Rpb24iLCJib2FyZC51bnNlbGVjdCIsInRvZ2dsZU9yaWVudGF0aW9uIiwiYm9hcmQudG9nZ2xlT3JpZW50YXRpb24iLCJmZW5Xcml0ZSIsImJvYXJkLnNldFBpZWNlcyIsImJvYXJkLmJhc2VNb3ZlIiwiYm9hcmQuYmFzZU5ld1BpZWNlIiwiYm9hcmQucGxheVByZW1vdmUiLCJib2FyZC5wbGF5UHJlZHJvcCIsImJvYXJkLmNhbmNlbE1vdmUiLCJkcmFnQ2FuY2VsIiwiYm9hcmQuc3RvcCIsImZlbi5yZWFkIiwiZmVuLmluaXRpYWwiLCJyZW5kZXJTaGFwZSIsImNyZWF0ZVNWRyIsImRyYWcubW92ZSIsImRyYXcubW92ZSIsImRyYWcuZW5kIiwiZHJhdy5lbmQiLCJkcmFnLmNhbmNlbCIsImRyYXcuY2FuY2VsIiwiZHJhdy5zdGFydCIsImRyYWcuc3RhcnQiLCJwb3NUb1RyYW5zbGF0ZSIsInBvc1RvVHJhbnNsYXRlRnJvbUJvdW5kcyIsInJlbmRlclJlc2l6ZWQiLCJ1dGlsLm1lbW8iLCJhdXRvUGllY2VzLnJlbmRlciIsInN2Zy5yZW5kZXJTdmciLCJhdXRvUGllY2VzLnJlbmRlclJlc2l6ZWQiLCJldmVudHMuYmluZEJvYXJkIiwiZXZlbnRzLmJpbmREb2N1bWVudCIsInBhcnNlWWFtbCIsInN0YXJ0aW5nUG9zaXRvbnMiLCJzZXRJY29uIiwiZnMiLCJNYXJrZG93blJlbmRlckNoaWxkIiwiQ2hlc3MiLCJOb3RpY2UiLCJNYXJrZG93blZpZXciLCJzdHJpbmdpZnlZYW1sIiwiUGx1Z2luU2V0dGluZ1RhYiIsIlNldHRpbmciLCJQbHVnaW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBdURBO0FBQ08sU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQzdELElBQUksU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxLQUFLLFlBQVksQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ2hILElBQUksT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQy9ELFFBQVEsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUNuRyxRQUFRLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUN0RyxRQUFRLFNBQVMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUN0SCxRQUFRLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxVQUFVLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM5RSxLQUFLLENBQUMsQ0FBQztBQUNQOztBQ2pDQSxJQUFJLE1BQU0sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLEtBQUs7QUFDNUIsRUFBRSxJQUFJLEVBQUUsR0FBRyxHQUFFO0FBQ2IsRUFBRSxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFDO0FBQzFELEVBQUUsT0FBTyxJQUFJLEVBQUUsRUFBRTtBQUNqQixJQUFJLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFFO0FBQy9CLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxFQUFFO0FBQ25CLE1BQU0sRUFBRSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFDO0FBQzdCLEtBQUssTUFBTSxJQUFJLElBQUksR0FBRyxFQUFFLEVBQUU7QUFDMUIsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxFQUFFLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLEdBQUU7QUFDbEQsS0FBSyxNQUFNLElBQUksSUFBSSxHQUFHLEVBQUUsRUFBRTtBQUMxQixNQUFNLEVBQUUsSUFBSSxJQUFHO0FBQ2YsS0FBSyxNQUFNO0FBQ1gsTUFBTSxFQUFFLElBQUksSUFBRztBQUNmLEtBQUs7QUFDTCxHQUFHO0FBQ0gsRUFBRSxPQUFPLEVBQUU7QUFDWDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqQ0EsSUFBSSxLQUFLLEdBQUcsVUFBVSxHQUFHLEVBQUU7QUFDM0IsRUFBRSxJQUFJLEtBQUssR0FBRyxJQUFHO0FBQ2pCLEVBQUUsSUFBSSxLQUFLLEdBQUcsSUFBRztBQUNqQjtBQUNBLEVBQUUsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFDO0FBQ2hCO0FBQ0EsRUFBRSxJQUFJLElBQUksR0FBRyxJQUFHO0FBQ2hCLEVBQUUsSUFBSSxNQUFNLEdBQUcsSUFBRztBQUNsQixFQUFFLElBQUksTUFBTSxHQUFHLElBQUc7QUFDbEIsRUFBRSxJQUFJLElBQUksR0FBRyxJQUFHO0FBQ2hCLEVBQUUsSUFBSSxLQUFLLEdBQUcsSUFBRztBQUNqQixFQUFFLElBQUksSUFBSSxHQUFHLElBQUc7QUFDaEI7QUFDQSxFQUFFLElBQUksT0FBTyxHQUFHLGVBQWM7QUFDOUI7QUFDQSxFQUFFLElBQUksZ0JBQWdCO0FBQ3RCLElBQUksMkRBQTBEO0FBQzlEO0FBQ0EsRUFBRSxJQUFJLG1CQUFtQixHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFDO0FBQzFEO0FBQ0EsRUFBRSxJQUFJLFlBQVksR0FBRztBQUNyQixJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztBQUN2QixJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO0FBQzNCLElBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxhQUFhLEdBQUc7QUFDdEIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7QUFDM0MsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBQ3pCLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN2QixJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6QyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6QyxJQUFHO0FBQ0g7QUFDQTtBQUNBLEVBQUUsSUFBSSxPQUFPLEdBQUc7QUFDaEIsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQ3JELEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztBQUNyRCxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDckQsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO0FBQ3JELEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztBQUNyRCxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDckQsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO0FBQ3JELElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUNyRCxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDckQsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO0FBQ3JELEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztBQUNyRCxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDckQsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO0FBQ3JELEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztBQUNyRCxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNsRCxHQUFHLENBQUM7QUFDSjtBQUNBO0FBQ0EsRUFBRSxJQUFJLElBQUksR0FBRztBQUNiLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztBQUNsRSxNQUFNLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUM7QUFDbEUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO0FBQ2xFLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztBQUNsRSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7QUFDbEUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO0FBQ2xFLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztBQUNsRSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUNsRSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7QUFDbEUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO0FBQ2xFLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztBQUNsRSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7QUFDbEUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO0FBQ2xFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQztBQUNsRSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUMvRCxHQUFHLENBQUM7QUFDSjtBQUNBLEVBQUUsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRTtBQUNyRDtBQUNBLEVBQUUsSUFBSSxLQUFLLEdBQUc7QUFDZCxJQUFJLE1BQU0sRUFBRSxHQUFHO0FBQ2YsSUFBSSxPQUFPLEVBQUUsR0FBRztBQUNoQixJQUFJLFFBQVEsRUFBRSxHQUFHO0FBQ2pCLElBQUksVUFBVSxFQUFFLEdBQUc7QUFDbkIsSUFBSSxTQUFTLEVBQUUsR0FBRztBQUNsQixJQUFJLFlBQVksRUFBRSxHQUFHO0FBQ3JCLElBQUksWUFBWSxFQUFFLEdBQUc7QUFDckIsSUFBRztBQUNIO0FBQ0EsRUFBRSxJQUFJLElBQUksR0FBRztBQUNiLElBQUksTUFBTSxFQUFFLENBQUM7QUFDYixJQUFJLE9BQU8sRUFBRSxDQUFDO0FBQ2QsSUFBSSxRQUFRLEVBQUUsQ0FBQztBQUNmLElBQUksVUFBVSxFQUFFLENBQUM7QUFDakIsSUFBSSxTQUFTLEVBQUUsRUFBRTtBQUNqQixJQUFJLFlBQVksRUFBRSxFQUFFO0FBQ3BCLElBQUksWUFBWSxFQUFFLEVBQUU7QUFDcEIsSUFBRztBQUNIO0FBQ0EsRUFBRSxJQUFJLE1BQU0sR0FBRyxFQUFDO0FBQ2hCLEVBQUUsSUFBSSxNQUFNLEdBQUcsRUFBQztBQUtoQixFQUFFLElBQUksTUFBTSxHQUFHLEVBQUM7QUFDaEIsRUFBRSxJQUFJLE1BQU0sR0FBRyxFQUFDO0FBQ2hCO0FBQ0E7QUFDQSxFQUFFLElBQUksT0FBTyxHQUFHO0FBQ2hCLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQztBQUMxRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUU7QUFDMUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFO0FBQzFFLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTtBQUMxRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUU7QUFDMUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFO0FBQzFFLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRztBQUMxRSxJQUFJLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUc7QUFDMUUsR0FBRyxDQUFDO0FBQ0o7QUFDQSxFQUFFLElBQUksS0FBSyxHQUFHO0FBQ2QsSUFBSSxDQUFDLEVBQUU7QUFDUCxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUU7QUFDckQsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQ3JELEtBQUs7QUFDTCxJQUFJLENBQUMsRUFBRTtBQUNQLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRTtBQUNyRCxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUU7QUFDckQsS0FBSztBQUNMLElBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFDO0FBQzVCLEVBQUUsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEdBQUU7QUFDcEMsRUFBRSxJQUFJLElBQUksR0FBRyxNQUFLO0FBQ2xCLEVBQUUsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUU7QUFDL0IsRUFBRSxJQUFJLFNBQVMsR0FBRyxNQUFLO0FBQ3ZCLEVBQUUsSUFBSSxVQUFVLEdBQUcsRUFBQztBQUNwQixFQUFFLElBQUksV0FBVyxHQUFHLEVBQUM7QUFDckIsRUFBRSxJQUFJLE9BQU8sR0FBRyxHQUFFO0FBQ2xCLEVBQUUsSUFBSSxNQUFNLEdBQUcsR0FBRTtBQUNqQixFQUFFLElBQUksUUFBUSxHQUFHLEdBQUU7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLElBQUksT0FBTyxHQUFHLEtBQUssV0FBVyxFQUFFO0FBQ2xDLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFDO0FBQzFCLEdBQUcsTUFBTTtBQUNULElBQUksSUFBSSxDQUFDLEdBQUcsRUFBQztBQUNiLEdBQUc7QUFDSDtBQUNBLEVBQUUsU0FBUyxLQUFLLENBQUMsWUFBWSxFQUFFO0FBQy9CLElBQUksSUFBSSxPQUFPLFlBQVksS0FBSyxXQUFXLEVBQUU7QUFDN0MsTUFBTSxZQUFZLEdBQUcsTUFBSztBQUMxQixLQUFLO0FBQ0w7QUFDQSxJQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUM7QUFDMUIsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEdBQUU7QUFDbEMsSUFBSSxJQUFJLEdBQUcsTUFBSztBQUNoQixJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRTtBQUM3QixJQUFJLFNBQVMsR0FBRyxNQUFLO0FBQ3JCLElBQUksVUFBVSxHQUFHLEVBQUM7QUFDbEIsSUFBSSxXQUFXLEdBQUcsRUFBQztBQUNuQixJQUFJLE9BQU8sR0FBRyxHQUFFO0FBQ2hCLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRSxNQUFNLEdBQUcsR0FBRTtBQUNsQyxJQUFJLFFBQVEsR0FBRyxHQUFFO0FBQ2pCLElBQUksWUFBWSxDQUFDLFlBQVksRUFBRSxFQUFDO0FBQ2hDLEdBQUc7QUFDSDtBQUNBLEVBQUUsU0FBUyxjQUFjLEdBQUc7QUFDNUIsSUFBSSxJQUFJLGdCQUFnQixHQUFHLEdBQUU7QUFDN0IsSUFBSSxJQUFJLGdCQUFnQixHQUFHLEdBQUU7QUFDN0IsSUFBSSxJQUFJLFlBQVksR0FBRyxVQUFVLEdBQUcsRUFBRTtBQUN0QyxNQUFNLElBQUksR0FBRyxJQUFJLFFBQVEsRUFBRTtBQUMzQixRQUFRLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxHQUFHLEVBQUM7QUFDN0MsT0FBTztBQUNQLE1BQUs7QUFDTCxJQUFJLE9BQU8sT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDL0IsTUFBTSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUM7QUFDeEMsS0FBSztBQUNMLElBQUksWUFBWSxDQUFDLFlBQVksRUFBRSxFQUFDO0FBQ2hDLElBQUksT0FBTyxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3hDLE1BQU0sU0FBUyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxFQUFDO0FBQ3ZDLE1BQU0sWUFBWSxDQUFDLFlBQVksRUFBRSxFQUFDO0FBQ2xDLEtBQUs7QUFDTCxJQUFJLFFBQVEsR0FBRyxpQkFBZ0I7QUFDL0IsR0FBRztBQUNIO0FBQ0EsRUFBRSxTQUFTLEtBQUssR0FBRztBQUNuQixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBQztBQUMxQixHQUFHO0FBQ0g7QUFDQSxFQUFFLFNBQVMsSUFBSSxDQUFDLEdBQUcsRUFBRSxZQUFZLEVBQUU7QUFDbkMsSUFBSSxJQUFJLE9BQU8sWUFBWSxLQUFLLFdBQVcsRUFBRTtBQUM3QyxNQUFNLFlBQVksR0FBRyxNQUFLO0FBQzFCLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUM7QUFDakMsSUFBSSxJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsQ0FBQyxFQUFDO0FBQzVCLElBQUksSUFBSSxNQUFNLEdBQUcsRUFBQztBQUNsQjtBQUNBLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUU7QUFDbEMsTUFBTSxPQUFPLEtBQUs7QUFDbEIsS0FBSztBQUNMO0FBQ0EsSUFBSSxLQUFLLENBQUMsWUFBWSxFQUFDO0FBQ3ZCO0FBQ0EsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUM5QyxNQUFNLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFDO0FBQ3BDO0FBQ0EsTUFBTSxJQUFJLEtBQUssS0FBSyxHQUFHLEVBQUU7QUFDekIsUUFBUSxNQUFNLElBQUksRUFBQztBQUNuQixPQUFPLE1BQU0sSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDbEMsUUFBUSxNQUFNLElBQUksUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUM7QUFDckMsT0FBTyxNQUFNO0FBQ2IsUUFBUSxJQUFJLEtBQUssR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxNQUFLO0FBQy9DLFFBQVEsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxXQUFXLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFDO0FBQzNFLFFBQVEsTUFBTSxHQUFFO0FBQ2hCLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxFQUFDO0FBQ3BCO0FBQ0EsSUFBSSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7QUFDckMsTUFBTSxRQUFRLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxhQUFZO0FBQ3JDLEtBQUs7QUFDTCxJQUFJLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtBQUNyQyxNQUFNLFFBQVEsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLGFBQVk7QUFDckMsS0FBSztBQUNMLElBQUksSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQ3JDLE1BQU0sUUFBUSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsYUFBWTtBQUNyQyxLQUFLO0FBQ0wsSUFBSSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7QUFDckMsTUFBTSxRQUFRLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxhQUFZO0FBQ3JDLEtBQUs7QUFDTDtBQUNBLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEdBQUcsS0FBSyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDOUQsSUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUM7QUFDeEMsSUFBSSxXQUFXLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUM7QUFDekM7QUFDQSxJQUFJLFlBQVksQ0FBQyxZQUFZLEVBQUUsRUFBQztBQUNoQztBQUNBLElBQUksT0FBTyxJQUFJO0FBQ2YsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsU0FBUyxZQUFZLENBQUMsR0FBRyxFQUFFO0FBQzdCLElBQUksSUFBSSxNQUFNLEdBQUc7QUFDakIsTUFBTSxDQUFDLEVBQUUsWUFBWTtBQUNyQixNQUFNLENBQUMsRUFBRSxxREFBcUQ7QUFDOUQsTUFBTSxDQUFDLEVBQUUscURBQXFEO0FBQzlELE1BQU0sQ0FBQyxFQUFFLCtEQUErRDtBQUN4RSxNQUFNLENBQUMsRUFBRSwyQ0FBMkM7QUFDcEQsTUFBTSxDQUFDLEVBQUUsK0NBQStDO0FBQ3hELE1BQU0sQ0FBQyxFQUFFLHNDQUFzQztBQUMvQyxNQUFNLENBQUMsRUFBRSxvRUFBb0U7QUFDN0UsTUFBTSxDQUFDLEVBQUUsK0RBQStEO0FBQ3hFLE1BQU0sQ0FBQyxFQUFFLHlEQUF5RDtBQUNsRSxNQUFNLEVBQUUsRUFBRSx5REFBeUQ7QUFDbkUsTUFBTSxFQUFFLEVBQUUsMkJBQTJCO0FBQ3JDLE1BQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBQztBQUNqQyxJQUFJLElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDN0IsTUFBTSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDaEUsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQzFELE1BQU0sT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ2hFLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUN6RCxNQUFNLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUNoRSxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUNqRCxNQUFNLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUNoRSxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksSUFBSSxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUN0RCxNQUFNLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUNoRSxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDcEMsTUFBTSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDaEUsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFDO0FBQ25DLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUMzQixNQUFNLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUNoRSxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDMUM7QUFDQSxNQUFNLElBQUksVUFBVSxHQUFHLEVBQUM7QUFDeEIsTUFBTSxJQUFJLG1CQUFtQixHQUFHLE1BQUs7QUFDckM7QUFDQSxNQUFNLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQy9DLFFBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUNoQyxVQUFVLElBQUksbUJBQW1CLEVBQUU7QUFDbkMsWUFBWSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDdEUsV0FBVztBQUNYLFVBQVUsVUFBVSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFDO0FBQ2hELFVBQVUsbUJBQW1CLEdBQUcsS0FBSTtBQUNwQyxTQUFTLE1BQU07QUFDZixVQUFVLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDcEQsWUFBWSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDdEUsV0FBVztBQUNYLFVBQVUsVUFBVSxJQUFJLEVBQUM7QUFDekIsVUFBVSxtQkFBbUIsR0FBRyxNQUFLO0FBQ3JDLFNBQVM7QUFDVCxPQUFPO0FBQ1AsTUFBTSxJQUFJLFVBQVUsS0FBSyxDQUFDLEVBQUU7QUFDNUIsUUFBUSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDcEUsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBLElBQUk7QUFDSixNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRztBQUM5QyxPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQztBQUMvQyxNQUFNO0FBQ04sTUFBTSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDbEUsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUM3RCxHQUFHO0FBQ0g7QUFDQSxFQUFFLFNBQVMsWUFBWSxHQUFHO0FBQzFCLElBQUksSUFBSSxLQUFLLEdBQUcsRUFBQztBQUNqQixJQUFJLElBQUksR0FBRyxHQUFHLEdBQUU7QUFDaEI7QUFDQSxJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNuRCxNQUFNLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRTtBQUM1QixRQUFRLEtBQUssR0FBRTtBQUNmLE9BQU8sTUFBTTtBQUNiLFFBQVEsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO0FBQ3ZCLFVBQVUsR0FBRyxJQUFJLE1BQUs7QUFDdEIsVUFBVSxLQUFLLEdBQUcsRUFBQztBQUNuQixTQUFTO0FBQ1QsUUFBUSxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBSztBQUNsQyxRQUFRLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFJO0FBQ2pDO0FBQ0EsUUFBUSxHQUFHLElBQUksS0FBSyxLQUFLLEtBQUssR0FBRyxLQUFLLENBQUMsV0FBVyxFQUFFLEdBQUcsS0FBSyxDQUFDLFdBQVcsR0FBRTtBQUMxRSxPQUFPO0FBQ1A7QUFDQSxNQUFNLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksRUFBRTtBQUMxQixRQUFRLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtBQUN2QixVQUFVLEdBQUcsSUFBSSxNQUFLO0FBQ3RCLFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxDQUFDLEtBQUssT0FBTyxDQUFDLEVBQUUsRUFBRTtBQUM5QixVQUFVLEdBQUcsSUFBSSxJQUFHO0FBQ3BCLFNBQVM7QUFDVDtBQUNBLFFBQVEsS0FBSyxHQUFHLEVBQUM7QUFDakIsUUFBUSxDQUFDLElBQUksRUFBQztBQUNkLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksTUFBTSxHQUFHLEdBQUU7QUFDbkIsSUFBSSxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQzdDLE1BQU0sTUFBTSxJQUFJLElBQUc7QUFDbkIsS0FBSztBQUNMLElBQUksSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRTtBQUM3QyxNQUFNLE1BQU0sSUFBSSxJQUFHO0FBQ25CLEtBQUs7QUFDTCxJQUFJLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUU7QUFDN0MsTUFBTSxNQUFNLElBQUksSUFBRztBQUNuQixLQUFLO0FBQ0wsSUFBSSxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQzdDLE1BQU0sTUFBTSxJQUFJLElBQUc7QUFDbkIsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLE1BQU0sR0FBRyxNQUFNLElBQUksSUFBRztBQUMxQixJQUFJLElBQUksT0FBTyxHQUFHLFNBQVMsS0FBSyxLQUFLLEdBQUcsR0FBRyxHQUFHLFNBQVMsQ0FBQyxTQUFTLEVBQUM7QUFDbEU7QUFDQSxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDMUUsR0FBRztBQUNIO0FBQ0EsRUFBRSxTQUFTLFVBQVUsQ0FBQyxJQUFJLEVBQUU7QUFDNUIsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQzdDLE1BQU0sSUFBSSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLElBQUksT0FBTyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLFFBQVEsRUFBRTtBQUMxRSxRQUFRLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBQztBQUNyQyxPQUFPO0FBQ1AsS0FBSztBQUNMLElBQUksT0FBTyxNQUFNO0FBQ2pCLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsU0FBUyxZQUFZLENBQUMsR0FBRyxFQUFFO0FBQzdCLElBQUksSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNO0FBQ2xDO0FBQ0EsSUFBSSxJQUFJLEdBQUcsS0FBSyxnQkFBZ0IsRUFBRTtBQUNsQyxNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFHO0FBQzNCLE1BQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUc7QUFDekIsS0FBSyxNQUFNO0FBQ1gsTUFBTSxPQUFPLE1BQU0sQ0FBQyxPQUFPLEVBQUM7QUFDNUIsTUFBTSxPQUFPLE1BQU0sQ0FBQyxLQUFLLEVBQUM7QUFDMUIsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBLEVBQUUsU0FBUyxHQUFHLENBQUMsTUFBTSxFQUFFO0FBQ3ZCLElBQUksSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBQztBQUN0QyxJQUFJLE9BQU8sS0FBSyxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxJQUFJO0FBQ2xFLEdBQUc7QUFDSDtBQUNBLEVBQUUsU0FBUyxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtBQUM5QjtBQUNBLElBQUksSUFBSSxFQUFFLE1BQU0sSUFBSSxLQUFLLElBQUksT0FBTyxJQUFJLEtBQUssQ0FBQyxFQUFFO0FBQ2hELE1BQU0sT0FBTyxLQUFLO0FBQ2xCLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQzFELE1BQU0sT0FBTyxLQUFLO0FBQ2xCLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxJQUFJLEVBQUUsTUFBTSxJQUFJLE9BQU8sQ0FBQyxFQUFFO0FBQzlCLE1BQU0sT0FBTyxLQUFLO0FBQ2xCLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBQztBQUM1QjtBQUNBO0FBQ0EsSUFBSTtBQUNKLE1BQU0sS0FBSyxDQUFDLElBQUksSUFBSSxJQUFJO0FBQ3hCLE1BQU0sRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNoRSxNQUFNO0FBQ04sTUFBTSxPQUFPLEtBQUs7QUFDbEIsS0FBSztBQUNMO0FBQ0EsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssR0FBRTtBQUN4RCxJQUFJLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7QUFDN0IsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUU7QUFDN0IsS0FBSztBQUNMO0FBQ0EsSUFBSSxZQUFZLENBQUMsWUFBWSxFQUFFLEVBQUM7QUFDaEM7QUFDQSxJQUFJLE9BQU8sSUFBSTtBQUNmLEdBQUc7QUFDSDtBQUNBLEVBQUUsU0FBUyxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQzFCLElBQUksSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBQztBQUMzQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxLQUFJO0FBQ2pDLElBQUksSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7QUFDdEMsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQUs7QUFDaEMsS0FBSztBQUNMO0FBQ0EsSUFBSSxZQUFZLENBQUMsWUFBWSxFQUFFLEVBQUM7QUFDaEM7QUFDQSxJQUFJLE9BQU8sS0FBSztBQUNoQixHQUFHO0FBQ0g7QUFDQSxFQUFFLFNBQVMsVUFBVSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUU7QUFDekQsSUFBSSxJQUFJLElBQUksR0FBRztBQUNmLE1BQU0sS0FBSyxFQUFFLElBQUk7QUFDakIsTUFBTSxJQUFJLEVBQUUsSUFBSTtBQUNoQixNQUFNLEVBQUUsRUFBRSxFQUFFO0FBQ1osTUFBTSxLQUFLLEVBQUUsS0FBSztBQUNsQixNQUFNLEtBQUssRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSTtBQUM3QixNQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksU0FBUyxFQUFFO0FBQ25CLE1BQU0sSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsVUFBUztBQUNsQyxNQUFNLElBQUksQ0FBQyxTQUFTLEdBQUcsVUFBUztBQUNoQyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ25CLE1BQU0sSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSTtBQUNwQyxLQUFLLE1BQU0sSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUN4QyxNQUFNLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSTtBQUMxQixLQUFLO0FBQ0wsSUFBSSxPQUFPLElBQUk7QUFDZixHQUFHO0FBQ0g7QUFDQSxFQUFFLFNBQVMsY0FBYyxDQUFDLE9BQU8sRUFBRTtBQUNuQyxJQUFJLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUU7QUFDckQ7QUFDQSxNQUFNO0FBQ04sUUFBUSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUk7QUFDakMsU0FBUyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssTUFBTSxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxNQUFNLENBQUM7QUFDcEQsUUFBUTtBQUNSLFFBQVEsSUFBSSxNQUFNLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUM7QUFDbEQsUUFBUSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzNELFVBQVUsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQ25FLFNBQVM7QUFDVCxPQUFPLE1BQU07QUFDYixRQUFRLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFDO0FBQ3RELE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksS0FBSyxHQUFHLEdBQUU7QUFDbEIsSUFBSSxJQUFJLEVBQUUsR0FBRyxLQUFJO0FBQ2pCLElBQUksSUFBSSxJQUFJLEdBQUcsVUFBVSxDQUFDLEVBQUUsRUFBQztBQUM3QixJQUFJLElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxHQUFFO0FBQzlDO0FBQ0EsSUFBSSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsR0FBRTtBQUM3QixJQUFJLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFFO0FBQzVCLElBQUksSUFBSSxhQUFhLEdBQUcsTUFBSztBQUM3QjtBQUNBO0FBQ0EsSUFBSSxJQUFJLEtBQUs7QUFDYixNQUFNLE9BQU8sT0FBTyxLQUFLLFdBQVcsSUFBSSxPQUFPLElBQUksT0FBTztBQUMxRCxVQUFVLE9BQU8sQ0FBQyxLQUFLO0FBQ3ZCLFVBQVUsS0FBSTtBQUNkO0FBQ0EsSUFBSSxJQUFJLFVBQVU7QUFDbEIsTUFBTSxPQUFPLE9BQU8sS0FBSyxXQUFXO0FBQ3BDLE1BQU0sT0FBTyxJQUFJLE9BQU87QUFDeEIsTUFBTSxPQUFPLE9BQU8sQ0FBQyxLQUFLLEtBQUssUUFBUTtBQUN2QyxVQUFVLE9BQU8sQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFO0FBQ3JDLFVBQVUsS0FBSTtBQUNkO0FBQ0E7QUFDQSxJQUFJLElBQUksT0FBTyxPQUFPLEtBQUssV0FBVyxJQUFJLFFBQVEsSUFBSSxPQUFPLEVBQUU7QUFDL0QsTUFBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksT0FBTyxFQUFFO0FBQ3JDLFFBQVEsUUFBUSxHQUFHLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBQztBQUNwRCxRQUFRLGFBQWEsR0FBRyxLQUFJO0FBQzVCLE9BQU8sTUFBTTtBQUNiO0FBQ0EsUUFBUSxPQUFPLEVBQUU7QUFDakIsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxJQUFJLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUM5QztBQUNBLE1BQU0sSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFO0FBQ3BCLFFBQVEsQ0FBQyxJQUFJLEVBQUM7QUFDZCxRQUFRLFFBQVE7QUFDaEIsT0FBTztBQUNQO0FBQ0EsTUFBTSxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFDO0FBQzFCLE1BQU0sSUFBSSxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssQ0FBQyxLQUFLLEtBQUssRUFBRSxFQUFFO0FBQy9DLFFBQVEsUUFBUTtBQUNoQixPQUFPO0FBQ1A7QUFDQSxNQUFNLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJLEtBQUssVUFBVSxLQUFLLElBQUksSUFBSSxVQUFVLEtBQUssSUFBSSxDQUFDLEVBQUU7QUFDL0U7QUFDQSxRQUFRLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQzVDLFFBQVEsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxFQUFFO0FBQ25DLFVBQVUsUUFBUSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDO0FBQ3hEO0FBQ0E7QUFDQSxVQUFVLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQzlDLFVBQVUsSUFBSSxXQUFXLENBQUMsRUFBRSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLEVBQUU7QUFDcEUsWUFBWSxRQUFRLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUM7QUFDNUQsV0FBVztBQUNYLFNBQVM7QUFDVDtBQUNBO0FBQ0EsUUFBUSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNoQyxVQUFVLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQzlDLFVBQVUsSUFBSSxNQUFNLEdBQUcsSUFBSSxFQUFFLFFBQVE7QUFDckM7QUFDQSxVQUFVLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxLQUFLLElBQUksRUFBRTtBQUNyRSxZQUFZLFFBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQztBQUMzRCxXQUFXLE1BQU0sSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFO0FBQzNDLFlBQVksUUFBUSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFDO0FBQ2pFLFdBQVc7QUFDWCxTQUFTO0FBQ1QsT0FBTyxNQUFNLElBQUksVUFBVSxLQUFLLElBQUksSUFBSSxVQUFVLEtBQUssS0FBSyxDQUFDLElBQUksRUFBRTtBQUNuRSxRQUFRLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzlFLFVBQVUsSUFBSSxNQUFNLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDbkQsVUFBVSxJQUFJLE1BQU0sR0FBRyxFQUFDO0FBQ3hCO0FBQ0EsVUFBVSxPQUFPLElBQUksRUFBRTtBQUN2QixZQUFZLE1BQU0sSUFBSSxPQUFNO0FBQzVCLFlBQVksSUFBSSxNQUFNLEdBQUcsSUFBSSxFQUFFLEtBQUs7QUFDcEM7QUFDQSxZQUFZLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRTtBQUN2QyxjQUFjLFFBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQztBQUM1RCxhQUFhLE1BQU07QUFDbkIsY0FBYyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEtBQUssRUFBRSxFQUFFLEtBQUs7QUFDbkQsY0FBYyxRQUFRLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUM7QUFDN0QsY0FBYyxLQUFLO0FBQ25CLGFBQWE7QUFDYjtBQUNBO0FBQ0EsWUFBWSxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssR0FBRyxFQUFFLEtBQUs7QUFDL0QsV0FBVztBQUNYLFNBQVM7QUFDVCxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxJQUFJLFVBQVUsS0FBSyxJQUFJLElBQUksVUFBVSxLQUFLLElBQUksRUFBRTtBQUNwRCxNQUFNLElBQUksQ0FBQyxhQUFhLElBQUksT0FBTyxLQUFLLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNuRDtBQUNBLFFBQVEsSUFBSSxRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRTtBQUM5QyxVQUFVLElBQUksYUFBYSxHQUFHLEtBQUssQ0FBQyxFQUFFLEVBQUM7QUFDdkMsVUFBVSxJQUFJLFdBQVcsR0FBRyxhQUFhLEdBQUcsRUFBQztBQUM3QztBQUNBLFVBQVU7QUFDVixZQUFZLEtBQUssQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSTtBQUM1QyxZQUFZLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxJQUFJO0FBQ3RDLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN0QyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxhQUFhLEdBQUcsQ0FBQyxDQUFDO0FBQzlDLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQztBQUN4QyxZQUFZO0FBQ1osWUFBWSxRQUFRLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUM7QUFDN0UsV0FBVztBQUNYLFNBQVM7QUFDVDtBQUNBO0FBQ0EsUUFBUSxJQUFJLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQzlDLFVBQVUsSUFBSSxhQUFhLEdBQUcsS0FBSyxDQUFDLEVBQUUsRUFBQztBQUN2QyxVQUFVLElBQUksV0FBVyxHQUFHLGFBQWEsR0FBRyxFQUFDO0FBQzdDO0FBQ0EsVUFBVTtBQUNWLFlBQVksS0FBSyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJO0FBQzVDLFlBQVksS0FBSyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJO0FBQzVDLFlBQVksS0FBSyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJO0FBQzVDLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN0QyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxhQUFhLEdBQUcsQ0FBQyxDQUFDO0FBQzlDLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQztBQUN4QyxZQUFZO0FBQ1osWUFBWSxRQUFRLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUM7QUFDN0UsV0FBVztBQUNYLFNBQVM7QUFDVCxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ2hCLE1BQU0sT0FBTyxLQUFLO0FBQ2xCLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxJQUFJLFdBQVcsR0FBRyxHQUFFO0FBQ3hCLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN0RCxNQUFNLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDekIsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQzlCLFFBQVEsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDbEMsT0FBTztBQUNQLE1BQU0sU0FBUyxHQUFFO0FBQ2pCLEtBQUs7QUFDTDtBQUNBLElBQUksT0FBTyxXQUFXO0FBQ3RCLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxTQUFTLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ3BDLElBQUksSUFBSSxNQUFNLEdBQUcsR0FBRTtBQUNuQjtBQUNBLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUU7QUFDeEMsTUFBTSxNQUFNLEdBQUcsTUFBSztBQUNwQixLQUFLLE1BQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUU7QUFDL0MsTUFBTSxNQUFNLEdBQUcsUUFBTztBQUN0QixLQUFLLE1BQU07QUFDWCxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLEVBQUU7QUFDL0IsUUFBUSxJQUFJLGFBQWEsR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFDO0FBQzFELFFBQVEsTUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEdBQUcsY0FBYTtBQUMxRCxPQUFPO0FBQ1A7QUFDQSxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRTtBQUN6RCxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLEVBQUU7QUFDakMsVUFBVSxNQUFNLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDM0MsU0FBUztBQUNULFFBQVEsTUFBTSxJQUFJLElBQUc7QUFDckIsT0FBTztBQUNQO0FBQ0EsTUFBTSxNQUFNLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUM7QUFDbEM7QUFDQSxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQ3ZDLFFBQVEsTUFBTSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRTtBQUNwRCxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0EsSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFDO0FBQ25CLElBQUksSUFBSSxRQUFRLEVBQUUsRUFBRTtBQUNwQixNQUFNLElBQUksWUFBWSxFQUFFLEVBQUU7QUFDMUIsUUFBUSxNQUFNLElBQUksSUFBRztBQUNyQixPQUFPLE1BQU07QUFDYixRQUFRLE1BQU0sSUFBSSxJQUFHO0FBQ3JCLE9BQU87QUFDUCxLQUFLO0FBQ0wsSUFBSSxTQUFTLEdBQUU7QUFDZjtBQUNBLElBQUksT0FBTyxNQUFNO0FBQ2pCLEdBQUc7QUFDSDtBQUNBLEVBQUUsU0FBUyxZQUFZLENBQUMsSUFBSSxFQUFFO0FBQzlCLElBQUksT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQztBQUMzRCxHQUFHO0FBQ0g7QUFDQSxFQUFFLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7QUFDbkMsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDbkQ7QUFDQSxNQUFNLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRTtBQUNwQixRQUFRLENBQUMsSUFBSSxFQUFDO0FBQ2QsUUFBUSxRQUFRO0FBQ2hCLE9BQU87QUFDUDtBQUNBO0FBQ0EsTUFBTSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxLQUFLLEVBQUUsUUFBUTtBQUNoRTtBQUNBLE1BQU0sSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBQztBQUMxQixNQUFNLElBQUksVUFBVSxHQUFHLENBQUMsR0FBRyxPQUFNO0FBQ2pDLE1BQU0sSUFBSSxLQUFLLEdBQUcsVUFBVSxHQUFHLElBQUc7QUFDbEM7QUFDQSxNQUFNLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7QUFDdEQsUUFBUSxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFO0FBQ2pDLFVBQVUsSUFBSSxVQUFVLEdBQUcsQ0FBQyxFQUFFO0FBQzlCLFlBQVksSUFBSSxLQUFLLENBQUMsS0FBSyxLQUFLLEtBQUssRUFBRSxPQUFPLElBQUk7QUFDbEQsV0FBVyxNQUFNO0FBQ2pCLFlBQVksSUFBSSxLQUFLLENBQUMsS0FBSyxLQUFLLEtBQUssRUFBRSxPQUFPLElBQUk7QUFDbEQsV0FBVztBQUNYLFVBQVUsUUFBUTtBQUNsQixTQUFTO0FBQ1Q7QUFDQTtBQUNBLFFBQVEsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLEdBQUcsRUFBRSxPQUFPLElBQUk7QUFDakU7QUFDQSxRQUFRLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUM7QUFDaEMsUUFBUSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTTtBQUMxQjtBQUNBLFFBQVEsSUFBSSxPQUFPLEdBQUcsTUFBSztBQUMzQixRQUFRLE9BQU8sQ0FBQyxLQUFLLE1BQU0sRUFBRTtBQUM3QixVQUFVLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRTtBQUNoQyxZQUFZLE9BQU8sR0FBRyxLQUFJO0FBQzFCLFlBQVksS0FBSztBQUNqQixXQUFXO0FBQ1gsVUFBVSxDQUFDLElBQUksT0FBTTtBQUNyQixTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxJQUFJO0FBQ2pDLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQSxJQUFJLE9BQU8sS0FBSztBQUNoQixHQUFHO0FBQ0g7QUFDQSxFQUFFLFNBQVMsYUFBYSxDQUFDLEtBQUssRUFBRTtBQUNoQyxJQUFJLE9BQU8sUUFBUSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDcEQsR0FBRztBQUNIO0FBQ0EsRUFBRSxTQUFTLFFBQVEsR0FBRztBQUN0QixJQUFJLE9BQU8sYUFBYSxDQUFDLElBQUksQ0FBQztBQUM5QixHQUFHO0FBQ0g7QUFDQSxFQUFFLFNBQVMsWUFBWSxHQUFHO0FBQzFCLElBQUksT0FBTyxRQUFRLEVBQUUsSUFBSSxjQUFjLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQztBQUN0RCxHQUFHO0FBQ0g7QUFDQSxFQUFFLFNBQVMsWUFBWSxHQUFHO0FBQzFCLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLGNBQWMsRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDO0FBQ3ZELEdBQUc7QUFDSDtBQUNBLEVBQUUsU0FBUyxxQkFBcUIsR0FBRztBQUNuQyxJQUFJLElBQUksTUFBTSxHQUFHLEdBQUU7QUFDbkIsSUFBSSxJQUFJLE9BQU8sR0FBRyxHQUFFO0FBQ3BCLElBQUksSUFBSSxVQUFVLEdBQUcsRUFBQztBQUN0QixJQUFJLElBQUksUUFBUSxHQUFHLEVBQUM7QUFDcEI7QUFDQSxJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNuRCxNQUFNLFFBQVEsR0FBRyxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksRUFBQztBQUNuQyxNQUFNLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRTtBQUNwQixRQUFRLENBQUMsSUFBSSxFQUFDO0FBQ2QsUUFBUSxRQUFRO0FBQ2hCLE9BQU87QUFDUDtBQUNBLE1BQU0sSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBQztBQUMxQixNQUFNLElBQUksS0FBSyxFQUFFO0FBQ2pCLFFBQVEsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFDO0FBQzlFLFFBQVEsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtBQUNuQyxVQUFVLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFDO0FBQ2hDLFNBQVM7QUFDVCxRQUFRLFVBQVUsR0FBRTtBQUNwQixPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLElBQUksVUFBVSxLQUFLLENBQUMsRUFBRTtBQUMxQixNQUFNLE9BQU8sSUFBSTtBQUNqQixLQUFLLE1BQU07QUFDWDtBQUNBLE1BQU0sVUFBVSxLQUFLLENBQUM7QUFDdEIsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDcEQsTUFBTTtBQUNOLE1BQU0sT0FBTyxJQUFJO0FBQ2pCLEtBQUssTUFBTSxJQUFJLFVBQVUsS0FBSyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ2xEO0FBQ0EsTUFBTSxJQUFJLEdBQUcsR0FBRyxFQUFDO0FBQ2pCLE1BQU0sSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLE9BQU07QUFDOUIsTUFBTSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3BDLFFBQVEsR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLEVBQUM7QUFDekIsT0FBTztBQUNQLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLEdBQUcsS0FBSyxHQUFHLEVBQUU7QUFDcEMsUUFBUSxPQUFPLElBQUk7QUFDbkIsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBLElBQUksT0FBTyxLQUFLO0FBQ2hCLEdBQUc7QUFDSDtBQUNBLEVBQUUsU0FBUyx1QkFBdUIsR0FBRztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxJQUFJLEtBQUssR0FBRyxHQUFFO0FBQ2xCLElBQUksSUFBSSxTQUFTLEdBQUcsR0FBRTtBQUN0QixJQUFJLElBQUksVUFBVSxHQUFHLE1BQUs7QUFDMUI7QUFDQSxJQUFJLE9BQU8sSUFBSSxFQUFFO0FBQ2pCLE1BQU0sSUFBSSxJQUFJLEdBQUcsU0FBUyxHQUFFO0FBQzVCLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLO0FBQ3RCLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUM7QUFDdEIsS0FBSztBQUNMO0FBQ0EsSUFBSSxPQUFPLElBQUksRUFBRTtBQUNqQjtBQUNBO0FBQ0EsTUFBTSxJQUFJLEdBQUcsR0FBRyxZQUFZLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFDO0FBQy9EO0FBQ0E7QUFDQSxNQUFNLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksU0FBUyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBQztBQUNoRSxNQUFNLElBQUksU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUMvQixRQUFRLFVBQVUsR0FBRyxLQUFJO0FBQ3pCLE9BQU87QUFDUDtBQUNBLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7QUFDekIsUUFBUSxLQUFLO0FBQ2IsT0FBTztBQUNQLE1BQU0sU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsRUFBQztBQUM1QixLQUFLO0FBQ0w7QUFDQSxJQUFJLE9BQU8sVUFBVTtBQUNyQixHQUFHO0FBQ0g7QUFDQSxFQUFFLFNBQVMsSUFBSSxDQUFDLElBQUksRUFBRTtBQUN0QixJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUM7QUFDakIsTUFBTSxJQUFJLEVBQUUsSUFBSTtBQUNoQixNQUFNLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ3ZDLE1BQU0sSUFBSSxFQUFFLElBQUk7QUFDaEIsTUFBTSxRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUNoRCxNQUFNLFNBQVMsRUFBRSxTQUFTO0FBQzFCLE1BQU0sVUFBVSxFQUFFLFVBQVU7QUFDNUIsTUFBTSxXQUFXLEVBQUUsV0FBVztBQUM5QixLQUFLLEVBQUM7QUFDTixHQUFHO0FBQ0g7QUFDQSxFQUFFLFNBQVMsU0FBUyxDQUFDLElBQUksRUFBRTtBQUMzQixJQUFJLElBQUksRUFBRSxHQUFHLEtBQUk7QUFDakIsSUFBSSxJQUFJLElBQUksR0FBRyxVQUFVLENBQUMsRUFBRSxFQUFDO0FBQzdCLElBQUksSUFBSSxDQUFDLElBQUksRUFBQztBQUNkO0FBQ0EsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFDO0FBQ3JDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFJO0FBQzNCO0FBQ0E7QUFDQSxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQ3RDLE1BQU0sSUFBSSxJQUFJLEtBQUssS0FBSyxFQUFFO0FBQzFCLFFBQVEsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsS0FBSTtBQUNsQyxPQUFPLE1BQU07QUFDYixRQUFRLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEtBQUk7QUFDbEMsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUNyQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsRUFBRSxHQUFFO0FBQzFELEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTtBQUN0QyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFFO0FBQzNDO0FBQ0E7QUFDQSxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQzFDLFFBQVEsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFDO0FBQ3JDLFFBQVEsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFDO0FBQ3ZDLFFBQVEsS0FBSyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEtBQUssQ0FBQyxhQUFhLEVBQUM7QUFDakQsUUFBUSxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsS0FBSTtBQUNuQyxPQUFPLE1BQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUU7QUFDakQsUUFBUSxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUM7QUFDckMsUUFBUSxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUM7QUFDdkMsUUFBUSxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQUcsS0FBSyxDQUFDLGFBQWEsRUFBQztBQUNqRCxRQUFRLEtBQUssQ0FBQyxhQUFhLENBQUMsR0FBRyxLQUFJO0FBQ25DLE9BQU87QUFDUDtBQUNBO0FBQ0EsTUFBTSxRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRTtBQUN2QixLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksSUFBSSxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDdEIsTUFBTSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzVELFFBQVE7QUFDUixVQUFVLElBQUksQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU07QUFDM0MsVUFBVSxRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7QUFDMUMsVUFBVTtBQUNWLFVBQVUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFJO0FBQzNDLFVBQVUsS0FBSztBQUNmLFNBQVM7QUFDVCxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3hCLE1BQU0sS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUM5RCxRQUFRO0FBQ1IsVUFBVSxJQUFJLENBQUMsRUFBRSxLQUFLLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNO0FBQzNDLFVBQVUsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO0FBQzlDLFVBQVU7QUFDVixVQUFVLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSTtBQUMvQyxVQUFVLEtBQUs7QUFDZixTQUFTO0FBQ1QsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNwQyxNQUFNLElBQUksSUFBSSxLQUFLLEdBQUcsRUFBRTtBQUN4QixRQUFRLFNBQVMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUU7QUFDaEMsT0FBTyxNQUFNO0FBQ2IsUUFBUSxTQUFTLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFFO0FBQ2hDLE9BQU87QUFDUCxLQUFLLE1BQU07QUFDWCxNQUFNLFNBQVMsR0FBRyxNQUFLO0FBQ3ZCLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxFQUFFO0FBQzdCLE1BQU0sVUFBVSxHQUFHLEVBQUM7QUFDcEIsS0FBSyxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRTtBQUM5RCxNQUFNLFVBQVUsR0FBRyxFQUFDO0FBQ3BCLEtBQUssTUFBTTtBQUNYLE1BQU0sVUFBVSxHQUFFO0FBQ2xCLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxJQUFJLEtBQUssS0FBSyxFQUFFO0FBQ3hCLE1BQU0sV0FBVyxHQUFFO0FBQ25CLEtBQUs7QUFDTCxJQUFJLElBQUksR0FBRyxVQUFVLENBQUMsSUFBSSxFQUFDO0FBQzNCLEdBQUc7QUFDSDtBQUNBLEVBQUUsU0FBUyxTQUFTLEdBQUc7QUFDdkIsSUFBSSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxHQUFFO0FBQzNCLElBQUksSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFO0FBQ3JCLE1BQU0sT0FBTyxJQUFJO0FBQ2pCLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLEtBQUk7QUFDdkIsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLE1BQUs7QUFDckIsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLEtBQUk7QUFDbkIsSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLFNBQVE7QUFDM0IsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDLFVBQVM7QUFDN0IsSUFBSSxVQUFVLEdBQUcsR0FBRyxDQUFDLFdBQVU7QUFDL0IsSUFBSSxXQUFXLEdBQUcsR0FBRyxDQUFDLFlBQVc7QUFDakM7QUFDQSxJQUFJLElBQUksRUFBRSxHQUFHLEtBQUk7QUFDakIsSUFBSSxJQUFJLElBQUksR0FBRyxVQUFVLENBQUMsSUFBSSxFQUFDO0FBQy9CO0FBQ0EsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFDO0FBQ3JDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQUs7QUFDdEMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUk7QUFDekI7QUFDQSxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ25DLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxJQUFJLEdBQUU7QUFDM0QsS0FBSyxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQzdDLE1BQU0sSUFBSSxNQUFLO0FBQ2YsTUFBTSxJQUFJLEVBQUUsS0FBSyxLQUFLLEVBQUU7QUFDeEIsUUFBUSxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFFO0FBQzVCLE9BQU8sTUFBTTtBQUNiLFFBQVEsS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRTtBQUM1QixPQUFPO0FBQ1AsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEdBQUU7QUFDaEQsS0FBSztBQUNMO0FBQ0EsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUU7QUFDOUQsTUFBTSxJQUFJLFdBQVcsRUFBRSxjQUFhO0FBQ3BDLE1BQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUU7QUFDMUMsUUFBUSxXQUFXLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFDO0FBQ2pDLFFBQVEsYUFBYSxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBQztBQUNuQyxPQUFPLE1BQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUU7QUFDakQsUUFBUSxXQUFXLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFDO0FBQ2pDLFFBQVEsYUFBYSxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBQztBQUNuQyxPQUFPO0FBQ1A7QUFDQSxNQUFNLEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBRyxLQUFLLENBQUMsYUFBYSxFQUFDO0FBQy9DLE1BQU0sS0FBSyxDQUFDLGFBQWEsQ0FBQyxHQUFHLEtBQUk7QUFDakMsS0FBSztBQUNMO0FBQ0EsSUFBSSxPQUFPLElBQUk7QUFDZixHQUFHO0FBQ0g7QUFDQTtBQUNBLEVBQUUsU0FBUyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQzFDLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUk7QUFDeEIsSUFBSSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRTtBQUNwQixJQUFJLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFLO0FBQzFCO0FBQ0EsSUFBSSxJQUFJLFdBQVcsR0FBRyxFQUFDO0FBQ3ZCLElBQUksSUFBSSxTQUFTLEdBQUcsRUFBQztBQUNyQixJQUFJLElBQUksU0FBUyxHQUFHLEVBQUM7QUFDckI7QUFDQSxJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDdEQsTUFBTSxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSTtBQUNwQyxNQUFNLElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFFO0FBQ2hDLE1BQU0sSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQUs7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLElBQUksS0FBSyxLQUFLLFdBQVcsSUFBSSxJQUFJLEtBQUssVUFBVSxJQUFJLEVBQUUsS0FBSyxRQUFRLEVBQUU7QUFDM0UsUUFBUSxXQUFXLEdBQUU7QUFDckI7QUFDQSxRQUFRLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRTtBQUM3QyxVQUFVLFNBQVMsR0FBRTtBQUNyQixTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRTtBQUM3QyxVQUFVLFNBQVMsR0FBRTtBQUNyQixTQUFTO0FBQ1QsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxXQUFXLEdBQUcsQ0FBQyxFQUFFO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBLE1BQU0sSUFBSSxTQUFTLEdBQUcsQ0FBQyxJQUFJLFNBQVMsR0FBRyxDQUFDLEVBQUU7QUFDMUMsUUFBUSxPQUFPLFNBQVMsQ0FBQyxJQUFJLENBQUM7QUFDOUIsT0FBTyxNQUFNLElBQUksU0FBUyxHQUFHLENBQUMsRUFBRTtBQUNoQztBQUNBO0FBQ0E7QUFDQSxRQUFRLE9BQU8sU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDeEMsT0FBTyxNQUFNO0FBQ2I7QUFDQSxRQUFRLE9BQU8sU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDeEMsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBLElBQUksT0FBTyxFQUFFO0FBQ2IsR0FBRztBQUNIO0FBQ0EsRUFBRSxTQUFTLGdCQUFnQixDQUFDLEdBQUcsRUFBRTtBQUNqQyxJQUFJLElBQUksVUFBVSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFDO0FBQ2xDLElBQUksSUFBSSxVQUFVLElBQUksR0FBRyxJQUFJLFVBQVUsSUFBSSxHQUFHLEVBQUU7QUFDaEQsTUFBTSxJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLGtCQUFrQixFQUFDO0FBQ2pELE1BQU0sSUFBSSxPQUFPLEVBQUU7QUFDbkIsUUFBUSxPQUFPLFNBQVM7QUFDeEIsT0FBTztBQUNQLE1BQU0sT0FBTyxJQUFJO0FBQ2pCLEtBQUs7QUFDTCxJQUFJLFVBQVUsR0FBRyxVQUFVLENBQUMsV0FBVyxHQUFFO0FBQ3pDLElBQUksSUFBSSxVQUFVLEtBQUssR0FBRyxFQUFFO0FBQzVCLE1BQU0sT0FBTyxJQUFJO0FBQ2pCLEtBQUs7QUFDTCxJQUFJLE9BQU8sVUFBVTtBQUNyQixHQUFHO0FBQ0gsRUFBRSxTQUFTLEtBQUssR0FBRztBQUNuQixJQUFJLElBQUksQ0FBQyxHQUFHLGtDQUFpQztBQUM3QyxJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNuRDtBQUNBLE1BQU0sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ3pCLFFBQVEsQ0FBQyxJQUFJLEdBQUcsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSTtBQUM3QyxPQUFPO0FBQ1A7QUFDQTtBQUNBLE1BQU0sSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFO0FBQzVCLFFBQVEsQ0FBQyxJQUFJLE1BQUs7QUFDbEIsT0FBTyxNQUFNO0FBQ2IsUUFBUSxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSTtBQUNqQyxRQUFRLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFLO0FBQ2xDLFFBQVEsSUFBSSxNQUFNLEdBQUcsS0FBSyxLQUFLLEtBQUssR0FBRyxLQUFLLENBQUMsV0FBVyxFQUFFLEdBQUcsS0FBSyxDQUFDLFdBQVcsR0FBRTtBQUNoRixRQUFRLENBQUMsSUFBSSxHQUFHLEdBQUcsTUFBTSxHQUFHLElBQUc7QUFDL0IsT0FBTztBQUNQO0FBQ0EsTUFBTSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLEVBQUU7QUFDMUIsUUFBUSxDQUFDLElBQUksTUFBSztBQUNsQixRQUFRLENBQUMsSUFBSSxFQUFDO0FBQ2QsT0FBTztBQUNQLEtBQUs7QUFDTCxJQUFJLENBQUMsSUFBSSxrQ0FBaUM7QUFDMUMsSUFBSSxDQUFDLElBQUksZ0NBQStCO0FBQ3hDO0FBQ0EsSUFBSSxPQUFPLENBQUM7QUFDWixHQUFHO0FBQ0g7QUFDQTtBQUNBLEVBQUUsU0FBUyxhQUFhLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtBQUN2QztBQUNBLElBQUksSUFBSSxVQUFVLEdBQUcsWUFBWSxDQUFDLElBQUksRUFBQztBQUN2QztBQUNBLElBQUksSUFBSSxvQkFBb0IsR0FBRyxNQUFLO0FBQ3BDO0FBQ0EsSUFBSSxJQUFJLE1BQU0sRUFBRTtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sSUFBSSxPQUFPLEdBQUcsVUFBVSxDQUFDLEtBQUs7QUFDcEMsUUFBUSw0REFBNEQ7QUFDcEUsUUFBTztBQUNQLE1BQU0sSUFBSSxPQUFPLEVBQUU7QUFDbkIsUUFBUSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsQ0FBQyxFQUFDO0FBQzlCLFFBQVEsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsRUFBQztBQUM3QixRQUFRLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxDQUFDLEVBQUM7QUFDM0IsUUFBUSxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsQ0FBQyxFQUFDO0FBQ2xDO0FBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO0FBQzlCLFVBQVUsb0JBQW9CLEdBQUcsS0FBSTtBQUNyQyxTQUFTO0FBQ1QsT0FBTyxNQUFNO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLElBQUksT0FBTyxHQUFHLFVBQVUsQ0FBQyxLQUFLO0FBQ3RDLFVBQVUsOERBQThEO0FBQ3hFLFVBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxPQUFPLEVBQUU7QUFDckIsVUFBVSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsQ0FBQyxFQUFDO0FBQ2hDLFVBQVUsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsRUFBQztBQUMvQixVQUFVLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxDQUFDLEVBQUM7QUFDN0IsVUFBVSxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsQ0FBQyxFQUFDO0FBQ3BDO0FBQ0EsVUFBVSxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO0FBQ2hDLFlBQVksSUFBSSxvQkFBb0IsR0FBRyxLQUFJO0FBQzNDLFdBQVc7QUFDWCxTQUFTO0FBQ1QsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxVQUFVLEdBQUcsZ0JBQWdCLENBQUMsVUFBVSxFQUFDO0FBQ2pELElBQUksSUFBSSxLQUFLLEdBQUcsY0FBYyxDQUFDO0FBQy9CLE1BQU0sS0FBSyxFQUFFLElBQUk7QUFDakIsTUFBTSxLQUFLLEVBQUUsS0FBSyxHQUFHLEtBQUssR0FBRyxVQUFVO0FBQ3ZDLEtBQUssRUFBQztBQUNOO0FBQ0EsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3REO0FBQ0E7QUFDQSxNQUFNLElBQUksVUFBVSxLQUFLLFlBQVksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDckUsUUFBUSxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDdkIsT0FBTyxNQUFNO0FBQ2IsUUFBUSxJQUFJLE1BQU0sSUFBSSxPQUFPLEVBQUU7QUFDL0I7QUFDQTtBQUNBLFVBQVU7QUFDVixZQUFZLENBQUMsQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLO0FBQzVELFlBQVksT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO0FBQzFDLFlBQVksT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ3RDLGFBQWEsQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDLFdBQVcsRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7QUFDekUsWUFBWTtBQUNaLFlBQVksT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQzNCLFdBQVcsTUFBTSxJQUFJLG9CQUFvQixFQUFFO0FBQzNDO0FBQ0E7QUFDQSxZQUFZLElBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFDO0FBQ2pELFlBQVk7QUFDWixjQUFjLENBQUMsQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLO0FBQzlELGNBQWMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ3hDLGVBQWUsSUFBSSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RELGVBQWUsQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDLFdBQVcsRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7QUFDM0UsY0FBYztBQUNkLGNBQWMsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQzdCLGFBQWE7QUFDYixXQUFXO0FBQ1gsU0FBUztBQUNULE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQSxJQUFJLE9BQU8sSUFBSTtBQUNmLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFO0FBQ25CLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQztBQUNqQixHQUFHO0FBQ0g7QUFDQSxFQUFFLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRTtBQUNuQixJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUU7QUFDakIsR0FBRztBQUNIO0FBQ0EsRUFBRSxTQUFTLFNBQVMsQ0FBQyxDQUFDLEVBQUU7QUFDeEIsSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ25CLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUM7QUFDakIsSUFBSSxPQUFPLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzFFLEdBQUc7QUFDSDtBQUNBLEVBQUUsU0FBUyxVQUFVLENBQUMsQ0FBQyxFQUFFO0FBQ3pCLElBQUksT0FBTyxDQUFDLEtBQUssS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLO0FBQ3RDLEdBQUc7QUFDSDtBQUNBLEVBQUUsU0FBUyxRQUFRLENBQUMsQ0FBQyxFQUFFO0FBQ3ZCLElBQUksT0FBTyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6QyxHQUFHO0FBQ0g7QUFDQTtBQUNBLEVBQUUsU0FBUyxXQUFXLENBQUMsU0FBUyxFQUFFO0FBQ2xDLElBQUksSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLFNBQVMsRUFBQztBQUMvQixJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsV0FBVyxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBQztBQUNqRSxJQUFJLElBQUksQ0FBQyxFQUFFLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUM7QUFDaEMsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFDO0FBQ3BDO0FBQ0EsSUFBSSxJQUFJLEtBQUssR0FBRyxHQUFFO0FBQ2xCO0FBQ0EsSUFBSSxLQUFLLElBQUksSUFBSSxJQUFJLElBQUksRUFBRTtBQUMzQixNQUFNLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDbkMsUUFBUSxLQUFLLElBQUksS0FBSyxDQUFDLElBQUksRUFBQztBQUM1QixPQUFPO0FBQ1AsS0FBSztBQUNMLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFLO0FBQ3RCO0FBQ0EsSUFBSSxPQUFPLElBQUk7QUFDZixHQUFHO0FBQ0g7QUFDQSxFQUFFLFNBQVMsS0FBSyxDQUFDLEdBQUcsRUFBRTtBQUN0QixJQUFJLElBQUksSUFBSSxHQUFHLEdBQUcsWUFBWSxLQUFLLEdBQUcsRUFBRSxHQUFHLEdBQUU7QUFDN0M7QUFDQSxJQUFJLEtBQUssSUFBSSxRQUFRLElBQUksR0FBRyxFQUFFO0FBQzlCLE1BQU0sSUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLEVBQUU7QUFDeEMsUUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBQztBQUM3QyxPQUFPLE1BQU07QUFDYixRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLENBQUMsUUFBUSxFQUFDO0FBQ3RDLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQSxJQUFJLE9BQU8sSUFBSTtBQUNmLEdBQUc7QUFDSDtBQUNBLEVBQUUsU0FBUyxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQ3JCLElBQUksT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUM7QUFDeEMsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxTQUFTLEtBQUssQ0FBQyxLQUFLLEVBQUU7QUFDeEIsSUFBSSxJQUFJLEtBQUssR0FBRyxjQUFjLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUM7QUFDaEQsSUFBSSxJQUFJLEtBQUssR0FBRyxFQUFDO0FBQ2pCLElBQUksSUFBSSxLQUFLLEdBQUcsS0FBSTtBQUNwQjtBQUNBLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN0RCxNQUFNLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDekIsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ2pDLFFBQVEsSUFBSSxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUMzQixVQUFVLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFDO0FBQzVDLFVBQVUsS0FBSyxJQUFJLFlBQVc7QUFDOUIsU0FBUyxNQUFNO0FBQ2YsVUFBVSxLQUFLLEdBQUU7QUFDakIsU0FBUztBQUNULE9BQU87QUFDUCxNQUFNLFNBQVMsR0FBRTtBQUNqQixLQUFLO0FBQ0w7QUFDQSxJQUFJLE9BQU8sS0FBSztBQUNoQixHQUFHO0FBQ0g7QUFDQSxFQUFFLE9BQU87QUFDVDtBQUNBO0FBQ0E7QUFDQSxJQUFJLEtBQUssRUFBRSxLQUFLO0FBQ2hCLElBQUksS0FBSyxFQUFFLEtBQUs7QUFDaEIsSUFBSSxJQUFJLEVBQUUsSUFBSTtBQUNkLElBQUksTUFBTSxFQUFFLE1BQU07QUFDbEIsSUFBSSxNQUFNLEVBQUUsTUFBTTtBQUNsQixJQUFJLElBQUksRUFBRSxJQUFJO0FBQ2QsSUFBSSxLQUFLLEVBQUUsS0FBSztBQUNoQixJQUFJLElBQUksRUFBRSxJQUFJO0FBQ2QsSUFBSSxPQUFPLEVBQUUsQ0FBQyxZQUFZO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sSUFBSSxJQUFJLEdBQUcsR0FBRTtBQUNuQixNQUFNLEtBQUssSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNyRCxRQUFRLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRTtBQUN0QixVQUFVLENBQUMsSUFBSSxFQUFDO0FBQ2hCLFVBQVUsUUFBUTtBQUNsQixTQUFTO0FBQ1QsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBQztBQUMvQixPQUFPO0FBQ1AsTUFBTSxPQUFPLElBQUk7QUFDakIsS0FBSyxHQUFHO0FBQ1IsSUFBSSxLQUFLLEVBQUUsS0FBSztBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksSUFBSSxFQUFFLFVBQVUsR0FBRyxFQUFFO0FBQ3pCLE1BQU0sT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ3RCLEtBQUs7QUFDTDtBQUNBLElBQUksS0FBSyxFQUFFLFlBQVk7QUFDdkIsTUFBTSxPQUFPLEtBQUssRUFBRTtBQUNwQixLQUFLO0FBQ0w7QUFDQSxJQUFJLEtBQUssRUFBRSxVQUFVLE9BQU8sRUFBRTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLElBQUksVUFBVSxHQUFHLGNBQWMsQ0FBQyxPQUFPLEVBQUM7QUFDOUMsTUFBTSxJQUFJLEtBQUssR0FBRyxHQUFFO0FBQ3BCO0FBQ0EsTUFBTSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzdEO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUixVQUFVLE9BQU8sT0FBTyxLQUFLLFdBQVc7QUFDeEMsVUFBVSxTQUFTLElBQUksT0FBTztBQUM5QixVQUFVLE9BQU8sQ0FBQyxPQUFPO0FBQ3pCLFVBQVU7QUFDVixVQUFVLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQ2hELFNBQVMsTUFBTTtBQUNmLFVBQVUsS0FBSyxDQUFDLElBQUk7QUFDcEIsWUFBWSxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZFLFlBQVc7QUFDWCxTQUFTO0FBQ1QsT0FBTztBQUNQO0FBQ0EsTUFBTSxPQUFPLEtBQUs7QUFDbEIsS0FBSztBQUNMO0FBQ0EsSUFBSSxRQUFRLEVBQUUsWUFBWTtBQUMxQixNQUFNLE9BQU8sUUFBUSxFQUFFO0FBQ3ZCLEtBQUs7QUFDTDtBQUNBLElBQUksWUFBWSxFQUFFLFlBQVk7QUFDOUIsTUFBTSxPQUFPLFlBQVksRUFBRTtBQUMzQixLQUFLO0FBQ0w7QUFDQSxJQUFJLFlBQVksRUFBRSxZQUFZO0FBQzlCLE1BQU0sT0FBTyxZQUFZLEVBQUU7QUFDM0IsS0FBSztBQUNMO0FBQ0EsSUFBSSxPQUFPLEVBQUUsWUFBWTtBQUN6QixNQUFNO0FBQ04sUUFBUSxVQUFVLElBQUksR0FBRztBQUN6QixRQUFRLFlBQVksRUFBRTtBQUN0QixRQUFRLHFCQUFxQixFQUFFO0FBQy9CLFFBQVEsdUJBQXVCLEVBQUU7QUFDakMsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBLElBQUkscUJBQXFCLEVBQUUsWUFBWTtBQUN2QyxNQUFNLE9BQU8scUJBQXFCLEVBQUU7QUFDcEMsS0FBSztBQUNMO0FBQ0EsSUFBSSx1QkFBdUIsRUFBRSxZQUFZO0FBQ3pDLE1BQU0sT0FBTyx1QkFBdUIsRUFBRTtBQUN0QyxLQUFLO0FBQ0w7QUFDQSxJQUFJLFNBQVMsRUFBRSxZQUFZO0FBQzNCLE1BQU07QUFDTixRQUFRLFVBQVUsSUFBSSxHQUFHO0FBQ3pCLFFBQVEsWUFBWSxFQUFFO0FBQ3RCLFFBQVEsWUFBWSxFQUFFO0FBQ3RCLFFBQVEscUJBQXFCLEVBQUU7QUFDL0IsUUFBUSx1QkFBdUIsRUFBRTtBQUNqQyxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0EsSUFBSSxZQUFZLEVBQUUsVUFBVSxHQUFHLEVBQUU7QUFDakMsTUFBTSxPQUFPLFlBQVksQ0FBQyxHQUFHLENBQUM7QUFDOUIsS0FBSztBQUNMO0FBQ0EsSUFBSSxHQUFHLEVBQUUsWUFBWTtBQUNyQixNQUFNLE9BQU8sWUFBWSxFQUFFO0FBQzNCLEtBQUs7QUFDTDtBQUNBLElBQUksS0FBSyxFQUFFLFlBQVk7QUFDdkIsTUFBTSxJQUFJLE1BQU0sR0FBRyxFQUFFO0FBQ3JCLFFBQVEsR0FBRyxHQUFHLEdBQUU7QUFDaEI7QUFDQSxNQUFNLEtBQUssSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNyRCxRQUFRLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRTtBQUM5QixVQUFVLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFDO0FBQ3hCLFNBQVMsTUFBTTtBQUNmLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUM7QUFDbEUsU0FBUztBQUNULFFBQVEsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxFQUFFO0FBQzVCLFVBQVUsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUM7QUFDMUIsVUFBVSxHQUFHLEdBQUcsR0FBRTtBQUNsQixVQUFVLENBQUMsSUFBSSxFQUFDO0FBQ2hCLFNBQVM7QUFDVCxPQUFPO0FBQ1A7QUFDQSxNQUFNLE9BQU8sTUFBTTtBQUNuQixLQUFLO0FBQ0w7QUFDQSxJQUFJLEdBQUcsRUFBRSxVQUFVLE9BQU8sRUFBRTtBQUM1QjtBQUNBO0FBQ0E7QUFDQSxNQUFNLElBQUksT0FBTztBQUNqQixRQUFRLE9BQU8sT0FBTyxLQUFLLFFBQVEsSUFBSSxPQUFPLE9BQU8sQ0FBQyxZQUFZLEtBQUssUUFBUTtBQUMvRSxZQUFZLE9BQU8sQ0FBQyxZQUFZO0FBQ2hDLFlBQVksS0FBSTtBQUNoQixNQUFNLElBQUksU0FBUztBQUNuQixRQUFRLE9BQU8sT0FBTyxLQUFLLFFBQVEsSUFBSSxPQUFPLE9BQU8sQ0FBQyxTQUFTLEtBQUssUUFBUTtBQUM1RSxZQUFZLE9BQU8sQ0FBQyxTQUFTO0FBQzdCLFlBQVksRUFBQztBQUNiLE1BQU0sSUFBSSxNQUFNLEdBQUcsR0FBRTtBQUNyQixNQUFNLElBQUksYUFBYSxHQUFHLE1BQUs7QUFDL0I7QUFDQTtBQUNBLE1BQU0sS0FBSyxJQUFJLENBQUMsSUFBSSxNQUFNLEVBQUU7QUFDNUI7QUFDQTtBQUNBO0FBQ0EsUUFBUSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsT0FBTyxFQUFDO0FBQ2hFLFFBQVEsYUFBYSxHQUFHLEtBQUk7QUFDNUIsT0FBTztBQUNQO0FBQ0EsTUFBTSxJQUFJLGFBQWEsSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFO0FBQzNDLFFBQVEsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUM7QUFDNUIsT0FBTztBQUNQO0FBQ0EsTUFBTSxJQUFJLGNBQWMsR0FBRyxVQUFVLFdBQVcsRUFBRTtBQUNsRCxRQUFRLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxZQUFZLEVBQUUsRUFBQztBQUM5QyxRQUFRLElBQUksT0FBTyxPQUFPLEtBQUssV0FBVyxFQUFFO0FBQzVDLFVBQVUsSUFBSSxTQUFTLEdBQUcsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUU7QUFDM0QsVUFBVSxXQUFXLEdBQUcsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsRUFBQztBQUNoRSxTQUFTO0FBQ1QsUUFBUSxPQUFPLFdBQVc7QUFDMUIsUUFBTztBQUNQO0FBQ0E7QUFDQSxNQUFNLElBQUksZ0JBQWdCLEdBQUcsR0FBRTtBQUMvQixNQUFNLE9BQU8sT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDakMsUUFBUSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUM7QUFDMUMsT0FBTztBQUNQO0FBQ0EsTUFBTSxJQUFJLEtBQUssR0FBRyxHQUFFO0FBQ3BCLE1BQU0sSUFBSSxXQUFXLEdBQUcsR0FBRTtBQUMxQjtBQUNBO0FBQ0EsTUFBTSxJQUFJLGdCQUFnQixDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDekMsUUFBUSxLQUFLLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsRUFBQztBQUN0QyxPQUFPO0FBQ1A7QUFDQTtBQUNBLE1BQU0sT0FBTyxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQzFDLFFBQVEsV0FBVyxHQUFHLGNBQWMsQ0FBQyxXQUFXLEVBQUM7QUFDakQsUUFBUSxJQUFJLElBQUksR0FBRyxnQkFBZ0IsQ0FBQyxHQUFHLEdBQUU7QUFDekM7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxHQUFHLEVBQUU7QUFDbkQsVUFBVSxXQUFXLEdBQUcsV0FBVyxHQUFHLFFBQU87QUFDN0MsU0FBUyxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxHQUFHLEVBQUU7QUFDdkM7QUFDQSxVQUFVLElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRTtBQUNsQyxZQUFZLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFDO0FBQ25DLFdBQVc7QUFDWCxVQUFVLFdBQVcsR0FBRyxXQUFXLEdBQUcsSUFBRztBQUN6QyxTQUFTO0FBQ1Q7QUFDQSxRQUFRLFdBQVc7QUFDbkIsVUFBVSxXQUFXLEdBQUcsR0FBRyxHQUFHLFdBQVcsQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUM7QUFDaEYsUUFBUSxTQUFTLENBQUMsSUFBSSxFQUFDO0FBQ3ZCLE9BQU87QUFDUDtBQUNBO0FBQ0EsTUFBTSxJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUU7QUFDOUIsUUFBUSxLQUFLLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsRUFBQztBQUMvQyxPQUFPO0FBQ1A7QUFDQTtBQUNBLE1BQU0sSUFBSSxPQUFPLE1BQU0sQ0FBQyxNQUFNLEtBQUssV0FBVyxFQUFFO0FBQ2hELFFBQVEsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFDO0FBQ2pDLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sSUFBSSxTQUFTLEtBQUssQ0FBQyxFQUFFO0FBQzNCLFFBQVEsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ2hELE9BQU87QUFDUDtBQUNBLE1BQU0sSUFBSSxLQUFLLEdBQUcsWUFBWTtBQUM5QixRQUFRLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO0FBQ3BFLFVBQVUsTUFBTSxDQUFDLEdBQUcsR0FBRTtBQUN0QixVQUFVLE9BQU8sSUFBSTtBQUNyQixTQUFTO0FBQ1QsUUFBUSxPQUFPLEtBQUs7QUFDcEIsUUFBTztBQUNQO0FBQ0E7QUFDQSxNQUFNLElBQUksWUFBWSxHQUFHLFVBQVUsS0FBSyxFQUFFLElBQUksRUFBRTtBQUNoRCxRQUFRLEtBQUssSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUMzQyxVQUFVLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDdEIsWUFBWSxRQUFRO0FBQ3BCLFdBQVc7QUFDWCxVQUFVLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsU0FBUyxFQUFFO0FBQ2hELFlBQVksT0FBTyxLQUFLLEVBQUUsRUFBRTtBQUM1QixjQUFjLEtBQUssR0FBRTtBQUNyQixhQUFhO0FBQ2IsWUFBWSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBQztBQUNoQyxZQUFZLEtBQUssR0FBRyxFQUFDO0FBQ3JCLFdBQVc7QUFDWCxVQUFVLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFDO0FBQzVCLFVBQVUsS0FBSyxJQUFJLEtBQUssQ0FBQyxPQUFNO0FBQy9CLFVBQVUsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUM7QUFDMUIsVUFBVSxLQUFLLEdBQUU7QUFDakIsU0FBUztBQUNULFFBQVEsSUFBSSxLQUFLLEVBQUUsRUFBRTtBQUNyQixVQUFVLEtBQUssR0FBRTtBQUNqQixTQUFTO0FBQ1QsUUFBUSxPQUFPLEtBQUs7QUFDcEIsUUFBTztBQUNQO0FBQ0E7QUFDQSxNQUFNLElBQUksYUFBYSxHQUFHLEVBQUM7QUFDM0IsTUFBTSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUM3QyxRQUFRLElBQUksYUFBYSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxFQUFFO0FBQ3pELFVBQVUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ3RDLFlBQVksYUFBYSxHQUFHLFlBQVksQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQ2pFLFlBQVksUUFBUTtBQUNwQixXQUFXO0FBQ1gsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLFNBQVMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ3BFO0FBQ0EsVUFBVSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtBQUNqRCxZQUFZLE1BQU0sQ0FBQyxHQUFHLEdBQUU7QUFDeEIsV0FBVztBQUNYO0FBQ0EsVUFBVSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBQztBQUM5QixVQUFVLGFBQWEsR0FBRyxFQUFDO0FBQzNCLFNBQVMsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDNUIsVUFBVSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBQztBQUMxQixVQUFVLGFBQWEsR0FBRTtBQUN6QixTQUFTO0FBQ1QsUUFBUSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBQztBQUM3QixRQUFRLGFBQWEsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTTtBQUN4QyxPQUFPO0FBQ1A7QUFDQSxNQUFNLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7QUFDNUIsS0FBSztBQUNMO0FBQ0EsSUFBSSxRQUFRLEVBQUUsVUFBVSxHQUFHLEVBQUUsT0FBTyxFQUFFO0FBQ3RDO0FBQ0E7QUFDQSxNQUFNLElBQUksTUFBTTtBQUNoQixRQUFRLE9BQU8sT0FBTyxLQUFLLFdBQVcsSUFBSSxRQUFRLElBQUksT0FBTztBQUM3RCxZQUFZLE9BQU8sQ0FBQyxNQUFNO0FBQzFCLFlBQVksTUFBSztBQUNqQjtBQUNBLE1BQU0sU0FBUyxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQ3pCLFFBQVEsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUM7QUFDdkMsT0FBTztBQVFQO0FBQ0EsTUFBTSxTQUFTLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUU7QUFDakQsUUFBUSxJQUFJLFlBQVk7QUFDeEIsVUFBVSxPQUFPLE9BQU8sS0FBSyxRQUFRO0FBQ3JDLFVBQVUsT0FBTyxPQUFPLENBQUMsWUFBWSxLQUFLLFFBQVE7QUFDbEQsY0FBYyxPQUFPLENBQUMsWUFBWTtBQUNsQyxjQUFjLFFBQU87QUFDckIsUUFBUSxJQUFJLFVBQVUsR0FBRyxHQUFFO0FBQzNCLFFBQVEsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBQztBQUNsRSxRQUFRLElBQUksR0FBRyxHQUFHLEdBQUU7QUFDcEIsUUFBUSxJQUFJLEtBQUssR0FBRyxHQUFFO0FBQ3RCO0FBQ0EsUUFBUSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNqRCxVQUFVLEdBQUcsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDRCQUE0QixFQUFFLElBQUksRUFBQztBQUN0RSxVQUFVLEtBQUssR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDRCQUE0QixFQUFFLElBQUksRUFBQztBQUN4RSxVQUFVLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDcEMsWUFBWSxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBSztBQUNuQyxXQUFXO0FBQ1gsU0FBUztBQUNUO0FBQ0EsUUFBUSxPQUFPLFVBQVU7QUFDekIsT0FBTztBQUNQO0FBQ0EsTUFBTSxJQUFJLFlBQVk7QUFDdEIsUUFBUSxPQUFPLE9BQU8sS0FBSyxRQUFRLElBQUksT0FBTyxPQUFPLENBQUMsWUFBWSxLQUFLLFFBQVE7QUFDL0UsWUFBWSxPQUFPLENBQUMsWUFBWTtBQUNoQyxZQUFZLFFBQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLElBQUksWUFBWSxHQUFHLElBQUksTUFBTTtBQUNuQyxRQUFRLFdBQVc7QUFDbkIsVUFBVSxJQUFJLENBQUMsWUFBWSxDQUFDO0FBQzVCLFVBQVUsV0FBVztBQUNyQixVQUFVLEtBQUs7QUFDZixVQUFVLElBQUksQ0FBQyxZQUFZLENBQUM7QUFDNUIsVUFBVSxNQUFNO0FBQ2hCLFFBQU87QUFDUDtBQUNBO0FBQ0EsTUFBTSxJQUFJLGFBQWEsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUNoRCxVQUFVLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25DLFVBQVUsR0FBRTtBQUNaO0FBQ0E7QUFDQSxNQUFNLEtBQUssR0FBRTtBQUNiO0FBQ0E7QUFDQSxNQUFNLElBQUksT0FBTyxHQUFHLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxPQUFPLEVBQUM7QUFDNUQsTUFBTSxLQUFLLElBQUksR0FBRyxJQUFJLE9BQU8sRUFBRTtBQUMvQixRQUFRLFVBQVUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQztBQUN2QyxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsTUFBTSxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLEVBQUU7QUFDcEMsUUFBUSxJQUFJLEVBQUUsS0FBSyxJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUU7QUFDL0Q7QUFDQSxVQUFVLE9BQU8sS0FBSztBQUN0QixTQUFTO0FBQ1QsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLElBQUksTUFBTSxHQUFHLFVBQVUsTUFBTSxFQUFFO0FBQ3JDLFFBQVEsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUNqQyxXQUFXLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRTtBQUM1QjtBQUNBO0FBQ0EsWUFBWSxPQUFPLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRztBQUN4QyxnQkFBZ0IsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO0FBQzVDLGdCQUFnQixrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRTtBQUN0RSxXQUFXLENBQUM7QUFDWixXQUFXLElBQUksQ0FBQyxFQUFFLENBQUM7QUFDbkIsUUFBTztBQUNQO0FBQ0EsTUFBTSxJQUFJLFFBQVEsR0FBRyxVQUFVLE1BQU0sRUFBRTtBQUN2QyxRQUFRLE9BQU8sTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDO0FBQ2pDLFlBQVksRUFBRTtBQUNkLFlBQVksa0JBQWtCLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZFLFFBQU87QUFDUDtBQUNBLE1BQU0sSUFBSSxjQUFjLEdBQUcsVUFBVSxNQUFNLEVBQUU7QUFDN0MsUUFBUSxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFDO0FBQ3pFLFFBQVEsT0FBTyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoRSxRQUFPO0FBQ1A7QUFDQSxNQUFNLElBQUksY0FBYyxHQUFHLFVBQVUsTUFBTSxFQUFFO0FBQzdDLFFBQVEsSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDNUQsVUFBVSxPQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzdELFNBQVM7QUFDVCxRQUFPO0FBQ1A7QUFDQTtBQUNBLE1BQU0sSUFBSSxFQUFFLEdBQUcsR0FBRztBQUNsQixTQUFTLE9BQU8sQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDO0FBQ25DLFNBQVMsT0FBTztBQUNoQjtBQUNBLFVBQVUsSUFBSSxNQUFNLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDO0FBQ3ZFLFVBQVUsVUFBVSxLQUFLLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRTtBQUMvQyxZQUFZLE9BQU8sT0FBTyxLQUFLLFNBQVM7QUFDeEMsZ0JBQWdCLGNBQWMsQ0FBQyxPQUFPLENBQUM7QUFDdkMsZ0JBQWdCLEdBQUcsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvRCxXQUFXO0FBQ1gsU0FBUztBQUNULFNBQVMsT0FBTyxDQUFDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUM7QUFDMUQ7QUFDQTtBQUNBLE1BQU0sSUFBSSxTQUFTLEdBQUcsb0JBQW1CO0FBQ3pDLE1BQU0sT0FBTyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ2pDLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsRUFBQztBQUN0QyxPQUFPO0FBQ1A7QUFDQTtBQUNBLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLEVBQUUsRUFBQztBQUMxQztBQUNBO0FBQ0EsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxFQUFDO0FBQ3BDO0FBQ0E7QUFDQSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUM7QUFDbkM7QUFDQTtBQUNBLE1BQU0sSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBQztBQUNuRDtBQUNBO0FBQ0EsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUM7QUFDN0QsTUFBTSxJQUFJLElBQUksR0FBRyxHQUFFO0FBQ25CO0FBQ0EsTUFBTSxJQUFJLE1BQU0sR0FBRyxHQUFFO0FBQ3JCO0FBQ0EsTUFBTSxLQUFLLElBQUksU0FBUyxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsRUFBRTtBQUNyRSxRQUFRLElBQUksT0FBTyxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUM7QUFDdEQsUUFBUSxJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7QUFDbkMsVUFBVSxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUMsR0FBRyxRQUFPO0FBQzVDLFVBQVUsUUFBUTtBQUNsQixTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFFLE1BQU0sRUFBQztBQUN0RDtBQUNBO0FBQ0EsUUFBUSxJQUFJLElBQUksSUFBSSxJQUFJLEVBQUU7QUFDMUI7QUFDQSxVQUFVLElBQUksbUJBQW1CLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQ2xFLFlBQVksTUFBTSxHQUFHLEtBQUssQ0FBQyxTQUFTLEVBQUM7QUFDckMsV0FBVyxNQUFNO0FBQ2pCLFlBQVksT0FBTyxLQUFLO0FBQ3hCLFdBQVc7QUFDWCxTQUFTLE1BQU07QUFDZjtBQUNBLFVBQVUsTUFBTSxHQUFHLEdBQUU7QUFDckIsVUFBVSxTQUFTLENBQUMsSUFBSSxFQUFDO0FBQ3pCLFNBQVM7QUFDVCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDckUsUUFBUSxVQUFVLENBQUMsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUM7QUFDdEMsT0FBTztBQUNQO0FBQ0EsTUFBTSxPQUFPLElBQUk7QUFDakIsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLEVBQUUsWUFBWTtBQUN4QixNQUFNLE9BQU8sVUFBVSxDQUFDLFNBQVMsQ0FBQztBQUNsQyxLQUFLO0FBQ0w7QUFDQSxJQUFJLEtBQUssRUFBRSxZQUFZO0FBQ3ZCLE1BQU0sT0FBTyxLQUFLLEVBQUU7QUFDcEIsS0FBSztBQUNMO0FBQ0EsSUFBSSxJQUFJLEVBQUUsWUFBWTtBQUN0QixNQUFNLE9BQU8sSUFBSTtBQUNqQixLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksRUFBRSxVQUFVLElBQUksRUFBRSxPQUFPLEVBQUU7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxJQUFJLE1BQU07QUFDaEIsUUFBUSxPQUFPLE9BQU8sS0FBSyxXQUFXLElBQUksUUFBUSxJQUFJLE9BQU87QUFDN0QsWUFBWSxPQUFPLENBQUMsTUFBTTtBQUMxQixZQUFZLE1BQUs7QUFDakI7QUFDQSxNQUFNLElBQUksUUFBUSxHQUFHLEtBQUk7QUFDekI7QUFDQSxNQUFNLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFO0FBQ3BDLFFBQVEsUUFBUSxHQUFHLGFBQWEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFDO0FBQzlDLE9BQU8sTUFBTSxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtBQUMzQyxRQUFRLElBQUksS0FBSyxHQUFHLGNBQWMsR0FBRTtBQUNwQztBQUNBO0FBQ0EsUUFBUSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzFELFVBQVU7QUFDVixZQUFZLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDbEQsWUFBWSxJQUFJLENBQUMsRUFBRSxLQUFLLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQzlDLGFBQWEsRUFBRSxXQUFXLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLGNBQWMsSUFBSSxDQUFDLFNBQVMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0FBQ3BELFlBQVk7QUFDWixZQUFZLFFBQVEsR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFDO0FBQy9CLFlBQVksS0FBSztBQUNqQixXQUFXO0FBQ1gsU0FBUztBQUNULE9BQU87QUFDUDtBQUNBO0FBQ0EsTUFBTSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ3JCLFFBQVEsT0FBTyxJQUFJO0FBQ25CLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sSUFBSSxXQUFXLEdBQUcsV0FBVyxDQUFDLFFBQVEsRUFBQztBQUM3QztBQUNBLE1BQU0sU0FBUyxDQUFDLFFBQVEsRUFBQztBQUN6QjtBQUNBLE1BQU0sT0FBTyxXQUFXO0FBQ3hCLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxFQUFFLFlBQVk7QUFDdEIsTUFBTSxJQUFJLElBQUksR0FBRyxTQUFTLEdBQUU7QUFDNUIsTUFBTSxPQUFPLElBQUksR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSTtBQUM1QyxLQUFLO0FBQ0w7QUFDQSxJQUFJLEtBQUssRUFBRSxZQUFZO0FBQ3ZCLE1BQU0sT0FBTyxLQUFLLEVBQUU7QUFDcEIsS0FBSztBQUNMO0FBQ0EsSUFBSSxHQUFHLEVBQUUsVUFBVSxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQ2xDLE1BQU0sT0FBTyxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQztBQUMvQixLQUFLO0FBQ0w7QUFDQSxJQUFJLEdBQUcsRUFBRSxVQUFVLE1BQU0sRUFBRTtBQUMzQixNQUFNLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQztBQUN4QixLQUFLO0FBQ0w7QUFDQSxJQUFJLE1BQU0sRUFBRSxVQUFVLE1BQU0sRUFBRTtBQUM5QixNQUFNLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUMzQixLQUFLO0FBQ0w7QUFDQSxJQUFJLEtBQUssRUFBRSxVQUFVLEtBQUssRUFBRTtBQUM1QixNQUFNLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQztBQUN6QixLQUFLO0FBQ0w7QUFDQSxJQUFJLFlBQVksRUFBRSxVQUFVLE1BQU0sRUFBRTtBQUNwQyxNQUFNLElBQUksTUFBTSxJQUFJLE9BQU8sRUFBRTtBQUM3QixRQUFRLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUM7QUFDckMsUUFBUSxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sR0FBRyxNQUFNO0FBQzNFLE9BQU87QUFDUDtBQUNBLE1BQU0sT0FBTyxJQUFJO0FBQ2pCLEtBQUs7QUFDTDtBQUNBLElBQUksT0FBTyxFQUFFLFVBQVUsT0FBTyxFQUFFO0FBQ2hDLE1BQU0sSUFBSSxnQkFBZ0IsR0FBRyxHQUFFO0FBQy9CLE1BQU0sSUFBSSxZQUFZLEdBQUcsR0FBRTtBQUMzQixNQUFNLElBQUksT0FBTztBQUNqQixRQUFRLE9BQU8sT0FBTyxLQUFLLFdBQVc7QUFDdEMsUUFBUSxTQUFTLElBQUksT0FBTztBQUM1QixRQUFRLE9BQU8sQ0FBQyxRQUFPO0FBQ3ZCO0FBQ0EsTUFBTSxPQUFPLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ2pDLFFBQVEsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFDO0FBQzFDLE9BQU87QUFDUDtBQUNBLE1BQU0sT0FBTyxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQzFDLFFBQVEsSUFBSSxJQUFJLEdBQUcsZ0JBQWdCLENBQUMsR0FBRyxHQUFFO0FBQ3pDLFFBQVEsSUFBSSxPQUFPLEVBQUU7QUFDckIsVUFBVSxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBQztBQUM5QyxTQUFTLE1BQU07QUFDZixVQUFVLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFDO0FBQy9FLFNBQVM7QUFDVCxRQUFRLFNBQVMsQ0FBQyxJQUFJLEVBQUM7QUFDdkIsT0FBTztBQUNQO0FBQ0EsTUFBTSxPQUFPLFlBQVk7QUFDekIsS0FBSztBQUNMO0FBQ0EsSUFBSSxXQUFXLEVBQUUsWUFBWTtBQUM3QixNQUFNLE9BQU8sUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ3JDLEtBQUs7QUFDTDtBQUNBLElBQUksV0FBVyxFQUFFLFVBQVUsT0FBTyxFQUFFO0FBQ3BDLE1BQU0sUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUM7QUFDNUUsS0FBSztBQUNMO0FBQ0EsSUFBSSxjQUFjLEVBQUUsWUFBWTtBQUNoQyxNQUFNLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxZQUFZLEVBQUUsRUFBQztBQUM1QyxNQUFNLE9BQU8sUUFBUSxDQUFDLFlBQVksRUFBRSxFQUFDO0FBQ3JDLE1BQU0sT0FBTyxPQUFPO0FBQ3BCLEtBQUs7QUFDTDtBQUNBLElBQUksWUFBWSxFQUFFLFlBQVk7QUFDOUIsTUFBTSxjQUFjLEdBQUU7QUFDdEIsTUFBTSxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxFQUFFO0FBQ3RELFFBQVEsT0FBTyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUNuRCxPQUFPLENBQUM7QUFDUixLQUFLO0FBQ0w7QUFDQSxJQUFJLGVBQWUsRUFBRSxZQUFZO0FBQ2pDLE1BQU0sY0FBYyxHQUFFO0FBQ3RCLE1BQU0sT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsRUFBRTtBQUN0RCxRQUFRLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxHQUFHLEVBQUM7QUFDbkMsUUFBUSxPQUFPLFFBQVEsQ0FBQyxHQUFHLEVBQUM7QUFDNUIsUUFBUSxPQUFPLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFO0FBQzdDLE9BQU8sQ0FBQztBQUNSLEtBQUs7QUFDTCxHQUFHO0FBQ0gsRUFBQztBQUNEO0FBQ0E7QUFDQTtBQUNvQyxnQkFBZ0IsTUFBSzs7O0FDNTZEbEQsTUFBTSxNQUFNLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDbEMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDdkQsTUFBTSxLQUFLLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDOztBQ0R0RCxNQUFNLFFBQVEsR0FBRyxDQUFDLEdBQUdBLEtBQVEsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3pDLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUdDLEtBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJRCxLQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZGLE1BQU0sT0FBTyxHQUFHLENBQUMsR0FBRyxLQUFLLE9BQU8sQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RELE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUNwRSxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3BDLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRTtBQUN4QixJQUFJLElBQUksQ0FBQyxDQUFDO0FBQ1YsSUFBSSxNQUFNLEdBQUcsR0FBRyxNQUFNO0FBQ3RCLFFBQVEsSUFBSSxDQUFDLEtBQUssU0FBUztBQUMzQixZQUFZLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztBQUNwQixRQUFRLE9BQU8sQ0FBQyxDQUFDO0FBQ2pCLEtBQUssQ0FBQztBQUNOLElBQUksR0FBRyxDQUFDLEtBQUssR0FBRyxNQUFNO0FBQ3RCLFFBQVEsQ0FBQyxHQUFHLFNBQVMsQ0FBQztBQUN0QixLQUFLLENBQUM7QUFDTixJQUFJLE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQztBQUNNLE1BQU0sS0FBSyxHQUFHLE1BQU07QUFDM0IsSUFBSSxJQUFJLE9BQU8sQ0FBQztBQUNoQixJQUFJLE9BQU87QUFDWCxRQUFRLEtBQUssR0FBRztBQUNoQixZQUFZLE9BQU8sR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDeEMsU0FBUztBQUNULFFBQVEsTUFBTSxHQUFHO0FBQ2pCLFlBQVksT0FBTyxHQUFHLFNBQVMsQ0FBQztBQUNoQyxTQUFTO0FBQ1QsUUFBUSxJQUFJLEdBQUc7QUFDZixZQUFZLElBQUksQ0FBQyxPQUFPO0FBQ3hCLGdCQUFnQixPQUFPLENBQUMsQ0FBQztBQUN6QixZQUFZLE1BQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxPQUFPLENBQUM7QUFDckQsWUFBWSxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBQ2hDLFlBQVksT0FBTyxJQUFJLENBQUM7QUFDeEIsU0FBUztBQUNULEtBQUssQ0FBQztBQUNOLENBQUMsQ0FBQztBQUNLLE1BQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxPQUFPLEdBQUcsT0FBTyxHQUFHLE9BQU8sQ0FBQyxDQUFDO0FBQzVELE1BQU0sVUFBVSxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksS0FBSztBQUMxQyxJQUFJLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekQsSUFBSSxPQUFPLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUM3QixDQUFDLENBQUM7QUFDSyxNQUFNLFNBQVMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxLQUFLLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQztBQUMzRSxNQUFNLGNBQWMsR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNuSyxNQUFNLFNBQVMsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLEtBQUs7QUFDdEMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM5RCxDQUFDLENBQUM7QUFDSyxNQUFNLGlCQUFpQixHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEdBQUcsQ0FBQyxLQUFLO0FBQ3pELElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5RSxDQUFDLENBQUM7QUFDSyxNQUFNLFVBQVUsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUs7QUFDckMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxDQUFDLEdBQUcsU0FBUyxHQUFHLFFBQVEsQ0FBQztBQUNuRCxDQUFDLENBQUM7QUFDSyxNQUFNLGFBQWEs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QUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN2RSxJQUFJLElBQUksQ0FBQyxPQUFPO0FBQ2hCLFFBQVEsSUFBSSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDeEIsSUFBSSxJQUFJLElBQUksR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzRSxJQUFJLElBQUksQ0FBQyxPQUFPO0FBQ2hCLFFBQVEsSUFBSSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDeEIsSUFBSSxPQUFPLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDO0FBQzlGLENBQUM7QUFDTSxTQUFTLHFCQUFxQixDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUNsRSxJQUFJLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNsQyxJQUFJLE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJO0FBQy9DLFFBQVEsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25ILEtBQUssQ0FBQyxDQUFDO0FBQ1AsSUFBSSxNQUFNLGdCQUFnQixHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUMzRyxJQUFJLE1BQU0sa0JBQWtCLEdBQUcsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxVQUFVLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDbkYsSUFBSSxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNySSxJQUFJLE9BQU8sT0FBTyxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7QUFDbkQsQ0FBQztBQUNNLFNBQVMsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUM1QixJQUFJLE9BQU8sQ0FBQyxDQUFDLFdBQVcsS0FBSyxPQUFPLENBQUM7QUFDckM7O0FDOVRPLE1BQU0sT0FBTyxHQUFHLDZDQUE2QyxDQUFDO0FBQ3JFLE1BQU0sS0FBSyxHQUFHO0FBQ2QsSUFBSSxDQUFDLEVBQUUsTUFBTTtBQUNiLElBQUksQ0FBQyxFQUFFLE1BQU07QUFDYixJQUFJLENBQUMsRUFBRSxRQUFRO0FBQ2YsSUFBSSxDQUFDLEVBQUUsUUFBUTtBQUNmLElBQUksQ0FBQyxFQUFFLE9BQU87QUFDZCxJQUFJLENBQUMsRUFBRSxNQUFNO0FBQ2IsQ0FBQyxDQUFDO0FBQ0YsTUFBTSxPQUFPLEdBQUc7QUFDaEIsSUFBSSxJQUFJLEVBQUUsR0FBRztBQUNiLElBQUksSUFBSSxFQUFFLEdBQUc7QUFDYixJQUFJLE1BQU0sRUFBRSxHQUFHO0FBQ2YsSUFBSSxNQUFNLEVBQUUsR0FBRztBQUNmLElBQUksS0FBSyxFQUFFLEdBQUc7QUFDZCxJQUFJLElBQUksRUFBRSxHQUFHO0FBQ2IsQ0FBQyxDQUFDO0FBQ0ssU0FBUyxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQzFCLElBQUksSUFBSSxHQUFHLEtBQUssT0FBTztBQUN2QixRQUFRLEdBQUcsR0FBRyxPQUFPLENBQUM7QUFDdEIsSUFBSSxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQzdCLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDekIsSUFBSSxLQUFLLE1BQU0sQ0FBQyxJQUFJLEdBQUcsRUFBRTtBQUN6QixRQUFRLFFBQVEsQ0FBQztBQUNqQixZQUFZLEtBQUssR0FBRyxDQUFDO0FBQ3JCLFlBQVksS0FBSyxHQUFHO0FBQ3BCLGdCQUFnQixPQUFPLE1BQU0sQ0FBQztBQUM5QixZQUFZLEtBQUssR0FBRztBQUNwQixnQkFBZ0IsRUFBRSxHQUFHLENBQUM7QUFDdEIsZ0JBQWdCLElBQUksR0FBRyxHQUFHLENBQUM7QUFDM0Isb0JBQW9CLE9BQU8sTUFBTSxDQUFDO0FBQ2xDLGdCQUFnQixHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLGdCQUFnQixNQUFNO0FBQ3RCLFlBQVksS0FBSyxHQUFHLEVBQUU7QUFDdEIsZ0JBQWdCLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEUsZ0JBQWdCLElBQUksS0FBSztBQUN6QixvQkFBb0IsS0FBSyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDMUMsZ0JBQWdCLE1BQU07QUFDdEIsYUFBYTtBQUNiLFlBQVksU0FBUztBQUNyQixnQkFBZ0IsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzQyxnQkFBZ0IsSUFBSSxFQUFFLEdBQUcsRUFBRTtBQUMzQixvQkFBb0IsR0FBRyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDbkMscUJBQXFCO0FBQ3JCLG9CQUFvQixNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDakQsb0JBQW9CLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUU7QUFDcEQsd0JBQXdCLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDO0FBQ3pDLHdCQUF3QixLQUFLLEVBQUUsQ0FBQyxLQUFLLElBQUksR0FBRyxPQUFPLEdBQUcsT0FBTztBQUM3RCxxQkFBcUIsQ0FBQyxDQUFDO0FBQ3ZCLG9CQUFvQixFQUFFLEdBQUcsQ0FBQztBQUMxQixpQkFBaUI7QUFDakIsYUFBYTtBQUNiLFNBQVM7QUFDVCxLQUFLO0FBQ0wsSUFBSSxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDO0FBQ00sU0FBUyxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQzlCLElBQUksT0FBTyxRQUFRO0FBQ25CLFNBQVMsR0FBRyxDQUFDLENBQUMsSUFBSUgsS0FBUTtBQUMxQixTQUFTLEdBQUcsQ0FBQyxDQUFDLElBQUk7QUFDbEIsUUFBUSxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztBQUMxQyxRQUFRLElBQUksS0FBSyxFQUFFO0FBQ25CLFlBQVksSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4QyxZQUFZLElBQUksS0FBSyxDQUFDLEtBQUssS0FBSyxPQUFPO0FBQ3ZDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ3BDLFlBQVksSUFBSSxLQUFLLENBQUMsUUFBUTtBQUM5QixnQkFBZ0IsQ0FBQyxJQUFJLEdBQUcsQ0FBQztBQUN6QixZQUFZLE9BQU8sQ0FBQyxDQUFDO0FBQ3JCLFNBQVM7QUFDVDtBQUNBLFlBQVksT0FBTyxHQUFHLENBQUM7QUFDdkIsS0FBSyxDQUFDO0FBQ04sU0FBUyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbEIsU0FBUyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ2xCLFNBQVMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBQ3JEOztBQzNFTyxTQUFTLGNBQWMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQzlDLElBQUksSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO0FBQzFCLFFBQVEsU0FBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3JEO0FBQ0EsUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUU7QUFDaEQsWUFBWSxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7QUFDNUMsS0FBSztBQUNMLENBQUM7QUFDTSxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQ3pDLElBQUksSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBQ2Y7QUFDQSxJQUFJLElBQUksQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLE9BQU8sTUFBTSxJQUFJLElBQUksRUFBRSxLQUFLLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLO0FBQzNFLFFBQVEsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDO0FBQ3hDLElBQUksSUFBSSxDQUFDLEVBQUUsR0FBRyxNQUFNLENBQUMsUUFBUSxNQUFNLElBQUksSUFBSSxFQUFFLEtBQUssS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLFVBQVU7QUFDakYsUUFBUSxLQUFLLENBQUMsUUFBUSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFDdkMsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzdCO0FBQ0EsSUFBSSxJQUFJLE1BQU0sQ0FBQyxHQUFHLEVBQUU7QUFDcEIsUUFBUSxLQUFLLENBQUMsTUFBTSxHQUFHSSxJQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzNDLFFBQVEsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ25DLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxPQUFPLElBQUksTUFBTTtBQUN6QixRQUFRLFFBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsQ0FBQztBQUMvQyxJQUFJLElBQUksVUFBVSxJQUFJLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRO0FBQ2hELFFBQVEsS0FBSyxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7QUFDbkM7QUFDQTtBQUNBO0FBQ0EsU0FBUyxJQUFJLE1BQU0sQ0FBQyxRQUFRO0FBQzVCLFFBQVEsS0FBSyxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO0FBQ3pDO0FBQ0EsSUFBSSxJQUFJLEtBQUssQ0FBQyxRQUFRO0FBQ3RCLFFBQVEsV0FBVyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDM0MsSUFBSSxjQUFjLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2xDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFO0FBQzFELFFBQVEsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEtBQUssT0FBTyxHQUFHLEdBQUcsR0FBRyxHQUFHLEVBQUUsWUFBWSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNwTCxRQUFRLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxNQUFNO0FBQ25ELFlBQVksT0FBTztBQUNuQixRQUFRLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssR0FBRyxHQUFHLElBQUksSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFLEdBQUcsR0FBRyxJQUFJLEVBQUUsQ0FBQztBQUNuSCxZQUFZLEVBQUUsQ0FBQyxLQUFLLEdBQUcsR0FBRyxJQUFJLElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRSxHQUFHLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEUsS0FBSztBQUNMLENBQUM7QUFDRCxTQUFTLFNBQVMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFO0FBQ2pDLElBQUksS0FBSyxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUU7QUFDOUIsUUFBUSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hELFlBQVksU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUM5QztBQUNBLFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNwQyxLQUFLO0FBQ0wsQ0FBQztBQUNELFNBQVMsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUNyQixJQUFJLE9BQU8sT0FBTyxDQUFDLEtBQUssUUFBUSxDQUFDO0FBQ2pDOztBQ3RETyxTQUFTLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFO0FBQ3RDLElBQUksT0FBTyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxHQUFHQyxRQUFNLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3hGLENBQUM7QUFDTSxTQUFTQSxRQUFNLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRTtBQUN4QyxJQUFJLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuQyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDdkIsSUFBSSxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDO0FBQ0QsU0FBUyxTQUFTLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRTtBQUMvQixJQUFJLE9BQU87QUFDWCxRQUFRLEdBQUcsRUFBRSxHQUFHO0FBQ2hCLFFBQVEsR0FBRyxFQUFFSixPQUFZLENBQUMsR0FBRyxDQUFDO0FBQzlCLFFBQVEsS0FBSyxFQUFFLEtBQUs7QUFDcEIsS0FBSyxDQUFDO0FBQ04sQ0FBQztBQUNELFNBQVMsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7QUFDL0IsSUFBSSxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxLQUFLO0FBQ25DLFFBQVEsT0FBT0ssVUFBZSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHQSxVQUFlLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdkYsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDVixDQUFDO0FBQ0QsU0FBUyxXQUFXLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRTtBQUMxQyxJQUFJLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxFQUFFLEVBQUUsV0FBVyxHQUFHLEVBQUUsRUFBRSxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQUUsRUFBRSxRQUFRLEdBQUcsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFLEVBQUUsU0FBUyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDcEgsSUFBSSxJQUFJLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDO0FBQzNCLElBQUksS0FBSyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLFVBQVUsRUFBRTtBQUNyQyxRQUFRLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQyxLQUFLO0FBQ0wsSUFBSSxLQUFLLE1BQU0sR0FBRyxJQUFJQyxPQUFZLEVBQUU7QUFDcEMsUUFBUSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdkMsUUFBUSxJQUFJLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQyxRQUFRLElBQUksSUFBSSxFQUFFO0FBQ2xCLFlBQVksSUFBSSxJQUFJLEVBQUU7QUFDdEIsZ0JBQWdCLElBQUksQ0FBQ0MsU0FBYyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDdkQsb0JBQW9CLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEMsb0JBQW9CLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3BELGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7QUFDQSxnQkFBZ0IsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDaEQsU0FBUztBQUNULGFBQWEsSUFBSSxJQUFJO0FBQ3JCLFlBQVksUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoQyxLQUFLO0FBQ0wsSUFBSSxLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksRUFBRTtBQUM3QixRQUFRLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJQSxTQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZGLFFBQVEsSUFBSSxJQUFJLEVBQUU7QUFDbEIsWUFBWSxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUUsWUFBWSxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ3ZELFlBQVksV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdkMsU0FBUztBQUNULEtBQUs7QUFDTCxJQUFJLEtBQUssTUFBTSxDQUFDLElBQUksUUFBUSxFQUFFO0FBQzlCLFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztBQUN4QyxZQUFZLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEMsS0FBSztBQUNMLElBQUksT0FBTztBQUNYLFFBQVEsS0FBSyxFQUFFLEtBQUs7QUFDcEIsUUFBUSxPQUFPLEVBQUUsT0FBTztBQUN4QixLQUFLLENBQUM7QUFDTixDQUFDO0FBQ0QsU0FBUyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRTtBQUMxQixJQUFJLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO0FBQ3hDLElBQUksSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO0FBQzNCO0FBQ0EsUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTO0FBQ2hDLFlBQVksS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNsQyxRQUFRLE9BQU87QUFDZixLQUFLO0FBQ0wsSUFBSSxNQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEtBQUssSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDO0FBQ3ZELElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxFQUFFO0FBQ25CLFFBQVEsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBQzVDLFFBQVEsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUM5QixLQUFLO0FBQ0wsU0FBUztBQUNULFFBQVEsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xDLFFBQVEsS0FBSyxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRTtBQUNuRCxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ25DLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDbkMsU0FBUztBQUNULFFBQVEsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEMsUUFBUSxxQkFBcUIsQ0FBQyxDQUFDLEdBQUcsR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLEtBQUssSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzdFLEtBQUs7QUFDTCxDQUFDO0FBQ0QsU0FBUyxPQUFPLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRTtBQUNsQztBQUNBLElBQUksTUFBTSxVQUFVLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdDLElBQUksTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25DLElBQUksTUFBTSxJQUFJLEdBQUcsV0FBVyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNoRCxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUU7QUFDOUMsUUFBUSxNQUFNLGNBQWMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7QUFDeEYsUUFBUSxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRztBQUNsQyxZQUFZLEtBQUssRUFBRSxXQUFXLENBQUMsR0FBRyxFQUFFO0FBQ3BDLFlBQVksU0FBUyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVE7QUFDbkQsWUFBWSxJQUFJLEVBQUUsSUFBSTtBQUN0QixTQUFTLENBQUM7QUFDVixRQUFRLElBQUksQ0FBQyxjQUFjO0FBQzNCLFlBQVksSUFBSSxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUMzQyxLQUFLO0FBQ0wsU0FBUztBQUNUO0FBQ0EsUUFBUSxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQzNCLEtBQUs7QUFDTCxJQUFJLE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUM7QUFDRDtBQUNBLFNBQVMsTUFBTSxDQUFDLENBQUMsRUFBRTtBQUNuQixJQUFJLE9BQU8sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDN0U7O0FDekdBLE1BQU0sT0FBTyxHQUFHLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDNUMsU0FBU0MsT0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUU7QUFDaEM7QUFDQSxJQUFJLElBQUksQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDO0FBQ3pDLFFBQVEsT0FBTztBQUNmLElBQUksQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQ3hCLElBQUksQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ3ZCLElBQUksQ0FBQyxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3BELElBQUksTUFBTSxHQUFHLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksR0FBRyxjQUFjLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDbEcsSUFBSSxJQUFJLENBQUMsSUFBSTtBQUNiLFFBQVEsT0FBTztBQUNmLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUc7QUFDN0IsUUFBUSxJQUFJO0FBQ1osUUFBUSxHQUFHO0FBQ1gsUUFBUSxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUM1QixRQUFRLGVBQWUsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLHNCQUFzQjtBQUM5RCxLQUFLLENBQUM7QUFDTixJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN2QixDQUFDO0FBQ00sU0FBUyxXQUFXLENBQUMsS0FBSyxFQUFFO0FBQ25DLElBQUkscUJBQXFCLENBQUMsTUFBTTtBQUNoQyxRQUFRLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO0FBQzNDLFFBQVEsSUFBSSxHQUFHLEVBQUU7QUFDakIsWUFBWSxNQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQzdGLFlBQVksSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUM5QixnQkFBZ0IsR0FBRyxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7QUFDNUMsYUFBYTtBQUNiLFlBQVksTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLGVBQWU7QUFDL0Msa0JBQWtCLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUMvRixrQkFBa0IsV0FBVyxDQUFDO0FBQzlCLFlBQVksSUFBSSxPQUFPLEtBQUssR0FBRyxDQUFDLE9BQU8sRUFBRTtBQUN6QyxnQkFBZ0IsR0FBRyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdEMsZ0JBQWdCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsT0FBTyxLQUFLLEdBQUcsQ0FBQyxJQUFJLEdBQUcsT0FBTyxHQUFHLFNBQVMsQ0FBQztBQUN0RSxnQkFBZ0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUN0QyxhQUFhO0FBQ2IsWUFBWSxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDL0IsU0FBUztBQUNULEtBQUssQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUNNLFNBQVNDLE1BQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFO0FBQy9CLElBQUksSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU87QUFDOUIsUUFBUSxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RELENBQUM7QUFDTSxTQUFTQyxLQUFHLENBQUMsS0FBSyxFQUFFO0FBQzNCLElBQUksTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7QUFDdkMsSUFBSSxJQUFJLEdBQUcsRUFBRTtBQUNiLFFBQVEsSUFBSSxHQUFHLENBQUMsT0FBTztBQUN2QixZQUFZLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzFDLFFBQVFDLFFBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0QixLQUFLO0FBQ0wsQ0FBQztBQUNNLFNBQVNBLFFBQU0sQ0FBQyxLQUFLLEVBQUU7QUFDOUIsSUFBSSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFO0FBQ2hDLFFBQVEsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBQzNDLFFBQVEsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUMzQixLQUFLO0FBQ0wsQ0FBQztBQUNNLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRTtBQUM3QixJQUFJLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQ3RDLFFBQVEsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ25DLFFBQVEsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUMzQixRQUFRLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDakMsS0FBSztBQUNMLENBQUM7QUFDRCxTQUFTLFVBQVUsQ0FBQyxDQUFDLEVBQUU7QUFDdkIsSUFBSSxJQUFJLEVBQUUsQ0FBQztBQUNYLElBQUksTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQyxPQUFPLEtBQUssYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9ELElBQUksTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsT0FBTyxLQUFLLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxnQkFBZ0IsTUFBTSxJQUFJLElBQUksRUFBRSxLQUFLLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFDbEksSUFBSSxPQUFPLE9BQU8sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwRCxDQUFDO0FBQ0QsU0FBUyxRQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtBQUNqQyxJQUFJLE1BQU0sU0FBUyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEtBQUssR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUM7QUFDeEUsSUFBSSxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNwRCxJQUFJLElBQUksT0FBTztBQUNmLFFBQVEsUUFBUSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyRSxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssS0FBSyxHQUFHLENBQUMsS0FBSztBQUMvQyxRQUFRLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2xDLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZCLENBQUM7QUFDRCxTQUFTLFFBQVEsQ0FBQyxRQUFRLEVBQUU7QUFDNUIsSUFBSSxJQUFJLFFBQVEsQ0FBQyxRQUFRO0FBQ3pCLFFBQVEsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0M7O0FDaEZPLFNBQVNILE9BQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQzVCLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLEtBQUssQ0FBQyxDQUFDLE1BQU0sS0FBSyxTQUFTLElBQUksQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7QUFDbEUsUUFBUSxPQUFPO0FBQ2YsSUFBSSxJQUFJLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQztBQUN6QyxRQUFRLE9BQU87QUFDZixJQUFJLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEVBQUUsUUFBUSxHQUFHSSxhQUFrQixDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksR0FBR0MsY0FBb0IsQ0FBQyxRQUFRLEVBQUVDLFFBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN0SSxJQUFJLElBQUksQ0FBQyxJQUFJO0FBQ2IsUUFBUSxPQUFPO0FBQ2YsSUFBSSxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyQyxJQUFJLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztBQUMxQyxJQUFJLElBQUksQ0FBQyxrQkFBa0IsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLFlBQVksSUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUM7QUFDdkgsUUFBUUMsS0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JCO0FBQ0E7QUFDQSxJQUFJLElBQUksQ0FBQyxDQUFDLFVBQVUsS0FBSyxLQUFLO0FBQzlCLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxnQkFBZ0IsSUFBSSxLQUFLLElBQUksa0JBQWtCLElBQUksWUFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN0RyxRQUFRLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUMzQixJQUFJLE1BQU0sVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztBQUM5QyxJQUFJLE1BQU0sVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQztBQUNoRCxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7QUFDaEMsSUFBSSxJQUFJLENBQUMsQ0FBQyxRQUFRLElBQUlDLE9BQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRTtBQUMxRCxRQUFRLElBQUksQ0FBQyxLQUFLLElBQUlDLFlBQWtCLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzFELEtBQUs7QUFDTCxTQUFTO0FBQ1QsUUFBUUEsWUFBa0IsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDcEMsS0FBSztBQUNMLElBQUksTUFBTSxhQUFhLEdBQUcsQ0FBQyxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUM7QUFDOUMsSUFBSSxNQUFNLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDL0MsSUFBSSxJQUFJLEtBQUssSUFBSSxPQUFPLElBQUksYUFBYSxJQUFJQyxXQUFpQixDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRTtBQUN6RSxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHO0FBQzlCLFlBQVksSUFBSTtBQUNoQixZQUFZLEtBQUs7QUFDakIsWUFBWSxPQUFPLEVBQUUsUUFBUTtBQUM3QixZQUFZLEdBQUcsRUFBRSxRQUFRO0FBQ3pCLFlBQVksT0FBTyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsWUFBWSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTztBQUNoRSxZQUFZLE9BQU87QUFDbkIsWUFBWSxrQkFBa0I7QUFDOUIsWUFBWSxZQUFZLEVBQUUsQ0FBQyxDQUFDLE1BQU07QUFDbEMsWUFBWSxhQUFhLEVBQUUsS0FBSztBQUNoQyxTQUFTLENBQUM7QUFDVixRQUFRLE9BQU8sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBQ2xDLFFBQVEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDMUM7QUFDQSxRQUFRLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztBQUMzQyxRQUFRLElBQUksS0FBSyxFQUFFO0FBQ25CLFlBQVksS0FBSyxDQUFDLFNBQVMsR0FBRyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNuRSxZQUFZQyxTQUFjLENBQUMsS0FBSyxFQUFFQyxjQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDcEIsT0FBWSxDQUFDLElBQUksQ0FBQyxFQUFFYyxRQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RHLFlBQVlPLFVBQWUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDekMsU0FBUztBQUNULFFBQVEsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLEtBQUs7QUFDTCxTQUFTO0FBQ1QsUUFBUSxJQUFJLFVBQVU7QUFDdEIsWUFBWUMsWUFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQyxRQUFRLElBQUksVUFBVTtBQUN0QixZQUFZQyxZQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLEtBQUs7QUFDTCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbkIsQ0FBQztBQUNELFNBQVMsWUFBWSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUU7QUFDOUIsSUFBSSxNQUFNLE9BQU8sR0FBR1QsUUFBYyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pHLElBQUksS0FBSyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFO0FBQ3ZDLFFBQVEsTUFBTSxNQUFNLEdBQUdVLG1CQUF3QixDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDdEUsUUFBUSxJQUFJbkIsVUFBZSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxRQUFRO0FBQ3BELFlBQVksT0FBTyxJQUFJLENBQUM7QUFDeEIsS0FBSztBQUNMLElBQUksT0FBTyxLQUFLLENBQUM7QUFDakIsQ0FBQztBQUNNLFNBQVMsWUFBWSxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRTtBQUNqRCxJQUFJLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQztBQUNyQixJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM3QixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbkIsSUFBSSxNQUFNLFFBQVEsR0FBR08sYUFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHO0FBQzFCLFFBQVEsSUFBSSxFQUFFLEdBQUc7QUFDakIsUUFBUSxLQUFLO0FBQ2IsUUFBUSxPQUFPLEVBQUUsUUFBUTtBQUN6QixRQUFRLEdBQUcsRUFBRSxRQUFRO0FBQ3JCLFFBQVEsT0FBTyxFQUFFLElBQUk7QUFDckIsUUFBUSxPQUFPLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDO0FBQ2hELFFBQVEsWUFBWSxFQUFFLENBQUMsQ0FBQyxNQUFNO0FBQzlCLFFBQVEsUUFBUSxFQUFFLElBQUk7QUFDdEIsUUFBUSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUs7QUFDdEIsUUFBUSxhQUFhLEVBQUUsS0FBSztBQUM1QixLQUFLLENBQUM7QUFDTixJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuQixDQUFDO0FBQ0QsU0FBUyxXQUFXLENBQUMsQ0FBQyxFQUFFO0FBQ3hCLElBQUkscUJBQXFCLENBQUMsTUFBTTtBQUNoQyxRQUFRLElBQUksRUFBRSxDQUFDO0FBQ2YsUUFBUSxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztBQUN4QyxRQUFRLElBQUksQ0FBQyxHQUFHO0FBQ2hCLFlBQVksT0FBTztBQUNuQjtBQUNBLFFBQVEsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sTUFBTSxJQUFJLElBQUksRUFBRSxLQUFLLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO0FBQ3ZHLFlBQVksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBQzVDO0FBQ0EsUUFBUSxNQUFNLFNBQVMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakQsUUFBUSxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUNMLFNBQWMsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQztBQUMvRCxZQUFZLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0QixhQUFhO0FBQ2IsWUFBWSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sSUFBSUYsVUFBZSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBQzFHLGdCQUFnQixHQUFHLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztBQUNuQyxZQUFZLElBQUksR0FBRyxDQUFDLE9BQU8sRUFBRTtBQUM3QjtBQUNBLGdCQUFnQixJQUFJLE9BQU8sR0FBRyxDQUFDLE9BQU8sS0FBSyxVQUFVLEVBQUU7QUFDdkQsb0JBQW9CLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNoRCxvQkFBb0IsSUFBSSxDQUFDLEtBQUs7QUFDOUIsd0JBQXdCLE9BQU87QUFDL0Isb0JBQW9CLEtBQUssQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBQzVDLG9CQUFvQixLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwRCxvQkFBb0IsR0FBRyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7QUFDeEMsaUJBQWlCO0FBQ2pCLGdCQUFnQixNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQzlDLGdCQUFnQmMsU0FBYyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUU7QUFDNUMsb0JBQW9CLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsS0FBSyxHQUFHLEVBQUU7QUFDaEUsb0JBQW9CLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLEVBQUU7QUFDaEUsaUJBQWlCLENBQUMsQ0FBQztBQUNuQixnQkFBZ0IsR0FBRyxDQUFDLGFBQWEsS0FBSyxHQUFHLENBQUMsYUFBYSxHQUFHLEdBQUcsQ0FBQyxJQUFJLEtBQUtOLGNBQW9CLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRUMsUUFBYyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDakksYUFBYTtBQUNiLFNBQVM7QUFDVCxRQUFRLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2QixLQUFLLENBQUMsQ0FBQztBQUNQLENBQUM7QUFDTSxTQUFTLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQzNCO0FBQ0EsSUFBSSxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRTtBQUNyRSxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBR0YsYUFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4RCxLQUFLO0FBQ0wsQ0FBQztBQUNNLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDMUIsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztBQUNwQyxJQUFJLElBQUksQ0FBQyxHQUFHO0FBQ1osUUFBUSxPQUFPO0FBQ2Y7QUFDQSxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxVQUFVLElBQUksQ0FBQyxDQUFDLFVBQVUsS0FBSyxLQUFLO0FBQ3ZELFFBQVEsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQzNCO0FBQ0E7QUFDQSxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxVQUFVLElBQUksR0FBRyxDQUFDLFlBQVksS0FBSyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRTtBQUNqRixRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztBQUN4QyxRQUFRLE9BQU87QUFDZixLQUFLO0FBQ0wsSUFBSVUsWUFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQixJQUFJQyxZQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFCO0FBQ0EsSUFBSSxNQUFNLFFBQVEsR0FBR1gsYUFBa0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDO0FBQ3RELElBQUksTUFBTSxJQUFJLEdBQUdDLGNBQW9CLENBQUMsUUFBUSxFQUFFQyxRQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQ25GLElBQUksSUFBSSxJQUFJLElBQUksR0FBRyxDQUFDLE9BQU8sSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTtBQUNsRCxRQUFRLElBQUksR0FBRyxDQUFDLFFBQVE7QUFDeEIsWUFBWVcsWUFBa0IsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzdELGFBQWE7QUFDYixZQUFZLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7QUFDeEMsWUFBWSxJQUFJQyxRQUFjLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO0FBQ2pELGdCQUFnQixDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDdkMsU0FBUztBQUNULEtBQUs7QUFDTCxTQUFTLElBQUksR0FBRyxDQUFDLFFBQVEsRUFBRTtBQUMzQixRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNsQyxLQUFLO0FBQ0wsU0FBUyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsZUFBZSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ25ELFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xDLFFBQVFDLGdCQUFzQixDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDaEQsS0FBSztBQUNMLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssR0FBRyxDQUFDLGtCQUFrQixJQUFJLEdBQUcsQ0FBQyxhQUFhLE1BQU0sR0FBRyxDQUFDLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDbEcsUUFBUUMsUUFBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFCLFNBQVMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTztBQUNsQyxRQUFRQSxRQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUIsSUFBSSxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQixJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztBQUNwQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbkIsQ0FBQztBQUNNLFNBQVMsTUFBTSxDQUFDLENBQUMsRUFBRTtBQUMxQixJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO0FBQ3BDLElBQUksSUFBSSxHQUFHLEVBQUU7QUFDYixRQUFRLElBQUksR0FBRyxDQUFDLFFBQVE7QUFDeEIsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEMsUUFBUSxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7QUFDeEMsUUFBUUEsUUFBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFCLFFBQVEsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUIsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3ZCLEtBQUs7QUFDTCxDQUFDO0FBQ0QsU0FBUyxrQkFBa0IsQ0FBQyxDQUFDLEVBQUU7QUFDL0IsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztBQUM3QixJQUFJLElBQUksQ0FBQyxDQUFDLEtBQUs7QUFDZixRQUFRUCxVQUFlLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN4QyxDQUFDO0FBQ0QsU0FBUyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFO0FBQ25DLElBQUksSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztBQUM3QyxJQUFJLE9BQU8sRUFBRSxFQUFFO0FBQ2YsUUFBUSxJQUFJLEVBQUUsQ0FBQyxLQUFLLEtBQUssR0FBRyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEtBQUssT0FBTztBQUN0RCxZQUFZLE9BQU8sRUFBRSxDQUFDO0FBQ3RCLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUM7QUFDNUIsS0FBSztBQUNMLElBQUksT0FBTztBQUNYOztBQ3hNTyxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFO0FBQ3ZDLElBQUksS0FBSyxDQUFDLFNBQVMsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUM7QUFDekMsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3ZCLElBQUksVUFBVSxDQUFDLE1BQU07QUFDckIsUUFBUSxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzNCLFFBQVEsVUFBVSxDQUFDLE1BQU0sUUFBUSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUMxRCxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDWixDQUFDO0FBQ0QsU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUNoQyxJQUFJLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRTtBQUN6QixRQUFRLElBQUksS0FBSztBQUNqQixZQUFZLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUMxQztBQUNBLFlBQVksS0FBSyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFDeEMsUUFBUSxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQzNCLEtBQUs7QUFDTDs7QUNWQTtBQUNPLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7QUFDeEMsSUFBSSxTQUFTUSxtQkFBaUIsR0FBRztBQUNqQyxRQUFRQyxpQkFBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN2QyxRQUFRLFNBQVMsRUFBRSxDQUFDO0FBQ3BCLEtBQUs7QUFDTCxJQUFJLE9BQU87QUFDWCxRQUFRLEdBQUcsQ0FBQyxNQUFNLEVBQUU7QUFDcEIsWUFBWSxJQUFJLE1BQU0sQ0FBQyxXQUFXLElBQUksTUFBTSxDQUFDLFdBQVcsS0FBSyxLQUFLLENBQUMsV0FBVztBQUM5RSxnQkFBZ0JELG1CQUFpQixFQUFFLENBQUM7QUFDcEMsWUFBWSxjQUFjLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzFDLFlBQVksQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLElBQUksR0FBR3pCLFFBQU0sRUFBRSxLQUFLLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNuRixTQUFTO0FBQ1QsUUFBUSxLQUFLO0FBQ2IsUUFBUSxNQUFNLEVBQUUsTUFBTTJCLEtBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQzVDLDJCQUFRRixtQkFBaUI7QUFDekIsUUFBUSxTQUFTLENBQUMsTUFBTSxFQUFFO0FBQzFCLFlBQVksSUFBSSxDQUFDLEtBQUssSUFBSUcsU0FBZSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNqRSxTQUFTO0FBQ1QsUUFBUSxZQUFZLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRTtBQUNqQyxZQUFZLElBQUksR0FBRztBQUNuQixnQkFBZ0IsSUFBSSxDQUFDLEtBQUssSUFBSWYsWUFBa0IsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzVFLGlCQUFpQixJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7QUFDckMsZ0JBQWdCVyxRQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdEMsZ0JBQWdCLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbkMsYUFBYTtBQUNiLFNBQVM7QUFDVCxRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQ3pCLFlBQVksSUFBSSxDQUFDLEtBQUssSUFBSUssUUFBYyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDcEUsU0FBUztBQUNULFFBQVEsUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUU7QUFDN0IsWUFBWSxJQUFJLENBQUMsS0FBSyxJQUFJQyxZQUFrQixDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDeEUsU0FBUztBQUNULFFBQVEsV0FBVyxHQUFHO0FBQ3RCLFlBQVksSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRTtBQUMxQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUNDLFdBQWlCLEVBQUUsS0FBSyxDQUFDO0FBQ2xELG9CQUFvQixPQUFPLElBQUksQ0FBQztBQUNoQztBQUNBLGdCQUFnQixLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ25DLGFBQWE7QUFDYixZQUFZLE9BQU8sS0FBSyxDQUFDO0FBQ3pCLFNBQVM7QUFDVCxRQUFRLFdBQVcsQ0FBQyxRQUFRLEVBQUU7QUFDOUIsWUFBWSxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFO0FBQzVDLGdCQUFnQixNQUFNLE1BQU0sR0FBR0MsV0FBaUIsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDbEUsZ0JBQWdCLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbkMsZ0JBQWdCLE9BQU8sTUFBTSxDQUFDO0FBQzlCLGFBQWE7QUFDYixZQUFZLE9BQU8sS0FBSyxDQUFDO0FBQ3pCLFNBQVM7QUFDVCxRQUFRLGFBQWEsR0FBRztBQUN4QixZQUFZaEMsUUFBTSxDQUFDa0IsWUFBa0IsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM5QyxTQUFTO0FBQ1QsUUFBUSxhQUFhLEdBQUc7QUFDeEIsWUFBWWxCLFFBQU0sQ0FBQ21CLFlBQWtCLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDOUMsU0FBUztBQUNULFFBQVEsVUFBVSxHQUFHO0FBQ3JCLFlBQVluQixRQUFNLENBQUMsS0FBSyxJQUFJO0FBQzVCLGdCQUFnQmlDLFVBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEMsZ0JBQWdCQyxNQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbEMsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3RCLFNBQVM7QUFDVCxRQUFRLElBQUksR0FBRztBQUNmLFlBQVlsQyxRQUFNLENBQUMsS0FBSyxJQUFJO0FBQzVCLGdCQUFnQm1DLElBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNsQyxnQkFBZ0JELE1BQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNsQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDdEIsU0FBUztBQUNULFFBQVEsT0FBTyxDQUFDLElBQUksRUFBRTtBQUN0QixZQUFZLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDbkMsU0FBUztBQUNULFFBQVEsYUFBYSxDQUFDLE1BQU0sRUFBRTtBQUM5QixZQUFZbEMsUUFBTSxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsUUFBUSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN6RSxTQUFTO0FBQ1QsUUFBUSxTQUFTLENBQUMsTUFBTSxFQUFFO0FBQzFCLFlBQVlBLFFBQU0sQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDckUsU0FBUztBQUNULFFBQVEsY0FBYyxDQUFDLEdBQUcsRUFBRTtBQUM1QixZQUFZLE9BQU9TLGNBQW9CLENBQUMsR0FBRyxFQUFFQyxRQUFjLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQ3hGLFNBQVM7QUFDVCxRQUFRLFNBQVM7QUFDakIsUUFBUSxZQUFZLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDMUMsWUFBWSxZQUFZLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDckQsU0FBUztBQUNULFFBQVEsT0FBTyxHQUFHO0FBQ2xCLFlBQVl5QixJQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDOUIsWUFBWSxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ25ELFlBQVksS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQ3ZDLFNBQVM7QUFDVCxLQUFLLENBQUM7QUFDTjs7QUM5Rk8sU0FBUyxRQUFRLEdBQUc7QUFDM0IsSUFBSSxPQUFPO0FBQ1gsUUFBUSxNQUFNLEVBQUVDLElBQVEsQ0FBQ0MsT0FBVyxDQUFDO0FBQ3JDLFFBQVEsV0FBVyxFQUFFLE9BQU87QUFDNUIsUUFBUSxTQUFTLEVBQUUsT0FBTztBQUMxQixRQUFRLFdBQVcsRUFBRSxJQUFJO0FBQ3pCLFFBQVEsYUFBYSxFQUFFLE9BQU87QUFDOUIsUUFBUSxVQUFVLEVBQUUsSUFBSTtBQUN4QixRQUFRLFFBQVEsRUFBRSxLQUFLO0FBQ3ZCLFFBQVEsa0JBQWtCLEVBQUUsS0FBSztBQUNqQyxRQUFRLGNBQWMsRUFBRSxLQUFLO0FBQzdCLFFBQVEsb0JBQW9CLEVBQUUsS0FBSztBQUNuQyxRQUFRLGdCQUFnQixFQUFFLEtBQUs7QUFDL0IsUUFBUSxRQUFRLEVBQUUsS0FBSztBQUN2QixRQUFRLFNBQVMsRUFBRTtBQUNuQixZQUFZLFFBQVEsRUFBRSxJQUFJO0FBQzFCLFlBQVksS0FBSyxFQUFFLElBQUk7QUFDdkIsU0FBUztBQUNULFFBQVEsU0FBUyxFQUFFO0FBQ25CLFlBQVksT0FBTyxFQUFFLElBQUk7QUFDekIsWUFBWSxRQUFRLEVBQUUsR0FBRztBQUN6QixTQUFTO0FBQ1QsUUFBUSxPQUFPLEVBQUU7QUFDakIsWUFBWSxJQUFJLEVBQUUsSUFBSTtBQUN0QixZQUFZLEtBQUssRUFBRSxNQUFNO0FBQ3pCLFlBQVksU0FBUyxFQUFFLElBQUk7QUFDM0IsWUFBWSxNQUFNLEVBQUUsRUFBRTtBQUN0QixZQUFZLFVBQVUsRUFBRSxJQUFJO0FBQzVCLFNBQVM7QUFDVCxRQUFRLFVBQVUsRUFBRTtBQUNwQixZQUFZLE9BQU8sRUFBRSxJQUFJO0FBQ3pCLFlBQVksU0FBUyxFQUFFLElBQUk7QUFDM0IsWUFBWSxNQUFNLEVBQUUsSUFBSTtBQUN4QixZQUFZLE1BQU0sRUFBRSxFQUFFO0FBQ3RCLFNBQVM7QUFDVCxRQUFRLFlBQVksRUFBRTtBQUN0QixZQUFZLE9BQU8sRUFBRSxLQUFLO0FBQzFCLFlBQVksTUFBTSxFQUFFLEVBQUU7QUFDdEIsU0FBUztBQUNULFFBQVEsU0FBUyxFQUFFO0FBQ25CLFlBQVksT0FBTyxFQUFFLElBQUk7QUFDekIsWUFBWSxRQUFRLEVBQUUsQ0FBQztBQUN2QixZQUFZLFlBQVksRUFBRSxJQUFJO0FBQzlCLFlBQVksU0FBUyxFQUFFLElBQUk7QUFDM0IsWUFBWSxlQUFlLEVBQUUsS0FBSztBQUNsQyxTQUFTO0FBQ1QsUUFBUSxRQUFRLEVBQUU7QUFDbEIsWUFBWSxNQUFNLEVBQUUsS0FBSztBQUN6QixTQUFTO0FBQ1QsUUFBUSxVQUFVLEVBQUU7QUFDcEIsWUFBWSxPQUFPLEVBQUUsSUFBSTtBQUN6QixTQUFTO0FBQ1QsUUFBUSxLQUFLLEVBQUU7QUFDZjtBQUNBO0FBQ0EsWUFBWSxPQUFPLEVBQUUsRUFBRSxjQUFjLElBQUksTUFBTSxDQUFDO0FBQ2hELFNBQVM7QUFDVCxRQUFRLE1BQU0sRUFBRSxFQUFFO0FBQ2xCLFFBQVEsUUFBUSxFQUFFO0FBQ2xCLFlBQVksT0FBTyxFQUFFLElBQUk7QUFDekIsWUFBWSxPQUFPLEVBQUUsSUFBSTtBQUN6QixZQUFZLHNCQUFzQixFQUFFLElBQUk7QUFDeEMsWUFBWSxZQUFZLEVBQUUsSUFBSTtBQUM5QixZQUFZLE1BQU0sRUFBRSxFQUFFO0FBQ3RCLFlBQVksVUFBVSxFQUFFLEVBQUU7QUFDMUIsWUFBWSxPQUFPLEVBQUU7QUFDckIsZ0JBQWdCLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7QUFDaEYsZ0JBQWdCLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7QUFDOUUsZ0JBQWdCLElBQUksRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7QUFDL0UsZ0JBQWdCLE1BQU0sRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7QUFDakYsZ0JBQWdCLFFBQVEsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7QUFDdEYsZ0JBQWdCLFNBQVMsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7QUFDdkYsZ0JBQWdCLE9BQU8sRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7QUFDckYsZ0JBQWdCLFFBQVEsRUFBRTtBQUMxQixvQkFBb0IsR0FBRyxFQUFFLEtBQUs7QUFDOUIsb0JBQW9CLEtBQUssRUFBRSxTQUFTO0FBQ3BDLG9CQUFvQixPQUFPLEVBQUUsSUFBSTtBQUNqQyxvQkFBb0IsU0FBUyxFQUFFLEVBQUU7QUFDakMsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYixZQUFZLFdBQVcsRUFBRSxFQUFFO0FBQzNCLFNBQVM7QUFDVCxRQUFRLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDckIsS0FBSyxDQUFDO0FBQ047O0FDdEZBO0FBQ08sU0FBUyxVQUFVLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7QUFDdEQsSUFBSSxNQUFNLFdBQVcsR0FBRyxJQUFJLEdBQUcsRUFBRTtBQUNqQyxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDbEIsSUFBSSxLQUFLLE1BQU0sRUFBRSxJQUFJLE1BQU07QUFDM0IsUUFBUSxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDeEMsSUFBSSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQztBQUNyQyxJQUFJLE9BQU8sRUFBRSxFQUFFO0FBQ2YsUUFBUSxNQUFNLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMzQztBQUNBLFFBQVEsSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztBQUNuQyxZQUFZLFdBQVcsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzFDO0FBQ0E7QUFDQSxZQUFZLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDOUIsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQztBQUM1QixLQUFLO0FBQ0w7QUFDQSxJQUFJLEtBQUssTUFBTSxFQUFFLElBQUksUUFBUTtBQUM3QixRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDN0I7QUFDQSxJQUFJLEtBQUssTUFBTSxFQUFFLElBQUksTUFBTSxFQUFFO0FBQzdCLFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQztBQUNyQyxZQUFZLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDOUMsS0FBSztBQUNMOztBQ3ZCTyxTQUFTLGFBQWEsQ0FBQyxPQUFPLEVBQUU7QUFDdkMsSUFBSSxPQUFPLFFBQVEsQ0FBQyxlQUFlLENBQUMsNEJBQTRCLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDM0UsQ0FBQztBQUNNLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFO0FBQ2pELElBQUksTUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxHQUFHLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLFNBQVMsRUFBRSxVQUFVLEdBQUcsSUFBSSxHQUFHLEVBQUUsRUFBRSxNQUFNLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxrQkFBa0IsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxTQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDNU4sSUFBSSxLQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFO0FBQ2xGLFFBQVEsSUFBSSxDQUFDLENBQUMsSUFBSTtBQUNsQixZQUFZLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUN0RSxLQUFLO0FBQ0wsSUFBSSxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSztBQUNsRSxRQUFRLE9BQU87QUFDZixZQUFZLEtBQUssRUFBRSxDQUFDO0FBQ3BCLFlBQVksT0FBTyxFQUFFLEtBQUs7QUFDMUIsWUFBWSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQztBQUN6RCxTQUFTLENBQUM7QUFDVixLQUFLLENBQUMsQ0FBQztBQUNQLElBQUksSUFBSSxHQUFHO0FBQ1gsUUFBUSxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ3BCLFlBQVksS0FBSyxFQUFFLEdBQUc7QUFDdEIsWUFBWSxPQUFPLEVBQUUsSUFBSTtBQUN6QixZQUFZLElBQUksRUFBRSxTQUFTLENBQUMsR0FBRyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDO0FBQzFELFNBQVMsQ0FBQyxDQUFDO0FBQ1gsSUFBSSxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pELElBQUksSUFBSSxRQUFRLEtBQUssS0FBSyxDQUFDLFFBQVEsQ0FBQyxXQUFXO0FBQy9DLFFBQVEsT0FBTztBQUNmLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdDLElBQUksTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM1QyxJQUFJLE1BQU0sWUFBWSxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdEQsSUFBSSxRQUFRLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNoQyxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssSUFBSUMsYUFBVyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNwSSxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFFLFlBQVksRUFBRSxLQUFLLElBQUlBLGFBQVcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDdkksQ0FBQztBQUNEO0FBQ0EsU0FBUyxRQUFRLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUU7QUFDckMsSUFBSSxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQzlCLElBQUksSUFBSSxLQUFLLENBQUM7QUFDZCxJQUFJLEtBQUssTUFBTSxDQUFDLElBQUksTUFBTSxFQUFFO0FBQzVCLFFBQVEsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTtBQUMxQixZQUFZLEtBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDN0MsWUFBWSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUztBQUNqQyxnQkFBZ0IsS0FBSyxHQUFHLGVBQWUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNsRSxZQUFZLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMxQyxTQUFTO0FBQ1QsS0FBSztBQUNMLElBQUksTUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNoQyxJQUFJLElBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7QUFDL0IsSUFBSSxPQUFPLEVBQUUsRUFBRTtBQUNmLFFBQVEsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDaEQsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQztBQUM1QixLQUFLO0FBQ0wsSUFBSSxLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFO0FBQ2xELFFBQVEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0FBQy9CLFlBQVksTUFBTSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNwRCxLQUFLO0FBQ0wsQ0FBQztBQUNELFNBQVMsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUNwRyxJQUFJLE9BQU87QUFDWCxRQUFRLE1BQU0sQ0FBQyxLQUFLO0FBQ3BCLFFBQVEsTUFBTSxDQUFDLE1BQU07QUFDckIsUUFBUSxPQUFPO0FBQ2YsUUFBUSxJQUFJO0FBQ1osUUFBUSxJQUFJO0FBQ1osUUFBUSxLQUFLO0FBQ2IsUUFBUSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQy9DLFFBQVEsS0FBSyxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUM7QUFDakMsUUFBUSxTQUFTLElBQUksYUFBYSxDQUFDLFNBQVMsQ0FBQztBQUM3QyxRQUFRLFNBQVMsSUFBSSxhQUFhLENBQUMsU0FBUyxDQUFDO0FBQzdDLEtBQUs7QUFDTCxTQUFTLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZCLFNBQVMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLENBQUM7QUFDRCxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUU7QUFDMUIsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMzRSxDQUFDO0FBQ0QsU0FBUyxhQUFhLENBQUMsQ0FBQyxFQUFFO0FBQzFCLElBQUksT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUNwQyxDQUFDO0FBQ0QsU0FBUyxhQUFhLENBQUMsQ0FBQyxFQUFFO0FBQzFCO0FBQ0EsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDZCxJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3ZDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNuRCxLQUFLO0FBQ0wsSUFBSSxPQUFPLFNBQVMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDcEMsQ0FBQztBQUNELFNBQVNBLGFBQVcsQ0FBQyxLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFO0FBQ25GLElBQUksSUFBSSxFQUFFLENBQUM7QUFDWCxJQUFJLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNoRSxJQUFJLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRTtBQUN6QixRQUFRLEVBQUUsR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDNUQsS0FBSztBQUNMLFNBQVM7QUFDVCxRQUFRLElBQUksS0FBSyxDQUFDLElBQUksRUFBRTtBQUN4QixZQUFZLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDN0MsWUFBWSxJQUFJLEtBQUssQ0FBQyxTQUFTO0FBQy9CLGdCQUFnQixLQUFLLEdBQUcsZUFBZSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDaEUsWUFBWSxFQUFFLEdBQUcsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDbEosU0FBUztBQUNUO0FBQ0EsWUFBWSxFQUFFLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUMzRSxLQUFLO0FBQ0wsSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNwQyxJQUFJLE9BQU8sRUFBRSxDQUFDO0FBQ2QsQ0FBQztBQUNELFNBQVMsZUFBZSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFO0FBQ2pELElBQUksTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3pDO0FBQ0EsSUFBSSxNQUFNLENBQUMsR0FBRyxhQUFhLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN2RjtBQUNBLElBQUksTUFBTSxHQUFHLEdBQUcsYUFBYSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FBQztBQUNyRyxJQUFJLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdkIsSUFBSSxHQUFHLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUM5QixJQUFJLE9BQU8sQ0FBQyxDQUFDO0FBQ2IsQ0FBQztBQUNELFNBQVMsWUFBWSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUNuRCxJQUFJLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLEVBQUUsTUFBTSxHQUFHLFdBQVcsRUFBRSxFQUFFLE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ25KLElBQUksT0FBTyxhQUFhLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQ2xELFFBQVEsTUFBTSxFQUFFLEtBQUssQ0FBQyxLQUFLO0FBQzNCLFFBQVEsY0FBYyxFQUFFLE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMvQyxRQUFRLElBQUksRUFBRSxNQUFNO0FBQ3BCLFFBQVEsT0FBTyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDO0FBQ3hDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEIsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoQixRQUFRLENBQUMsRUFBRSxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7QUFDakMsS0FBSyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBQ0QsU0FBUyxXQUFXLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDbEUsSUFBSSxNQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM04sSUFBSSxPQUFPLGFBQWEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDaEQsUUFBUSxNQUFNLEVBQUUsS0FBSyxDQUFDLEtBQUs7QUFDM0IsUUFBUSxjQUFjLEVBQUUsU0FBUyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUM7QUFDakQsUUFBUSxnQkFBZ0IsRUFBRSxPQUFPO0FBQ2pDLFFBQVEsWUFBWSxFQUFFLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRztBQUN6RCxRQUFRLE9BQU8sRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQztBQUN4QyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hCLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEIsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUU7QUFDckIsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUU7QUFDckIsS0FBSyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBQ0QsU0FBUyxZQUFZLENBQUMsS0FBSyxFQUFFO0FBQzdCLElBQUksTUFBTSxNQUFNLEdBQUcsYUFBYSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUMxRCxRQUFRLEVBQUUsRUFBRSxZQUFZLEdBQUcsS0FBSyxDQUFDLEdBQUc7QUFDcEMsUUFBUSxNQUFNLEVBQUUsTUFBTTtBQUN0QixRQUFRLFdBQVcsRUFBRSxDQUFDO0FBQ3RCLFFBQVEsWUFBWSxFQUFFLENBQUM7QUFDdkIsUUFBUSxJQUFJLEVBQUUsSUFBSTtBQUNsQixRQUFRLElBQUksRUFBRSxJQUFJO0FBQ2xCLEtBQUssQ0FBQyxDQUFDO0FBQ1AsSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDNUQsUUFBUSxDQUFDLEVBQUUsZ0JBQWdCO0FBQzNCLFFBQVEsSUFBSSxFQUFFLEtBQUssQ0FBQyxLQUFLO0FBQ3pCLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDUixJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM1QyxJQUFJLE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUM7QUFDTSxTQUFTLGFBQWEsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFO0FBQ3pDLElBQUksS0FBSyxNQUFNLEdBQUcsSUFBSSxLQUFLO0FBQzNCLFFBQVEsRUFBRSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDekMsSUFBSSxPQUFPLEVBQUUsQ0FBQztBQUNkLENBQUM7QUFDRCxTQUFTLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFO0FBQzVCLElBQUksT0FBTyxLQUFLLEtBQUssT0FBTyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlELENBQUM7QUFDRCxTQUFTLGVBQWUsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO0FBQzFDLElBQUksT0FBTztBQUNYLFFBQVEsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO0FBQ3pCLFFBQVEsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFO0FBQ25ELFFBQVEsU0FBUyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQ3BFLFFBQVEsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO0FBQ3BFLEtBQUssQ0FBQztBQUNOLENBQUM7QUFDRCxTQUFTLFdBQVcsR0FBRztBQUN2QixJQUFJLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBQ0QsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtBQUNuQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksRUFBRSxLQUFLLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2pFLENBQUM7QUFDRCxTQUFTLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO0FBQ2pDLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksQ0FBQyxLQUFLLE9BQU8sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDdEQsQ0FBQztBQUNELFNBQVMsV0FBVyxDQUFDLE9BQU8sRUFBRTtBQUM5QixJQUFJLE9BQU8sQ0FBQyxPQUFPLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUM7QUFDcEMsQ0FBQztBQUNELFNBQVMsUUFBUSxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUU7QUFDL0IsSUFBSSxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3RCxJQUFJLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxN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
