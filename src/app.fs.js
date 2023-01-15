import { toString as toString_1, Union, Record } from "./fable_modules/fable-library.3.7.20/Types.js";
import { getCaseFields, getCaseName as getCaseName_1, isUnion, union_type, list_type, record_type, int32_type, bool_type, string_type } from "./fable_modules/fable-library.3.7.20/Reflection.js";
import { cons, length, isEmpty, forAll, fold, ofArray, filter, map, singleton, append, empty } from "./fable_modules/fable-library.3.7.20/List.js";
import { join, isNullOrEmpty } from "./fable_modules/fable-library.3.7.20/String.js";
import { bind, some } from "./fable_modules/fable-library.3.7.20/Option.js";
import { uint64 as uint64_1, int64 as int64_1, decimal as decimal_1, Auto_generateBoxedDecoder_79988AEF } from "./fable_modules/Thoth.Json.6.0.0/./Decode.fs.js";
import { fromString } from "./fable_modules/Thoth.Json.6.0.0/Decode.fs.js";
import { int32ToString, uncurry } from "./fable_modules/fable-library.3.7.20/Util.js";
import { uint64, int64, decimal, toString, Auto_generateBoxedEncoder_Z20B7B430 } from "./fable_modules/Thoth.Json.6.0.0/./Encode.fs.js";
import { Cmd_batch, Cmd_OfFunc_attempt } from "./fable_modules/Fable.Elmish.4.0.0/cmd.fs.js";
import { HTMLAttr, DOMAttr } from "./fable_modules/Fable.React.9.2.0/Fable.React.Props.fs.js";
import * as react from "react";
import { Internal_updateInputValue } from "./fable_modules/Fable.Elmish.React.4.0.0/./common.fs.js";
import { keyValueList } from "./fable_modules/fable-library.3.7.20/MapUtil.js";
import { Common_lazyView3, Common_lazyView, Common_lazyView2 } from "./fable_modules/Fable.Elmish.React.4.0.0/common.fs.js";
import { ProgramModule_mkProgram, ProgramModule_run } from "./fable_modules/Fable.Elmish.4.0.0/program.fs.js";
import { Program_withReactBatched } from "./fable_modules/Fable.Elmish.React.4.0.0/react.fs.js";
import { Program_withDebuggerUsing, Debugger_showWarning, Debugger_showError } from "./fable_modules/Fable.Elmish.Debugger.4.0.0/./debugger.fs.js";
import { newGuid } from "./fable_modules/fable-library.3.7.20/Guid.js";
import { add } from "./fable_modules/fable-library.3.7.20/Map.js";
import { empty as empty_1 } from "./fable_modules/Fable.Elmish.Debugger.4.0.0/../Thoth.Json.6.0.0/Extra.fs.js";
import { ExtraCoders } from "./fable_modules/Thoth.Json.6.0.0/Types.fs.js";
import { fromValue } from "./fable_modules/Fable.Elmish.Debugger.4.0.0/../Thoth.Json.6.0.0/Decode.fs.js";
import { Debugger_ConnectionOptions } from "./fable_modules/Fable.Elmish.Debugger.4.0.0/debugger.fs.js";
import { Options$1 } from "./fable_modules/Fable.Elmish.Debugger.4.0.0/Fable.Import.RemoteDev.fs.js";
import { connectViaExtension } from "remotedev";

export class Entry extends Record {
    constructor(description, completed, editing, id) {
        super();
        this.description = description;
        this.completed = completed;
        this.editing = editing;
        this.id = (id | 0);
    }
}

export function Entry$reflection() {
    return record_type("App.Entry", [], Entry, () => [["description", string_type], ["completed", bool_type], ["editing", bool_type], ["id", int32_type]]);
}

export class Model extends Record {
    constructor(entries, field, uid, visibility) {
        super();
        this.entries = entries;
        this.field = field;
        this.uid = (uid | 0);
        this.visibility = visibility;
    }
}

export function Model$reflection() {
    return record_type("App.Model", [], Model, () => [["entries", list_type(Entry$reflection())], ["field", string_type], ["uid", int32_type], ["visibility", string_type]]);
}

