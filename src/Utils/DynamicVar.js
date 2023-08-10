class DynamicVar {
    constructor(initialValue) {
        this.var = initialValue;
        this.listeners = {};
    }

    Get() {
        return this.var;
    }

    /**
     * @param {any} value Left undefined to update without changing the value
     * @param {boolean} update If true, all listeners will be called
     */
    Set(value, update = true) {
        if (typeof(value) !== 'undefined') {
            this.var = value;
        }
        if (update) {
            for (const id in this.listeners) {
                this.listeners[id](value);
            }
        }
    }

    /**
     * Add function to be called when the variable is updated
     * @param {() => void} callback 
     * @returns {number|null} ID of the listener if it was added, null otherwise
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
     * @param {number} id ID of the listener to remove
     * @returns {boolean} True if the function was found and removed
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