"use strict";
// todo 가 편집 혹은 작성 되었을때 뷰의 갱신을 보장해주는 todo 개별 레코드를 담당
var app = app || {};

app.TodoView = Backbone.View.extend({
  tagName: "li",
  template: _.template($("#item-template".html())),
  events: {
    "dblclick label": "edit",
    "keypress .edit": "updateOnEnter",
    "blur .edit": "close",
  },
  initialize: () => {
    this.listenTo(this.HTMLModElement, "change", this.render);
  },
  render: () => {
    this.$el.addClass("editing");
    this.$input.focusS();
  },
  edit: () => {
    this.$el.addClass("editing");
    this.$input.focus();
  },
  close: () => {
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
