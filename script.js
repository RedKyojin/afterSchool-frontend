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
            fullName: "",
            phoneNumber: "",
            orderMessage: "",
            fullNameTouched: false,
            phoneTouched: false,
            orderSubmitted: false
        };
    },
    computed: {
        cartItems() {
            const cart = Array.isArray(this.cart) ? this.cart : [];
            const counts = cart.reduce((acc, id) => {
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
        fullNameValid() {
            const trimmed = this.fullName.trim();
            // Letters plus internal spaces or dashes
            return trimmed.length > 0 && /^[A-Za-z\s-]+$/.test(trimmed);
        },
        phoneValid() {
            const trimmed = this.phoneNumber.trim();
            // Exactly 11 digits
            return trimmed.length === 11 && /^\d+$/.test(trimmed);
        },
        canCheckout() {
            // Checkout enabled strictly by valid name and phone per requirements
            return this.fullNameValid && this.phoneValid;
        }
    },
    methods: {
        resetCheckoutState() {
            this.orderMessage = "";
            this.orderSubmitted = false;
        },
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
        goToCart() {
            this.showCart = true;
            // Clear any prior submission state when re-entering checkout
            this.resetCheckoutState();
        },
        goBack() {
            this.showCart = false;
            this.resetCheckoutState();
        },
        toggleView() {
            // Fallback toggle that also clears submission state
            this.showCart = !this.showCart;
            this.resetCheckoutState();
        },
        checkout() {
            if (!this.canCheckout) {
                this.orderMessage = "Please enter a valid name and 11-digit phone number.";
                return;
            }

            this.orderMessage = "Order submitted";
            this.orderSubmitted = true;
            alert("Checkout Complete!");

            // Reset fields after successful checkout
            this.fullName = "";
            this.phoneNumber = "";
            this.fullNameTouched = false;
            this.phoneTouched = false;
        }
    }
});

app.mount("#app");
