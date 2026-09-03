import BackFlowEngine from '../back';

/**
 * `history`, `_public` and `ClearHistory` are class fields initialised in the
 * constructor and never touch React state, so the instance is enough here.
 */
const createFlowEngine = () => new BackFlowEngine({});

describe('[FlowEngine] history', () => {
    it('should expose the very same history array through the public interface', () => {
        const fe = createFlowEngine();

        expect(fe._public.history).toBe(fe.history);
    });

    // Regression: ClearHistory reassigned `this.history` to a fresh array while
    // `_public.history` still referenced the old one, so anything reading
    // `user.interface.history` kept seeing the pages that had just been cleared.
    it('should empty the array consumers already hold when ClearHistory is called', () => {
        const fe = createFlowEngine();
        const consumerReference = fe._public.history;

        fe.history.push({ pageName: 'home', args: {} });
        expect(consumerReference).toHaveLength(1);

        fe.ClearHistory();

        expect(consumerReference).toHaveLength(0);
        expect(fe._public.history).toBe(fe.history);
    });

    it('should keep the public reference valid across several clears', () => {
        const fe = createFlowEngine();
        const consumerReference = fe._public.history;

        for (let i = 0; i < 3; i++) {
            fe.history.push({ pageName: 'home', args: {} });
            fe.ClearHistory();

            expect(consumerReference).toHaveLength(0);
            expect(consumerReference).toBe(fe.history);
        }
    });

    it('should resolve a registered page name and reject an unknown one', () => {
        const fe = createFlowEngine();

        expect(fe.GetPageName('home')).toBe('home');
        expect(fe.GetPageName('settings')).toBe('settings');
        expect(fe.GetPageName('not-a-page')).toBeNull();
    });
});
