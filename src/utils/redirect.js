import Router from 'next/router';

const redirect = (context, target) => {
  if (context && context.res) {
    context.res.writeHead(303, { Location: target });
    context.res.end();
  } else {
    Router.replace(target);
  }
};

export default redirect;
