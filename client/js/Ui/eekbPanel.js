function restoreScListOrder(scList) {
    if (!Array.isArray(scList)) throw Error('not array');
    let childToPrevious = {};
    let lastChild;
    scList.forEach(listElem => {
        if (listElem[1]) {
            childToPrevious[listElem[1]] = listElem[0];
        } else {
            lastChild = listElem[0];
        }
    });
    if (!lastChild) {
        let hasNext = {};
        scList.forEach(listItem => {
            hasNext[listItem[0]] = true;
        });
        lastChild = scList.find(listItem => !hasNext[listItem[1]]);
        if (!lastChild) throw new Error("incorrect list");
        lastChild = lastChild[1];
    }

    let list = [lastChild];
    let previous;
    while ((previous = childToPrevious[list[0]])) {
        list = [previous].concat(list);
    }
    return list;
}

function restoreCommandsOrder(commands, namesMap) {

    function buildCommandsMap(commands) {
        let commandsMap = {};
        commands.forEach(cmd => commandsMap[cmd.sc_addr] = cmd);
        return commandsMap;
    }
    let isScListConsistent = (scList) => {
        let numberWithoutNext = scList.reduce((number, tuple) =>
            tuple[1] ? number : number + 1, 0);
        let entries = {};
        scList.forEach((tuple) => {
            if (tuple[1]) entries[tuple[1]] =
                entries[tuple[1]] ? entries[tuple[1]] + 1 : 1;
        });
        let hasRepeating = Object.keys(entries).map((key) => entries[key])
            .some((item) => item > 1);
        return (numberWithoutNext <= 1) && !hasRepeating;
    };
    let restoreAlphabeticOrder = (scList) => {
        let list = scList.map(item => item[0])
            .map(item => [item, '' + (namesMap[item] || item)]);
        return list.sort((item1, item2) => item1[1].localeCompare(item2[1]))
            .map(item => item[0]);
    };

    namesMap = namesMap || {};
    let commandsMap = buildCommandsMap(commands);
    let scList = commands.map(cmd => [cmd.sc_addr, cmd.nextCommand]);
    let commandOrder = isScListConsistent(scList) ? restoreScListOrder(scList) :
        restoreAlphabeticOrder(scList);
    return commandOrder.map(sc_addr => commandsMap[sc_addr]);
}


function EekbPanel() {
    let EventManager = SCWeb.core.EventManager;
    let Main = SCWeb.core.Main;
    let Arguments = SCWeb.core.Arguments;
    let Server = SCWeb.core.Server;
    let state = {};
    let _items = [];
    let menu_container_eekb_id;
    let treeView;

    function _render(menuData, namesMap) {
        function _parseMenuItem(item) {
            //every time element builds, new array of commands ids collects
            _items.push(item.sc_addr);

            let childs = [];
            if (item.childs) {
                childs = restoreCommandsOrder(item.childs, namesMap);
                childs = childs
                    .map(_parseMenuItem);
            }

            if (item.cmd_type === 'cmd_noatom') {
                return {
                    sc_addr: item.sc_addr,
                    text: namesMap[item.sc_addr] || item.sc_addr,
                    nodes: childs,
                    cmd_type: 'cmd_noatom',
                    state: {
                        expanded: false
                    }

                };
            } else if (item.cmd_type === 'cmd_atom') {
                return {
                    sc_addr: item.sc_addr,
                    text: namesMap[item.sc_addr] || item.sc_addr,
                    cmd_type: 'cmd_atom',
                    icon: "no_children",
                    state: {
                        expanded: false
                    }
                };
            } else {
                console.log("Command ${item.sc_addr} not have cmd_type");
                return {};
            }
        };
        namesMap = namesMap || {};
        _items = [];
        let a = _parseMenuItem(menuData);
        return a.nodes;
    }

    function getObjectsToTranslate() {
        return _items;
    }

    function updateTranslation(namesMap) {
        logConstants.UPDATE_EEKB_ENTRY_STATE('update translation');
        setState({
            menuData: state.menuData,
            namesMap: namesMap
        });
    }


    function setState(newState) {
        state = newState;
        let render = _render(state.menuData, state.namesMap);
        let expandedNode;
        let treeViewNode = $('#menu_container_eekb');
        treeViewNode.treeview('remove');
        let clickOnNode = (event, data) => {
            var sc_addr = data.sc_addr;
            if (sc_addr && data.cmd_type === 'cmd_atom') {
                if (data.sc_addr) {
                    Main.doCommand(sc_addr, Arguments._arguments);
                } else {
                    if ($(this).hasClass('menu-cmd-keynode')) {
                        Main.doDefaultCommand([sc_addr]);
                    }
                }
            }
            // it's caused by fucking changing state of third-party plugin
            let treeView = treeViewNode.treeview(true);
            treeView.unselectNode(data.nodeId, {
                silent: true
            });
            treeView.toggleNodeExpanded(data.nodeId, {
                silent: true
            });
        };
        treeViewNode.treeview({
            data: render,
            onNodeSelected: clickOnNode
        }).treeview(true);
    }

    let init = function init(params) {
        menu_container_eekb_id = '#' + params.menu_container_eekb_id;

        let menuIsVisible = false;
        $('#eekb_comand_btn').click(function() {
            let menu = $("#menu_container_eekb");
            menuIsVisible = !menuIsVisible;
            menu.css({
                display: menuIsVisible
            });
            menu.toggle("slide", {
                direction: "right"
            }, 400, () => {

                function rightClick(e) {
                    const addr = $(this).context.activeElement.getAttribute('sc_addr');
                    if (addr) {
                        Arguments.appendArgument(addr);
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }

                let selector = '[sc_addr]:not(.sc-window)';

                if (menu.is(":visible")) {
                    context.hidden = true;
                    $(document).bind('contextmenu.eekbPanel', selector, rightClick);
                } else {
                    context.hidden = false;
                    $(document).unbind('contextmenu.eekbPanel');
                }
            });
        });

        $("#menu_container_eekb").css({
            width: "250px",
            display: menuIsVisible || "none"
        });

        if (Main.user.is_authenticated) {
            $('#eekb_comand_btn').css("display", "");
        }

        // register for translation updates
        EventManager.subscribe("translation/get", this, function(objects) {
            var items = getObjectsToTranslate();
            for (var i in items) {
                objects.push(items[i]);
            }
        });

        EventManager.subscribe("translation/update", this, function(names) {
            updateTranslation(names);
        });

        context.init({
            //fadeSpeed: 100,
            //filter: null,
            //above: 'auto',
            preventDoubleContext: true,
            //compress: false,
            container: '#main-container'
        });

        logConstants.UPDATE_EEKB_ENTRY_STATE('init');
        setState({
            menuData: params.menu_eekb,
            namesMap: {}
        });

        return jQuery.when();
    }.bind(this);

    eekbMenuInstance = {
        init: init,

        _render: _render,

        /**
         * Change state of panel (menu items object and names amp)
         * also replace html core in panel's HTML element
         */
        setState: setState,

        // ---------- Translation listener interface ------------
        updateTranslation: updateTranslation,

        /**
         * @return Returns list obj sc-elements that need to be translated
         */
        getObjectsToTranslate: getObjectsToTranslate
    };
    return eekbMenuInstance;
}