export const emptyModel = new Model(empty(), "", 0, "all");

export function newEntry(desc, id) {
    return new Entry(desc, false, false, id);
}

export function init(_arg) {
    if (_arg != null) {
        const savedModel = _arg;
        return [savedModel, empty()];
    }
    else {
        return [emptyModel, empty()];
    }
}

export class Msg extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["Failure", "UpdateField", "EditingEntry", "UpdateEntry", "Add", "Delete", "DeleteComplete", "Check", "CheckAll", "ChangeVisibility"];
    }
}

export function Msg$reflection() {
    return union_type("App.Msg", [], Msg, () => [[["Item", string_type]], [["Item", string_type]], [["Item1", int32_type], ["Item2", bool_type]], [["Item1", int32_type], ["Item2", string_type]], [], [["Item", int32_type]], [], [["Item1", int32_type], ["Item2", bool_type]], [["Item", bool_type]], [["Item", string_type]]]);
}

export function update(msg, model) {
    switch (msg.tag) {
        case 4: {
            const xs = isNullOrEmpty(model.field) ? model.entries : append(model.entries, singleton(newEntry(model.field, model.uid)));
            return [new Model(xs, "", model.uid + 1, model.visibility), empty()];
        }
        case 1: {
            const str = msg.fields[0];
            return [new Model(model.entries, str, model.uid, model.visibility), empty()];
        }
        case 2: {
            const isEditing = msg.fields[1];
            const id = msg.fields[0] | 0;
            const updateEntry = (t) => {
                if (t.id === id) {
                    return new Entry(t.description, t.completed, isEditing, t.id);
                }
                else {
                    return t;
                }
            };
            return [new Model(map(updateEntry, model.entries), model.field, model.uid, model.visibility), empty()];
        }
        case 3: {
            const task = msg.fields[1];
            const id_1 = msg.fields[0] | 0;
            const updateEntry_1 = (t_1) => {
                if (t_1.id === id_1) {
                    return new Entry(task, t_1.completed, t_1.editing, t_1.id);
                }
                else {
                    return t_1;
                }
            };
            return [new Model(map(updateEntry_1, model.entries), model.field, model.uid, model.visibility), empty()];
        }
        case 5: {
            const id_2 = msg.fields[0] | 0;
            return [new Model(filter((t_2) => (t_2.id !== id_2), model.entries), model.field, model.uid, model.visibility), empty()];
        }
        case 6: {
            return [new Model(filter((t_3) => (!t_3.completed), model.entries), model.field, model.uid, model.visibility), empty()];
        }
        case 7: {
            const isCompleted = msg.fields[1];
            const id_3 = msg.fields[0] | 0;
            const updateEntry_2 = (t_4) => {
                if (t_4.id === id_3) {
                    return new Entry(t_4.description, isCompleted, t_4.editing, t_4.id);
                }
                else {
                    return t_4;
                }
            };
            return [new Model(map(updateEntry_2, model.entries), model.field, model.uid, model.visibility), empty()];
        }
        case 8: {
            const isCompleted_1 = msg.fields[0];
            const updateEntry_3 = (t_5) => (new Entry(t_5.description, isCompleted_1, t_5.editing, t_5.id));
            return [new Model(map(updateEntry_3, model.entries), model.field, model.uid, model.visibility), empty()];
        }
        case 9: {
            const visibility = msg.fields[0];
            return [new Model(model.entries, model.field, model.uid, visibility), empty()];
        }
        default: {
            const err = msg.fields[0];
            console.error(some(err));
            return [model, empty()];
        }
    }
}

const S_STORAGE_KEY = "elmish-react-todomvc";

const S_decoder = Auto_generateBoxedDecoder_79988AEF(Model$reflection(), void 0, void 0);

export function S_load() {
    return bind((arg) => {
        const _arg = fromString(uncurry(2, S_decoder), arg);
        if (_arg.tag === 0) {
            const r = _arg.fields[0];
            return r;
        }
        else {
            return void 0;
        }
    }, localStorage.getItem(S_STORAGE_KEY));
}

