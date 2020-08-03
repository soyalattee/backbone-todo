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
    this.listenTo(app.Todos, "change:completed", this.changeCompleted);
    this.listenTo(app.Todos, "filter", this.filterAll);
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
  //completed 값이 변화되면 기존위치가 아닌곳으로 옮겨줌
  changeCompleted: function (todo) {
    console.log("checked app-view");
    this.addOne(todo);
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
