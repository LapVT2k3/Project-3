"use strict";

class DatePicker {
  constructor(id, callback) {
    this.id = id;
    this.callback = callback;
    this.curYear = 0;
    this.curMonth = 0;
    this.daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    this.months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
  }

  render(date) {
    const tbl = document.createElement("table");
    tbl.style.width = "300px";
    tbl.style.border = "1px solid black";
    tbl.style.borderRadius = "10px";

    // First Row
    const info = tbl.insertRow();

    const back = info.insertCell();
    back.innerHTML = "&lt;";
    DatePicker.styleDirection(back);

    const time = info.insertCell();
    time.colSpan = 5;
    time.style.height = "40px";
    time.style.fontSize = "26px";
    time.style.fontWeight = "bold";
    time.style.textAlign = "center";
    time.style.fontSize = "30px";

    const next = info.insertCell();
    next.innerHTML = "&gt;";
    DatePicker.styleDirection(next);

    // Second row: show weekdays
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const tr = tbl.insertRow();
    for (let j = 0; j < 7; j++) {
      const td = tr.insertCell();
      td.appendChild(document.createTextNode(weekDays[j]));
      DatePicker.styleWeekday(td);
    }

    // Show calendar
    const dateIn = new Date(date);
    this.curYear = dateIn.getFullYear();
    this.curMonth = dateIn.getMonth();

    this.renderCalendar(tbl);

    back.addEventListener("click", () => this.handleNavigation(tbl, -1));
    next.addEventListener("click", () => this.handleNavigation(tbl, 1));

    const elem = document.getElementById(this.id);
    elem.appendChild(tbl);
  }

  static styleDirection(cell) {
    cell.style.fontWeight = "bold";
    cell.style.textAlign = "center";
    cell.style.cursor = "pointer";
    cell.style.fontSize = "30px";
    cell.style.borderRadius = "50%";
    cell.addEventListener("mouseover", function () {
      cell.style.backgroundColor = "#f2f2f2";
    });
    cell.addEventListener("mouseout", function () {
      cell.style.backgroundColor = "";
    });
  }

  static styleWeekday(cell) {
    cell.style.width = "14%";
    cell.style.fontWeight = "bold";
    cell.style.textAlign = "center";
  }

  static styleDay(cell, isToday) {
    cell.style.height = "40px";
    cell.style.borderRadius = "50%";
    cell.style.textAlign = "center";
    cell.style.cursor = "pointer";
    if (!isToday) {
      cell.addEventListener("mouseover", function () {
        cell.style.backgroundColor = "#f2f2f2";
      });
      cell.addEventListener("mouseout", function () {
        cell.style.backgroundColor = "";
      });
    }
  }

  renderCalendar(tbl) {
    const self = this;
    const { curMonth, curYear } = this;

    function handleCellClick(id, x, firstDayofMonth) {
      self.callback(id, {
        day: x - firstDayofMonth + 1,
        month: curMonth,
        year: curYear,
      });
    }

    const time = tbl.rows[0].cells[1];

    time.textContent = `${this.months[curMonth]} ${curYear}`;

    const firstDayofMonth = new Date(curYear, curMonth, 1).getDay();
    const lastDateOfMonth = new Date(curYear, curMonth + 1, 0).getDate();
    const lastDayofMonth = new Date(
      curYear,
      curMonth,
      lastDateOfMonth,
    ).getDay();
    const lastDateOfLastMonth = new Date(curYear, curMonth, 0).getDate();
    const timeNow = new Date();

    let tr_day = tbl.insertRow();
    let i = 0;
    while (i < firstDayofMonth + lastDateOfMonth + 6 - lastDayofMonth) {
      const td = tr_day.insertCell();
      td.id = "C" + i;
      const isToday =
        i - firstDayofMonth + 1 === timeNow.getDate() &&
        curMonth === timeNow.getMonth() &&
        curYear === timeNow.getFullYear();
      if (i < firstDayofMonth) {
        td.appendChild(
          document.createTextNode(
            lastDateOfLastMonth - firstDayofMonth + i + 1,
          ),
        );
        td.style.color = "#aaa";
      } else if (i < firstDayofMonth + lastDateOfMonth) {
        const x = i;
        td.appendChild(document.createTextNode(i - firstDayofMonth + 1));
        if (isToday) {
          td.style.backgroundColor = "#9b59b6";
        }
        td.addEventListener("click", function () {
          handleCellClick(td.id, x, firstDayofMonth);
        });
      } else {
        td.appendChild(
          document.createTextNode(i - lastDateOfMonth - firstDayofMonth + 1),
        );
        td.style.color = "#aaa";
      }
      DatePicker.styleDay(td, isToday);
      i++;
      if (i % 7 === 0) {
        tr_day = tbl.insertRow();
      }
    }
  }

  handleNavigation(tbl, direction) {
    const numRows = tbl.rows.length - 2;
    for (let i = 1; i <= numRows; i++) {
      tbl.deleteRow(2);
    }
    this.curMonth += direction;
    if (this.curMonth < 0) {
      this.curYear--;
      this.curMonth += 12;
    } else if (this.curMonth > 11) {
      this.curYear++;
      this.curMonth -= 12;
    }
    this.renderCalendar(tbl);
  }
}
