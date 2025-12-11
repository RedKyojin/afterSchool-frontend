const app = Vue.createApp({
    data() {
        return {
            // Creating the lessons
            lessons: [
                {
                    id: 1,
                    subject: "Maths",
                    location: "M5",
                    price: 20,
                    spaces: 9,
                    icon: "✖️"
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
                // I realise I need at least 10; going to add more later.
            ],
            cart: [], // Array to hold the ids
            showCart: false // Boolean for checkout
        };
    },
    computed: {
        cartItems() {
            return this.lessons.filter(lesson =>
                this.cart.includes(lesson.id)
            );
        }
    },
    methods: {
        addToCart(lesson) {
            if (lesson.spaces > 0) {
                this.cart.push(lesson.id);
                lesson.spaces--;
            }
        },
        removeFromCart(lessonId) {
            const index = this.cart.indexOf(lessonId);
            if (index !== -1) {
                // Removes from cart
                this.cart.splice(index, 1);
                // Search the lessons array, and return the first lesson where its id equals lessonId
                const lesson = this.lessons.find(l => l.id === lessonId);
                if (lesson) {
                    lesson.spaces++;
                }
            }
        },
        toggleView() {
            this.showCart = !this.showCart;
        }
    }
});

app.mount("#app");
