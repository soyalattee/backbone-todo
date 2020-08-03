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
    this.listenTo(this.model, "visible", this.toggleVisible);
  },
  render: function () {
    this.$el.html(this.template(this.model.toJSON()));
    this.$el.toggleClass("completed", this.model.get("completed"));
    this.toggleVisible();
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
  //항복을 보여주거나 숨길 수 있게 됨
  toggleVisible: function () {
    this.$el.toggleClass("hidden", this.isHidden());
  },
  isHidden: function () {
    let isCompleted = this.model.get("completed");
    return (
      (!isCompleted && app.TodoFilter == "completed") ||
      (isCompleted && app.TodoFilter === "active")
    );
  },
  toggleCompleted: function () {
    this.remove(); //현재 뷰를 제거한다.
  },
  clear: function () {
    this.model.destroy();
  },
});
