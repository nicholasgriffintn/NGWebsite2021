// Sourced from AVIF: https://avif.io/blog/tutorials/use-avif-in-nextjs/

function F(a) {
  document.documentElement.classList.add(a);
}
var A = new Image();
(A.src =
  'data:image/avif;base64,AAAAFGZ0eXBhdmlmAAAAAG1pZjEAAACgbWV0YQAAAAAAAAAOcGl0bQAAAAAAAQAAAB5pbG9jAAAAAEQAAAEAAQAAAAEAAAC8AAAAGwAAACNpaW5mAAAAAAABAAAAFWluZmUCAAAAAAEAAGF2MDEAAAAARWlwcnAAAAAoaXBjbwAAABRpc3BlAAAAAAAAAAQAAAAEAAAADGF2MUOBAAAAAAAAFWlwbWEAAAAAAAAAAQABAgECAAAAI21kYXQSAAoIP8R8hAQ0BUAyDWeeUy0JG+QAACANEkA='),
  (A.onload = function () {
    F('avif');
  }),
  (A.onerror = function () {
    var a = new Image();
    (a.src =
      'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA=='),
      (a.onload = function () {
        F('webp');
      });
  });
