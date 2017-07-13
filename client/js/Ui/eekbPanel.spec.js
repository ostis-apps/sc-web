import {EekbPanel, restoreOrder, restoreOrderOfMenuItems, getScList} from "./eekbPanel";
import * as eekb from "./eekbPanel"
// import {diffChars} from "jasmine-diff-matchers"

//run test twice. there some intresting bug. test runner load previous version of changed file :)
describe('eekbPanelSpec', () => {

    beforeEach(function () {
        jasmine.addMatchers(require('jasmine-diff')(jasmine, {
            colors: true,
            inline: true
        }))
    })

    let createOneLinedString = str => str.split("\n").map(str => str.trim()).join('');

    let testData = [
        {
            description: 'first simple example',
            menuData: {
                "cmd_type": "cmd_noatom",
                "id": 328531969,
                "childs": [{
                    "cmd_type": "cmd_noatom",
                    "id": 4019453953,
                    "childs": [{"cmd_type": "cmd_atom", "id": 831651841}, {
                        "cmd_type": "cmd_atom",
                        "id": 4053008385
                    }, {"cmd_type": "cmd_atom", "id": 3220307969}]
                }]
            },
            expectedHTML: `
<ul class="nav navbar-nav">
    <li>
        <a sc_addr="4019453953" id="4019453953" class="eekb-menu-item menu-cmd-noatom ui-no-tooltip not-argument" href="#" >
            <span class="text">4019453953</span><b class="caret"></b>
        </a>
        <ul style="padding-left: 20px; display: none">
            <li><a id="3220307969" sc_addr="3220307969" class="eekb-menu-item menu-cmd-atom ui-no-tooltip not-argument" >3220307969</a></li>
            <li><a id="4053008385" sc_addr="4053008385" class="eekb-menu-item menu-cmd-atom ui-no-tooltip not-argument" >4053008385</a></li>
            <li><a id="831651841" sc_addr="831651841" class="eekb-menu-item menu-cmd-atom ui-no-tooltip not-argument" >831651841</a></li>
        </ul>
    </li>
</ul>`.trim()
        },
        {
            description: 'no-one children',
            menuData: {
                "cmd_type": "cmd_noatom",
                "id": 328531969,
                "childs": [{
                    "cmd_type": "cmd_noatom",
                    "id": 4019453953,
                    "childs": []
                }]
            },
            expectedHTML: `
<ul class="nav navbar-nav">
    <li>
        <a sc_addr="4019453953" id="4019453953" class="eekb-menu-item menu-cmd-noatom ui-no-tooltip not-argument" href="#" >
            <span class="text">4019453953</span><b class="caret"></b>
        </a>
        <ul style="padding-left: 20px; display: none"></ul>
    </li>
</ul>`
        }];
    testData.forEach(testCase => {
        it(testCase.description, () => {
            let panel = new EekbPanel();
            //stub
            $ = () => {
                return {
                    html: () => {
                    },
                    click: () => {

                    }, hover: () => {

                    }
                };
            };
            panel.setState({
                menuData: testCase.menuData || {},
                namesMap: testCase.namesMap || {}
            });
            expect(createOneLinedString(panel._render())).toBe(createOneLinedString(testCase.expectedHTML))
        })
    })
    console.log(`************************************** RUN TWICE ********************* SEE COMMENTS IN THE TOP *****************************
    file -> (eekbPanel.spec.js:4:0)`)
});

describe('restoreOrder', () => {
    let testData = [{
        description: 'simple list',
        data: [[2, null], [1, 2],],
        expected: [1, 2]
    }, {
        description: 'longer list',
        data: [[2, 3], [1, 2], [4, null], [3, 4]],
        expected: [1, 2, 3, 4]
    }, {
        description: 'longer list without null',
        data: [[2, 3], [1, 2], [4, 5], [3, 4]],
        expected: [1, 2, 3, 4, 5]
    }]

    testData.forEach(testCase => {
        it(testCase.description, () => {
            expect(restoreOrder(testCase.data)).toEqual(testCase.expected)
        })
    })
});

