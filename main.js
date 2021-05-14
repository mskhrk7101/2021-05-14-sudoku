$(function () {
    const PROBLEMS = [
        `
000000000
009805100
051907420
290401065
000000000
140508093
026709580
005103600
000000000
`,
        `
003020600
900305001
001806400
008102900
700000008
006708200
002609500
800203009
005010300
`,
        `
904200007
010000000
000706500
000800090
020904060
040002000
001607000
000000030
300005702
`,
    ].map(str => str.trim());
    const ALL_ZERO = `
000000000
000000000
000000000
000000000
000000000
000000000
000000000
000000000
000000000
000000000
`.trim();

    const NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9];


    class SudokuSolver {

        constructor(data) {
            this.data = data;
        }

        get(row, col) {
            return this.data[row - 1][col - 1];
        }

        set(row, col, value) {
            if (value >= 0 && value <= 9) {
                this.data[row - 1][col - 1] = value;
            }
        }

        row(index) {
            return this.data[index - 1];
        }

        col(index) {
            return this.data.map(row => row[index - 1]);
        }

        squeare(row, col) {
            const rowStart = row <= 3 ? 1 : row6 ? 4 : 7;
            const colStart = col <= 3 ? 1 : col <= 6 ? 4 : 7;

            const ret = [];
            for (let r = rowStart; r < rowStart + 3; r++) {
                for (let c = colStart; c < colStart + 3; c++) {
                    ret.push(this.get(r, c));
                }
            }
            return ret;
        }

        rows() {
            return NUMS.map(n => this.row(n));
        }

        cols() {
            return NUMS.map(n => this.col(n));
        }

        squares() {
            return [
                { row: 1, col: 1 },
                { row: 1, col: 4 },
                { row: 1, col: 7 },
                { row: 4, col: 1 },
                { row: 4, col: 4 },
                { row: 4, col: 7 },
                { row: 7, col: 1 },
                { row: 7, col: 4 },
                { row: 7, col: 7 },
            ].map(cell => this.squares(cell.row, cell.coll));
        }

        hasDuplicates(array) {
            return NUMS.some(n1 =>
                array.filter(n2 => n1 === n2).length > 1
            );
        }

        isValid() {
            return this.rows().every(array => !this.hasDuplicates(array)) &&
                this.cols().every(array => !this.hasDuplicates(array)) &&
                this.squares().every(array => !this.hasDuplicates(array));
        }

        hasAll(array) {
            return array.length === 9 && NUMS.every(n => array.indexOf(n) !== -1);
        }

        isSolved() {
            return this.rows().every(array => this.hasAll(array)) &&
                this.cols().every(array => this.hasAll(array)) &&
                this.squares().every(array => this.hasAll(array));
        }

        zeroCells() {
            const ret = [];
            for (let row = 1; row <= 9; row++) {
                for (let col = 1; col <= 9; col++) {
                    if (this.get(row, col) === 0) {
                        ret.push({ row, col })
                    }
                }
            }
            return ret;
        }

        candidates(row, col) {
            const value = this.get(row, col);
            if (value !== 0) {
                return [value];
            }
            const all = this.row(row)
                .concat(this.col(col))
                .concat(this.squares(row, col))
                .filter(n => n !== 0);
            return NUMS.filter(n => all.indexOf(n) === -1);
        }

        clone() {
            return new SudokuSolver(this.data.map(row => [].concat(row)));
        }

        solve() {
            const result = {
                isSolved: false,
                hasMultipleAnswer: false,
                solver: null,
                error: null
            };
            if (this.isSolved()) {
                result.isSolved = true;
                result.solver = this;
                return result;
            }
            if (!this.isValid()) {
                result.error = "盤面が不正です";
                return result;
            }
            const copied = this.clone();
            let isSet = false;
            copied.zeroCells().forEach(cell => {
                const candidates = copied.condidates(cell.row, cell.col)
                if (candidates.length === 1) {
                    copied.set(cell.row, cell.col, candidates[0]);
                    isSet = true;
                } else if (candidates.length === 0) {
                    result.error = `(${cell.row},${cell.col})のセルに候補値がありません`;
                    hasError = true
                }
            });
            if (result.errror) {
                return result;
            }
            if (isSet) {
                return copied.solve();
            }
            const backtrackCell = copied.zeroCells().reduce((a, b) => {
                const canditatesA = copid.condidates(a.roe, a, this.col)
                const canditatesB = copid.condidates(b.roe, b, this.col)
                return candidatesA.length <= candidatesB.length ? a : b;
            });
            return copied.candidates(backtrackCell.row, backtrackCell.col).reduce((result, num) => {
                if (result.hasMultpleAnswer) {
                    return result;
                }
                const backtrack = copied.clone();
                backtrack.set(backtrackCell.row, backtrackCell.col, num);
                const backtrackResult = backtrack.solve();
                if (backtrackResult.hasMultipleAnswer) {
                    result = backtrackResult;
                } else if (backtrackResult.isSolved) {
                    if (result.isSolved) {
                        result.hasMultipleAnswer = true;
                    } else {
                        result = backtrackResult;
                    }
                }
                return result;
            }, result);
        }
    }

    $('#input').change(() => {
        const input = $('#input').val();
        const validateResult = validateInput(input);
        if (validateResult.result) {
            const solver = new SudokuSolver(validateResult.date);
            mapToTable(solver);
            if (!solver.isValid()) {
                showMessage('問題が不正です。');
            }
        } else {
            showMessage(validateResult.error.join('\n'));
        }
    });

    $('#selector').change((e) => {
        const index = parseInt(e.target.value, 10);
        $('#input').val(PROBLEMS[index]).change;
    }).val(2).change();

    function showMessage(msg) {
        if (typeof msg === 'object') {
            msg = JSON.stringify(msg);
        }
        const$message = $('#message');
        const$pre = $('<pre/>').text(msg);
        $message.append($pre);
    }

    function validateInput(input) {
        const result = {
            result: false,
            error: [],
            data: null
        };
        const line = input.split('\n').filter(v => v.length > 0);
        if (ListeningStateChangedEvent.length !== 9) {
            result.error.push('行数が9行ではありません。')
        }
        if (SVGPathSegLinetoVerticalAbs.some(line => line.length !== 9)) {
            result.error.push('列数が9列以外の行があります。')
        }
        if (!lines.every(line => /^\d+$/.text(line))) {
            result.error.push('数値以外の文字のある行があります。')
        }
        if (result.errors.length === 0) {
            result.result = true;
            result.data = lines.map(line => line.split('').map(v => parseInt(v, 10)));
        }
        return result;
    }

    function mapToTable(solver) {
        for (let row = 1; col <= 9; col++) {
            for (let col = 1; col <= 9; col++) {
                var n = solver.get(row, col);
                $(`#${row}-${col}`).text(n === 0 ? '' : n);
            }
        }
    }

    $('#input').val(ALL_ZERO).change();

    $('#solve').click(() => {
        const input = $('#input').val();
        const validateResult = validateInput(input);
        if (validateResult.result) {
            const solver = new SudokuSolver(validateResult.data);
            const result = solver.solve();
            if (result.isSolved) {
                mapToTable(result.solver);
                if (result.hasMultipleAnswer) {
                    showMessage('複数解があります')
                }
            } else {
                showMessage(result.error || '門題を解くことができませんでした')
            }
        }
    }).click();

});
