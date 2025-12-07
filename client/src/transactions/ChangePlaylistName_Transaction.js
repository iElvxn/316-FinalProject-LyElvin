import { jsTPS_Transaction } from "jstps"

export default class ChangePlaylistName_Transaction extends jsTPS_Transaction {
    constructor(initStore, oldName, newName) {
        super();
        this.store = initStore;
        this.oldName = oldName;
        this.newName = newName;
    }

    executeDo() {
        this.store.changePlaylistName(this.newName);
    }

    executeUndo() {
        this.store.changePlaylistName(this.oldName);
    }
}