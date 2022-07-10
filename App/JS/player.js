function getAudio() {
  const input = document.querySelector('input');
  const audio = document.querySelector('audio');
  input.click();
  input.type = 'file';
  input.onchange = e => {
    var file = e.target.files[0];

    var reader = new FileReader();
    reader.addEventListener('load', function(e) {
      audio.src = e.target.result;
      audio.loop = true;
      audio.play();
    });
    reader.readAsDataURL(file);
  }
}
$(document).ready(function (){
    $(".button1").click(function (){
        document.querySelector("audio").src = "Audio/1.mp3";
        document.querySelector("audio").loop = true;
        document.querySelector("audio").play();
    });
    $(".button2").click(function (){
        document.querySelector("audio").src = "Audio/2.mp3";
        document.querySelector("audio").loop = true;
        document.querySelector("audio").play();
    });
    $(".button3").click(function (){
        document.querySelector("audio").src = "Audio/3.mp3";
        document.querySelector("audio").loop = true;
        document.querySelector("audio").play();
    });
    $(".button4").click(function (){
       getAudio();
    });
});
