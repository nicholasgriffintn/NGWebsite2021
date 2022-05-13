import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from '../styles/Page.module.css';
import { useForm } from 'react-hook-form';
import PageLayout from '../components/pageLayout';
import { useAppContext } from '../context/store';
import HCaptcha from '@hcaptcha/react-hcaptcha';

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

export default function Page() {
  const { logger } = useAppContext();

  const [messageType, setMessageType] = useState(null);

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(null);
  const [formError, setFormError] = useState(null);

  const [token, setToken] = useState(null);
  const captchaRef = useRef(null);

  const [upload, setUpload] = useState(null);
  const uploadRef = useRef(null);

  const [thanksImage, setThanksImage] = useState(null);

  useEffect(() => {
    const giphy = {
      baseURL: 'https://api.giphy.com/v1/gifs/',
      apiKey: '0UTRbFtkMxAplrohufYco5IY74U8hOes',
      tag: 'thanks',
      type: 'random',
      rating: 'pg-13',
    };

    let giphyURL = encodeURI(
      giphy.baseURL +
        giphy.type +
        '?api_key=' +
        giphy.apiKey +
        '&tag=' +
        giphy.tag +
        '&rating=' +
        giphy.rating
    );

    fetch(giphyURL)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          if (data.data.images && data.data.images.downsized_large) {
            setThanksImage(data.data.images.downsized_large.url);
          } else if (data.data.image_original_url) {
            setThanksImage(data.data.image_original_url);
          }
        }
      })
      .catch((err) => logger.error(err));
  }, [setThanksImage, logger]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      message_type: 'text',
    },
  });

  const onExpire = () => {
    setFormError('hCaptcha Token Expired');
  };

  const onError = (err) => {
    setFormError(`hCaptcha Error: ${err}`);
  };

  const uploadTheFile = (file) => {
    return new Promise(async (resolve, reject) => {
      const reader = new FileReader();

      reader.addEventListener('loadend', async (e) => {
        await fetch('https://upload.nicholasgriffin.dev/signed', {
          method: 'POST',
          body: JSON.stringify({
            name: uuidv4() + '.' + file.name.split('.').pop(),
            type: file.type,
          }),
        })
          .then(async (response) => {
            if (response.ok) {
              return response.json();
            } else {
              const errorResponse = await response.json();
              reject(
                JSON.stringify({
                  message: errorResponse?.message,
                  info: errorResponse?.info,
                })
              );
            }
          })
          .then(async (result) => {
            if (result && result.uploadURL) {
              await fetch(result.uploadURL, {
                method: 'PUT',
                body: new Blob([reader.result, { type: file.type }]),
              })
                .then((s3Result) => {
                  logger.debug('Upload Success:', result);
                  setUpload(
                    s3Result.url ||
                      `https://s3.amazonaws.com/uploads.nicholasgriffin.dev/${file.name}`
                  );
                  resolve(result);
                })
                .catch((error) => {
                  logger.error('Upload Error:', error);
                  reject(error);
                });
            } else {
              logger.error('Upload Error:', result);
              reject(result);
            }
          })
          .catch((error) => {
            logger.error('Upload Error:', error);
            reject(error);
          });
      });

      reader.readAsArrayBuffer(file);
    });
  };

  const submitTheMessage = (data, token) => {
    return new Promise(async (resolve, reject) => {
      fetch('https://forms.nicholasgriffin.dev/submit', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          uploaded_message: '',
          captcha: token,
          upload,
        }),
      })
        .then(async (response) => {
          if (response.ok) {
            return response.json();
          } else {
            const errorResponse = await response.json();
            const error = JSON.stringify({
              message: errorResponse?.message,
              info: errorResponse?.info,
            });

            setFormError(error);
            setFormSubmitting(false);
            reject(error);
          }
        })
        .then((result) => {
          logger.debug('Form Success:', result);
          setFormSuccess(result);
          setFormSubmitting(false);
          resolve(result);
        })
        .catch((error) => {
          logger.error('Form Error:', error);
          setFormError(error);
          setFormSubmitting(false);
          reject(error);
        });
    });
  };

  const onSubmit = async (data) => {
    setFormSubmitting(true);

    captchaRef.current.execute();

    let file = '';

    if (!token) {
      setFormError('No capatcha token was provided.');

      return;
    }

    if (messageType === 'upload') {
      if (!data.uploaded_message > 0) {
        setFormError('No file was found from the data.');
        setFormSubmitting(false);

        return;
      }

      file = data.uploaded_message[0];

      if (!file || !file.type || !file.name) {
        setFormError('No data was found from the file.');
        setFormSubmitting(false);

        return;
      }

      await uploadTheFile(file);
    }

    await submitTheMessage(data, token);

    return 'Done :)';
  };

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
      <div className="standard-page-content">
        <div className={styles['flex-grid']}>
          <div
            className={styles.col}
            style={{ maxWidth: '980px', width: '100%', margin: '0 auto' }}
          >
            <h1>Send me a message</h1>
            <p>
              I&apos;m looking forward to hearing from you (as long as
              you&apos;re not a spammer 😅)!
            </p>
            <p>
              Please fill in the form below to send me a message, alternatively,
              you can send me a message via one of the social networks below.
            </p>
            <p>
              If you are a recruiter then please head on over to LinkedIn
              instead where you may be ignored 🥸.
            </p>
            <div id="OpeningContentSocial">
              <a
                target="_blank"
                href="https://github.com/nicholasgriffintn"
                rel="noopener noreferrer"
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
                href="https://twitter.com/ngriffin_uk"
                rel="noopener noreferrer"
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
                rel="noopener noreferrer"
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
            <small>
              Fancy sending me a text? Try out my automated service here (you
              can even try sending me a fax if that still works...):{' '}
              <a href="tel:+447380327714">+44 7380 327714</a>.
            </small>
            <hr></hr>
            {formSuccess ? (
              <>
                <div
                  style={{
                    textAlign: 'left',
                    maxWidth: '100%',
                    height: 'auto',
                    position: 'relative',
                    minHeight: '220px',
                    marginBottom: '20px',
                  }}
                >
                  {thanksImage ? (
                    <Image
                      style={{
                        maxWidth: '780px',
                        margin: '0 auto',
                        height: 'auto',
                      }}
                      src={thanksImage}
                      alt="Thanks"
                      layout="fill"
                      quality={80}
                      objectFit="cover"
                    />
                  ) : null}
                </div>
                <h3>Thanks for getting in touch!</h3>
                <p>
                  If your message isn&apos;t SPAM and requires a response, I
                  will get back to you soon!
                </p>
              </>
            ) : (
              <>
                {formError ? (
                  <p>
                    An error occured while attempting to submit the message.
                  </p>
                ) : null}
                <form
                  style={{ maxWidth: '780px', width: '100%' }}
                  lang="en"
                  spellCheck="false"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div>
                    <label>Your Name (Required)</label>
                    <input
                      placeholder="Enter your first and last name"
                      type="text"
                      name="name"
                      required
                      {...register('name')}
                      aria-invalid={errors.name ? 'true' : 'false'}
                    />
                    {errors.name && (
                      <span role="alert">This field is required</span>
                    )}
                  </div>
                  <div>
                    <label>Your Email (Required)</label>
                    <input
                      placeholder="Enter your email address"
                      type="email"
                      name="email"
                      required
                      {...register('email')}
                      aria-invalid={errors.email ? 'true' : 'false'}
                    />
                    {errors.email && (
                      <span role="alert">This field is required</span>
                    )}
                  </div>
                  <div>
                    <label>
                      What&apos;s the reason for your message? (Required)
                    </label>
                    <input
                      type="text"
                      placeholder="Please enter the reason for your message"
                      name="subject"
                      required
                      {...register('subject')}
                      aria-invalid={errors.subject ? 'true' : 'false'}
                    />
                    {errors.subject && (
                      <span role="alert">This field is required</span>
                    )}
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
                        <label htmlFor="text">Text</label>
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
                        <label htmlFor="upload">Upload</label>
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
                        {...register('message')}
                        aria-invalid={errors.message ? 'true' : 'false'}
                      ></textarea>
                      {errors.message && (
                        <span role="alert">This field is required</span>
                      )}
                    </div>
                  ) : messageType === 'upload' ? (
                    <div>
                      <label>Upload your message:</label>
                      <input
                        ref={uploadRef}
                        type="file"
                        name="uploaded_message"
                        accept=".pdf,.doc,.txt,.jpg,.jpeg,.docx,.png,.mp3,.mp4"
                        {...register('uploaded_message')}
                        required
                        aria-invalid={
                          errors.uploaded_message ? 'true' : 'false'
                        }
                      />
                      <br></br>
                      <br></br>
                      <small>
                        Allowed file extensions are:
                        pdf,doc,txt,jpg,jpeg,docx,png,mp3,mp4
                      </small>
                      <br></br>
                      <small>The max file size allowed is: 25MB</small>
                      {errors.uploaded_message && (
                        <span role="alert">This field is required</span>
                      )}
                    </div>
                  ) : null}
                  <div>
                    <input
                      placeholder="Anything else?"
                      name="honey"
                      hidden
                      {...register('honey')}
                    />
                  </div>
                  <div style={{ marginTop: '15px' }}>
                    <HCaptcha
                      sitekey="05004ce1-3dd0-4f25-923d-7146a9f6861f"
                      onVerify={setToken}
                      onError={onError}
                      onExpire={onExpire}
                      ref={captchaRef}
                      size="compact"
                      theme="dark"
                    />
                  </div>
                  <div style={{ marginTop: '15px' }}>
                    {isSubmitting || formSubmitting ? (
                      <p>Please wait while I submit your message...</p>
                    ) : null}
                    <button
                      disabled={
                        !token || !messageType || isSubmitting || formSubmitting
                      }
                      className="button button-prime"
                      type="submit"
                    >
                      Submit your message
                    </button>
                  </div>
                </form>
                <hr></hr>
                <small>
                  If you prefer email clients over forms you can send me a
                  message{' '}
                  <a href="javascript:window.location.href=atob('bWFpbHRvOmluYm94QG5pY2hvbGFzZ3JpZmZpbi5kZXY')">
                    here
                  </a>
                  .
                </small>
              </>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
