const Spotify = (req, res) => {
  fetch(
    'https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=NGriiffin&api_key=c91dd1f9b8fcf710e36a2a48c6c493a8&limit=10&format=json',
    {
      method: 'GET',
      headers: {
        'User-Agent': 'Nicholas-Griffin-App',
      },
    }
  )
    .then((json) => {
      return json.json();
    })
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ status: 'Error' });
    });
};
export default Spotify;
