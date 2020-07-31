"use strict";
var app = app || {};
/**
 * app- view
 */

app.AppView = Backbone.View.extend({
  el: "#todoapp",
  statsTemplate: _.template($("#stats-template").html()), //  handlebar로변경하기

  events: {
    "keypress #new-todo": "createOnEnter",
    "click #submit": "createOnSubmit",
    "click #clear-completed": "clearCompleted",
    "click #toggle-all": "toggleAllComplete",
  },
  initialize: function () {
    // console.log(this.el);
    this.allCheckbox = this.$("#toggle-all")[0];
    this.$input = this.$("#new-todo");
    this.footer = this.$("#footer");
    this.main = this.$("#main");

    this.listenTo(app.Todos, "add", this.addOne);
    this.listenTo(app.Todos, "reset", this.addAll);
    this.listenTo(app.Todos, "change:completed", this.addOne);
    this.listenTo(app.Todos, "filter", this.filterAll);
    this.listenTo(app.Todos, "all", this.render);
    //console.log(app.Todos);
    app.Todos.fetch();
  },

  render: function () {
    let completed = app.Todos.completed().length;
    let remaining = app.Todos.remaining().length;

    if (app.Todos.length) {
      this.main.show();
      this.footer.show();
      this.footer.html(
        this.statsTemplate({
          completed: completed,
          remaining: remaining,
        })
      );
      this.$("#filters li a")
        .removeClass("selected")
        .filter('[href="#/' + (app.TodoFilter || "") + '"]')
        .addClass("selected");
    } else {
      this.main.hide();
      this.footer.hide();
    }
    this.allCheckbox.checked = !remaining;
  },
  //todo 하나 추가
  addOne: function (todo) {
    let view = new app.TodoView({ model: todo });
    if (todo.get("completed")) {
      $("#done-list").append(view.render().el);
    } else {
      $("#todo-list").append(view.render().el);
    }
  },
  //Todos collections의 목록 한번에 모두 추가
  addAll: function () {
    this.$("#todo-list").html("");
    app.Todos.each(this.addOne, this);
  },
  filterOne: function (todo) {
    todo.trigger("visible");
  },
  filterAll: function () {
    app.Todos.each(this.filterOne, this);
  },
  //새로운 todo 항목을 위한 속성 생성
  newAttributes: function () {
    return {
      title: this.$input.val().trim(),
      order: app.Todos.nextOrder(),
      completed: false,
    };
  },
  //새로운 todo 추가&저장
  createOnEnter: function (event) {
    if (event.which != ENTER_KEY || !this.$input.val().trim()) {
      return;
    }
    app.Todos.create(this.newAttributes());
    this.$input.val("");
  },
  createOnSubmit: function (event) {
    if (!this.$input.val().trim()) {
      return;
    }
    app.Todos.create(this.newAttributes());
    this.$input.val("");
  },
  //완료된 todo 삭제
  clearCompleted: function () {
    _.invoke(app.Todos.completed(), "destroy");
    return false;
  },
  //모든 항목의 체크박스를 완료로 토글 시킨다.
  toggleAllComplete: function () {
    let completed = this.allCheckbox.checked;

    app.Todos.each((todo) => {
      todo.save({
        completed: completed,
      });
    });
  },
});
