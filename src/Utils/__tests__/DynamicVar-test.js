import DynamicVar from '../DynamicVar';

describe('[Utils] DynamicVar', () => {
    it('should expose its initial value', () => {
        const variable = new DynamicVar(42);
        expect(variable.Get()).toBe(42);
    });

    it('should update the value and notify the listeners', () => {
        const variable = new DynamicVar(0);
        const listener = jest.fn();
        variable.AddListener(listener);

        variable.Set(10);

        expect(variable.Get()).toBe(10);
        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith(10, 0);
    });

    it('should not notify when a primitive value is unchanged', () => {
        const variable = new DynamicVar('same');
        const listener = jest.fn();
        variable.AddListener(listener);

        variable.Set('same');

        expect(listener).not.toHaveBeenCalled();
    });

    it('should always notify for object values, since mutations are not detectable', () => {
        const value = { count: 0 };
        const variable = new DynamicVar(value);
        const listener = jest.fn();
        variable.AddListener(listener);

        variable.Set(value);

        expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should re-notify with the unchanged value when Set is called without argument', () => {
        const variable = new DynamicVar(7);
        const listener = jest.fn();
        variable.AddListener(listener);

        variable.Set();

        expect(variable.Get()).toBe(7);
        expect(listener).toHaveBeenCalledWith(7, 7);
    });

    it('should notify every registered listener', () => {
        const variable = new DynamicVar(0);
        const first = jest.fn();
        const second = jest.fn();
        variable.AddListener(first);
        variable.AddListener(second);

        variable.Set(1);

        expect(first).toHaveBeenCalledTimes(1);
        expect(second).toHaveBeenCalledTimes(1);
    });

    it('should reject a non-function listener', () => {
        const variable = new DynamicVar(0);
        // @ts-ignore Deliberately invalid input
        expect(variable.AddListener('not a function')).toBeNull();
    });

    it('should stop notifying a removed listener', () => {
        const variable = new DynamicVar(0);
        const listener = jest.fn();
        const id = variable.AddListener(listener);

        expect(variable.RemoveListener(id)).toBe(true);
        variable.Set(1);

        expect(listener).not.toHaveBeenCalled();
    });

    it('should report an unknown or null listener id as not removed', () => {
        const variable = new DynamicVar(0);
        const id = variable.AddListener(jest.fn());

        expect(variable.RemoveListener(null)).toBe(false);
        expect(variable.RemoveListener(id)).toBe(true);
        expect(variable.RemoveListener(id)).toBe(false);
    });

    it('should keep listeners independent between two instances', () => {
        const first = new DynamicVar(0);
        const second = new DynamicVar(0);
        const listener = jest.fn();
        first.AddListener(listener);

        second.Set(1);

        expect(listener).not.toHaveBeenCalled();
    });
});
