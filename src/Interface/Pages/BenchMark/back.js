import PageBase from 'Interface/FlowEngine/PageBase';

import user from 'Managers/UserManager';
import Bench from './benchmark';
import { Sleep } from 'Utils/Functions';

/**
 * @typedef {import('./benchmark').BenchResult} BenchResult
 */

const TOTAL_ACTIVITIES = 10000;

class BackBenchMark extends PageBase {
    state = {
        benchmarking: false,

        activitiesCount: 0,
        activitiesLoaded: [],

        /** @type {BenchResult[]} */
        benchmarkResults: [],
        benchmarkTimes: []
    }

    componentDidMount() {
        super.componentDidMount();

        const activities = user.activities.Get();
        const activitiesCount = activities.length;

        if (activitiesCount <= 0) {
            this.handleBackPress();
            return;
        }

        const activitiesExtended = [];
        while (activitiesExtended.length < TOTAL_ACTIVITIES) {
            activitiesExtended.push(...activities);
        }
        activitiesExtended.length = TOTAL_ACTIVITIES;

        this.setState({
            activitiesCount: activitiesCount,
            activitiesLoaded: activitiesExtended
        });
    }

    startBenchMark = async () => {
        this.setState({ benchmarking: true });
        await Sleep(1000);

        const timeTotal = performance.now();
        let timeCurrent = performance.now();
        const barData = [];

        // 10 activities
        Bench(this.state.activitiesLoaded.slice(0, 10))
        .then(benchmarkResults => {
            const deltaTime = performance.now() - timeCurrent;
            timeCurrent = performance.now();
            barData.push({ value: deltaTime, label: '10' });
        })

        // 100 activities
        .then(() => Bench(this.state.activitiesLoaded.slice(0, 100)))
        .then(benchmarkResults => {
            const deltaTime = performance.now() - timeCurrent;
            timeCurrent = performance.now();
            barData.push({ value: deltaTime, label: '100' });
        })

        // 1000 activities
        .then(() => Bench(this.state.activitiesLoaded.slice(0, 1000)))
        .then(benchmarkResults => {
            const deltaTime = performance.now() - timeCurrent;
            timeCurrent = performance.now();
            barData.push({ value: deltaTime, label: '1000' });
        })

        // 5000 activities
        .then(() => Bench(this.state.activitiesLoaded.slice(0, 5000)))
        .then(benchmarkResults => {
            const deltaTime = performance.now() - timeCurrent;
            timeCurrent = performance.now();
            barData.push({ value: deltaTime, label: '5000' });
        })

        // 10000 activities
        .then(() => Bench(this.state.activitiesLoaded))
        .then(async benchmarkResults => {
            const deltaTime = performance.now() - timeCurrent;
            const deltaTotal = performance.now() - timeTotal;

            barData.push({ value: deltaTime, label: '10000' });

            await Sleep(1000);

            this.setState({
                benchmarking: false,
                benchmarkResults: [
                    { name: 'Total time', value: '', time: deltaTotal },
                    ...benchmarkResults
                ],
                benchmarkTimes: barData
            });
        });
    }

    handleBackPress = () => {
        user.interface.BackHandle();
    }
}

export default BackBenchMark;
