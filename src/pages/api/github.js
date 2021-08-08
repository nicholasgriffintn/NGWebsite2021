// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const pkg = require('../../../package.json');

export default (req, res) => {
  fetch(
    'https://api.github.com/users/nicholasgriffintn/repos?sort=updated&type=public&per_page=8',
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
