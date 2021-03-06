var app = app || {};
var ENTER_KEY = 13;

app.TodoView = Backbone.View.extend({
  tagName: "li",
  template: _.template($("#item-template").html()),
  events: {
    "click .toggle": "togglecompleted",
    "dblclick label": "edit",
    "click .destroy": "clear",
    "keypress .edit": "updateOnEnter",
    "blur .edit": "close",
    "click #check": "toggleCompleted",
  },
  initialize: function () {
    this.listenTo(this.model, "change", this.render);
    this.listenTo(this.model, "destroy", this.remove);
  },
  render: function () {
    this.$el.html(this.template(this.model.toJSON()));
    this.$el.toggleClass("completed", this.model.get("completed"));
    this.$input = this.$(".edit");

    return this;
  },
  edit: function () {
    this.$el.addClass("editing");
    this.$input.focus();
  },
  close: function () {
    let value = this.$input.val().trim();
    if (value) {
      this.model.save({ title: value });
    }
    this.$el.removeClass("editing");
  },
  updateOnEnter: function (e) {
    if (e.which === ENTER_KEY) {
      this.close();
    }
  },
  togglecompleted: function () {
    this.model.toggle();
  },
  clear: function () {
    this.model.destroy();
  },
});
