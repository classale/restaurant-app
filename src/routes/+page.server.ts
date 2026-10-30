import { getRestaurants, getTags } from "#lib/server/database.js";

export function load(): {
    restaurants: Array<any>
    tags: Array<any>
} {
    return {
        restaurants: getRestaurants(),
        tags: getTags()
    }
}