export function S_save(model) {
    let encoder;
    localStorage.setItem(S_STORAGE_KEY, (encoder = Auto_generateBoxedEncoder_Z20B7B430(Model$reflection(), void 0, void 0, void 0), toString(1, encoder(model))));
}

export function setStorage(model) {
    return Cmd_OfFunc_attempt((model_1) => {
        S_save(model_1);
    }, model, (arg_1) => (new Msg(0, toString_1(arg_1))));
}

export function updateWithStorage(msg, model) {
    if (msg.tag === 0) {
        return [model, empty()];
    }
    else {
        const patternInput = update(msg, model);
        const newModel = patternInput[0];
        const cmds = patternInput[1];
        return [newModel, Cmd_batch(ofArray([setStorage(newModel), cmds]))];
    }
}

export function onEnter(msg, dispatch) {
    return new DOMAttr(15, (_arg) => {
        let ev;
        if ((ev = _arg, ev.key === "Enter")) {
            const ev_1 = _arg;
            ev_1.target.value = "";
            dispatch(msg);
        }
    });
}

export function viewInput(model, dispatch) {
    let props_2;
    const children_2 = [react.createElement("h1", {}, "todos"), (props_2 = [new HTMLAttr(64, "new-todo"), new HTMLAttr(128, "What needs to be done?"), ["ref", (e) => {
        Internal_updateInputValue(model, e);
    }], onEnter(new Msg(4), dispatch), new DOMAttr(9, (ev) => {
        dispatch(new Msg(1, ev.target.value));
    }), new HTMLAttr(55, true)], react.createElement("input", keyValueList(props_2, 1)))];
    return react.createElement("header", {
        className: "header",
    }, ...children_2);
}

export function classList(classes) {
    return new HTMLAttr(64, fold((complete, _arg) => {
        if (_arg[1]) {
            const name = _arg[0];
            return (complete + " ") + name;
        }
        else {
            return complete;
        }
    }, "", classes));
}

export function viewEntry(todo, dispatch) {
    let children_4, props_8;
    const props_10 = [classList(ofArray([["completed", todo.completed], ["editing", todo.editing]]))];
    const children_6 = [(children_4 = [react.createElement("input", {
        className: "toggle",
        type: "checkbox",
        checked: todo.completed,
        onChange: (_arg) => {
            dispatch(new Msg(7, todo.id, !todo.completed));
        },
    }), react.createElement("label", {
        onDoubleClick: (_arg_1) => {
            dispatch(new Msg(2, todo.id, true));
        },
    }, todo.description), react.createElement("button", {
        className: "destroy",
        onClick: (_arg_2) => {
            dispatch(new Msg(5, todo.id));
        },
    })], react.createElement("div", {
        className: "view",
    }, ...children_4)), (props_8 = [new HTMLAttr(64, "edit"), ["ref", (e) => {
        Internal_updateInputValue(todo.description, e);
    }], new HTMLAttr(123, "title"), new HTMLAttr(99, "todo-" + int32ToString(todo.id)), new DOMAttr(10, (ev) => {
        dispatch(new Msg(3, todo.id, ev.target.value));
    }), new DOMAttr(8, (_arg_3) => {
        dispatch(new Msg(2, todo.id, false));
    }), onEnter(new Msg(2, todo.id, false), dispatch)], react.createElement("input", keyValueList(props_8, 1)))];
    return react.createElement("li", keyValueList(props_10, 1), ...children_6);
}

