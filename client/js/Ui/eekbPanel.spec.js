describe("eekbLLogic", () => {
    let joc = jasmine.objectContaining;
    let eekbMenuPanel;
    SCWeb = {
        core: {
            EventManager: {},
            Main: {},
            Arguments: {},
            Server: {}
        }
    };

    beforeEach(() => {
        eekbMenuPanel = new EekbPanel();
    });

    describe('restore order of commands', function () {
        let testData = {
            'all nodes has nextCommand': {
                commands: [{
                    sc_addr: 2,
                    nextCommand: 1
                }, {
                    sc_addr: 1
                }],
                expected: [{
                    sc_addr: 2
                }, {
                    sc_addr: 1
                }]
            },
            'more all nodes has nextCommand': {
                commands: [{
                    sc_addr: 2,
                    nextCommand: 1
                }, {
                    sc_addr: 1
                }, {
                    sc_addr: 3,
                    nextCommand: 2
                }],
                expected: [{
                    sc_addr: 3
                }, {
                    sc_addr: 2
                }, {
                    sc_addr: 1
                }]
            },
            'has inconsistent sc-list': {
                commands: [{
                    sc_addr: 2,
                    nextCommand: 1
                }, {
                    sc_addr: 1
                }, {
                    sc_addr: 3
                }],
                expected: [{
                    sc_addr: 1
                }, {
                    sc_addr: 2
                }, {
                    sc_addr: 3
                }]
            },
            'restore order using alpahbetic order of names': {
                commands: [{
                    sc_addr: 2,
                    nextCommand: 1
                }, {
                    sc_addr: 1
                }, {
                    sc_addr: 3
                }],
                namesMap: {
                    1: 'bb',
                    2: 'cc',
                    3: 'aa'
                },
                expected: [{
                    sc_addr: 3
                }, {
                    sc_addr: 1
                }, {
                    sc_addr: 2
                }]
            },
            'has repeting next command works as insonsistent scList': {
                commands: [{
                    sc_addr: 1,
                    cmd_type: 'cmd_atom',
                    nextCommand: 3
                }, {
                    sc_addr: 2,
                    cmd_type: 'cmd_atom',
                    nextCommand: 1
                }, {
                    sc_addr: 3,
                    cmd_type: 'cmd_atom',
                    nextCommand: 1
                }],
                expected: [{
                    sc_addr: 1
                }, {
                    sc_addr: 2
                }, {
                    sc_addr: 3
                }]
            }
        };
        for (let description in testData) {
            it(description, () => {
                let testCase = testData[description];
                expect(restoreCommandsOrder(testCase.commands, testCase.namesMap))
                    .toEqual(testCase.expected.map(joc));
            });
        }
    });
    describe('restore order of sc-list', () => {
        it('simple example', () => {
            let scList = [
                [1, 3],
                [2, 1],
                [3]
            ];
            expect(restoreScListOrder(scList)).toEqual([2, 1, 3]);
        });
    });
    describe('_render function return tree data', () => {
        it('returns array', () => {
            let data = {
                sc_addr: 0,
                cmd_type: 'cmd_noatom',
                childs: [{
                    cmd_type: 'cmd_atom',
                    sc_addr: 1
                }, {
                    cmd_type: 'cmd_atom',
                    sc_addr: 2
                }]
            };
            expect(eekbMenuPanel._render({
                menuData: data
            })).toEqual([{
                sc_addr: 1
            }, {
                sc_addr: 2
            }].map(joc));
        });
        it('sort using nextCommand order', () => {
            let data = {
                sc_addr: 0,
                cmd_type: 'cmd_noatom',
                childs: [{
                    sc_addr: 1,
                    cmd_type: 'cmd_atom'
                }, {
                    sc_addr: 2,
                    cmd_type: 'cmd_atom',
                    nextCommand: 1
                }, {
                    sc_addr: 3,
                    cmd_type: 'cmd_atom',
                    nextCommand: 2
                }]
            };
            expect(eekbMenuPanel._render({
                menuData: data
            })).toEqual([{
                text: 3
            }, {
                text: 2
            }, {
                text: 1
            }].map(joc));
        });
        it('text is name from map or sc-addr if name doesn\'t exist', () => {
            let data = {
                sc_addr: 0,
                cmd_type: 'cmd_noatom',
                childs: [{
                    sc_addr: 1,
                    cmd_type: 'cmd_atom'
                }, {
                    sc_addr: 2,
                    cmd_type: 'cmd_atom'
                }, {
                    sc_addr: 3,
                    cmd_type: 'cmd_atom'
                }]
            };
            let namesMap = {
                1: "aa"
            };
            expect(eekbMenuPanel._render({
                menuData: data,
                namesMap: namesMap
            })).toEqual([{
                text: 2
            }, {
                text: 3
            }, {
                text: "aa"
            }].map(joc));
        });
    });
    describe("isUserHasPermision", () => {

        it("if user not authorised and command has no roles than permited", () => {
            let user = {
                "is_authenticated": false
            };
            let command = {
                "cmd_type": "cmd_noatom"
            };
            expect(eekbMenuPanel._hasPermision(user)(command)).toBe(true);
        });
        it("if user not authorized and command has roles than not permited", () => {
            let user = {
                "is_authenticated": false
            };
            let command = {
                "cmd_type": "cmd_noatom",
                "roles": ["nrel_expert"]

            };
            expect(eekbMenuPanel._hasPermision(user)(command)).toBe(false);
        });
        it("if command has no roles than user has permision", () => {
            let user = {
                "roles": ["nrel_authorised_user"],
                "is_authenticated": true
            };
            let command = {
                "cmd_type": "cmd_noatom"
            };
            expect(eekbMenuPanel._hasPermision(user)(command)).toBe(true);
        });
        it("if roles of user and command roles has intersection than permited", () => {
            let user = {
                "roles": ["nrel_authorised_user"],
                "is_authenticated": true
            };
            let command = {
                "cmd_type": "cmd_noatom",
                "roles": ["nrel_expert", "nrel_authorised_user"]

            };
            expect(eekbMenuPanel._hasPermision(user)(command)).toBe(true);
        });
        it("if intersaction empty than not permited", () => {
            let user = {
                "roles": ["nrel_authorised_user"],
                "is_authenticated": true
            };
            let command = {
                "cmd_type": "cmd_noatom",
                "roles": ["nrel_expert"]

            };
            expect(eekbMenuPanel._hasPermision(user)(command)).toBe(false);
        });
    });
    describe(`commands context predicate test,`, () => {
        it('- command context, - with-context - with-no-context --> show', () => {
            throw new Error();
        });
        it('- command context, - with-context + with-no-context --> show', () => {
            throw new Error();
        });
        it('+ command context, - with-context - with-no-context --> show', () => {
            throw new Error();
        });
        it('+ command context, - with-context - with-no-context --> show', () => {
            throw new Error();
        });
        it('+ command context, - with-context - with-no-context --> show', () => {
            throw new Error();
        });
        it('+ command context, - with-context - with-no-context --> show', () => {
            throw new Error();
        });
        it('+ command context, - with-context - with-no-context --> show', () => {
            throw new Error();
        });
    });
});