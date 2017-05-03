var heredoc = require('heredoc')

var str = heredoc(function () {/*
    within this comment block,
    any text
    will
      be
        treated
          as
      pre-formatted
   (kinda like html <pre>)
    */})
console.log(str)
