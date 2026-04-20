const API_BASE = "https://afterschool-server.onrender.com" //There was a dash so it didn't connect
const app = Vue.createApp({
  data() {
    return {
      // Lessons now come from backend
      lessons: [],

      cart: [],
      showCart: false,

      // Checkout:
      fullName: "",
      phoneNumber: "",
      orderMessage: "",
      fullNameTouched: false,
      phoneTouched: false,
      orderSubmitted: false,

      // Sorting:
      sortBy: "subject",
      sortOrder: "asc",

      // Search:
      searchQuery: ""
    };
  },

  async mounted() {
    await this.fetchLessons();
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
      return trimmed.length > 0 && /^[A-Za-z\s-]+$/.test(trimmed);
    },

    phoneValid() {
      const trimmed = this.phoneNumber.trim();
      return trimmed.length === 11 && /^\d+$/.test(trimmed);
    },

    canCheckout() {
      return this.fullNameValid && this.phoneValid;
    },

    sortedLessons() {
      const field = this.sortBy;
      const order = this.sortOrder;

      // Creates new array before sorting
      return [...this.lessons].sort((a, b) => {
        let x = a[field];
        let y = b[field];

        if (typeof x === "string") x = x.toLowerCase();
        if (typeof y === "string") y = y.toLowerCase();

        if (x < y) return order === "asc" ? -1 : 1;
        if (x > y) return order === "asc" ? 1 : -1;
        return 0;
      });
    },

    filterLessons() {
      const x = this.searchQuery.trim().toLowerCase();
      if (!x) return this.sortedLessons;

      return this.sortedLessons.filter(lesson => {
        const subject = String(lesson.subject).toLowerCase();
        const location = String(lesson.location).toLowerCase();
        const price = String(lesson.price).toLowerCase();
        const spaces = String(lesson.spaces).toLowerCase();

        return (
          subject.includes(x) ||
          location.includes(x) ||
          price.includes(x) ||
          spaces.includes(x)
        );
      });
    }
  },

  methods: {
    resetCheckoutState() {
      this.orderMessage = "";
      this.orderSubmitted = false;
    },

    async fetchLessons() {
      try {
        const res = await fetch(`${API_BASE}/lessons`);
        if (!res.ok) throw new Error(`GET /lessons failed: ${res.status}`);
        const data = await res.json();
        this.lessons = Array.isArray(data) ? data : [];
      } catch (err) {
        console.error(err);
        this.orderMessage = "Failed to load lessons from server.";
      }
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
        this.cart.splice(index, 1);
        const lesson = this.lessons.find(l => l.id === lessonId);
        if (lesson) lesson.spaces++;
      }
    },

    goToCart() {
      this.showCart = true;
      this.resetCheckoutState();
    },

    goBack() {
      this.showCart = false;
      this.resetCheckoutState();
    },

    async checkout() {
      if (!this.canCheckout) {
        this.orderMessage = "Please enter a valid name and 11-digit phone number.";
        return;
      }

      try {
        // POST: save order
        const postRes = await fetch(`${API_BASE}/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: this.fullName.trim(),
            phone: this.phoneNumber.trim(),
            lessonIDs: [...this.cart]
          })
        });

        if (!postRes.ok) {
          const msg = await postRes.text();
          throw new Error(`POST /orders failed: ${postRes.status} ${msg}`);
        }

        // PUT: update available spaces (update to any number, not +/-1)
        const uniqueLessonIds = [...new Set(this.cart)];
        await Promise.all(
          uniqueLessonIds.map(async (id) => {
            const lesson = this.lessons.find(l => l.id === id);
            if (!lesson) return;

            const putRes = await fetch(`${API_BASE}/lessons/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ spaces: lesson.spaces })
            });

            if (!putRes.ok) {
              const msg = await putRes.text();
              throw new Error(`PUT /lessons/${id} failed: ${putRes.status} ${msg}`);
            }
          })
        );

        // UI success
        this.orderMessage = "Order submitted";
        this.orderSubmitted = true;
        alert("Checkout Complete!");

        // Reset UI + cart
        this.cart = [];
        this.fullName = "";
        this.phoneNumber = "";
        this.fullNameTouched = false;
        this.phoneTouched = false;

        // Refresh lessons from DB so UI matches server truth
        await this.fetchLessons();
      } catch (err) {
        console.error(err);
        this.orderMessage = "Checkout failed (server error).";
      }
    }
  }
});

app.mount("#app");

