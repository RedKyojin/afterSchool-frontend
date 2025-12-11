const app = Vue.createApp({
    data() {
        return {
            //Creating the lessons
            lessons: [
                {
                    id: 1,
                    subject: "Maths",
                    location: "M5",
                    price: 20,
                    spaces: 9,
                    icon: "➕"
                },
                {
                    id: 2,
                    subject: "Science",
                    location: "S2",
                    price: 20,
                    spaces: 12,
                    icon: "🧑‍🔬"
                },
                {
                    id: 3,
                    subject: "Chess",
                    location: "R6",
                    price: 25,
                    spaces: 13,
                    icon: "♟️"
                }
                //I realise I need at least 10; going to add more later.
            ],
            cart: [], //Array to hold the ids
        };
    },
    methods: {
        addToCart(lesson) {
            if(lesson.spaces > 0) {
                this.cart.push(lesson.id);
                lesson.spaces--;
            };
        }
    }
});

app.mount("#app");