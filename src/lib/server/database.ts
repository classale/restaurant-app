import Database from "better-sqlite3"

const db = new Database("tastemap.db")

export function getRestaurants(): Array<any> {
    const stmt = db.prepare("SELECT * FROM restaurants")
    const restaurants = stmt.all();

    for(let restaurant of restaurants) {
        const tag_stmt = db.prepare("SELECT * FROM restaurant_tags WHERE restaurant_id = ?")
        const tags = tag_stmt.all(restaurant.id);
        restaurant.tags = tags;
        
        for(let tag of restaurant.tags) {
            const tag_stmt = db.prepare("SELECT * FROM tags WHERE id = ?")
            tag.name = tag_stmt.get(tag.tag_id).name
            
        };

        const image_stmt = db.prepare("SELECT * FROM photos WHERE restaurant_id = ?")
        const images = image_stmt.all(restaurant.id);
        restaurant.images = images;

        const star_stmt = db.prepare("SELECT * FROM stars WHERE restaurant_id = ?")
        const stars = star_stmt.all(restaurant.id);
        restaurant.stars = stars;
    }
    return restaurants;
}

export function getTags(): Array<any> {
    const stmt = db.prepare("SELECT * FROM tags")
    return stmt.all();
}