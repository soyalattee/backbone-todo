"use strict";

var app = app || {};

var TodoList = Backbone.Collection.extend({
  model: app.Todo,
  localStorage: new Backbone.LocalStorage("todos-backbone"),
  completed: function () {
    return this.filter((todo) => todo.get("completed"));
  },
  remaining: function () {
    return this.filter((todo) => !todo.get("completed"));
  },
  nextOrder: function () {
    if (!this.lenght) {
      return 1;
    }
    return this.last().get("order") + 1;
  },
  comparator: function (todo) {
    return todo.get("order");
  },
});

app.Todos = new TodoList();
