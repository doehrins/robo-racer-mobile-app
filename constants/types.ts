// This file is to define types needed by multiple different files

export interface Interval {
    index: number;
    time: number; // duration in seconds
    distance: number; // distance in meters
}

export interface Workout {
    name: string;
    description: string;
    totalDist: number; // distance in meters
    totalTime: number; // duration in seconds
    numIntervals: number;
    intervals: Interval[];
}