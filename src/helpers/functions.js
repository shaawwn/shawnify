
function isAlphaNumeric(str) {
  var code, i, len;

  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
    if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
      return false;
    }
  }
  return true;
};

function truncateText(text) {
// if text > certain length, replace with ellipsis
// console.log("TRAUNCATED", text)


let charLimit = 30
if(isAlphaNumeric(text) === false) {
  // check for english text, since non-english might be different sizes
  charLimit = 20
}
if(text.split("").length > charLimit) {
    return text.substring(0, charLimit) + '...'
} 
return text
}

function msToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);

    return (
        seconds == 60 ?
        (minutes+1) + ":00" :
        minutes + ":" + (seconds < 10 ? "0" : "") + seconds
      );
    // return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  function printSongDetails(data) {
    console.log("SONG DETAILS -->>")
    console.log('song name:', data.item.name)
    console.log('album:', data.item.album)
    console.log('artist: ', data.item.artists[0].name)
    console.log('song data: ', data)
    console.log('time left', data.item.duration_ms - data.progress_ms)
    console.log('shuffle state', data.shuffle_state)
    console.log('repeat state', data.repeat_state)
    console.log('is playing', data.is_playing)
  
  }
  
module.exports = {
    truncateText,
    msToMinutesAndSeconds,
    printSongDetails
}