export function viewEntries(visibility, entries, dispatch) {
    let children_2;
    const isVisible = (todo) => {
        switch (visibility) {
            case "completed": {
                return todo.completed;
            }
            case "active": {
                return !todo.completed;
            }
            default: {
                return true;
            }
        }
    };
    const allCompleted = forAll((t) => t.completed, entries);
    const cssVisibility = isEmpty(entries) ? "hidden" : "visible";
    const props_6 = [new HTMLAttr(64, "main"), ["style", {
        visibility: cssVisibility,
    }]];
    const children_4 = [react.createElement("input", {
        className: "toggle-all",
        type: "checkbox",
        name: "toggle",
        checked: allCompleted,
        onChange: (_arg) => {
            dispatch(new Msg(8, !allCompleted));
        },
    }), react.createElement("label", {
        htmlFor: "toggle-all",
    }, "Mark all as complete"), (children_2 = map((i) => Common_lazyView2(viewEntry)(i)(dispatch), filter(isVisible, entries)), react.createElement("ul", {
        className: "todo-list",
    }, ...children_2))];
    return react.createElement("section", keyValueList(props_6, 1), ...children_4);
}

export function visibilitySwap(uri, visibility, actualVisibility, dispatch) {
    let props;
    const children_2 = [(props = [new HTMLAttr(94, uri), classList(singleton(["selected", visibility === actualVisibility]))], react.createElement("a", keyValueList(props, 1), visibility))];
    return react.createElement("li", {
        onClick: (_arg) => {
            dispatch(new Msg(9, visibility));
        },
    }, ...children_2);
}

export function viewControlsFilters(visibility, dispatch) {
    const children = [visibilitySwap("#/", "all", visibility, dispatch), " ", visibilitySwap("#/active", "active", visibility, dispatch), " ", visibilitySwap("#/completed", "completed", visibility, dispatch)];
    return react.createElement("ul", {
        className: "filters",
    }, ...children);
}

export function viewControlsCount(entriesLeft) {
    let children;
    const item = (entriesLeft === 1) ? " item" : " items";
    const children_2 = [(children = [int32ToString(entriesLeft)], react.createElement("strong", {}, ...children)), item + " left"];
    return react.createElement("span", {
        className: "todo-count",
    }, ...children_2);
}

export function viewControlsClear(entriesCompleted, dispatch) {
    const props = [new HTMLAttr(64, "clear-completed"), new HTMLAttr(92, entriesCompleted === 0), new DOMAttr(40, (_arg) => {
        dispatch(new Msg(6));
    })];
    const children = [("Clear completed (" + int32ToString(entriesCompleted)) + ")"];
    return react.createElement("button", keyValueList(props, 1), ...children);
}

export function viewControls(visibility, entries, dispatch) {
    const entriesCompleted = length(filter((t) => t.completed, entries)) | 0;
    const entriesLeft = (length(entries) - entriesCompleted) | 0;
    const props = [new HTMLAttr(64, "footer"), new HTMLAttr(92, isEmpty(entries))];
    const children = [Common_lazyView(viewControlsCount)(entriesLeft), Common_lazyView2(viewControlsFilters)(visibility)(dispatch), Common_lazyView2(viewControlsClear)(entriesCompleted)(dispatch)];
    return react.createElement("footer", keyValueList(props, 1), ...children);
}

export const infoFooter = (() => {
    let children_4, children_8;
    const children_10 = [react.createElement("p", {}, "Double-click to edit a todo"), (children_4 = ["Ported from Elm by ", react.createElement("a", {
        href: "https://github.com/et1975",
    }, "Eugene Tolmachev")], react.createElement("p", {}, ...children_4)), (children_8 = ["Part of ", react.createElement("a", {
        href: "http://todomvc.com",
    }, "TodoMVC")], react.createElement("p", {}, ...children_8))];
    return react.createElement("footer", {
        className: "info",
    }, ...children_10);
})();

export function view(model, dispatch) {
    let children;
    const children_2 = [(children = [Common_lazyView2(viewInput)(model.field)(dispatch), Common_lazyView3(viewEntries)(model.visibility)(model.entries)(dispatch), Common_lazyView3(viewControls)(model.visibility)(model.entries)(dispatch)], react.createElement("section", {
        className: "todoapp",
    }, ...children)), infoFooter];
    return react.createElement("div", {
        className: "todomvc-wrapper",
    }, ...children_2);
}

