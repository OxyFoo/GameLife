import { IUserClass } from '@oxyfoo/gamelife-types/Interface/IUserClass';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('@oxyfoo/gamelife-types/Class/Statistics').SaveObject_Statistics} SaveObject_Statistics
 */

/** @extends {IUserClass<SaveObject_Statistics>} */
class Statistics extends IUserClass {
    /** @param {UserManager} user */
    constructor(user) {
        super('statistics');
        this.user = user;

        /** @type {SaveObject_Statistics} */
        this.data = {
            pages: [],
            links: [],
            loadingTimeMs: 0,
            sessionsCount: 0,
            lastSessionStart: 0
        };

        this.isLoaded = false;
        this.currentSessionStats = {
            pages: new Map(),
            links: new Map()
        };
    }

    /**
     * Mandatory methods from IUserClass
     */
    Clear = () => {
        this.data = {
            pages: [],
            links: [],
            loadingTimeMs: 0,
            sessionsCount: 0,
            lastSessionStart: 0
        };
        this.currentSessionStats.pages.clear();
        this.currentSessionStats.links.clear();
        this.isLoaded = false;
    };

    /** @param {Partial<SaveObject_Statistics>} data */
    Load = (data) => {
        if (data) {
            this.data = { ...this.data, ...data };
        }
        this.isLoaded = true;
    };

    /** @returns {SaveObject_Statistics} */
    Save = () => {
        return this.data;
    };

    /**
     * Initialize the class and start a new session
     */
    Initialize() {
        this.StartSession();
        this.isLoaded = true;
    }

    /**
     * Simplified method to handle app loading completion
     * @param {number} loadingTimeMs - Loading time in ms
     */
    HandleAppLoaded(loadingTimeMs) {
        this.data.loadingTimeMs = loadingTimeMs;
        this.SendLoadingStatistics(loadingTimeMs);
        this.SendAllSessionStatistics();
    }

    /**
     * Start a new session
     */
    StartSession() {
        this.data.sessionsCount++;
        this.data.lastSessionStart = Date.now();
        this.currentSessionStats.pages.clear();
        this.currentSessionStats.links.clear();
    }

    /**
     * Record a page visit
     * @param {string} pageName - Name of the visited page
     */
    RecordPageVisit(pageName) {
        if (!this.isLoaded || !pageName) return;

        // Update local session statistics
        const currentCount = this.currentSessionStats.pages.get(pageName) || 0;
        this.currentSessionStats.pages.set(pageName, currentCount + 1);

        // Update global statistics
        const existingPage = this.data.pages.find((p) => p.pageName === pageName);
        if (existingPage) {
            existingPage.visitCount++;
            existingPage.lastVisit = Date.now();
        } else {
            this.data.pages.push({
                pageName,
                visitCount: 1,
                lastVisit: Date.now()
            });
        }
    }

    /**
     * Record a link click
     * @param {string} linkName - Name of the clicked link
     */
    RecordLinkClick(linkName) {
        if (!this.isLoaded || !linkName) return;

        // Update local session statistics
        const currentCount = this.currentSessionStats.links.get(linkName) || 0;
        this.currentSessionStats.links.set(linkName, currentCount + 1);

        // Update global statistics
        const existingLink = this.data.links.find((l) => l.linkName === linkName);
        if (existingLink) {
            existingLink.clickCount++;
            existingLink.lastClick = Date.now();
        } else {
            this.data.links.push({
                linkName,
                clickCount: 1,
                lastClick: Date.now()
            });
        }

        // Immediate send for link clicks (rare action)
        this.SendLinkStatistics(linkName);
    }

    /**
     * Send loading statistics to server
     * @param {number} loadingTimeMs - Loading time
     */
    SendLoadingStatistics(loadingTimeMs) {
        if (!this.user?.server2?.tcp) return;

        this.user.server2.tcp.Send({
            action: 'send-statistics',
            stats: { LoadingTimeMs: loadingTimeMs },
            anonymous: false
        });
    }

    /**
     * Send page statistics to server
     */
    SendPageStatistics() {
        if (!this.user?.server2?.tcp || this.currentSessionStats.pages.size === 0) return;

        const sessionPages = Array.from(this.currentSessionStats.pages.entries()).map(([name, count]) => ({
            name,
            count
        }));

        this.user.server2.tcp.Send({
            action: 'send-statistics',
            stats: { PagesVisit: sessionPages },
            anonymous: true
        });
    }

    /**
     * Send link statistics to server
     * @param {string} linkName - Name of the clicked link
     */
    SendLinkStatistics(linkName) {
        if (!this.user?.server2?.tcp || !linkName) return;

        this.user.server2.tcp.Send({
            action: 'send-statistics',
            stats: { LinkClick: linkName },
            anonymous: true
        });
    }

    /**
     * Send all session statistics to server
     */
    SendAllSessionStatistics() {
        this.SendPageStatistics();
    }

    /**
     * Clean old statistics data
     * @param {number} maxDays - Number of days to keep (default: 30)
     */
    CleanOldData(maxDays = 30) {
        const cutoffTime = Date.now() - maxDays * 24 * 60 * 60 * 1000;

        this.data.pages = this.data.pages.filter((p) => p.lastVisit > cutoffTime);
        this.data.links = this.data.links.filter((l) => l.lastClick > cutoffTime);
    }

    /**
     * Get statistics summary for debugging
     * @returns {Object} Statistics summary
     */
    GetSummary() {
        return {
            totalPages: this.data.pages.length,
            totalLinks: this.data.links.length,
            sessionsCount: this.data.sessionsCount,
            lastLoadingTime: this.data.loadingTimeMs,
            currentSessionPages: this.currentSessionStats.pages.size,
            currentSessionLinks: this.currentSessionStats.links.size
        };
    }
}

export default Statistics;
