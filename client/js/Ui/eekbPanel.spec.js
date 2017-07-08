import {EekbPanel} from "./eekbPanel";
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
    <li class="dropdown">
        <a sc_addr="4019453953" id="4019453953" class="menu-item menu-cmd-noatom dropdown-toggle" data-toggle="dropdown" href="#" >
            <span class="text">4019453953</span><b class="caret"></b>
        </a>
        <ul class="dropdown-menu">
            <li><a id="3220307969" sc_addr="3220307969" class="menu-item menu-cmd-atom" >3220307969</a></li>
            <li><a id="4053008385" sc_addr="4053008385" class="menu-item menu-cmd-atom" >4053008385</a></li>
            <li><a id="831651841" sc_addr="831651841" class="menu-item menu-cmd-atom" >831651841</a></li>
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
    <li class="dropdown">
        <a sc_addr="4019453953" id="4019453953" class="menu-item menu-cmd-noatom dropdown-toggle" data-toggle="dropdown" href="#" >
            <span class="text">4019453953</span><b class="caret"></b>
        </a>
        <ul class="dropdown-menu"></ul>
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
                    }
                };
            };
            panel.setState({
                menuData : testCase.menuData || {},
                namesMap : testCase.namesMap || {}
            });
            expect(createOneLinedString(panel._render())).toBe(createOneLinedString(testCase.expectedHTML))
        })
    })
    console.log(`************************************** RUN TWICE ********************* SEE COMMENTS IN THE TOP *****************************
    file -> (eekbPanel.spec.js:4:0)`)
});