ProgramModule_run((() => {
    let copyOfStruct, copyOfStruct_1, copyOfStruct_2, deflate, inflate, port, address, inputRecord_1, port_1, address_1, inputRecord_2;
    const program_2 = Program_withReactBatched("todoapp", ProgramModule_mkProgram(() => init(S_load()), updateWithStorage, view));
    try {
        let patternInput;
        try {
            let coders;
            let extra_2_1;
            const extra_1_1 = new ExtraCoders((copyOfStruct = newGuid(), copyOfStruct), add("System.Decimal", [decimal, (path) => ((value_1) => decimal_1(path, value_1))], empty_1.Coders));
            extra_2_1 = (new ExtraCoders((copyOfStruct_1 = newGuid(), copyOfStruct_1), add("System.Int64", [int64, int64_1], extra_1_1.Coders)));
            coders = (new ExtraCoders((copyOfStruct_2 = newGuid(), copyOfStruct_2), add("System.UInt64", [uint64, uint64_1], extra_2_1.Coders)));
            const encoder_3 = Auto_generateBoxedEncoder_Z20B7B430(Model$reflection(), void 0, coders, void 0);
            const decoder_3 = Auto_generateBoxedDecoder_79988AEF(Model$reflection(), void 0, coders);
            patternInput = ((deflate = ((x) => {
                try {
                    return encoder_3(x);
                }
                catch (er) {
                    Debugger_showWarning(singleton(er.message));
                    return x;
                }
            }), (inflate = ((x_1) => {
                const matchValue = fromValue("$", uncurry(2, decoder_3), x_1);
                if (matchValue.tag === 1) {
                    const er_1 = matchValue.fields[0];
                    throw (new Error(er_1));
                }
                else {
                    const x_2 = matchValue.fields[0];
                    return x_2;
                }
            }), [deflate, inflate])));
        }
        catch (er_2) {
            Debugger_showWarning(singleton(er_2.message));
            patternInput = [(value_7) => value_7, (_arg_1) => {
                throw (new Error("Cannot inflate model"));
            }];
        }
        const inflater = patternInput[1];
        const deflater = patternInput[0];
        let connection;
        const opt = new Debugger_ConnectionOptions(0);
        const makeMsgObj = (tupledArg) => {
            const case$ = tupledArg[0];
            const fields = tupledArg[1];
            return {
                type: case$,
                msg: fields,
            };
        };
        const getCase = (x_3) => {
            if (isUnion(x_3)) {
                const getCaseName = (acc_mut, x_1_1_mut) => {
                    getCaseName:
                    while (true) {
                        const acc = acc_mut, x_1_1 = x_1_1_mut;
                        const acc_1 = cons(getCaseName_1(x_1_1), acc);
                        const fields_1 = getCaseFields(x_1_1);
                        if ((fields_1.length === 1) && isUnion(fields_1[0])) {
                            acc_mut = acc_1;
                            x_1_1_mut = fields_1[0];
                            continue getCaseName;
                        }
                        else {
                            return makeMsgObj([join("/", acc_1), fields_1]);
                        }
                        break;
                    }
                };
                return getCaseName(empty(), x_3);
            }
            else {
                return makeMsgObj(["NOT-AN-F#-UNION", x_3]);
            }
        };
        const fallback = new Options$1(true, 443, "remotedev.io", true, getCase);
        connection = connectViaExtension((opt.tag === 1) ? ((port = (opt.fields[1] | 0), (address = opt.fields[0], (inputRecord_1 = fallback, new Options$1(inputRecord_1.remote, port, address, false, inputRecord_1.getActionType))))) : ((opt.tag === 2) ? ((port_1 = (opt.fields[1] | 0), (address_1 = opt.fields[0], (inputRecord_2 = fallback, new Options$1(inputRecord_2.remote, port_1, address_1, inputRecord_2.secure, inputRecord_2.getActionType))))) : (new Options$1(false, 8000, "localhost", false, fallback.getActionType))));
        return Program_withDebuggerUsing(deflater, inflater, connection, program_2);
    }
    catch (ex) {
        Debugger_showError(ofArray(["Unable to connect to the monitor, continuing w/o debugger", ex.message]));
        return program_2;
    }
})());

//# sourceMappingURL=app.fs.js.map
