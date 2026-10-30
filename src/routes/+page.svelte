<script module>
    import * as maplibregl from 'maplibre-gl';
    import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
    maplibregl.setWorkerUrl(maplibreWorkerUrl);
</script>

<script lang="ts">
    import "#lib/style.css"
    import { CircleLayer, MapLibre, Marker, type LngLatLike } from 'svelte-maplibre';
	import Restaurant from '#lib/components/restaurant.svelte';
    import * as geolib from "geolib";
    const {data} = $props();
    let search_type = $state("ranked");

    let position = $state([-0.094151,51.509093]);

    let tags = $state([]);

    let city = $state("");
    let isAsideOpen = $state(true);

    $effect(() => {
        if(tags.length > 0) all = false;
        else all = true;
        if(tags.length == 0 && all == false) all = true
    })

    let all = $state(true);

    let currentRestaurant = $state(null);

    let searched_restaurants = $derived(
        data.restaurants.filter(
            e => e.list_status! == search_type &&
            (tags.reduce(
                (a, v) => e.tags.map(
                    tag => Number(tag.tag_id)
                ).includes(v) || a, false
            ) || all)
        )
    );

    let searchLoc = $state([])

    let radius = $state(false);

    let search = $state("");

    let radius_restaurants = $state([]);

    async function submitSearch() {
        const api_data = await (await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${search}}`)).json();
        searchLoc[0] = api_data[0].lon;
        searchLoc[1] = api_data[0].lat;
        
        position = [...searchLoc];

        radius_restaurants.length = 0;

        for(let restaurant of data.restaurants) {

            const distance = geolib.getDistance(
                { latitude: searchLoc[1], longitude: searchLoc[0] },
                { latitude: restaurant.latitude, longitude: restaurant.longitude }
            );

            console.log(distance)


            if(distance < 1000) {
                console.log(restaurant)
                radius_restaurants.push({...restaurant, distance: distance})
            }

            console.log(radius_restaurants);


            radius = true;
        }
        radius_restaurants = radius_restaurants.sort((a, b) => a.distance - b.distance);
    }

    console.log(
        geolib.getDistance(
            { latitude: 51.5103, longitude: 7.49347 },
            { latitude: 51.525, longitude: 7.4575 }
        )
    )
</script>

<style>
    .circle, .square {
        background-color: green;
    }

    .circle {
        transform: translate(calc(25px * 1.414 + 15px - 50%), -50%);
        position: absolute;
        width: 50px;
        height: 50px;
        border-radius: 25px;
        z-index: 1;
        border: 5px solid white;
    }

    .square {
        position: absolute;
        height: 25px;
        width: 25px;
        z-index: 2;
        transform-origin: 0 0;
        transform: translateX(calc(25px * 1.414 + 15px)) rotate(135deg);
        border-bottom: 5px solid white;
        border-right: 5px solid white;
    }

    .number {
        transform: translate(calc(25px * 1.414 + 15px - 50%), -50%);
        position: absolute;
        z-index: 2;
        font-weight: bold;
        color: white;
        font-size: 1.5rem;
        font-weight: bold;
    }

    .search {
        position: absolute;
        left: 50%;
        top: 32px;
        transform: translateX(-50%);
    }

    aside {
        width: 420px;
        position: absolute;
        z-index: 3;
        left: 0;
        top: 0;
        height: 100%;
        background-color: white;
        padding: 20px 24px;
        gap: 8px;
        display: flex;
        flex-direction: column;
    }

    .hidden {
        display: none;
    }

    .top {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .top button {
        width: 25px;
        height: 25px;
        font-size: 2rem;
        background-color: transparent;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .icon {
        width: 6px;
        height: 6px;
        background-color: #3E6B48;
        border-radius: 3px;
    }

    .status {
        border-radius: 999999px;
        display: flex;
        flex-direction: row;
        gap: 8px;
        align-items: center;
        padding: 7px 12px;
        border: 1px solid #E4E5DE;
        background: #F2F3EE;
        width: fit-content;
        font-size: 12px;
    }

    h1 {
        font-size: 24px;
    }

    h2 {
        font-size: 32px;
    }

    .search-type {
        display: flex;
        flex-direction: row;
        gap: 16px;
    }

    .search-type input[type=radio] {
        display: none;
    }

    label:has(input[type=radio]) {
        padding-bottom: 10px;
        cursor: pointer;
        color: #9A9D95;
    }
    
    label:has(input[type=radio]:checked) {
        border-bottom: 3px solid black;
        color: #1C1F1A;
    }

    .tags {
        display: flex;
        flex-direction: row;
        gap: 6px;
        overflow-x: scroll;
        white-space: nowrap;
    }

    .tags input {
        display: none;
    }

    .tags label {
        padding: 4px 12px;
        background-color: #F2F3EE;
        border: 1px solid #E4E5DE;
        border-radius: 998999px;
        cursor: pointer;
        height: fit-content;
        overflow-wrap: nowrap;
        user-select: none;
    }

    .tags label:has(input[type=checkbox]:checked) {
        background-color: #3E6B48;
        border: 1px solid #3E6B48;
        color: white;
    }

    .restaurants {
        display: flex;
        flex-direction: column;
        gap: 8px;
        overflow-y: auto;
    }

    .back {
        color: #1C1F1A;
        font-size: 14px;
        cursor: pointer;
        padding-bottom: 22px;
        border-bottom: 1px solid #E4E5DE;
    }

    .images {
        display: grid;
        grid-template: auto auto / 1fr 1fr;
        gap: 5px;
        height: min-content;
    }

    .images > img:first-child {
        grid-column: span 2;
    }
    
    .images > img {
        max-width: 100%;
    }

    .tag {
        padding: 2px 8px;
        background-color: #F2F3EE;
        border: 1px solid #E4E5DE;
        border-radius: 998999px;
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
    }


    .restaurant-info .price span.bold {
        color: #1C1F1A;
    }

    .restaurant-info .price span {
        color: #C9CBC3;
        font-weight: 600;
    }

    .star {
        color: #B9862E;
    }

    .restaurant-info {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }

    .reviews {
        display: flex;
        margin-left: auto;
        font-size: 14px;
    }

    .count {
        margin-left: 4px;
        color: #9A9D95;
        font-size: 12px;
    }

    .price {
        font-size: 14px;
    }

    .description {
        color: #5E625B;
        font-size: 14px;
        padding-bottom: 16px;
        border-bottom: 1px solid #E4E5DE;
    }

    .localisation-icon {
        width: 16px;
        height: 16px;
    }

    .address {
        display: flex;
    }

    .address {
        text-decoration: none;
        font-size: 13px;
        color: #1C1F1A;
        font-weight: 500;
    }

    .info {
        width: 440px;
        gap: 24px;
    }

    .book {
        margin-top: auto;
        display: flex;
        align-items: center;
    }

    .book button {
        width: 100%;
        padding: 11px;
        background-color: #3E6B48;
        box-shadow: 0px 1px 2px 0px #0000000D;
        border: none;
        color: white;
        border-radius: 99999px;
        font-weight: bold;
        font-size: 14px;
        cursor: pointer;
    }

    .marker-arrow {
        cursor: pointer;
    }

    .search {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        z-index: 4;
        border-radius: 9999999px;
        border: 1px solid #E4E5DE;
        overflow: hidden;
        background-color: #FFFFFFF2;
        border: 1px solid #E4E5DE;
        padding: 0 16px;
    }
    
    .search input {
        top: 16px;
        font-size: 15px;
        color: #1C1F1A;
        outline: none;
        border: none;
        padding: 10px 16px;
    }

    .search button {
        background-color: transparent;
        border: none;
    }

    aside:not(.hidden) + .search {
        transform: translateX(105px);
    }

    aside:not(.hidden).info + .search {
        transform: translateX(110px);
    }

    form > button {
        cursor: pointer;
    }
</style>

<aside class:hidden={!isAsideOpen} class:info={currentRestaurant != null}>
    {#if currentRestaurant == null}
    <div class="top">
        <!-- hi -->
        <h1>Tastemap.</h1>
        <button onclick={() => isAsideOpen = false}>×</button>
    </div>
    <div class="status">
        <div class="icon"></div>
        <p>London &middot; 1km radius &middot; {data.restaurants.length} places</p>
    </div>
    <h2>Your top tables</h2>
    <p>Ranked head-to-head, so your #3 really is better than your #4 — no five-star mush.</p>
    <form class="search-type">
        <label>
            Ranked <span style="color: #9A9D95">{data.restaurants.filter(e => e.list_status == "ranked").length}</span>
            <input type="radio" name="search_type" value="ranked" onclick={() => radius = false} checked bind:group={search_type}>
        </label>
        <label>
            Want to try <span style="color: #9A9D95">{data.restaurants.filter(e => e.list_status == "want_to_try").length}</span>
            <input type="radio" name="search_type" value="want_to_try" onclick={() => radius = false} bind:group={search_type}>
        </label>
    </form>
    <div class="tags">       
            <label>
                All
                <input type="checkbox" name="tags" bind:checked={all} onclick={() => {
                    if(all==false) tags = []
                }}>
            </label>     
        {#each data.tags as tag, i}
            <label>
                {tag.name}
                <input type="checkbox" name="tags" value={tag.id} bind:group={tags}>
            </label>
        {/each}
    </div>
    <div class="restaurants">
        {#each !radius ? searched_restaurants : radius_restaurants as restaurant,i}
        <Restaurant clickEvent={() => {
            position = [restaurant.longitude, restaurant.latitude];
            currentRestaurant = restaurant;
        }} number={i+1} description="{restaurant.tagline} &middot; {restaurant.neighborhood}" image="{restaurant.images[0].url}" name={restaurant.name} price={restaurant.price_tier}/>
        {/each}
    </div>
    {:else}
        <a class="back" onclick={() => currentRestaurant = null}>🡐 Back to all places</a>
        <div class="images">
            {#each currentRestaurant.images as image}
                <img src= {image.url}>
            {/each}
        </div>
        <h2>{currentRestaurant.name}</h2>
        <div class="restaurant-info">
            <div class="tags">
                {#each currentRestaurant.tags as tag}
                    <span class="tag">
                        {tag.name}
                    </span>
                {/each}
            </div>
            <span>&middot</span>
            <span class="price">
            {#each {length: 4}, i}
                <span class:bold={i < currentRestaurant.price_tier}>€</span>
            {/each}
            </span>
            <div class="reviews">
                <span class="star">★</span>
                <b>{currentRestaurant.rating_avg}/5</b>
                <div class="count">
                    ({currentRestaurant.stars.length} review)
                </div>
            </div>
        </div>
        <div class="description">
            {currentRestaurant.description}
        </div>
        <a href="https://www.google.com/maps/dir/?api=1&destination={currentRestaurant.latitude},{currentRestaurant.longitude}" class="address">
            <span>
                <img src="/media/icons/localisation.svg" class="localisation-icon" alt="Location Icon">
            </span>
            <span>
                {currentRestaurant.street_address}, {currentRestaurant.city} {currentRestaurant.postcode} &middot; {currentRestaurant.neighborhood}<br/>
                Get Directions ↗
            </span>
        </a>
        <div class="book">
            <button>Book a table</button>
        </div>
    {/if}
</aside>

<form onsubmit={submitSearch} class="search">
    <button>🔍︎</button>
    <input type="text" id="" bind:value={search}>
</form>

<MapLibre
    center={position}
    zoom={11}
    class="map"
    style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
>

    {#each !radius ? searched_restaurants : radius_restaurants as restaurant,i}
        <Marker lngLat={[restaurant.longitude, restaurant.latitude]}>
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="marker-arrow" onclick={() => {
                    position = [restaurant.longitude, restaurant.latitude];
                    isAsideOpen = true;
                    currentRestaurant = restaurant;
                }}>
                <span class="circle"></span>
                <span class="square"></span>
                <span class="number">{i+1}</span>
            </div>
        </Marker>
    {/each}
</MapLibre>