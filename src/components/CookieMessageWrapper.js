import { useAppContext } from '../context/store';

const CookieMessageWrapper = ({ children }) => {
  const { showCookieMessage, setShowCookieMessage, setCookiesAccepted } =
    useAppContext();

  const changeCookiesStatus = (status) => {
    setCookiesAccepted(status === 'accepted' ? '1' : '0');
    setShowCookieMessage('false');
  };

  if (showCookieMessage === 'false') {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <div className="app_cookiesMessage notification">
        <div className="notification__contents">
          <div className="notification__contents_title">
            How do you feel about cookies?
          </div>
          <div className="notification__contents_text">
            <p>
              I&apos;m using cookies for a number of reasons that allow me to
              monitor the performance of the site as well as keep track of any
              bugs.
            </p>
            <p>
              Let me know how you feel about my use of cookies by using one of
              the buttons below.
            </p>
          </div>
          <button
            type="button"
            className="button button-prime"
            onClick={() => changeCookiesStatus('accepted')}
            style={{
              marginRight: '10px',
            }}
          >
            I&apos;m fine with them
          </button>
          <button
            type="button"
            className="button button-prime-inverted"
            onClick={() => changeCookiesStatus('declined')}
            title="Please note that not all cookies can be disabled if you choose this option"
          >
            I&apos;d rather not have them
          </button>
        </div>
      </div>
    </>
  );
};

export default CookieMessageWrapper;
