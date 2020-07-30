"use strict";
var app = app || {};

app.Todo = Backbone.Model.extend({
  defaults: {
    content: "",
    completed: false,
  },

  //completed 상태 업그레이드
  toggle: function () {
    this.save({
      completed: !this.get("completed"),
    });
  },
});
