import { Auth, Logger } from 'aws-amplify';

const logger = new Logger('checkLoggedIn');

const checkLoggedIn = () => {
  return new Promise((resolve, reject) => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        if (user) {
          resolve(true, user);
        } else {
          resolve(false, {});
        }
      })
      .catch((err) => {
        logger.error(err);

        reject(false, {});
      });
  });
};

export default checkLoggedIn;
