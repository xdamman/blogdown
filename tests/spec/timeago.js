var timeago = require('timeago');
var container = document.createElement("div");
var ago = function(number, unit) {
  var date = new Date();
  switch(unit) {
    case 'hour':
    case 'hours':
      date.setHours(date.getHours() - number);
      break;

    case 'day':
    case 'days':
      date.setDate(date.getDate() - number);
      break;

    case 'month':
    case 'months':
      date.setMonth(date.getMonth() - number);
      break;
  }
  return date;
};

describe("timeago", function() {

  it("Returns the relative time", function() {
    expect(timeago.fromNow(ago(1,'hour'))).to.equal("an hour ago");
    expect(timeago.fromNow(ago(2,'months'))).to.equal("2 months ago");
  });

  it("Returns the full date for old dates", function() {
    var date = new Date();
    date.setMonth(8);
    date.setDate(24);
    date.setYear(2012);
    expect(timeago.fromNow(date)).to.equal("September 24, 2012");
  });

  it("Replaces dom elements with class .timeago with the relative time", function() {

    var span = document.createElement('span');
    span.className = 'timeago';
    span.dataset.date = ago(1,'month');
    container.appendChild(span);

    timeago({ class: "timeago", context: container });

    expect(span.innerText).to.equal("a month ago");

    console.log(span.innerHTML);

  });

});
