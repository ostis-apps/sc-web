describe('restore order of commands', function () {
    let joc = jasmine.objectContaining;
    it('all nodes has nextCommand', () => {

        let data = [{
            sc_addr: 2,
            nextCommand: 1
        }, {
            sc_addr: 1
        }];
        expect(restoreCommandsOrder(data)).toEqual([joc({
            sc_addr: 2
        }), joc({
            sc_addr: 1
        })]);
    });
    it('more all nodes has nextCommand', () => {

        let data = [{
            sc_addr: 2,
            nextCommand: 1
        }, {
            sc_addr: 1
        }, {
            sc_addr: 3,
            nextCommand: 2
        }];
        expect(restoreCommandsOrder(data)).toEqual([joc({
            sc_addr: 3
        }), joc({
            sc_addr: 2
        }), joc({
            sc_addr: 1
        })]);
    });
});

describe('restore order of sc-list', () => {
    it('simple example', () => {
        let scList = [
            [1, 3],
            [2, 1],
            [3]
        ];
        expect(restoreOrder(scList)).toEqual([2, 1, 3]);
    });
});