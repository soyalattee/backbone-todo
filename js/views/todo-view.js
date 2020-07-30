var app = app || {};
var ENTER_KEY = 13;

app.TodoView = Backbone.View.extend({
  tagName: "li",
  template: _.template($("#item-template").html()),
  events: {
    "dblclick label": "edit",
    "keypress .edit": "updateOnEnter",
    "blur .edit": "close",
  },
  initialize: function () {
    this.listenTo(this.HTMLModElement, "change", this.render);
  },
  render: function () {
    this.$el.html(this.template(this.model.toJSON()));
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
  updateOnEnter: (e) => {
    if (e.which === ENTER_KEY) {
      this.close();
    }
  },
});