describe('restore order of menuItems', () => {
    beforeEach(() => {
        scKeynodes = {
            nrel_ui_commands_decomposition: true,
            nrel_command_order: true
        };
    });
    it('simple variant', done => {
            window.sctpClient = {
                iterate_constr: () => {
                    return {
                        done: resolve => resolve((function () {
                            let arr = [[1, 2], [2, 3], [3, 4], [4, 5]];
                            return {
                                get: (i, name) => {
                                    if (name === 'child') return arr[i][0];
                                    if (name === 'nextChild') return arr[i][1];
                                },
                                results: [1, 1, 1, 1]
                            }
                        })())
                    }
                }
            };

            let menuItem = {
                "cmd_type": "cmd_noatom",
                "id": 1395785729,
                "childs": [{
                    "cmd_type": "cmd_atom",
                    "id": 2,
                }, {
                    "cmd_type": "cmd_atom",
                    "id": 1,
                }, {
                    "cmd_type": "cmd_atom",
                    "id": 3,
                }, {
                    "cmd_type": "cmd_atom",
                    "id": 5,
                }, {
                    "cmd_type": "cmd_atom",
                    "id": 4,
                }]
            };
            restoreOrderOfMenuItems(menuItem)
                .then(menuItem => {
                    expect(menuItem.childs.map(child => child.id)).toEqual([1, 2, 3, 4, 5]);
                    expect(menuItem.ordered).toBe(true);
                }).then(done, done.fail);
        }
    );
    it('do not find order', done => {
            window.sctpClient = {
                iterate_constr: () => {
                    return {
                        done: function () {
                            return this;
                        },
                        fail: function (fail) {
                            fail();
                            return this;
                        }
                    }
                }
            };

            let menuItem = {
                "cmd_type": "cmd_noatom",
                "id": 1395785729,
                "childs": [{
                    "cmd_type": "cmd_atom",
                    "id": 2,
                }, {
                    "cmd_type": "cmd_atom",
                    "id": 1,
                }, {
                    "cmd_type": "cmd_atom",
                    "id": 3,
                }, {
                    "cmd_type": "cmd_atom",
                    "id": 5,
                }, {
                    "cmd_type": "cmd_atom",
                    "id": 4,
                }]
            };
            restoreOrderOfMenuItems(menuItem)
                .then(menuItem => {
                    expect(menuItem.childs.map(child => child.id)).toEqual([2, 1, 3, 5, 4]);
                    expect(menuItem.ordered).not.toBe(false);
                }).then(done, done.fail);
        }
    );
    it('do not find order of nested commands', done => {
            window.sctpClient = {
                iterate_constr: () => {
                    return {
                        done: function () {
                            return this;
                        },
                        fail: function (fail) {
                            fail();
                            window.sctpClient = {
                                iterate_constr: () => {
                                    return {
                                        done: resolve => resolve((function () {
                                            let arr = [[1, 2], [2, 3], [3, 4], [4, 5]];
                                            return {
                                                get: (i, name) => {
                                                    if (name === 'child') return arr[i][0];
                                                    if (name === 'nextChild') return arr[i][1];
                                                },
                                                results: [1, 1, 1, 1]
                                            }
                                        })())
                                    }
                                }
                            };
                            return this;
                        }
                    }
                }
            };

            let menuItem = {
                cmd_type: "cmd_noatom",
                id: 1,
                childs: [
                    {
                        "cmd_type": "cmd_noatom",
                        "id": 1395785729,
                        "childs": [{
                            "cmd_type": "cmd_atom",
                            "id": 2,
                        }, {
                            "cmd_type": "cmd_atom",
                            "id": 1,
                        }, {
                            "cmd_type": "cmd_atom",
                            "id": 3,
                        }, {
                            "cmd_type": "cmd_atom",
                            "id": 5,
                        }, {
                            "cmd_type": "cmd_atom",
                            "id": 4,
                        }]
                    }
                ]
            };
            restoreOrderOfMenuItems(menuItem)
                .then(menuItem => {
                    expect(menuItem.id).toBe(1);
                    expect(menuItem.ordered).not.toBe(false);
                    let child = menuItem.childs[0];
                    expect(child.childs.map(child => child.id)).toEqual([1, 2, 3, 4, 5]);
                    expect(child.ordered).toBe(true);
                }).then(done, done.fail);
        }
    );
});