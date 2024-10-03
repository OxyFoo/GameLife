/**
 * @template DataType
 */
class DataClassTemplate {
    Clear() {}

    /** @param {DataType} _data */
    Load(_data) {}

    /** @returns {DataType} */
    Save() {
        return Object.create(null);
    }
}

export default DataClassTemplate;
