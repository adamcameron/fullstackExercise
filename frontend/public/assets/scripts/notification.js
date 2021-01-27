let notificationMessageComponent = {
    template : "#notification-message-template",
    data : function() {
        return {
            visible:true
        };
    },
    props : {
        type: {
            type: String,
            required: false,
            default: "info",
            validator: (prop) => ["SUCCESS","INFO","WARNING","ERROR"].includes(prop.toUpperCase())
        },
        header: {
            type: String,
            required: false,
            default: "Info"
        }
    },
    methods : {
        hideNotification: function() {
            this.visible = false;
        }
    }
};
new Vue({
    el: '#app',
    components: {
        "notification-message" : notificationMessageComponent
    }
});
