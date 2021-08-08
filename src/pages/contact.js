import { useState } from 'react';
import styles from '../styles/Page.module.css';

import PageLayout from '../components/pageLayout';

export default function Page() {
  const [messageType, setMessageType] = useState(null);

  const changeMessageType = (e) => {
    setMessageType(e.currentTarget.value);
  };

  return (
    <PageLayout
      title="Get in touch with me"
      hideContent={true}
      showHero={false}
      loadingState={false}
      darkMain={false}
    >
      <div>
        <div className={styles['flex-grid']}>
          <div className={styles.col} style={{ width: '66.66%' }}>
            <h1>Send me a message</h1>
            <p>
              I'm looking forward to hearing from you (as long as you're not a
              spammer xD)!
            </p>
            <p>
              Plase fill in the form below to send me a message, alternatively,
              you can send me a message via one of these social networks:
            </p>
            <div id="OpeningContentSocial">
              <a
                target="_blank"
                href="https://github.com/nicholasgriffintn"
                rel="noopener"
                title="Github"
                className={styles['social-icon-wrap']}
                id="GithubLinkWrap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M256 0C115.39 0 0 115.39 0 256c0 119.988 84.195 228.984 196 256v-84.695c-11.078 2.425-21.273 2.496-32.55-.828-15.13-4.465-27.423-14.543-36.548-29.91-5.816-9.813-16.125-20.454-26.879-19.672l-2.636-29.883c23.254-1.992 43.37 14.168 55.312 34.23 5.305 8.922 11.41 14.153 19.246 16.465 7.575 2.23 15.707 1.16 25.184-2.187 2.379-18.973 11.07-26.075 17.637-36.075v-.015c-66.68-9.946-93.254-45.32-103.801-73.242-13.977-37.075-6.477-83.391 18.238-112.66.48-.571 1.348-2.063 1.012-3.106-11.332-34.23 2.476-62.547 2.984-65.55 13.078 3.866 15.203-3.892 56.809 21.386l7.191 4.32c3.008 1.793 2.063.77 5.07.543 17.372-4.719 35.684-7.324 53.727-7.558 18.18.234 36.375 2.84 54.465 7.75l2.328.234c-.203-.031.633-.149 2.035-.984 51.973-31.481 50.106-21.192 64.043-25.723.504 3.008 14.13 31.785 2.918 65.582-1.512 4.656 45.059 47.3 19.246 115.754-10.547 27.933-37.117 63.308-103.797 73.254v.015c8.547 13.028 18.817 19.957 18.762 46.832V512c111.809-27.016 196-136.012 196-256C512 115.39 396.61 0 256 0zm0 0"></path>
                </svg>
              </a>
              <a
                target="_blank"
                href="https://twitter.com/NGriffintn"
                rel="noopener"
                title="Twitter"
                className={styles['social-icon-wrap']}
                id="TwitterLinkWrap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path
                    d="M512 97.248c-19.04 8.352-39.328 13.888-60.48 16.576 21.76-12.992 38.368-33.408 46.176-58.016-20.288 12.096-42.688 20.64-66.56 25.408C411.872 60.704 384.416 48 354.464 48c-58.112 0-104.896 47.168-104.896 104.992 0 8.32.704 16.32 2.432 23.936-87.264-4.256-164.48-46.08-216.352-109.792-9.056 15.712-14.368 33.696-14.368 53.056 0 36.352 18.72 68.576 46.624 87.232-16.864-.32-33.408-5.216-47.424-12.928v1.152c0 51.008 36.384 93.376 84.096 103.136-8.544 2.336-17.856 3.456-27.52 3.456-6.72 0-13.504-.384-19.872-1.792 13.6 41.568 52.192 72.128 98.08 73.12-35.712 27.936-81.056 44.768-130.144 44.768-8.608 0-16.864-.384-25.12-1.44C46.496 446.88 101.6 464 161.024 464c193.152 0 298.752-160 298.752-298.688 0-4.64-.16-9.12-.384-13.568 20.832-14.784 38.336-33.248 52.608-54.496z"
                    fill="#03a9f4"
                  ></path>
                </svg>
              </a>
              <a
                target="_blank"
                href="https://www.linkedin.com/in/nicholasgriffin-gb/"
                rel="noopener"
                title="LinkedIn"
                className={styles['social-icon-wrap']}
                id="LinkedinLinkWrap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 382 382">
                  <path
                    d="M347.445 0H34.555C15.471 0 0 15.471 0 34.555v312.889C0 366.529 15.471 382 34.555 382h312.889C366.529 382 382 366.529 382 347.444V34.555C382 15.471 366.529 0 347.445 0zM118.207 329.844c0 5.554-4.502 10.056-10.056 10.056H65.345c-5.554 0-10.056-4.502-10.056-10.056V150.403c0-5.554 4.502-10.056 10.056-10.056h42.806c5.554 0 10.056 4.502 10.056 10.056v179.441zM86.748 123.432c-22.459 0-40.666-18.207-40.666-40.666S64.289 42.1 86.748 42.1s40.666 18.207 40.666 40.666-18.206 40.666-40.666 40.666zM341.91 330.654a9.247 9.247 0 0 1-9.246 9.246H286.73a9.247 9.247 0 0 1-9.246-9.246v-84.168c0-12.556 3.683-55.021-32.813-55.021-28.309 0-34.051 29.066-35.204 42.11v97.079a9.246 9.246 0 0 1-9.246 9.246h-44.426a9.247 9.247 0 0 1-9.246-9.246V149.593a9.247 9.247 0 0 1 9.246-9.246h44.426a9.247 9.247 0 0 1 9.246 9.246v15.655c10.497-15.753 26.097-27.912 59.312-27.912 73.552 0 73.131 68.716 73.131 106.472v86.846z"
                    fill="#0077b7"
                  ></path>
                </svg>
              </a>
            </div>
            <hr></hr>
            <form
              style={{ maxWidth: '780px', width: '100%' }}
              lang="en"
              spellcheck="false"
              action="https://fieldgoal.io/f/WUAezO"
              method="POST"
              enctype="multipart/form-data"
            >
              <div>
                <label>Your Name (Required)</label>
                <input
                  placeholder="Enter your first and last name"
                  type="text"
                  name="name"
                  required
                />
              </div>
              <div>
                <label>Your Email (Required)</label>
                <input
                  placeholder="Enter your email address"
                  type="email"
                  name="email"
                  required
                />
              </div>
              <div>
                <fieldset>
                  <legend>
                    How would you like to send a message? (Required)
                  </legend>
                  <div>
                    <input
                      type="radio"
                      id="text"
                      name="message_type"
                      value="text"
                      onChange={(e) => changeMessageType(e)}
                    />
                    <label for="text">Text</label>
                  </div>
                  {/* <div>
                    <input
                      type="radio"
                      id="voice"
                      name="message_type"
                      value="voice"
                      onChange={(e) => changeMessageType(e)}
                    />
                    <label for="voice">Voice</label>
                  </div> */}
                  <div>
                    <input
                      type="radio"
                      id="upload"
                      name="message_type"
                      value="upload"
                      onChange={(e) => changeMessageType(e)}
                    />
                    <label for="upload">Upload</label>
                  </div>
                </fieldset>
              </div>
              {messageType === 'text' ? (
                <div>
                  <label>Your Message: </label>
                  <textarea
                    type="message"
                    name="message"
                    rows="6"
                    required
                    placeholder="Enter your message here..."
                  ></textarea>
                </div>
              ) : messageType === 'upload' ? (
                <div>
                  <label>Upload your message:</label>
                  <input
                    type="file"
                    name="uploaded_message"
                    accept=".pdf,.doc,.txt,.jpg,.jpeg,.docx,.png,.mp3,.mp4"
                    required
                  />
                  <br></br>
                  <br></br>
                  <small>
                    Allowed file extensions are:
                    pdf,doc,txt,jpg,jpeg,docx,png,mp3,mp4
                  </small>
                  <br></br>
                  <small>The max file size allowed is: 25MB</small>
                </div>
              ) : null}
              <div style={{ marginTop: '15px' }}>
                <button
                  disabled={!messageType}
                  className="button button-prime"
                  type="submit"
                >
                  Submit your message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
