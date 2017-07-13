// @flow

export function assert(message/*: string | () => string*/) {
    if (process.env.END === 'develope') {
        if (typeof message === 'string') throw new Error(message);
        if (typeof message === 'function') throw new Error(message());
    } else {
        if (typeof message === 'string') console.log(message);
        if (typeof message === 'function') console.log(message());
    }
}

export let logConstants = {
    COMMAND_ORDER_iS_NOT_EXISTS: (scAddr) => `COMMAND_ORDER_iS_NOT_EXISTS. Parrent menu entry addr [${scAddr}]`,
    COMMAND_ORDER_iS_EXISTS: (scAddr) => `COMMAND_ORDER_iS_EXISTS. Parrent menu entry addr [${scAddr}]`,
    UPDATE_EEKB_ENTRY_STATE: (lifeCyclePart) => `UPDATE_EEKB_ENTRY_STATE. Life cycle part [${lifeCyclePart}]`,
};