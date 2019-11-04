function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}

// compareDate: function (startDate, endDate) {
//   var arrStart = startDate.split("-");
//   var startTime = new Date(arrStart[0], arrStart[1], arrStart[2]);
//   var startTimes = startTime.getTime();
//   var arrEnd = endDate.split("-");
//   var endTime = new Date(arrEnd[0], arrEnd[1], arrEnd[2]);
//   var endTimes = endTime.getTime();
//   if (endTimes < startTimes) {
//     return false;
//   }
//   return true;
// }