class DynamicVar {
    constructor(initialValue) {
        this.var = initialValue;
        this.listeners = {};
    }

    Get() {
        return this.var;
    }
    Set(value) {
        this.var = value;
        for (const id in this.listeners) {
            this.listeners[id](value);
        }
    }

    /**
     * Add function to be called when the variable is updated
     * @param {Function} callback 
     * @returns {Number?} ID of the listener if it was added, null otherwise
     */
    AddListener(callback) {
        if (typeof(callback) !== 'function') return null;
        let id = 0;
        while (this.listeners.hasOwnProperty(id)) id++;
        if (!this.listeners.hasOwnProperty(id)) {
            this.listeners[id] = callback;
        }
        return id;
    }
    /**
     * Remove function to be called when the variable is updated
     * @param {Number} id ID of the listener to remove
     * @returns {Boolean} True if the function was found and removed
     */
    RemoveListener(id) {
        if (this.listeners.hasOwnProperty(id)) {
            delete this.listeners[id];
            return true;
        }
        return false;
    }
}

export default DynamicVar;