var app = app || {};

app.DateView = Backbone.View.extend({
  tagName: "div",
  template: _.template($("#date-template").html()),
  render: function () {
    const today = new Date();
    const date = this.getDate(today);
    const day = this.getDay(today);

    this.$el.html(
      this.template({
        date,
        day,
      })
    );
    return this;
  },
  getDate: function (today) {
    const month = today.getMonth();
    const date = today.getDate();
    return (
      (month < 10 ? `0` + month : month) +
      `월 ` +
      (date < 10 ? `0` + date : date) +
      `일`
    );
  },
  getDay: function (today) {
    const days = [
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
      "일요일",
    ];
    const day = today.getDay();
    return days[day];
  },
});
