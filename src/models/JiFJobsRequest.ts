import { boolean, enumType, number, object, string } from 'valibot';

export const JiFJobsRequest = object({
    offset: number(),
    limit: number(),
    sort: enumType(['title', 'employer.name', 'schedule.publish', 'location.city', 'location.area']),
    category: string(),
    city: string(),
    query: string(),
    meta: boolean(),
});