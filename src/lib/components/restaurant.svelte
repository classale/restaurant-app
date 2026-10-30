<script lang="ts">
    const {name, description, image, price, number, clickEvent} : {
        name: string,
        description: string,
        image: string,
        price : 1 | 2 | 3 | 4,
        number: number,
        clickEvent: Function,
    } = $props();

    console.log(image)
</script>

<style>
    .restaurant {
        padding: 12px;
        border-radius: 99999px;
    }

    .restaurant.top_pick {
        background: #FBF1E1;
        border: 1px solid #EDD3A3
    }

    .number {
        font-size: 24px;
        display: flex;
        align-items: center;
    }

    .right {
        margin-left: auto;
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: space-evenly;
    }

    img {
        width: 44px;
        height: 44px;
    }

    .right span {
        color: #C9CBC3;
        font-weight: bold;
        font-size: 14px;
    }

    .right span.bold {
        color: #1C1F1A;
    }

    .restaurant {
        display: flex;
        flex-direction: row;
        gap: 8px;
        width: 100%;
    }

    .info {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: flex-start;
    }

    .name {
        font-weight: bold;
        font-size: 15px;
        color: #1C1F1A;
    }

    .description {
        font-size: 12px;
        color: #5E625B;
    }

    span.top_pick {
        text-transform: uppercase;
        font-size: 10px;
        color: #B9862E;
    }
    .price {
        margin-left: auto;
    }

    button {
        border: none;
        background-color: transparent;
        cursor: pointer;
    }

    img {
        object-fit: cover;
        border-radius: 6px;
    }
</style>

<button class="restaurant" class:top_pick={number == 1} onclick={clickEvent} >
    <div class="number">{number}</div>
    
    <img src={image} alt="Image du Restaurant {name}">
    <div class="info">
        <span class="name">{name}</span>
        <span class="description">{description}</span>
    </div>
    <div class="right">
        <span class="price">
            {#each {length: 4}, i}
                <span class:bold={i < price}>€</span>
            {/each}
        </span>
        {#if number==1}
            <span class="top_pick">top pick</span>
        {/if}
    </div>
</button>