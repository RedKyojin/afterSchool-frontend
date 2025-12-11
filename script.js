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
            showCart: false, // Boolean for checkout

            //Checkout:
            name: "",
            phoneNumber: "",
            orderMessage: "",
            nameTouched: false,
            phoneTouched: false
        };
    },
    computed: {
        cartItems() {
            const counts = this.cart.reduce((acc, id) => {
                acc[id] = (acc[id] || 0) + 1;
                return acc;
            }, {});

            return Object.entries(counts)
                .map(([id, count]) => {
                    const lesson = this.lessons.find(l => l.id === Number(id));
                    return lesson ? { ...lesson, count } : null;
                })
                .filter(Boolean);
        },
        nameValid() {
            const trimmed = this.name.trim();
            // Letters plus internal spaces or dashes
            return trimmed.length > 0 && /^[A-Za-z\s-]+$/.test(trimmed);
        },
        phoneValid() {
            const trimmed = this.phoneNumber.trim();
            // Digits only
            return trimmed.length > 0 && /^\d+$/.test(trimmed);
        },
        canCheckout() {
            // Checkout enabled strictly by valid name and phone per requirements
            return this.nameValid && this.phoneValid;
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
        },
        checkout() {
            if (!this.canCheckout) {
                this.orderMessage = "Please enter a valid name and phone number.";
                return;
            }

            this.orderMessage = "Order submitted";
            alert("Checkout Complete!");

            // Reset fields after successful checkout
            this.name = "";
            this.phoneNumber = "";
            this.nameTouched = false;
            this.phoneTouched = false;
        }
    }
});

app.mount("#app");
