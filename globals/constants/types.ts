// This file is to define types needed by multiple different files

export type Interval = {
    workoutID: number;
    idx: number;
    speed: number; // miles per hour
    distance: number; // distance in meters
}

export type WorkoutDetails = {
    id: number;
    name: string;
    description: string;
    totalDistance: number; // distance in meters
    totalTime: number; // duration in seconds
    numIntervals: number;
    savedToProfile: boolean;
}

export type Workout = {
    workoutDetails: WorkoutDetails;
    intervals: Interval[];
}