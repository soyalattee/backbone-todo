"use strict";
var app = app || {};
/**
 * app- view
 */

app.AppView = Backbone.View.extend({
  el: "#todoapp",
  statsTemplate: _.template($("#stats-template").html()), //  handlebar로변경하기

  events: {
    "keypress #new-todo": "createTodo",
    "click #submit": "createTodo",
    "click #clear-completed": "clearCompleted",
  },
  initialize: function () {
    //console.log(this.el);
    this.allCheckbox = this.$("#toggle-all")[0];
    this.$input = this.$("#new-todo");
    this.footer = this.$("#footer");
    this.main = this.$("#main");

    this.listenTo(app.Todos, "add", this.addTodoView);
    this.listenTo(app.Todos, "reset", this.addAll);
    this.listenTo(app.Todos, "change:completed", this.changeCompleted);
    this.listenTo(app.Todos, "all", this.render);
    console.log(app.Todos);
    app.Todos.fetch();
  },

  render: function () {
    let completed = app.Todos.completed().length;
    let remaining = app.Todos.remaining().length;
    let dateView = new app.DateView();
    $("#js-date").empty(); // 왼쪽으로 움직인다. 새로고침시. init에서 해도 같은 현상
    $("#js-date").append(dateView.render().el);
    if (app.Todos.length) {
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
      this.footer.hide();
    }
  },
  changeCompleted: function (todo) {
    $("#todo-list").empty();
    $("#done-list").empty();
    this.addAll(todo);
  },
  //todo 모델 뷰 추가
  addTodoView: function (todo) {
    let view = new app.TodoView({ model: todo });
    if (todo.get("completed")) {
      $("#done-list").append(view.render().el);
    } else {
      console.log("추가");
      $("#todo-list").append(view.render().el);
    }
  },
  //Todos collections의 목록 한번에 모두 추가
  addAll: function () {
    this.$("#todo-list").html("");
    app.Todos.each(this.addTodoView, this);
  },
  //새로운 todo 추가&저장
  createTodo: function (event) {
    if (
      (event.which === ENTER_KEY || event.which === CLICK_EVENT) &&
      this.$input.val().trim()
    ) {
      //model 객체 생성, collection 에 추가
      app.Todos.create({
        title: this.$input.val().trim(),
        order: app.Todos.nextOrder(),
        completed: false,
      });
      this.$input.val("");
    } else {
      return;
    }
  },
  //완료된 todo 삭제
  clearCompleted: function () {
    _.invoke(app.Todos.completed(), "destroy");
    return false;
  },
});
