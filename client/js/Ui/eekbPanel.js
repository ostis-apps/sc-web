import {Arguments, EventManager, Main, Server} from "./index.js";

export function EekbPanel() {
    let state = {};
    let _items = [];
    let menu_container_eekb_id;

    function _render() {
        _items = [];
        let childs = state.menuData.childs.map(_parseMenuItem).join('');
        return `<ul class="nav navbar-nav">${childs}</ul>`;
    }

    function _parseMenuItem(item) {
        //every time element builds, new array of commands ids collects
        _items.push(item.id);

        let childs = item.childs ? item.childs.map(item => [item, state.namesMap[item.id] || item.id])
            .map(item => {
                //primitive to String
                item[1] = '' + item[1];
                return item;
            })
            .sort((item1, item2) => item1[1].localeCompare(item2[1]))
            .map(item => item[0])
            .map(_parseMenuItem)
            .join('') : '';

        if (item.cmd_type === 'cmd_noatom') {
            return `
                    <li>
                        <a sc_addr="${item.id}" id="${item.id}" class="eekb-menu-item menu-cmd-noatom ui-no-tooltip not-argument"  href="#" >
                            <span class="text">${state.namesMap[item.id] || item.id}</span>
                            <b class="caret"></b>
                        </a>
                    <ul style="padding-left: 20px; display: none">${childs}</ul></li>
                    `;
        } else if (item.cmd_type === 'cmd_atom') {
            return `
                    <li>
                        <a id="${item.id}" sc_addr="${item.id}" class="eekb-menu-item menu-cmd-atom ui-no-tooltip not-argument" >${state.namesMap[item.id] || item.id}</a>
                    </li>
                    `;
        } else {
            console.log("Command ${item.id} not have cmd_type");
            //throw new Error('illegal command type')
            // itemHtml = '<li><a id="' + item.id + '"sc_addr="' + item.id + '" class="eekb-menu-item menu-cmd-keynode" >' + item.id + '</a>';
        }

    }

    function _registerMenuHandler() {

        $('.eekb-menu-item').click(function () {
            var sc_addr = $(this).attr('sc_addr');
            if ($(this).hasClass('menu-cmd-atom')) {
                Main.doCommand(sc_addr, Arguments._arguments);
            } else {
                if(!$(this).parent("li").hasClass("dropdown")){
                    var comandList=$(this).next( "ul" );

                    if(comandList.css("display")=="none"){
                        $(this).parent("li").parent("ul").find("ul").slideUp("slow");
                        comandList.slideDown("slow");
                    }
                    else{
                        comandList.slideUp("slow");
                    }
                }
                if ($(this).hasClass('menu-cmd-keynode')) {
                    Main.doDefaultCommand([sc_addr]);
                    return ;
                }
            }
        });
        $('.eekb-menu-item').hover(function () {
            if($(this).parent("li").parent("ul").hasClass("nav navbar-nav"))
                return false;
            $(this).parent("li").css({
                "background-color":"#337ab7"
            });
            $(this).css({"color":"white"});
        },function () {
            if($(this).parent("li").parent("ul").hasClass("nav navbar-nav"))
                return false;
            $(this).parent("li").css({
                "background-color":"white"
            });
            $(this).css({"color":"#337ab7"});
        });
    }

    function _contextMenu(target) {
        var dfd = new jQuery.Deferred();
        var args = Arguments._arguments.slice();
        args.push(target.attr('sc_addr'));
        Server.contextMenu(args, function (data) {


            var parseMenuItem = function (item) {
                var menu_item = {};
                menu_item.action = function (e) {
                    Main.doCommand(item, args);
                }

                return item;
            }

            var menu = [];
            for (i in data) {
               menu.push(parseMenuItem(data[i]))
            }

            var applyTranslation = function (item, id, text) {
                if (item.text == id) {
                    item.text = text;
                }
                if (item.subMenu) {
                    for (i in item.subMenu) {
                        applyTranslation(item.subMenu[i], id, text);
                    }
                }
            }

            Server.resolveIdentifiers(data, function (namesMap) {

                for (var itemId in namesMap) {
                    if (namesMap.hasOwnProperty(itemId)) {
                        for (i in menu) {
                            applyTranslation(menu[i], itemId, namesMap[itemId]);
                        }
                    }
                }

                // sort menu
                menu.sort(function (a, b) {
                    if (a.text > b.text)
                        return 1;
                    if (a.text < b.text)
                        return -1;
                    return 0;
                });

                menu.unshift({
                    text: '<span class="glyphicon glyphicon-pushpin" aria-hidden="true"></span>',
                    action: function (e) {
                        Arguments.appendArgument(target.attr('sc_addr'));
                    }
                });

                dfd.resolve(menu);
            });
        });

        return dfd.promise();
    }

    function getObjectsToTranslate() {
        return _items;
    }

    function updateTranslation(namesMap) {
        setState({
            menuData: state.menuData,
            namesMap: namesMap
        })
    }

    function setState(newState) {
        state = newState;

        $(menu_container_eekb_id).html(_render());

        _registerMenuHandler();

    }

    let init = function init(params) {
        menu_container_eekb_id = '#' + params.menu_container_eekb_id;

        // register for translation updates
        EventManager.subscribe("translation/get", this, function (objects) {
            var items = getObjectsToTranslate();
            for (var i in items) {
                objects.push(items[i]);
            }
        });

        EventManager.subscribe("translation/update", this, function (names) {
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

        context.attach('[sc_addr]', _contextMenu);

        setState({
            menuData: params.menu_eekb,
            namesMap: {}
        });

        return jQuery.when();
    }.bind(this);


    return {
        init: init,

        _render: _render,

        _parseMenuItem: _parseMenuItem,

        _registerMenuHandler: _registerMenuHandler,

        _contextMenu: _contextMenu,

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
        getObjectsToTranslate: getObjectsToTranslate,
    };
}