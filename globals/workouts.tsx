import { Workout } from '@/globals/constants/types'

const workouts: Workout[] = [
    {
        id: 1,
        name: "400m Repeats",
        description: "Good workout",
        totalDist: 1600,
        totalTime: 360,
        numIntervals: 4,
        intervals: [
            { index: 1, distance: 400, time: 120 },
            { index: 2, distance: 400, time: 60 },
            { index: 3, distance: 400, time: 120 },
            { index: 4, distance: 400, time: 60 }
        ]
    },
    {
        id: 2,
        name: "800m Repeats",
        description: "Great workout",
        totalDist: 3600,
        totalTime: 750,
        numIntervals: 6,
        intervals: [
            { index: 1, distance: 800, time: 150 },
            { index: 2, distance: 400, time: 100 },
            { index: 3, distance: 800, time: 150 },
            { index: 4, distance: 400, time: 100 },
            { index: 5, distance: 800, time: 150 },
            { index: 6, distance: 400, time: 100 }
        ]
    },
    {
        id: 3,
        name: "Mile Run",
        description: "Super fast!",
        totalDist: 1600,
        totalTime: 360,
        numIntervals: 1,
        intervals: [
        { index: 1, distance: 1600, time: 360 }
        ]
    },
    {
        id: 4,
        name: "100m Sprint",
        description: "Quick acceleration",
        totalDist: 100,
        totalTime: 10,
        numIntervals: 8,
        intervals: [
            { index: 1, distance: 1, time: 0.1 },
            { index: 2, distance: 4, time: 0.3},
            { index: 3, distance: 5, time: 0.3 },
            { index: 4, distance: 10, time: 1.3 },
            { index: 5, distance: 10, time: 1 },
            { index: 6, distance: 20, time: 2.5 },
            { index: 7, distance: 25, time: 2.5 },
            { index: 8, distance: 25, time: 2 }
        ]
    }
]

export default workouts;