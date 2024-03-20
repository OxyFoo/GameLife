/**
 * @template T
 */
class DynamicVar {
    /**
     * @param {T} initialValue Initial value of the variable
     */
    constructor(initialValue) {
        this.var = initialValue;
    }

    /** @type {T} */
    var;

    /**
     * @private
     * @type {Map<Symbol, (newValue: T, oldValue: T) => void>}
     */
    listeners = new Map();

    /**
     * @returns {T} Current value of the variable
     */
    Get() {
        return this.var;
    }

    /**
     * @param {T} [value] New value to set. If left undefined, it updates without changing the value
     */
    Set(value) {
        if (typeof(value) === 'undefined') {
            this._updateListeners(this.var, this.var);
            return;
        }

        if (this.var !== value || typeof(this.var) === 'object') {
            const oldValue = this.var;
            this.var = value;
            this._updateListeners(value, oldValue);
        }
    }

    /**
     * @private
     * @param {T} newValue
     * @param {T} oldValue
     */
    _updateListeners(newValue, oldValue) {
        this.listeners.forEach((callback) => {
            callback(newValue, oldValue);
        });
    }

    /**
     * Add function to be called when the variable is updated
     * @param {(newValue: T, oldValue: T) => void} callback Function to be called
     * @returns {Symbol | null} ID of the listener or null if the callback is not a function
     */
    AddListener(callback) {
        if (typeof(callback) !== 'function') {
            return null;
        }

        const id = Symbol();
        this.listeners.set(id, callback);
        return id;
    }

    /**
     * Remove function to be called when the variable is updated
     * @param {Symbol | null} id ID of the listener to remove
     * @returns {boolean} True if the function was found and removed
     */
    RemoveListener(id) {
        if (id === null) {
            return false;
        }

        if (this.listeners.has(id)) {
            this.listeners.delete(id);
            return true;
        }
        return false;
    }
}

export default DynamicVar;
