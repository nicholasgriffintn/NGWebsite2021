import styles from '../styles/Page.module.css';

import PageLayout from '../components/pageLayout';

export default function Page() {
  return (
    <PageLayout title="Get in touch with me">
      <div>
        <div className={styles['flex-grid']}>
          <div className={styles.col} style={{ width: '66.66%' }}>
            <strong>Enter your details below to send me a message:</strong>
            <form
              name="contact"
              method="POST"
              netlify-honeypot="bot-field"
              data-netlify-recaptcha="true"
              data-netlify="true"
            >
              <p>
                <label>
                  Name: <input type="text" name="name" />
                </label>
              </p>
              <p>
                <label>
                  Email: <input type="email" name="email" />
                </label>
              </p>
              <p>
                <label>
                  Message: <textarea type="message" name="message"></textarea>
                </label>
              </p>
              <p>
                <div data-netlify-recaptcha="true"></div>
              </p>
              <p class="hidden">
                <label>
                  Don’t fill this out if you’re human:{' '}
                  <input name="bot-field" />
                </label>
              </p>
              <p>
                <button type="submit">Send</button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
