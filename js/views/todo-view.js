var app = app || {};
var ENTER_KEY = 13;

/**
 * app -model todo
 *
 */
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
/**
 * app- collections
 */
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
    if (!this.length) {
      return 1;
    }
    return this.last().get("order") + 1;
  },
  comparator: function (todo) {
    return todo.get("order");
  },
});

app.Todos = new TodoList();
/**
 * app- view
 */

app.AppView = Backbone.View.extend({
  el: "#todoapp",
  statsTemplate: _.template($("#stats-template").html()), //  handlebar로변경하기

  events: {
    "keypress #new-todo": "createOnEnter",
    "click #clear-completed": "clearCompleted",
    "click #toggle-all": "toggleAllComplete",
  },
  initialize: function () {
    // console.log(this.el);
    this.allCheckbox = this.$("#toggle-all")[0];
    this.input = this.$("#new-todo");
    this.footer = this.$("#footer");
    this.main = this.$("#main");

    this.listenTo(app.Todos, "add", this.addOne);
    this.listenTo(app.Todos, "reset", this.addAll);
    this.listenTo(app.Todos, "change:completed", this.filterOne);
    this.listenTo(app.Todos, "filter", this.filterAll);
    this.listenTo(app.Todos, "all", this.render);
    console.log(app.Todos);
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
    console.log(this.allCheckbox.checked);
  },
  //todo 하나 추가
  addOne: function (todo) {
    let view = new app.TodoView({ model: todo });
    $("#todo-list").append(view.render().el);
  },
  //Todos collections의 목록 한번에 모두 추가
  addAll: function () {
    this.$("#todo-list").html("");
    app.Todos.each(this.addOne, this);
  },
  filterOne: function () {
    todo.trigger("visible");
  },
  filterAll: function () {
    app.Todos.each(this.filterOne, this);
  },
  //새로운 todo 항목을 위한 속성 생성
  newAttributes: function () {
    return {
      title: this.$input.val().html(),
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

/**
 * todo-view
 */
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

(function () {
  new app.AppView();
})();
