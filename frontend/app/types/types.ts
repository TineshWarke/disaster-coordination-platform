export type Disaster = {
    id: string;
    title: string;
    location_name: string;
    description: string;
    tags: string[];
    coordinates?: {
        lat: number;
        lon: number;
    };
};
